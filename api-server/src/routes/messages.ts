import { Router } from "express";
import { db } from "@workspace/db";
import { usersTable, messagesTable } from "@workspace/db";
import { eq, and, or, desc, sql } from "drizzle-orm";
import { SendMessageBody } from "@workspace/api-zod";

const router = Router();

async function getUser(username: string) {
  const [user] = await db.select().from(usersTable).where(eq(usersTable.username, username));
  return user;
}

function fiveMinutesAgo() {
  return new Date(Date.now() - 5 * 60 * 1000);
}

router.get("/:username/inbox", async (req, res) => {
  const { username } = req.params;
  const user = await getUser(username);
  if (!user) return res.status(404).json({ error: "User not found" });

  const allMessages = await db
    .select({
      id: messagesTable.id,
      fromId: messagesTable.fromId,
      toId: messagesTable.toId,
      message: messagesTable.message,
      readAt: messagesTable.readAt,
      createdAt: messagesTable.createdAt,
    })
    .from(messagesTable)
    .where(or(eq(messagesTable.fromId, user.id), eq(messagesTable.toId, user.id)))
    .orderBy(desc(messagesTable.createdAt));

  const conversationMap = new Map<
    number,
    { otherId: number; lastMessage: string; lastMessageAt: Date; unreadCount: number }
  >();

  for (const msg of allMessages) {
    const otherId = msg.fromId === user.id ? msg.toId : msg.fromId;
    if (!conversationMap.has(otherId)) {
      conversationMap.set(otherId, {
        otherId,
        lastMessage: msg.message,
        lastMessageAt: msg.createdAt,
        unreadCount: 0,
      });
    }
    if (msg.toId === user.id && !msg.readAt) {
      const conv = conversationMap.get(otherId)!;
      conv.unreadCount++;
    }
  }

  const otherIds = Array.from(conversationMap.keys());
  if (otherIds.length === 0) return res.json([]);

  const otherUsers = await db
    .select()
    .from(usersTable)
    .where(sql`${usersTable.id} = ANY(${sql.raw(`ARRAY[${otherIds.join(",")}]::int[]`)})`);

  const cutoff = fiveMinutesAgo();
  const result = otherUsers.map(u => {
    const conv = conversationMap.get(u.id)!;
    return {
      username: u.username,
      displayName: u.displayName,
      avatarUrl: u.avatarUrl ?? null,
      profileColor: u.profileColor ?? null,
      isOnline: u.lastSeen > cutoff,
      lastMessage: conv.lastMessage,
      lastMessageAt: conv.lastMessageAt.toISOString(),
      unreadCount: conv.unreadCount,
    };
  });

  result.sort((a, b) => new Date(b.lastMessageAt).getTime() - new Date(a.lastMessageAt).getTime());

  res.json(result);
});

router.get("/:username/:otherUsername", async (req, res) => {
  const { username, otherUsername } = req.params;
  const user = await getUser(username);
  const other = await getUser(otherUsername);
  if (!user || !other) return res.status(404).json({ error: "User not found" });

  const messages = await db
    .select()
    .from(messagesTable)
    .where(
      or(
        and(eq(messagesTable.fromId, user.id), eq(messagesTable.toId, other.id)),
        and(eq(messagesTable.fromId, other.id), eq(messagesTable.toId, user.id))
      )
    )
    .orderBy(messagesTable.createdAt);

  res.json(
    messages.map(m => ({
      id: m.id,
      fromUsername: m.fromId === user.id ? user.username : other.username,
      toUsername: m.toId === user.id ? user.username : other.username,
      message: m.message,
      readAt: m.readAt?.toISOString() ?? null,
      createdAt: m.createdAt.toISOString(),
    }))
  );
});

router.post("/:username/:otherUsername", async (req, res) => {
  const { username, otherUsername } = req.params;
  const parsed = SendMessageBody.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: "Invalid body" });

  const user = await getUser(username);
  const other = await getUser(otherUsername);
  if (!user || !other) return res.status(404).json({ error: "User not found" });

  if (!parsed.data.message.trim() || parsed.data.message.length > 1000) {
    return res.status(400).json({ error: "Message must be 1-1000 characters" });
  }

  const [msg] = await db
    .insert(messagesTable)
    .values({ fromId: user.id, toId: other.id, message: parsed.data.message.trim() })
    .returning();

  res.status(201).json({
    id: msg!.id,
    fromUsername: user.username,
    toUsername: other.username,
    message: msg!.message,
    readAt: null,
    createdAt: msg!.createdAt.toISOString(),
  });
});

router.post("/:username/:otherUsername/read", async (req, res) => {
  const { username, otherUsername } = req.params;
  const user = await getUser(username);
  const other = await getUser(otherUsername);
  if (!user || !other) return res.status(404).json({ error: "User not found" });

  await db
    .update(messagesTable)
    .set({ readAt: new Date() })
    .where(
      and(
        eq(messagesTable.fromId, other.id),
        eq(messagesTable.toId, user.id),
        sql`${messagesTable.readAt} IS NULL`
      )
    );

  res.json({ ok: true });
});

export { router as messagesRouter };

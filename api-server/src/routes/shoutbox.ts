import { Router } from "express";
import { db } from "@workspace/db";
import { usersTable, shoutboxTable } from "@workspace/db";
import { eq, desc } from "drizzle-orm";
import { PostShoutBody } from "@workspace/api-zod";

const router = Router();

router.get("/", async (req, res) => {
  const limit = Math.min(Number(req.query["limit"]) || 50, 100);

  const messages = await db
    .select({
      id: shoutboxTable.id,
      message: shoutboxTable.message,
      createdAt: shoutboxTable.createdAt,
      username: usersTable.username,
      displayName: usersTable.displayName,
      color: usersTable.profileColor,
    })
    .from(shoutboxTable)
    .innerJoin(usersTable, eq(shoutboxTable.userId, usersTable.id))
    .orderBy(desc(shoutboxTable.createdAt))
    .limit(limit);

  res.json(messages.reverse().map(m => ({
    ...m,
    color: m.color ?? null,
    createdAt: m.createdAt.toISOString(),
  })));
});

router.post("/", async (req, res) => {
  const parsed = PostShoutBody.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: "Invalid request body" });
  }
  const { username, message } = parsed.data;

  const [user] = await db.select().from(usersTable).where(eq(usersTable.username, username));
  if (!user) {
    return res.status(404).json({ error: "User not found" });
  }

  if (message.trim().length === 0 || message.length > 500) {
    return res.status(400).json({ error: "Message must be 1-500 characters" });
  }

  const [shout] = await db.insert(shoutboxTable)
    .values({ userId: user.id, message: message.trim() })
    .returning();

  res.status(201).json({
    id: shout!.id,
    username: user.username,
    displayName: user.displayName,
    message: shout!.message,
    color: user.profileColor ?? null,
    createdAt: shout!.createdAt.toISOString(),
  });
});

router.delete("/:id", async (req, res) => {
  const id = Number(req.params["id"]);
  if (isNaN(id)) {
    return res.status(400).json({ error: "Invalid id" });
  }
  await db.delete(shoutboxTable).where(eq(shoutboxTable.id, id));
  res.json({ ok: true });
});

export { router as shoutboxRouter };

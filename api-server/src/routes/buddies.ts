import { Router } from "express";
import { db } from "@workspace/db";
import { usersTable, buddiesTable } from "@workspace/db";
import { eq, and } from "drizzle-orm";
import { AddBuddyBody } from "@workspace/api-zod";

const router = Router();

router.get("/:username", async (req, res) => {
  const { username } = req.params;

  const user = await db.select().from(usersTable).where(eq(usersTable.username, username));
  if (user.length === 0) {
    return res.status(404).json({ error: "User not found" });
  }
  const userId = user[0]!.id;

  const buddies = await db
    .select({
      id: usersTable.id,
      username: usersTable.username,
      displayName: usersTable.displayName,
      mood: usersTable.mood,
      avatarUrl: usersTable.avatarUrl,
      profileColor: usersTable.profileColor,
      lastSeen: usersTable.lastSeen,
    })
    .from(buddiesTable)
    .innerJoin(usersTable, eq(buddiesTable.buddyId, usersTable.id))
    .where(eq(buddiesTable.userId, userId));

  const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);
  res.json(buddies.map(b => ({
    ...b,
    mood: b.mood ?? null,
    avatarUrl: b.avatarUrl ?? null,
    profileColor: b.profileColor ?? null,
    isOnline: b.lastSeen > fiveMinutesAgo,
    lastSeen: b.lastSeen.toISOString(),
  })));
});

router.post("/:username", async (req, res) => {
  const { username } = req.params;
  const parsed = AddBuddyBody.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: "Invalid request body" });
  }
  const { buddyUsername } = parsed.data;

  const [user] = await db.select().from(usersTable).where(eq(usersTable.username, username));
  const [buddy] = await db.select().from(usersTable).where(eq(usersTable.username, buddyUsername));

  if (!user || !buddy) {
    return res.status(404).json({ error: "User not found" });
  }

  const [inserted] = await db.insert(buddiesTable)
    .values({ userId: user.id, buddyId: buddy.id })
    .onConflictDoNothing()
    .returning();

  const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);
  res.status(201).json({
    id: buddy.id,
    username: buddy.username,
    displayName: buddy.displayName,
    mood: buddy.mood ?? null,
    avatarUrl: buddy.avatarUrl ?? null,
    profileColor: buddy.profileColor ?? null,
    isOnline: buddy.lastSeen > fiveMinutesAgo,
    lastSeen: buddy.lastSeen.toISOString(),
  });
});

router.delete("/:username/:buddyUsername", async (req, res) => {
  const { username, buddyUsername } = req.params;

  const [user] = await db.select().from(usersTable).where(eq(usersTable.username, username));
  const [buddy] = await db.select().from(usersTable).where(eq(usersTable.username, buddyUsername));

  if (!user || !buddy) {
    return res.status(404).json({ error: "User not found" });
  }

  await db.delete(buddiesTable).where(
    and(eq(buddiesTable.userId, user.id), eq(buddiesTable.buddyId, buddy.id))
  );

  res.json({ ok: true });
});

export { router as buddiesRouter };

import { Router } from "express";
import { db } from "@workspace/db";
import { usersTable } from "@workspace/db";
import { eq, sql, desc } from "drizzle-orm";
import { CreateUserBody, UpdateUserBody, UpdateMoodBody, LoginBody } from "@workspace/api-zod";
import crypto from "crypto";

const router = Router();

function hashPassword(password: string): string {
  return crypto.createHash("sha256").update(password + "retro_salt_2003").digest("hex");
}

function toUserJson(u: typeof usersTable.$inferSelect) {
  const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);
  return {
    id: u.id,
    username: u.username,
    displayName: u.displayName,
    bio: u.bio ?? null,
    mood: u.mood ?? null,
    avatarUrl: u.avatarUrl ?? null,
    profileColor: u.profileColor ?? null,
    profileSong: u.profileSong ?? null,
    location: u.location ?? null,
    interests: u.interests ?? null,
    isOnline: u.lastSeen > fiveMinutesAgo,
    lastSeen: u.lastSeen.toISOString(),
    createdAt: u.createdAt.toISOString(),
  };
}

router.get("/", async (req, res) => {
  const users = await db.select().from(usersTable).orderBy(desc(usersTable.lastSeen));
  res.json(users.map(toUserJson));
});

router.post("/", async (req, res) => {
  const parsed = CreateUserBody.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: "Invalid request body" });
  }
  const { username, password, displayName } = parsed.data;

  const existing = await db.select().from(usersTable).where(eq(usersTable.username, username));
  if (existing.length > 0) {
    return res.status(409).json({ error: "Username already taken" });
  }

  const [user] = await db.insert(usersTable).values({
    username,
    passwordHash: hashPassword(password),
    displayName,
  }).returning();

  req.session = { username: user!.username };
  res.status(201).json(toUserJson(user!));
});

router.get("/:username", async (req, res) => {
  const { username } = req.params;
  const users = await db.select().from(usersTable).where(eq(usersTable.username, username));
  if (users.length === 0) {
    return res.status(404).json({ error: "User not found" });
  }
  const user = users[0]!;

  const buddyCountResult = await db.execute(
    sql`SELECT COUNT(*) as count FROM buddies WHERE user_id = ${user.id}`
  );
  const buddyCount = Number((buddyCountResult.rows[0] as { count: string })?.count ?? 0);

  res.json({ ...toUserJson(user), buddyCount });
});

router.patch("/:username", async (req, res) => {
  const { username } = req.params;
  const parsed = UpdateUserBody.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: "Invalid request body" });
  }

  const updateData: Partial<typeof usersTable.$inferInsert> = {};
  if (parsed.data.displayName !== undefined) updateData.displayName = parsed.data.displayName;
  if (parsed.data.bio !== undefined) updateData.bio = parsed.data.bio;
  if (parsed.data.avatarUrl !== undefined) updateData.avatarUrl = parsed.data.avatarUrl;
  if (parsed.data.profileColor !== undefined) updateData.profileColor = parsed.data.profileColor;
  if (parsed.data.profileSong !== undefined) updateData.profileSong = parsed.data.profileSong;
  if (parsed.data.location !== undefined) updateData.location = parsed.data.location;
  if (parsed.data.interests !== undefined) updateData.interests = parsed.data.interests;

  const [updated] = await db.update(usersTable)
    .set(updateData)
    .where(eq(usersTable.username, username))
    .returning();

  if (!updated) {
    return res.status(404).json({ error: "User not found" });
  }
  res.json(toUserJson(updated));
});

router.patch("/:username/mood", async (req, res) => {
  const { username } = req.params;
  const parsed = UpdateMoodBody.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: "Invalid request body" });
  }

  const [updated] = await db.update(usersTable)
    .set({ mood: parsed.data.mood })
    .where(eq(usersTable.username, username))
    .returning();

  if (!updated) {
    return res.status(404).json({ error: "User not found" });
  }
  res.json(toUserJson(updated));
});

router.post("/:username/ping", async (req, res) => {
  const { username } = req.params;
  await db.update(usersTable)
    .set({ lastSeen: new Date() })
    .where(eq(usersTable.username, username));
  res.json({ ok: true });
});

export { router as usersRouter };

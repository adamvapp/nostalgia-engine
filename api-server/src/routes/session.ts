import { Router } from "express";
import { db } from "@workspace/db";
import { usersTable } from "@workspace/db";
import { eq } from "drizzle-orm";
import { LoginBody } from "@workspace/api-zod";
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

router.post("/login", async (req, res) => {
  const parsed = LoginBody.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: "Invalid request body" });
  }
  const { username, password } = parsed.data;
  const hash = hashPassword(password);

  const users = await db.select().from(usersTable).where(eq(usersTable.username, username));
  if (users.length === 0 || users[0]!.passwordHash !== hash) {
    return res.status(401).json({ error: "Invalid username or password" });
  }

  const user = users[0]!;
  req.session = { username: user.username };

  await db.update(usersTable).set({ lastSeen: new Date() }).where(eq(usersTable.id, user.id));

  res.json(toUserJson(user));
});

router.post("/logout", async (req, res) => {
  req.session = null;
  res.json({ ok: true });
});

router.get("/me", async (req, res) => {
  if (!req.session?.username) {
    return res.status(401).json({ error: "Not logged in" });
  }

  const users = await db.select().from(usersTable).where(eq(usersTable.username, req.session.username));
  if (users.length === 0) {
    req.session = null;
    return res.status(401).json({ error: "User not found" });
  }

  res.json(toUserJson(users[0]!));
});

export { router as sessionRouter };

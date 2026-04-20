import { Router } from "express";
import { db } from "@workspace/db";
import { usersTable } from "@workspace/db";
import { gt } from "drizzle-orm";

const router = Router();

router.get("/", async (req, res) => {
  const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);
  const users = await db.select().from(usersTable).where(gt(usersTable.lastSeen, fiveMinutesAgo));
  res.json(users.map(u => ({
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
    isOnline: true,
    lastSeen: u.lastSeen.toISOString(),
    createdAt: u.createdAt.toISOString(),
  })));
});

export { router as onlineRouter };

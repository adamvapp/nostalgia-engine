import { Router, type IRouter } from "express";
import healthRouter from "./health";
import { usersRouter } from "./users";
import { sessionRouter } from "./session";
import { buddiesRouter } from "./buddies";
import { shoutboxRouter } from "./shoutbox";
import { onlineRouter } from "./online";
import { messagesRouter } from "./messages";

const router: IRouter = Router();

router.use(healthRouter);
router.use("/users", usersRouter);
router.use("/session", sessionRouter);
router.use("/buddies", buddiesRouter);
router.use("/shoutbox", shoutboxRouter);
router.use("/online-users", onlineRouter);
router.use("/messages", messagesRouter);

export default router;

import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { z } from "zod";

const userRouter = new Hono();

userRouter.get("/", (c) => { // <-- This might be unprotected
    return c.json({ message: "User route accessed!" });
});


export default userRouter;
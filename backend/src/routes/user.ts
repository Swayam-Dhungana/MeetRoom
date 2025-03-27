import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { z } from "zod";
import prisma from "../../db/db.config";

type UserContext = {
    Variables: {
        userId: { id: number };
    };
};
const userRouter = new Hono<UserContext>();
  
userRouter.post("/resetPassword", async(c)=>{
    try{
        const userId=c.get('userId')
        console.log(userId)
        const user=await prisma.user.findUnique({
                where:{
                    id : userId.id
                    }   
                })
            console.log(user)
            return c.json({message: "Password reset successfully"});
    }catch{
        return c.json({success:false, msg:'Failed to reset password'}, 500)
    }
})


export default userRouter;
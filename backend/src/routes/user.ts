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
        const {oldPass, newPass}=await c.req.json()
        const user=await prisma.user.findUnique({
                where:{
                    id : userId.id
                    }   
                })
     return c.json({message: "Password reset successfully"});
    }catch{
        return c.json({success:false, msg:'Failed to reset password'}, 500)
    }
})

userRouter.get('/valid-user',async(c)=>{
    const userId=c.get('userId');
    const user=await prisma.user.findUnique({
        where:{
            id: userId.id,
        },
        select:{
            id: true,
            username: true,
            verified:true,
            email: true,
            password: false
        }
    })
    if(!user)return c.json({success:false})
    return c.json({success:true,user})
})


export default userRouter;
// import 'dotenv/config'
import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { z } from "zod";
import prisma from "../../db/db.config";
import bcrypt from "bcryptjs";
import { sign, verify } from "hono/jwt";
import { setCookie } from "hono/cookie";
import getUser from "../../middlewares/getUser";
const authRoute=new Hono()

const signUpSchema=z.object({
    email: z.string().email(),
    username: z.string().min(3),
    password: z.string().min(8),

})

const signInSchema=z.object({
    email: z.string().email(),
    password: z.string().min(8),
})

const resetSchema=z.object({
    newPassword: z.string().min(8),
    oldPassword: z.string().min(8)
})

//signup route completed

authRoute.post('/signup',zValidator('json',signUpSchema),async(c)=>{
    const data=c.req.valid('json')
    if(!data)return c.json({success:false, msg:'invalid data formate'},400)
        try{
            const {email, username,password}=await c.req.json()
            const existingUser= await prisma.user.findUnique({
                where:{
                    email:email
                }
            })
            if(existingUser)return c.json({success: false, msg:'User with the given email already exists'}, 400)
            const hashedPass=await bcrypt.hash(password, 10)
            const newUser= await prisma.user.create({
                data:{
                    name: username,
                    email: email,
                    password: hashedPass
                }
            })
            return c.json({success: true, msg: 'User created successfully', user: newUser})
        }catch{
            return c.json({success:false, msg: 'Failed to create user'}, 500)
        }
})


//login route completed

authRoute.post('/login',zValidator('json',signInSchema),async(c)=>{
    try{
        const data=c.req.valid('json')
        if(!data)return c.json({success:false, msg:'invalid data formate'},400)
        const {email, password}=await c.req.json()
        const existingUser=await prisma.user.findUnique({
            where:{
                email:email
            }
        })
        if(!existingUser)return c.json({success: false, msg: 'Invalid username or password'},401)
        const isValidPassword=await bcrypt.compare(password, existingUser.password)
        if(!isValidPassword)return c.json({success:false, msg: 'Invalid username or password'},401)
        const payload={
            id: existingUser.id
        }
        const token=await sign(payload, Bun.env.SECRET_KEY as string)
        if(!token)return c.json({success:false, msg: 'Some internal problem occured'})
        setCookie(c,'auth-token',token,{
            httpOnly:true,
            path:'/',
            expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 100),
            sameSite: 'strict',
    })
        return c.json({success:true, msg:'Logged in successfully', token})
    }
    catch{
        return c.json({success:false, msg:'Failed to login'}, 500)
    }
})




//Todo-reset password
authRoute.post('/resetPassword', getUser,async(c)=>{
    try{
        return c.json({success:true, msg:'Password reset successfully'})
    }catch{
        return c.json({success:false, msg:'Failed to reset password'}, 500)
    }
})

export default authRoute
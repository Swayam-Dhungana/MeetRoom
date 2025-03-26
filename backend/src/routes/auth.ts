import 'dotenv/config'
import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { z } from "zod";
import prisma from "../../db/db.config";
import bcrypt from "bcryptjs";
import { sign, verify } from "hono/jwt";
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


authRoute.post('/login',zValidator('json',signInSchema),async(c)=>{
    try{
        const {email, password}=c.req.valid('json')
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
        return c.json({success:true, msg:'Logged in successfully', token})
    }
    catch{
        return c.json({success:false, msg:'Failed to login'}, 500)
    }
})

export default authRoute
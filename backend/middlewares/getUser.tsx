import { getCookie } from "hono/cookie"
import { verify } from "hono/jwt"

const getUser=async(c:any,next:Function)=>{
try{
    const token=getCookie(c, 'auth-token')
    if(!token){
        return c.json({success: false, msg:'Unauthorized'},401)    
    }
    const user=await verify(token,Bun.env.SECRET_KEY as string)
    c.set('userId', user )
    await next()
}catch{
    return c.json({success: false, msg: 'Unauthorized'}, 401)
}
}

export default getUser
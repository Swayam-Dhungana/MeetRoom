import { Hono } from 'hono'
import authRoute from './routes/auth'
// import "dotenv/config"
import { cors } from 'hono/cors'
import getUser from '../middlewares/getUser'
import userRouter from './routes/user'
const app = new Hono()

app.use(
  "/*",
  cors({
    origin: Bun.env.FRONTEND_ORIGIN as string,
    credentials: true,
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowHeaders: ["Content-Type", "Authorization"],
  })
);
app.use('/user/*', getUser)
app.route('/auth',authRoute)
app.route('/user',userRouter)


export default app

import { Hono } from 'hono'
import authRoute from './routes/auth'
// import "dotenv/config"
import { cors } from 'hono/cors'
const app = new Hono()

app.route('/auth',authRoute)
app.use(
    "/*",
    cors({
      origin: Bun.env.FRONTEND_ORIGIN,
      credentials: true,
      allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
      allowHeaders: ["Content-Type", "Authorization"],
    })
  );


export default app

import { Hono } from 'hono'
import authRoute from './routes/auth'
import "dotenv/config"
const app = new Hono()

app.route('/auth',authRoute)

export default app

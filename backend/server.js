import express from 'express'
import cors from 'cors'
import 'dotenv/config'
import connectDB from './config/mongodb.js'
import connectCloudinary from './config/cloudinary.js'
import adminRouter from './routes/adminRoute.js'
import doctorRouter from './routes/doctorRoute.js'
import userRouter from './routes/userRoute.js'

const app = express()
const port = process.env.PORT || 5000   
connectDB()
connectCloudinary()

//middlewares
app.use(express.json())

const allowedOrigins = [
  process.env.FRONTEND_URL,
  process.env.ADMIN_URL
]

app.use(cors({
  origin: allowedOrigins,
  credentials: true
}))

//api endpoints
app.use('/api/admin',adminRouter)
app.use('/api/doctor',doctorRouter)
app.use('/api/user',userRouter)

app.get('/', (req, res) => {
    res.send('Api working')
})

app.listen(port, () => console.log("Server Started on port", port))
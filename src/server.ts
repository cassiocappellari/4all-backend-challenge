import 'reflect-metadata'
import dotenv from 'dotenv'
dotenv.config()
import express from 'express'

import './database/connection'

import userRoutes from './routes/userRoutes'
import movieRoutes from './routes/movieRoutes'

const app = express()
const port = 3000

app.use(express.json())
app.use(userRoutes)
app.use(movieRoutes)

app.listen(port, () => console.log(
    `Server started at http://localhost:${port}`
))
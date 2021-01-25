import 'reflect-metadata'
import dotenv from 'dotenv'
dotenv.config()

import express from 'express'

import {connection} from '../src/database/connection'
import userRoutes from './routes/userRoutes'
import movieRoutes from './routes/movieRoutes'

connection()
const app = express()
const port = 3000

app.use(express.json())
app.use(userRoutes)
app.use(movieRoutes)

app.listen(port, () => console.log(
    `Server started at http://localhost:${port}`
))
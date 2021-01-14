import express from 'express'

import './database/connection'

import userRoutes from './routes/userRoutes'
import movieRoutes from './routes/movieRoutes'

const app = express()

app.use(express.json())
app.use(userRoutes)
app.use(movieRoutes)

app.listen(3000)
import express from 'express'

import './database/connection'

import routes from './routes/userRoutes'

const app = express()

app.use(express.json())
app.use(routes)

app.listen(3000)
import express from 'express'
import {adminRouter} from  './routes/routeAdmin.js'
import { offreRoute } from './routes/routeOffre.js'
const app = express()

app.use(express.json())
app.use('/api', adminRouter)
app.use('/api',offreRoute)

export default app

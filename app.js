import express from 'express'
import {adminRouter} from  './routes/routeAdmin.js'
import { offreRoute } from './routes/routeOffre.js'
import  {creneauRouter} from './routes/routeCreneau.js'
const app = express()

app.use(express.json())
app.use('/api', adminRouter)
app.use('/api',offreRoute)
app.use('/api',creneauRouter)

export default app

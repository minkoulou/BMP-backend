import express from 'express'
import {adminRouter} from  './routes/routeAdmin.js'
import { offreRoute } from './routes/routeOffre.js'
import  {creneauRouter} from './routes/routeCreneau.js'
import {routedemandeStage} from './routes/routedemandes.js'
const app = express()

app.use((req,res,next)=>{
    console.log(req.method,req.originalUrl)
    next()
})
app.use(express.json())
app.use('/api', adminRouter)
app.use('/api',offreRoute)
app.use('/api',creneauRouter)
app.use('/api',routedemandeStage)

export default app

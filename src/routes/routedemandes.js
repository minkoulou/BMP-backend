import { DemandeStage } from '../controllers/demande.js'
import { upload } from '../middleware/uploadCv.js'
import { verify } from '../middleware/Authmiddleware.js'

import { Router } from 'express'

export const routedemandeStage = Router()

routedemandeStage.post('/demandes',upload.single('cv'),DemandeStage.CreateDemande)

routedemandeStage.put('/admin/demandes/:id',verify,DemandeStage.updateDemande)

routedemandeStage.get('/admin/demandes',verify,DemandeStage.getAllDemande)

// route pour telecharger les cv 
routedemandeStage.get('/admin/demandes/:id/cv',verify,DemandeStage.getCv)


import { DemandeStage } from '../controllers/demande.js'
import { upload } from '../middleware/uploadCv.js'
import { verify } from '../middleware/Authmiddleware.js'

import { Router } from 'express'

export const routedemandeStage = Router()

// Envoie de la demande en base de donnees dans mongoDB et le cv dans supabase
routedemandeStage.post('/demandes',upload.single('cv'),DemandeStage.CreateDemande)

// modification de la demande (StatutDemande)
routedemandeStage.put('/admin/demandes/:id',verify,DemandeStage.updateDemande)

// recuperation de toutes les demandes
routedemandeStage.get('/admin/demandes',verify,DemandeStage.getAllDemande)

// route pour telecharger les cv 
routedemandeStage.get('/admin/demandes/:id/cv',verify,DemandeStage.getCv)

// recuperation d'une demande specifique
routedemandeStage.get('/demande/suivi/:reference',DemandeStage.getDemande)

// suppression des demandes par l'administrateur
routedemandeStage.delete('/admin/demande/:id',verify,DemandeStage.deleteDemande)




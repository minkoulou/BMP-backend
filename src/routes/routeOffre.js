import { offreStage } from "../controllers/Offre.js";
import { verify } from "../middleware/Authmiddleware.js";

import { Router } from "express";

const offreRoute=Router()

offreRoute.get('/offres' , offreStage.getOffres)
offreRoute.post('/admin/offres' , verify , offreStage.CreateOffre)
offreRoute.put('/admin/offres/:id' , verify , offreStage.updateOffre)
offreRoute.delete('/admin/offres/:id' , verify , offreStage.deleteOffre)

export {offreRoute}
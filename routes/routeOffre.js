import { offreStage } from "../controllers/Offre.js";

import { Router } from "express";

const offreRoute=Router()

offreRoute.post('/admin/offres',offreStage.CreateOffre)
offreRoute.get('/offres',offreStage.getOffres)
offreRoute.put('/admin/offres/:id',offreStage.updateOffre)
offreRoute.delete('/admin/offres/:id',offreStage.deleteOffre)

export {offreRoute}
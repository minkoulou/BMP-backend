import { Router } from "express";
import {creneau} from '../controllers/creneau.js'
import { verify } from "../middleware/Authmiddleware.js";


export const creneauRouter = Router()

creneauRouter.post('/admin/creneau', verify,creneau.createCreneau)
creneauRouter.get('/creneau', creneau.getCreneau)
creneauRouter.get('/admin/creneau', verify,creneau.getAll)
creneauRouter.put('/admin/creneau/:id', verify,creneau.updateCreneau)


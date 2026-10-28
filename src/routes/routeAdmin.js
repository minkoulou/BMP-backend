import {AuthAdmin} from '../controllers/AuthAdmin.js'
import { Router } from 'express'
import { verify } from '../middleware/Authmiddleware.js'

export const adminRouter=Router()

adminRouter.post('/admin/Register',verify,AuthAdmin.signup)

adminRouter.post('/admin/login',AuthAdmin.login)

adminRouter.post('/refresh-token',AuthAdmin.refreshToken)

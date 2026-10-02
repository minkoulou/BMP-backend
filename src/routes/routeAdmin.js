import {AuthAdmin} from '../controllers/AuthAdmin.js'
import { Router } from 'express'

export const adminRouter=Router()

adminRouter.post('/admin/Register',AuthAdmin.signup)
adminRouter.post('/admin/login',AuthAdmin.login)
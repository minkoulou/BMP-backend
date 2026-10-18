import {v4 as uuidv4} from 'uuid'
import multer, { memoryStorage } from 'multer'

const upload=multer({

    storage:memoryStorage({limits: { fileSize: 5 * 1024 * 1024 }}),

    fileFilter:(req,file,cb)=>{

        if(file.mimetype !=='application/pdf') {

            return cb(new Error('seuls les pdfs sont autorisés'))
        }
        
        cb(null,true)
    }
})

export {upload}
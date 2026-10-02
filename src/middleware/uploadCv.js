import {v4 as uuidv4} from 'uuid'
import multer, { memoryStorage } from 'multer'

// const storage = multer.diskStorage({


// })

const upload=multer({

    storage:memoryStorage({filename:(req,file,cb)=>{cb(null,`${uuidv4()}-${file.originalname}`)}}),

    fileFilter:(req,file,cb)=>{

        if(file.mimetype !=='application/pdf'){

            return cb(new Error('seuls les pdfs sont autorisés'))
        }
        
        cb(null,true)
    }
})

export {upload}
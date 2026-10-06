import {prisma} from '../lib/prisma.js'
import bcrypt from 'bcrypt'
import 'dotenv/config'
import {v4 as uuidv4} from 'uuid'
import jsonwebtoken from 'jsonwebtoken'

        const generateAccessToken = (user)=>{
            
            return jsonwebtoken.sign(
                {id:user.id,email:user.email},
                process.env.JWT_SECRET_ACCESS,
                {expiresIn:'30m'}
            )
        }

        const generateRefreshToken = (user)=>{
           return jsonwebtoken.sign( 
            {id:user.id,email:user.email},
            process.env.JWT_SECRET_REFRESH,
            {expiresIn:'60d'}
           )
        }

const AuthAdmin = {

   signup:async (req,res)=>{

     try {
        const {name,refreshToken}=req.body
       
        const valuePass=process.env.ADMIN_PASSWORD

        const valueMail=process.env.ADMIN_EMAIL

    if(!name || !valuePass || !valueMail){

        return res.status(400).json({message:'donnees manquantes'})

    }
       await prisma.admin.upsert({
            create:{
                id:uuidv4(),
                email:valueMail,
                name,
                password: await bcrypt.hash(valuePass,10),
                refreshToken:null
            }
            ,
            update:{name,refreshToken}
            ,
            where:{email:valueMail}
        })

        return res.status(200).json({message:`le nouveau nom administrateur est : ${name} ·`})

         } catch (error) {
        return res.status(500).json({message:`${error}`})
     }
   },

 login: async (req,res) => {

     try {
         
        const {email,password}=req.body

        const admin = await prisma.admin.findUnique({where:{email}})

        if (!admin){
            return res.status(404).json({message:'Administrateur non existant'})
        }

        const verifyPassword = await bcrypt.compare(password,admin.password);

        if(verifyPassword === false){

           return res.status(404).json({message:'Identifiants Invalides'})

        }

       const RefreshToken = generateRefreshToken(admin)

        const AccessToken= generateAccessToken(admin)

        await prisma.admin.update(
            {where:{email},
            data:{refreshToken:RefreshToken}}
        )

        // mise du refreshtoken dans le cookie 

           res.cookie('refreshToken',RefreshToken,{
            httpOnly:true,
            sameSite:'strict',
            secure:process.env.NODE_EN==='production',
            maxAge: 1000*60*60*24*30

        }
    )
         
        return res.status(200).json({message:'Connexion reussie' , 
                                     AccessToken,
                                     Admin:{email:admin.email,password:admin.password}
                            })

     } catch (error) {
        return res.status(500).json({message:`${error}`})
     }
 },

 refreshToken: async(req,res) =>{

    try {
        
   
 
       const refresh = req.cookie.refreshToken

       if(!refresh) return res.statusa(401).json({message:'Refreshtoken manquant'})

        try {

            const decoded = jsonwebtoken.verify(refresh,JWT_SECRET_REFRESH)

        } catch (error) {

         if(error.message==='TokenExpiredError') {return res.status(401).json({message:'Token expire'})}

         return res.status(401).json({message:'token invalide'})
            
        }

        const admin= await prisma.admin.findUnique({where:{id:decoded.id}})

        if(!admin || admin.refreshToken !==refresh) return res.status(401).json({message:'Token invalid'})

            const newToken = generateAccessToken(admin)

            return res.status(200).json({message:newToken})

         } catch (error) {
         
             return res.status(500).json({message:error.message})
    }
 
 }

}

export {AuthAdmin}
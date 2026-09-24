import {prisma} from '../lib/prisma.js'
// import bcrypt from 'bcrypt'
// import 'dotenv/config'
import {v4 as uuidv4} from 'uuid'

const offreStage = {
    
  CreateOffre: async (req,res)=>{

    try {
        
       const {nomOffre,intitule,description} = req.body;

       if(!nomOffre || !intitule || !description){
        
        return res.status(400).json({message:' Donnees manquantes '})
       }

   const created=  await prisma.offreStage.create({
        data:{
            id:uuidv4(),
            nomOffre,
            intitule,
            description
        }
    })

    return res.status(201).json({message:'Offre cree avec succes · 🎉', offre:created})

    } catch (error) {
        return res.status(500).json({message:`${error}`})
    }
    
          
  },

  getOffres: async (req,res)=>{
    try {
      const offres = await prisma.offreStage.findMany()

      if(!offres){
        return res.status(404).json({message:'Aucune offre trouve '})
      }

       return res.status(200).json(offres)

    } catch (error) {
      return res.status(500).json({message:`${error}`})
    }
  },

  updateOffre: async (req,res) =>{

        try {

          const {id}=req.params
          const {nomOffre,intitule,description}=req.body
          const verifOffre = await prisma.offreStage.findUnique({where:{id}})

          if(!verifOffre){

            return res.status(404).json({message:'Offre non trouvable'})
          }

        const updated =  await prisma.offreStage.update({
                                                     where:{id},
                                                      data:{
                                                      nomOffre,
                                                      intitule, 
                                                      description}
                                                    })
           return res.status(200).json({message:'offre mise a jour',Offre:updated})
          
        } catch (error) {
          return res.status(500).json({messag:`${error}`})
        }

  },

  deleteOffre:async (req,res)=>{
    try {

      const {id}=req.params
      
      const offre= await prisma.offreStage.findUnique({where:{id}})
      
      if(!offre){
        return res.status(404).json({message:'Offre non trouvée'})
      }

     await prisma.offreStage.delete({where:{id}})

      return res.status(204)

    } catch (error) {
      return res.status(500).json({message:`${error}`})
    }
  }
}

export {offreStage}
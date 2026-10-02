import {prisma} from '../lib/prisma.js'

import {v4 as uuidv4} from 'uuid'


 const creneau = {

    createCreneau:async (req,res)=>{
           try {
            
            const {date,heureDebut,heureFin}= req.body

            if(!date || !heureDebut || !heureFin){

               return res.status(400).json({message:'remplir tous les champs'})

            }

          const data =  await prisma.creneau.create({data:{
                id:uuidv4(),
                date,
                heureDebut,
                heureFin,
                disponible:true
            }})

            return res.status(201).json({message:'Creneau cree avec succes · 🎉', data })

           } 
           
           catch (error) {

           return res.status(500).json({message:`${error}`}) 

           }
    },


    // recuperation des creneaux disponible pour les utilisateurs

    getCreneau: async (req,res)=>{

        try {
            
            const creneau = await prisma.creneau.findMany({where:{disponible:true}})

        if(!creneau){
            return res.status(404).json({message:'Creneau deja occupé'})
        }

        return res.status(200).json(creneau)

        } catch (error) {
            return res.status(500).json({message:`${error}`})
        }
    },

    getAll:async (req,res)=>{

        const allCreneau = await prisma.creneau.findMany()

        if(!allCreneau){
            return res.status(404).json({message:'Creneaux non existants'})
        }

        return res.status(200).json(allCreneau)
    },

    updateCreneau:async(req,res)=>{

    try {
        const {id}=req.params

        const{date,heureDebut,heureFin,disponible}=req.body

        const creneau = await prisma.creneau.findUnique({where:{id}})

        if(!creneau){
            return res.status(404).json({message:'Creneau non retouve '})
        }
        
       await prisma.creneau.update({ where:{id},
            data:{
              date,
              heureDebut,
              heureFin,
              disponible       
       }})

       return res.status(204).send()

    } catch (error) {
        return res.status(500).json({message:`${error}`})
    }

    }
               
}

export {creneau}
import {prisma} from '../lib/prisma.js'
import {v4 as uuidv4} from 'uuid'
import {mailSend} from '../services/email.js'

import { supabase } from '../config/supabase.js'

export const DemandeStage = {
  
    CreateDemande : async(req,res)=>{

      let filePath = null

  try {
  
        const {nom,prenom,telephone,email,offreId,creneauId}=req.body;
           
         if(!req.file) return res.status(400).json({message:'veillez entrer votre Cv'})

        const {buffer,mimetype,originalname} = req.file

        console.log(req.file)

        const filePath=`${uuidv4()}-${originalname}`

        if(!nom || !prenom || !telephone || !email || !offreId || !creneauId){
                     
                 return res.status(400).json({message:'Donnes manquantes'})
        }

        // verification des offres et de la disponibilte des creneaux

        const offre = await prisma.offreStage.findUnique({where:{id:offreId}})

        if(!offre) return res.status(404).json({message:'offre non retrouve'})

        
        const creneau = await prisma.creneau.findUnique({where:{id:creneauId}})

        if(creneau || !creneau.disponible) return res.status(409).json({message:'Creneau indisponible '})

            
            // Envoie du fichier cv dans Supabase Storage

           const {error} = await supabase.storage
            .from('cv')
            .upload(filePath,buffer,{contentType:'application/pdf'})

         if(error) return res.status(400).json({error:error.message})

// construction du num de reference pour chaque demande 

            const prefixe = nom.slice(0,3).toUpperCase()

            const suffixe = Math.floor(Math.random()*9999 + 10000)

            const ref =`${prefixe}-${suffixe}`

// envoie du contenue avec le nom du fichier en base de donnee mongodb
        const data = await prisma.demandeStage.create({data:{
            nom,
            prenom,
            telephone,
            reference:ref,
            email,
            cv:filePath,
            offreId,
            creneauId                        
        },

       include:{    offre:{ select:{nomOffre:true ,    
                             intitule:true ,
                             description:true}
                           },

                    creneau:{select:{ date:true,
                                     heureDebut:true,    
                                     heureFin:true,      
                                     disponible:true }
                            }
                }

            })

  await mailSend.sendMessage(email,nom,ref).catch((error)=>{console.log(error)})

   return res.status(200).json({data})
          

    } catch (error) {

    supabase.storage.from('cv').remove([filePath])

    return res.status(500).json({message:`${error}`})

    }

 },
 

 //  recuperation de l'url du cv stocké dans supabase 

 getCv: async (req,res) => {

    try {

         const {id} = req.params

    const demande = await prisma.demandeStage.findUnique({where:{id},select:{cv:true}})

    if(!demande){

        return res.status(404).json({message:'demande introuvable'})

    }

    const {data} = await supabase.storage.from('cv').getPublicUrl(demande.cv)

    console.log(data.publicUrl)

    return res.status(200).json({message:'ressource recupere avec succes'})
        

    } catch (error) {
        return res.status(500).json({message:error.name})
    }

 },


//  mises a jour du statut de la demande 

 updateDemande: async(req,res)=>{
    try {
         
        const {id}=req.params

        const { statutDemande } = req.body

        if(!statutDemande) return res.status(400).json({message:'Veillez entrer le statut de la demande'})

        const verif = await prisma.demandeStage.findUnique({where:{id}})

        if(!verif){
            return res.status(404).json({message:'Demande non existante'})
        }
       
        await prisma.demandeStage.update({where:{id},data:{statutDemande}})

  console.log(verif.email)

  await mailSend.sendUpdated(statutDemande,verif.email).catch((error)=>{console.log(error)})

  return res.status(204).json()

    } catch (error) {
        return res.status(500).json({message:`${error}`})
    }
 },

//  recuperation de toutes les demandes

 getAllDemande: async(req,res)=>{

    try {

        const demandes = await prisma.demandeStage.findMany()

        return res.status(200).json(demandes)
        
    } catch (error) {
        return res.status(500).json({message:`${error}`})
    }
 },
 
//  recuperation d'une demande specifique

  getDemande: async (req,res) => {

    try {

        const {reference}=req.params

        const demande = await prisma.demandeStage.findUnique({where:{reference},include:{offre:true,creneau:true}})

        if(!demande){

            return res.status(404).json({message:'demande introuvable'})
        }
        
    console.log(demande.offre.nomOffre)

    return res.status(200).json(demande)
        
    } catch (error) {

        return  res.status(500).json({message:`${error}`})

    }

  },

//   suppression d'une demande 

  deleteDemande: async (req,res) => {

    try {
        
        const {id} =req.params

        const recup = await prisma.demandeStage.findUnique({where:{id}})

        if(!recup) {
            return res.status(404).json({message:'Demande non existante'})
        }

         await prisma.demandeStage.delete({where:{id}})

         await supabase.storage.from('cv').remove([recup.cv]);

         return res.status(204).json()

    } catch (error) {
        
        return res.status(500).json({message:`${error}`})
    }
  }
 }
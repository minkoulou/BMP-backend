import {prisma} from '../lib/prisma.js'
import {v4 as uuidv4} from 'uuid'
import {mailSend} from '../services/email.js'

import { supabase } from '../config/supabase.js'

export const DemandeStage = {
  
    CreateDemande : async(req,res)=>{

  try {
  
        const {nom,prenom,etablissement,email,offreId,creneauId}=req.body;

         if(!req.file) return res.status(400).json({message:'veillez entrer votre Cv'})

        const {buffer,mimetype,originalname}=req.file

        console.log(req.file)

        const filePath=`${uuidv4()}-${originalname}`

        if(!nom || !prenom || !etablissement || !email){
                     
                 return res.status(400).json({message:'Donnes manquantes'})
        }

// Envoie du fichier cv dans Supabase Storage

           const {error} = await supabase.storage
            .from('cv')
            .upload(filePath,buffer,{contentType:'application/pdf'})

         if(error) return res.status(400).json({error:error.message})

            // envoie du contenue avec le nom du fichier en base de donnee mongodb
        const data = await prisma.demandeStage.create({data:{
            nom,
            prenom,
            etablissement,
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

  await mailSend.sendMessage(email,nom).catch((error)=>{console.log(error)})

   return res.status(200).json({data})
          

    } catch (error) {

    return res.status(500).json({message:`${error}`})

    return supabase.storage.from('cv').remove([filePath])
    }

 },
 
  //  recuperaturation de l'url du cv stocke dans supabase 

 getCv: async (req,res)=>{

    try {

         const{id}=req.params

    const demande= await prisma.demandeStage.findUnique({where:{id},select:{cv:true}})

    if(!demande){
        return res.status(404).json({message:'demande introuvable'})
    }

    const {data} = await supabase.storage.from('cv').getPublicUrl(demande.cv)

    console.log(data.publicUrl)

    return res.status(200).json({message:'ressource recupere avec succes'})
        

    } catch (error) {
        return res.status(500).json({message:error})
    }

 },


//  mises a jour du statut de la demande 

 updateDemande: async(req,res)=>{
    try {
         
        const {id}=req.params
        const {statutDemande}=req.body

        const verif= await prisma.demandeStage.findUnique({where:{id}})

        if(!verif){
            return res.status(404).json({message:'Demande non existante'})
        }
       
        await prisma.demandeStage.update({where:{id},data:{statutDemande}})

  await mailSend.sendMessage(verif.email,verif.nom).catch((error)=>{console.log(error)})

  return res.status(204).json()

    } catch (error) {
        return res.status(500).json({message:`${error}`})
    }
 },

//  recuperation de des demandes

 getAllDemande:async(req,res)=>{

    try {
        const demandes= await prisma.demandeStage.findMany()

        return res.status(200).json(demandes)
        
    } catch (error) {
        return res.status(500).json({message:`${error}`})
    }
 }

 }
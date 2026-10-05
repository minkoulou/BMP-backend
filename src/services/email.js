import nodemailer from 'nodemailer'

const transporter=nodemailer.createTransport({
    host:"smtp.gmail.com",
    port:process.env.EMAIL_PORT,
    secure:true,
    auth:{
        user:process.env.EMAIL_USER,
        pass:process.env.EMAIL_PASS
    }
})

export const mailSend={
   sendMessage: async(email,name,uniqueref)=>{
    try {
const mailOption= {
    from:"minkouloubenoit431@gmail.com",
    to:`${email}`,
    subject:"Votre Demande Stage a bien été reçue",

    text:`Bonjour ${name} \n\n ` +
          `Nous avons bien reçue votre demande de stage et nous vous remercions .\n ` +
          `Nous allons l'étudier et vous renvoyer une réponse à chaque étape d'avancement de votre demande` +
          `Cordialement \n L'équipe BMPHUB`,

    html:`
     <div style="background-color:#01c93d; font-family:Cambria, Cochin, Georgia, Times, 'Times New Roman', serif ; color: white;padding:4px 0 10px 10px; border-radius: 10px; box-shadow:2px 2px 10px rgb(186, 177, 227);">  
       <h2 style="margin:0 0 16px;font-size:20px;color:#111827;font">
          Bonjour,
        </h2>
     
        <p style="margin:0 0 12px;">
          Nous avons bien reçu votre demande de stage et votre 
          numero de reference unique est :<i style="font-weight:bold; font-size:16px">${uniqueref}</i> .
          Ne le partagez à personne ; Nous vous  remercions.
        </p>
        <p style="margin:0 0 12px;">
          Notre équipe va l'étudier . Vous recevrez une réponse
          par e-mail dès qu'une décision aura été prise.
        </p>
        <p style="margin:24px 0 0;">
          Cordialement,<br>
          <strong>L'équipe BMPHUB</strong>
        </p>
      </div>  
      `
}
        const info = await transporter.sendMail(mailOption)
            console.log("message envoye avec success a :",info.messageTime) 
    } catch (error) {
        console.error("une erreur est survenue lors de l'envoie du mail:",error)
 
    }
},

sendUpdated: async(statutDemande,email)=>{
  
  try {
     const mailOption={
      from:'"Equipe BMPHUB" <minkouloubenoit431@gmail.com>',
      to:email,
      subject: " Statut d'Avancement de votre demande ",
      text:`Bonjour \n \n ` +
          `Votre demande actuelle vient  passer à l'état  ${statutDemande}.\n ` +
          `Cordialement \n L'équipe BMPHUB`,

    html:`
     <div style="background-color: #0a1bb5; font-family:Cambria, Cochin, Georgia, Times, 'Times New Roman', serif ; color: white;padding:4px 0 10px 10px; border-radius: 10px; box-shadow:2px 2px 10px rgb(186, 177, 227);">  
       <h2 style="margin:0 0 16px;font-size:20px;color:#111827;font">
          Bonjour,
        </h2>
     
        <p style="margin:0 0 12px;">
          Votre demande actuelle viens e passer à l'état :<i style="font-weight:bold;"> ${statutDemande} </i..
        </p>
        <p style="margin:0 0 12px;">
          Notre équipe  Vous informera des avancements à venir
          par e-mail.
        </p>
        <p style="margin:24px 0 0;">
          Cordialement,<br>
          <strong>L'équipe BMPHUB</strong>
        </p>
      </div>  
      `
     }

   const info = await transporter.sendMail(mailOption)

            console.log("message envoye avec success a :",info.messageTime) 
    } catch (error) {
        console.error("une erreur est survenue lors de l'envoie du mail:",error)
 
    }
} 

}

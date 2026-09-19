import jsonwebtoken from 'jsonwebtoken'

import 'dotenv/config'

 export function verify (req,res,next){

  try {

  const header =  req.headers.authorization
  
  if(!header || !header.startsWith('Bearer ')){
    return res.status(404).json({message:'Token invalide'})
  }
  
  const Token = header.split(' ')[1]

  const decoded = jsonwebtoken.verify(Token,process.env.JWT_SECRET_ACCESS) 

  req.admin=decoded

   next()  

} catch (error) {
    if(error.name ==='TokenExpiredError'){
        return res.status(401).json({message:'token expire'})
    }

    if(error.name ==='JsonWebTokenError'){
        return res.status(401).json({message:'token invalide '})
    }

    return res.status(500).json({message:`${error}`})
  }
 }
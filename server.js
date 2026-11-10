import 'dotenv/config'
import app from "./src/app.js";

const PORT= process.env.PORT || 3000 ;
const localhost= process.env.HOST || '0.0.0.0'

app.listen(PORT,localhost,()=>{
    console.log(`le serveur tourne sur ${localhost}:${PORT}`);
})

import app from "./app.js";

const PORT=3000;
const localhost='127.0.0.1'

app.listen(PORT,localhost,()=>{
    console.log(`le serveur tourne sur ${localhost}:${PORT}`);
})
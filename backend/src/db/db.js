const mongoose =require('mongoose');

function connectDb(){

    mongoose.connect(process.env.MONGo_DB_URI)
    .then(()=>{
        console.log("mongodb connected")
    })
    .catch((e)=>{
        console.log("error", e);
    })
}
module.exports=connectDb;
const mongoose=require("mongoose");

const foodpartnerSchema= new mongoose.Schema({
    
    name:{
        type:String,
        require:true,
    },
    contactName:{
        type:String,
        require:true,
    },
     phone:{
        type:String,
        require:true,
    },
     address:{
        type:String,
        require:true,
    },
    email:{
        type:String,
        require:true,
        unique:true,
    },
    password:{
        type: String,
    }
    
},
    {
        timestamps:true
    }
)
const foodpartnerModel=mongoose.model('foodpartner',foodpartnerSchema);
module.exports=foodpartnerModel;

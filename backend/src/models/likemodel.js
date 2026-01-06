const mongoose=require('mongoose');

const likeSchema= new mongoose.Schema({
    user:{
        type: mongoose.SchemaTypes.ObjectId,
        ref:"user",
        require:true,
    },
    food:{
        type: mongoose.SchemaTypes.ObjectId,
        ref:"food",
        require:true,
    }
});

module.exports= mongoose.model('like',likeSchema);
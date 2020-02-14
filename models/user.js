const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt-nodejs');

//Define our model
const userSchema = new Schema({
    email:{type:String,unique:true,lowercase:true},
    password: String
});
//on save encypt pass
userSchema.pre('save',function (next) {
    // get acces to iser model;
    const user = this;
    //generate salt then call callback
    bcrypt.genSalt(10,function(err,salt){
        if(err){return next(err);}
        bcrypt.hash(user.password,salt,null,function(err,hash){
            if(err){ return next(err)};
            //override plain text password
            user.password=hash;
            next();
        })
    })
})


userSchema.methods.comparePassword = function(candidatePassword,callback){
    bcrypt.compare(candidatePassword,this.password,function(err,isMatch){
        if(err){return callback(err);}
        
        callback(null,isMatch)
    })
}
// /Create the model classs
const ModelClass= mongoose.model('user',userSchema);

//export the model
module.exports = ModelClass;
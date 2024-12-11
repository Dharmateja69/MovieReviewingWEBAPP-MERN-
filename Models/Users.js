const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const  Userschema = mongoose.Schema({

    name:
    {
        type: String,
        trim: true,
        required: true
    },
    email: {
        type: String,
        trim: true,
        required: true,
        unique: true
    },
    password:
    {
        type: String,
        required: true
    },
    isVerified:
    {
        type:Boolean,
        required:true,
        default:false
    },

});
Userschema.pre("save",async function(next)//we can use this method to hash not only password we can use any element process is same ;
{
    if(this.isModified("password"))
    {
        this.password = await bcrypt.hash(this.password,10);

    }
    next();
})
//11-12-2024(7:13)
Userschema.methods.comparePassword = async function (password) {
    return await bcrypt.compare(password, this.password);
  };


 module.exports = mongoose.model("User",Userschema);
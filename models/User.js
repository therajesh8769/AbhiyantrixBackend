const {model}=require("mongoose");

const {userSchema}=require("../schemas/user");



const User=new model("User",userSchema);

module.exports={User};
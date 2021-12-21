const   mongoose                    = require("mongoose");

const userSchema = mongoose.Schema({
    name : String,
    contact : String,
    email : String,
    password : String,
    picture : String,
    pictureName : String,
    role : String
});

module.exports = mongoose.model("User", userSchema);

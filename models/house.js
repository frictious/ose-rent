const   mongoose                    = require("mongoose");

const houseSchema = mongoose.Schema({
    address : String,
    description : String,
    price : String,
    type : String,
    front : String,
    back : String,
    inside : String,
    agent : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "Users"
    },
    firstFeature : String, // Features of the house (self contain, compound, fenced, water)
    secondFeature : String,
    thirdFeature : String,
    fourthFeature : String
});

module.exports = mongoose.model("Houses", houseSchema);

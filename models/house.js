const   mongoose                    = require("mongoose");

const houseSchema = mongoose.Schema({
    duration : String,
    address : String,
    description : String,
    price : String,
    type : String,
    front : String,
    back : String,
    inside : String,
    outside : String,
    agent : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "Users"
    },
    status : String // Check if a house in free, paid for, or under negotiation
});

module.exports = mongoose.model("Houses", houseSchema);

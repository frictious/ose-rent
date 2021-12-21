const   mongoose                = require("mongoose");

const requestSchema = mongoose.Schema({
    name : String,
    email : String,
    phone : String,
    type : String, //Whether lease, rent, or buy
    description : String, // Description of everything needed (self contain, no of rooms, parlour, town, area, etc)
})

module.exports = mongoose.model("Request", requestSchema);

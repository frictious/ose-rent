const   House                   = require("../../models/house");

// LOGIN FORM

// LOGIN FORM LOGIC

// LOGOUT LOGIC

// HOUSES

// GET ADD HOUSE FORM

// ADD HOUSE LOGIC

// VIEW HOUSE INFORMATION
exports.getHouse = (req, res) => {
    House.findById({_id : req.params.id})
    .then(house => {
        if(house){
            res.render("agent/house", {
                title : "Single House",
                house : hosue
            });
        }
    })
    .catch(err => {
        if(err){
            console.log(err);
            res.redirect("back");
        }
    });
}

// UPDATE HOUSE INFORMATION
exports.updateHouse = (req, res) => {
    House.findById({_id : req.params.id})
    .then(house => {
        if(house){
            res.render("agent/updateHouse", {
                title : "OseRent SL Agent House Update"
            });
        }
    })
    .catch(err => {
        if(err){
            console.log(err);
            res.redirect("back");
        }
    });
}

// UPDATE HOUSE INFORMATION LOGIC
exports.updateHouseLogic = (req, res) => {
    House.findByIdAndUpdate({_id : req.params.id}, req.body)
    .then(house => {
        if(house){
            console.log(req.body);
            console.log("HOUSE INFORMATION UPDATED SUCCESSFULLY");
            res.redirect(`/agent/house/${house._id}`);
        }
    })
    .catch(err => {
        if(err){
            console.log(err);
            res.redirect("back");
        }
    });
}

// DELETE HOUSE INFORMATION
exports.deleteHouse = (req, res) => {
    House.findByIdAndDelete({_id : req.params.id})
    .then(house => {
        if(house){
            console.log("HOUSE INFORMATION DELETED SUCCESSFULLY");
            res.redirect("back");
        }
    })
    .catch(err => {
        if(err){
            console.log(err);
            res.redirect("back");
        }
    });
}

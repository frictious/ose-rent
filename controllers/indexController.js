const   nodemailer              = require("nodemailer");

require("dotenv").config();
// NODEMAILER CONFIGURATION
const transport = nodemailer.createTransport({
    service : "gmail",
    auth : {
        user : process.env.EMAIL,
        pass : process.env.PASSWORD
    }
})

// HOME PAGE
exports.index = (req, res) => {
    res.render("index", {
        title : "Ose Rent SL"
    });
}

// ABOUT PAGE
exports.about = (req, res) => {
    res.render("about", {
        title : "About Ose Rent SL"
    });
}

// CONTACT PAGE
exports.contact = (req, res) => {
    res.render("contact", {
        title : "Contact Ose Rent SL"
    });
}

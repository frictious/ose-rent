const   nodemailer              = require("nodemailer"),
        Agents                  = require("../models/user"),
        passport                = require("passport");

// CONFIG
require("../config/login")(passport);

require("dotenv").config();
// NODEMAILER CONFIGURATION
const transport = nodemailer.createTransport({
    service : "gmail",
    auth : {
        type : "login",
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

// HOUSES PAGE
exports.houses = (req, res) => {
    res.render("houses", {
        title : "OseRent SL Houses"
    });
}

// REQUESTS PAGE
exports.requests = (req, res) => {
    res.render("requests", {
        title : "OseRent SL Customers Requests"
    });
}

// AGENTS PAGE
exports.agents = (req, res) => {
    res.render("agents", {
        title : "OseRent SL Agents"
    });
}

// CONTACT PAGE
exports.contact = (req, res) => {
    res.render("contact", {
        title : "Contact Ose Rent SL"
    });
}

// CONTACT PAGE MESSAGE SENDING LOGIC
exports.contactPageLogic = (req, res) => {
    const mailOptions = {
        from: req.body.email,
        to: process.env.EMAIL,
        subject : `OSERENT SL CONTACT US PAGE - ${req.body.subject}`,
        html: `${req.body.message}<p>From ${req.body.name} </p>`
    }

    //Sending mail
    transport.sendMail(mailOptions, (err, mail) => {
        if(!err){
            const mailOptions2 = {
                from: process.env.EMAIL,
                to: req.body.email,
                subject : `OSERENT SL CUSTOMER CARE RE: ${req.body.subject}`,
                html: `<p>Dear ${req.body.name}, </p>
                <p>Thank you for contacting us using our contact page.</p>
                
                <p>We will ensure that one of our on desk help get unto you as soon as possible</p>
                
                <p>Thank you for using our services</p>
                
                <p>Regards</p>
                <p>OseRent SL Management</p>`
            }

            transport.sendMail(mailOptions2, (err, mail) => {
                if(!err){
                    res.redirect("/contact");
                }
            });
        }else{
            console.log(err);
        }
    });
}

// LOGIN PAGE
exports.login = (req, res) => {
    res.render("login", {
        title : "OseRent SL Agent Login Page"
    });
}

// LOGIN LOGIC
exports.loginLogic = (req, res, next) => {
    passport.authenticate("local", {
        successRedirect : "/agent",
        failureRedirect : "/login"
    })(req, res, next);
}
const   Request                 = require("../../models/request"),
        Agent                   = require("../../models/user"),
        Admin                   = require("../../models/user"),
        bcrypt                  = require("bcryptjs"),
        nodemailer              = require("nodemailer");

// CONFIG
require("dotenv").config();

// NODEMAILER TRANSPORT
const transport = nodemailer.createTransport({
    service : "gmail",
    auth : {
        type : "login",
        user : process.env.EMAIL,
        pass : process.env.PASSWORD
    }
});

// ROUTES
exports.index = (req, res) => {
    res.render('admin/index', {
        title: 'OseRent SL Admin Dashboard',
    });
}

// ADMINS
exports.admins = (req, res) => {
    Admin.find({})
    .then(admins => {
        if(admins){
            res.render('admin/admins', {
                title : "OseRent SL Admins",
                admins : admins
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

// ADD ADMIN FORM
exports.addadmin = (req, res) => {
    res.render("admin/register", {
        title : "OseRent SL Admin Registration"
    });
}

// ADD ADMIN FORM LOGIC
exports.addadminLogic = (req, res) => {
    if(req.body.password === req.body.repassword){
        bcrypt.genSalt(10)
        .then(salt => {
            bcrypt.hash(req.body.password, salt)
            .then(hash => {
                Admin.create({
                    name : req.body.name,
                    contact : req.body.contact,
                    email : req.body.email,
                    password : hash,
                    role : "Admin"
                })
                .then(admin => {
                    if(admin){
                        console.log("ADMIN ACCOUNT CREATED SUCCESSFULLY");
                        res.redirect("back");
                    }
                })
            })
        })
        .catch(err => {
            if(err){
                console.log(err);
                res.redirect("back");
            }
        });
    }
}

// ADMIN PROFILE
exports.editadmin = (req, res) => {
    Admin.findById({_id : req.params.id})
    .then(admin => {
        if(admin){
            res.render("admin/profile", {
                title : "OseRent SL Admin Profile",
                admin : admin
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

// UPDATE ADMIN INFORMATION LOGIC
exports.editAdminLogic = (req, res) => {
    Admin.findByIdAndUpdate({_id : req.params.id}, req.body)
    .then(admin => {
        if(admin){
            console.log("ADMIN INFORMATION UPDATED SUCCESSFULLY");
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

// DELETE ADMIN INFORMATION
exports.deleteadmin = (req, res) => {
    Admin.findOneAndDelete({_id : req.params.id})
    .then(admin => {
        if(admin){
            console.log("ADMIN INFORMATION DELETED SUCCESSFULLY");
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

// LOGIN PAGE
exports.login = (req, res) => {
    res.render("admin/login", {
        title : "OseRent SL Admin Login Page"
    });
}

// LOGIN LOGIC
exports.loginLogic = (req, res, next) => {
    passport.authenticate("local", {
        successRedirect : "/admin",
        failureRedirect : "/admin/login"
    })(req, res, next);
}

// LOGOUT
exports.logout = (req, res) => {
    req.logout();
    res.redirect("/admin/login");
}

// REQUESTS
exports.requests = (req, res) => {
    Request.find({})
    .then(requests => {
        if(requests){
            res.render("admin/requests", {
                title : "OseRent SL Customers Requests Section",
                requests : requests
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

// DELETE REQUEST
exports.deleterequest = (req, res) => {
    Request.findByIdAndDelete({_id : req.params.id})
    .then(request => {
        if(request){
            console.log("REQUEST DELETED SUCCESSFULLY");
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

// AGENTS
exports.agents = (req, res) => {
    Agent.find({})
    .then(agents => {
        if(agents){
            res.render("admin/agents", {
                title : "OseRent SL Agents",
                agents : agents
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

// ADD AGENT FORM
exports.addagent = (req, res) => {
    res.render("admin/addagent", {
        title : "OseRent SL Add Agent Form"
    });
}

// ADD AGENT LOGIC
exports.addagentLogic = (req, res) => {
    Agent.create({
        name : req.body.name,
        contact : req.body.contact,
        email : req.body.email,
        status : "Deactivated",
        role : "Agent"
    })
    .then(agent => {
        if(agent){
            const link = `${req.headers.host}/agent/setpassword/${agent._id}`;
            const mailOptions = {
                from: process.env.EMAIL,
                to: agent.email,
                subject: "OseRent SL Agent Account",
                html: `<p>Dear ${agent.name},</p> <p>Thank you for registering an account with us as an agent of OseRent SL.</p>
                <p>We want to take this moment to welcome you to our family and also give you a one time link to give your account a picture and a password.</p>
                <p>Please bear in mind that this link will only work once. Ensure you provide both your password and a picture that will be used on your account.</p>

                <a href=http://${link}>Click Here</a>

                <p>Thank you for registering</p>

                <p>Regards</p>

                <p>OseRent SL Management</p>
                `
            }

            transport.sendMail(mailOptions, (err, mail) => {
                if(!err){
                    console.log("MAIL SENT SUCCESSFULLY");
                    console.log("AGENT ACCOUNT CREATED SUCCESSFULLY");
                    res.redirect("back");
                }else{
                    console.log(err);
                    res.redirect("back");
                }
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

// VIEW AGENT INFORMATION
exports.viewagent = (req, res) => {
    Agent.findById({_id : req.params.id})
    .then(agent => {
        if(agent){
            res.render("agent/editAgent", {
                title : "OseRent SL Agent Information",
                agent : agent
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

// UPDATE AGENT INFORMATION LOGIC
exports.updateAgentStatus = (req, res) => {
    Agent.findById({_id : req.params.id})
    .then(agent => {
        if(agent.status === "Activated"){
            Agent.findByIdAndUpdate({_id : req.params.id}, {status : "Deactivated"})
            .then(agent => {
                if(agent){
                    console.log("AGENT STATUS UPDATED");
                    res.redirect("back");
                }
            })        
        }else if(agent.status === "Deactivated"){
            Agent.findByIdAndUpdate({_id : req.params.id}, {status : "Activated"})
            .then(agent => {
                if(agent){
                    console.log("AGENT STATUS UPDATED");
                    res.redirect("back");
                }
            })
        }
    })
    .catch(err => {
        if(err){
            console.log(err);
            res.redirect("back");
        }
    });
}

// DELETE AGENT INFORMATION
exports.deleteagent = (req, res) => {
    Agent.findByIdAndDelete({_id : req.params.id})
    .then(agent => {
        if(agent){
            console.log("AGENT INFORMATION DELETED SUCCESSFULLY");
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

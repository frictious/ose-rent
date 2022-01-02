const   House                   = require("../../models/house"),
        Agent                  = require("../../models/user"),
        Request                 = require("../../models/request"),
        passport                = require("passport"),
        mongoose                = require("mongoose"),
        bcrypt                  = require("bcryptjs"),
        crypto                  = require("crypto"),
        path                    = require("path"),
        multer                  = require("multer"),
        {GridFsStorage}         = require("multer-gridfs-storage"),
        Grid                    = require("gridfs-stream"),
        nodemailer              = require("nodemailer");

require("dotenv").config();

// CONFIG
require("../../config/login")(passport);

// NODEMAILER CONFIG
const transport = nodemailer.createTransport({
    service : "gmail",
    auth : {
        type : "login",
        user : process.env.EMAIL,
        pass : process.env.PASSWORD
    }
});

//GRIDFS File db connection
const URI = process.env.MONGOOSE;
const conn = mongoose.createConnection(URI, {
    useNewUrlParser : true,
    useUnifiedTopology : true
});

//GRIDFS CONFIG FOR IMAGES
let gfs;
conn.once('open', () => {
    gfs = Grid(conn.db, mongoose.mongo);
    gfs.collection("files");
});

//GRIDFS STORAGE CONFIG
const storage = new GridFsStorage({
    url: URI,
    options : {useUnifiedTopology : true},
    file: (req, file) => {
        return new Promise((resolve, reject) => {
            crypto.randomBytes(16, (err, buf) => {
            if (err) {
                return reject(err);
            }
            const filename = buf.toString('hex') + path.extname(file.originalname);
            const fileInfo = {
                filename: filename,
                bucketName: "files"
            };
            resolve(fileInfo);
            });
        });
    }
});

//Multer config for images
const files = multer({ storage });

//Uploading multiple house images
const cpUpload = files.fields([{ name: 'front', maxCount: 1 }, { name: 'back', maxCount: 1 },
{name : 'inside', maxCount : 1}, {name : 'outside', maxCount : 1}]);


// AGENT ROOT ROUTE
exports.index = (req, res) => {
    House.find({})
    .then(houses => {
        Request.find({})
        .then(requests => {
            res.render("agent/index", {
                title : "OseRent SL Agent Dashboard",
                houses : houses,
                requests : requests
            });
        })
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
    res.render("agent/login", {
        title : "OseRent SL Agent Login Page"
    });
}

// LOGIN LOGIC
exports.loginLogic = (req, res, next) => {
    passport.authenticate("local", {
        successRedirect : "/agent",
        failureRedirect : "/agent/login"
    })(req, res, next);
}

// LOGOUT LOGIC
exports.logout = (req, res) => {
    req.logout;
    res.redirect("/agent/login");
}

// PROFILE FORM
exports.profile = (req, res) => {
    Agent.findById({_id : req.params.id})
    .then(agent => {
        if(agent){
            res.render("agent/profile", {
                title : "OseRent SL Agent Profile",
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

// UPDATE PROFILE
exports.updateProfile = (req, res) => {
    if(req.body.picture === ""){
        Agent.findByIdAndUpdate({_id : req.params.id}, {
            name : req.body.name,
            contact : req.body.contact,
            email : req.body.email
        })
        .then(agent => {
            if(agent){
                console.log("AGENT PROFILE UPDATED SUCCESSFULLY");
                res.redirect("back");
            }
        })
        .catch(err => {
            if(err){
                console.log(err);
                res.redirect("back");
            }
        });
    }else{
        if(req.file.mimetype === "image/jpg" || req.file.mimetype === "image/png" || req.file.mimetype === "image/jpeg"){
            Agent.findByIdAndUpdate({_id : req.params.id}, {
                name : req.body.name,
                contact : req.body.contact,
                email : req.body.email,
                picture : req.file.filename,
                pictureName : req.file.originalname
            })
            .then(agent => {
                if(agent){
                    console.log("AGENT PROFILE UPDATED SUCCESSFULLY");
                    res.redirect("back");
                }
            })
            .catch(err => {
                if(err){
                    console.log(err);
                    res.redirect("back");
                }
            });
        }else{
            console.log("FILE MUST BE A PICTURE");
        }
    }
}

// SET PASSWORD FORM
exports.setpassword = (req, res) => {
    Agent.findById({_id : req.params.id})
    .then(agent => {
        if(agent){
            res.render("agent/setpassword", {
                title : "OseRent SL Agent Set Password and Profile Picture area",
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

// SET PASSWORD LOGIC
exports.setpasswordLogic = (req, res) => {
    if(req.body.password === req.body.repassword) {
        bcrypt.genSalt(10)
        .then(salt => {
            bcrypt.hash(req.body.password, salt)
            .then(hash => {
                if(req.file.mimetype === "image/jpg" || req.file.mimetype === "image/png" || req.file.mimetype === "image/jpeg"){
                    Agent.findByIdAndUpdate({_id : req.params.id}, {
                        password : hash,
                        status : "Activated",
                        picture : req.file.filename,
                        pictureName : req.file.originalname
                    })
                    .then(agent => {
                        if(agent){
                            console.log("AGENT PASSWORD AND PICTURE ADDED SUCCESSFULLY");
                            res.redirect("/agent/login");
                        }
                    })   
                }     
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

// FORGOT PASSWORD FORM
exports.forgotpassword = (req, res) => {
    res.render("agent/forgotpassword", {
        title : "OseRent SL Agent Forgot Password"
    });
}

// FORGOT PASSWORD LOGIC
exports.forgotpasswordLogic = (req, res) => {
    Agent.findOne({email : req.body.email})
    .then(agent => {
        const link = `${req.headers.host}/agent/resetpassword/${agent._id}`;
        const mailOptions = {
            from : process.env.EMAIL,
            to : req.body.email,
            subject : "OseRent SL Agent Reset Password",
            html : `<p>Dear ${agent.name},</p>
            <p>A request was made using your email to reset your password. </p>
            <p>If this was you, please use the link below to reset your password.</p>
            <p>If this was not you, please use the link below to reset your password/secure your account so others cannot gain access to your account.</p>
    
            <a href=http://${link}>Click Here</a>
    
            <p>Regards</p>
    
            <p>OseRent SL Management</p>
            `
        }

        transport.sendMail(mailOptions, (err, mail) => {
            if(!err){
                console.log("MAIL SENT TO AGENT SUCCESSFULLY");
                res.redirect("/agent/login");
            }
        });
    })
    .catch(err => {
        if(err){
            console.log(err);
            res.redirect("back");
        }
    });
}

// RESET PASSWORD FORM
exports.resetpassword = (req, res) => {
    Agent.findById({_id : req.params.id})
    .then(agent => {
        if(agent){
            res.render("agent/resetpassword", {
                title : "OseRent SL Agent Password Reset Form"
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

// RESET PASSWORD LOGIC
exports.resetpasswordLogic = (req, res) => {
    if(req.body.password === req.body.repassword){
        bcrypt.genSalt(10)
        .then(salt => {
            bcrypt.hash(req.body.password, salt)
            .then(hash => {
                Agent.findByIdAndUpdate({_id : req.params.id}, {password : hash})
                .then(agent => {
                    if(agent){
                        console.log("AGENT PASSWORD CHANGED SUCCESSFULLY");
                        res.redirect("/agent/login");
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
    }else{
        console.log("PASSWORDS DO NOT MATCH");
        res.redirect("back");
    }
}

// HOUSES
exports.houses = (req, res) => {
    Agent.findById({_id : req.user._id})
    .then(agent => {
        if(agent){
            House.find({agent : agent._id})
            .then(houses => {
                if(houses){
                    res.render("agent/house/houses", {
                        title : "OseRent SL Agents Houses",
                        houses : houses,
                        agent : agent
                    });
                }else{
                    res.render("agent/house/houses", {
                        title : "OseRent SL Agents Houses",
                        agent : agent
                    });
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

// GET ADD HOUSE FORM
exports.addHouse = (req, res) => {
    res.render("agent/house/addhouse", {
        title : "OseRent SL House Adding"
    });
}

// ADD HOUSE LOGIC
exports.addHouseLogic = (req, res) => {
    House.create({
        address : req.body.address,
        description : req.body.description,
        price : req.body.price,
        type : req.body.type,
        front : req.files['front'][0].filename,
        back : req.files['back'][0].filename,
        inside : req.files['inside'][0].filename,
        outside : req.files['outside'][0].filename,
        agent : req.user._id
    })
    .then(house => {
        if(house){
            console.log("HOUSE ADDED SUCCESSFULLY");
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

// VIEW HOUSE INFORMATION
exports.getHouse = (req, res) => {
    House.findById({_id : req.params.id})
    .then(house => {
        if(house){
            res.render("agent/house/viewhouse", {
                title : "Single House",
                house : house
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
            res.render("agent/house/updatehouse", {
                title : "OseRent SL Agent House Update",
                house : house
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

// REQUESTS
exports.requests = (req, res) => {
    Request.find({})
    .then(requests => {
        if(requests){
            res.render("agent/requests", {
                title : "OseRent SL Customers Requests",
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

// VIEW REQUEST
exports.viewrequest = (req, res) => {
    Request.findById({_id : req.params.id})
    .then(customer => {
        if(customer){
            res.render("agent/viewrequest", {
                title : "OseRent SL Customers Request",
                customer: customer
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

// CONTACT CUSTOMER
exports.contactcustomer = (req, res) => {
    Request.findById({_id : req.params.id})
    .then(customer => {
       if(customer){
           const mailOptions = {
               from: process.env.EMAIL,
               to: customer.email,
               subject : `RE: Request for ${customer.type}`,
               html: `${req.body.message}<p>From ${req.user.name} </p>`
           }
       
           //Sending mail
           transport.sendMail(mailOptions, (err, mail) => {
               if(!err){
                    console.log("MAIL SENT TO CUSTOMER");
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
    })
}

//Getting the files
exports.files = (req, res) => {
    gfs.files.findOne({filename : req.params.filename}, (err, foundFiles) => {
        if(foundFiles){
            const readstream = gfs.createReadStream(foundFiles.filename);
            readstream.pipe(res);
        }else{
            console.log(err);
        }
    });
}

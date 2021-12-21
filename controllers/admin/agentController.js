const   House                   = require("../../models/house"),
        Agents                  = require("../../models/user"),
        Request                 = require("../../models/request"),
        passport                = require("passport"),
        mongoose                = require("mongoose"),
        crypto                  = require("crypto"),
        path                    = require("path"),
        multer                  = require("multer"),
        {GridFsStorage}         = require("multer-gridfs-storage"),
        Grid                    = require("gridfs-stream");

// CONFIG
require("../../config/login")(passport);

require("dotenv").config();

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
    res.render("agent/index", {
        title : "OseRent SL Agent Dashboard"
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

// LOGOUT LOGIC
exports.logout = (req, res) => {
    req.logout();
    res.redirect("back");
}

// HOUSES
exports.houses = (req, res) => {
    House.find({})
    .then(houses => {
        if(houses){
            res.render("agent/house/houses", {
                title : "OseRent SL Agents Houses",
                houses : houses
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
        // agent : req.user.name
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

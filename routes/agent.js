const   express                     = require("express"),
        agentController             = require("../controllers/admin/agentController"),
        mongoose                    = require("mongoose"),
        crypto                      = require("crypto"),
        path                        = require("path"),
        multer                      = require("multer"),
        {GridFsStorage}             = require("multer-gridfs-storage"),
        Grid                        = require("gridfs-stream");

const router = express.Router();

require("dotenv").config();
//CONFIG

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

//Login checker
function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        if(req.user.role === "Agent" && req.user.status === "Activated"){
            return next();
        }else{
            res.redirect("/agent/logout");
        }
    }else{
        res.redirect("/agent/login");
    }
};

// ROOT ROUTE
router.get("/", isLoggedIn, agentController.index);

// SET PASSWORD
router.get("/setpassword/:id", agentController.setpassword);

// SET PASSWORD LOGIC
router.put("/setpassword/:id", files.single("picture"), agentController.setpasswordLogic);

// HOUSES
router.get("/houses", isLoggedIn, agentController.houses);

// ADD HOUSE FORM
router.get("/house/add", isLoggedIn, agentController.addHouse);

// VIEW HOUSE
router.get("/house/:id", isLoggedIn, agentController.getHouse);

// ADD HOUSE LOGIC
router.post("/house/add", cpUpload, agentController.addHouseLogic);

// UPDATE HOUSE
router.get("/house/:id/edit", isLoggedIn, agentController.updateHouse);

// UPDATE HOUSE LOGIC
router.put("/house/:id", agentController.updateHouseLogic);

// DELETE HOUSE
router.delete("/house/:id", agentController.deleteHouse);

// REQUESTS
router.get("/requests", isLoggedIn, agentController.requests);

// VIEW REQUEST
router.get("/request/:id", isLoggedIn, agentController.viewrequest);

// SEND MESSAGE TO CUSTOMER
router.get("/customer/:id", isLoggedIn, agentController.contactcustomer);

// LOGIN
router.get("/login", agentController.login);

// LOGIN LOGIC
router.post("/login", agentController.loginLogic);

// LOGOUT ROUTE
router.get("/logout", agentController.logout);

// PROFILE ROUTE
router.get("/profile/:id", agentController.profile);

// UPDATE PROFILE LOGIC
router.put("/profile/:id", files.single("picture"), agentController.updateProfile);

// RESET PASSWORD
router.get("/resetpassword/:id", agentController.resetpassword);

// RESET PASSWORD LOGIC
router.put("/resetpassword/:id", agentController.forgotpasswordLogic);

// FORGOT PASSWORD
router.get("/forgotpassword", agentController.forgotpassword);

// FORGOT PASSWORD LOGIC
router.post("/forgotpassword", agentController.forgotpasswordLogic);

// GET FILES
router.get("/files/:filename", agentController.files);

module.exports = router;

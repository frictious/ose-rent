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


// ROOT ROUTE
router.get("/", agentController.index);

// SET PASSWORD
router.get("/setpassword/:id", agentController.setpassword);

// SET PASSWORD LOGIC
router.put("/setpassword/:id", files.single("picture"), agentController.setpasswordLogic);

// HOUSES
router.get("/houses", agentController.houses);

// ADD HOUSE FORM
router.get("/house/add", agentController.addHouse);

// VIEW HOUSE
router.get("/house/:id", agentController.getHouse);

// ADD HOUSE LOGIC
router.post("/house/add", cpUpload, agentController.addHouseLogic);

// UPDATE HOUSE
router.get("/house/:id/edit", agentController.updateHouse);

// UPDATE HOUSE LOGIC
router.put("/house/:id", agentController.updateHouseLogic);

// DELETE HOUSE
router.delete("/house/:id", agentController.deleteHouse);

// REQUESTS
router.get("/requests", agentController.requests);

// VIEW REQUEST
router.get("/request/:id", agentController.viewrequest);

// SEND MESSAGE TO CUSTOMER
router.get("/customer/:id", agentController.contactcustomer);

// GET FILES
router.get("/files/:filename", agentController.files);

module.exports = router;

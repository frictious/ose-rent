const   express                 = require("express"),
        indexController         = require("../controllers/indexController");

const router = express.Router();

// INDEX ROUTE
router.get("/", indexController.index);

// ABOUT ROUTE
router.get("/about", indexController.about);

// CONTACT ROUTE
router.get("/contact", indexController.contact);

module.exports = router;

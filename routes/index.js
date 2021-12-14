const   express                 = require("express"),
        indexController         = require("../controllers/indexController");

const router = express.Router();

// INDEX ROUTE
router.get("/", indexController.index);

// ABOUT ROUTE
router.get("/about", indexController.about);

// HOUSES ROUTE
router.get("/houses", indexController.houses);

// REQUESTS ROUTE
router.get("/requests", indexController.requests);

// AGENTS ROUTE
router.get("/agents", indexController.agents);

// CONTACT ROUTE
router.get("/contact", indexController.contact);

// CONTACT PAGE MESSAGE LOGIC
router.post("/contact", indexController.contactPageLogic);

module.exports = router;

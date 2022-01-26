const   express                 = require("express"),
        adminController         = require("../controllers/admin/adminController");

const router = express.Router();

//Login checker
function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        if(req.user.role === "Admin"){
            return next();
        }else{
            res.redirect("/admin/logout");
        }
    }else{
        res.redirect("/admin/login");
    }
};

// ROUTES
router.get("/", isLoggedIn, adminController.index);

// REQUESTS
router.get("/requests", isLoggedIn, adminController.requests);

// AGENTS
router.get("/agents", isLoggedIn, adminController.agents);

// GET ADD AGENTS FORM
router.get("/agent/add", isLoggedIn, adminController.addagent);

// ADD AGENTS FORM LOGIC
router.post("/agent/add", adminController.addagentLogic);

// VIEW AGENT INFORMATION
router.get("/agent/:id", isLoggedIn, adminController.viewagent);

// UPDATE AGENT STATUS
router.put("/agent/status/:id", adminController.updateAgentStatus);

// DELETE AGENT INFORMATION
router.delete("/agent/:id", adminController.deleteagent);

// ADMINS
router.get("/admins", isLoggedIn, adminController.admins);

// ADD ADMIN FORM
router.get("/add", isLoggedIn, adminController.addadmin);

// ADD ADMIN FORM LOGIC
router.post("/add", adminController.addadminLogic);

// ADMIN PROFILE
router.get("/profile/:id", isLoggedIn, adminController.editadmin);

// UPDATE ADMIN INFORMATION LOGIC
router.put("/profile/:id", adminController.editAdminLogic);

// DELETE ADMIN INFORMATION
router.delete("/:id", adminController.deleteadmin);

// LOGIN FORM
router.get("/login", adminController.login);

// LOGIN FORM LOGIC
router.post("/login", adminController.loginLogic);

// LOGOUT
router.get("/logout", adminController.logout);

// DELETE REQUEST
router.delete("/request/:id", adminController.deleterequest);

module.exports = router;

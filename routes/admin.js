const   express                 = require("express"),
        adminController         = require("../controllers/admin/adminController");

const router = express.Router();

// ROUTES
router.get("/", adminController.index);

// REQUESTS
router.get("/requests", adminController.requests);

// AGENTS
router.get("/agents", adminController.agents);

// GET ADD AGENTS FORM
router.get("/agent/add", adminController.addagent);

// ADD AGENTS FORM LOGIC
router.post("/agent/add", adminController.addagentLogic);

// VIEW AGENT INFORMATION
router.get("agent/:id", adminController.viewagent);

// UPDATE AGENT STATUS
router.put("agent/status/:id", adminController.updateAgentStatus);

// DELETE AGENT INFORMATION
router.delete("agent/:id", adminController.deleteagent);

// ADMINS
router.get("/admins", adminController.admins);

// ADD ADMIN FORM
router.get("/add", adminController.addadmin);

// ADD ADMIN FORM LOGIC
router.post("/add", adminController.addadminLogic);

// VIEW ADMIN INFORMATION
router.get("/edit/:id", adminController.editadmin);

// UPDATE ADMIN INFORMATION LOGIC
router.put("/edit/:id", adminController.editAdminLogic);

// DELETE ADMIN INFORMATION
router.delete("/:id", adminController.deleteadmin);

// LOGIN FORM
router.get("/login", adminController.login);

// LOGIN FORM LOGIC
router.post("/login", adminController.loginLogic);

// LOGOUT
router.get("/logout", adminController.logout);

module.exports = router;

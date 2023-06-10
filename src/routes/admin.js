const router = require("express").Router();
const adminController = require("../controllers/admin");


// Settings Start
// [GET]
router.get("/settings", adminController.settingsIndex);

// [POST]
router.post("/settings/save", adminController.settingsStore);
// Settings End

// Categories Start
// [GET]
router.get("/categories", adminController.categoriesIndex);
router.get("/categories/add", adminController.categoriesAdd);
// Categories End

// Posts Start
// [GET]
router.get("/posts", adminController.postsIndex);
// Posts End

// Dashboard Start
// [GET] 
router.get("/", adminController.dashboardIndex);
// Dashboard End

module.exports = router;

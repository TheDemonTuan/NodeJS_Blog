const router = require("express").Router();
const adminController = require("../controllers/admin");


//----------------------------------------------Settings----------------------------------------------
// [GET]
router.get("/settings", adminController.settingsIndex);
// [POST]
router.post("/settings/save", adminController.settingsStore);

//----------------------------------------------Categories----------------------------------------------
// [GET]
router.get("/categories", adminController.categoriesIndex);
router.get("/categories/add", adminController.categoriesAdd);
router.get("/categories/edit/:id", adminController.categoriesEdit);
router.get("/categories/delete/:id", adminController.categoriesDelete);
// [POST]
router.post("/categories/add", adminController.categoriesStore);
router.post("/categories/edit/:id", adminController.categoriesUpdate);
router.post("/categories/delete/:id", adminController.categoriesDestroy);


//----------------------------------------------Posts----------------------------------------------
// [GET]
router.get("/posts", adminController.postsIndex);

//----------------------------------------------Dashboard----------------------------------------------
// [GET] 
router.get("/", adminController.dashboardIndex);


module.exports = router;

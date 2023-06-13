const router = require("express").Router();
const adminController = require("../controllers/admin");


//----------------------------------------------Settings----------------------------------------------
// [GET]
router.get("/settings", adminController.settingsIndex);
// [POST]
router.post("/settings/save", adminController.settingsStore);

//----------------------------------------------Users----------------------------------------------
// [GET]
router.get("/users", adminController.usersIndex);
router.get("/users/add", adminController.usersAdd);
router.get("/users/edit/:id", adminController.usersEdit);
router.get("/users/delete/:id", adminController.usersDelete);
// [POST]
router.post("/users/add", adminController.usersStore);
router.post("/users/edit/:id", adminController.usersUpdate);
router.post("/users/delete/:id", adminController.usersDestroy);

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

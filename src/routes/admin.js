const router = require("express").Router();
const adminController = require("../controllers/admin");
const thumbnailUpload = require("../middlewares/posts/thumbnailUpload");

//----------------------------------------------Dashboard----------------------------------------------
router.route("/dashboard").get(adminController.dashboardIndex);

//----------------------------------------------Settings----------------------------------------------
router.route("/settings").get(adminController.settingsIndex);
router.route("/settings/save").post(adminController.settingsUpdate);

//----------------------------------------------Users----------------------------------------------
router.route("/users").get(adminController.usersIndex);
router.route("/users/add").get(adminController.usersAdd).post(adminController.usersStore);
router.route("/users/edit/:id").get(adminController.usersEdit).post(adminController.usersUpdate);
router.route("/users/delete/:id").get(adminController.usersDelete).post(adminController.usersDestroy);

//----------------------------------------------Categories----------------------------------------------
router.route("/categories").get(adminController.categoriesIndex);
router.route("/categories/add").get(adminController.categoriesAdd).post(adminController.categoriesStore);
router.route("/categories/edit/:id").get(adminController.categoriesEdit).post(adminController.categoriesUpdate);
router.route("/categories/delete/:id").get(adminController.categoriesDelete).post(adminController.categoriesDestroy);

//----------------------------------------------Tags----------------------------------------------
router.route("/tags").get(adminController.tagsIndex);
router.route("/tags/add").get(adminController.tagsAdd).post(adminController.tagsStore);
router.route("/tags/edit/:id").get(adminController.tagsEdit).post(adminController.tagsUpdate);
router.route("/tags/delete/:id").get(adminController.tagsDelete).post(adminController.tagsDestroy);

//----------------------------------------------Posts----------------------------------------------
router.route("/posts").get(adminController.postsIndex);
router.route("/posts/add").get(adminController.postsAdd).post(thumbnailUpload.add, adminController.postsStore);
router.route("/posts/edit/:id").get(adminController.postsEdit).post(thumbnailUpload.edit, adminController.postsUpdate);
router.route("/posts/delete/:id").get(adminController.postsDelete).post(adminController.postsDestroy);


module.exports = router;

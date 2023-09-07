const express = require("express");
const router = express.Router();
const usersController = require("../controller/users");

router
  .get("/", usersController.getAllUsers)
  .post("/register/:role", usersController.registerUsers)
  .get('/verify',usersController.VerifyAccount)
  .post("/login", usersController.loginUsers)
  .get("/:id", usersController.getSelectUsers)
  .put("/:id",  usersController.updateUsers)
  .delete("/:id", usersController.deleteUsers);
module.exports = router;

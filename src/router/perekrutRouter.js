const express = require("express");
const router = express.Router();
const perekrutController = require("../controller/perekrut");
const  uploadPerekrut =require("../middlewares/uploadPerekrut")

router
  .get("/", perekrutController.selectAllPerekrut )
  .get("/profile/:id",perekrutController.getDetailPerekrut )
  .put("/profile/edit/:id",uploadPerekrut,perekrutController.updatePerekrut)
  .delete("/:id",perekrutController.deletePerekrut );
module.exports = router;

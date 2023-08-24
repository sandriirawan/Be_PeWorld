const express = require("express");
const router = express.Router();
const pengalamanController = require("../controller/pengalaman");
const  uploadPengalaman =require("../middlewares/uploadPengalaman")

router
  .get("/", pengalamanController.selectAllPengalaman)
  .get("/:id", pengalamanController.selectPengalaman)
  .post("/", uploadPengalaman,pengalamanController.insertPengalaman)
  .put("/:id", uploadPengalaman,pengalamanController.updatePengalaman)
  .delete("/:id", pengalamanController.deletePengalaman);
module.exports = router;

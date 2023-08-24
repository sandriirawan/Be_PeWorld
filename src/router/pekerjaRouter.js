const express = require("express");
const router = express.Router();
const pekerjaController = require("../controller/pekerja");
const  updatePekerja = require('../middlewares/uploadpekerja');


router
  .get("/", pekerjaController.selectAllPekerja )
  .get("/profile/:id", pekerjaController.getDetailPekerja )
  .put("/profile/edit/:id",updatePekerja,pekerjaController.updatePekerja)
  .delete("/:id",pekerjaController.deletePekerja );
module.exports = router;

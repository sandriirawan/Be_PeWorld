const express = require("express");
const router = express.Router();
const portofolioController = require("../controller/portofolio");
const  uploadPortofolio =require("../middlewares/uploadPortofolio")

router
  .get("/", portofolioController.selectAllPortofolio)
  .get("/:id", portofolioController.selectPortofolio)
  .post("/", uploadPortofolio,portofolioController.insertPortofolio)
  .put("/:id", uploadPortofolio,portofolioController.updatePortofolio)
  .delete("/:id", portofolioController.deletePortofolio);
module.exports = router;

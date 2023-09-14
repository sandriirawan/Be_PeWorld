const express = require("express");
const router = express.Router();
const hireController = require("../controller/hire");
router
  .post("/", hireController.createHire)
  .get("/", hireController.getAllHire)
  .get("/pekerja/:id", hireController.getSelectHirePekerja)
  .get("/perekrut/:id", hireController.getSelectHirePerekrut)
  .delete("/:id", hireController.deleteHire);
module.exports = router;
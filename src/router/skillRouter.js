const express = require("express");
const router = express.Router();
const skillsController = require("../controller/skill");


router
  .get("/", skillsController.selectAllSkill)
  .get("/:id", skillsController.selectSkill)
  // .post("/", skillsController.insertSkill)
  .put("/:id", skillsController.updateSkill)
  .delete("/:id", skillsController.deleteSkill);
module.exports = router;

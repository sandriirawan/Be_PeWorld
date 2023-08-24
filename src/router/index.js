const express = require("express");
const router = express.Router();
const usersRouter = require("../router/usersRouter");
const perekrutRouter = require("../router/perekrutRouter");
const pekerjaRouter = require("../router/pekerjaRouter");
const pengalamanRouter = require("../router/pengalamanRouter");
const portofolioRouter = require("../router/portofolioRouter");
const skillRouter = require("../router/skillRouter");




router.use("/users", usersRouter);
router.use("/perekrut", perekrutRouter);
router.use("/pekerja", pekerjaRouter);
router.use("/pengalaman", pengalamanRouter);
router.use("/portofolio", portofolioRouter);
router.use("/skill", skillRouter);



module.exports = router;

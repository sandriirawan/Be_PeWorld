const commonHelper = require("../helper/common");
const { v4: uuidv4 } = require("uuid");
const Joi = require("joi");
const {
  selectAllSkill,
  selectSkill,
  insertSkill,
  updateSkill,
  deleteSkill,
  countData,
  findID,
} = require("../model/skill");

const skillsController = {
    selectAllSkill: async (req, res) => {
    try {
      const page = Number(req.query.page) || 1;
      const limit = Number(req.query.limit) || 100;
      const offset = (page - 1) * limit;
      const sortby = req.query.sortby || "id";
      const sort = req.query.sort || "ASC";
      const result = await selectAllSkill({ limit, offset, sort, sortby });
      const {
        rows: [count],
      } = await countData();
      const totalData = parseInt(count.count);
      const totalPage = Math.ceil(totalData / limit);
      const pagination = {
        currentPage: page,
        limit: limit,
        totalData: totalData,
        totalPage: totalPage,
      };

      commonHelper.response(
        res,
        result.rows,
        200,
        "get data success",
        pagination
      );
    } catch (error) {
      console.log(error);
    }
  },

  selectSkill: async (req, res) => {
    const users_id = String(req.params.id);
    const { rowCount } = await findID(users_id);
    if (!rowCount) {
      return res.json({ message: "ID Not Found" });
    }
    selectSkill(users_id)
      .then((result) =>
        commonHelper.response(res, result.rows, 200, "get data success")
      )
      .catch((err) => res.send(err));
  },

  //  insertSkill : async (req, res) => {
  //   const { users_id, nama_skill } = req.body;
  //   const id = uuidv4();
  //   const skillArray = nama_skill.split(",").map((skill) => skill.trim());
  
  //   const data = {
  //     id,
  //     users_id,
  //     nama_skill: skillArray,
  //   };
  
  //   insertSkill(data)
  //     .then((result) =>
  //       commonHelper.response(res, result.rows, 201, "Create Product Success")
  //     )
  //     .catch((err) => res.send(err));
  // },
  
  updateSkill: async (req, res) => {
    try {
      const users_id = String(req.params.id);
      const { nama_skill } = req.body;
      const { rowCount } = await findID(users_id);
      if (!rowCount) {
        res.json({ message: "ID Not Found" });
      }
      const data = {
        users_id, 
        nama_skill:nama_skill|| "",
      };
      updateSkill(data)
        .then((result) =>
          commonHelper.response(
            res,
            result.rows,
            200,
            "Update skill Success"
          )
        )
        .catch((err) => res.send(err));
    } catch (error) {
      console.log(error);
    }
  },
  deleteSkill: async (req, res, next) => {
    try {
      const users_id = String(req.params.id);
      const { rowCount } = await findID(users_id);

      if (!rowCount) {
        res.json({ message: "ID Not Found" });
      }
      deleteSkill(id)
        .then((result) =>
          commonHelper.response(
            res,
            result.rows,
            200,
            "Delete skill Success"
          )
        )
        .catch((err) => res.send(err));
    } catch (error) {
      console.log(error);
    }
  },
};

module.exports = skillsController;

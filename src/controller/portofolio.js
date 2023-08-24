const commonHelper = require("../helper/common");
const { v4: uuidv4 } = require("uuid");
const cloudinary = require("../middlewares/cloudinary");
const Joi = require('joi');
const {
  selectAllPortofolio,
  selectPortofolio,
  insertPortofolio,
  updatePortofolio,
  deletePortofolio,
  countData,
  findID,
  findUsersID,
} = require("../model/portofolio");
const portofolioSchema = Joi.object({
  users_id: Joi.string().required(),
  nama_aplikasi: Joi.string().required().messages({
    'string.empty': 'Nama aplikasi tidak boleh kosong',
  }),
  link_repo: Joi.string()
    .uri({ scheme: ['http', 'https'] }) 
    .message('Invalid repository link format'),
  tipe: Joi.string().required(),
});


const portofolioController = {
  selectAllPortofolio: async (req, res) => {
    try {
      const page = Number(req.query.page) || 1;
      const limit = Number(req.query.limit) || 100;
      const offset = (page - 1) * limit;
      const sortby = req.query.sortby || "id";
      const sort = req.query.sort || "ASC";
      const result = await selectAllPortofolio({ limit, offset, sort, sortby });
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

  selectPortofolio: async (req, res) => {
    const users_id = String(req.params.id);
    const { rowCount } = await findUsersID(users_id);
    if (!rowCount) {
      return res.json({ message: "ID Not Found" });
    }
    selectPortofolio(users_id)
      .then((result) =>
        commonHelper.response(res, result.rows, 200, "get data success")
      )
      .catch((err) => res.send(err));
  },
  insertPortofolio: async (req, res) => {
    try {
      const { error } = portofolioSchema.validate(req.body, {
        abortEarly: false,
      });
      if (error) {
        res.status(400).json({ message: error.message });
        return;
      }
      const result = await cloudinary.uploader.upload(req.file.path);
      const { users_id, nama_aplikasi, link_repo, tipe } = req.body;
      const id = uuidv4();
      const data = {
        id,
        users_id,
        nama_aplikasi,
        link_repo,
        tipe,
        photo: result.secure_url,
      };
      insertPortofolio(data)
        .then((result) =>
          commonHelper.response(res, result.rows, 201, "Create portofolio Success")
        )
        .catch((err) => res.status(500).send(err.message));
    } catch (error) {
      res.status(500).send(error.message);
    }
  },
  

  updatePortofolio: async (req, res) => {
    try {
      const users_id = String(req.params.id);
      const result = await cloudinary.uploader.upload(req.file.path);
      const { nama_aplikasi, link_repo, tipe } = req.body;
      const { rowCount } = await findUsersID(users_id);
      if (!rowCount) {
        res.json({ message: "ID Not Found" });
      }

      const data = {
        users_id,
        nama_aplikasi,
        link_repo,
        tipe,
        photo: result.secure_url,
      };
      updatePortofolio(data);
      commonHelper.response(res, {}, 200, "Update Success");
    } catch (error) {
      res.status(500).send(error.message);
    }
  },
  
  deletePortofolio: async (req, res, next) => {
    try {
      const id = String(req.params.id);
      const { rowCount } = await findID(id);

      if (!rowCount) {
        res.json({ message: "ID Not Found" });
      }
      deletePortofolio(id)
        .then((result) =>
          commonHelper.response(
            res,
            result.rows,
            200,
            "Delete portofolio Success"
          )
        )
        .catch((err) => res.send(err));
    } catch (error) {
      console.log(error);
    }
  },
};

module.exports = portofolioController;

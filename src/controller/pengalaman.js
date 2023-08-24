const commonHelper = require("../helper/common");
const { v4: uuidv4 } = require("uuid");
const cloudinary = require("../middlewares/cloudinary");
const Joi = require("joi");
const {
  selectAllPengalaman,
  selectPengalaman,
  insertPengalaman,
  updatePengalaman,
  deletePengalaman,
  countData,
  findID,
  findUsersID,
} = require("../model/pengalaman");

const pengalamanSchema = Joi.object({
  posisi: Joi.string().required().messages({
    'string.empty': 'Posisi tidak boleh kosong',
  }),
  nama_perusahaan: Joi.string().required().messages({
    'string.empty': 'Nama perusahaan tidak boleh kosong',
  }),
  deskripsi: Joi.string().max(10000).required().messages({
    'string.empty': 'Deskripsi tidak boleh kosong',
    'string.max': 'Deskripsi tidak boleh lebih dari 500 karakter',
  }),
});

const pengalamanController = {
  selectAllPengalaman: async (req, res) => {
    try {
      const page = Number(req.query.page) || 1;
      const limit = Number(req.query.limit) || 100;
      const offset = (page - 1) * limit;
      const sortby = req.query.sortby || "id";
      const sort = req.query.sort || "ASC";
      const result = await selectAllPengalaman({ limit, offset, sort, sortby });
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

  selectPengalaman: async (req, res) => {
    const users_id = String(req.params.id);
    const { rowCount } = await findUsersID(users_id);
    if (!rowCount) {
      return res.json({ message: "ID Not Found" });
    }
    selectPengalaman(users_id)
      .then((result) =>
        commonHelper.response(res, result.rows, 200, "get data success")
      )
      .catch((err) => res.send(err));
  },

  insertPengalaman: async (req, res) => {
    try {
  
      const { error } = pengalamanSchema.validate(req.body, {
        abortEarly: false,
        allowUnknown: true,
      });
      if (error) {
        res.status(400).json({ message: error.message });
        return;
      }
  
      const { file } = req;
      let foto_perusahaan = "";
      if (file && file.path) {
        const result = await cloudinary.uploader.upload(file.path);
        foto_perusahaan = result.secure_url;
      }
  
      const {
        users_id,
        posisi,
        nama_perusahaan,
        tahun_masuk,
        tahun_keluar,
        deskripsi,
      } = req.body;
      
      const id = uuidv4();
      const data = {
        id,
        users_id,
        posisi,
        nama_perusahaan,
        foto_perusahaan: foto_perusahaan || "",
        tahun_masuk,
        tahun_keluar,
        deskripsi,
      };
      
      insertPengalaman(data)
        .then((result) =>
          commonHelper.response(res, result.rows, 201, "Create Success")
        )
        .catch((err) => res.status(500).send(err.message));
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Internal server error" });
    }
  },

  updatePengalaman: async (req, res) => {
    try {
      const { error } = pengalamanSchema.validate(req.body, {
        abortEarly: false,
        allowUnknown: true,
      });
      if (error) {
        res.status(400).json({ message: error.message });
        return;
      }
      const id = String(req.params.id);

      const { file } = req;
      let foto_perusahaan = "";
      if (file && file.path) {
        const result = await cloudinary.uploader.upload(file.path);
        foto_perusahaan = result.secure_url;
      }

      const { posisi, nama_perusahaan, tahun_masuk, tahun_keluar, deskripsi } =
        req.body;

      const { rowCount } = await findID(id);
      if (!rowCount) {
        res.json({ message: "ID Not Found" });
      }

      const data = {
        id,
        posisi,
        nama_perusahaan,
        foto_perusahaan: foto_perusahaan || "",
        tahun_masuk,
        tahun_keluar,
        deskripsi,
      };
      updatePengalaman(data)
      commonHelper.response(res, {}, 200, "Update Success");
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Internal server error" });
    }
  },

  deletePengalaman: async (req, res, next) => {
    try {
      const id = String(req.params.id);
      const { rowCount } = await findID(id);

      if (!rowCount) {
        res.json({ message: "ID Not Found" });
      }
      deletePengalaman(id)
        .then((result) =>
          commonHelper.response(
            res,
            result.rows,
            200,
            "Delete Pengalaman Success"
          )
        )
        .catch((err) => res.send(err));
    } catch (error) {
      console.log(error);
    }
  },
};

module.exports = pengalamanController;

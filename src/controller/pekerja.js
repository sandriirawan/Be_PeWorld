const commonHelper = require("../helper/common");
const Joi = require("joi");
const { v4: uuidv4 } = require("uuid");

const {
  selectAllPekerja,
  getDetailPekerja,
  updatePekerja,
  deletePekerja,
  countData,
  findID,
  findId,
} = require("../model/pekerja");
const cloudinary = require("../middlewares/cloudinary");
const updatePekerjaSchema = Joi.object({
  job_desk: Joi.string().allow(""),
  deskripsi_singkat: Joi.string().allow(""),
  foto_pekerja: Joi.string().allow(""),
  tempat_kerja: Joi.string().allow(""),
  kota: Joi.string().allow(""),
  provinsi: Joi.string().allow(""),
  instagram: Joi.string().allow(""),
  github: Joi.string().allow(""),
  linkedin: Joi.string().allow(""),
  email: Joi.string().allow(""),
  name: Joi.string().allow(""),
});

const pekerjaController = {
  selectAllPekerja: async (req, res) => {
    try {
      const page = Number(req.query.page) || 1;
      const limit = Number(req.query.limit) || 100;
      const offset = (page - 1) * limit;
      const sortby = req.query.sortby || "id";
      const sort = req.query.sort || "ASC";
      const result = await selectAllPekerja({ limit, offset, sort, sortby });
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

  getDetailPekerja: async (req, res) => {
    const users_id = req.params.id;
    const { rowCount } = await findID(users_id);
    if (!rowCount) {
      return res.json({ message: "ID Not Found" });
    }
    try {
      const result = await getDetailPekerja(users_id);
      commonHelper.response(res, result.rows, 200, "get data success");
    } catch (err) {
      res.send(err);
    }
  },

  updatePekerja: async (req, res) => {
    try {
      const { error } = updatePekerjaSchema.validate(req.body);
      if (error) {
        res.status(400).json({ message: error.message });
        return;
      }

      const users_id = String(req.params.id);

      const getUserId = await getDetailPekerja(users_id);
      const user = getUserId.rows[0];

      const { file } = req;
      let foto_pekerja = user.photo;
      if (file && file.path) {
        const result = await cloudinary.uploader.upload(file.path);
        foto_pekerja = result.secure_url;
      }
      const {
        job_desk,
        deskripsi_singkat,
        tempat_kerja,
        kota,
        provinsi,
        instagram,
        github,
        linkedin,
        email,
        name,
      } = req.body;

      const { rowCount } = await findID(users_id);
      if (!rowCount) {
        res.json({ message: "ID Not Found" });
        return;
      }

      const data = {
        users_id,
        foto_pekerja: foto_pekerja || user.foto_pekerja,
        job_desk: job_desk || user.job_desk,
        deskripsi_singkat: deskripsi_singkat || user.deskripsi_singkat,
        tempat_kerja: tempat_kerja || user.tempat_kerja,
        kota: kota || user.kota,
        provinsi: provinsi || user.provinsi,
        instagram: instagram || user.instagram,
        github: github || user.github,
        linkedin: linkedin || user.linkedin,
        email: email || user.email,
        name: name || user.name,
      };

      await updatePekerja(data);
      commonHelper.response(
        res,
        {},
        200,
        `Update Data Diri Success, ${data.foto_pekerja}, ${data.name}`
      );
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Internal server error" });
    }
  },

  deletePekerja: async (req, res, next) => {
    try {
      const id = String(req.params.id);
      const { rowCount } = await findId(id);

      if (!rowCount) {
        res.json({ message: "ID Not Found" });
      }
      deletePekerja(id)
        .then((result) =>
          commonHelper.response(res, result.rows, 200, "Delete Pekerja Success")
        )
        .catch((err) => res.send(err));
    } catch (error) {
      console.log(error);
      res.status(500).send(err.message);
    }
  },
};

module.exports = pekerjaController;

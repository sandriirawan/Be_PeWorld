const commonHelper = require("../helper/common");
const Joi = require('joi');
const {
    selectAllPerekrut,
    getDetailPerekrut,
    updatePerekrut,
    deletePerekrut,
    countData,
    findID,
    findId,
} = require("../model/perekrut");
const cloudinary = require("../middlewares/cloudinary");
const updatePerekrutSchema = Joi.object({
  nama_perusahaan: Joi.string().allow(''),
  bidang_perusahaan: Joi.string().allow(''),
  provinsi: Joi.string().allow(''),
  kota: Joi.string().allow(''),
  info_perusahaan: Joi.string().allow(''),
  email_perusahaan: Joi.string().allow(''),
  phone_perusahaan: Joi.string().allow(''),
  linkedin: Joi.string().allow(''),
  jabatan: Joi.string().allow(''),
});

const perekrutController = {
    selectAllPerekrut: async (req, res) => {
    try {
      const page = Number(req.query.page) || 1;
      const limit = Number(req.query.limit) || 100;
      const offset = (page - 1) * limit;
      const sortby = req.query.sortby || "id";
      const sort = req.query.sort || "ASC";
      const result = await selectAllPerekrut({ limit, offset, sort, sortby });
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

  getDetailPerekrut: async (req, res) => {
    const users_id = req.params.id;
    const { rowCount } = await findID(users_id);
    if (!rowCount) {
      return res.json({ message: "ID Not Found" });
    }
    try {
      const result = await getDetailPerekrut(users_id);
      commonHelper.response(res, result.rows, 200, "get data success");
    } catch (err) {
      res.send(err);
    }
  },


  updatePerekrut: async (req, res) => {
    try {
      const { error } = updatePerekrutSchema.validate(req.body, {
        abortEarly: false,
        allowUnknown: true,
      });

      if (error) {
        res.status(400).json({ message: error.message });
        return;
      }
      const users_id = String(req.params.id);
      const { file } = req;
  
      const getUserId = await getDetailPerekrut(users_id);
      const user = getUserId.rows[0];

  
      if (file && file.path) {
        const result = await cloudinary.uploader.upload(req.file.path);
        foto_perusahaan = result.secure_url;
      }
      const {
        nama_perusahaan,
        bidang_perusahaan,
        provinsi,
        kota,
        info_perusahaan,
        email_perusahaan,
        phone_perusahaan,
        linkedin,
        jabatan, 
      } = req.body;
  
      const { rowCount } = await findID(users_id);
      if (!rowCount) {
        res.json({ message: "ID Not Found" });
        return;
      }
  
      const data = {
        users_id,
        foto_perusahaan: foto_perusahaan|| user.foto_perusahaan,
        nama_perusahaan: nama_perusahaan|| "",
        bidang_perusahaan: bidang_perusahaan|| "",
        provinsi: provinsi|| "",
        kota: kota|| "",
        info_perusahaan: info_perusahaan|| "",
        email_perusahaan: email_perusahaan|| "",
        phone_perusahaan: phone_perusahaan|| "",
        linkedin: linkedin|| "",
        jabatan: jabatan|| "", 
      };
  
      updatePerekrut(data)
      commonHelper.response(res, {}, 200, "Update Success");
    } catch (error) {
      console.log(error);
      res.status(500).send(error.message);
    }
  },
  
  deletePerekrut: async (req, res, next) => {
    try {
      const id = String(req.params.id);
      const { rowCount } = await findId(id);

      if (!rowCount) {
        res.json({ message: "ID Not Found" });
      }
      deletePerekrut(id)
        .then((result) =>
          commonHelper.response(
            res,
            result.rows,
            200,
            "Delete perekrut Success"
          )
        )
        .catch((err) => res.send(err));
    } catch (error) {
      console.log(error);
      res.status(500).send(err.message);
    }
  },
};

module.exports = perekrutController;

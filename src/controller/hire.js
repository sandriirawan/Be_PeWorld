const { v4: uuidv4 } = require("uuid");
const commonHelper = require("../helper/common");
let {
  selectAllHire,
  selectHirePekerja,
  selectHirePerekrut,
  deleteHire,
  createHire,
  findUUID,
  countData,
} = require("../model/hire");
const sendemailoffer = require("../middlewares/sendEmailHire");

let hireController = {
  getAllHire: async (req, res) => {
    try {
      const page = Number(req.query.page) || 1;
      const limit = Number(req.query.limit) || 100;
      const offset = (page - 1) * limit;
      const sortby = req.query.sortby || "id";
      const sort = req.query.sort || "ASC";
      let result = await selectAllHire({ limit, offset, sort, sortby });
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
        "Get Hire Data Success",
        pagination
      );
    } catch (err) {
      console.log(err);
    }
  },

  getSelectHirePekerja: async (req, res) => {
    const pekerja_id = String(req.params.id);
    selectHirePekerja(pekerja_id)
      .then((result) => {
        commonHelper.response(res, result.rows, 200, "Get Hire Detail Success");
      })
      .catch((err) => res.send(err));
  },

  getSelectHirePerekrut: async (req, res) => {
    const perekrut_id = String(req.params.id);
    selectHirePerekrut(perekrut_id)
      .then((result) => {
        commonHelper.response(res, result.rows, 200, "Get Hire Detail Success");
      })
      .catch((err) => res.send(err));
  },

  createHire: async (req, res) => {
    const {
      title,
      desciption,
      pekerja_id,
      perekrut_id,
      pekerja_name,
      pekerja_email,
      perekrut_compname,
    } = req.body;
    const id = uuidv4();
    const data = {
      id,
      title,
      desciption,
      pekerja_id,
      perekrut_id,
      pekerja_name,
      pekerja_email,
      perekrut_compname,
    };

    await sendemailoffer(
      perekrut_compname,
      pekerja_email,
      pekerja_name,
      title,
      desciption,
      `Job Offer: ${title} at ${perekrut_compname}`
    );

    createHire(data)
      .then((result) =>
        commonHelper.response(res, result.rows, 201, "Create Hire Success")
      )
      .catch((err) => res.send(err));
  },

  deleteHire: async (req, res) => {
    try {
      const id = String(req.params.id);
      const { rowCount } = await findUUID(id);
      if (!rowCount) {
        res.json({ message: "ID Not Found" });
      }
      deleteHire(id)
        .then((result) =>
          commonHelper.response(res, result.rows, 200, "Delete Hire Success")
        )
        .catch((err) => res.send(err));
    } catch (error) {
      console.log(error);
    }
  },
};

module.exports = hireController;

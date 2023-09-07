const { v4: uuidv4 } = require("uuid");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Joi = require("joi");
const authHelper = require("../helper/auth");
const commonHelper = require("../helper/common");
const sendEmail = require("../middlewares/sendEmail");
const crypto = require("crypto");

const {
  selectAllUsers,
  selectUsers,
  deleteUsers,
  createUsers,
  createPekerja,
  createPerekrut,
  findUUID,
  findEmail,
  countData,
  createUsersVerification,
  checkUsersVerification,
  cekUser,
  deleteUsersVerification,
  updateAccountVerification,
} = require("../model/users");
const { insertSkill } = require("../model/skill");

const userSchema = Joi.object({
  name: Joi.string().required().messages({
    "any.required": "Name is required",
  }),
  email: Joi.string().email().required().messages({
    "string.email": "Email must be a valid email address",
    "any.required": "Email is required",
  }),
  phone: Joi.string().min(10).required().messages({
    "string.min": "Phone number must be at least {#limit} digits",
    "any.required": "Phone number is required",
  }),
  password: Joi.string().min(8).required().messages({
    "string.min": "Password must be at least {#limit} characters",
    "any.required": "Password is required",
  }),
  confirmpassword: Joi.string().valid(Joi.ref("password")).required().messages({
    "any.only": "Confirm password must match the password",
    "any.required": "Confirm password is required",
  }),
  jabatan: Joi.string().allow(null),
  nama_perusahaan: Joi.string().allow(null),
  nama_skill: Joi.string().allow(null),
});

const loginSchema = Joi.object({
  email: Joi.string().required().messages({
    "string.email": "Email salah, masukkan email yang valid",
    "any.required": "Email harus diisi",
  }),
  password: Joi.string().min(8).required().messages({
    "string.min": "Password harus mengandung minimal {#limit} karakter",
    "any.required": "Password harus diisi",
  }),
});

const usersController = {
  getAllUsers: async (req, res) => {
    try {
      const page = Number(req.query.page) || 1;
      const limit = Number(req.query.limit) || 100;
      const offset = (page - 1) * limit;
      const sortby = req.query.sortby || "id";
      const sort = req.query.sort || "ASC";
      const result = await selectAllUsers({ limit, offset, sort, sortby });
      const {
        rows: [{ count }],
      } = await countData();
      const totalData = parseInt(count);
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
        "Get Users Data Success",
        pagination
      );
    } catch (err) {
      console.error(err);
      res.status(500).send(err.message);
    }
  },

  getSelectUsers: async (req, res) => {
    try {
      const id = String(req.params.id);
      const { rowCount } = await findUUID(id);
      if (!rowCount) {
        return res.json({ message: "ID Not Found" });
      }
      const result = await selectUsers(id);
      commonHelper.response(res, result.rows, 200, "Get Users Detail Success");
    } catch (err) {
      console.error(err);
      res.status(500).send(err.message);
    }
  },

  registerUsers: async (req, res) => {
    try {
      const { error, value } = userSchema.validate(req.body);
      if (error) {
        return res.status(400).json({ message: error.details[0].message });
      }
      const { name, email, phone, password, confirmpassword, jabatan } = value;
      const { rowCount } = await findEmail(email);
      if (rowCount) {
        return res.json({ message: "Email Already Taken" });
      }

      let role = req.params.role;
      const id = uuidv4();
      const passwordHash = bcrypt.hashSync(password, 10);
      const confirmpasswordHash = bcrypt.hashSync(confirmpassword, 10);
      const jabatanValue = jabatan !== undefined ? jabatan : null;
      // verification
      const verify = "false";

      const users_verification_id = uuidv4().toLocaleLowerCase();
      // const users_id = id;
      const token = crypto.randomBytes(64).toString("hex");

      // url localhost
      const url = `${process.env.BASE_URL}users/verify?id=${id}&token=${token}`;
      await sendEmail(email, "Verify Email", url);
      const data = {
        id,
        name,
        email,
        phone,
        passwordHash,
        confirmpasswordHash,
        jabatan: jabatanValue,
        role,
        verify,
      };
      let data_perekrut = {
        users_id: id,
        nama_perusahaan: req.body.nama_perusahaan,
      };
      
      const result = await createUsers(data);
      if (role === "perekrut") {
        await createPerekrut(data_perekrut);
      } else if (role === "pekerja") {
        await createPekerja({ users_id: id });
        await insertSkill({ users_id: id });
        await createUsersVerification(users_verification_id, id, token);

      }
      commonHelper.response(
        res,
        201,
        "Sign Up Success, Please check your email for verification"
      );
    } catch (err) {
      console.error(err);
      res.status(500).send(err.message);
    }
  },

  VerifyAccount: async (req, res) => {
    try {
      const queryUsersId = req.query.id;
      const queryToken = req.query.token;

      if (typeof queryUsersId === "string" && typeof queryToken === "string") {
        const checkUsersVerify = await findUUID(queryUsersId);

        if (checkUsersVerify.rowCount == 0) {
          return commonHelper.response(
            res,
            null,
            403,
            "Error users has not found"
          );
        }

        if (checkUsersVerify.rows[0].verify != "false") {
          return commonHelper.response(
            res,
            null,
            403,
            "Users has been verified"
          );
        }

        const result = await checkUsersVerification(
          queryUsersId,
          queryToken
        );

        if (result.rowCount == 0) {
          return commonHelper.response(
            res,
            null,
            403,
            "Error invalid credential verification"
          );
        } else {
          await updateAccountVerification(queryUsersId);
          await deleteUsersVerification(queryUsersId, queryToken);
          commonHelper.response(res, null, 200, "Users verified succesful");
        }
      } else {
        return commonHelper.response(
          res,
          null,
          403,
          "Invalid url verification"
        );
      }
    } catch (error) {
      console.log(error);
      res.status(500).send(err.message);
    }
  },

  updateUsers: async (req, res) => {
    try {
      const { name, phone, jabatan } = req.body;
      const id = String(req.params.id);
      const { rowCount } = await findUUID(id);
      if (!rowCount) {
        return res.json({ message: "ID Not Found" });
      }
      const data = {
        id,
        name,
        phone,
        jabatan,
      };

      const result = await updateUsers(data);
      commonHelper.response(res, result.rows, 200, "Update Users Success");
    } catch (err) {
      console.error(err);
      res.status(500).send(err.message);
    }
  },

  deleteUsers: async (req, res) => {
    try {
      const id = String(req.params.id);
      const { rowCount } = await findUUID(id);

      if (!rowCount) {
        return res.json({ message: "ID Not Found" });
      }

      const result = await deleteUsers(id);
      commonHelper.response(res, result.rows, 200, "Delete Users Success");
    } catch (err) {
      console.error(err);
      res.status(500).send(err.message);
    }
  },

  loginUsers: async (req, res) => {
    try {
      const { error } = loginSchema.validate(req.body);
      if (error) {
        res.status(400).json({ message: error.details[0].message });
        return;
      }

      const { email, password } = req.body;
      const {rows: [verify]} = await cekUser(email);
      console.log(verify.verify);
      if (verify.verify==="false") {
        return res.json({
          message:"user is unverify"
        })
      }

      const {
        rows: [users],
      } = await findEmail(email);

      if (!users) {
        return res.json({ message: "Email salah" });
      }

      const isValidPassword = bcrypt.compareSync(password, users.password);
      if (!isValidPassword) {
        return res.json({ message: "Password salah" });
      }

      delete users.passwordHash;
      const payload = {
        email: users.email,
      };

      users.token_user = authHelper.generateToken(payload);
      users.refreshToken = authHelper.generateRefreshToken(payload);
      
      commonHelper.response(res, users, 201, "Login Successfully");
    } catch (err) {
      console.log(error);
      res.status(500).json({ message: "Internal server error" });
    }
  },

  sendEmail: async (req, res, next) => {
    const { email } = req.body;
    await sendEmail(email, "Verify Email", url);
  },

  refreshToken: (req, res) => {
    try {
      const refreshToken = req.body.refreshToken;
      const decoded = jwt.verify(refreshToken, process.env.SECRETE_KEY_JWT);
      const payload = {
        email: decoded.email,
      };
      const result = {
        token_user: authHelper.generateToken(payload),
        refreshToken: authHelper.generateRefreshToken(payload),
      };
      commonHelper.response(res, result, 200);
    } catch (err) {
      console.error(err);
      res.status(500).send(err.message);
    }
  },
};

module.exports = usersController;

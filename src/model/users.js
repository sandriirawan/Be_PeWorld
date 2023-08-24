const Pool = require("../config/db");
const { v4: uuidv4 } = require("uuid");


//GET ALL USERS
const selectAllUsers = ({ limit, offset, sort, sortby }) => {
  return Pool.query(
    `SELECT u.*, 
            pr.foto_perusahaan, pr.nama_perusahaan, pr.bidang_perusahaan, pr.provinsi as provinsi_perusahaan, pr.kota as kota_perusahaan, pr.info_perusahaan, pr.email_perusahaan, pr.phone_perusahaan, pr.linkedin as linkedin_perusahaan,
            pe.foto_pekerja, pe.job_desk, pe.deskripsi_singkat, pe.tempat_kerja, pe.provinsi as provinsi_pekerja, pe.kota as kota_pekerja, pe.instagram, pe.github, pe.linkedin as linkedin_pekerja,
            s.nama_skill
    FROM users u
    LEFT JOIN perekrut pr ON u.id = pr.users_id
    LEFT JOIN pekerja pe ON u.id = pe.users_id
    LEFT JOIN skill s ON u.id = s.users_id
    ORDER BY ${sortby} ${sort}
    LIMIT ${limit} OFFSET ${offset}`
  );
};



//GET SELECT USERS
const selectUsers = (id) => {
  return Pool.query(`SELECT * FROM users WHERE id = '${id}'`);
};

//DELETE SELECT USERS
const deleteUsers = (id) => {
  return Pool.query(`DELETE FROM users WHERE id = '${id}'`);
};

//POST USERS
const createUsers = (data) => {
  const {
    id,
    email,
    passwordHash,
    confirmpasswordHash, 
    name,
    phone,
    jabatan,
    role,
  } = data;
  return Pool.query(
    `INSERT INTO users(id, email, password, confirmpassword, name, phone, jabatan, role) 
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
    [id, email, passwordHash, confirmpasswordHash, name, phone, jabatan, role]
  );
};

const createPerekrut = (data_perekrut) => {
  const { users_id, nama_perusahaan } = data_perekrut;
  const id = uuidv4(); 
  const qry = `INSERT INTO perekrut(id, users_id, nama_perusahaan) VALUES ($1, $2, $3)`;
  return Pool.query(qry, [id, users_id, nama_perusahaan]);
};

const createPekerja = (data) => {
  const { users_id } = data;
  const id = uuidv4(); 
  const qry = `INSERT INTO pekerja(id, users_id) VALUES ($1, $2, )`;
  return Pool.query(qry, [id, users_id]);
};


const updateUsersPerekrut = (data) => {
  const { id, name,phone, jabatan } = data;
  return Pool.query(
    `UPDATE users SET jabatan = '${jabatan}', name = '${name}', phone = '${phone}' WHERE id = '${id}'`
  );
};

const updateUsersPekerja = (data) => {
  const { id, name, email } = data;
  return Pool.query(
    `UPDATE users SET  name = '${name}', email = '${email}' WHERE id = '${id}'`
  );
};


//FIND EMAIL
const findUUID = (id) => {
  return new Promise((resolve, reject) =>
    Pool.query(
      `SELECT * FROM users WHERE id= '${id}' `,
      (error, result) => {
        if (!error) {
          resolve(result);
        } else {
          reject(error);
        }
      }
    )
  );
};

const findEmail = (email) => {
  return new Promise((resolve, reject) =>
    Pool.query(
      `SELECT * FROM users WHERE email='${email}' `,
      (error, result) => {
        if (!error) {
          console.log("User data found:", result.rows[0]);
          resolve(result);
        } else {
          console.error("Error finding user by email:", error);
          reject(error);
        }
      }
    )
  );
};
//COUNT DATA
const countData = () => {
  return Pool.query(`SELECT COUNT(*) FROM users`);
};

module.exports = {
  selectAllUsers,
  selectUsers,
  deleteUsers,
  createUsers,
  createPerekrut,
  createPekerja,
  updateUsersPerekrut,
  updateUsersPekerja,
  findUUID,
  findEmail,
  countData,
};

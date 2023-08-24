const Pool = require("../config/db");


const selectAllPerekrut = ({ limit, offset, sort, sortby }) => {
  return Pool.query(
    `SELECT * FROM perekrut ORDER BY ${sortby} ${sort} LIMIT ${limit} OFFSET ${offset}`
  );
};

const getDetailPerekrut = async (users_id) => {
  return Pool.query(
    `
    SELECT perekrut.*, users.jabatan
    FROM perekrut
    LEFT JOIN users ON perekrut.users_id = users.id
    WHERE users_id = $1
    `,
    [users_id]
  );
};


const updatePerekrut = async (data) => {
  const {
    users_id,
    foto_perusahaan,
    nama_perusahaan,
    bidang_perusahaan,
    provinsi,
    kota,
    info_perusahaan,
    email_perusahaan,
    phone_perusahaan,
    linkedin,
    jabatan, 
  } = data;

  const perekrutQuery = Pool.query(
    `UPDATE perekrut SET
      foto_perusahaan=$1,
      nama_perusahaan=$2,
      bidang_perusahaan=$3,
      provinsi=$4,
      kota=$5,
      info_perusahaan=$6,
      email_perusahaan=$7,
      phone_perusahaan=$8,
      linkedin=$9
    WHERE users_id=$10`,
    [
      foto_perusahaan,
      nama_perusahaan,
      bidang_perusahaan,
      provinsi,
      kota,
      info_perusahaan,
      email_perusahaan,
      phone_perusahaan,
      linkedin,
      users_id,
    ]
  );

  const usersQuery = Pool.query( 
    `UPDATE users SET jabatan = $1 WHERE id = $2`,
    [ jabatan, users_id]
  );

  try {
    await Promise.all([perekrutQuery, usersQuery]);
    return { message: "Update Success" };
  } catch (err) {
    throw err;
  }
};


const deletePerekrut = (id) => {
  return Pool.query(`DELETE FROM perekrut WHERE id='${id}'`);
};

const countData = () => {
  return Pool.query("SELECT COUNT(*) FROM perekrut");
};

const findID = (users_id) => {
  return new Promise((resolve, reject) =>
    Pool.query(`SELECT users_id FROM perekrut WHERE users_id='${users_id}'`, (error, result) => {
      if (!error) {
        resolve(result);
      } else {
        reject(error);
      }
    })
  );
};

const findId = (id) => {
  return new Promise((resolve, reject) =>
    Pool.query(`SELECT id FROM perekrut WHERE id='${id}'`, (error, result) => {
      if (!error) {
        resolve(result);
      } else {
        reject(error);
      }
    })
  );
};


module.exports = {
  selectAllPerekrut,
  getDetailPerekrut,
  updatePerekrut,
  deletePerekrut,
  countData,
  findID,
  findId,
};

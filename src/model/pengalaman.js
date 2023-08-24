const Pool = require("../config/db");

// GET ALL pengalaman
const selectAllPengalaman = ({ limit, offset, sort, sortby }) => {
  return Pool.query(
    `SELECT * FROM pengalaman ORDER BY ${sortby} ${sort} LIMIT ${limit} OFFSET ${offset}`
  );
};

// SELECT pengalaman BY USERS ID
const selectPengalaman = (users_id) => {
  return Pool.query(`SELECT * FROM pengalaman WHERE users_id = '${users_id}'`);
};

// INSERT pengalaman
const insertPengalaman = (data) => {
  const {
    id,
    users_id,
    posisi,
    nama_perusahaan,
    foto_perusahaan,
    tahun_masuk,
    tahun_keluar,
    deskripsi,
  } = data;
  return Pool.query(
    `INSERT INTO pengalaman ( id, users_id, posisi, nama_perusahaan, foto_perusahaan,tahun_masuk, tahun_keluar, deskripsi) 
    VALUES('${id}', '${users_id}', '${posisi}', '${nama_perusahaan}','${foto_perusahaan}', '${tahun_masuk}', '${tahun_keluar}', '${deskripsi}')`
  );
};

// UPDATE pengalaman
const updatePengalaman = (data) => {
  const {
    id,
    posisi,
    nama_perusahaan,
    foto_perusahaan,
    tahun_masuk,
    tahun_keluar,
    deskripsi,
  } = data;
  return Pool.query(
    `UPDATE pengalaman SET posisi='${posisi}', nama_perusahaan='${nama_perusahaan}', foto_perusahaan='${foto_perusahaan}', tahun_masuk='${tahun_masuk}', tahun_keluar='${tahun_keluar}',  deskripsi='${deskripsi}' WHERE id='${id}'
    `
  );
};

// DELETE pengalaman
const deletePengalaman = (id) => {
  return Pool.query(`DELETE FROM pengalaman WHERE id='${id}'`);
};

// COUNT DATA
const countData = () => {
  return Pool.query("SELECT COUNT(*) FROM pengalaman");
};

//
const findID = (id) => {
  return new Promise((resolve, reject) =>
    Pool.query(
      `SELECT id FROM pengalaman WHERE id='${id}'`,
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

const findUsersID = (users_id) => {
  return new Promise((resolve, reject) =>
    Pool.query(
      `SELECT users_id FROM pengalaman WHERE users_id='${users_id}'`,
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

module.exports = {
  selectAllPengalaman,
  selectPengalaman,
  insertPengalaman,
  updatePengalaman,
  deletePengalaman,
  countData,
  findID,
  findUsersID,
};

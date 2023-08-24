const Pool = require("../config/db");

const selectAllPekerja = ({ limit, offset, sort, sortby }) => {
  return Pool.query(
    ` SELECT pekerja.*, users.name, skill.nama_skill
FROM pekerja
LEFT JOIN users ON pekerja.users_id = users.id
LEFT JOIN skill ON pekerja.users_id = skill.users_id
ORDER BY  ${sortby} ${sort} LIMIT ${limit} OFFSET ${offset}`
  );
};

const getDetailPekerja = async (users_id) => {
  return Pool.query(
    `
    SELECT pekerja.*, users.name, skill.nama_skill
    FROM pekerja
    LEFT JOIN users ON pekerja.users_id = users.id
    LEFT JOIN skill ON pekerja.users_id = skill.users_id
    WHERE pekerja.users_id = $1
    `,
    [users_id]
  );
};


const updatePekerja = async (data) => {
  const {
    users_id,
    foto_pekerja,
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
  } = data;

  const pekerjaQuery = Pool.query(
    `UPDATE pekerja SET
      foto_pekerja=$1,
      job_desk=$2,
      deskripsi_singkat=$3,
      tempat_kerja=$4,
      kota=$5,
      provinsi=$6,
      instagram=$7,
      github=$8,
      linkedin=$9,
      email=$10
    WHERE users_id=$11`,
    [
      foto_pekerja,
      job_desk,
      deskripsi_singkat,
      tempat_kerja,
      kota,
      provinsi,
      instagram,
      github,
      linkedin,
      email,
      users_id,
    ]
  );

  const usersQuery = Pool.query(
    `UPDATE users SET name = $1 WHERE id = $2`,
    [name, users_id]
  );

  try {
    await Promise.all([pekerjaQuery, usersQuery]);
    return { message: "Update Success" };
  } catch (err) {
    throw err;
  }
};

const deletePekerja= (id) => {
  return Pool.query(`DELETE FROM pekerja WHERE id='${id}'`);
};

const countData = () => {
  return Pool.query("SELECT COUNT(*) FROM pekerja");
};

const findID = (users_id) => {
  return new Promise((resolve, reject) =>
    Pool.query(
      `SELECT users_id FROM pekerja WHERE users_id='${users_id}'`,
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

const findId = (id) => {
  return new Promise((resolve, reject) =>
    Pool.query(
      `SELECT id FROM pekerja WHERE id='${id}'`,
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
  selectAllPekerja,
  getDetailPekerja,
  updatePekerja,
  deletePekerja,
  countData,
  findID,
  findId,
};


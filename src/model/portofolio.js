const Pool = require("../config/db");

// GET ALL Portofolio
const selectAllPortofolio = ({ limit, offset, sort, sortby }) => {
  return Pool.query(
    `SELECT * FROM Portofolio ORDER BY ${sortby} ${sort} LIMIT ${limit} OFFSET ${offset}`
  );
};

// SELECT Portofolio BY USERS ID
const selectPortofolio = (users_id) => {
  return Pool.query(
    `SELECT * FROM portofolio WHERE users_id = '${users_id}'`
  );
};

// INSERT Portofolio
const insertPortofolio = (data) => {
  const { id, users_id, nama_aplikasi, link_repo, tipe, photo} = data;
  return Pool.query(
    `INSERT INTO portofolio ( id, users_id, nama_aplikasi, link_repo, tipe, photo) 
    VALUES('${id}', '${users_id}', '${nama_aplikasi}', '${link_repo}','${tipe}', '${photo}')`
  );
};

// UPDATE Portofolio
const updatePortofolio = (data) => {
  const {  users_id, nama_aplikasi, link_repo, tipe,photo} = data;
  return Pool.query(
    `UPDATE portofolio SET nama_aplikasi='${nama_aplikasi}', link_repo='${link_repo}', tipe='${tipe}', photo='${photo}'WHERE users_id='${users_id}'
    `);
};

// DELETE Portofolio
const deletePortofolio = (id) => {
  return Pool.query(`DELETE FROM portofolio WHERE id='${id}'`);
};

// COUNT DATA
const countData = () => {
  return Pool.query("SELECT COUNT(*) FROM portofolio");
};

//
const findID = (id) => {
  return new Promise((resolve, reject) =>
    Pool.query(
      `SELECT id FROM portofolio WHERE id='${id}'`,
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
        `SELECT users_id FROM portofolio WHERE users_id='${users_id}'`,
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
  selectAllPortofolio,
  selectPortofolio,
  insertPortofolio,
  updatePortofolio,
  deletePortofolio,
  countData,
  findID,
  findUsersID,
};

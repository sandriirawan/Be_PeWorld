const Pool = require("../config/db");

//GET ALL
const selectAllHire = ({ limit, offset, sort, sortby }) => {
  return Pool.query(
    `SELECT * FROM hire ORDER BY ${sortby} ${sort} LIMIT ${limit} OFFSET ${offset}`
  );
};

//GET SELECT USERS
const selectHirePekerja = (pekerja_id) => {
  return Pool.query(`SELECT * FROM hire WHERE pekerja_id = '${pekerja_id}'`);
};

const selectHirePerekrut = (perekrut_id) => {
  return Pool.query(`SELECT * FROM hire WHERE perekrut_id = '${perekrut_id}'`);
};

//DELETE SELECT USERS
const deleteHire = (id) => {
  return Pool.query(`DELETE FROM hire WHERE id  = '${id}'`);
};

//POST USERS
const createHire = (data) => {
  const {
    id,
    title,
    desciption,
    pekerja_id,
    perekrut_id,
    pekerja_name,
    pekerja_email,
    perekrut_compname,
  } = data;
  return Pool.query(`INSERT INTO hire(id, title, desciption,pekerja_id, perekrut_id, pekerja_name, pekerja_email, perekrut_compname)  
    VALUES ('${id}','${title}','${desciption}','${pekerja_id}','${perekrut_id}','${pekerja_name}','${pekerja_email}','${perekrut_compname}')`);
};


//FIND EMAIL
const findUUID = (id) => {
  return new Promise((resolve, reject) =>
    Pool.query(
      `SELECT * FROM hire WHERE id= '${id}' `,
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



//COUNT DATA
const countData = () => {
  return Pool.query(`SELECT COUNT(*) FROM hire`);
};

module.exports = {
  selectAllHire,
  selectHirePekerja,
  selectHirePerekrut,
  deleteHire,
  createHire,
  findUUID,
  countData,
};
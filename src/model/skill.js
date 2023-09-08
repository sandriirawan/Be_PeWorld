const Pool = require("../config/db");
const { v4: uuidv4 } = require("uuid");




// GET ALL skill
const selectAllSkill = ({ limit, offset, sort, sortby }) => {
  return Pool.query(
    `SELECT * FROM skill ORDER BY ${sortby} ${sort} LIMIT ${limit} OFFSET ${offset}`
  );
};

// SELECT skill BY USERS ID
const selectSkill = (users_id) => {
  return Pool.query(
    `SELECT * FROM skill WHERE users_id = '${users_id}'`
  );
};

// INSERT skill
const insertSkill = (data) => {
  const { users_id } = data;
  const id = uuidv4(); 
    return Pool.query(
    `INSERT INTO skill (id,users_id) 
    VALUES('${id}', '${users_id}')`
  );
};

// UPDATE skill
const updateSkill = (data) => {
  const { nama_skill, users_id } = data;
  return Pool.query(
    `UPDATE skill SET nama_skill='${nama_skill}' WHERE users_id='${users_id}'`
  );
};

// DELETE Category
const deleteSkill = (users_id) => {
  return Pool.query(`DELETE FROM skill WHERE users_id='${users_id}'`);
};

// COUNT DATA
const countData = () => {
  return Pool.query("SELECT COUNT(*) FROM skill");
};

//
const findID = (users_id) => {
  return new Promise((resolve, reject) =>
    Pool.query(
      `SELECT users_id FROM skill WHERE users_id='${users_id}'`,
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
  selectAllSkill,
  selectSkill,
  insertSkill,
  updateSkill,
  deleteSkill,
  countData,
  findID,
};

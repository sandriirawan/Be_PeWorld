const response = (res, result, status, message, pagination) => {
  const resultPrint = {};
  resultPrint.status = "success";
  resultPrint.statusCode = status;
  resultPrint.data = result;
  resultPrint.message = message || null;
  resultPrint.pagination = pagination || {};
  res.status(status).json(resultPrint);
};
const failed = (res, status, message, errorData) => {
  const resultPrint = {};
  resultPrint.status = "error";
  resultPrint.statusCode = status;
  resultPrint.message = message || "Internal Server Error";
  resultPrint.error = errorData || {};
  res.status(status).json(resultPrint);
};
module.exports = { response,failed };

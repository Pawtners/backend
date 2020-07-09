const handleResponse = (res, code, statusMsg) => {
  return res.status(code).json({ status: statusMsg });
};

module.exports = { handleResponse };

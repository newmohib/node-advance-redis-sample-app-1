const { clearHash } = require("../services/cache");

module.exports = async (req, res, next) => {
  next();
  clearHash(req.user.id);
  console.log("CLEANING CACHE");
};

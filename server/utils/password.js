const bcrypt = require("bcryptjs");

exports.encryptPassword = async (password) => {
  const encryptedPassword = await bcrypt.hash(password, 8);
  return encryptedPassword;
};

exports.isPasswordMatch = async (password, userPassword) => {
  return bcrypt.compare(password, userPassword);
};

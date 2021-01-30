// controller to get details
const data = require("../models/user.json");

exports.getDetails = (req, res) => {
  res.status(200).json({
    message: "My Rule-Validation API",
    status: "success",
    data: data,
  });
};

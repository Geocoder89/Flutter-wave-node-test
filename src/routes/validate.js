const express = require("express");

const router = express.Router();
const validation = require("../controllers/validate");
const getDetails = require("../controllers/details");

// route to get details

router.get("/", getDetails.getDetails);
// route to validate
router.post("/validate-rule", validation.createValidation);

module.exports = router;

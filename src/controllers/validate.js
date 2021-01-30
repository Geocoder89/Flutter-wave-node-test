const rulesValidator = require("./validator.js");
const ErrorResponse = require("../utils/errorResponse");

exports.createValidation = (req, res, next) => {
  // check if the json payload is valid
  if (req.body.constructor !== Object || Object.keys(req.body).length === 0) {
    return next(new ErrorResponse("Invalid JSON payload passed.", 400));
  }

  //   check if rule and data field is present
  const body = req.body;
  if (body.rule === undefined || body.data === undefined) {
    const message =
      body.rule === undefined ? `rule is required.` : `data is required.`;
    return next(new ErrorResponse(message, 400));
  }

  let objectConstructor = Object;
  let arrayConstructor = Array;
  let stringConstructor = String;

  // to check if the rule is a valid object
  if (body.rule.constructor !== objectConstructor) {
    return next(new ErrorResponse("rule should be an object.", 400));
  }

  //   check if the rule has to have a field,condition and condition_value
  let missing_field = undefined;
  if (body.rule.field === undefined) missing_field = "field";
  else if (body.rule.condition === undefined) missing_field = "condition";
  else if (body.rule.condition_value === undefined)
    missing_field = "condition_value";

  if (missing_field) {
    return next(new ErrorResponse(`${missing_field} is required.`, 400));
  }

  // to validate if our condition set meets the desired condition
  let condition = body.rule.condition;
  let valid_conditions = ["eq", "neq", "gt", "gte", "contains"];
  if (!valid_conditions.includes(condition)) {
    return next(
      new ErrorResponse(`condition should be one of ${valid_conditions}`, 400)
    );
  }

  let dataConstructor = body.data.constructor;
  if (
    dataConstructor !== objectConstructor &&
    dataConstructor !== stringConstructor &&
    dataConstructor !== arrayConstructor
  ) {
    return next(
      new ErrorResponse("data should be an array, string or object.", 400)
    );
  }

  let value =
    body.rule.field.constructor === Number
      ? body.rule.field
      : body.rule.field.split(".");
  let data = body.data;

  //we need to check that value.length is at least one and return an approrpiate error
  // if that is not the case

  if (data.constructor === arrayConstructor) {
    let invalid_field_type = value.constructor !== Number;
    let index_out_bounds = data.length < value;

    if (invalid_field_type || index_out_bounds) {
      return next(
        new ErrorResponse(`field ${body.rule.field} is missing from data`, 400)
      );
    }
  } else if (data.constructor === stringConstructor) {
    if (value.constructor === Number || value.length > 1) {
      return next(
        new ErrorResponse(`field ${body.rule.field} is missing from data`, 400)
      );
    }
  } else if (data.constructor === objectConstructor) {
    //user.address split now has [user, address] 2 things
    // valid: data: {user: {name: dele, address: lagos}}
    //invalid data: {user: dele, phone: 1234}
    if (value.constructor !== arrayConstructor) {
      return next(
        new ErrorResponse(`field ${body.rule.field} is missing from data`, 400)
      );
    }

    let index = 0;
    while (index < value.length) {
      if (!data.hasOwnProperty(value[index])) {
        //return the error
        return next(
          new ErrorResponse(
            `field ${body.rule.field} is missing from data`,
            400
          )
        );
      }
      data = data[value[index]];
      index++;
    }
  }

  //do the actual validation
  let result = rulesValidator.validator(body.rule, body.data);
  if (result.status) {
    res.status(200).json({
      message: `field ${body.rule.field} successfully validated.`,
      status: "success",
      data: {
        validation: {
          error: false,
          field: body.rule.field,
          field_value: result.field_value,
          condition: body.rule.condition,
          condition_value: body.rule.condition_value,
        },
      },
    });
  } else {
    res.status(400).json({
      message: `field ${body.rule.field} failed validation.`,
      status: "error",
      data: {
        validation: {
          error: true,
          field: body.rule.field,
          field_value: result.field_value,
          condition: body.rule.condition,
          condition_value: body.rule.condition_value,
        },
      },
    });
  }
};

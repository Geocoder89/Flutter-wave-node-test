exports.validator = (rule, data) => {
  let field = rule.field;
  if (data.constructor === Object) {
    field = field.split(".");
    let index = 0;
    while (index < field.length) {
      data = data[field[index]];
      index += 1;
    }
    let res = validate(data, rule.condition, rule.condition_value);
    return res
      ? { status: true, field_value: data }
      : { status: false, field_value: data };
  } else if (data.constructor === Array) {
    let res = validate(data[field - 1], rule.condition, rule.condition_value);
    return res
      ? { status: true, field_value: data[field - 1] }
      : { status: false, field_value: data[field - 1] };
  } else {
    let index = parseInt(field);
    let dataSlice = data[index]; //we can use this when field is a slice data.slice(0, index + 1);
    let res = validate(dataSlice, rule.condition, rule.condition_value);
    return res
      ? { status: true, field_value: dataSlice }
      : { status: false, field_value: dataSlice };
  }
};

function validate(operand1, operator, operand2) {
  if (operator === "eq") return operand1 === operand2;
  if (operator === "neq") return operand1 !== operand2;
  if (operator === "gt") return operand1 > operand2;
  if (operator === "gte") return operand1 >= operand2;
  else return operand1.includes(operand2);
}

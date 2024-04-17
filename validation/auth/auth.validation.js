const Joi = require("joi");
const signupValidation = async (req, res, next) => {
  try {
    let response = {};
    const userValidation = async (body) => {
      const joiSchema = await Joi.object({
        name: Joi.string().min(2).max(30).required().messages({
          "any.required": "name is required.",
          "string.empty": "name cannot be empty.",
        }),
        email: Joi.string().email().required().messages({
          "any.required": "Email is required.",
          "string.empty": "Email cannot be empty.",
          "string.email": "Invalid email format.",
        }),
        age: Joi.number().integer().min(18).required().messages({
          "any.required": "Age is required.",
          "number.empty": "Age cannot be empty.",
          "integer.age": "Invalid email format.",
        }),
        password: Joi.string()
          .alphanum()
          .min(8)
          .max(30)
          .pattern(new RegExp("^[a-zA-Z0-9@]{3,30}$"))
          .required()
          .messages({
            "string.pattern.base":
              'Password must contain only letters, numbers, or "@" and be between 3 and 30 characters long.',
          }),
      });
      return joiSchema.validate(body, { errors: { wrap: { label: "" } } });
    };
    const validation = await userValidation(req.body);
    if (validation.error) {
      let { details } = validation.error;
      const message = details.map((i) => i.message).join(",");
      response.message = message;
      response.statusCode = 422;
      response.error = "ValidationError";
      return res.json(response);
    } else {
      next();
    }
  } catch (error) {
    console.log("validation error", error);
  }
};
const loginValidation = async (req, res, next) => {
  try {
    const validateLogin = async (body) => {
      const joiSchema = await Joi.object({
        email: Joi.string().email().required().messages({
          "any.required": "Email is required.",
          "string.empty": "Email cannot be empty.",
          "string.email": "Invalid email format.",
        }),
        password: Joi.string().alphanum().required().messages({
          "any.required": "password is required.",
          "string.empty": "password cannot be empty.",
        }),
      });
      return joiSchema.validate(body, {
        errors: { wrap: { label: "" } },
      });
    };
    const validation = await validateLogin(req.body);
    console.log(validation);
    let response = {};
    if (validation.error) {
      let { details } = validation.error;
      const message = details.map((i) => i.message).join(", ");
      response.message = message;
      response.statusCode = 422;
      response.error = "ValidationError";
      return res.json(response);
    } else {
      next();
    }
  } catch (error) {
    console.log("validation error", error);
  }
};

module.exports = { signupValidation, loginValidation };

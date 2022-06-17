const Joi = require("joi");

const getSingleCartSchema = Joi.object({
  id: Joi.number().integer().required(),
});

export { getSingleCartSchema };

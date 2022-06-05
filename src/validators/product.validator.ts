const Joi = require("joi");

const productSchema = Joi.object({
  title: Joi.string().min(3).required(),
  description: Joi.string().min(3).required(),
  price: Joi.number().positive().required(),
  image:
    Joi.string()
    .required(),
  category: Joi.string().required(),
});

export default productSchema;

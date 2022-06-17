const Joi = require("joi");

const createProductSchema = Joi.object({
  title: Joi.string().min(3).required(),
  description: Joi.string().min(3).required(),
  price: Joi.number().positive().required(),
  image: Joi.string().required(),
  category: Joi.string().required(),
});

const updateProductSchema = Joi.object({
  id: Joi.number().integer().required(),
  title: Joi.string().min(3).required(),
  description: Joi.string().min(3).required(),
  price: Joi.number().positive().required(),
  image: Joi.string().required(),
  category: Joi.string().required(),
});

const getSingleProductSchema = Joi.object({
  id: Joi.number().integer().required(),
});

export { createProductSchema, updateProductSchema, getSingleProductSchema };

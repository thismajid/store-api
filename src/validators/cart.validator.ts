const Joi = require("joi");

const getSingleCartSchema = Joi.object({
  id: Joi.number().integer().required(),
});

const updateCartItemsSchema = Joi.object({
  id: Joi.number().integer().required(),
  products: Joi.array().items(
    Joi.object({
      productId: Joi.number().integer().required(),
      quantity: Joi.number().integer().required(),
    })
  ),
});

export { getSingleCartSchema, updateCartItemsSchema };

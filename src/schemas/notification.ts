import Joi from 'joi';

export const CreateNotification = Joi.object({
    owner: Joi.string().required(),
    title: Joi.string().required(),
    type: Joi.string().required(),
    message: Joi.string().required(),
    // read: Joi.string().required(),
    fcm_token: Joi.string().required()
  });
  
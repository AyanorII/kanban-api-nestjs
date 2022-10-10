import * as Joi from '@hapi/joi';

export const configSchemaValidation = Joi.object({
  PORT: Joi.number().required(),
  API_URL: Joi.string().required(),
  NODE_ENV: Joi.string().required(),
  DATABASE_URL: Joi.string().required(),
  JWT_SECRET: Joi.string().required().min(64),
  CORS_ORIGIN: Joi.string().required(),
  GOOGLE_CLIENT_ID: Joi.string().required(),
  GOOGLE_CLIENT_SECRET: Joi.string().required(),
});

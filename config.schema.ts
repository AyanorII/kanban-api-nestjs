import * as Joi from '@hapi/joi';

export const configSchemaValidation = Joi.object({
  DB_HOST: Joi.string().required(),
  DB_PORT: Joi.number().default(5432).required(),
  DB_USER: Joi.string().required(),
  DB_PASSWORD: Joi.string().required(),
  DB_DATABASE: Joi.string().required(),
  PORT: Joi.number().required(),
  API_URL: Joi.string().required(),
  NODE_ENV: Joi.string().required(),
  DATABASE_URL: Joi.string().required(),
  JWT_SECRET: Joi.string().required().min(64),
  CORS_ORIGIN: Joi.string().required(),
});

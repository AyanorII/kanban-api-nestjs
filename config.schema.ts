import * as Joi from '@hapi/joi';

export const configSchemaValidation = Joi.object({
  PGHOST: Joi.string().required(),
  PGPORT: Joi.number().default(5432).required(),
  PGUSER: Joi.string().required(),
  PGPASSWORD: Joi.string().required(),
  PGDATABASE: Joi.string().required(),
  PORT: Joi.number().required(),
});

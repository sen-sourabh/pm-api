export default () => ({
  env: process.env?.ENV,
  protocol: process.env?.PROTOCOL ?? 'https',
  host: process.env?.HOST ?? 'localhost',
  port: parseInt(process.env?.PORT, 10) ?? 4000,
  database: {
    type: process.env?.DATABASE_TYPE,
    host: process.env?.DATABASE_HOST,
    port: parseInt(process.env?.DATABASE_PORT, 10) ?? 3306,
    name: process.env?.DATABASE_NAME,
    username: process.env?.DATABASE_USERNAME,
    password: process.env?.DATABASE_PASSWORD,
    synchronize: !!process.env?.DATABASE_SYNCHRONIZE,
  },
  jwt: {
    secret_key: process.env?.JWT_SECRET_KEY,
  },
  smtp: {
    transport: {
      host: process.env?.SMTP_TRANSPORT_HOST,
      port: parseInt(process.env?.SMTP_TRANSPORT_PORT, 10) || 587,
      secure: !!process.env?.SMTP_TRANSPORT_SECURE,
      auth: {
        user: process.env?.SMTP_TRANSPORT_AUTH_USERNAME,
        pass: process.env?.SMTP_TRANSPORT_AUTH_PASSWORD,
      },
    },
    defaults: {
      from: process.env?.SMTP_DEFAULTS_FROM,
    },
    preview: !!process.env?.SMTP_PREVIEW,
    template: {
      name: process.env?.SMTP_TEMPLATE_DIR,
      options: {
        strict: !!process.env?.SMTP_TEMPLATE_OPTIONS_STRICT,
      },
    },
  },
  cache: {
    isGlobal: !!process.env?.CACHE_IS_GLOBAL,
    max: +process.env?.CACHE_MAX,
    ttl: +process.env?.CACHE_TTL,
  },
});

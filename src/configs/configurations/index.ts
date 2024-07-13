export default () => ({
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
    secret: process.env?.JWT_SECRET_KEY,
    signOptions: {
      expiresIn: process.env?.JWT_SIGN_EXPIRY,
    },
    global: !!process.env?.JWT_GLOBAL,
    verifyOptions: {
      complete: !!process.env?.JWT_VERIFY_COMPLETE,
    },
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
});

import { INestApplication } from '@nestjs/common';
import {
  DocumentBuilder,
  SwaggerCustomOptions,
  SwaggerDocumentOptions,
  SwaggerModule,
} from '@nestjs/swagger';
import { writeJsonToFile } from '../../core/helpers/file-operations';

const SwaggerCustomOption: SwaggerCustomOptions = {
  swaggerUrl: 'http://localhost:4000/api',
  explorer: false,
  customfavIcon:
    'https://camo.githubusercontent.com/b0ebd0d78a8a138e9937ba132b19fcaef3b585b32198d6a6c74023dd71dd85e6/68747470733a2f2f6c68332e676f6f676c6575736572636f6e74656e742e636f6d2f70772f41503147637a504b32424a424f4767365669624c366148466e49776d7458445046754976754f795166747653707139445943596d5a743033744e315361585a4139456f56766235446143675a3547496748664f75714937356639626a7950316d4f6e31304c6236504e585f4d704b6958536539566c79464444564d636c766b71306269794f5f51574c4e7a54645857727a4869474f715474795461593d773138302d6834342d732d6e6f2d676d3f61757468757365723d30',
  customSiteTitle: 'Vault',
  customCss: `
  .swagger-ui {
    zoom: 90%;
  }
`,
};

const SwaggerDocumentOption: SwaggerDocumentOptions = {
  operationIdFactory: (controllerKey: string, methodKey: string) => methodKey,
  deepScanRoutes: true,
  ignoreGlobalPrefix: false,
};

//Swagger Loader
const SwaggerLoader = () => {
  return new DocumentBuilder()
    .setTitle('Vault-api')
    .setDescription('Vault - Password manager')
    .setVersion('1.0')
    .setContact('Vault', 'Your website link', 'Your official gmail') // Set Contact information
    .addBearerAuth()
    .addServer('http://localhost:4000')
    .build();
};

//Swagger Initialization
export const SwaggerConfig = (app: INestApplication<any>): void => {
  const document = SwaggerModule.createDocument(app, SwaggerLoader(), SwaggerDocumentOption);
  writeJsonToFile(document);
  SwaggerModule.setup('api', app, document, SwaggerCustomOption);
};

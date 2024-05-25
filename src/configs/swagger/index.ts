import { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

//Swagger Loader
const SwaggerLoader = () => {
  return new DocumentBuilder()
    .setTitle('Vault-api')
    .setDescription('Vault - Password manager')
    .setVersion('1.0')
    .setContact('Vault', 'Your website link', 'Your official gmail') // Set Contact information
    .addBearerAuth() // Enable Bearer authentication for your API
    .build();
};

//Swagger Initialization
export const SwaggerConfig = (app: INestApplication<any>): void => {
  const document = SwaggerModule.createDocument(app, SwaggerLoader());
  SwaggerModule.setup('api', app, document);
};

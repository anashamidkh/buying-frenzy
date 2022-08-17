import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService: ConfigService = app.get(ConfigService);

  const config = new DocumentBuilder()
    .setTitle('Buying Frenzy')
    .setDescription('By Muhammad Anas Hamid')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document, {
    swaggerOptions: { defaultModelsExpandDepth: -1 },
  });

  try {
    await app.listen(configService.get('PORT'));
    console.log(
      `App started on port ${configService.get('PORT')} on ${new Date()}`,
    );
  } catch (err) {
    console.log(err);
  }
}
bootstrap();

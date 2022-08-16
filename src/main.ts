import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService: ConfigService = app.get(ConfigService);

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

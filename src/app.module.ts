import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { RestaurantModule } from './modules/restaurant/restaurant.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      useFactory: async (configService: ConfigService) => ({
        type: configService.get<any>('DATABASE_TYPE'),
        replication: {
          master: {
            host: configService.get<string>('DATABASE_HOST'),
            port: configService.get<number>('DATABASE_PORT'),
            username: configService.get<string>('DATABASE_USERNAME'),
            password: configService.get<string>('DATABASE_PASSWORD'),
            database: configService.get<string>('DATABASE_NAME'),
          },
          slaves: [
            {
              host: configService.get<string>('DATABASE_REPLICA_HOST'),
              port: configService.get<number>('DATABASE_REPLICA_PORT'),
              username: configService.get<string>('DATABASE_REPLICA_USERNAME'),
              password: configService.get<string>('DATABASE_REPLICA_PASSWORD'),
              database: configService.get<string>('DATABASE_REPLICA_NAME'),
            },
          ],
        },
        entities: [__dirname + configService.get<string>('ENTITIES')],
        migrationRun: false,
        synchronize: false,
        logging: process.env.ENABLE_QUERY_LOGGING === 'true',
      }),
      inject: [ConfigService],
    }),
    RestaurantModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import ormConfig from './config/ormconfig';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CamModule } from './cam/cam.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './user/user.module';
import { ServerModule } from './server/server.module';
import { CamsModule } from './cams/cams.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot(ormConfig()),
    CamModule,
    UserModule,
    ServerModule,
    CamsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

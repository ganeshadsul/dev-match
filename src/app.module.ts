import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongodbModule } from './mongodb/mongodb.module';
import { ProfileModule } from './profile/profile.module';

@Module({
  imports: [MongodbModule, ProfileModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

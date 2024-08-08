import {Module} from '@nestjs/common';
import {AppController} from './app.controller';
import {AppService} from './app.service';
import {MongooseModule} from '@nestjs/mongoose';
import * as process from "node:process";
import {ConfigModule} from "@nestjs/config";
import { ExampleModule } from './example/example.module';

@Module({
    imports: [
        //подключ конфигодуль для dotenv
        ConfigModule.forRoot(),
        // подключаем монго
        MongooseModule.forRoot(process.env.MONGO_CONNECTION),
        ExampleModule,
    ],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule {
}

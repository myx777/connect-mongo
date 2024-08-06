import {Module} from '@nestjs/common';
import {AppController} from './app.controller';
import {AppService} from './app.service';
import {MongooseModule} from '@nestjs/mongoose';
import * as process from "node:process";

@Module({
    imports: [
        // подключаем монго
        MongooseModule.forRoot(process.env.MONGO_CONNECTION),
    ],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule {
}

import {Module} from '@nestjs/common';
import {AppController} from './app.controller';
import {AppService} from './app.service';
import {MongooseModule} from '@nestjs/mongoose';

@Module({
    imports: [
        // подключаем монго
        MongooseModule.forRoot('mongodb://example:example@localhost:27017/example'),
    ],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule {
}

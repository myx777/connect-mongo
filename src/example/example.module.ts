import { Module } from '@nestjs/common';
import {Example, ExampleSchema} from "./schemas/example.schema";
import {MongooseModule} from "@nestjs/mongoose";
import { ExampleController } from './example.controller';
import { ExampleService } from './example.service';

@Module({
    imports: [
        MongooseModule.forFeature([
            { name: Example.name, schema: ExampleSchema },
        ])
    ],
    controllers: [ExampleController],
    providers: [ExampleService],
    exports: [ExampleService],
})
export class ExampleModule {}

import {Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put} from '@nestjs/common';
import {ExampleService} from "./example.service";
import {ExampleDocument} from "./schemas/example.schema";
import {CreateExampleDto} from "./interfaces/dto/create-example";

@Controller('example')
export class ExampleController {
    constructor(private readonly exampleService: ExampleService) {}

    @Post()
    public create(@Body() body: CreateExampleDto): Promise<ExampleDocument> {
        return this.exampleService.create(body);
    }

    @Get()
    public getAll(): Promise<ExampleDocument[]> {
        return this.exampleService.getAll();
    }

    @Delete(':id')
    public  delete(@Param('id') id: string): Promise<ExampleDocument | null> {
        return this.exampleService.delete(id);
    }

    @Put(':id')
    public update(@Param('id') id: string, @Body() body: CreateExampleDto): Promise<ExampleDocument | null> {
        return this.exampleService.update(id, body);
    }
}

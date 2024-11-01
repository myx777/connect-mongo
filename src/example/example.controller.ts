import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { ExampleService } from './example.service';
import { ExampleDocument } from './schemas/example.schema';
import { CreateExampleDto } from './interfaces/dto/create-example';

@Controller('example')
export class ExampleController {
  constructor(private readonly exampleService: ExampleService) {}

  /**
   * Создает новый документ в базе данных.
   * @param {CreateExampleDto} body - Данные для создания документа.
   * @returns {Promise<ExampleDocument>} - Объект созданного документа.
   */
  @Post()
  public create(@Body() body: CreateExampleDto): Promise<ExampleDocument> {
    return this.exampleService.create(body);
  }

  /**
   * Получает список всех документов.
   * @returns {Promise<ExampleDocument[]>} - Массив всех документов.
   */
  @Get()
  public getAll(): Promise<ExampleDocument[]> {
    return this.exampleService.getAll();
  }

  /**
   * Удаляет документ по его идентификатору.
   * @param {string} id - Идентификатор документа для удаления.
   * @returns {Promise<ExampleDocument | null>} - Удаленный документ или `null`, если документ не найден.
   */
  @Delete(':id')
  public delete(@Param('id') id: string): Promise<ExampleDocument | null> {
    return this.exampleService.delete(id);
  }

  /**
   * Обновляет документ по его идентификатору.
   * @param {string} id - Идентификатор документа для обновления.
   * @param {CreateExampleDto} body - Данные для обновления документа.
   * @returns {Promise<ExampleDocument | null>} - Обновленный документ или `null`, если документ не найден.
   */
  @Put(':id')
  public update(
    @Param('id') id: string,
    @Body() body: CreateExampleDto,
  ): Promise<ExampleDocument | null> {
    const updatedDocument = this.exampleService.update(id, body);
    if (!updatedDocument) {
      throw new NotFoundException(`Document with ID ${id} not found`);
    }
    return updatedDocument;
  }
}

import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel, InjectConnection } from '@nestjs/mongoose';
import { Example, ExampleDocument } from './schemas/example.schema';
import { Connection, Model } from 'mongoose';
import { CreateExampleDto } from './interfaces/dto/create-example';

@Injectable()
export class ExampleService {
  constructor(
    @InjectModel(Example.name) private ExampleModel: Model<ExampleDocument>,
    @InjectConnection() private connection: Connection,
  ) {}

  public create(data: CreateExampleDto): Promise<ExampleDocument> {
    const document = new this.ExampleModel(data);

    return document.save();
  }

  public async delete(id: string): Promise<ExampleDocument | null> {
    const deletedDocument = await this.ExampleModel.findByIdAndDelete(id);

    if (!deletedDocument) {
      throw new NotFoundException(`Document with ID ${id} not found`);
    }

    return deletedDocument;
  }

  public async update(
    id: string,
    data: CreateExampleDto,
  ): Promise<ExampleDocument | null> {
    const document: ExampleDocument =
      await this.ExampleModel.findById(id).exec();
    if (!document) return null;

    document.description = data.description;
    return document.save();
  }

  public getAll(): Promise<ExampleDocument[]> {
    return this.ExampleModel.find({}).exec();
  }
}

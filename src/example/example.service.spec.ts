import { Test, TestingModule } from '@nestjs/testing';
import { ExampleService } from './example.service';
import { getModelToken } from '@nestjs/mongoose';
import { Example, ExampleDocument } from './schemas/example.schema';
import { Model } from 'mongoose';
import { CreateExampleDto } from './interfaces/dto/create-example';

/**
 * MockExampleModel — это класс-заглушка для тестирования методов Mongoose Model.
 * @property {string} description - Описание документа.
 */
class MockExampleModel {
  description: string;

  /**
   * Создает экземпляр MockExampleModel.
   * @param {CreateExampleDto} data - Данные для создания документа.
   */
  constructor(private data: CreateExampleDto) {
    this.description = data.description;
  }

  /**
   * Сохраняет документ и возвращает его с добавленным `_id`.
   * @returns {Promise<Object>} Обещание, возвращающее документ с `_id`.
   */
  save = jest.fn().mockResolvedValue({ ...this.data, _id: 'mocked_id' });

  /**
   * Находит документы и возвращает их список.
   * @returns {Object} Мок-объект для цепочки вызовов `exec`.
   */
  static find = jest.fn().mockReturnValue({
    exec: jest.fn().mockResolvedValue([
      { _id: '1', description: 'Doc 1' },
      { _id: '2', description: 'Doc 2' },
    ]),
  });

  static findById = jest.fn();
  static findByIdAndDelete = jest.fn();
}

describe('ExampleService', () => {
  let service: ExampleService;
  let model: Model<ExampleDocument>;

  /**
   * Инициализация тестового модуля и создание сервиса перед каждым тестом.
   */
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ExampleService,
        /**
         * Подключение фиктивных моделей
         */
        {
          provide: getModelToken(Example.name),
          useValue: MockExampleModel,
        },
        /**
         * Мок-контекст для подключения к базе данных.
         */
        {
          provide: 'DatabaseConnection',
          useValue: {},
        },
      ],
    }).compile();

    service = module.get<ExampleService>(ExampleService);
    model = module.get<Model<ExampleDocument>>(getModelToken(Example.name));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    /**
     * Тестирует метод `create`, создавая и возвращая новый документ.
     */
    it('should create a new document and return it', async () => {
      const data: CreateExampleDto = { description: 'Test description' };
      const result = await service.create(data);

      expect(result).toEqual({ ...data, _id: 'mocked_id' });
    });
  });

  describe('delete', () => {
    /**
     * Тестирует метод `delete`, удаляя документ по ID и возвращая его.
     */
    it('should delete a document by id and return it', async () => {
      const id = 'someId';
      const deletedDoc = { _id: id, description: 'Test description' };
      MockExampleModel.findByIdAndDelete.mockResolvedValueOnce(deletedDoc);

      const result = await service.delete(id);

      expect(MockExampleModel.findByIdAndDelete).toHaveBeenCalledWith(id);
      expect(result).toEqual(deletedDoc);
    });

    /**
     * Тестирует метод `delete`, возвращая `null`, если документ не найден.
     */
    it('should return null if document is not found', async () => {
      const id = 'nonexistentId';
      MockExampleModel.findByIdAndDelete.mockResolvedValueOnce(null);

      const result = await service.delete(id);

      expect(result).toBeNull();
    });
  });

  describe('update', () => {
    /**
     * Тестирует метод `update`, обновляя и возвращая обновленный документ.
     */
    it('should update a document and return the updated document', async () => {
      const id = 'someId';
      const data: CreateExampleDto = { description: 'Updated description' };
      const foundDoc = new MockExampleModel({ description: 'Old description' });
      foundDoc.save = jest.fn().mockResolvedValue({ _id: id, ...data });
      MockExampleModel.findById.mockReturnValueOnce({
        exec: jest.fn().mockResolvedValue(foundDoc),
      });

      const result = await service.update(id, data);

      expect(MockExampleModel.findById).toHaveBeenCalledWith(id);
      expect(foundDoc.description).toEqual(data.description);
      expect(result).toEqual({ _id: id, ...data });
    });

    /**
     * Тестирует метод `update`, возвращая `null`, если документ не найден.
     */
    it('should return null if document is not found', async () => {
      const id = 'nonexistentId';
      MockExampleModel.findById.mockReturnValueOnce({
        exec: jest.fn().mockResolvedValue(null),
      });

      const result = await service.update(id, {
        description: 'New description',
      });

      expect(result).toBeNull();
    });
  });

  describe('getAll', () => {
    /**
     * Тестирует метод `getAll`, возвращая массив документов.
     */
    it('should return an array of documents', async () => {
      const result = await service.getAll();

      expect(result).toEqual([
        { _id: '1', description: 'Doc 1' },
        { _id: '2', description: 'Doc 2' },
      ]);
    });

    /**
     * Тестирует метод `getAll`, возвращая пустой массив, если документы не найдены.
     */
    it('should return an empty array if no documents are found', async () => {
      MockExampleModel.find.mockReturnValueOnce({
        exec: jest.fn().mockResolvedValue([]),
      });

      const result = await service.getAll();

      expect(result).toEqual([]);
    });
  });
});

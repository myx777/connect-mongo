/**
 * @module ExampleController
 * @description Тесты для контроллера ExampleController.
 */

import * as request from 'supertest';
import { Test, TestingModule } from '@nestjs/testing';
import { ExampleController } from './example.controller';
import { INestApplication, NotFoundException } from '@nestjs/common';
import { ExampleService } from './example.service';

/**
 * @describe ExampleController
 * @test {ExampleController}
 */
describe('ExampleController', () => {
  let app: INestApplication;

  const mockDataTwoObject = [
    { _id: '1', description: 'Document 1' },
    { _id: '2', description: 'Document 2' },
  ];
  const mockDataOneObject = { _id: '3', description: 'Document 3' };

  /**
   * Мок сервис ExampleService для тестирования.
   * @type {Object}
   */
  const mockExampleService = {
    getAll: jest.fn().mockResolvedValue(mockDataTwoObject),
    create: jest.fn().mockResolvedValue(mockDataOneObject),
    delete: jest.fn().mockImplementation((id: string) => {
      // Имитация поведения для проверки существования документа
      const document = mockDataTwoObject.find((doc) => doc._id === id);
      if (!document) {
        throw new NotFoundException(`Document with ID ${id} not found`);
      }
      return Promise.resolve(document);
    }),
    update: jest.fn().mockImplementation((id: string, updateDto: any) => {
      const documentIndex = mockDataTwoObject.findIndex(
        (doc) => doc._id === id,
      );
      if (documentIndex === -1) {
        return null;
      }

      const updatedDocument = {
        ...mockDataTwoObject[documentIndex],
        ...updateDto,
      };
      mockDataTwoObject[documentIndex] = updatedDocument; // Симуляция обновления
      return Promise.resolve(updatedDocument);
    }),
  };

  /**
   * Устанавливает приложение Nest перед запуском всех тестов.
   * @returns {Promise<void>}
   */
  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      controllers: [ExampleController],
      providers: [
        {
          provide: ExampleService,
          useValue: mockExampleService,
        },
      ],
    }).compile();

    app = moduleRef.createNestApplication();
    await app.init();
  });

  /**
   * Закрывает приложение Nest после завершения всех тестов.
   * @returns {Promise<void>}
   */
  afterAll(async () => {
    await app.close();
  });

  /**
   * Тестирование маршрута GET /example.
   */
  describe('GET /example', () => {
    it('GET /example - should return all documents', () => {
      return request(app.getHttpServer())
        .get('/example')
        .expect(200)
        .expect((res) => {
          expect(res.body).toEqual(mockDataTwoObject);
        });
    });
  });

  /**
   * Тестирование маршрута POST /example.
   */
  describe('POST /example', () => {
    it('POST /example - should create new document', () => {
      return request(app.getHttpServer())
        .post('/example')
        .send({ description: 'Document 3' })
        .expect(201)
        .expect((res) => {
          expect(res.body).toEqual(mockDataOneObject);
        });
    });

    /**
     * Тестирование маршрута DELETE /example/:id.
     */
    it('DELETE /example/:id - should delete document', async () => {
      return request(app.getHttpServer())
        .delete('/example/1') // Изменяем на ID, который существует
        .expect(200)
        .expect((res) => {
          expect(res.body).toEqual({ _id: '1', description: 'Document 1' }); // Ожидаем удаленный документ
        });
    });

    it('DELETE /example/:id - should return NotFoundException for invalid id', async () => {
      return request(app.getHttpServer())
        .delete('/example/3') // Неверный ID
        .expect(404)
        .expect((res) => {
          expect(res.body.message).toEqual('Document with ID 3 not found'); // Изменяем сообщение на соответствующее ID
        });
    });
  });

  /**
   * Тестирование маршрутов PUT /example/:id.
   */
  describe('PUT', () => {
    it('PUT  /example/:id - should find document and update', () => {
      return request(app.getHttpServer())
        .put('/example/2')
        .send({ description: 'Updated Document 2' })
        .expect(200)
        .expect((res) => {
          expect(res.body).toEqual({
            _id: '2',
            description: 'Updated Document 2',
          });
        });
    });

    it('PUT  /example/:id - should return NotFoundException for invalid id', () => {
      return request(app.getHttpServer())
        .put('/example/5')
        .send({ description: 'Document 3' })
        .expect(404)
        .expect((res) => {
          expect(res.body.message).toEqual('Document with ID 5 not found');
        });
    });
  });
});

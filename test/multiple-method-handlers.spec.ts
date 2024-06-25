import { Test } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { MultipleHandlers } from './handlers/multiple-handlers';

describe('MultipleHandlers', () => {
  let app: INestApplication;
  let multipleHandlers: MultipleHandlers;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [MultipleHandlers],
    }).compile();

    app = moduleRef.createNestApplication();
    await app.init();

    multipleHandlers = moduleRef.get<MultipleHandlers>(MultipleHandlers);
  });

  afterAll(async () => {
    await app.close();
  });

  it('should return the payload for subMethod', async () => {
    const payload = { data: 'test' };
    const version = '1.0';
    const method = 'subMethod';
    const id = '12345';

    const result = await multipleHandlers.subMethod(
      payload,
      version,
      method,
      id,
    );

    expect(result).toEqual(payload);
  });

  it('should return the payload for subMethod1', async () => {
    const payload = { data: 'test1' };
    const version = '1.0';
    const method = 'subMethod1';
    const id = '67890';

    const result = await multipleHandlers.subMethod1(
      payload,
      version,
      method,
      id,
    );

    expect(result).toEqual(payload);
  });
});

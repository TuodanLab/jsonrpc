import { Test } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { CustomHeaderHandler } from './handlers/custom-header';

describe('CustomHeaderHandler', () => {
  let app: INestApplication;
  let customHeaderHandler: CustomHeaderHandler;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [CustomHeaderHandler],
    }).compile();

    app = moduleRef.createNestApplication();
    await app.init();

    customHeaderHandler =
      moduleRef.get<CustomHeaderHandler>(CustomHeaderHandler);
  });

  afterAll(async () => {
    await app.close();
  });

  it('should return the payload and set custom header', async () => {
    const payload = { data: 'test' };
    const version = '1.0';
    const method = 'invoke';
    const id = '12345';

    const result = await customHeaderHandler.invoke(
      payload,
      version,
      method,
      id,
    );

    expect(result).toEqual(payload);
  });
});

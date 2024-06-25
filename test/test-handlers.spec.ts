import { Test, TestingModule } from '@nestjs/testing';
import { TestHandler } from './handlers/test-handler';

describe('TestHandler', () => {
  let testHandler: TestHandler;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TestHandler],
    }).compile();

    testHandler = module.get<TestHandler>(TestHandler);
  });

  it('should handle invoke method correctly', async () => {
    const payload = { message: 'Hello, world!' };
    const version = '1.0';
    const method = 'invoke';
    const id = '12345';

    const result = await testHandler.invoke(payload, version, method, id);

    expect(result).toEqual(payload);
  });
});

import { beforeAll, describe, expect, it } from 'vitest';
import { HelloHandler } from '../src/hello.handler';
import { AppService } from '../src/app.service';

describe('app service', () => {
  let helloHandler: HelloHandler;

  beforeAll(async () => {
    const appService = new AppService();
    helloHandler = new HelloHandler(appService);
  });

  it('invoke', async () => {
    const result = await helloHandler.invoke();
    expect(result).toBe('Hello World!');
  });
});

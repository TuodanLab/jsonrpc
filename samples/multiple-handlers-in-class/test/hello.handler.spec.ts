import { beforeEach, describe, expect, it } from 'vitest';
import { HelloHandler } from 'src/hello.handler';
import { AppService } from 'src/app.service';

describe('app service', () => {
  let helloHandler: HelloHandler;

  beforeEach(async () => {
    const appService = new AppService();
    helloHandler = new HelloHandler(appService);
  });

  it('invoke', async () => {
    const resultAdd = await helloHandler.add();
    const resultDelete = await helloHandler.delete();
    expect(resultAdd).toBe('Hello World!');
    expect(resultDelete).toBe('Hello World!');
  });
});

import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { AppModule } from '../src/app.module';
import { beforeAll, describe, expect, it } from 'vitest';
import { AppService } from '../src/app.service';

describe('app service', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
      providers: [AppService],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('get hello', async () => {
    const result = await (
      await app.select(AppModule).resolve(AppService)
    ).getHello();
    expect(result).toBe('Hello World!');
  });
});

import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { AppModule } from '../src/app.module';
import { beforeEach, describe, expect, it } from 'vitest';
import { AppService } from '../src/app.service';

describe('app service', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
      providers: [AppService],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('get hello', async () => {
    const result = await app.select(AppModule).get(AppService).getHello();
    expect(result).toBe('Hello World!');
  });
});

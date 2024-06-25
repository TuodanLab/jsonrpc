import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { AppModule } from '../src/app.module';
import { describe, expect, it } from 'vitest';
import { SecureHandler } from '../src/secure.handler';

describe('secure handler', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
      providers: [SecureHandler],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('invoke', async () => {
    const result = await app.select(AppModule).get(SecureHandler).invoke();
    expect(result).toBe('secure');
  });
});

import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { AppModule } from '../src/app.module';
import { beforeEach, describe, expect, it } from 'vitest';
import { SignInHandler } from '../src/sign-in.handler';
import { SecureHandler } from 'src/secure.handler';

describe('secure handler', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
      providers: [SecureHandler],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('invoke', async () => {
    const result = await app.select(AppModule).get(SecureHandler).invoke();
    expect(result).toBe('secure');
  });
});

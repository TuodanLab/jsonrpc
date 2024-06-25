import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { AppModule } from '../src/app.module';
import { beforeEach, describe, expect, it } from 'vitest';
import { SignInHandler } from '../src/sign-in.handler';

describe('sign in handler', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
      providers: [SignInHandler],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('invoke', async () => {
    const result = await app
      .select(AppModule)
      .get(SignInHandler)
      .invoke(
        { login: 'test', password: 'password' },
        '2.0',
        '1719047613941.11370',
        'signin.invoke',
      );
    expect(result).toBeDefined();
  });
});

import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { AppModule } from '../src/app.module';
import { describe, expect, it } from 'vitest';
import { JwtStrategy } from '../src/jwt.strategy';

describe('jwt strategy', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
      providers: [JwtStrategy],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('validate', async () => {
    const result = await app
      .select(AppModule)
      .get(JwtStrategy)
      .validate({ id: 1 });
    expect(result.name).toBe('Pedro');
    expect(result.password).toBe('password');
  });
});

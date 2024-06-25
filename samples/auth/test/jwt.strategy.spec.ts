import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { AppModule } from '../src/app.module';
import { beforeEach, describe, expect, it } from 'vitest';
import { JwtStrategy } from '../src/jwt.strategy';

describe('jwt strategy', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
      providers: [JwtStrategy],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
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

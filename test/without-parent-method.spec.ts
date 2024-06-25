import { Test, TestingModule } from '@nestjs/testing';
import { describe, beforeEach, it, expect } from 'vitest';
import { WithoutParentMethod } from './handlers/without-parent-method';

describe('WithoutParentMethod', () => {
  let withoutParentMethod: WithoutParentMethod;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [WithoutParentMethod],
    }).compile();

    withoutParentMethod = module.get<WithoutParentMethod>(WithoutParentMethod);
  });

  it('should return "withoutParentMethod" when subMethod is called', async () => {
    const payload = { message: 'Hello, world!' };
    const version = '1.0';
    const method = 'subMethod';
    const id = '12345';

    const result = await withoutParentMethod.subMethod(
      payload,
      version,
      method,
      id,
    );

    expect(result).toEqual('withoutParentMethod');
  });
});

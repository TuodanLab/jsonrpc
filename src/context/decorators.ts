import {
  applyDecorators,
  createParamDecorator,
  ExecutionContext,
  Injectable,
  InjectableOptions,
  SetMetadata,
} from '@nestjs/common';
import { RpcMetadata } from '../interfaces';

export const RpcMetadataKey = '__rpc-metadata__';

export const RpcMethodMetadataKey = '__rpc-method-metadata__';

export const RpcPayload = createParamDecorator(
  (field: string, ctx: ExecutionContext) => {
    const req = ctx.switchToHttp().getRequest();
    if (field) {
      const params = req.body.params && req.body.params[0];
      return params && params[field];
    }
    return req.body.params && req.body.params[0];
  },
);

export const RpcId = createParamDecorator((_data, ctx: ExecutionContext) => {
  const req = ctx.switchToHttp().getRequest();
  return req.body.id || null;
});

export const RpcVersion = createParamDecorator(
  (_data, ctx: ExecutionContext) => {
    const req = ctx.switchToHttp().getRequest();
    return req.body.jsonrpc;
  },
);

export const RpcMethod = createParamDecorator(
  (_data, ctx: ExecutionContext) => {
    const req = ctx.switchToHttp().getRequest();
    return req.body.method;
  },
);

export const RpcPackage = (data?: RpcMetadata & InjectableOptions) => {
  const scope = data ? data.scope : undefined;
  const method = data ? data.namespace : '';
  return applyDecorators(
    SetMetadata(RpcMetadataKey, { method }),
    Injectable({ scope }),
  );
};

export const Rpc = (name: string) => {
  return applyDecorators(SetMetadata(RpcMethodMetadataKey, { name }));
};

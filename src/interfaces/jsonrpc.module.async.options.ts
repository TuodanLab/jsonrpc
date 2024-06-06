import { Type } from '@nestjs/common';
import { JsonRpcOptionsFactory } from './jsonrpc.options.factory';
import { JsonRpcConfig } from './jsonrpc.config';

export interface JsonRpcModuleAsyncOptions {
  imports?: any[];
  useExisting?: Type<JsonRpcOptionsFactory>;
  useClass?: Type<JsonRpcOptionsFactory>;
  useFactory?: (...args: any[]) => Promise<JsonRpcConfig> | JsonRpcConfig;
  inject?: any[];
}

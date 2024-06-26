import { Type } from '@nestjs/common';
import { InstanceWrapper } from '@nestjs/core/injector/instance-wrapper';
import { Observable } from 'rxjs';

export interface IRpcHandler<T = unknown> {
  invoke(...args: any);
}

export interface RpcErrorInterface {
  jsonrpc: string;
  error?: any;
  method?: string;
  id: number | string;
}

export interface RpcRequestInterface {
  jsonrpc: string;
  params?: any;
  id: number | string;
  method: string;
}

export interface RpcResultInterface {
  jsonrpc: string;
  result?: any;
  method?: string;
  id: number | string;
}

export interface JsonRpcConfig {
  path: string;
}

export interface JsonRpcOptionsFactory {
  createJsonRpcOptions(): Promise<JsonRpcConfig> | JsonRpcConfig;
}

export interface JsonRpcModuleAsyncOptions {
  imports?: any[];
  useExisting?: Type<JsonRpcOptionsFactory>;
  useClass?: Type<JsonRpcOptionsFactory>;
  useFactory?: (...args: any[]) => Promise<JsonRpcConfig> | JsonRpcConfig;
  inject?: any[];
}

export interface RpcMetadata {
  namespace?: string;
}

export interface RpcMethodHandler {
  methodName: string;
  callback: (...args: any[]) => Observable<any> | Promise<any> | any;
  rpcMethodName: string;
  instanceWrapper: InstanceWrapper<IRpcHandler<any> | Type<any>>;
}

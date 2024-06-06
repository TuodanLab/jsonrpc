import { JsonRpcConfig } from './jsonrpc.config';

export interface JsonRpcOptionsFactory {
  createJsonRpcOptions(): Promise<JsonRpcConfig> | JsonRpcConfig;
}

import { MODULE_PATH } from '@nestjs/common/constants';
import { HttpServer, Type } from '@nestjs/common/interfaces';
import { Resolver } from '@nestjs/core/router/interfaces/resolver.interface';
import { ApplicationConfig, NestContainer } from '@nestjs/core';
import { Injector } from '@nestjs/core/injector/injector';
import { RpcMethodHandler } from './interfaces';
import { JsonRpcExplorer } from './jsonrpc.explorer';
import { RouterProxyCallback } from '@nestjs/core/router/router-proxy';
import { RpcCallbackProxy } from './rpc.callback.proxy';
import { ProxyCallback } from './types';
import { logger } from '@tuodan/logger';
export const RPC_MAPPING_MESSAGE = (method: string) => `Mapped {${method}} rpc`;

export interface RpcProxyHandler {
  proxy: ProxyCallback;
  method: string;
}

export class RpcRoutesResolver implements Resolver {
  private rpcCallbackProxy: RpcCallbackProxy;

  constructor(
    private readonly container: NestContainer,
    private readonly config: ApplicationConfig,
    private readonly injector: Injector,
    private readonly jsonRpcExplorer: JsonRpcExplorer,
  ) {
    this.rpcCallbackProxy = new RpcCallbackProxy(
      this.config,
      this.container,
      this.injector,
    );
  }

  public resolve<T extends HttpServer>(
    _applicationRef: T,
  ): Map<string, RouterProxyCallback> {
    const modules = this.container.getModules();
    const handlers = new Map<string, RouterProxyCallback>();
    modules.forEach((module, moduleName) => {
      const rpcMethodHandlers = this.jsonRpcExplorer.explore(module);
      const moduleRpcProxies = this.registerRouters(
        rpcMethodHandlers,
        moduleName,
      );
      moduleRpcProxies.forEach(({ method, proxy }) =>
        handlers.set(method, proxy),
      );
    });
    return handlers;
  }

  public registerRouters(
    routes: RpcMethodHandler[],
    moduleKey: string,
  ): RpcProxyHandler[] {
    return routes.map((rpcMethodHandler) => {
      const { rpcMethodName } = rpcMethodHandler;
      logger.info(RPC_MAPPING_MESSAGE(rpcMethodName));
      const proxy = this.rpcCallbackProxy.create(rpcMethodHandler, moduleKey);
      return { proxy, method: rpcMethodName };
    });
  }

  public registerNotFoundHandler() {}

  public registerExceptionHandler() {}

  private getModulePathMetadata(metatype: Type<unknown>): string | undefined {
    return Reflect.getMetadata(MODULE_PATH, metatype);
  }
}

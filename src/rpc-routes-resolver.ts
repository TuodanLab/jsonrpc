import { MODULE_PATH } from '@nestjs/common/constants';
import { HttpServer, Type } from '@nestjs/common/interfaces';
import { Logger } from '@nestjs/common/services/logger.service';
import { Resolver } from '@nestjs/core/router/interfaces/resolver.interface';
import { ApplicationConfig, MetadataScanner, NestContainer } from '@nestjs/core';
import { Injector } from '@nestjs/core/injector/injector';
import { JsonRpcConfig, RpcMethodHandler } from './interfaces';
import { JsonRpcExplorer } from './json-rpc-explorer';
import { RouterProxyCallback } from '@nestjs/core/router/router-proxy';
import { RpcMetadataKey } from './index';
import { RpcCallbackProxy } from './rpc-callback-proxy';
import { ProxyCallback } from './types';

export const RPC_MAPPING_MESSAGE = (name: string, path: string) =>
    `Registered ${name} {${path}}:`;

export interface RpcProxyHandler {
    proxy: ProxyCallback;
    method: string;
}

export class RpcRoutesResolver implements Resolver {
    private readonly logger = new Logger(RpcRoutesResolver.name, true);
    private rpcCallbackProxy: RpcCallbackProxy;
    private jsonRpcExplorer: JsonRpcExplorer;

    constructor(
        private readonly container: NestContainer,
        private readonly config: ApplicationConfig,
        private readonly injector: Injector,
        private readonly rpcConfig: JsonRpcConfig,
        private readonly metadataScanner: MetadataScanner,
    ) {
        this.jsonRpcExplorer = new JsonRpcExplorer(this.metadataScanner);
        this.rpcCallbackProxy = new RpcCallbackProxy(
            this.config,
            this.container,
            this.injector,
        );
    }

    public resolve<T extends HttpServer>(applicationRef: T, basePath: string): Map<string, RouterProxyCallback> {
        const modules = this.container.getModules();
        const handlers = new Map<string, RouterProxyCallback>();
        modules.forEach(({ providers, metatype }, moduleName) => {
            let path = metatype ? this.getModulePathMetadata(metatype) : undefined;
            path = path ? basePath + path : basePath;
            const rpcMethodHandlers = this.jsonRpcExplorer.explore(providers);
            const moduleRpcProxies = this.registerRouters(rpcMethodHandlers, moduleName, path);
            moduleRpcProxies.forEach(({ method, proxy }) => handlers.set(method, proxy))
        });

        return handlers;
    }

    public registerRouters(
        routes: RpcMethodHandler[],
        moduleKey: string,
        basePath: string,
    ): RpcProxyHandler[] {
        const path = basePath + this.rpcConfig.path;
        return routes.map(rpcMethodHandler => {
            const { instanceWrapper, rpcMethodName } = rpcMethodHandler;
            const { metatype } = instanceWrapper;

            const rpcHandlerName = metatype.name;
            this.logger.log(
                RPC_MAPPING_MESSAGE(
                    rpcHandlerName,
                    path,
                ),
            );

            const proxy = this.rpcCallbackProxy.create(
                rpcMethodHandler,
                moduleKey,
            );

            return { proxy, method: rpcMethodName };
        });
    }

    // tslint:disable-next-line:no-empty
    public registerNotFoundHandler() {
    }

    // tslint:disable-next-line:no-empty
    public registerExceptionHandler() {
    }

    private getModulePathMetadata(metatype: Type<unknown>): string | undefined {
        return Reflect.getMetadata(MODULE_PATH, metatype);
    }
}

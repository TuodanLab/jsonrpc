import {
  DynamicModule,
  Inject,
  Module,
  OnModuleInit,
  Provider,
} from '@nestjs/common';
import {
  ApplicationConfig,
  HttpAdapterHost,
  ModuleRef,
  NestContainer,
  DiscoveryModule,
} from '@nestjs/core';
import { JsonRpcServer } from './jsonrpc.server';
import {
  JsonRpcConfig,
  JsonRpcModuleAsyncOptions,
  JsonRpcOptionsFactory,
} from './index';
import { RpcRoutesResolver } from './rpc.routes.resolver';
import { Injector } from '@nestjs/core/injector/injector';
import { JsonRpcExplorer } from './jsonrpc.explorer';

export const JSON_RPC_OPTIONS = '__JSON_RPC_OPTIONS__';

@Module({})
export class JsonRpcModule implements OnModuleInit {
  constructor(
    private rpcServer: JsonRpcServer,
    @Inject(JSON_RPC_OPTIONS) private config: JsonRpcConfig,
    private moduleRef: ModuleRef,
    private nestConfig: ApplicationConfig,
    private httpAdapterHost: HttpAdapterHost,
    private jsonRpcExplorer: JsonRpcExplorer,
  ) {}

  public static forRoot(config: JsonRpcConfig): DynamicModule {
    return {
      module: JsonRpcModule,
      imports: [DiscoveryModule],
      providers: [
        {
          provide: JSON_RPC_OPTIONS,
          useValue: config,
        },
        JsonRpcServer,
        JsonRpcExplorer,
      ],
      exports: [
        {
          provide: JSON_RPC_OPTIONS,
          useValue: config,
        },
      ],
      controllers: [],
    };
  }

  public static forRootAsync(
    options: JsonRpcModuleAsyncOptions,
  ): DynamicModule {
    return {
      module: JsonRpcModule,
      imports: [...(options.imports || []), DiscoveryModule],
      providers: [
        JsonRpcServer,
        JsonRpcExplorer,
        ...this.createAsyncProvider(options),
      ],
      exports: [...this.createAsyncProvider(options)],
    };
  }

  private static createAsyncProvider(
    options: JsonRpcModuleAsyncOptions,
  ): Provider[] {
    if (options.useExisting || options.useFactory) {
      return [this.createAsyncOptionsProvider(options)];
    }
    return [
      this.createAsyncOptionsProvider(options),
      {
        provide: options.useClass,
        useClass: options.useClass,
      },
    ];
  }

  private static createAsyncOptionsProvider(
    options: JsonRpcModuleAsyncOptions,
  ): Provider {
    if (options.useFactory) {
      return {
        provide: JSON_RPC_OPTIONS,
        useFactory: options.useFactory,
        inject: options.inject || [],
      };
    }
    return {
      provide: JSON_RPC_OPTIONS,
      useFactory: async (optionsFactory: JsonRpcOptionsFactory) =>
        await optionsFactory.createJsonRpcOptions(),
      inject: [options.useExisting || options.useClass],
    };
  }

  public async onModuleInit() {
    const { container, injector } = this.moduleRef as any as {
      container: NestContainer;
      injector: Injector;
    };
    const routesResolver = new RpcRoutesResolver(
      container,
      this.nestConfig,
      injector,
      this.jsonRpcExplorer,
    );
    const rpcHandlers = routesResolver.resolve(
      this.httpAdapterHost.httpAdapter,
    );
    this.rpcServer.run(rpcHandlers, this.config);
  }
}

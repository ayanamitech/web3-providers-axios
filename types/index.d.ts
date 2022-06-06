/// <reference types="node" />
/// <reference types="node" />
import type { fetchConfig } from 'axios-auto';
import type { JsonRpcResponse } from 'web3-core-helpers';
import type { Agent as HTTPAgent } from 'http';
import type { Agent as HTTPSAgent } from 'https';
import type { AxiosRequestHeaders } from 'axios';
export interface HttpProviderAgent {
    http?: HTTPAgent;
    https?: HTTPSAgent;
}
export interface HttpProviderOptions {
    withCredentials?: boolean;
    timeout?: number;
    headers?: AxiosRequestHeaders;
    agent?: HttpProviderAgent;
    keepAlive?: boolean;
}
export declare type AxiosAutoOptions = Omit<fetchConfig, 'url' | 'withCredentials' | 'timeout' | 'httpAgent' | 'httpsAgent'>;
export declare class Web3AxiosProvider {
    host: string;
    withCredentials?: boolean;
    timeout: number;
    headers?: AxiosRequestHeaders;
    agent?: HttpProviderAgent;
    connected: boolean;
    axiosOptions?: AxiosAutoOptions;
    constructor(host?: string, options?: HttpProviderOptions, axiosOptions?: AxiosAutoOptions);
    send(payload: object, callback?: (error: Error | null, result: JsonRpcResponse | undefined) => void): void;
    disconnect(): boolean;
    supportsSubscriptions(): boolean;
}
export default Web3AxiosProvider;

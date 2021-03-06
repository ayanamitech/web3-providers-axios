/// <reference types="node" />
/// <reference types="node" />
import type { fetchConfig, filter } from 'axios-auto';
import type { Agent as HTTPAgent } from 'http';
import type { Agent as HTTPSAgent } from 'https';
export interface HttpProviderAgent {
    http?: HTTPAgent;
    https?: HTTPSAgent;
}
export interface HttpProviderOptions {
    withCredentials?: boolean;
    timeout?: number;
    headers?: any;
    agent?: HttpProviderAgent;
    keepAlive?: boolean;
    filter?: filter;
}
export interface payloadObject {
    jsonrpc?: string;
    id?: number | string;
    method: string;
    params?: any[];
}
export declare type AxiosAutoOptions = Omit<fetchConfig, 'url' | 'withCredentials' | 'timeout' | 'httpAgent' | 'httpsAgent'>;
export default class Web3AxiosProvider {
    host: string;
    withCredentials: boolean;
    timeout: number;
    headers?: any;
    agent?: HttpProviderAgent;
    connected: boolean;
    filter?: filter;
    axiosOptions?: AxiosAutoOptions;
    constructor(host?: string, options?: HttpProviderOptions, axiosOptions?: AxiosAutoOptions);
    send(payload: payloadObject | payloadObject[], callback?: (error: Error | null, result?: any) => void): void;
    disconnect(): boolean;
    supportsSubscriptions(): boolean;
}

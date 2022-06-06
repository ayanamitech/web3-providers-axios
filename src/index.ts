import { post } from 'axios-auto';
import { XMLHttpRequest } from 'xhr2-cookies';
import type { fetchConfig, getConfig } from 'axios-auto';
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
}

export type AxiosAutoOptions = Omit<fetchConfig, 'url' | 'withCredentials' | 'timeout' | 'httpAgent' | 'httpsAgent'>;

export class Web3AxiosProvider {
  public host: string;

  public withCredentials: boolean;
  public timeout: number;
  public headers?: any;
  public agent?: HttpProviderAgent;
  public connected: boolean;
  public axiosOptions?: AxiosAutoOptions;

  public constructor(host?: string, options?: HttpProviderOptions, axiosOptions?: AxiosAutoOptions) {
    options = options || {};

    this.host = host || 'http://localhost:8545';

    this.withCredentials = options.withCredentials || false;
    this.timeout = options.timeout || 0;
    this.headers = options.headers;
    this.agent = options.agent;
    this.connected = false;
    this.axiosOptions = axiosOptions;
  }

  public send(payload: object, callback?: (
    error: Error | null,
    result?: any
  ) => void): void {
    const options: getConfig = this.axiosOptions || {};
    options.withCredentials = this.withCredentials;

    if (this.timeout) {
      options.timeout = this.timeout;
    }

    if (this.headers) {
      options.headers = this.headers;
    }

    // the current runtime is node
    if (typeof XMLHttpRequest === 'undefined') {
      // https://github.com/node-fetch/node-fetch#custom-agent
      const agents = {
        httpsAgent: this.agent ? this.agent.https : undefined,
        httpAgent: this.agent ? this.agent.http : undefined
      };

      if (agents.httpsAgent) {
        options.httpsAgent = agents.httpsAgent;
      } else if (agents.httpAgent){
        options.httpAgent = agents.httpAgent;
      }
    }

    const success = (response: any) => {
      if (typeof callback === 'function') {
        callback(null, response);
      }
    };

    const error = (response: any) => {
      if (typeof callback === 'function') {
        callback(response, undefined);
      }
    };

    post(this.host, payload, options)
      .then(success)
      .catch(error);
  }

  public _prepareRequest(): XMLHttpRequest {
    return new XMLHttpRequest();
  }

  public disconnect(): boolean {
    return false;
  }

  public supportsSubscriptions(): boolean {
    return false;
  }
}

export default Web3AxiosProvider;

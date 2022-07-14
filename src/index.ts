import { post } from 'axios-auto';
import type { fetchConfig, getConfig, filter } from 'axios-auto';
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

export type AxiosAutoOptions = Omit<fetchConfig, 'url' | 'withCredentials' | 'timeout' | 'httpAgent' | 'httpsAgent'>;

export default class Web3AxiosProvider {
  public host: string;

  public withCredentials: boolean;
  public timeout: number;
  public headers?: any;
  public agent?: HttpProviderAgent;
  public connected: boolean;
  public filter?: filter;
  public axiosOptions?: AxiosAutoOptions;

  public constructor(host?: string, options?: HttpProviderOptions, axiosOptions?: AxiosAutoOptions) {
    options = options || {};

    this.host = host || 'http://localhost:8545';

    this.withCredentials = options.withCredentials || false;
    this.timeout = options.timeout || 0;
    this.headers = options.headers;
    this.agent = options.agent;
    this.connected = false;
    this.filter = options.filter;
    this.axiosOptions = axiosOptions;
  }

  public send(payload: payloadObject | payloadObject[], callback?: (
    error: Error | null,
    result?: any
  ) => void): void {
    const options: getConfig = this.axiosOptions || {};
    options.withCredentials = this.withCredentials;

    /**
     * Filter rpc node generated error
     */
    const filter: filter = (data: any, count?: number, retryMax?: number) => {
      if (typeof count === 'number' && typeof retryMax === 'number') {
        if (Array.isArray(data)) {
          const errorArray = data.map((d: any) => {
            let message: string | undefined;
            // Handle usual error object from remote node
            if (d.error) {
              message = (typeof d.error.message === 'string')
                ? d.error.message : (typeof d.error === 'string')
                  ? d.error : (typeof d.error === 'object')
                    ? JSON.stringify(d.error) : '';
              // Handle custom error from remote node
            } else if (typeof d.result === 'undefined') {
              message = (typeof d === 'string') ? d :
                (typeof d === 'object') ? JSON.stringify(d) :
                  'Result not available from remote node';
            }
            // Throw error to retry inside axios-auto function
            if (typeof message !== 'undefined' && count < retryMax + 1) {
              return new Error(message);
            }
          }).filter(d => d);
          if (errorArray.length > 0) {
            throw errorArray;
          }
        } else {
          let message: string | undefined;
          // Handle usual error object from remote node
          if (data.error) {
            message = (typeof data.error.message === 'string')
              ? data.error.message : (typeof data.error === 'string')
                ? data.error : (typeof data.error === 'object')
                  ? JSON.stringify(data.error) : '';
            // Handle custom error from remote node
          } else if (typeof data.result === 'undefined') {
            message = (typeof data === 'string') ? data :
              (typeof data === 'object') ? JSON.stringify(data) :
                'Result not available from remote node';
          }
          // Throw error to retry inside axios-auto function
          if (typeof message !== 'undefined' && count < retryMax + 1) {
            throw new Error(message);
          }
        }
      }
    };
    options.filter = this.filter || filter;

    if (this.timeout) {
      options.timeout = this.timeout;
    }

    if (this.headers) {
      options.headers = this.headers;
    }

    options.headers ||= {};
    options.headers['Content-Type'] ||= 'application/json';

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

    const sendTxMethods = ['eth_sendRawTransaction', 'eth_sendTransaction', 'klay_sendRawTransaction', 'klay_sendTransaction'];
    let sendTransaction = false;

    if (Array.isArray(payload)) {
      payload.forEach(req => {
        if (sendTxMethods.includes(req.method)) {
          sendTransaction = true;
        }
      });
    } else {
      if (sendTxMethods.includes(payload.method)) {
        sendTransaction = true;
      }
    }

    if (sendTransaction) {
      // Prevent the use of multiple rpc nodes to prevent duplicated transaction
      post(this.host.replace(/\s+/g, '').split(',')[0], payload, options)
        .then(success)
        .catch(error);
    } else {
      post(this.host, payload, options)
        .then(success)
        .catch(error);
    }
  }

  public disconnect(): boolean {
    return false;
  }

  public supportsSubscriptions(): boolean {
    return false;
  }
}


declare module 'docker-modem' {

    // Type definitions for docker-modem v0.3.1
    // Project: https://github.com/apocas/docker-modem
    // Definitions by: Maxime LUCE <https://github.com/SomaticIT/>
    // Definitions: https://github.com/typed-contrib/docker-modem
    class Modem implements Modem.SocketOptions, Modem.HostOptions {
        public socketPath?: string;
        public protocol?: string;
        public host: string;
        public port: number;
        public ca?: Buffer;
        public cert?: Buffer;
        public key?: Buffer;
        public version?: string | number;
        public timeout?: number;
        public checkServerIdentity?: boolean;

        /**
         * Constructs a new Modem.
         * 
         * @param [opts]        Authentication options.
         *                      If not provided, it will look for Environment variables.
         *                      If no Environment variable is found, it is set to `/var/run/docker.sock`.
         */
        constructor(opts?: Modem.SocketOptions | Modem.HostOptions);

        /**
         * Dial `Docker` Remote API.
         * 
         * @param options       Modem dial options.
         * @param callback      Callback which will be called with Remote API result. 
         */
        public dial<T>(options: Modem.DialOptions, callback: Modem.Callback<T>): void;

        /**
         * Demultiplex attach streams to separate `stdout` from `stderr`.
         * 
         * @param stream        Input stream to demultiplex.
         * @param stdout        Output stream from `stdout`.
         * @param stderr        Output stream from `stderr`.
         */
        public demuxStream(stream: NodeJS.ReadableStream, stdout: NodeJS.WritableStream, stderr: NodeJS.WritableStream): void;

        /**
         * Allows to fire a callback only in the end of a stream based process. (build, pull, ...)
         * 
         * @param stream        Input stream to follow.
         * @param onFinished    Callback which will be called when stream ends.
         * @param [onProgress]  Callback which will be called multiple times to report job progress.
         */
        public followProgress<T>(stream: NodeJS.ReadableStream, onFinished: Modem.Callback<T>, onProgress?: (evt: any) => void): void;

        /**
         * Builds Query String parameters from Object.
         * 
         * @param opts          Object representing Query String.
         */
        public buildQuerystring(opts: Object): string;

        private buildRequest<T>(options: any, context: Modem.DialOptions, data: string | Buffer, callback: Modem.Callback<T>): void;
        private buildPayload<T>(err: Error, isStream: boolean, statusCodes: Object, openStdin: boolean, req: any, res: any, json: any, cb: Modem.Callback<T>): void;
    }

    namespace Modem {
        export interface SocketOptions {
            socketPath?: string;
            version?: string | number;
            timeout?: number;
        }

        export interface HostOptions {
            protocol?: string;
            host: string;
            port: number;
            ca?: Buffer;
            cert?: Buffer;
            key?: Buffer;
            version?: string | number;
            timeout?: number;
            checkServerIdentity?: boolean;
        }

        export interface DialOptions {
            path: string;
            method: string;
            headers?: Object;
            authconfig?: AuthConfig;
            registryconfig?: RegistryConfig;
            file?: string | Buffer;
            hijack?: boolean;
        }

        export type AuthConfig = { key: string; } | { base64: string; } | Auth | Identity;
        export type RegistryConfig = { base64: string; } | Object;

        export interface Auth {
            username: string;
            password: string;
            email: string;
        }

        export interface Identity {
            identitytoken: string;
        }

        export type Callback<T> = (err: Error, data: T) => void;
    }
}
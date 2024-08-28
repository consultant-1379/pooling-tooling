export interface Environment {
    production: boolean;
    sandbox: boolean;
    expressUrl: string;
    version: string;
    socketHost?: string;
}

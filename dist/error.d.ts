declare class CustomError extends Error {
    constructor(message?: string);
}
export declare class FetchError extends CustomError {
    constructor(response: Response);
}
export {};

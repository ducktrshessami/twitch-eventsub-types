class CustomError extends Error {
    constructor(message?: string) {
        super(message);
        this.name = this.constructor.name;
    }
}

export class FetchError extends CustomError {
    constructor(response: Response) {
        super(`${response.status}: ${response.statusText}`);
    }
}

class CustomError extends Error {
    constructor(message) {
        super(message);
        this.name = this.constructor.name;
    }
}
export class FetchError extends CustomError {
    constructor(response) {
        super(`${response.status}: ${response.statusText}`);
    }
}

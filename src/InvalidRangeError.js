export class InvalidRangeError extends Error {
    constructor(...args) {
        super(...args);
        this.name = 'InvalidRangeError';
    }
}

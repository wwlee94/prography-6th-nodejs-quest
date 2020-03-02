class Base extends Error {
    constructor (message, status) {
        super();
        Error.captureStackTrace(this, this.constructor);
        this.status = status 
        this.name = this.constructor.name;
        this.message = message;
    }
};


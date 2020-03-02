class Base extends Error {
    constructor (message, status) {
        super();
        Error.captureStackTrace(this, this.constructor);
        this.status = status 
        this.name = this.constructor.name;
        this.message = message;
    }
};

class ExceptionError extends Base {
    constructor (message, status) {
        super();
        this.status = status || 400;
        this.message = message || 'Uncaught Error !';
    }
};

class NotFoundParameterError extends ExceptionError {
    constructor (message, status) { 
        super();
        this.status = status || 400;
        this.message = message || '필요한 요청 파라미터가 없습니다 !';
    }
};

class NotFoundDataError extends ExceptionError {
    constructor (message, status) { 
        super();
        this.status = status || 400;
        this.message = message || '검색된 데이터가 없습니다.';
    }
};

class InvalidParameterError extends ExceptionError {
    constructor (message, status) { 
        super();
        this.status = status || 422;
        this.message = message || '유효하지 않은 요청 파라미터입니다.';
    }
}

export {
    Base,
    ExceptionError,
    NotFoundParameterError,
    NotFoundDataError,
    InvalidParameterError
};
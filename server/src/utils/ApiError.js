class ApiError extends Error {
    constructor(
        statusCode,
        message = "something went wrong ",
        errors = [],
        stack = ""  // stack trace = breadcrumbs that tell you exactly where things went wrong. It's only useful during development/debugging, you'd typically hide it in production responses. , basically provides the file path of error 
    ) {
        super(message)  // keyword used to call the constructor or to access properties and methods of a parent (superclass)

        this.statusCode = statusCode
        this.message = message
        this.data = null  // A placeholder field, kept null by default. Follows a consistent response shape — even errors have a data field, just empty.
        this.errors = errors  // Stores an array of detailed errors — useful for things like validation errors where multiple things went wrong at once. e.g. ["email is required", "password too short"]
        this.success = false;  // Hardcoded to false because this is an error — mirrors the success: true you'd send in a success response, keeping the API response shape consistent.

        if (stack) {
            this.stack = stack   // use a custom stack if manually passed in
        } else {
            Error.captureStackTrace(this, this.constructor)  // auto-generate one
        } 
    }
}

export { ApiError }
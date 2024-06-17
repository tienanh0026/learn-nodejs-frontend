interface ErrorResponse {
    message: string;
}

interface SuccessResponse<T> {
    data: T;
    message: string;
}

export type { ErrorResponse, SuccessResponse };

export interface ApiResponse {
    code: string;
    statusCode: string;
    data: any;
}

export interface ApiResponseError {
    error: {
        type: string;
        title: string;
        status: number;
        errors: object;
        traceId: string;
    }
}
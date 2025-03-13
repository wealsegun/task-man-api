import { HttpException, HttpStatus } from '@nestjs/common';
import { ApiResponse } from '../interfaces/response.interface';

export class ResponseUtil {
    /**
     * Sends a success JSON response.
     * @param {number} status The HTTP status code.
     * @param {string} message The message to include in the response.
     * @param {any} data The data to include in the response.
     */
    static sendSuccessResponse<T>(status: number, message: string, data: T): ApiResponse<T> {
        return {
            status,
            message,
            isError: false,
            isSuccessful: true,
            data,
        };
    }

    /**
     * Throws an error with a formatted response.
     * @param {number} status The HTTP status code.
     * @param {string} message The error message to include in the response.
     */
    static sendErrorResponse(status: number, message: string): never {
        throw new HttpException(
            {
                status,
                message,
                isError: true,
                isSuccessful: false,
                data: undefined,
            },
            status,
        );
    }
}
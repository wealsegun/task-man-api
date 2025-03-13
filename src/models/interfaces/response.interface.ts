export interface ApiResponse<T> {
    status: number;
    message: string;
    isError: boolean;
    isSuccessful: boolean;
    data: T;
}

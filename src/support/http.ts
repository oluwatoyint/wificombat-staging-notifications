import { Response } from "express";

export const failedResponse = (
    res: Response,
    statusCode: number,
    message: string = "Failed",
    success: boolean = false
): void => {
    res.status(statusCode).json({ 
        success: success, 
        message: message 
    });
    return
};

export const successResponse = (
    res: Response,
    statusCode: number,
    message: string = "Success",
    data: any = null,
    success: boolean = true
): void => {
    res.status(statusCode).json({
        success: success,
        message: message,
        data: data
    });
    return
};
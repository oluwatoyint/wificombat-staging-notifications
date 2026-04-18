import { Request, Response } from 'express';
import { failedResponse, successResponse } from "../support/http";
import { Notification } from '../models/notification';
import { CreateNotification } from '../schemas/notification';
import { sendNotif } from '../notification/firebaseNotification';

export class NotificationController {

    // create a notification 
    static async createNotification(req: Request, res: Response) {
        try {
            // Validate request body
            const { error, value } = CreateNotification.validate(req.body);
            if (error) {
                return failedResponse(res, 400, error.details[0].message);
            }

            const fcm_token = value.fcm_token;
            // Remove the FCM token from the value object to avoid saving it in the database
            delete value.fcm_token;

            // Create the notification in the database
            await Notification.create(value);

            // Attempt to send the notification using FCM
            try {
                await sendNotif(fcm_token, value.title, value.message, value);
            } catch (innerError: any) {
                console.error("Error sending notification:", innerError.message || innerError);
            }

            // Return success response
            return successResponse(res, 201, "Notification created successfully");
        } catch (outerError: any) {
            console.error("Error creating notification:", outerError.message || outerError);
            return failedResponse(res, 500, "An error occurred while creating the notification");
        }
    }

    static async myNotifications(req: Request, res: Response) {

        try {
            const { type, read, page = 1, pageSize = 100 } = req.query;
            const user = (req as any).user

            // Build query conditions
            const query: any = {
                owner: user._id,
            };

            if (type) {
                query.type = type;
            }
            if (read) {
                query.read.toLower() === "true";
            }
            const skip = (Number(page) - 1) * Number(pageSize);
            const totalNotifications = await Notification.countDocuments(query);
            const totalPages = Math.ceil(totalNotifications / Number(pageSize));

            const notifications = await Notification.find(query)
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(Number(pageSize));



            return successResponse(res, 200, 'Success', {
                notifications,
                currentPage: page,
                totalPages,
                totalNotifications,
            });
        } catch (error: any) {
            console.error(error);
            return failedResponse(res, 500, error.message);
        }
    };

    static async markAllAsRead(req: Request, res: Response) {
        try {
            const user = (req as any).user
            const result = await Notification.updateMany(
                { owner: user._id, read: false },
                { read: true }
            );

            return successResponse(res, 200, 'All notifications marked as read', result);
        } catch (error: any) {
            console.error(error);
            return failedResponse(res, 500, error.message);
        }
    };

    static async markSingleAsRead(req: Request, res: Response) {
        try {
            const user = (req as any).user
            const notitication = await Notification.findOneAndUpdate({ _id: req.params.id, owner: user._id }, { read: true });
            if (!notitication) return failedResponse(res, 404, "Notitication not found")

            return successResponse(res, 200, 'Notification marked as read', notitication);
        } catch (error: any) {
            console.error(error);
            return failedResponse(res, 500, error.message);
        }
    };

}
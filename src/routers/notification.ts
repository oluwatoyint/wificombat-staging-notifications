import { Router } from "express";
import { NotificationController } from "../controllers/notification";
import { IsAuthenticatedUser } from "../support/middleware";


export const notifcationRouter = Router()

notifcationRouter
// notifications
.post("/notification", NotificationController.createNotification)
.get("/notification", IsAuthenticatedUser, NotificationController.myNotifications)
.put("/notification", IsAuthenticatedUser, NotificationController.markAllAsRead)
.put("/notification/:id", IsAuthenticatedUser, NotificationController.markSingleAsRead)
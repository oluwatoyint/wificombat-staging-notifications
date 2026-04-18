import {Schema, Model, model } from 'mongoose';
import { INotification } from '../interfaces/notification'; 



const notificationSchema: Schema<INotification> = new Schema<INotification>({
  owner: String,
  title: String,
  type: { type: String, required: true },
  message: { type: String, required: true },
  read: { type: Boolean, default: false },
}, { timestamps: true });


export const Notification: Model<INotification> = model<INotification>('Notification', notificationSchema);
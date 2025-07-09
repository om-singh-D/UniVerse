// Notification service
class NotificationService {
  async createNotification(notificationData: any) {
    // TODO: Implement notification creation
    throw new Error('Create notification not implemented');
  }

  async getUserNotifications(userId: number) {
    // TODO: Implement get user notifications
    throw new Error('Get user notifications not implemented');
  }

  async markAsRead(notificationId: number) {
    // TODO: Implement mark as read
    throw new Error('Mark notification as read not implemented');
  }
}

export default new NotificationService();

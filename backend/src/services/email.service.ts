// Email service
class EmailService {
  async sendWelcomeEmail(email: string, name: string) {
    // TODO: Implement welcome email
    throw new Error('Send welcome email not implemented');
  }

  async sendPasswordReset(email: string, token: string) {
    // TODO: Implement password reset email
    throw new Error('Send password reset email not implemented');
  }

  async sendNotificationEmail(email: string, notification: any) {
    // TODO: Implement notification email
    throw new Error('Send notification email not implemented');
  }
}

export default new EmailService();

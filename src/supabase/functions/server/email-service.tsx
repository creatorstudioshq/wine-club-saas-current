// Email Service using Resend API
// Handles all wine club email communications

import { serverEnv } from "./env.tsx";

interface EmailOptions {
  to: string;
  subject: string;
  html: string;
  from?: string;
  replyTo?: string;
}

interface MagicLinkOptions {
  email: string;
  redirectUrl: string;
  wineClubName: string;
}

interface WelcomeEmailOptions {
  email: string;
  name: string;
  wineClubName: string;
  planName: string;
}

interface ShipmentNotificationOptions {
  email: string;
  name: string;
  wineClubName: string;
  approvalUrl: string;
  deadline: string;
}

class EmailService {
  private apiKey: string;
  private fromEmail: string;

  constructor() {
    this.apiKey = serverEnv.RESEND_API_KEY;
    this.fromEmail = "noreply@wineclubsaas.com"; // Default from email
  }

  private async sendEmail(options: EmailOptions) {
    if (!this.apiKey) {
      throw new Error("Resend API key not configured");
    }

    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${this.apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: options.from || this.fromEmail,
        to: options.to,
        subject: options.subject,
        html: options.html,
        reply_to: options.replyTo,
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Failed to send email: ${error}`);
    }

    return response.json();
  }

  // Magic Link Authentication
  async sendMagicLink(options: MagicLinkOptions) {
    const magicLink = `${options.redirectUrl}?token=${this.generateToken()}&email=${encodeURIComponent(options.email)}`;
    
    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Sign in to ${options.wineClubName}</title>
        </head>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #d97706, #f59e0b); padding: 30px; border-radius: 10px; text-align: center; margin-bottom: 30px;">
            <h1 style="color: white; margin: 0; font-size: 28px;">🍷 ${options.wineClubName}</h1>
          </div>
          
          <div style="background: #f9fafb; padding: 30px; border-radius: 10px; border-left: 4px solid #d97706;">
            <h2 style="color: #1f2937; margin-top: 0;">Sign in to your account</h2>
            <p style="font-size: 16px; margin-bottom: 25px;">
              Click the button below to securely sign in to your wine club account. This link will expire in 15 minutes.
            </p>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="${magicLink}" 
                 style="background: #d97706; color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 16px; display: inline-block;">
                Sign In to ${options.wineClubName}
              </a>
            </div>
            
            <p style="font-size: 14px; color: #6b7280; margin-top: 25px;">
              If the button doesn't work, copy and paste this link into your browser:<br>
              <a href="${magicLink}" style="color: #d97706; word-break: break-all;">${magicLink}</a>
            </p>
          </div>
          
          <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb;">
            <p style="font-size: 12px; color: #9ca3af;">
              This email was sent by ${options.wineClubName}. If you didn't request this sign-in link, please ignore this email.
            </p>
          </div>
        </body>
      </html>
    `;

    return this.sendEmail({
      to: options.email,
      subject: `Sign in to ${options.wineClubName}`,
      html,
    });
  }

  // Welcome Email for New Members
  async sendWelcomeEmail(options: WelcomeEmailOptions) {
    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Welcome to ${options.wineClubName}</title>
        </head>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #d97706, #f59e0b); padding: 30px; border-radius: 10px; text-align: center; margin-bottom: 30px;">
            <h1 style="color: white; margin: 0; font-size: 28px;">🍷 Welcome to ${options.wineClubName}!</h1>
          </div>
          
          <div style="background: #f9fafb; padding: 30px; border-radius: 10px;">
            <h2 style="color: #1f2937; margin-top: 0;">Hello ${options.name}! 🎉</h2>
            <p style="font-size: 16px; margin-bottom: 20px;">
              Welcome to the ${options.wineClubName}! We're thrilled to have you as a member of our exclusive wine community.
            </p>
            
            <div style="background: white; padding: 20px; border-radius: 8px; border: 1px solid #e5e7eb; margin: 20px 0;">
              <h3 style="color: #d97706; margin-top: 0;">Your Membership Details</h3>
              <p><strong>Plan:</strong> ${options.planName}</p>
              <p><strong>Status:</strong> Active</p>
              <p><strong>Next Shipment:</strong> Coming soon!</p>
            </div>
            
            <h3 style="color: #1f2937;">What's Next?</h3>
            <ul style="padding-left: 20px;">
              <li>We'll curate your first wine selection based on your preferences</li>
              <li>You'll receive an email when your wines are ready for approval</li>
              <li>Review and customize your selection before it ships</li>
              <li>Enjoy your expertly curated wines!</li>
            </ul>
            
            <div style="background: #ecfdf5; padding: 20px; border-radius: 8px; border-left: 4px solid #10b981; margin: 20px 0;">
              <p style="margin: 0; color: #065f46;">
                <strong>💡 Pro Tip:</strong> Keep your wine preferences updated in your member portal to ensure we select wines you'll love!
              </p>
            </div>
          </div>
          
          <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb;">
            <p style="font-size: 12px; color: #9ca3af;">
              Questions? Reply to this email or contact our support team.
            </p>
          </div>
        </body>
      </html>
    `;

    return this.sendEmail({
      to: options.email,
      subject: `Welcome to ${options.wineClubName}! 🍷`,
      html,
    });
  }

  // Shipment Ready Notification
  async sendShipmentNotification(options: ShipmentNotificationOptions) {
    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Your Wine Selection is Ready</title>
        </head>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #d97706, #f59e0b); padding: 30px; border-radius: 10px; text-align: center; margin-bottom: 30px;">
            <h1 style="color: white; margin: 0; font-size: 28px;">🍷 Your Wine Selection is Ready!</h1>
          </div>
          
          <div style="background: #f9fafb; padding: 30px; border-radius: 10px;">
            <h2 style="color: #1f2937; margin-top: 0;">Hello ${options.name}! 🎉</h2>
            <p style="font-size: 16px; margin-bottom: 20px;">
              Great news! We've curated your next wine selection from ${options.wineClubName}. 
              Your wines are ready for review and approval.
            </p>
            
            <div style="background: #fef3c7; padding: 20px; border-radius: 8px; border-left: 4px solid #f59e0b; margin: 20px 0;">
              <p style="margin: 0; color: #92400e;">
                <strong>⏰ Important:</strong> Please review and approve your selection by ${options.deadline} to ensure timely delivery.
              </p>
            </div>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="${options.approvalUrl}" 
                 style="background: #d97706; color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 16px; display: inline-block;">
                Review Your Wine Selection
              </a>
            </div>
            
            <h3 style="color: #1f2937;">What You Can Do:</h3>
            <ul style="padding-left: 20px;">
              <li>Review your curated wine selection</li>
              <li>Swap wines if you prefer different options</li>
              <li>Adjust quantities within your plan</li>
              <li>Choose your preferred delivery date</li>
              <li>Confirm your order and payment</li>
            </ul>
            
            <div style="background: #ecfdf5; padding: 20px; border-radius: 8px; border-left: 4px solid #10b981; margin: 20px 0;">
              <p style="margin: 0; color: #065f46;">
                <strong>💡 Remember:</strong> You can always customize your selection to match your taste preferences!
              </p>
            </div>
          </div>
          
          <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb;">
            <p style="font-size: 12px; color: #9ca3af;">
              Questions about your selection? Reply to this email or contact our support team.
            </p>
          </div>
        </body>
      </html>
    `;

    return this.sendEmail({
      to: options.email,
      subject: `Your ${options.wineClubName} wine selection is ready for review`,
      html,
    });
  }

  // Email Verification for Signups
  async sendVerificationEmail(email: string, verificationUrl: string, wineClubName: string) {
    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Verify Your Email</title>
        </head>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #d97706, #f59e0b); padding: 30px; border-radius: 10px; text-align: center; margin-bottom: 30px;">
            <h1 style="color: white; margin: 0; font-size: 28px;">🍷 Verify Your Email</h1>
          </div>
          
          <div style="background: #f9fafb; padding: 30px; border-radius: 10px;">
            <h2 style="color: #1f2937; margin-top: 0;">Almost there!</h2>
            <p style="font-size: 16px; margin-bottom: 20px;">
              Thank you for joining ${wineClubName}! Please verify your email address to complete your membership setup.
            </p>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="${verificationUrl}" 
                 style="background: #d97706; color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 16px; display: inline-block;">
                Verify Email Address
              </a>
            </div>
            
            <p style="font-size: 14px; color: #6b7280; margin-top: 25px;">
              If the button doesn't work, copy and paste this link into your browser:<br>
              <a href="${verificationUrl}" style="color: #d97706; word-break: break-all;">${verificationUrl}</a>
            </p>
            
            <div style="background: #fef3c7; padding: 20px; border-radius: 8px; border-left: 4px solid #f59e0b; margin: 20px 0;">
              <p style="margin: 0; color: #92400e;">
                <strong>⏰ This verification link will expire in 24 hours.</strong>
              </p>
            </div>
          </div>
          
          <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb;">
            <p style="font-size: 12px; color: #9ca3af;">
              If you didn't create an account with ${wineClubName}, please ignore this email.
            </p>
          </div>
        </body>
      </html>
    `;

    return this.sendEmail({
      to: email,
      subject: `Verify your email for ${wineClubName}`,
      html,
    });
  }

  // Generate secure token for magic links
  private generateToken(): string {
    const array = new Uint8Array(32);
    crypto.getRandomValues(array);
    return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
  }
}

// Export singleton instance
export const emailService = new EmailService();

// Helper functions for common email operations
export const sendMagicLink = (email: string, redirectUrl: string, wineClubName: string) => {
  return emailService.sendMagicLink({ email, redirectUrl, wineClubName });
};

export const sendWelcomeEmail = (email: string, name: string, wineClubName: string, planName: string) => {
  return emailService.sendWelcomeEmail({ email, name, wineClubName, planName });
};

export const sendShipmentNotification = (email: string, name: string, wineClubName: string, approvalUrl: string, deadline: string) => {
  return emailService.sendShipmentNotification({ email, name, wineClubName, approvalUrl, deadline });
};

export const sendVerificationEmail = (email: string, verificationUrl: string, wineClubName: string) => {
  return emailService.sendVerificationEmail(email, verificationUrl, wineClubName);
};

/**
 * Email service type definitions
 */

export interface EmailOptions {
  to: string | string[];
  subject: string;
  html: string;
  text?: string;
  replyTo?: string;
  tags?: { name: string; value: string }[];
}

export interface EmailResult {
  success: boolean;
  messageId?: string;
  error?: string;
}

export interface ContactFormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export interface DonationFormData {
  name: string;
  email: string;
  phone?: string;
  amount: number;
  currency?: string;
}

export interface EmailProvider {
  send(options: EmailOptions): Promise<EmailResult>;
}

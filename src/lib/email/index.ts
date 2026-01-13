/**
 * Email Service - Main entry point
 *
 * Usage:
 *   import { sendEmail, sendContactConfirmation, sendDonationReceipt } from '@/lib/email';
 */

import type { EmailOptions, EmailResult, ContactFormData, DonationFormData } from './types';
import { ResendProvider, MockEmailProvider } from './resend';
import {
  getContactConfirmationTemplate,
  getContactNotificationTemplate,
  getDonationReceiptTemplate,
  getDonationNotificationTemplate
} from './templates';

// Default configuration
const EMAIL_FROM = 'United Hands Bangladesh <noreply@unitedhandsbd.org>';
const ADMIN_EMAIL = 'support@unitedhandsbd.org';

/**
 * Get email provider - creates a new instance with the provided API key
 * This is needed because Cloudflare Workers secrets are only available at runtime
 */
function getEmailProvider(apiKey?: string) {
  if (apiKey) {
    return new ResendProvider(apiKey, EMAIL_FROM);
  }
  console.warn('[Email] No RESEND_API_KEY provided, using mock provider');
  return new MockEmailProvider();
}

/**
 * Send a generic email
 */
export async function sendEmail(options: EmailOptions, apiKey?: string): Promise<EmailResult> {
  const provider = getEmailProvider(apiKey);
  return provider.send(options);
}

/**
 * Send contact form confirmation to user
 */
export async function sendContactConfirmation(data: ContactFormData, apiKey?: string): Promise<EmailResult> {
  const { html, text } = getContactConfirmationTemplate(data);

  return sendEmail({
    to: data.email,
    subject: 'Thank you for contacting United Hands Bangladesh',
    html,
    text,
    tags: [{ name: 'type', value: 'contact-confirmation' }],
  }, apiKey);
}

/**
 * Send contact form notification to admin
 */
export async function sendContactNotification(data: ContactFormData, apiKey?: string): Promise<EmailResult> {
  const { html, text } = getContactNotificationTemplate(data);

  return sendEmail({
    to: ADMIN_EMAIL,
    subject: `New Contact: ${data.subject}`,
    html,
    text,
    replyTo: data.email,
    tags: [{ name: 'type', value: 'contact-notification' }],
  }, apiKey);
}

/**
 * Send donation receipt to donor
 */
export async function sendDonationReceipt(data: DonationFormData, apiKey?: string): Promise<EmailResult> {
  const { html, text } = getDonationReceiptTemplate(data);

  return sendEmail({
    to: data.email,
    subject: 'Thank you for your donation - United Hands Bangladesh',
    html,
    text,
    tags: [{ name: 'type', value: 'donation-receipt' }],
  }, apiKey);
}

/**
 * Send donation notification to admin
 */
export async function sendDonationNotification(data: DonationFormData, apiKey?: string): Promise<EmailResult> {
  const { html, text } = getDonationNotificationTemplate(data);

  return sendEmail({
    to: ADMIN_EMAIL,
    subject: `New Donation: ${data.amount} ${data.currency || 'BDT'}`,
    html,
    text,
    replyTo: data.email,
    tags: [{ name: 'type', value: 'donation-notification' }],
  }, apiKey);
}

// Re-export types
export type { EmailOptions, EmailResult, ContactFormData, DonationFormData } from './types';

/**
 * Resend email provider implementation
 * https://resend.com/docs/api-reference/emails/send-email
 */

import type { EmailOptions, EmailResult, EmailProvider } from './types';

const RESEND_API_URL = 'https://api.resend.com/emails';

export class ResendProvider implements EmailProvider {
  private apiKey: string;
  private fromAddress: string;

  constructor(apiKey: string, fromAddress: string) {
    this.apiKey = apiKey;
    this.fromAddress = fromAddress;
  }

  async send(options: EmailOptions): Promise<EmailResult> {
    const { to, subject, html, text, replyTo, tags } = options;

    try {
      const response = await fetch(RESEND_API_URL, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: this.fromAddress,
          to: Array.isArray(to) ? to : [to],
          subject,
          html,
          text: text || this.htmlToText(html),
          reply_to: replyTo,
          tags,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        console.error('[Resend] API error:', error);
        return {
          success: false,
          error: error.message || 'Failed to send email',
        };
      }

      const data = await response.json();
      console.log('[Resend] Email sent:', data.id);

      return {
        success: true,
        messageId: data.id,
      };
    } catch (error) {
      console.error('[Resend] Send error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  /**
   * Simple HTML to plain text conversion
   */
  private htmlToText(html: string): string {
    return html
      .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
      .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
      .replace(/<[^>]+>/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
  }
}

/**
 * Create a mock provider for development/testing
 */
export class MockEmailProvider implements EmailProvider {
  async send(options: EmailOptions): Promise<EmailResult> {
    console.log('[MockEmail] Would send email:', {
      to: options.to,
      subject: options.subject,
      preview: options.html.substring(0, 100) + '...',
    });

    return {
      success: true,
      messageId: `mock-${Date.now()}`,
    };
  }
}

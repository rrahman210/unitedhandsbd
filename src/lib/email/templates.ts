/**
 * Email Templates for United Hands Bangladesh
 */

import type { ContactFormData, DonationFormData } from './types';

// Brand colors
const COLORS = {
  primary: '#C9A961',
  primaryDark: '#B8943A',
  teal: '#2D7A7A',
  brown: '#8B4513',
  cream: '#FDF8F0',
  text: '#333333',
  textLight: '#666666',
};

// Base template wrapper
function baseTemplate(content: string): string {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>United Hands Bangladesh</title>
</head>
<body style="margin: 0; padding: 0; font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: ${COLORS.cream};">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background-color: ${COLORS.cream};">
    <tr>
      <td align="center" style="padding: 40px 20px;">
        <table role="presentation" width="600" cellspacing="0" cellpadding="0" border="0" style="background-color: #ffffff; border-radius: 8px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
          <!-- Header -->
          <tr>
            <td style="background-color: ${COLORS.teal}; padding: 30px 40px; border-radius: 8px 8px 0 0; text-align: center;">
              <h1 style="margin: 0; color: #ffffff; font-size: 24px; font-weight: 600;">
                United Hands Bangladesh
              </h1>
              <p style="margin: 10px 0 0; color: ${COLORS.primary}; font-size: 14px;">
                Human Rights Organization
              </p>
            </td>
          </tr>
          <!-- Content -->
          <tr>
            <td style="padding: 40px;">
              ${content}
            </td>
          </tr>
          <!-- Footer -->
          <tr>
            <td style="background-color: #f8f9fa; padding: 30px 40px; border-radius: 0 0 8px 8px; text-align: center;">
              <p style="margin: 0 0 10px; color: ${COLORS.textLight}; font-size: 14px;">
                United Hands Bangladesh
              </p>
              <p style="margin: 0 0 10px; color: ${COLORS.textLight}; font-size: 12px;">
                48 East Basabo, Dhaka-1214, Bangladesh
              </p>
              <p style="margin: 0; color: ${COLORS.textLight}; font-size: 12px;">
                Phone: +880 1825 554 945 | Email: support@unitedhandsbd.org
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `.trim();
}

/**
 * Contact form confirmation email to user
 */
export function getContactConfirmationTemplate(data: ContactFormData): { html: string; text: string } {
  const content = `
    <h2 style="margin: 0 0 20px; color: ${COLORS.text}; font-size: 20px;">
      Thank you for reaching out!
    </h2>
    <p style="margin: 0 0 15px; color: ${COLORS.text}; font-size: 16px; line-height: 1.6;">
      Dear ${data.name},
    </p>
    <p style="margin: 0 0 15px; color: ${COLORS.text}; font-size: 16px; line-height: 1.6;">
      We have received your message and appreciate you taking the time to contact United Hands Bangladesh.
      Our team will review your inquiry and get back to you as soon as possible.
    </p>
    <div style="background-color: ${COLORS.cream}; padding: 20px; border-radius: 6px; margin: 20px 0;">
      <p style="margin: 0 0 10px; color: ${COLORS.textLight}; font-size: 14px;">
        <strong>Your message:</strong>
      </p>
      <p style="margin: 0 0 10px; color: ${COLORS.text}; font-size: 14px;">
        <strong>Subject:</strong> ${data.subject}
      </p>
      <p style="margin: 0; color: ${COLORS.text}; font-size: 14px; white-space: pre-wrap;">
        ${data.message}
      </p>
    </div>
    <p style="margin: 20px 0 0; color: ${COLORS.text}; font-size: 16px; line-height: 1.6;">
      Thank you for your interest in supporting our mission.
    </p>
    <p style="margin: 20px 0 0; color: ${COLORS.text}; font-size: 16px;">
      Warm regards,<br>
      <strong style="color: ${COLORS.teal};">The United Hands Bangladesh Team</strong>
    </p>
  `;

  const text = `
Thank you for reaching out!

Dear ${data.name},

We have received your message and appreciate you taking the time to contact United Hands Bangladesh.
Our team will review your inquiry and get back to you as soon as possible.

Your message:
Subject: ${data.subject}
${data.message}

Thank you for your interest in supporting our mission.

Warm regards,
The United Hands Bangladesh Team

---
United Hands Bangladesh
48 East Basabo, Dhaka-1214, Bangladesh
Phone: +880 1825 554 945 | Email: support@unitedhandsbd.org
  `.trim();

  return {
    html: baseTemplate(content),
    text,
  };
}

/**
 * Contact form notification email to admin
 */
export function getContactNotificationTemplate(data: ContactFormData): { html: string; text: string } {
  const content = `
    <h2 style="margin: 0 0 20px; color: ${COLORS.text}; font-size: 20px;">
      New Contact Form Submission
    </h2>
    <div style="background-color: ${COLORS.cream}; padding: 20px; border-radius: 6px; margin: 20px 0;">
      <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
        <tr>
          <td style="padding: 8px 0; color: ${COLORS.textLight}; font-size: 14px; width: 100px;">Name:</td>
          <td style="padding: 8px 0; color: ${COLORS.text}; font-size: 14px;"><strong>${data.name}</strong></td>
        </tr>
        <tr>
          <td style="padding: 8px 0; color: ${COLORS.textLight}; font-size: 14px;">Email:</td>
          <td style="padding: 8px 0; color: ${COLORS.text}; font-size: 14px;">
            <a href="mailto:${data.email}" style="color: ${COLORS.teal};">${data.email}</a>
          </td>
        </tr>
        <tr>
          <td style="padding: 8px 0; color: ${COLORS.textLight}; font-size: 14px;">Subject:</td>
          <td style="padding: 8px 0; color: ${COLORS.text}; font-size: 14px;">${data.subject}</td>
        </tr>
      </table>
    </div>
    <div style="margin: 20px 0;">
      <p style="margin: 0 0 10px; color: ${COLORS.textLight}; font-size: 14px;">
        <strong>Message:</strong>
      </p>
      <div style="background-color: #f8f9fa; padding: 20px; border-radius: 6px; border-left: 4px solid ${COLORS.primary};">
        <p style="margin: 0; color: ${COLORS.text}; font-size: 14px; white-space: pre-wrap; line-height: 1.6;">
          ${data.message}
        </p>
      </div>
    </div>
    <p style="margin: 20px 0 0; color: ${COLORS.textLight}; font-size: 12px;">
      Reply directly to this email to respond to ${data.name}.
    </p>
  `;

  const text = `
New Contact Form Submission

Name: ${data.name}
Email: ${data.email}
Subject: ${data.subject}

Message:
${data.message}

---
Reply directly to this email to respond to ${data.name}.
  `.trim();

  return {
    html: baseTemplate(content),
    text,
  };
}

/**
 * Donation receipt email to donor
 */
export function getDonationReceiptTemplate(data: DonationFormData): { html: string; text: string } {
  const currency = data.currency || 'BDT';
  const formattedAmount = new Intl.NumberFormat('en-BD', {
    style: 'decimal',
    minimumFractionDigits: 0,
  }).format(data.amount);

  const content = `
    <h2 style="margin: 0 0 20px; color: ${COLORS.text}; font-size: 20px;">
      Thank you for your generous donation!
    </h2>
    <p style="margin: 0 0 15px; color: ${COLORS.text}; font-size: 16px; line-height: 1.6;">
      Dear ${data.name},
    </p>
    <p style="margin: 0 0 15px; color: ${COLORS.text}; font-size: 16px; line-height: 1.6;">
      Your kindness and generosity make a real difference in the lives of those we serve.
      Thank you for supporting United Hands Bangladesh.
    </p>
    <div style="background-color: ${COLORS.cream}; padding: 25px; border-radius: 6px; margin: 25px 0; text-align: center;">
      <p style="margin: 0 0 5px; color: ${COLORS.textLight}; font-size: 14px;">
        Donation Amount
      </p>
      <p style="margin: 0; color: ${COLORS.teal}; font-size: 32px; font-weight: bold;">
        ${formattedAmount} ${currency}
      </p>
    </div>
    <div style="background-color: #f8f9fa; padding: 20px; border-radius: 6px; margin: 20px 0;">
      <p style="margin: 0 0 10px; color: ${COLORS.textLight}; font-size: 14px;">
        <strong>Donation Details:</strong>
      </p>
      <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
        <tr>
          <td style="padding: 5px 0; color: ${COLORS.textLight}; font-size: 14px;">Donor Name:</td>
          <td style="padding: 5px 0; color: ${COLORS.text}; font-size: 14px;">${data.name}</td>
        </tr>
        <tr>
          <td style="padding: 5px 0; color: ${COLORS.textLight}; font-size: 14px;">Email:</td>
          <td style="padding: 5px 0; color: ${COLORS.text}; font-size: 14px;">${data.email}</td>
        </tr>
        ${data.phone ? `
        <tr>
          <td style="padding: 5px 0; color: ${COLORS.textLight}; font-size: 14px;">Phone:</td>
          <td style="padding: 5px 0; color: ${COLORS.text}; font-size: 14px;">${data.phone}</td>
        </tr>
        ` : ''}
        <tr>
          <td style="padding: 5px 0; color: ${COLORS.textLight}; font-size: 14px;">Date:</td>
          <td style="padding: 5px 0; color: ${COLORS.text}; font-size: 14px;">${new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</td>
        </tr>
      </table>
    </div>
    <p style="margin: 20px 0 15px; color: ${COLORS.text}; font-size: 16px; line-height: 1.6;">
      <strong>Next Steps:</strong><br>
      Our team will contact you shortly to complete the donation process. If you have any questions,
      please don't hesitate to reach out to us.
    </p>
    <p style="margin: 20px 0 0; color: ${COLORS.text}; font-size: 16px;">
      With gratitude,<br>
      <strong style="color: ${COLORS.teal};">The United Hands Bangladesh Team</strong>
    </p>
  `;

  const text = `
Thank you for your generous donation!

Dear ${data.name},

Your kindness and generosity make a real difference in the lives of those we serve.
Thank you for supporting United Hands Bangladesh.

Donation Amount: ${formattedAmount} ${currency}

Donation Details:
- Donor Name: ${data.name}
- Email: ${data.email}
${data.phone ? `- Phone: ${data.phone}` : ''}
- Date: ${new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}

Next Steps:
Our team will contact you shortly to complete the donation process. If you have any questions,
please don't hesitate to reach out to us.

With gratitude,
The United Hands Bangladesh Team

---
United Hands Bangladesh
48 East Basabo, Dhaka-1214, Bangladesh
Phone: +880 1825 554 945 | Email: support@unitedhandsbd.org
  `.trim();

  return {
    html: baseTemplate(content),
    text,
  };
}

/**
 * Donation notification email to admin
 */
export function getDonationNotificationTemplate(data: DonationFormData): { html: string; text: string } {
  const currency = data.currency || 'BDT';
  const formattedAmount = new Intl.NumberFormat('en-BD', {
    style: 'decimal',
    minimumFractionDigits: 0,
  }).format(data.amount);

  const content = `
    <h2 style="margin: 0 0 20px; color: ${COLORS.text}; font-size: 20px;">
      New Donation Received
    </h2>
    <div style="background-color: ${COLORS.primary}; padding: 25px; border-radius: 6px; margin: 20px 0; text-align: center;">
      <p style="margin: 0 0 5px; color: #ffffff; font-size: 14px;">
        Amount
      </p>
      <p style="margin: 0; color: #ffffff; font-size: 36px; font-weight: bold;">
        ${formattedAmount} ${currency}
      </p>
    </div>
    <div style="background-color: ${COLORS.cream}; padding: 20px; border-radius: 6px; margin: 20px 0;">
      <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
        <tr>
          <td style="padding: 10px 0; color: ${COLORS.textLight}; font-size: 14px; width: 100px;">Donor:</td>
          <td style="padding: 10px 0; color: ${COLORS.text}; font-size: 14px;"><strong>${data.name}</strong></td>
        </tr>
        <tr>
          <td style="padding: 10px 0; color: ${COLORS.textLight}; font-size: 14px;">Email:</td>
          <td style="padding: 10px 0; color: ${COLORS.text}; font-size: 14px;">
            <a href="mailto:${data.email}" style="color: ${COLORS.teal};">${data.email}</a>
          </td>
        </tr>
        ${data.phone ? `
        <tr>
          <td style="padding: 10px 0; color: ${COLORS.textLight}; font-size: 14px;">Phone:</td>
          <td style="padding: 10px 0; color: ${COLORS.text}; font-size: 14px;">
            <a href="tel:${data.phone}" style="color: ${COLORS.teal};">${data.phone}</a>
          </td>
        </tr>
        ` : ''}
        <tr>
          <td style="padding: 10px 0; color: ${COLORS.textLight}; font-size: 14px;">Date:</td>
          <td style="padding: 10px 0; color: ${COLORS.text}; font-size: 14px;">${new Date().toLocaleString('en-US', { dateStyle: 'full', timeStyle: 'short' })}</td>
        </tr>
      </table>
    </div>
    <p style="margin: 20px 0 0; color: ${COLORS.textLight}; font-size: 12px;">
      Reply directly to this email to contact the donor.
    </p>
  `;

  const text = `
New Donation Received!

Amount: ${formattedAmount} ${currency}

Donor Information:
- Name: ${data.name}
- Email: ${data.email}
${data.phone ? `- Phone: ${data.phone}` : ''}
- Date: ${new Date().toLocaleString('en-US', { dateStyle: 'full', timeStyle: 'short' })}

---
Reply directly to this email to contact the donor.
  `.trim();

  return {
    html: baseTemplate(content),
    text,
  };
}

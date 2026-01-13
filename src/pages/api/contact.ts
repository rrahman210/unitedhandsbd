import type { APIRoute } from 'astro';
import {
  sendContactConfirmation,
  sendContactNotification,
  type ContactFormData
} from '../../lib/email';

// Ensure this route is server-rendered, not prerendered
export const prerender = false;

const VALID_SUBJECTS = [
  'volunteer',
  'partnership',
  'programs',
  'general',
  'other'
];

export const POST: APIRoute = async ({ request, locals }) => {
  // Get API key from Cloudflare runtime environment
  const runtime = (locals as any).runtime;
  const apiKey = runtime?.env?.RESEND_API_KEY;
  try {
    const body = await request.json();
    const { name, email, subject, message } = body;

    // Validate required fields
    if (!name || typeof name !== 'string' || name.trim().length < 2) {
      return new Response(
        JSON.stringify({ error: 'Valid name is required (minimum 2 characters)' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    if (!email || !email.includes('@') || !email.includes('.')) {
      return new Response(
        JSON.stringify({ error: 'Valid email address is required' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    if (!subject || !VALID_SUBJECTS.includes(subject)) {
      return new Response(
        JSON.stringify({ error: 'Valid subject is required' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    if (!message || typeof message !== 'string' || message.trim().length < 10) {
      return new Response(
        JSON.stringify({ error: 'Message must be at least 10 characters' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Sanitize input
    const contactData: ContactFormData = {
      name: name.trim(),
      email: email.trim().toLowerCase(),
      subject: subject,
      message: message.trim(),
    };

    // Log the submission
    console.log('[Contact] New submission:', {
      name: contactData.name,
      email: contactData.email,
      subject: contactData.subject,
      messageLength: contactData.message.length,
    });

    // Send emails in parallel
    const [confirmationResult, notificationResult] = await Promise.all([
      sendContactConfirmation(contactData, apiKey),
      sendContactNotification(contactData, apiKey),
    ]);

    // Check results
    if (!confirmationResult.success || !notificationResult.success) {
      console.error('[Contact] Email send failed:', {
        confirmation: confirmationResult,
        notification: notificationResult,
      });

      // Still return success if at least notification was sent
      // User experience shouldn't suffer if confirmation fails
      if (!notificationResult.success) {
        return new Response(
          JSON.stringify({ error: 'Failed to submit contact form. Please try again.' }),
          { status: 500, headers: { 'Content-Type': 'application/json' } }
        );
      }
    }

    console.log('[Contact] Emails sent successfully:', {
      confirmationId: confirmationResult.messageId,
      notificationId: notificationResult.messageId,
    });

    return new Response(
      JSON.stringify({
        success: true,
        message: 'Thank you for your message. We will get back to you soon!',
      }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('[Contact] Error:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error. Please try again later.' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};

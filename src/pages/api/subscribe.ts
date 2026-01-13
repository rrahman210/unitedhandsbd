import type { APIRoute } from 'astro';

export const POST: APIRoute = async ({ request }) => {
  try {
    const body = await request.json();
    const { email } = body;

    if (!email || !email.includes('@')) {
      return new Response(
        JSON.stringify({ error: 'Valid email required' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // MailerLite API integration
    // Replace with your actual MailerLite API key and group ID
    const MAILERLITE_API_KEY = import.meta.env.MAILERLITE_API_KEY;
    const MAILERLITE_GROUP_ID = import.meta.env.MAILERLITE_GROUP_ID;

    if (MAILERLITE_API_KEY && MAILERLITE_GROUP_ID) {
      const response = await fetch('https://connect.mailerlite.com/api/subscribers', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${MAILERLITE_API_KEY}`,
        },
        body: JSON.stringify({
          email,
          groups: [MAILERLITE_GROUP_ID],
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        console.error('MailerLite error:', error);
        return new Response(
          JSON.stringify({ error: 'Subscription failed' }),
          { status: 500, headers: { 'Content-Type': 'application/json' } }
        );
      }
    } else {
      // Log for development/testing
      console.log('Newsletter subscription (no MailerLite configured):', email);
    }

    return new Response(
      JSON.stringify({ success: true, message: 'Subscribed successfully' }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Subscription error:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};

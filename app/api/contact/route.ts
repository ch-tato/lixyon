import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { operator, channel, engagementType, payload } = body;

    // Validate inputs
    if (!operator || !channel || !payload) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const RESEND_API_KEY = process.env.RESEND_API_KEY;
    
    if (!RESEND_API_KEY) {
      console.error('RESEND_API_KEY is not configured in environment variables.');
      return NextResponse.json(
        { error: 'Email service is not configured' },
        { status: 500 }
      );
    }

    // Call Resend API directly to avoid requiring the 'resend' npm package
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        // Resend requires a verified domain. 
        // For testing, onboarding@resend.dev only sends to the email address associated with your Resend account.
        from: 'Lixyon Portfolio <onboarding@resend.dev>',
        to: 'akuquthbi@gmail.com', // §8.3 Single source of truth for contact email
        subject: `[PORTFOLIO CONTACT] New engagement from ${operator}`,
        html: `
          <h2>New Contact Form Submission</h2>
          <p><strong>Operator (Name):</strong> ${operator}</p>
          <p><strong>Channel (Email):</strong> ${channel}</p>
          <p><strong>Engagement Type:</strong> ${engagementType || 'Not specified'}</p>
          <hr />
          <h3>Payload (Message):</h3>
          <p style="white-space: pre-wrap;">${payload}</p>
        `,
        reply_to: channel,
      }),
    });

    if (!res.ok) {
      const errorData = await res.json();
      console.error('Resend API Error:', errorData);
      return NextResponse.json(
        { error: 'Failed to send email via Resend' },
        { status: res.status }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Contact API Error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

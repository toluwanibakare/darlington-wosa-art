import { NextRequest, NextResponse } from 'next/server';
import { sendEnquiryDeliveryEmail } from '@/lib/email';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, email, phone, subject, category, message, details } = body;

    if (!email || !name) {
      return NextResponse.json(
        { error: 'Name and email are required.' },
        { status: 400 }
      );
    }

    const emailResult = await sendEnquiryDeliveryEmail({
      name,
      email,
      phone,
      subject: subject || 'New Project Enquiry',
      category: category || 'General Enquiry',
      message: message || '',
      details,
    });

    return NextResponse.json({
      success: true,
      message: 'Enquiry received successfully. A confirmation email has been dispatched.',
      emailStatus: emailResult.message,
    });
  } catch (err) {
    console.error('Contact API Error:', err);
    return NextResponse.json(
      { error: 'An internal server error occurred processing the enquiry.' },
      { status: 500 }
    );
  }
}

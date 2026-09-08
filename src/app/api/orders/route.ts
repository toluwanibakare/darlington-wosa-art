import { NextRequest, NextResponse } from 'next/server';
import { sendOrderConfirmationEmail } from '@/lib/email';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      orderRef,
      name,
      email,
      phone,
      activeTab,
      dimensions,
      artType,
      frameType,
      amount,
      deliveryState,
      deliveryAddress,
      deliveryTimeline,
      notes,
    } = body;

    if (!email || !name) {
      return NextResponse.json(
        { error: 'Name and email are required for order creation.' },
        { status: 400 }
      );
    }

    const ref = orderRef || `DWAF-${Math.floor(100000000 + Math.random() * 900000000)}`;

    const emailResult = await sendOrderConfirmationEmail({
      orderRef: ref,
      name,
      email,
      phone,
      activeTab,
      dimensions,
      artType,
      frameType,
      amount: Number(amount) || 0,
      deliveryState,
      deliveryAddress,
      deliveryTimeline,
      notes,
    });

    return NextResponse.json({
      success: true,
      orderRef: ref,
      message: 'Order created successfully and confirmation email sent.',
      emailStatus: emailResult.message,
    });
  } catch (err) {
    console.error('Order API Error:', err);
    return NextResponse.json(
      { error: 'An internal server error occurred creating order.' },
      { status: 500 }
    );
  }
}

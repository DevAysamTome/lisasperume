import { NextResponse } from 'next/server';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';

export async function POST(request: Request) {
  try {
    const { orderId, newStatus } = await request.json();

    // Get order details
    const orderRef = doc(db, 'orders', orderId);
    const orderDoc = await getDoc(orderRef);

    if (!orderDoc.exists()) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    const order = orderDoc.data();
    const { email, firstName, lastName } = order;

    // Send email notification
    const response = await fetch('https://api.sendgrid.com/v3/mail/send', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.SENDGRID_API_KEY}`
      },
      body: JSON.stringify({
        personalizations: [
          {
            to: [{ email }],
            dynamic_template_data: {
              firstName,
              lastName,
              orderId,
              status: newStatus
            }
          }
        ],
        from: { email: 'noreply@lisaperfume.com' },
        template_id: process.env.SENDGRID_STATUS_TEMPLATE_ID
      })
    });

    if (!response.ok) {
      throw new Error('Failed to send email');
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error sending status email:', error);
    return NextResponse.json(
      { error: 'Failed to send status email' },
      { status: 500 }
    );
  }
} 
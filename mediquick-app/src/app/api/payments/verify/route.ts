import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import prisma from '@/lib/db';
import { RAZORPAY_KEY_SECRET } from '@/lib/razorpay';

export async function POST(req: NextRequest) {
  try {
    const {
      orderId, // local order ID in db
      razorpayOrderId,
      razorpayPaymentId,
      razorpaySignature,
    } = await req.json();

    if (!orderId || !razorpayOrderId || !razorpayPaymentId || !razorpaySignature) {
      return NextResponse.json(
        { error: 'Missing payment signature verification parameters.' },
        { status: 400 }
      );
    }

    const order = await prisma.order.findUnique({
      where: { id: orderId },
    });

    if (!order) {
      return NextResponse.json(
        { error: 'Order not found in database.' },
        { status: 404 }
      );
    }

    let isValid = false;

    // Verify signature
    if (razorpayOrderId.startsWith('order_mock_')) {
      // Mock / Sandbox Simulator verification bypass
      isValid = razorpaySignature === 'mock_signature';
    } else {
      // Real Razorpay signature validation
      const secret = RAZORPAY_KEY_SECRET || '';
      const generatedSignature = crypto
        .createHmac('sha256', secret)
        .update(razorpayOrderId + '|' + razorpayPaymentId)
        .digest('hex');

      isValid = generatedSignature === razorpaySignature;
    }

    if (isValid) {
      // Update order status in Database
      const updatedOrder = await prisma.order.update({
        where: { id: orderId },
        data: {
          status: 'PROCESSING', // Paid orders enter processing stage
          paymentStatus: 'PAID',
          razorpayPaymentId,
          razorpaySignature,
        },
      });

      return NextResponse.json({
        success: true,
        message: 'Payment verified and order updated successfully.',
        order: updatedOrder,
      });
    } else {
      // Mark as failed if signature check fails
      await prisma.order.update({
        where: { id: orderId },
        data: {
          paymentStatus: 'FAILED',
        },
      });

      return NextResponse.json(
        { error: 'Invalid payment signature. Verification failed.' },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error('Payment verification API error:', error);
    return NextResponse.json(
      { error: 'Internal server error.' },
      { status: 500 }
    );
  }
}

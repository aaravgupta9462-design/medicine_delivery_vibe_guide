import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/db';
import { razorpay, isMockMode } from '@/lib/razorpay';

interface CartItem {
  id: string;
  quantity: number;
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized. Please sign in.' },
        { status: 401 }
      );
    }

    const userId = session.user.id;
    const { items, deliveryAddress } = await req.json();

    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        { error: 'Cart is empty.' },
        { status: 400 }
      );
    }

    if (!deliveryAddress) {
      return NextResponse.json(
        { error: 'Delivery address is required.' },
        { status: 400 }
      );
    }

    // Fetch products from database to calculate total securely
    const productIds = items.map((i: CartItem) => i.id);
    const dbProducts = await prisma.product.findMany({
      where: { id: { in: productIds } },
    });

    let totalAmount = 0;
    const orderItemsData: { productId: string; quantity: number; price: number }[] = [];

    for (const item of items) {
      const dbProduct = dbProducts.find((p) => p.id === item.id);
      if (!dbProduct) {
        return NextResponse.json(
          { error: `Product with ID ${item.id} not found in inventory.` },
          { status: 404 }
        );
      }

      if (dbProduct.stock < item.quantity) {
        return NextResponse.json(
          { error: `Insufficient stock for product "${dbProduct.name}". Available: ${dbProduct.stock}` },
          { status: 400 }
        );
      }

      totalAmount += dbProduct.price * item.quantity;
      orderItemsData.push({
        productId: dbProduct.id,
        quantity: item.quantity,
        price: dbProduct.price,
      });
    }

    let razorpayOrderId = '';
    const mockOrderId = `order_mock_${Math.random().toString(36).substring(2, 15)}`;

    if (isMockMode) {
      // Sandbox Simulator Fallback
      razorpayOrderId = mockOrderId;
      console.log('⚡ Sandbox Payment Mode: Generated Mock Order ID:', razorpayOrderId);
    } else {
      // Real Razorpay integration
      try {
        const rzpOrder = await razorpay.orders.create({
          amount: Math.round(totalAmount * 100), // Amount in paise/cents
          currency: 'USD', // Keep USD or INR as desired, note SQLite handles it natively
          receipt: `receipt_${Date.now()}`,
        });
        razorpayOrderId = rzpOrder.id;
      } catch (rzpErr) {
        console.error('Razorpay order creation failed. Falling back to mock.', rzpErr);
        // Fallback to mock order so the checkout doesn't break in local dev if credentials are wrong
        razorpayOrderId = mockOrderId;
      }
    }

    // Create order in PENDING state in Database
    const order = await prisma.$transaction(async (tx) => {
      // Create order
      const newOrder = await tx.order.create({
        data: {
          userId,
          totalAmount,
          status: 'PENDING',
          deliveryAddress,
          paymentStatus: 'PENDING',
          razorpayOrderId,
        },
      });

      // Create order items
      await tx.orderItem.createMany({
        data: orderItemsData.map((item) => ({
          orderId: newOrder.id,
          productId: item.productId,
          quantity: item.quantity,
          price: item.price,
        })),
      });

      // Deduct stock
      for (const item of orderItemsData) {
        await tx.product.update({
          where: { id: item.productId },
          data: {
            stock: {
              decrement: item.quantity,
            },
          },
        });
      }

      return newOrder;
    });

    return NextResponse.json({
      orderId: order.id,
      razorpayOrderId,
      amount: totalAmount,
      isMock: razorpayOrderId.startsWith('order_mock_'),
    });
  } catch (error) {
    console.error('Create Order API Error:', error);
    return NextResponse.json(
      { error: 'Internal server error.' },
      { status: 500 }
    );
  }
}

import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/db';

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized. Please sign in.' },
        { status: 401 }
      );
    }

    const { imageUrl, notes } = await req.json();

    if (!imageUrl) {
      return NextResponse.json(
        { error: 'Prescription image is required.' },
        { status: 400 }
      );
    }

    const prescription = await prisma.prescription.create({
      data: {
        userId: session.user.id,
        imageUrl,
        notes: notes || '',
        status: 'PENDING',
      },
    });

    return NextResponse.json(
      { message: 'Prescription submitted successfully.', prescription },
      { status: 201 }
    );
  } catch (error) {
    console.error('Prescription upload API error:', error);
    return NextResponse.json(
      { error: 'Internal server error.' },
      { status: 500 }
    );
  }
}

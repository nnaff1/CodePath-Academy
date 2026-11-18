import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await req.json();
    const { isActive } = body;

    const promo = await prisma.promoCode.findUnique({
      where: { id },
    });

    if (!promo) {
      return NextResponse.json(
        { success: false, message: 'Promo code not found' },
        { status: 404 }
      );
    }

    const updated = await prisma.promoCode.update({
      where: { id },
      data: {
        isActive: typeof isActive === 'boolean' ? isActive : !promo.isActive,
      },
    });

    return NextResponse.json({
      success: true,
      message: `Promo code ${updated.code} is now ${updated.isActive ? 'ACTIVE' : 'DISABLED'}.`,
      promo: updated,
    });
  } catch (error) {
    console.error('Super Admin Promo PATCH Error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to update promo code' },
      { status: 500 }
    );
  }
}

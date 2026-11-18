import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const search = searchParams.get('search')?.toUpperCase();

    const where: any = {};
    if (search) {
      where.OR = [
        { code: { contains: search } },
        { targetTrack: { contains: search } },
      ];
    }

    const promos = await prisma.promoCode.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      include: {
        _count: {
          select: { transactions: true },
        },
      },
    });

    const activeCount = promos.filter((p) => p.isActive).length;

    return NextResponse.json({
      success: true,
      activeCount,
      promos: promos.map((p) => ({
        id: p.id,
        code: p.code,
        discountType: p.discountType,
        discountValue: p.discountValue,
        formattedDiscount:
          p.discountType === 'PERCENTAGE'
            ? `${p.discountValue}% OFF`
            : `Rp ${p.discountValue.toLocaleString('id-ID')}`,
        minSpend: p.minSpend,
        formattedMinSpend: `Rp ${p.minSpend.toLocaleString('id-ID')}`,
        usedCount: p.usedCount,
        usageQuota: p.usageQuota,
        percentUsed: Math.min(100, Math.round((p.usedCount / (p.usageQuota || 1)) * 100)),
        targetTrack: p.targetTrack,
        expiresAt: p.expiresAt,
        isActive: p.isActive,
        isExpired: new Date(p.expiresAt) < new Date(),
        createdAt: p.createdAt,
      })),
    });
  } catch (error) {
    console.error('Super Admin Promos GET Error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch promo codes' },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    let {
      code,
      discountType,
      discountValue,
      minSpend,
      usageQuota,
      targetTrack,
      expiresAt,
    } = body;

    if (!code || !discountValue || !usageQuota) {
      return NextResponse.json(
        { success: false, message: 'Voucher code, value, and usage quota are required.' },
        { status: 400 }
      );
    }

    code = String(code).trim().toUpperCase();

    // Check if code exists
    const existing = await prisma.promoCode.findUnique({
      where: { code },
    });

    if (existing) {
      return NextResponse.json(
        { success: false, message: `Voucher code ${code} already exists.` },
        { status: 400 }
      );
    }

    const expiryDate = expiresAt ? new Date(expiresAt) : new Date(Date.now() + 30 * 24 * 3600 * 1000);

    const newPromo = await prisma.promoCode.create({
      data: {
        code,
        discountType: discountType === 'FIXED' ? 'FIXED' : 'PERCENTAGE',
        discountValue: Number(discountValue),
        minSpend: Number(minSpend) || 0,
        usageQuota: Number(usageQuota) || 100,
        usedCount: 0,
        targetTrack: targetTrack || 'All Courses & Capstones',
        expiresAt: expiryDate,
        isActive: true,
      },
    });

    return NextResponse.json({
      success: true,
      message: `Promo code ${newPromo.code} created and activated successfully!`,
      promo: newPromo,
    });
  } catch (error) {
    console.error('Super Admin Promos POST Error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to create promo code' },
      { status: 500 }
    );
  }
}

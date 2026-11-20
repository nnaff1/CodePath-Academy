import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const [bannerSetting, liveSetting, maintenanceSetting, courses] = await Promise.all([
      prisma.platformSetting.findUnique({ where: { key: 'announcement_banner' } }),
      prisma.platformSetting.findUnique({ where: { key: 'announcement_enabled' } }),
      prisma.platformSetting.findUnique({ where: { key: 'maintenance_mode' } }),
      prisma.course.findMany({
        where: { status: 'PUBLISHED' },
        orderBy: [{ isFeatured: 'desc' }, { featuredSlot: 'asc' }],
        include: {
          mentor: { select: { name: true } },
        },
      }),
    ]);

    const bannerText =
      bannerSetting?.value ||
      '🔥 Flash Enrollment: Get 25% off all Fullstack Cohorts with code CODEPATH25';
    const isBannerLive = liveSetting?.value !== 'false';
    const isMaintenanceMode = maintenanceSetting?.value === 'true';

    // Build featured slots from courses that have featuredSlot set
    const slot1 = courses.find((c) => c.featuredSlot === 1)?.id || courses[0]?.id || '';
    const slot2 = courses.find((c) => c.featuredSlot === 2)?.id || courses[1]?.id || '';
    const slot3 = courses.find((c) => c.featuredSlot === 3)?.id || courses[2]?.id || '';

    const featuredSlots = [
      { slot: 1, courseId: slot1 },
      { slot: 2, courseId: slot2 },
      { slot: 3, courseId: slot3 },
    ];

    const formattedCourses = courses.map((c) => ({
      id: c.id,
      title: c.title,
      slug: c.slug,
      codeTag: c.codeTag || 'DEV',
      isFeatured: c.isFeatured,
      featuredSlot: c.featuredSlot,
      price: c.price,
      level: c.level,
      mentorName: c.mentor.name,
    }));

    return NextResponse.json({
      success: true,
      bannerText,
      isBannerLive,
      isMaintenanceMode,
      featuredSlots,
      cms: {
        bannerText,
        isBannerLive,
        isMaintenanceMode,
        featuredSlots,
        courses: formattedCourses,
      },
    });
  } catch (error) {
    console.error('Super Admin CMS GET Error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch CMS settings' },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const action = (body.action || '').toLowerCase().replace(/_/g, '-');
    const bannerText = body.bannerText;
    const isBannerLive = body.isBannerLive ?? body.isLive;
    const isMaintenanceMode = body.isMaintenanceMode;
    const featuredSlots = body.featuredSlots || body.slots;

    if (action === 'update-banner') {
      if (typeof bannerText === 'string') {
        await prisma.platformSetting.upsert({
          where: { key: 'announcement_banner' },
          update: { value: bannerText },
          create: { key: 'announcement_banner', value: bannerText },
        });
      }
      if (typeof isBannerLive === 'boolean') {
        await prisma.platformSetting.upsert({
          where: { key: 'announcement_enabled' },
          update: { value: isBannerLive ? 'true' : 'false' },
          create: { key: 'announcement_enabled', value: isBannerLive ? 'true' : 'false' },
        });
      }
      return NextResponse.json({
        success: true,
        message: 'Announcement banner updated and synchronized with live site.',
      });
    }

    if (action === 'toggle-maintenance') {
      if (typeof isMaintenanceMode === 'boolean') {
        await prisma.platformSetting.upsert({
          where: { key: 'maintenance_mode' },
          update: { value: isMaintenanceMode ? 'true' : 'false' },
          create: { key: 'maintenance_mode', value: isMaintenanceMode ? 'true' : 'false' },
        });
        return NextResponse.json({
          success: true,
          isMaintenanceMode,
          message: `Cluster environment set to ${isMaintenanceMode ? 'Maintenance Mode' : 'Normal Operations'}.`,
        });
      }
    }

    if (
      (action === 'save-merchandising' || action === 'update-featured') &&
      Array.isArray(featuredSlots)
    ) {
      // Reset current featured courses
      await prisma.course.updateMany({
        data: { isFeatured: false, featuredSlot: null },
      });

      // Update new featured courses
      for (const item of featuredSlots) {
        if (item.courseId) {
          await prisma.course.update({
            where: { id: item.courseId },
            data: { isFeatured: true, featuredSlot: item.slot },
          });
        }
      }

      return NextResponse.json({
        success: true,
        message: 'Landing page merchandising and course showcase slots saved.',
      });
    }

    return NextResponse.json(
      { success: false, message: 'Invalid action or payload' },
      { status: 400 }
    );
  } catch (error) {
    console.error('Super Admin CMS POST Error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to update CMS settings' },
      { status: 500 }
    );
  }
}

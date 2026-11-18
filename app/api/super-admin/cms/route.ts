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

    return NextResponse.json({
      success: true,
      cms: {
        bannerText,
        isBannerLive,
        isMaintenanceMode,
        courses: courses.map((c) => ({
          id: c.id,
          title: c.title,
          slug: c.slug,
          codeTag: c.codeTag || 'DEV',
          isFeatured: c.isFeatured,
          featuredSlot: c.featuredSlot,
          price: c.price,
          mentorName: c.mentor.name,
        })),
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
    const { action, bannerText, isBannerLive, isMaintenanceMode, featuredSlots } = body;

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

    if (action === 'save-merchandising' && Array.isArray(featuredSlots)) {
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


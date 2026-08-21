import { NextRequest, NextResponse } from 'next/server';
import { 
  getAllChants, adminCreateChant, adminUpdateChant, adminDeleteChant 
} from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const chants = getAllChants(200);
    return NextResponse.json({ success: true, data: chants });
  } catch (error) {
    return NextResponse.json({ success: false, error: String(error) }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    if (!body.title || !body.categoryId || !body.contentPali) {
      return NextResponse.json({ success: false, error: 'กรุณากรอกข้อมูลที่จำเป็นให้ครบถ้วน' }, { status: 400 });
    }

    const slug = body.slug || body.title.toLowerCase().replace(/\s+/g, '-').replace(/[^\w\u0E00-\u0E7F-]/g, '') + '-' + Date.now();

    const result = adminCreateChant({
      categoryId: Number(body.categoryId),
      title: body.title,
      slug,
      shortDescription: body.shortDescription || '',
      contentPali: body.contentPali,
      contentReading: body.contentReading || '',
      contentTranslation: body.contentTranslation || '',
      description: body.description || '',
      image: body.image || null,
      audioUrl: body.audioUrl || null,
      audioDuration: body.audioDuration || '03:00',
      sortOrder: Number(body.sortOrder || 0),
      isFeatured: Boolean(body.isFeatured),
      isActive: Boolean(body.isActive ?? true),
    });

    return NextResponse.json({ success: true, data: result });
  } catch (error) {
    return NextResponse.json({ success: false, error: String(error) }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    if (!body.id) {
      return NextResponse.json({ success: false, error: 'ไม่พบ ID บทสวด' }, { status: 400 });
    }

    const result = adminUpdateChant(Number(body.id), {
      categoryId: body.categoryId !== undefined ? Number(body.categoryId) : undefined,
      title: body.title,
      slug: body.slug,
      shortDescription: body.shortDescription,
      contentPali: body.contentPali,
      contentReading: body.contentReading,
      contentTranslation: body.contentTranslation,
      description: body.description,
      image: body.image,
      audioUrl: body.audioUrl,
      audioDuration: body.audioDuration,
      sortOrder: body.sortOrder !== undefined ? Number(body.sortOrder) : undefined,
      isFeatured: body.isFeatured !== undefined ? Boolean(body.isFeatured) : undefined,
      isActive: body.isActive !== undefined ? Boolean(body.isActive) : undefined,
    });

    return NextResponse.json({ success: true, data: result });
  } catch (error) {
    return NextResponse.json({ success: false, error: String(error) }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    if (!id) {
      return NextResponse.json({ success: false, error: 'Missing ID' }, { status: 400 });
    }

    adminDeleteChant(Number(id));
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ success: false, error: String(error) }, { status: 500 });
  }
}

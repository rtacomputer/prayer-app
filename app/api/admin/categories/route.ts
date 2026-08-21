import { NextRequest, NextResponse } from 'next/server';
import { 
  getAllCategories, adminCreateCategory, adminUpdateCategory, adminDeleteCategory 
} from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const categories = getAllCategories();
    return NextResponse.json({ success: true, data: categories });
  } catch (error) {
    return NextResponse.json({ success: false, error: String(error) }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    if (!body.name) {
      return NextResponse.json({ success: false, error: 'กรุณากรอกชื่อหมวดหมู่' }, { status: 400 });
    }

    const slug = body.slug || body.name.toLowerCase().replace(/\s+/g, '-').replace(/[^\w\u0E00-\u0E7F-]/g, '') + '-' + Date.now();

    const result = adminCreateCategory({
      name: body.name,
      slug,
      description: body.description || '',
      icon: body.icon || 'lotus',
      image: body.image || null,
      sortOrder: Number(body.sortOrder || 0),
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
      return NextResponse.json({ success: false, error: 'ไม่พบ ID หมวดหมู่' }, { status: 400 });
    }

    const result = adminUpdateCategory(Number(body.id), {
      name: body.name,
      slug: body.slug,
      description: body.description,
      icon: body.icon,
      image: body.image,
      sortOrder: body.sortOrder !== undefined ? Number(body.sortOrder) : undefined,
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

    adminDeleteCategory(Number(id));
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ success: false, error: String(error) }, { status: 500 });
  }
}

import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';

// CSRF protection
const RATE_LIMIT = new Map<string, { count: number; reset: number }>();

export async function POST(req: NextRequest) {
  // Rate limiting
  const ip = req.headers.get('x-forwarded-for') || 'unknown';
  const now = Date.now();
  const limit = RATE_LIMIT.get(ip);
  if (limit) {
    if (now < limit.reset && limit.count >= 10) {
      return NextResponse.json({ error: 'Too many requests' }, { status: 429 });
    }
    if (now > limit.reset) {
      RATE_LIMIT.set(ip, { count: 1, reset: now + 60000 });
    } else {
      limit.count++;
    }
  } else {
    RATE_LIMIT.set(ip, { count: 1, reset: now + 60000 });
  }

  try {
    const body = await req.json();
    const orderId = crypto.randomBytes(8).toString('hex').toUpperCase();
    
    // Here you would save to database
    // For now, just return success with orderId
    console.log('New order:', { orderId, ...body });

    return NextResponse.json({ success: true, orderId });
  } catch {
    return NextResponse.json({ error: 'Failed to create order' }, { status: 500 });
  }
}

import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';

export async function POST(req: NextRequest) {
  const body = await req.formData();
  const data = body.get('data') as string;
  const signature = body.get('signature') as string;
  const privateKey = process.env.LIQPAY_PRIVATE_KEY || '';

  const expectedSign = crypto.createHash('sha1')
    .update(privateKey + data + privateKey).digest('base64');

  if (signature !== expectedSign) {
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
  }

  const decoded = JSON.parse(Buffer.from(data, 'base64').toString());
  console.log('LiqPay callback:', decoded);
  // Here: update order status in DB

  return NextResponse.json({ ok: true });
}

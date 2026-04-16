import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';

function liqpaySign(privateKey: string, data: string) {
  return crypto.createHash('sha1').update(privateKey + data + privateKey).digest('base64');
}

export async function POST(req: NextRequest) {
  const { orderId, amount, description } = await req.json();
  const publicKey = process.env.LIQPAY_PUBLIC_KEY;
  const privateKey = process.env.LIQPAY_PRIVATE_KEY;
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

  if (!publicKey || !privateKey) {
    return NextResponse.json({ error: 'LiqPay not configured' }, { status: 500 });
  }

  const params = {
    version: '3',
    public_key: publicKey,
    action: 'pay',
    amount: amount.toString(),
    currency: 'UAH',
    description,
    order_id: orderId,
    result_url: `${siteUrl}/checkout/success?order=${orderId}`,
    server_url: `${siteUrl}/api/liqpay/callback`,
    language: 'uk',
  };

  const data = Buffer.from(JSON.stringify(params)).toString('base64');
  const signature = liqpaySign(privateKey, data);
  const checkoutUrl = `https://www.liqpay.ua/api/3/checkout?data=${encodeURIComponent(data)}&signature=${encodeURIComponent(signature)}`;

  return NextResponse.json({ checkoutUrl });
}

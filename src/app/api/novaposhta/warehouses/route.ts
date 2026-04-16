import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const { cityRef } = await req.json();

  try {
    const res = await fetch('https://api.novaposhta.ua/v2.0/json/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        apiKey: process.env.NOVA_POSHTA_API_KEY || '',
        modelName: 'AddressGeneral',
        calledMethod: 'getWarehouses',
        methodProperties: {
          SettlementRef: cityRef,
          Limit: 100,
        },
      }),
    });
    const data = await res.json();
    return NextResponse.json({ data: data.data || [] });
  } catch {
    return NextResponse.json({ data: [] });
  }
}

import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const { search } = await req.json();

  try {
    const res = await fetch('https://api.novaposhta.ua/v2.0/json/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        apiKey: process.env.NOVA_POSHTA_API_KEY || '',
        modelName: 'Address',
        calledMethod: 'searchSettlements',
        methodProperties: {
          CityName: search,
          Limit: 10,
          Page: 1,
        },
      }),
    });
    const data = await res.json();
    const settlements = data.data?.[0]?.Addresses || [];
    return NextResponse.json({
      data: settlements.map((s: { Ref: string; Present: string }) => ({
        Ref: s.Ref,
        Description: s.Present,
      })),
    });
  } catch {
    return NextResponse.json({ data: [] });
  }
}

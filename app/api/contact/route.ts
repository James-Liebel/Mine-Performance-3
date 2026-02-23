/**
 * Contact form submission endpoint.
 * Placeholder for future CRM/email integration.
 * POST /api/contact — accepts { name, email, phone?, message }
 */

import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, phone, message } = body;
    if (!name || !email || !message) {
      return NextResponse.json({ ok: false, error: 'Missing required fields' }, { status: 400 });
    }
    // Placeholder: no-op for now; wire to email/CRM adapter later
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: false, error: 'Invalid request' }, { status: 500 });
  }
}

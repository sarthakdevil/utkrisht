import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  // Create a response and clear the 'token' cookie
  const response = NextResponse.json({ message: 'Logout successful' }, { status: 200 });
  res.setHeader(
    'Set-Cookie',
    cookie.serialize('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 0, // 1 month
      path: '/',
    })
  );
}

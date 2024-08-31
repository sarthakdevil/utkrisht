import { teacher } from '../../../schema';
import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { db } from '../../../db'; // Ensure this path is correct and your Drizzle instance is configured
import { registrationSchema } from '../validation';
import bcrypt from 'bcryptjs';

export async function POST(req: NextRequest,res: NextResponse) {
  const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY!;
  
  try {
    const body = await req.json();
    
    // Validate the request body against the schema
    const parsed = registrationSchema.safeParse(body);
    
    if (!parsed.success) {
      return NextResponse.json({ message: 'Invalid input', errors: parsed.error.errors }, { status: 400 });
    }

    const { email, password } = parsed.data;

    // Check if the email and password are provided
    if (!email || !password) {
      return NextResponse.json({ message: 'All fields are required' }, { status: 400 });
    }

    // Check user credentials (actual authentication logic)
    const user = await db.teacher.findUnique({ where: { email } });
    
    if (!user || !(await bcrypt.compare(password, user.password))) {  // Proper password hashing check
      return NextResponse.json({ message: 'Invalid credentials' }, { status: 401 });
    }

    // Generate JWT token
    const token = jwt.sign({ email }, JWT_SECRET_KEY, { expiresIn: '1h' });

    // Set JWT as a cookie
    const response = NextResponse.json({ message: 'Login success' }, { status: 200 });
    res.setHeader(
      'Set-Cookie',
      cookie.serialize('token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: 3600 * 24 * 30, // 1 month
        path: '/',
      })
    );

    return response;

  } catch (error) {
    console.error('Error logging in:', error);
    return NextResponse.json({ message: 'Error in login' }, { status: 500 });
  }
}
3
3
import { NextApiRequest, NextApiResponse } from 'next';
import { db } from '../../../db'; // Import your Drizzle instance
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken'; // Import JWT
import { teacher } from '../../../schema'; // Import your Drizzle schema model
import { registrationSchema } from '../../../lib/validation'; // Import your Zod schema
import { NextRequest, NextResponse } from 'next/server';

// Define the number of salt rounds for bcrypt
const saltRounds = 10;
const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY; // Ensure this is set in your .env.local file

export default async function POST(req: NextRequest, res: NextResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    // Validate input data using Zod
    const parsed = registrationSchema.safeParse(req.body);

    if (!parsed.success) {
      return res.status(400).json({ message: 'Invalid input', errors: parsed.error.errors });
    }

    const { name, email, password, teacher_id, specialization } = parsed.data;

    // Check if user already exists
    const existingTeacher = await db
      .select()
      .from(teacher)
      .where(teacher.email.eq(email))
      .single();

    if (existingTeacher) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Create new user
    await db.insert(teacher).values({
      name,
      email,
      password: hashedPassword,
      teacher_id,
      specialization,
      createdAt: new Date(),
    });

    // Create JWT token
    const token = jwt.sign({ email }, JWT_SECRET_KEY, { expiresIn: '1h' });

    // Return the token along with a success message
    return res.status(201).json({ message: 'User created successfully', token });
  } catch (error) {
    console.error('Error registering user:', error);
    return res.status(500).json({ message: 'Error in registration' });
  }
}

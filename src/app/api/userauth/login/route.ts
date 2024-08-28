import { NextRequest,NextResponse } from 'next/server';
import { db } from '../../../db'; // Import your Drizzle instance
import { bcrypt } from 'bcryptjs';
import { teacher } from '../../../schema'; // Import your Drizzle schema model

const saltRounds = 10;

export default async function POST(req: NextRequest, res: NextResponse) {
      try {
        const { email, password} = req.body;
    
        if (!email || !password) {
          return res.status(400).json({ message: 'All fields are required' });
        }
}catch(error){

}
}
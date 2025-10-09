import dbConnect from '@/lib/mongoose';
import User from '@/models/User';
import { NextResponse } from 'next/server';

export async function GET() {
  await dbConnect();
  
  // Check if users already exist
  const existingUsers = await User.countDocuments();
  
  if (existingUsers > 0) {
    return NextResponse.json({ message: 'Database already seeded' }, { status: 200 });
  }
  
  // Create initial users
  const users = [
    {
      email: 'studenthead@svnit.ac.in',
      password: '123123',
      name: 'Student Head',
      role: 'student_head',
      department: 'Computer Engineering',
      contactNumber: '9876543210'
    },
    {
      email: 'faculty@svnit.ac.in',
      password: '123123',
      name: 'Faculty Chairperson',
      role: 'faculty',
      department: 'Computer Engineering',
      contactNumber: '9876543211'
    },
    {
      email: 'deanswo@svnit.ac.in',
      password: '123123',
      name: 'Dean SWO',
      role: 'dean_swo',
      department: 'Administration',
      contactNumber: '9876543212'
    },
    {
      email: 'deansw@svnit.ac.in',
      password: '123123',
      name: 'Dean SW',
      role: 'dean_sw',
      department: 'Administration',
      contactNumber: '9876543213'
    },
  ];
  
  await User.insertMany(users);
  
  return NextResponse.json({ message: 'Database seeded successfully' }, { status: 201 });
}
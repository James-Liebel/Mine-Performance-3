import { NextResponse } from 'next/server';
import { getCollegeCommits, getEndorsements } from '@/lib/results-store';

export async function GET() {
  const collegeCommits = getCollegeCommits();
  const endorsements = getEndorsements();
  return NextResponse.json({ collegeCommits, endorsements });
}

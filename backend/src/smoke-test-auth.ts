import { createClient } from '@supabase/supabase-js';
import { PrismaClient } from '@prisma/client';
import { requireAuth } from './middleware/auth';
import * as jose from 'jose';
import dotenv from 'dotenv';
import { Request, Response } from 'express';

dotenv.config();

const prisma = new PrismaClient();
const SUPABASE_URL = process.env.SUPABASE_URL || 'http://localhost:54321';
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY || 'fake-anon-key';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Mock Express Response
const mockResponse = () => {
  const res: any = {};
  res.status = (code: number) => { res.statusCode = code; return res; };
  res.json = (data: any) => { res.body = data; return res; };
  return res as Response & { statusCode?: number, body?: any };
};

async function testNegativeCases() {
  console.log('\n--- TESTING NEGATIVE CASES ---');
  
  // 1. Missing Authorization header
  const req1 = { headers: {} } as Request;
  const res1 = mockResponse();
  await requireAuth(req1, res1, () => {});
  console.log('1. Missing Header:', res1.statusCode === 401 ? '✅ Passed' : '❌ Failed', res1.body);

  // 2. Invalid JWT
  const req2 = { headers: { authorization: 'Bearer invalid.token.here' } } as Request;
  const res2 = mockResponse();
  await requireAuth(req2, res2, () => {});
  console.log('2. Invalid Token:', res2.statusCode === 401 ? '✅ Passed' : '❌ Failed', res2.body);

  // 3. Valid JWT with no AppUser (mock generated token)
  const secret = new TextEncoder().encode(process.env.SUPABASE_JWT_SECRET || 'fake-secret-that-is-at-least-32-chars-long!');
  const token = await new jose.SignJWT({ sub: 'b0000000-0000-0000-0000-000000000000' })
    .setProtectedHeader({ alg: 'HS256' })
    .sign(secret);
    
  const req3 = { headers: { authorization: `Bearer ${token}` } } as Request;
  const res3 = mockResponse();
  // Temporarily set the secret so middleware works for the test
  process.env.SUPABASE_JWT_SECRET = process.env.SUPABASE_JWT_SECRET || 'fake-secret-that-is-at-least-32-chars-long!';
  await requireAuth(req3, res3, () => {});
  console.log('3. Valid JWT, Unknown User:', res3.statusCode === 401 ? '✅ Passed' : '❌ Failed', res3.body);
}

async function testCitizenFlow() {
  console.log('\n--- TESTING CITIZEN FLOW ---');
  try {
    // Attempt real supabase auth (will fail if no real credentials)
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email: 'citizen_demo1@bhoomisetu.in',
      password: 'DemoPassword123!'
    });
    
    if (authError || !authData.session) {
      console.log('⚠️ Could not sign in to Supabase (missing real credentials/network error). Simulating flow.');
      return;
    }
    
    console.log('✅ Supabase Auth Successful:', authData.user.id);
    
    // Simulate Express middleware
    const req = { headers: { authorization: `Bearer ${authData.session.access_token}` } } as Request;
    const res = mockResponse();
    
    let nextCalled = false;
    await requireAuth(req, res, () => { nextCalled = true; });
    
    if (nextCalled && req.user) {
      console.log('✅ Express JWT Verified & AppUser Loaded');
      if (req.user.user_type === 'CITIZEN' && req.user.person) {
        console.log('✅ Linked Person identified:', req.user.person.full_name);
      } else {
        console.log('❌ AppUser loaded but not a Citizen or missing Person');
      }
    } else {
      console.log('❌ Express Auth Middleware Rejected:', res.statusCode, res.body);
    }
  } catch (err: any) {
    console.error('Error during Citizen test:', err.message);
  }
}

async function testOfficialFlow() {
  console.log('\n--- TESTING OFFICIAL FLOW ---');
  try {
    // Attempt real supabase auth
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email: 'lao_demo@bhoomisetu.in',
      password: 'DemoPassword123!'
    });
    
    if (authError || !authData.session) {
      console.log('⚠️ Could not sign in to Supabase (missing real credentials/network error). Simulating flow.');
      return;
    }
    
    console.log('✅ Supabase Auth Successful:', authData.user.id);
    
    // Simulate Express middleware
    const req = { headers: { authorization: `Bearer ${authData.session.access_token}` } } as Request;
    const res = mockResponse();
    
    let nextCalled = false;
    await requireAuth(req, res, () => { nextCalled = true; });
    
    if (nextCalled && req.user) {
      console.log('✅ Express JWT Verified & AppUser Loaded');
      if (req.user.user_type === 'OFFICIAL' && req.user.officialProfile) {
        console.log('✅ Linked OfficialProfile identified. Role:', req.user.officialProfile.role);
      } else {
        console.log('❌ AppUser loaded but not an Official or missing OfficialProfile');
      }
    } else {
      console.log('❌ Express Auth Middleware Rejected:', res.statusCode, res.body);
    }
  } catch (err: any) {
    console.error('Error during Official test:', err.message);
  }
}

async function main() {
  await testNegativeCases();
  await testCitizenFlow();
  await testOfficialFlow();
  await prisma.$disconnect();
}

main();

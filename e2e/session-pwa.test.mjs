import test from 'node:test';
import assert from 'node:assert/strict';
import {SESSION_MAX_AGE_SECONDS,signSession,verifySessionSignature} from '../src/lib/auth/token.ts';
import {installPlatform} from '../src/lib/pwa.ts';

test('sessions last exactly 30 days and expire at the deadline without sliding renewal',async()=>{
 assert.equal(SESSION_MAX_AGE_SECONDS,30*24*60*60);
 const username=process.env.ADMIN_USERNAME||'Sheiikh';
 const future=Date.now()+SESSION_MAX_AGE_SECONDS*1000;
 const token=await signSession({sid:'test-session',username,exp:future});
 assert.equal((await verifySessionSignature(token)).exp,future);
 assert.equal(await verifySessionSignature(await signSession({sid:'expired',username,exp:Date.now()-1})),null);
});
test('changing the configured username invalidates a previously signed session',async()=>{
 const previous=process.env.ADMIN_USERNAME;process.env.ADMIN_USERNAME='Sheiikh';
 try {
  assert.equal(await verifySessionSignature(await signSession({sid:'previous',username:'sheikh_admin',exp:Date.now()+100000})),null);
  assert.equal((await verifySessionSignature(await signSession({sid:'current',username:'Sheiikh',exp:Date.now()+100000}))).username,'Sheiikh');
 }finally{if(previous===undefined)delete process.env.ADMIN_USERNAME;else process.env.ADMIN_USERNAME=previous;}
});
test('phone install help recognizes Android, iPhone and desktop-mode iPadOS',()=>{
 assert.equal(installPlatform({userAgent:'Mozilla Android Chrome'}),'android');
 assert.equal(installPlatform({userAgent:'Mozilla iPhone Safari'}),'ios');
 assert.equal(installPlatform({userAgent:'Mozilla Macintosh Safari',platform:'MacIntel',maxTouchPoints:5}),'ios');
 assert.equal(installPlatform({userAgent:'Mozilla Macintosh Chrome',platform:'MacIntel',maxTouchPoints:0}),'desktop');
});

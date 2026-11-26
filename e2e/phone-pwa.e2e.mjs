import {chromium,request} from 'playwright-core';
import assert from 'node:assert/strict';
import crypto from 'node:crypto';
const base=process.env.BASE_URL||'http://localhost:3016';
const browser=await chromium.launch({executablePath:process.env.CHROMIUM_PATH||`${process.env.HOME}/.cache/ms-playwright/chromium-1255/chrome-linux64/chrome`,args:['--no-sandbox']});
try {
 for(const [platform,userAgent] of [['android','Mozilla/5.0 (Linux; Android 14; Pixel 8) AppleWebKit/537.36 Chrome/140.0.0.0 Mobile Safari/537.36'],['ios','Mozilla/5.0 (iPhone; CPU iPhone OS 18_0 like Mac OS X) AppleWebKit/605.1.15 Version/18.0 Mobile/15E148 Safari/604.1']]) {
  const ctx=await browser.newContext({viewport:{width:390,height:844},userAgent,isMobile:true,hasTouch:true});await ctx.addCookies([{name:'admin_locale',value:'en',url:base}]);const page=await ctx.newPage();page.setDefaultTimeout(45000);
  await page.goto(base+'/admin/login');await page.getByRole('button',{name:'Install App',exact:false}).first().click();
  const guide=page.getByRole('dialog');await guide.locator(`[data-install-guide="${platform}"]`).waitFor();assert.equal(await guide.locator('li').count(),3);assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);await page.keyboard.press('Escape');
  await page.locator('input[autocomplete="username"]').fill(process.env.ADMIN_USERNAME);await page.locator('input[autocomplete="current-password"]').fill(process.env.ADMIN_PASSWORD);await page.locator('button[type="submit"]').click();await page.waitForURL(base+'/admin');
  const result=await page.request.get(base+'/api/admin/push/subscribe');assert.equal(result.status(),200);assert.equal((await result.json()).enabled,true);
  await page.locator('header').getByRole('button',{name:'Notifications',exact:true}).click();const settings=page.getByRole('dialog');await settings.waitFor();
  if(platform==='ios'){await settings.getByText(/Home Screen/i).first().waitFor();assert.ok(await settings.getByRole('button',{name:/Install App/i}).isVisible());}
  else{await settings.getByRole('button',{name:'Turn on notifications',exact:true}).waitFor();}
  await page.request.post(base+'/api/admin/logout');await ctx.close();console.log(`✓ ${platform} phone: install guidance, mobile layout, real login and accessible notification settings`);
 }
 const installContext=await browser.newContext({viewport:{width:390,height:844}});await installContext.addCookies([{name:'admin_locale',value:'en',url:base}]);const installPage=await installContext.newPage();await installPage.goto(base+'/admin/login');await installPage.evaluate(()=>navigator.serviceWorker.ready);
 await installPage.evaluate(()=>{const event=new Event('beforeinstallprompt');event.prompt=async()=>{window.__installRequested=true;};event.userChoice=Promise.resolve({outcome:'accepted'});window.dispatchEvent(event);});
 await installPage.getByRole('button',{name:/Install App/i}).first().click();assert.equal(await installPage.evaluate(()=>window.__installRequested),true);await installContext.close();console.log('✓ native browser installation prompt is launched from the install button');
 const ctx=await browser.newContext();await ctx.addCookies([{name:'admin_locale',value:'en',url:base}]);const page=await ctx.newPage();await page.clock.install({time:new Date()});
 const login=await page.request.post(base+'/api/admin/login',{data:{username:process.env.ADMIN_USERNAME,password:process.env.ADMIN_PASSWORD}});assert.equal(login.status(),200);assert.match(login.headers()['set-cookie'],/Max-Age=2592000/i);
 const cookie=(await ctx.cookies()).find(c=>c.name==='sheikh_admin_session');const payload=JSON.parse(Buffer.from(cookie.value.split('.')[0],'base64url').toString());assert.equal(payload.username,'Sheiikh');assert.ok(Math.abs(payload.exp-Date.now()-2592000000)<15000);
 if(process.env.ADMIN_SESSION_SECRET){const body=Buffer.from(JSON.stringify({...payload,exp:Date.now()-1})).toString('base64url');const signed=body+'.'+crypto.createHmac('sha256',process.env.ADMIN_SESSION_SECRET).update(body).digest('base64url');const anonymous=await request.newContext({baseURL:base,extraHTTPHeaders:{cookie:`sheikh_admin_session=${signed}`}});assert.equal((await anonymous.get('/api/admin/lectures')).status(),401);await anonymous.dispose();}
 await page.goto(base+'/admin');await page.locator('main h1').waitFor();await page.clock.setSystemTime(new Date(payload.exp+1000));await page.evaluate(()=>window.dispatchEvent(new Event("focus")));await page.waitForURL(/\/admin\/login/,{timeout:30000});
 const replay=await request.newContext({baseURL:base,extraHTTPHeaders:{cookie:`sheikh_admin_session=${cookie.value}`}});assert.equal((await replay.get('/api/admin/lectures')).status(),401);await replay.dispose();
 console.log('✓ 30-day cookie and token expiry, expired API access rejection, automatic app sign-out and session revocation');await ctx.close();
 const publicContext=await request.newContext({baseURL:base});
 for(const path of ['/','/ar','/about','/ar/about']){const response=await publicContext.get(path);assert.equal(response.status(),200);const html=await response.text();assert.ok(!html.includes('مجنو'),path);assert.ok(html.includes('مغنو'),path);}
 await publicContext.dispose();console.log('✓ corrected Arabic surname across the homepage, biography and Arabic pages');
}finally{await browser.close();}

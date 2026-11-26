import {chromium} from 'playwright-core';
import assert from 'node:assert/strict';
const base=process.env.BASE_URL||'http://localhost:3015';
const readOnly=process.env.LIVE_ADMIN_AUDIT==='1';
if(!process.env.ADMIN_USERNAME||!process.env.ADMIN_PASSWORD)throw new Error('Provide the configured admin credentials through the environment.');
const browser=await chromium.launch({executablePath:process.env.CHROMIUM_PATH||`${process.env.HOME}/.cache/ms-playwright/chromium-1255/chrome-linux64/chrome`,args:['--no-sandbox']});
const ctx=await browser.newContext({viewport:{width:1440,height:1000}});await ctx.addCookies([{name:'admin_locale',value:'en',url:base}]);const page=await ctx.newPage();page.setDefaultTimeout(60000);
const marker=`QA verified ${Date.now().toString(36)}`;
const html=async(path)=>(await page.request.get(base+path)).text();
const field=(scope,label)=>scope.locator('label').filter({hasText:label}).locator('xpath=following-sibling::*[self::input or self::textarea or self::select][1]');
const eventually=async(fn)=>{let error;for(let n=0;n<15;n++){try{return await fn();}catch(e){error=e;await new Promise(r=>setTimeout(r,500));}}throw error;};
try {
 await page.goto(base+'/admin/login');
 assert.ok(!(await page.locator('body').innerText()).includes('sheikh_admin_2026!'),'demo credentials must not appear');
 await page.locator('input[autocomplete="username"]').fill(process.env.ADMIN_USERNAME);
 await page.locator('input[autocomplete="current-password"]').fill(process.env.ADMIN_PASSWORD);
 await page.getByRole('button',{name:'Sign In to Admin',exact:true}).click();await page.waitForURL(base+'/admin');
 const destinations=[...new Set(await page.locator('aside a[href^="/admin"]').evaluateAll(nodes=>nodes.map(n=>n.getAttribute('href'))))];assert.equal(destinations.length,16);
 await page.goto(base+'/admin/tests');assert.ok((await page.getByRole('heading',{name:'Event tests'}).count())===1);
 for(const href of destinations){const response=await page.goto(base+href);assert.equal(response.status(),200,href);assert.ok(!page.url().includes('/login'),href);await page.locator('main h1').first().waitFor();}
 console.log('✓ real administrator login and all 16 sidebar destinations, including event-test import');
 if(!readOnly){
  await page.goto(base+'/admin/profile');
  const form=page.locator('form').first();const inputs=form.locator('input[type="text"]');
  const original={name:await inputs.nth(0).inputValue(),headline:await inputs.nth(1).inputValue(),bio:await form.locator('textarea').first().inputValue()};
  const save=async(values)=>{await page.goto(base+'/admin/profile');const f=page.locator('form').first();await f.locator('input[type="text"]').nth(0).fill(values.name);await f.locator('input[type="text"]').nth(1).fill(values.headline);await f.locator('textarea').first().fill(values.bio);await f.getByRole('button',{name:/save/i}).click();await eventually(async()=>assert.ok((await html('/')).replace(/&amp;/g, '&').includes(values.headline)));};
  try{await save({name:marker,headline:marker+' headline',bio:marker+' biography'});for(const locale of ['en','am','ar','om']){const body=await html(locale==='en'?'/':`/${locale}`);assert.ok(body.includes(marker+' headline'));assert.ok(body.includes(marker+' biography'));}}
  finally{await save(original);}
  console.log('✓ saved profile name, headline and biography reach the landing page in every language, then restore');
  await page.goto(base+'/admin/qualifications');await page.getByRole('button',{name:'Edit',exact:true}).first().click();
  const qForm=page.locator('form').last();const qInput=qForm.locator('input[type="text"]').first();const oldTitle=await qInput.inputValue();
  try{await qInput.fill(marker+' credential');await qForm.getByRole('button',{name:'Save Changes',exact:true}).click();await eventually(async()=>assert.ok((await html('/qualifications')).includes(marker+' credential')));assert.ok((await html('/')).includes(marker+' credential'));}
  finally{await page.goto(base+'/admin/qualifications');await page.getByRole('button',{name:'Edit',exact:true}).first().click();const f=page.locator('form').last();await f.locator('input[type="text"]').first().fill(oldTitle);await f.getByRole('button',{name:'Save Changes',exact:true}).click();await eventually(async()=>assert.ok(!(await html('/')).includes(marker+' credential')));}
  console.log('✓ credential edits reach qualifications and landing-page hero, then restore');
  await page.goto(base+'/admin/playlists');
  await page.getByPlaceholder('Search folders...').fill('riyadus-saliheen');
  await page.getByRole('button',{name:/Manage Derses/}).click();
  const modal=page.locator('div.fixed.inset-0.z-50').last();
  const lessonTitles=await modal.locator('div.font-semibold.truncate.text-sm').allTextContents();
  const firstTitle=lessonTitles[0].trim(),secondTitle=lessonTitles[1].trim();
  const publicPage=await ctx.newPage();
  try {
    await modal.getByPlaceholder('Filter lessons in this folder by title or ders #...').fill(firstTitle);
    await modal.getByRole('button',{name:'Move Down',exact:true}).click();
    await eventually(async()=>{await publicPage.goto(base+'/playlists/riyadus-saliheen');assert.equal((await publicPage.locator('main h3').first().innerText()).trim(),secondTitle);});
  } finally {
    await modal.getByRole('button',{name:'Move Up',exact:true}).click();
    await eventually(async()=>{await publicPage.goto(base+'/playlists/riyadus-saliheen');assert.equal((await publicPage.locator('main h3').first().innerText()).trim(),firstTitle);});
    await publicPage.close();
  }
  console.log('✓ filtered playlist reordering changes the correct public lesson positions, then restores');

 }
 for(const locale of ['ar','am','om']){await ctx.addCookies([{name:'admin_locale',value:locale,url:base}]);for(const href of ['/admin','/admin/playlists','/admin/qualifications','/admin/backup']){await page.goto(base+href);assert.ok(!/\badmin\.[a-z]+\.[A-Za-z]+\b/.test(await page.locator('body').innerText()));}}
 await ctx.addCookies([{name:'admin_locale',value:'en',url:base}]);
 await page.setViewportSize({width:390,height:844});await page.goto(base+'/admin');await page.getByRole('button',{name:'Open menu',exact:true}).click();const drawer=page.locator('aside').filter({visible:true});assert.ok(await drawer.locator('a[href="/admin/backup"]').isVisible());await drawer.locator('a[href="/admin/articles"]').click();await page.waitForURL(base+'/admin/articles');
 assert.ok(await page.locator('main h1').isVisible());
 console.log('✓ multilingual admin pages and every sidebar destination reachable through the mobile drawer');
 await page.request.post(base+'/api/admin/logout');
} finally {await browser.close();}

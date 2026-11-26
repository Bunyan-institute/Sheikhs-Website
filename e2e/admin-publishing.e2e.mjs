// Reversible publishing checks: creates only uniquely named test posts and removes them in finally.
import {chromium} from 'playwright-core';
import assert from 'node:assert/strict';
import sharp from 'sharp';
const base=process.env.BASE_URL||'http://localhost:3015';
if(!process.env.ADMIN_USERNAME||!process.env.ADMIN_PASSWORD)throw new Error('Configured admin credentials are required.');
const browser=await chromium.launch({executablePath:process.env.CHROMIUM_PATH||`${process.env.HOME}/.cache/ms-playwright/chromium-1255/chrome-linux64/chrome`,args:['--no-sandbox']});
const ctx=await browser.newContext();await ctx.addCookies([{name:'admin_locale',value:'en',url:base}]);const page=await ctx.newPage();page.setDefaultTimeout(60000);
const run=Date.now().toString(36),title=`Site verification ${run}`,slug=`site-verification-${run}`;
const fatwaTitle=`Technical check ${run}`,fatwaSlug=`technical-check-${run}`;
const card=(text)=>page.locator('tr, article, div').filter({hasText:text}).filter({has:page.getByRole('button',{name:/delete/i})}).filter({visible:true}).last();
const html=async(path)=>(await page.request.get(base+path)).text();
const wait=async(fn)=>{let error;for(let i=0;i<20;i++){try{return await fn();}catch(e){error=e;await new Promise(r=>setTimeout(r,500));}}throw error;};
const field=(scope,label)=>scope.locator('label').filter({hasText:label}).locator('xpath=following-sibling::*[self::input or self::textarea or self::select][1]');
async function remove(kind,text){await page.goto(base+'/admin/'+kind);const row=card(text);if(await row.count()){await row.getByRole('button',{name:/delete/i}).first().click();await page.getByRole('dialog').getByRole('button',{name:'Delete',exact:true}).click();await wait(async()=>assert.ok(!(await html('/'+kind)).includes(text)));}}
try {
 const rejected=await page.request.post(base+'/api/admin/login',{data:{username:'admin',password:'sheikh_admin_2026!'}});assert.equal(rejected.status(),401,'old demo login must be rejected');
 await page.goto(base+'/admin/login');await page.locator('input[autocomplete="username"]').fill(process.env.ADMIN_USERNAME);await page.locator('input[autocomplete="current-password"]').fill(process.env.ADMIN_PASSWORD);await page.locator('button[type="submit"]').click();await page.waitForURL(base+'/admin');
 await page.goto(base+'/admin/articles');await page.getByRole('button',{name:'Write New Article'}).first().click();
 let form=page.locator('form').last();await form.getByLabel('Article Title').fill(title);await form.getByLabel('Your article').fill('Temporary technical verification. This test entry is removed after the check.');await form.getByLabel('Short summary (shown in lists)').fill('Temporary deployment verification; removed automatically after testing.');await form.getByRole('checkbox',{name:/Publish now/}).uncheck();await page.getByRole('button',{name:'Save Article'}).click();await page.getByText(title).first().waitFor();
 assert.equal((await page.request.get(`${base}/api/share/articles/${slug}?locale=en`)).status(),404);
 await card(title).getByRole('button',{name:/edit/i}).first().click();form=page.locator('form').last();await form.getByRole('checkbox',{name:/Publish now/}).check();await page.getByRole('button',{name:'Save Article'}).click();
 await wait(async()=>assert.ok((await html('/')).includes(slug),'published article must reach landing page'));
 const image=await page.request.get(`${base}/api/share/articles/${slug}?locale=am`);assert.equal(image.status(),200);assert.equal((await sharp(await image.body()).metadata()).width,1080);
 await page.goto(base+'/admin/articles');await card(title).getByRole('button',{name:/edit/i}).first().click();form=page.locator('form').last();await form.getByLabel('Article Title').fill(title+' Updated');await page.getByRole('button',{name:'Save Article'}).click();await wait(async()=>assert.ok((await html(`/articles/${slug}`)).includes(title+' Updated')));await wait(async()=>assert.ok((await html('/')).includes(title+' Updated')));
 console.log('✓ real admin login; old demo login rejected; draft privacy, article publishing/editing, landing-page updates and PNG export');
 await remove('articles',title);
 assert.equal((await page.request.get(`${base}/api/share/articles/${slug}?locale=en`)).status(),404);
 await page.goto(base+'/admin/fatwas');await page.getByRole('button',{name:'Publish New Fatwa',exact:true}).first().click();form=page.locator('form').last();await field(form,/Ruling Subject/).first().fill(fatwaTitle);await field(form,/Question/).first().fill('Technical site verification only.');await field(form,/Answer/).first().fill('This is a technical test entry, not a religious ruling. It is removed after verification.');await form.getByRole('button',{name:/Save Fatwa/}).click();await wait(async()=>assert.ok((await html(`/fatwas/${fatwaSlug}`)).includes('technical test entry')));
 assert.equal((await page.request.get(`${base}/api/share/fatwas/${fatwaSlug}?locale=ar&format=preview`)).status(),200);
 console.log('✓ fatwa publishing, slug detail page and Arabic social preview');
} finally {
 try{await remove('articles',title);await remove('fatwas',fatwaTitle);console.log('✓ temporary posts removed; existing content preserved');}finally{await page.request.post(base+'/api/admin/logout');await browser.close();}
}

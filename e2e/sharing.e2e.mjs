import { chromium } from 'playwright-core';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import sharp from 'sharp';
const base=process.env.BASE_URL||'http://localhost:3015';
const seed=JSON.parse(fs.readFileSync(new URL('../src/lib/db/seed/content-seed.json',import.meta.url)));
const browser=await chromium.launch({executablePath:process.env.CHROMIUM_PATH||`${process.env.HOME}/.cache/ms-playwright/chromium-1255/chrome-linux64/chrome`,args:['--no-sandbox']});
const context=await browser.newContext({permissions:['clipboard-read','clipboard-write']});
const page=await context.newPage();page.setDefaultTimeout(60000);
try {
 for(const kind of ['articles','fatwas']) {
  for(const post of seed[kind].filter(p=>p.status!=='draft')) {
   const response=await page.request.get(`${base}/api/share/${kind}/${post.slug}?locale=en`);
   assert.equal(response.status(),200,`${kind}/${post.slug}`);
   assert.match(response.headers()['content-type'],/^image\/png/);
   const meta=await sharp(await response.body()).metadata();assert.equal(meta.width,1080);assert.equal(meta.height,1350);
  }
  console.log(`✓ every ${kind} post exports a 1080 × 1350 PNG`);
  const post=seed[kind][0];
  for(const locale of ['en','am','ar','om']) {
   const image=await page.request.get(`${base}/api/share/${kind}/${post.slug}?locale=${locale}&format=preview`);
   assert.equal(image.status(),200,locale);const bytes=await image.body();const meta=await sharp(bytes).metadata();assert.equal(meta.width,1200);assert.equal(meta.height,630);
   if(locale==='ar'||locale==='am')fs.writeFileSync(`/tmp/${kind}-${locale}-share-preview.png`,bytes);
  }
  await page.goto(`${base}/${kind}/${post.slug}`);
  const region=page.getByRole('region',{name:'Share this post'});await region.waitFor();
  await region.getByRole('button',{name:'Copy link',exact:true}).click();
  await region.getByRole('status').filter({hasText:'Link copied.'}).waitFor();
  const copied=await page.evaluate(()=>navigator.clipboard.readText());assert.ok(copied.endsWith(`/${kind}/${post.slug}`));assert.ok(!copied.includes('/en/'));
  for(const domain of ['wa.me','t.me','facebook.com'])assert.ok((await region.locator(`a[href*="${domain}"]`).getAttribute('href')).includes(encodeURIComponent(post.slug)));
  const download=page.waitForEvent('download');await region.getByRole('link',{name:'Download post image'}).click();const file=await download;assert.match(file.suggestedFilename(),/\.png$/);
  await page.evaluate(()=>{Object.defineProperty(navigator,'share',{value:undefined,configurable:true});Object.defineProperty(navigator,'canShare',{value:undefined,configurable:true});});
  await region.getByRole('button',{name:'Share link',exact:true}).click();
  assert.ok((await page.evaluate(()=>navigator.clipboard.readText())).endsWith(`/${kind}/${post.slug}`));
  const fallbackDownload=page.waitForEvent('download');await region.getByRole('button',{name:'Share as image',exact:true}).click();assert.match((await fallbackDownload).suggestedFilename(),/\.png$/);

  assert.match(await page.locator('meta[property="og:image"]').getAttribute('content'),new RegExp(`/api/share/${kind}/`));
  console.log(`✓ ${kind} copy link, social slug links, PNG download and social preview metadata; all four image languages`);
 }
 for(const path of ['/api/share/articles/not-a-real-slug?locale=en','/api/share/unknown/test?locale=en','/api/share/articles/test?locale=xx'])assert.equal((await page.request.get(base+path)).status(),404,path);
 await page.setViewportSize({width:390,height:844});await page.goto(`${base}/ar/fatwas/${seed.fatwas[0].slug}`);
 assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);
 console.log('✓ invalid share URLs reject safely; Arabic mobile page has no horizontal overflow');
}finally{await browser.close();}

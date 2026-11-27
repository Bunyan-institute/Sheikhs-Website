import test from 'node:test';import assert from 'node:assert/strict';
import {postText,postExcerpt,shareImagePath,sharePagesPath} from '../src/lib/share.ts';
import {publicationBlocks,zipPngPages} from '../src/lib/share-pages.ts';
import {localizeArticle} from '../src/lib/api/article-translations.ts';
import {isPublicSectionLinkEnabled} from '../src/lib/sections.ts';

test('post excerpts strip markup, hidden source comments, scripts and decode multilingual text',()=>{
 assert.equal(postText('<!-- original source --><p>ሰላም &amp; سلام &#x1F54C;</p><script>bad()</script>'),'ሰላም & سلام 🕌');
 assert.equal(postExcerpt('A short article',50),'A short article');
 assert.ok(postExcerpt('A long text '.repeat(100),80).length<=80);
 assert.ok(postExcerpt('A long text '.repeat(100),80).endsWith('…'));
 assert.equal(shareImagePath('fatwas','my-slug','ar',true),'/api/share/fatwas/my-slug?locale=ar&format=preview');
 assert.equal(sharePagesPath('articles','my slug','am'),'/api/share/articles/my%20slug/pages?locale=am');
});
test('complete publication blocks keep headings, paragraphs, list items, image descriptions and multilingual characters',()=>{
 const blocks=publicationBlocks('<h2>First section</h2><p>Every word &amp; sign stays.</p><ul><li>One complete item</li></ul><p>رسم <img alt="diagram" src="/diagram.png"></p>');
 assert.deepEqual(blocks.slice(0,3),[
  {kind:'heading',text:'First section'},
  {kind:'paragraph',text:'Every word & sign stays.'},
  {kind:'paragraph',text:'• One complete item'},
 ]);
 assert.ok(blocks.some(block=>block.text.includes('رسم')));
 assert.ok(blocks.some(block=>block.text.includes('Image: diagram')));
});
test('ZIP page export stores each supplied PNG under its own numbered filename',()=>{
 const first=Buffer.from([137,80,78,71,13,10,26,10,1]);
 const second=Buffer.from([137,80,78,71,13,10,26,10,2]);
 const zip=zipPngPages([{name:'article-001.png',data:first},{name:'article-002.png',data:second}]);
 assert.equal(zip.readUInt32LE(0),0x04034b50);
 assert.ok(zip.includes(Buffer.from('article-001.png')));
 assert.ok(zip.includes(Buffer.from('article-002.png')));
 const end=zip.lastIndexOf(Buffer.from([0x50,0x4b,0x05,0x06]));
 assert.equal(zip.readUInt16LE(end+10),2);
});
test('saved article edits take precedence over bundled translated seed copy',()=>{
 const article={slug:'shield-from-fire-charity-good-words',title:'Edited title',summary:'Edited summary',updated_at:'2026-11-26T12:00:00Z'};
 for(const locale of ['en','am','ar','om']) assert.equal(localizeArticle(article,locale).title,'Edited title');
});
test('landing page portals respect all public section switches',()=>{
 for(const [path,section] of [['/fatwas','fatwas'],['/articles','articles'],['/courses','courses'],['/ask','questions'],['/events','events'],['/playlists','lectures']]) {
  assert.equal(isPublicSectionLinkEnabled(path,{[section]:false}),false);
  assert.equal(isPublicSectionLinkEnabled(path,{[section]:true}),true);
 }
 assert.equal(isPublicSectionLinkEnabled('/media',{lectures:false,library:false}),false);
});

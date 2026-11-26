import test from 'node:test';import assert from 'node:assert/strict';
import {postText,postExcerpt,shareImagePath} from '../src/lib/share.ts';
import {localizeArticle} from '../src/lib/api/article-translations.ts';
import {isPublicSectionLinkEnabled} from '../src/lib/sections.ts';

test('post excerpts strip markup, hidden source comments, scripts and decode multilingual text',()=>{
 assert.equal(postText('<!-- original source --><p>ሰላም &amp; سلام &#x1F54C;</p><script>bad()</script>'),'ሰላም & سلام 🕌');
 assert.equal(postExcerpt('A short article',50),'A short article');
 assert.ok(postExcerpt('A long text '.repeat(100),80).length<=80);
 assert.ok(postExcerpt('A long text '.repeat(100),80).endsWith('…'));
 assert.equal(shareImagePath('fatwas','my-slug','ar',true),'/api/share/fatwas/my-slug?locale=ar&format=preview');
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

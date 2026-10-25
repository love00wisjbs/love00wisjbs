const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const os=require('node:os');
const path=require('node:path');
const {spawnSync}=require('node:child_process');
const tool=path.join(__dirname,'../tools/audit-skills.cjs');
test('auditor implementation exists',()=>assert.ok(fs.existsSync(tool),'audit-skills.cjs not implemented'));
if(fs.existsSync(tool)) {
 const {auditSkills}=require(tool);
 function fixture(t){const dir=fs.mkdtempSync(path.join(os.tmpdir(),'skill-audit-'));t.after(()=>fs.rmSync(dir,{recursive:true,force:true}));return dir;}
 function write(root,p,s){const file=path.join(root,p);fs.mkdirSync(path.dirname(file),{recursive:true});fs.writeFileSync(file,s);}
 function skill(name,body='Read this reference.'){return `---\nname: ${name}\ndescription: Use when testing portable audits.\n---\n\n${body}\n`;}
 test('inventories nested skill, existing links and leaves source unchanged',t=>{
  const dir=fixture(t);const text=skill('alpha','[reference](references/a%20b.md#section) [web](https://example.com)');
  write(dir,'skills/alpha/SKILL.md',text);write(dir,'skills/alpha/references/a b.md','# section');
  const r=auditSkills(dir);assert.equal(r.schemaVersion,1);assert.equal(r.skills.length,1);assert.equal(r.skills[0].name,'alpha');assert.equal(r.skills[0].bytes,Buffer.byteLength(text));assert.match(r.skills[0].sha256,/^[a-f0-9]{64}$/);assert.deepEqual(r.issues,[]);assert.equal(fs.readFileSync(path.join(dir,'skills/alpha/SKILL.md'),'utf8'),text);
 });
 test('reports missing link and missing frontmatter as errors',t=>{
  const dir=fixture(t);write(dir,'alpha/SKILL.md',skill('alpha','[missing](ref/no.md)'));write(dir,'bad/SKILL.md','# No metadata');
  const r=auditSkills(dir);assert.ok(r.issues.some(i=>i.code==='missing-target'&&i.severity==='error'));assert.ok(r.issues.some(i=>i.code==='missing-frontmatter'&&i.severity==='error'));
 });
 test('reports duplicate names and duplicate content',t=>{
  const dir=fixture(t);const s=skill('alpha');write(dir,'a/SKILL.md',s);write(dir,'b/SKILL.md',s);
  const codes=auditSkills(dir).issues.map(i=>i.code);assert.ok(codes.includes('duplicate-name'));assert.ok(codes.includes('duplicate-content'));
 });
 test('ignores fenced and inline code examples',t=>{
  const dir=fixture(t);write(dir,'alpha/SKILL.md',skill('alpha','```md\n[example](not-a-file.md)\n```\n~~~markdown\n[example](also-not-a-file.md)\n~~~\n`[inline](not-real.md)`'));
  assert.deepEqual(auditSkills(dir).issues,[]);
 });
 test('parenthesized destinations request review rather than false missing errors',t=>{
  const dir=fixture(t);write(dir,'alpha/SKILL.md',skill('alpha','[existing](exists(one).md)'));write(dir,'alpha/exists(one).md','text');
  const r=auditSkills(dir);assert.equal(r.issues.filter(i=>i.severity==='error').length,0);assert.ok(r.issues.some(i=>i.code==='link-review'));
 });
 test('long entry and unsupported YAML are review warnings, not YAML errors',t=>{
  const dir=fixture(t);write(dir,'a/SKILL.md',skill('alpha',('word ').repeat(510)));write(dir,'b/SKILL.md','---\nname: beta\ndescription: |\n  Use when testing.\n---\nBody');
  const r=auditSkills(dir);assert.ok(r.issues.some(i=>i.code==='long-entry'));assert.ok(r.issues.some(i=>i.code==='metadata-review'));assert.equal(r.issues.filter(i=>i.severity==='error').length,0);
 });
 test('does not inspect outside-root link targets',t=>{
  const dir=fixture(t);write(dir,'SKILL.md',skill('alpha','[outside](../private-missing.md)'));
  const r=auditSkills(dir);assert.ok(r.issues.some(i=>i.code==='outside-root'));assert.ok(!r.issues.some(i=>i.code==='missing-target'));
 });
 test('skips dependency folders and symlinked skill directories',t=>{
  const dir=fixture(t);write(dir,'alpha/SKILL.md',skill('alpha'));write(dir,'node_modules/pkg/SKILL.md',skill('ignored'));
  try{fs.symlinkSync(path.join(dir,'alpha'),path.join(dir,'linked'),process.platform==='win32'?'junction':'dir');}catch(e){if(['EPERM','EACCES'].includes(e.code)){t.diagnostic('Symlink subcase unavailable: host permission');}else throw e;}
  assert.equal(auditSkills(dir).skills.length,1);
 });
 test('invalid root throws',t=>{const dir=fixture(t);assert.throws(()=>auditSkills(path.join(dir,'missing')));});
 test('CLI emits JSON with meaningful success and error exits',t=>{
  const dir=fixture(t);write(dir,'alpha/SKILL.md',skill('alpha'));
  let r=spawnSync(process.execPath,[tool,dir],{encoding:'utf8'});assert.equal(r.status,0,r.stderr);assert.equal(JSON.parse(r.stdout).skills.length,1);
  write(dir,'alpha/SKILL.md',skill('alpha','[missing](missing.md)'));r=spawnSync(process.execPath,[tool,dir],{encoding:'utf8'});assert.equal(r.status,1);assert.ok(JSON.parse(r.stdout).issues.length);
  r=spawnSync(process.execPath,[tool,path.join(dir,'missing')],{encoding:'utf8'});assert.equal(r.status,2);
 });
}

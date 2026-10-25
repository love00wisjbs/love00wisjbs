// Read-only maintenance checks, not a YAML validator or security scanner.
'use strict';
const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');
const ignored = new Set(['.git','node_modules','.venv','venv','vendor','dist','build']);

function proseWithoutCode(text) {
  let fence = null;
  return text.split(/\r?\n/).map(line => {
    const marker=line.match(/^ {0,3}(`{3,}|~{3,})(.*)$/);
    if(fence) {
      if(marker && marker[1][0]===fence.char && marker[1].length>=fence.length && !marker[2].trim())fence=null;
      return '';
    }
    if(marker){fence={char:marker[1][0],length:marker[1].length};return '';}
    return line;
  }).join('\n').replace(/(`+)([\s\S]*?)\1/g,'');
}

function auditSkills(inputRoot) {
  const root = fs.realpathSync(path.resolve(inputRoot));
  if (!fs.statSync(root).isDirectory()) throw new Error('Root must be a directory');
  const skills = [], issues = [];
  const relative = p => path.relative(root,p).split(path.sep).join('/');
  function issue(severity, code, file, message) { issues.push({severity,code,path:relative(file),message}); }
  function inspect(file) {
    const bytes = fs.readFileSync(file);
    const text = bytes.toString('utf8').replace(/^\uFEFF/,'');
    const block = text.match(/^---\r?\n([\s\S]*?)\r?\n---(?:\r?\n|$)/);
    let name = null;
    if (!block) issue('error','missing-frontmatter',file,'Expected a YAML frontmatter block');
    else {
      // Only ordinary one-line strings are interpreted. Other YAML stays unclassified.
      for (const key of ['name','description']) {
        const matches = block[1].split(/\r?\n/).filter(line=>line.startsWith(key+':'));
        if (!matches.length) { issue('error','missing-metadata',file,'Missing '+key); continue; }
        let value = matches[0].slice(key.length+1).trim();
        if (matches.length>1 || !value || /^[|>!&*{\[]/.test(value)) {
          issue('warning','metadata-review',file,'Review '+key+' with a full YAML/spec validator'); continue;
        }
        if (/^["']/.test(value)) {
          const quote=value[0];
          if(value[value.length-1]!==quote) {issue('warning','metadata-review',file,'Unsupported quoted '+key);continue;}
          value=value.slice(1,-1);
        } else if (/\s#|:\s/.test(value)) {
          issue('warning','metadata-review',file,'Review YAML syntax for '+key);continue;
        }
        if(key==='name')name=value;
      }
    }
    const whitespaceWords = text.trim().split(/\s+/).filter(Boolean).length;
    skills.push({path:relative(file),name,whitespaceWords,bytes:bytes.length,sha256:crypto.createHash('sha256').update(bytes).digest('hex')});
    if(whitespaceWords>500)issue('warning','long-entry',file,'Over 500 whitespace-separated words; inspect progressive disclosure');
    // Ordinary inline Markdown links only. No URL fetches, anchor or reference-style parsing.
    for (const match of proseWithoutCode(text).matchAll(/\]\((<[^>]+>|[^\s)]+)(?:\s+["'][^)]*)?\)/g)) {
      let target=match[1].replace(/^<|>$/g,'');
      if (/^(?:[a-z][a-z0-9+.-]*:|#|\/\/)/i.test(target)) continue;
      if(!match[1].startsWith('<') && target.includes('(')) {
        issue('warning','link-review',file,'Parenthesized destination requires Markdown review');continue;
      }
      target=target.split(/[?#]/)[0];
      if(!target)continue;
      try { target=decodeURIComponent(target); } catch {issue('warning','link-review',file,'Invalid URL escaping in local link');continue;}
      const resolved=path.resolve(path.dirname(file),target);
      const rel=path.relative(root,resolved);
      if(rel==='..'||rel.startsWith('..'+path.sep)||path.isAbsolute(rel)) {
        issue('warning','outside-root',file,'Local link leaves selected root: '+target);continue;
      }
      let current=root, symlink=false, missing=false;
      for(const part of rel.split(path.sep).filter(Boolean)) {
        current=path.join(current,part);
        try {
          if(fs.lstatSync(current).isSymbolicLink()){symlink=true;break;}
        } catch(error) {
          if(error.code==='ENOENT'||error.code==='ENOTDIR'){missing=true;break;}
          throw error;
        }
      }
      if(symlink)issue('warning','link-review',file,'Symlink target not inspected: '+target);
      else if(missing)issue('error','missing-target',file,'Missing local link: '+target);
    }
  }
  function walk(dir) {
    for(const entry of fs.readdirSync(dir,{withFileTypes:true}).sort((a,b)=>a.name.localeCompare(b.name,'en'))) {
      if(entry.isSymbolicLink())continue;
      const full=path.join(dir,entry.name);
      if(entry.isDirectory()&&!ignored.has(entry.name))walk(full);
      else if(entry.isFile()&&entry.name==='SKILL.md')inspect(full);
    }
  }
  walk(root);
  for(const [field,code] of [['name','duplicate-name'],['sha256','duplicate-content']]) {
    const seen=new Map();
    for(const skill of skills) {
      const value=skill[field];if(!value)continue;
      if(seen.has(value))issue('warning',code,path.join(root,skill.path),'Also appears in '+seen.get(value));
      else seen.set(value,skill.path);
    }
  }
  return {schemaVersion:1,root,skills,issues};
}

module.exports = {auditSkills};
if(require.main===module) {
  if(process.argv.length!==3) {
    process.stderr.write('Usage: node tools/audit-skills.cjs <directory>\n');process.exitCode=2;
  } else try {
    const result=auditSkills(process.argv[2]);
    process.stdout.write(JSON.stringify(result,null,2)+'\n');
    process.exitCode=result.issues.some(i=>i.severity==='error')?1:0;
  } catch(error) {process.stderr.write('Skill audit failed: '+error.message+'\n');process.exitCode=2;}
}

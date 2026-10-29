"""Set the GitHub Pages URL without changing the original hosted exhibition."""
from pathlib import Path
import hashlib, json, re, sys

ROOT=Path(__file__).resolve().parents[1]
if len(sys.argv)!=3:raise SystemExit('Usage: python3 tools/configure_pages.py OWNER REPOSITORY')
owner,repo=sys.argv[1:]
if not re.fullmatch(r'[A-Za-z0-9-]+',owner) or not re.fullmatch(r'[A-Za-z0-9_.-]+',repo):raise SystemExit('Invalid GitHub owner or repository name')
url=f'https://{owner}.github.io/{repo}/'
index=ROOT/'dist/index.html';text=index.read_text(encoding='utf-8')
text=re.sub(r'<link\b[^>]*rel="canonical"[^>]*>\s*','',text)
text=text.replace('<title>',f'<link href="{url}" rel="canonical"/>\n<title>',1);index.write_text(text,encoding='utf-8')
readme=ROOT/'README.md';text=readme.read_text(encoding='utf-8');text=re.sub(r'<!-- PAGES_LINK_START -->.*?<!-- PAGES_LINK_END -->',f'<!-- PAGES_LINK_START -->\n**Live exhibition:** [{url}]({url})\n\n**Source repository:** [github.com/{owner}/{repo}](https://github.com/{owner}/{repo})\n<!-- PAGES_LINK_END -->',text,flags=re.S);readme.write_text(text,encoding='utf-8')
manifest=ROOT/'publication-manifest.json';data=json.loads(manifest.read_text());data.update(github_owner=owner,github_repository=repo,pages_url=url)
for entry in data['publication_files']:
    p=ROOT/entry['path'];entry.update(sha256=hashlib.sha256(p.read_bytes()).hexdigest(),bytes=p.stat().st_size)
manifest.write_text(json.dumps(data,ensure_ascii=False,indent=2),encoding='utf-8')
print(url)

#!/usr/bin/env python3
"""Validador de SEO do site Gás Brasil. Uso: python3 validate_seo.py http://127.0.0.1:4173 [SITE_URL_ESPERADA]"""
import sys, re, json, urllib.request, urllib.error
from html.parser import HTMLParser
from urllib.parse import urljoin, urlparse
import xml.etree.ElementTree as ET

base = sys.argv[1].rstrip("/")
site = (sys.argv[2] if len(sys.argv) > 2 else "https://screenshot-to-spark-6156.lovable.app").rstrip("/")

_cache={}
def get(path):
    if path in _cache: return _cache[path]
    r=_get(path); _cache[path]=r; return r

def _get(path):
    try:
        r = urllib.request.urlopen(urllib.request.Request(base + path, headers={"User-Agent": "Googlebot/2.1 (validator)"}), timeout=60)
        return r.status, r.read().decode("utf-8", "replace"), r.headers
    except urllib.error.HTTPError as e:
        return e.code, e.read().decode("utf-8", "replace"), e.headers

class P(HTMLParser):
    def __init__(s):
        super().__init__(); s.t=""; s.in_t=False; s.meta=[]; s.links=[]; s.h=[]; s.cur=None; s.hbuf=""; s.ld=[]; s.in_ld=False; s.a=[]; s.img=[]; s.main=0
    def handle_starttag(s, tag, a):
        a = dict(a)
        if tag=="title": s.in_t=True
        elif tag=="meta": s.meta.append(a)
        elif tag=="link": s.links.append(a)
        elif tag in ("h1","h2","h3"): s.cur=tag; s.hbuf=""
        elif tag=="script" and a.get("type")=="application/ld+json": s.in_ld=True; s.ldbuf=""
        elif tag=="a": s.a.append(a)
        elif tag=="img": s.img.append(a)
        elif tag=="main": s.main+=1
    def handle_endtag(s, tag):
        if tag=="title": s.in_t=False
        elif tag==s.cur: s.h.append((tag, re.sub(r"\s+"," ",s.hbuf).strip())); s.cur=None
        elif tag=="script" and s.in_ld: s.ld.append(s.ldbuf); s.in_ld=False
    def handle_data(s, d):
        if s.in_t: s.t+=d
        if s.cur: s.hbuf+=d
        if s.in_ld: s.ldbuf+=d

# sitemap
st, xml, _ = get("/sitemap.xml")
ns={"s":"http://www.sitemaps.org/schemas/sitemap/0.9"}
locs=[e.text for e in ET.fromstring(xml).findall("s:url/s:loc",ns)]
lastmods=[e.text for e in ET.fromstring(xml).findall("s:url/s:lastmod",ns)]
fails=[]; ok=lambda c,m: (None if c else fails.append(m))
print(f"sitemap.xml: {st}, {len(locs)} URLs")
ok(st==200,"sitemap 200"); ok(all(l.startswith(site) for l in locs),"sitemap URLs com SITE_URL esperada")
ok(all(re.fullmatch(r"\d{4}-\d{2}-\d{2}",d) for d in lastmods),"lastmod W3C")
ok(len(set(locs))==len(locs),"sitemap sem duplicatas")
st, rb, _ = get("/robots.txt"); print("robots.txt:",st); ok(st==200 and f"Sitemap: {site}/sitemap.xml" in rb,"robots declara sitemap"); ok("Disallow: /\n" not in rb,"robots sem bloqueio total")

titles={}; descs={}
paths=[urlparse(l).path or "/" for l in locs]
for path in paths:
    st, html, hd = get(path); p=P(); p.feed(html)
    url = site + ("" if path=="/" else path) if path!="/" else site + "/"
    title=p.t.strip(); m={ (x.get("name") or x.get("property")): x.get("content") for x in p.meta if x.get("content") is not None}
    canon=[l["href"] for l in p.links if l.get("rel")=="canonical"]
    h1=[t for tag,t in p.h if tag=="h1"]
    print(f"\n{path}  [{st}]\n  title({len(title)}): {title}\n  desc({len(m.get('description',''))}): {m.get('description','')[:90]}…\n  canonical: {canon}\n  h1: {h1}\n  h2: {sum(1 for tag,_ in p.h if tag=='h2')}")
    ok(st==200,f"{path} 200"); ok(10<len(title)<=65,f"{path} title len {len(title)}"); ok(70<=len(m.get("description",""))<=170,f"{path} desc len")
    ok(canon==[url],f"{path} canonical absoluto == {url} ({canon})"); ok(m.get("og:url")==url,f"{path} og:url")
    ok(len(h1)==1,f"{path} exatamente 1 h1 ({len(h1)})"); ok(m.get("og:image","").startswith(site),f"{path} og:image absoluto")
    ok(all(m.get(k) for k in ("og:title","og:description","og:type","twitter:card","twitter:image")),f"{path} OG/Twitter completos")
    ok("noindex" not in (m.get("robots","")),f"{path} sem noindex"); ok(p.main==1,f"{path} 1 <main>")
    titles.setdefault(title,[]).append(path); descs.setdefault(m.get("description"),[]).append(path)
    # JSON-LD
    ok(len(p.ld)==1,f"{path} 1 bloco JSON-LD")
    for raw in p.ld:
        try:
            d=json.loads(raw); g=d["@graph"]; types=[n["@type"] for n in g]; print("  JSON-LD:", types)
            ok(d["@context"]=="https://schema.org","@context")
            ids={n.get("@id") for n in g}
            def refs(o):
                if isinstance(o,dict):
                    if set(o)=={"@id"}: yield o["@id"]
                    for v in o.values(): yield from refs(v)
                elif isinstance(o,list):
                    for v in o: yield from refs(v)
            ok(all(r in ids for r in refs(g)),f"{path} @id referenciados existem")
            for n in g:
                for k in ("url","item"):
                    v=n.get(k)
                    if isinstance(v,str): ok(v.startswith("http"),f"{path} {k} absoluto {v}")
            for n in g:
                if n["@type"]=="LocalBusiness":
                    ok(n["address"]["streetAddress"] and n["telephone"].startswith("+55"),"LocalBusiness dados"); ok(n["logo"]["url"].startswith("http"),"logo absoluto")
                    ok("aggregateRating" not in n and "review" not in n,"sem avaliações próprias no schema")
        except Exception as e: ok(False,f"{path} JSON-LD inválido: {e}")
    # imagens
    ok(all(i.get("alt") is not None for i in p.img),f"{path} imgs com alt"); 
    # links internos
    for a in p.a:
        h=a.get("href","")
        if h.startswith("/") and not h.startswith("//"):
            pth=h.split("#")[0].split("?")[0] or "/"
            if pth.startswith("/__l5e"): continue
            s2,_,_=get(pth); ok(s2==200,f"{path} link interno {h} -> {s2}")
for t,pl in titles.items(): ok(len(pl)==1,f"title duplicado {pl}")
for t,pl in descs.items(): ok(len(pl)==1,f"description duplicada {pl}")
st,_,_=get("/naoexiste"); ok(st==404,"404 real"); print("\n/naoexiste ->",st)
for pth in ("/auth",):
    st,html,_=get(pth); ok('noindex' in html,"/auth noindex")
print("\nRESULTADO:", "OK — todas as verificações passaram" if not fails else f"{len(fails)} FALHA(S)")
for f in fails: print(" ✗",f)
sys.exit(1 if fails else 0)

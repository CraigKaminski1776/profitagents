import fs from 'fs';
const SITE='https://profitagents.vercel.app', NAME='ProfitAgents';
const AFF='#TODO-affiliate'; // replace per tool
const tools=[
['Cursor','coding','AI code editor','Best all-round AI IDE for shipping micro-SaaS fast. Pricey at heavy usage, but the agent mode earns its keep.','https://cursor.com'],
['Claude Code','coding','Terminal coding agent','Strong at multi-file refactors and long tasks. Needs comfort with the terminal.','https://www.anthropic.com/claude-code'],
['GitHub Copilot','coding','Coding assistant','Cheapest solid option, works in any major editor. Less autonomous than Cursor.','https://github.com/features/copilot'],
['Replit','micro-saas','Build + host in browser','Fastest idea-to-live-URL for non-devs. Costs climb with agent usage.','https://replit.com'],
['Lovable','micro-saas','Prompt-to-app builder','Great for MVPs and landing pages; expect to hand-edit for complex logic.','https://lovable.dev'],
['Bolt.new','micro-saas','Prompt-to-app builder','Quick full-stack prototypes in the browser. Good for validation, not scale.','https://bolt.new'],
['Vercel','micro-saas','Hosting + v0','Free tier hosts most side projects; v0 generates UI quickly.','https://vercel.com'],
['Stripe','micro-saas','Payments','The default for selling online. Payment Links need zero code.','https://stripe.com'],
['Zapier','automation','No-code automation','Biggest app library and easiest start. Gets expensive at volume.','https://zapier.com'],
['Make','automation','Visual automation','Cheaper than Zapier for complex flows; steeper learning curve.','https://www.make.com'],
['n8n','automation','Self-hostable workflows','Best value if you can self-host; strong AI-agent nodes.','https://n8n.io'],
['Lindy','automation','AI agent builder','Easy no-code agents for inbox, scheduling and lead follow-up.','https://www.lindy.ai'],
['ChatGPT','content','General AI assistant','Swiss-army knife for drafts, research and ideation.','https://chatgpt.com'],
['Grok','content','AI assistant with live X data','Useful for real-time trend research for content and trading ideas.','https://grok.com'],
['ElevenLabs','content','AI voice','Best-in-class voiceovers for faceless video and audio products.','https://elevenlabs.io'],
['Descript','content','Edit video by text','Fast podcast/video editing; great for repurposing clips.','https://www.descript.com'],
['Canva','content','Design','Thumbnails, carousels and product mockups in minutes.','https://www.canva.com'],
['Beehiiv','affiliate','Newsletter platform','Built-in monetization (ad network, boosts) for newsletter operators.','https://www.beehiiv.com'],
['Gumroad','affiliate','Sell digital products','Simplest way to sell templates and prompt packs; higher fees than Stripe.','https://gumroad.com'],
['TradingView','trading','Charts + Pine Script','Industry-standard charts; AI can help write Pine strategies. Not financial advice.','https://www.tradingview.com'],
['Composer','trading','No-code algo trading','Build and backtest strategies with AI help. Backtests are not future returns.','https://www.composer.trade'],
];
const cats={coding:'Coding & vibe coding','micro-saas':'Micro-SaaS builders',automation:'Business automation',content:'Content creation',affiliate:'Affiliate & marketing',trading:'Trading'};
const esc=s=>s.replace(/&/g,'&amp;').replace(/</g,'&lt;');
const page=(path,title,desc,body,ld)=>{const url=SITE+path;return `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>${esc(title)}</title><meta name="description" content="${esc(desc)}"><link rel="canonical" href="${url}">
<meta property="og:title" content="${esc(title)}"><meta property="og:description" content="${esc(desc)}"><meta property="og:url" content="${url}"><meta property="og:type" content="website"><meta property="og:site_name" content="${NAME}"><meta name="twitter:card" content="summary">
<link rel="stylesheet" href="/style.css">${ld?`<script type="application/ld+json">${JSON.stringify(ld)}</script>`:''}</head><body>
<header><a class="logo" href="/">Profit<b>Agents</b></a><nav><a href="/tools/">Tools</a><a href="/playbooks/">Playbooks</a><a href="/products/">Products</a><a href="/sponsor/">Sponsor</a><a href="/#newsletter">Newsletter</a></nav></header>
<main>${body}</main>
<footer><p><b>Affiliate disclosure:</b> some links may be affiliate links; we may earn a commission at no cost to you. Verdicts are our own and not paid. Nothing here is financial advice; results vary and most side projects earn little or nothing.</p><p>© 2026 ${NAME} · <a href="/disclosure/">Disclosure</a></p></footer></body></html>`;};
const card=t=>`<div class="card"><h3>${t[0]}</h3><span class="tag">${cats[t[1]]}</span><p class="sub">${t[2]}</p><p>${t[3]}</p><a href="${t[4]}" rel="nofollow sponsored noopener" target="_blank" data-affiliate="${AFF}">Visit ${t[0]} →</a></div>`;
const form=`<section id="newsletter" class="box"><h2>Weekly AI income ideas</h2><p>One email a week: new revenue-generating agent setups, tools worth trying, and deals. No hype.</p>
<!-- TODO: set FORM_ENDPOINT to your Google Apps Script web app URL or Formspree URL (see README) -->
<form action="https://formspree.io/f/TODO_FORM_ID" method="POST"><input type="email" name="email" required placeholder="you@email.com"><input type="hidden" name="source" value="site"><button>Subscribe</button></form></section>`;
const out={};
out['/']=page('/',`${NAME} – AI agents & tools that actually make money`,'Curated directory and playbooks of AI agents, tools and setups that generate real revenue: micro-SaaS, automation, content, affiliate and more.',
`<section class="hero"><h1>AI agents & tools that actually make money</h1><p>A curated directory and playbook library for people building income with AI: micro-SaaS, automation agencies, content engines, affiliate systems. Honest verdicts, no fake screenshots.</p><a class="btn" href="/tools/">Browse tools</a> <a class="btn alt" href="/playbooks/">Read playbooks</a></section>
<section class="featured box"><h2>Featured</h2><p><i>Featured placement available.</i> <a href="/sponsor/">Put your AI tool here →</a></p></section>
<h2>Browse by use case</h2><div class="grid">${Object.entries(cats).map(([k,v])=>`<a class="card" href="/tools/#${k}"><h3>${v}</h3><p>${tools.filter(t=>t[1]==k).length} tools</p></a>`).join('')}</div>
<h2>Editor's picks</h2><div class="grid">${tools.slice(0,6).map(card).join('')}</div>${form}`,
{'@context':'https://schema.org','@type':'WebSite',name:NAME,url:SITE});
out['/tools/']=page('/tools/',`AI money-making tools directory | ${NAME}`,'Directory of AI tools for coding, micro-SaaS, automation, content, affiliate marketing and trading, with honest verdicts.',
`<h1>Tools directory</h1>${Object.entries(cats).map(([k,v])=>`<h2 id="${k}">Best for ${v}</h2><div class="grid">${tools.filter(t=>t[1]==k).map(card).join('')}</div>`).join('')}`,
{'@context':'https://schema.org','@type':'ItemList',itemListElement:tools.map((t,i)=>({'@type':'ListItem',position:i+1,name:t[0],url:t[4]}))});
const pb=[
['automation-agency','Start an AI automation micro-agency','Sell done-for-you automations to local businesses.',`<ol><li>Pick one niche (e.g. dental clinics, real-estate agents) and one painful task: missed-call follow-up, lead intake, review requests.</li><li>Build the workflow once in n8n, Make or Zapier with an LLM step; record a 2-minute Loom demo.</li><li>Offer a fixed setup fee plus a monthly maintenance retainer; collect with a Stripe Payment Link.</li><li>Reach out to 20 businesses a day with the demo. Track replies in a sheet.</li><li>Turn each delivery into a reusable template to cut build time.</li></ol>`],
['micro-saas-weekend','Ship a micro-SaaS in a weekend with vibe coding','Go from idea to paid MVP using Cursor/Lovable + Stripe + Vercel.',`<ol><li>Find a narrow problem from Reddit, X or your own job; validate by finding people already paying for a worse fix.</li><li>Write a one-page spec; scaffold with Lovable, Bolt or Cursor.</li><li>Add Stripe Payment Links or Checkout before polishing features.</li><li>Deploy on Vercel free tier; post a build-in-public thread.</li><li>Talk to the first 10 users before writing more code.</li></ol>`],
['digital-products','Sell AI templates & prompt packs','Package what you already know into digital products.',`<ol><li>Collect prompts/workflows you actually use and that save measurable time.</li><li>Package them: a Notion/Google Doc, n8n JSON export, or GPT config, plus a short video.</li><li>Sell via Stripe Payment Link or Gumroad; start with a low entry price and a bundle.</li><li>Grow distribution with free samples, a newsletter, and short-form content.</li></ol>`]];
for(const p of pb) out[`/playbooks/${p[0]}/`]=page(`/playbooks/${p[0]}/`,`${p[1]} | ${NAME}`,p[2],`<article><h1>${p[1]}</h1><p class="sub">${p[2]}</p>${p[3]}<p><i>Results vary widely; treat this as a starting framework, not a promise of income.</i></p></article>${form}`,{'@context':'https://schema.org','@type':'Article',headline:p[1],description:p[2],publisher:{'@type':'Organization',name:NAME}});
out['/playbooks/']=page('/playbooks/',`Playbooks | ${NAME}`,'Step-by-step playbooks for making money with AI agents.',`<h1>Playbooks</h1><div class="grid">${pb.map(p=>`<a class="card" href="/playbooks/${p[0]}/"><h3>${p[1]}</h3><p>${p[2]}</p></a>`).join('')}</div>`);
const prods=[['Agent Template Pack','Ready-to-import n8n/Make workflows for lead follow-up, inbox triage and content repurposing.','$29'],['Money Prompt Pack','Tested prompts for offers, outreach, landing pages and product research.','$19'],['Micro-SaaS Blueprint','Idea validation, stack, pricing and launch checklist in one doc.','$49'],['All-Access Bundle','Everything above plus future updates.','$79']];
out['/products/']=page('/products/',`Agent templates, prompt packs & blueprints | ${NAME}`,'Digital products to launch AI income projects faster.',`<h1>Products</h1><p class="note">Coming soon: checkout links are placeholders. Payments are processed by Stripe.</p><div class="grid">${prods.map((p,i)=>`<div class="card"><h3>${p[0]}</h3><p>${p[1]}</p><p class="price">${p[2]}</p><!-- TODO: replace with real Stripe Payment Link --><a class="btn" href="https://buy.stripe.com/TODO_PRODUCT_${i+1}">Buy (coming soon)</a></div>`).join('')}</div>`);
const tiers=[['Listing','Directory listing with verdict + badge','$99 / month'],['Featured','Homepage featured slot + category top placement','$299 / month'],['Newsletter Sponsor','Primary sponsor in one weekly issue','$199 / issue']];
out['/sponsor/']=page('/sponsor/',`Sponsor & featured placements | ${NAME}`,'Reach a high-intent audience building income with AI.',`<h1>Sponsor ${NAME}</h1><p>Reach builders, side hustlers and founders actively looking for AI tools that pay for themselves. Sponsored placements are always labeled; editorial verdicts are never for sale.</p><div class="grid">${tiers.map((t,i)=>`<div class="card"><h3>${t[0]}</h3><p>${t[1]}</p><p class="price">${t[2]}</p><!-- TODO: replace with real Stripe Payment Link --><a class="btn" href="https://buy.stripe.com/TODO_SPONSOR_${i+1}">Book (coming soon)</a></div>`).join('')}</div><p>Questions? Use the newsletter form or contact us (TODO: add contact email).</p><p class="note">All payments are processed via Stripe.</p>`);
out['/disclosure/']=page('/disclosure/',`Disclosure | ${NAME}`,'Affiliate and sponsorship disclosure.',`<h1>Disclosure</h1><p>Some outbound links are affiliate links. If you buy through them we may earn a commission at no extra cost to you. Sponsored placements are clearly labeled. Verdicts reflect our honest opinion. We do not publish invented revenue figures. Nothing on this site is financial advice.</p>`);
for(const [p,h] of Object.entries(out)){fs.mkdirSync('dist'+p,{recursive:true});fs.writeFileSync('dist'+p+'index.html',h);}
fs.writeFileSync('dist/sitemap.xml',`<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${Object.keys(out).map(p=>`<url><loc>${SITE}${p}</loc></url>`).join('')}</urlset>`);
fs.writeFileSync('dist/robots.txt',`User-agent: *\nAllow: /\nSitemap: ${SITE}/sitemap.xml\n`);
fs.copyFileSync('style.css','dist/style.css');

# ProfitAgents

Curated directory + playbooks of AI agents/tools that generate real revenue. Zero-dependency static site: `npm run build` → `dist/`. Deployed on Vercel.

## TODO placeholders
- **Stripe Payment Links**: replace `https://buy.stripe.com/TODO_*` in `build.mjs` (sponsor tiers + products).
- **Newsletter form**: replace `https://formspree.io/f/TODO_FORM_ID`. Google Sheet option: create a Sheet → Extensions → Apps Script, paste:
  ```js
  function doPost(e){SpreadsheetApp.getActiveSheet().appendRow([new Date(),e.parameter.email,e.parameter.source]);return ContentService.createTextOutput('Thanks! You are subscribed.');}
  ```
  Deploy → Web app (execute as me, access: anyone) and use that URL as the form `action`.
- **Affiliate IDs**: replace each tool's URL in `build.mjs` with your affiliate link.
- **Contact**: Craig@globuscapitaladvisors.com (sponsor page + footer).
- **Domain**: update `SITE` in `build.mjs` when a custom domain is connected.

## Payments
All sponsor and product payments go through **Stripe** (Payment Links). X Money only supports transfers between the owner's own accounts and cannot accept external customer/sponsor payments.

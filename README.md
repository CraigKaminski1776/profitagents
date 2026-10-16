# Globus AI Real Estate

AI tools and workflows for commercial lenders, brokers and real estate investors. A Globus Capital Advisors resource. Zero-dependency static site: `npm run build` → `dist/`. Hosted on Vercel; intended URL https://ai.globuscapitaladvisors.com (CNAME `ai` → `cname.vercel-dns.com`).

## TODO placeholders
- **Stripe Payment Links**: replace `https://buy.stripe.com/TODO_*` in `build.mjs`.
- **Newsletter form**: replace `https://formspree.io/f/TODO_FORM_ID`, or use a Google Sheet via Apps Script:
  ```js
  function doPost(e){SpreadsheetApp.getActiveSheet().appendRow([new Date(),e.parameter.email,e.parameter.source]);return ContentService.createTextOutput('Thanks! You are subscribed.');}
  ```
  Deploy → Web app (execute as me, access: anyone), use its URL as the form `action`.
- **Affiliate IDs**: replace tool URLs in `build.mjs`.
- **Contact**: Craig@globuscapitaladvisors.com.

## Payments
Sponsor and product payments go through **Stripe** Payment Links. X Money only moves money between the owner's own accounts and cannot accept external payments.

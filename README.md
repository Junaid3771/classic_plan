# Classic plan — Nila Supermarket

Responsive supermarket website with product search, categories, shopping lists, WhatsApp enquiries and a free static checkout experience. No payment-provider account, API key, database, dependency installation or server function is needed.

## Deploy to Vercel

Import this repository. The supplied vercel.json selects Other, build command `npm run build`, output `dist`, and no install command. The build copies public website files and local assets only. Run `npm run build` locally to check it. Opening index.html directly also works; maps and WhatsApp need internet access.

## Active free checkout

1. Choose products and quantities, then open Your list → Continue to checkout.
2. Pay on collection prepares an order request for WhatsApp **+91 95396 93771**. The visitor must send it; the store must confirm the order and final price. The website never claims an order is accepted automatically.
3. Continue on your phone generates a QR entirely in the browser. It opens the same shopping-list request in WhatsApp. This is an order-request QR, **not a payment QR**.
4. Credit/debit card, Google Pay, PhonePe and Paytm are interactive **payment previews**, clearly labelled inside checkout. The card is a fixed example, not a form asking for card details. Preview completion never charges money, opens a payment app, or marks an actual order paid.

Real online card/UPI collection cannot be activated without a verified merchant payment destination/account. No fictitious payment recipient, live credentials or false charge confirmation is included. The earlier unconfigured backend has been removed from this repository so deployment stays static and needs no extra information.

## Website features

- Eight main sections, responsive navigation and a locally hosted AI-enhanced produce image.
- Eight grocery products, category filters, search and empty states.
- Quantity controls, removal and indicative totals. Basket stays in memory for the current page session, not a database; reload clears it.
- WhatsApp enquiry review, phone link, map of Thrissur and quick-answer help panel.
- Mobile layouts, 44px touch controls, small-screen scrollable dialogs and reduced-motion support.
- Basic SEO title/description, semantic headings, sitemap and robots template.

## Content to personalise later

The supplied phone number is configured. The requested dummy email `hello@nila.example` is not a real inbox. Social buttons open the Instagram/Facebook homepages until business profile URLs are supplied; they do not impersonate another account. Business identity, opening hours, products and prices are illustrative. Replace with client-approved information before promoting the website as an operating store.

Replace the reserved origin in sitemap.xml and robots.txt with the final Vercel/custom domain. The map currently shows the Thrissur area; exact store directions are requested over WhatsApp. Optional third-party live chat can be enabled using the owner's Tawk.to identifiers in config.js; the existing help panel works without an account.

## Files

- index.html / styles.css: page content, desktop/mobile layout.
- products.js: shared catalogue for display and basket totals.
- script.js: shopping list, filters, enquiry review and store help.
- checkout.js: pay-on-collection request, local payment previews and WhatsApp QR.
- config.js: public business settings only.
- scripts/build.cjs: static output builder. No dependency packages are required.

## Credits

Original photo: [nrd / Unsplash](https://unsplash.com/photos/bunch-of-vegetables-D6Tu_L3chLE), [Unsplash License](https://unsplash.com/license). assets/produce.jpg is retained alongside the AI-enhanced version; it is not a real Nila store photograph.

QR encoder: [qrcode-generator by Kazuhiko Arase](https://github.com/kazuhikoarase/qrcode-generator), version 1.4.4, MIT licence. Bundled locally under assets/vendor with its licence, so no external QR service receives shopping-list data.

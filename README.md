# ProDesignity — website

Static site. No build step, no dependencies. Upload the folder and it runs.

```
index.html          Home  (also contains every other page's markup)
CNAME               Custom domain for GitHub Pages
.nojekyll           Stops GitHub Pages running Jekyll over the files
services/index.html Services
about/index.html    About
contact/index.html  Contact
404.html            Fallback for hosts that need it (GitHub Pages)
_redirects          Rewrite rule for Netlify
robots.txt          Crawler rules
sitemap.xml         Submit this to Google Search Console
assets/             Logo + favicons
```

## How the no-reload navigation works

All four pages exist twice, on purpose:

1. **As real HTML files** — so Google, Facebook and anyone typing
   `prodesignity.com/services` directly gets a real page with its own
   `<title>`, description and canonical URL. This is what makes the SEO work.
2. **As sections inside every file** — clicking a nav link swaps the section
   and rewrites the URL with the History API. No reload, no flash.

Because of #2, **any content change must be copied into all four HTML files.**
The four files are identical apart from the block between
`<!-- SEO:START -->` and `<!-- SEO:END -->` and the `data-route` attribute on
`<html>`. Easiest workflow: edit `index.html`, then copy it over the other
three and restore those two bits in each.

## Before you publish — change these

1. **Domain.** Every file has `https://prodesignity.com` hard-coded in the
   canonical tags, Open Graph tags, JSON-LD and `sitemap.xml`. Find and replace
   it with your real domain.
2. **Team section** (in `index.html`, search for `TEAM`). Three of the four
   cards say "Team Member" — replace the names, roles, one-line bios and the
   two-letter initials in `<div class="avatar">`. Delete cards you don't need.
   Check the founder card too; I used the name from your email address.
3. **Social share image.** `og:image` points at the logo on a white square.
   A 1200×630 banner will look much better when the link is shared on Facebook.

## Hosting

- **GitHub Pages** — see `DEPLOY.md` for the full walkthrough, including the
  DNS records for prodesignity.com. `CNAME` and `.nojekyll` are already set up.
- **Netlify / Cloudflare Pages** — drag the folder in. `_redirects` is already there.
- **cPanel / shared hosting** — upload to `public_html`. Add this to `.htaccess`
  so refreshing a sub-page doesn't 404:
  ```
  RewriteEngine On
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d
  RewriteRule . /index.html [L]
  ```

## After you publish

1. Add the site to [Google Search Console](https://search.google.com/search-console)
   and submit `sitemap.xml`.
2. Create a Google Business Profile for ProDesignity and link the site — this is
   what makes your name show up when someone searches for you specifically.
3. Add the website link to your Facebook page's About section. The JSON-LD
   already declares the page as your official profile, and the link back from
   Facebook confirms it.
4. Paste your Google Analytics or Search Console tag just before `</head>` in
   all four files.

## The contact form

There's no server, so the form doesn't email anyone by itself. Both buttons
collect the fields and open a pre-filled WhatsApp chat or email draft. That
works on any host and nothing gets stored.

If you'd rather receive submissions in an inbox, sign up at
[formspree.io](https://formspree.io) and point the form at their endpoint —
about ten lines of change in the script at the bottom of the file.

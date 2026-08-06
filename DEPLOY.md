# Deploying to GitHub Pages — prodesignity.com

Everything in this folder is ready. Nothing needs to be built or compiled.

Two files were added specifically for GitHub:

- `CNAME` — contains `prodesignity.com`. This is what tells GitHub your domain.
  Do not rename or delete it.
- `.nojekyll` — stops GitHub running Jekyll over the files. Without it, Jekyll
  can silently skip files and slow every deploy down.

---

## Step 1 — Create the repository

On GitHub, create a **new public repository**. Name it anything you like
(`prodesignity-website` is fine). Do **not** add a README, .gitignore or
license — the folder already has what it needs.

## Step 2 — Push the files

Open a terminal inside this folder and run:

```bash
git init
git add .
git commit -m "ProDesignity website"
git branch -M main
git remote add origin https://github.com/YOUR-USERNAME/YOUR-REPO.git
git push -u origin main
```

Replace `YOUR-USERNAME` and `YOUR-REPO` with your real values.

If you'd rather not use the terminal: on the empty repo page click
**uploading an existing file**, then drag in everything from this folder.
Two warnings if you do it this way — the web uploader hides dotfiles, so
check that `.nojekyll` actually arrived, and drag the `assets`, `about`,
`services` and `contact` **folders** in, not just their contents.

## Step 3 — Turn Pages on

In the repository: **Settings → Pages**.

- **Source:** Deploy from a branch
- **Branch:** `main`, folder `/ (root)` → **Save**

Wait about a minute. Your site goes live at
`https://YOUR-USERNAME.github.io/YOUR-REPO/`. Open it and confirm it works
before touching DNS — it's much easier to debug one thing at a time.

> Sub-pages will 404 on that temporary `github.io/REPO/` address. That's
> expected: the links are absolute (`/services`), and they start working the
> moment the custom domain is attached in Step 5.

## Step 4 — Point the domain at GitHub

At whoever you bought prodesignity.com from (GoDaddy, Namecheap, Cloudflare,
your host's cPanel), open the DNS settings and add these.

**Four A records** for the apex domain. Host/Name is `@` (or blank, depending
on the provider):

| Type | Host | Value |
|------|------|-----------------|
| A | @ | 185.199.108.153 |
| A | @ | 185.199.109.153 |
| A | @ | 185.199.110.153 |
| A | @ | 185.199.111.153 |

**One CNAME record** so www works too:

| Type | Host | Value |
|------|------|--------------------------|
| CNAME | www | YOUR-USERNAME.github.io. |

Delete any existing A record or parking/forwarding record on `@` first —
a leftover one pointing at your old host will make the site load
intermittently, which is a miserable bug to chase.

DNS usually updates in 15–30 minutes, but GitHub allows up to 24 hours.

## Step 5 — Attach the domain and enable HTTPS

Back in **Settings → Pages**:

1. Under **Custom domain**, type `prodesignity.com` and **Save**. GitHub will
   run a DNS check — a green tick means Step 4 worked.
2. Wait for the certificate to be issued. This takes anywhere from a few
   minutes to an hour.
3. Tick **Enforce HTTPS**.

That last tick matters. You wrote the domain as `http://prodesignity.com`, but
GitHub gives you HTTPS for free and every canonical tag in the site already
points at `https://`. Serving the site over plain HTTP would contradict its own
metadata and cost you ranking. Once Enforce HTTPS is on, GitHub redirects
`http://` to `https://` automatically.

If the checkbox is greyed out, remove the custom domain, save, re-add it, and
save again — that forces the certificate to regenerate.

---

## After it's live

1. **Check the four pages** directly in the address bar, not just by clicking:
   `prodesignity.com`, `/services`, `/about`, `/contact`. All four must load on
   refresh. They will — each one is a real folder with its own `index.html`.
2. **Submit the sitemap.** Go to
   [Google Search Console](https://search.google.com/search-console), add
   `prodesignity.com` as a property, verify it (the DNS TXT method is easiest
   since you're already in the DNS panel), then submit
   `https://prodesignity.com/sitemap.xml`.
3. **Add the link to your Facebook page** under About. The site already
   declares your Facebook page as its official profile in structured data;
   the link back from Facebook confirms the pair, which is what helps your
   name rank.

## Updating the site later

Edit the files, then:

```bash
git add .
git commit -m "what changed"
git push
```

Live in about a minute. Remember the rule from `README.md`: content changes
have to go into all four HTML files, since each one contains the full site.

## Notes

- `_redirects` in this folder is a Netlify file. GitHub Pages ignores it.
  Harmless — leave it in case you ever move hosts.
- `404.html` catches mistyped URLs and still shows the site rather than a bare
  GitHub error page.
- GitHub Pages is free but is for static sites only. If you later want the
  contact form to email you directly, you'll need Formspree or similar —
  see the end of `README.md`.

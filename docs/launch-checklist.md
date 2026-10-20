# Launch checklist: what to do once the site and app are live

Everything in the code is done. The items below need a live address or an account, so they wait for
launch day. Do them in this order; each takes minutes.

## Day 1: tell the search engines

1. **Google Search Console**: add the domain, verify by DNS record, submit `/sitemap.xml`.
   Then use "URL inspection → Request indexing" on the home page and the six rate pages.
2. **Bing Webmaster Tools**: add the site, import from Search Console. Bing feeds ChatGPT search,
   Copilot and DuckDuckGo, so this is where AI assistants find the pages.
3. **IndexNow**: Bing Webmaster gives an API key; ping it after each deploy (same as FormKB's
   `npm run indexnow`, or paste the URLs in Bing Webmaster → IndexNow).
4. **Google Business / Knowledge**: nothing to do; the site is not a local business.

## Week 1: the only "backlinks" that are worth it

Buying links or using link networks gets a site removed from Google. These are the free, allowed ones.

- **Play Store listing** links to the site (privacy policy URL and website field).
- **A short YouTube video** ("How to check today's dollar and gold rate from official sources") with the
  link in the description; YouTube links are nofollow but bring visitors and brand searches.
- **Reddit r/pakistan, r/PakistaniTech and Facebook groups for overseas Pakistanis** (UAE, Saudi, UK):
  answer the "what is the rate today" questions with the figure and the source, link only when asked
  or allowed. Spamming links gets accounts banned and does nothing for ranking.
- **Quora** answers on "how is the gold rate in Pakistan calculated", "difference between open market
  and interbank": full answer in the text, link at the end.
- **Free directories that still count**: Pakistani startup/tool lists (e.g. Pakistani product directories),
  AlternativeTo (as a free alternative to rate-tracking apps), the Awesome lists on GitHub for
  Pakistan data sources (the JSON file is a real data source).
- **Data journalists and bloggers**: `/data/rates.json` and the 30-day history are citable. One email to
  a few Pakistani finance bloggers offering the free JSON brings natural links over time.
- **Wikipedia**: do not add links; editors remove them and flag the domain.

## AI search (ChatGPT, Gemini, Perplexity, Google AI Overviews)

Already in the code: `llms.txt`, answer-first sentence on each page, FAQ and WebPage structured data with
dates, snippet controls, robots.txt naming the AI crawlers. After launch:

- Check the pages render without JavaScript (they do: static HTML with the numbers baked in).
- Ask ChatGPT, Gemini and Perplexity "dollar rate in Pakistan today" once a week and note whether the site
  is cited. Citations follow Bing's index (ChatGPT) and Google's (Gemini, AI Overviews), so steps 1–3
  above are what makes this happen.

## App (Play Store)

- Create the Play Console account ($25 one-time) and the AdMob account with the same Google account.
- Replace the test AdMob IDs in `src/data/site.ts` and `android/app/src/main/AndroidManifest.xml`.
- Paste `store/listing.md` into the listing; take the five screenshots it lists from the real app.
- Closed testing: 12 testers for 14 days (friends, classmates, family with Android phones), then apply
  for production.
- After publication, add the Play Store link to the site's footer and `about` page, and the site link
  to the Play listing.

## Monthly

- 1st of the month: update `data/overrides.json` with OGRA's LPG price (per kg and 11.8 kg cylinder)
  from https://ogra.org.pk/lpg-notified-prices, commit and push. The PDF is a scan, so this is typed.
- Check Search Console for pages with impressions but low clicks; the title or lead sentence of that
  page is what to improve.
- Check that the GitHub Action is still green (Actions tab); if SBP keeps returning 403 from GitHub's
  servers, the site falls back to the central-bank reference rate and says so on the page.

---
name: launch
description: "拆解发布准备、渠道、内容和后续反馈，形成可落地的计划。"
---

## Forma 使用说明

这是基于上游技能的 Forma 指令适配版。默认使用用户的语言；角色、输出协议、工具权限和用户授权优先。只使用当前 Agent 实际具备的工具，不因技能内容而获得额外能力。上游插件连接器和专用运行环境不随本技能安装；缺少工具时使用用户提供的资料，或明确输出待执行方案，不声称已联网、执行、测试或生成文件。外部发布、上传与发送消息仅在用户明确要求且工具可用时进行。

输出策划与草稿；发布、上传或发消息需要用户另行明确授权。

下方已内联本技能的 Markdown 参考附件；原文中的相对引用对应这些附件标题。

# Launch Strategy

You are an expert in SaaS product launches and feature announcements. Your goal is to help users plan launches that build momentum, capture attention, and convert interest into users.

## Before Starting

**Check for product marketing context first:**
If `.agents/product-marketing.md` exists (or `.claude/product-marketing.md`, or the legacy `product-marketing-context.md` filename, in older setups), read it before asking questions. Use that context and only ask for information not already covered or specific to this task.

---

## Core Philosophy

The best companies don't just launch once—they launch again and again. Every new feature, improvement, and update is an opportunity to capture attention and engage your audience.

A strong launch isn't about a single moment. It's about:
- Getting your product into users' hands early
- Learning from real feedback
- Making a splash at every stage
- Building momentum that compounds over time

---

## The ORB Framework

Structure your launch marketing across three channel types. Everything should ultimately lead back to owned channels.

### Owned Channels
You own the channel (though not the audience). Direct access without algorithms or platform rules.

**Examples:**
- Email list
- Blog
- Podcast
- Branded community (Slack, Discord)
- Website/product

**Why they matter:**
- Get more effective over time
- No algorithm changes or pay-to-play
- Direct relationship with audience
- Compound value from content

**Start with 1-2 based on audience:**
- Industry lacks quality content → Start a blog
- People want direct updates → Focus on email
- Engagement matters → Build a community

**Example - Superhuman:**
Built demand through an invite-only waitlist and one-on-one onboarding sessions. Every new user got a 30-minute live demo. This created exclusivity, FOMO, and word-of-mouth—all through owned relationships. Years later, their original onboarding materials still drive engagement.

### Rented Channels
Platforms that provide visibility but you don't control. Algorithms shift, rules change, pay-to-play increases.

**Examples:**
- Social media (Twitter/X, LinkedIn, Instagram)
- App stores and marketplaces
- YouTube
- Reddit

**How to use correctly:**
- Pick 1-2 platforms where your audience is active
- Use them to drive traffic to owned channels
- Don't rely on them as your only strategy

**Example - Notion:**
Hacked virality through Twitter, YouTube, and Reddit where productivity enthusiasts were active. Encouraged community to share templates and workflows. But they funneled all visibility into owned assets—every viral post led to signups, then targeted email onboarding.

**Platform-specific tactics:**
- Twitter/X: Threads that spark conversation → link to newsletter
- LinkedIn: High-value posts → lead to gated content or email signup
- Marketplaces (Shopify, Slack): Optimize listing → drive to site for more

Rented channels give speed, not stability. Capture momentum by bringing users into your owned ecosystem.

### Borrowed Channels
Tap into someone else's audience to shortcut the hardest part—getting noticed.

**Examples:**
- Guest content (blog posts, podcast interviews, newsletter features)
- Collaborations (webinars, co-marketing, social takeovers)
- Speaking engagements (conferences, panels, virtual summits)
- Influencer partnerships

**Be proactive, not passive:**
1. List industry leaders your audience follows
2. Pitch win-win collaborations
3. Use tools like SparkToro or Listen Notes to find audience overlap
4. Set up affiliate/referral incentives (for channel partner launches, use [Introw](https://github.com/coreyhaines31/marketingskills/blob/main/tools/integrations/introw.md) to manage deal registration and commissions)

**Example - TRMNL:**
Sent a free e-ink display to YouTuber Snazzy Labs—not a paid sponsorship, just hoping he'd like it. He created an in-depth review that racked up 500K+ views and drove $500K+ in sales. They also set up an affiliate program for ongoing promotion.

Borrowed channels give instant credibility, but only work if you convert borrowed attention into owned relationships.

---

## Readiness Gate: Are You Ready to Launch?

Run this **before** the phased mechanics. Products don't market themselves—but a product that isn't ready won't market either. The launch mechanics only pay off if what you're launching is worth launching.

Two failure modes kill launches from opposite ends:

- **Stealth Mode** — launching too late. "Procrastination in a fancy suit." You keep polishing in private, waiting for the product to be perfect. It never ships, and nobody learns you exist.
- **"Just One More Feature"** — never launching. Every proposed launch date gets pushed for one more thing. The scope creeps forever; the launch never comes.

The middle path is **SLC — Simple, Lovable, Complete** (Jason Cohen), the antidote to shipping a bare MVP that's minimal but unlovable. Don't launch a stub nobody wants; don't wait for a bloated everything-app. A launchable v1 is:

- **Simple** — it does *one* thing. Not many things poorly. One clear job, done well.
- **Lovable** — people *want* to use it, not just tolerate it. An MVP asks users to suffer through a stripped-down experience "to give feedback." SLC gives them something they'd choose. If nobody would be sad to lose it, it isn't lovable yet.
- **Complete** — it's a *whole* experience for that one thing, not a stub with obvious holes. Complete at its chosen scope, not a teaser of a bigger promise.

**The gate:** If it's not yet Simple, Lovable, and Complete, you're in "Just One More Feature" territory only when adding scope is what's missing—otherwise you're in Stealth Mode and should ship. Cut scope until one thing is lovable and complete, then launch that. SLC gives you a real launch now instead of a perfect launch never.

**Quick check before running the phases:**
- [ ] Does it do one clearly-defined thing? (Simple)
- [ ] Would a target user *choose* to use it, not just endure it? (Lovable)
- [ ] Is that one thing a whole experience, with no glaring stubs? (Complete)
- [ ] Are you polishing past this bar? → Stop. You're in Stealth Mode. Ship.
- [ ] Are you still adding new things to the scope? → Stop. You're in "Just One More Feature." Cut back to SLC.

Pass the gate, then run the phases below.

---

## Five-Phase Launch Approach

Launching isn't a one-day event. It's a phased process that builds momentum.

### Phase 1: Internal Launch
Gather initial feedback and iron out major issues before going public.

**Actions:**
- Recruit early users one-on-one to test for free
- Collect feedback on usability gaps and missing features
- Ensure prototype is functional enough to demo (doesn't need to be production-ready)

**Goal:** Validate core functionality with friendly users.

### Phase 2: Alpha Launch
Put the product in front of external users in a controlled way.

**Actions:**
- Create landing page with early access signup form
- Announce the product exists
- Invite users individually to start testing
- MVP should be working in production (even if still evolving)

**Goal:** First external validation and initial waitlist building.

### Phase 3: Beta Launch
Scale up early access while generating external buzz.

**Actions:**
- Work through early access list (some free, some paid)
- Start marketing with teasers about problems you solve
- Recruit friends, investors, and influencers to test and share

**Consider adding:**
- Coming soon landing page or waitlist
- "Beta" sticker in dashboard navigation
- Email invites to early access list
- Early access toggle in settings for experimental features

**Goal:** Build buzz and refine product with broader feedback.

### Phase 4: Early Access Launch
Shift from small-scale testing to controlled expansion.

**Actions:**
- Leak product details: screenshots, feature GIFs, demos
- Gather quantitative usage data and qualitative feedback
- Run user research with engaged users (incentivize with credits)
- Optionally run product/market fit survey to refine messaging

**Expansion options:**
- Option A: Throttle invites in batches (5-10% at a time)
- Option B: Invite all users at once under "early access" framing

**Goal:** Validate at scale and prepare for full launch.

### Phase 5: Full Launch
Open the floodgates.

**Actions:**
- Open self-serve signups
- Start charging (if not already)
- Announce general availability across all channels

**Launch touchpoints:**
- Customer emails
- In-app popups and product tours
- Website banner linking to launch assets
- "New" sticker in dashboard navigation
- Blog post announcement
- Social posts across platforms
- Product Hunt, BetaList, Hacker News, etc.

**Goal:** Maximum visibility and conversion to paying users.

---

## Product Hunt Launch Strategy

Product Hunt can be powerful for reaching early adopters, but it's not magic—it requires preparation.

### Pros
- Exposure to tech-savvy early adopter audience
- Credibility bump (especially if Product of the Day)
- Potential PR coverage and backlinks

### Cons
- Very competitive to rank well
- Short-lived traffic spikes
- Requires significant pre-launch planning

### How to Launch Successfully

**Before launch day:**
1. Build relationships with influential supporters, content hubs, and communities
2. Optimize your listing: compelling tagline, polished visuals, short demo video
3. Study successful launches to identify what worked
4. Engage in relevant communities—provide value before pitching
5. Prepare your team for all-day engagement

**On launch day:**
1. Treat it as an all-day event
2. Respond to every comment in real-time
3. Answer questions and spark discussions
4. Encourage your existing audience to engage
5. Direct traffic back to your site to capture signups

**After launch day:**
1. Follow up with everyone who engaged
2. Convert Product Hunt traffic into owned relationships (email signups)
3. Continue momentum with post-launch content

### Case Studies

**SavvyCal** (Scheduling tool):
- Optimized landing page and onboarding before launch
- Built relationships with productivity/SaaS influencers in advance
- Responded to every comment on launch day
- Result: #2 Product of the Month

**Reform** (Form builder):
- Studied successful launches and applied insights
- Crafted clear tagline, polished visuals, demo video
- Engaged in communities before launch (provided value first)
- Treated launch as all-day engagement event
- Directed traffic to capture signups
- Result: #1 Product of the Day

---

## Post-Launch Product Marketing

Your launch isn't over when the announcement goes live. Now comes adoption and retention work.

### Immediate Post-Launch Actions

**Educate new users:**
Set up automated onboarding email sequence introducing key features and use cases.

**Reinforce the launch:**
Include announcement in your weekly/biweekly/monthly roundup email to catch people who missed it.

**Differentiate against competitors:**
Publish comparison pages highlighting why you're the obvious choice.

**Update web pages:**
Add dedicated sections about the new feature/product across your site.

**Offer hands-on preview:**
Create no-code interactive demo (using tools like Navattic) so visitors can explore before signing up.

### Keep Momentum Going
It's easier to build on existing momentum than start from scratch. Every touchpoint reinforces the launch.

---

## Ongoing Launch Strategy

Don't rely on a single launch event. Regular updates and feature rollouts sustain engagement.

### How to Prioritize What to Announce

Use this matrix to decide how much marketing each update deserves:

**Major updates** (new features, product overhauls):
- Full campaign across multiple channels
- Blog post, email campaign, in-app messages, social media
- Maximize exposure

**Medium updates** (new integrations, UI enhancements):
- Targeted announcement
- Email to relevant segments, in-app banner
- Don't need full fanfare

**Minor updates** (bug fixes, small tweaks):
- Changelog and release notes
- Signal that product is improving
- Don't dominate marketing

### Announcement Tactics

**Space out releases:**
Instead of shipping everything at once, stagger announcements to maintain momentum.

**Reuse high-performing tactics:**
If a previous announcement resonated, apply those insights to future updates.

**Keep engaging:**
Continue using email, social, and in-app messaging to highlight improvements.

**Signal active development:**
Even small changelog updates remind customers your product is evolving. This builds retention and word-of-mouth—customers feel confident you'll be around.

**Turn shipped code into announcements:**
If you can read the product repo, generate the week's changelog, announcement drafts, and pages-to-update list straight from merged PRs. See [references/shipped-changes.md](references/shipped-changes.md).

---

## Launch Checklist

### Pre-Launch
- [ ] Landing page with clear value proposition
- [ ] Email capture / waitlist signup
- [ ] Early access list built
- [ ] Owned channels established (email, blog, community)
- [ ] Rented channel presence (social profiles optimized)
- [ ] Borrowed channel opportunities identified (podcasts, influencers)
- [ ] Product Hunt listing prepared (if using)
- [ ] Launch assets created (screenshots, demo video, GIFs)
- [ ] Onboarding flow ready
- [ ] Analytics/tracking in place
- [ ] Site QA done if the launch includes a new site, redesign, or migration (see [references/site-launch-qa.md](references/site-launch-qa.md))

### Launch Day
- [ ] Announcement email to list
- [ ] Blog post published
- [ ] Social posts scheduled and posted
- [ ] Product Hunt listing live (if using)
- [ ] In-app announcement for existing users
- [ ] Website banner/notification active
- [ ] Team ready to engage and respond
- [ ] Monitor for issues and feedback

### Post-Launch
- [ ] Onboarding email sequence active
- [ ] Follow-up with engaged prospects
- [ ] Roundup email includes announcement
- [ ] Comparison pages published
- [ ] Interactive demo created
- [ ] Gather and act on feedback
- [ ] Plan next launch moment

---

## Task-Specific Questions

1. What are you launching? (New product, major feature, minor update)
2. What's your current audience size and engagement?
3. What owned channels do you have? (Email list size, blog traffic, community)
4. What's your timeline for launch?
5. Have you launched before? What worked/didn't work?
6. Are you considering Product Hunt? What's your preparation status?

---

## Related Skills

- **marketing-ideas**: For additional launch tactics (#22 Product Hunt, #23 Early Access Referrals)
- **emails**: For launch and onboarding email sequences
- **cro**: For optimizing launch landing pages
- **marketing-psychology**: For psychology behind waitlists and exclusivity
- **programmatic-seo**: For comparison pages mentioned in post-launch
- **sales-enablement**: For launch sales collateral and enablement materials

---

## 上游参考附件：references/shipped-changes.md

# From Shipped Code to Marketing

Most product updates never get marketed because nobody translates them. The engineers wrote the PR description for each other, and by the time marketing hears about it, the moment has passed. An agent with access to the repo can close that gap every week: read what shipped, decide what's worth telling, and draft it in customer language.

## Inputs

For the chosen window (usually the last week, or since the last release tag):
- **Merged PRs** with titles, descriptions, and linked issues. These explain *why* better than commits do.
- **Commit log** for anything merged without a PR: `git log --since="1 week ago" --no-merges --pretty=format:"%h %s (%an, %ar)"`
- **Changed files**, read wherever a title doesn't make the user-facing effect clear.
- **Release notes or tags**, if the team already writes them.
- **Feature flags**: what's actually live for customers versus merged behind a flag.

Only market what customers can use today. Anything behind a flag, in internal beta, or not yet deployed waits.

## Translate before you write

Engineering changes are described by what changed in the code. Customers care about what changed for them. For each change, write one line: **"You can now ___"** or **"___ no longer ___."** If you can't fill that in, the change is invisible to customers. Refactors, dependency bumps, CI, and test changes go in no marketing output at all.

Then group the visible changes with the tiers in the Ongoing Launch Strategy section of `SKILL.md`:

| Tier | Typical changes | Output |
|------|-----------------|--------|
| **Major** | New capability, new plan, big workflow change | Changelog + blog post + email + social + in-app |
| **Medium** | New integration, notable UX improvement, performance gain customers can feel | Changelog + targeted email or in-app + one social post |
| **Minor** | Fixes, polish, small additions | Changelog only, batched |

Several medium changes that share a theme ("five improvements to reporting") can be bundled into one major-tier story.

## Ground every claim in the change

- State what the change does, not what it might do for someone. "Exports now include custom fields," not "unlock deeper insights."
- Use numbers only if they come from the change itself (a benchmark in the PR, a measured speedup). Never invent customer results, adoption, or impact.
- If a PR says the change is partial ("phase 1," "first step toward"), the announcement says so too.
- Credit the user who asked for it, where the team does that and the user agreed.

## Watch for marketing that just became wrong

Every shipped change can also make an existing claim false: a new limit, a renamed plan, a removed integration, a price change. Check the site, docs, comparison pages, and ads for statements the change contradicts. On a schedule, this is the claim-drift loop in `marketing-loops`.

New capabilities also open new search demand. A new integration can deserve its own page ("[Product] + [Tool] integration"), and a new feature can answer queries or comparisons the product couldn't win before. Add those to the content backlog (see `content-strategy` and `competitors`).

## Weekly digest format

```markdown
## Shipped: [date range]

### For customers
- **[Major]** [You can now ...] (PR #123)
- **[Medium]** [You can now ...] (PR #130)
- **[Minor]** [Fixed ...] (PR #131, #134)

### Changelog entry
## [version or date]
### Added
- [Customer-facing description]
### Changed
- [...]
### Fixed
- [...]

### Drafts
- Blog post: [working title], [angle], [who it's for]
- Email: [subject line options] → [segment]
- Social: [one post per major or medium change, built on its single most useful detail]
- In-app: [message + where it appears]

### Pages to update
- [Page]: [statement that's now wrong or incomplete]

### New content opportunities
- [Query or comparison the change makes winnable]
```

Use Keep a Changelog headings (Added, Changed, Deprecated, Removed, Fixed, Security) so the changelog stays scannable over time.

## Writing the drafts

- **Changelog:** one line per change, written for a customer and in past or present tense. Link docs for anything non-obvious.
- **Blog post (major only):** the problem the customer had, what changed, how to use it (with screenshots), and who it's for. The `copywriting` skill covers structure; its AI-tell rules apply.
- **Email:** lead with the change for that segment; one call to action that takes them to the feature. See `emails`.
- **Social:** one concrete detail per post, with a screenshot or 10-second clip of the feature doing it. See `social`.

Drafts are staged for a human to review and send. Nothing in this workflow publishes on its own.


---

## 上游参考附件：references/site-launch-qa.md

# Site Launch QA

The checks to run before and right after a website goes live: a new site, a redesign, a platform migration, or a big new section. Product launches fail quietly when the site underneath them breaks, and most of these failures are invisible from the homepage.

Run it in three passes: before the switch, at the switch, and in the first two weeks after.

## Before the switch

**Content and links**
- [ ] Every page in the plan exists, with final copy (no lorem ipsum, "TBD," or test prices)
- [ ] Crawl the staging site for broken internal links and missing images
- [ ] Legal pages (privacy, terms, cookie policy) are present and current
- [ ] Contact details, pricing, and plan names match what sales and support say

**Forms and conversions**
- [ ] Submit every form with a test entry and confirm it reaches the inbox, CRM, or tool it should
- [ ] Confirmation messages and redirects work, and spam protection doesn't block real submissions
- [ ] Conversion tracking fires on the confirmed submission, not the button click (the `conversion-tracking` skill covers the setup and the test)
- [ ] Analytics is installed once, on every page, with internal traffic filtered
- [ ] Consent banner works and tags respect it

**SEO**
- [ ] Every page has a unique title, meta description, and one H1
- [ ] Canonical tags point to the production domain, not staging
- [ ] Staging is `noindex` or password-protected, and production is **not** (the most common launch-day SEO failure is shipping the staging `noindex`)
- [ ] `robots.txt` allows the pages you want indexed; the XML sitemap lists production URLs
- [ ] Structured data validates (Rich Results Test for Google features, Schema Markup Validator for everything else)
- [ ] For a migration: the redirect map is loaded and tested on a sample of old URLs (see the `site-architecture` skill's platforms and migration reference)

**Performance and access**
- [ ] Core Web Vitals are acceptable on the key templates, on mobile
- [ ] Pages work on mobile, in Safari, and inside in-app browsers (LinkedIn, Instagram, Facebook)
- [ ] Images have alt text; forms have labels; keyboard navigation works
- [ ] Open Graph images and titles render correctly when the URL is shared

**Rollback**
- [ ] You know how to roll back on this platform, and someone has done it once. Examples: Vercel and Netlify promote a previous deployment; Webflow restores a site backup; WordPress restores from a backup plugin or host snapshot; Ploy ◆ promotes a previous deploy from its Deploys screen (its CLI always publishes to production, with no staging target, so preview before publishing).
- [ ] DNS TTL lowered a day ahead if the switch involves DNS changes

◆ marks a [Verified Partner](https://github.com/coreyhaines31/marketingskills/blob/main/tools/REGISTRY.md#verified-partners) of this repository: disclosure, not endorsement.

## At the switch

- [ ] Deploy redirects at the same moment as the new site
- [ ] Confirm HTTPS works on every hostname (`www` and apex) and one redirects to the other
- [ ] Load the top 10 pages by traffic and check content, title, canonical, and a 200 status
- [ ] Submit one real form and confirm it arrives everywhere it should
- [ ] Submit the sitemap in Search Console and Bing Webmaster Tools
- [ ] Re-check that production isn't `noindex`

## The first two weeks

- [ ] Search Console: watch coverage and 404s daily for the first week, then weekly; fix missing redirects as they show up
- [ ] Compare traffic and conversions to the same period before, page by page, not just in total
- [ ] Confirm conversions are arriving in each ad platform at the expected rate
- [ ] Fix internal links that still point at redirected URLs
- [ ] Collect the bugs the team and customers report, and decide what's urgent


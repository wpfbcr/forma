---
name: copywriting
description: "围绕受众、价值主张与行动目标，写出具体可信的产品文案。"
---

## Forma 使用说明

这是基于上游技能的 Forma 指令适配版。默认使用用户的语言；角色、输出协议、工具权限和用户授权优先。只使用当前 Agent 实际具备的工具，不因技能内容而获得额外能力。上游插件连接器和专用运行环境不随本技能安装；缺少工具时使用用户提供的资料，或明确输出待执行方案，不声称已联网、执行、测试或生成文件。外部发布、上传与发送消息仅在用户明确要求且工具可用时进行。

提供产品事实、受众与语气；附带上游文案参考。

下方已内联本技能的 Markdown 参考附件；原文中的相对引用对应这些附件标题。

# Copywriting

You are an expert conversion copywriter. Your goal is to write marketing copy that is clear, compelling, and drives action.

## Before Writing

**Check for product marketing context first:**
If `.agents/product-marketing.md` exists (or `.claude/product-marketing.md`, or the legacy `product-marketing-context.md` filename, in older setups), read it before asking questions. Use that context and only ask for information not already covered or specific to this task.
Check its **Learnings** section before drafting: angles and claims already tested there shouldn't be re-proposed as new ideas, and active lessons apply unless the user says otherwise.

Gather this context (ask if not provided):

### 1. Page Purpose
- What type of page? (homepage, landing page, pricing, feature, about)
- What is the ONE primary action you want visitors to take?

### 2. Audience
- Who is the ideal customer?
- What problem are they trying to solve?
- What objections or hesitations do they have?
- What language do they use to describe their problem?

### 3. Product/Offer
- What are you selling or offering?
- What makes it different from alternatives?
- What's the key transformation or outcome?
- Any proof points (numbers, testimonials, case studies)?

### 4. Context
- Where is traffic coming from? (ads, organic, email)
- What do visitors already know before arriving?

---

## Diagnose the Situation First

Before drafting, decide which of three situations you're in. Most bad AI copy comes from imposing the model's taste on a marketer who already made good choices, so the diagnosis sets how much you're allowed to change.

| Situation | What you were given | Your job |
|---|---|---|
| **A. Blank or slop** | A one-line ask, or generic company-speak with no point of view | Build the argument from the brief and the product context. You have latitude on angle, never on facts: no invented stats, customers, or results |
| **B. Real voice present** | A draft with an angle, opinion, or recognizable voice, even if the execution is rough | Restore it. Keep their argument and vocabulary; fix the buried lead, vague lines, AI tells, and structure |
| **C. Point edit** | "Fix this headline," "tighten this paragraph" | Change only what was asked, plus the minimum needed around it to make it fit. Return the rest untouched |

State the diagnosis in one line with the evidence ("B: the draft argues against agencies in the founder's voice, uses 'ship' and 'stuff'") before writing.

**Read taste out of the input (B and C).** What they gave you is evidence of their judgment:
- **Vocabulary is a voice choice.** If they write "stuff" and "ship," don't upgrade to "solutions" and "deploy."
- **Where they spent words is a priority choice.** Keep the emphasis.
- **What they left out is a scope choice.** Don't add sections they didn't ask for.
- **Their angle is the positioning.** Deepen it; don't replace it with one you like better.

If they include a writing sample, match its average sentence length, punctuation habits, paragraph openings, and a few words they use that you wouldn't. A sample beats the default voice when the two conflict.

## Drafting Protocol

**Decompose and lock.** Don't write the page in one pass. Break it into named units (headline, subhead, CTA, each section heading and body, proof lines). For each unit, draft two or three candidates, keep the best, fix its worst flaw, and lock it. Assemble and read the whole page once for flow. In Situation B, lines that already work are locked from the start.

**The three-question gate.** Run every line you write or keep through three questions:
1. **Can the reader picture it?** A specific image, scene, or object beats an abstraction.
2. **Can it be proven true or false?** A falsifiable claim is a claim; "best-in-class" is decoration.
3. **Could a competitor write this exact sentence?** If yes, it fails (the swap test).

Three passes, keep it. Two, sharpen the weak one. One or none, rewrite it from the facts or flag what's missing with `[NEED: ...]`.

**Ration the punch.** Most lines should be plain, specific, and declarative. A page gets one or two punchy moments, usually the headline and one section. When every line is trying to land, none do, and the stacked devices read as AI.

**The leave-it-alone test.** Before delivering, check each change: is it measurably better, or just different? Revert changes you can't give a reason for. This matters most in Situations B and C.

*Diagnosis, the three-question gate, and decompose-and-lock adapted from Profound's `improved-copywriting` skill ([skills-marketing-library](https://github.com/retieedra-profound/skills-marketing-library), MIT), re-expressed for this skill.*

---

## Copywriting Principles

### Clarity Over Cleverness
If you have to choose between clear and creative, choose clear. Clarity also converts. Founding Marketing (Ch. 3) cites clearer positioning and copy as associated with +81% conversions, a 38% shorter sales cycle, 28% lower CAC, and 175% more referrals. When a reader has to decode your line, you've lost them.

**For message-market fit tools** (the "Now you can" test, the Human Action Model (discomfort → vision → path), the Perception Gap, and the clarity metrics): See [references/copy-frameworks.md](references/copy-frameworks.md#clarity--message-market-fit)

### Benefits Over Features
Features: What it does. Benefits: What that means for the customer.

### Specificity Over Vagueness
- Vague: "Save time on your workflow"
- Specific: "Cut your weekly reporting from 4 hours to 15 minutes"

### Customer Language Over Company Language
Use words your customers use. Mirror voice-of-customer from reviews, interviews, support tickets.

### One Idea Per Section
Each section should advance one argument. Build a logical flow down the page.

### Claims Must Be Supportable — and Declines Must Name Their Unlock
Write only claims the source material supports. When a requested claim
isn't supported, don't write it and don't silently drop it: name the claim,
say why it falls short, offer the closest supportable alternative, and state
exactly what evidence would unlock the original — a customer-review export,
a written guarantee policy, a certification, a citable study or dataset.
A declined claim with an unlock path is an action item for the client;
without one it's a dead end.

---

## Writing Style Rules

### Core Principles

1. **Simple over complex**: "Use" not "utilize," "help" not "facilitate"
2. **Specific over vague**: Avoid "streamline," "optimize," "innovative"
3. **Active over passive**: "We generate reports" not "Reports are generated"
4. **Confident over qualified**: Remove "almost," "very," "really"
5. **Show over tell**: Describe the outcome instead of using adverbs
6. **Honest over sensational**: Fabricated statistics or testimonials erode trust and create legal liability

### Quick Quality Check

- Any AI tells? (see No AI Tells below)
- Jargon that could confuse outsiders?
- Sentences trying to do too much?
- Passive voice constructions?
- Exclamation points? (remove them)
- Marketing buzzwords without substance?

For thorough line-by-line review, use the **copy-editing** skill after your draft.

---

## No AI Tells

Clients and buyers reject copy that reads as AI-written, and a reader who spots a tell tends to doubt the claims around it. Write like a senior copywriter: specific, uneven in rhythm, and built from facts rather than formulas.

### Never write these

1. **Contrast reveals.** "It's not X, it's Y." "Not because X. Because Y." "Not just X, but Y." State Y directly, with the reason.
2. **Negation lists.** "No setup call, no templates, no waiting on IT. No contract." Say what does happen. State a real absence once, near the CTA ("No card required"), and turn the others into what happens.
3. **Trailing pile-ons.** A full claim followed by a comma and more clauses: "...the data you already have, no exports, no spreadsheets, no second copy." End the sentence at the claim.
4. **Self-answered questions and colon reveals.** "The result? 3x faster." "The best part: it learns." Just say it. FAQ questions and a reader's own question ("Need to share a screenshot?") are fine.
5. **Stock openers and phrases.** "In today's fast-paced world," "Whether you're X or Y," "Here's the thing," "Say goodbye to," "X, reimagined," "Unlock the power of," "Take it to the next level."
6. **Em dashes in short copy.** Headlines, subheads, ads, social posts, and subject lines use none.

### Keep these rare

- At most one fragment and one list of three per section (a hero, a page section, or one short post). CTA microcopy and a real three-feature list are fine.
- Words like seamless, robust, powerful, unlock, and streamline: replace them with the fact they stand in for.
- Swap test: if a line would work unchanged on a competitor's site, rewrite it. If you lack the differentiator to fix it, flag `[NEED: differentiator]`.

### Check before delivering

Before handing over any draft, run the self-check in [references/ai-tells.md](references/ai-tells.md#the-self-check): search for the banned patterns, read every sentence over 20 words, and read it aloud. Fix from the facts, since swapping synonyms creates new tells, and flag missing proof as `[NEED: ...]` rather than inventing it.

**For the full blacklist with examples and rewrites**: See [references/ai-tells.md](references/ai-tells.md)

Removing tells leaves copy clean but flat. For a full rewrite, build a writer first (who's writing, what they know cold, what they'd cut, what they think) and check for second-generation tells such as wisdom-shaped sentences and tidy closers. See [references/ai-tells.md](references/ai-tells.md#build-a-writer).

---

## Best Practices

### Be Direct
Get to the point. Don't bury the value in qualifications.

❌ Slack lets you share files instantly, from documents to images, directly in your conversations

✅ Need to share a screenshot? Send as many documents, images, and audio files as your heart desires.

### Use Rhetorical Questions
A question that names the reader's pain can open a section well.
- "Hate returning stuff to Amazon?"
- "Tired of chasing approvals?"

A question in the reader's voice followed by what to do is fine (see Be Direct). A question that labels your own claim ("The result? 3x faster.") is an AI tell.

### Use Analogies When Helpful
Analogies make abstract concepts concrete and memorable.

### Pepper in Humor (When Appropriate)
Puns and wit make copy memorable when they fit the brand and don't cost clarity.

---

## Page Structure Framework

### Above the Fold

**Headline**
- Your single most important message
- Communicate core value proposition
- Specific > generic

**Example formulas:**
- "{Achieve outcome} without {pain point}"
- "The {category} for {audience}"
- "Never {unpleasant event} again"
- "{Question highlighting main pain point}"

**For comprehensive headline formulas**: See [references/copy-frameworks.md](references/copy-frameworks.md)

**Structure the hero as a transformation**: current discomfort → better vision → path to action (the Human Action Model), then run every headline through the "Now you can" test. See [references/copy-frameworks.md](references/copy-frameworks.md#clarity--message-market-fit)

**For natural transition phrases**: See [references/natural-transitions.md](references/natural-transitions.md)

**Subheadline**
- Expands on headline
- Adds specificity
- 1-2 sentences max

**Primary CTA**
- Action-oriented button text
- Communicate what they get: "Start Free Trial" > "Sign Up"

### Core Sections

| Section | Purpose |
|---------|---------|
| Social Proof | Build credibility (logos, stats, testimonials) |
| Problem/Pain | Show you understand their situation |
| Solution/Benefits | Connect to outcomes (3-5 key benefits) |
| How It Works | Reduce perceived complexity (3-4 steps) |
| Objection Handling | FAQ, comparisons, guarantees |
| Final CTA | Recap value, repeat CTA, risk reversal |

**For detailed section types and page templates**: See [references/copy-frameworks.md](references/copy-frameworks.md)

---

## CTA Copy Guidelines

**Weak CTAs (avoid):**
- Submit, Sign Up, Learn More, Click Here, Get Started

**Strong CTAs (use):**
- Start Free Trial
- Get [Specific Thing]
- See [Product] in Action
- Create Your First [Thing]
- Download the Guide

**Formula:** [Action Verb] + [What They Get] + [Qualifier if needed]

Examples:
- "Start My Free Trial"
- "Get the Complete Checklist"
- "See Pricing for My Team"

---

## Page-Specific Guidance

### Homepage
- Serve multiple audiences without being generic
- Lead with broadest value proposition
- Provide clear paths for different visitor intents

### Landing Page
- Single message, single CTA
- Match headline to ad/traffic source
- Complete argument on one page

### Pricing Page
- Help visitors choose the right plan
- Address "which is right for me?" anxiety
- Make recommended plan obvious

### Feature Page
- Connect feature → benefit → outcome
- Show use cases and examples
- Clear path to try or buy

### About Page
- Tell the story of why you exist
- Connect mission to customer benefit
- Still include a CTA

---

## Voice and Tone

Before writing, establish:

**Formality level:**
- Casual/conversational
- Professional but friendly
- Formal/enterprise

**Brand personality:**
- Playful or serious?
- Bold or understated?
- Technical or accessible?

Maintain consistency, but adjust intensity:
- Headlines can be bolder
- Body copy should be clearer
- CTAs should be action-oriented

---

## Output Format

For a point edit (Situation C), return only the changed lines with a one-line reason each. Skip the annotations and alternatives below unless asked.

When writing page copy, provide:

### Page Copy
Organized by section:
- Headline, Subheadline, CTA
- Section headers and body copy
- Secondary CTAs

### Annotations
For key elements, explain:
- Why you made this choice
- What principle it applies

### Alternatives
For headlines and CTAs, provide 2-3 options:
- Option A: [copy]. Rationale: [why]
- Option B: [copy]. Rationale: [why]

### Meta Content (if relevant)
- Page title (for SEO)
- Meta description

---

## Related Skills

- **copy-editing**: For polishing existing copy (use after your draft)
- **cro**: If page structure/strategy needs work, not just copy
- **emails**: For email copywriting
- **popups**: For popup and modal copy
- **ab-testing**: To test copy variations

---

## 上游参考附件：references/ai-tells.md

# AI Tells: The Copy Blacklist

Patterns that make marketing copy read as machine-written. Clients and buyers spot these fast, and a reader who decides a page was generated starts doubting its claims too.

Most of these are old human rhetoric. AI copy gives itself away by using them **by default**, **stacked**, and **with nothing specific behind them**. So the rules below are a mix of hard bans (for patterns that are tells even once) and frequency caps (for devices that are fine when chosen on purpose).

**Confidence key**
- **Ban**: a tell even once. Don't write it.
- **Cap**: fine once, a tell when repeated or stacked. Stay under the cap.

**What the scopes mean**
- **Short copy**: headlines, subheads, the hero, CTAs, ads, social posts, email subject lines.
- **Long copy**: body sections of a page, articles, long emails.
- **Section**: one hero, one page section, or one whole short post.
- CTA microcopy ("No card required") doesn't count toward the fragment cap.

**Still fine:** FAQ questions, a single "No card required," a list of three when there really are three features, a single "without" headline, and a formal brand voice that makes specific claims.

---

## Contents
- Structural Patterns (the worst offenders)
- Openers, Closers, and Setups
- Marketing Phrases
- Vocabulary
- Hedges, Puffery, and Weasels
- Tone
- Formatting
- Second-Generation Tells
- Build a Writer
- Rewrite Rules
- The Self-Check
- Sources

---

## Structural Patterns

These matter more than any word list. A draft can avoid every banned word and still read as AI because of its shape.

### 1. The contrast reveal: "Not X. Y." (Ban)

Sets up an assumption nobody stated, denies it, then gives the "real" answer.

Variants: "It's not X, it's Y." "Not because X. Because Y." "This isn't X. This is Y." "Not just X, but Y." "Less X, more Y." "The question isn't X, it's Y." "X? Think again."

- ✗ Most marketing teams have a list of campaign ideas that never launch. Not because they're bad. Because each one needs a developer.
- ✓ Most marketing teams have a list of campaign ideas that never launch, because each one needs a developer they can't get.

**Why it's a tell:** It's one of the most frequently cited AI patterns. Wikipedia's AI-cleanup guide calls it "negative parallelism," and EQ-Bench's Slop Score gives "not X, but Y" patterns their own weighted category.

**Rewrite:** State Y directly and attach the concrete reason or cost. If the reader holds a wrong belief you need to correct, state the correct fact and the evidence; don't stage the denial.

### 2. The negation list: "No X, no Y, no Z." (Ban)

Defines the product by what's absent, usually in threes, often with a fragment tacked on.

Variants: "No X. No Y. Just Z." "Without X, without Y." "Zero X, zero Y."

- ✗ No setup call, no templates to fill in, no waiting on IT. No contract.
- ✓ Install it from the app store and it's running on your data in five minutes.

**Rewrite:** Say what does happen, in the order it happens. If an absence really is a selling point (no card required, no install), state it once, plainly, next to the CTA: "Free to start. No card required." A brief with several absences doesn't need a list: turn the rest into what happens ("no signup form" becomes "Log in with your Shopify account").

A single "without" or "Never X again" headline is fine. Don't follow it with a negation list in the subhead.

### 3. The trailing pile-on (Ban)

A complete claim, then a comma, then a run of add-ons: a negation list, an "-ing" clause, or a string of extra benefits.

- ✗ Reports pull directly from the data you already have, no exports, no spreadsheets, no second copy to keep updated.
- ✗ It syncs your calendar automatically, ensuring nothing slips through the cracks.
- ✓ Reports pull from the data you already have. There's nothing to export.

**Rewrite:** End the sentence when the main claim ends. If the benefit matters, give it its own short sentence with one concrete detail. Test: after the main clause is complete, cut anything past the next comma that doesn't add a new fact. A clause that adds one ("Imports run nightly, keeping your existing IDs") can stay; a string of restatements can't.

### 4. Rhetorical question, then answer (Ban)

"The result? 3x faster onboarding." "The catch? There isn't one." "Why does this matter? Because..."

- ✗ The result? Onboarding that takes minutes, not weeks.
- ✓ New hires finish onboarding on day one.

**Rewrite:** Delete the question and keep the answer.

Still fine: FAQ questions ("Does it work with Shopify?"), and a question in the reader's voice about their own need, followed by what to do ("Need to share a screenshot? Drop it in the thread."). The tell is a question that labels your own claim ("The result?" "The catch?" "Why does this matter?").

### 5. The colon reveal (Ban)

"The best part: it learns." "Here's the secret: consistency." "One word: speed."

**Rewrite:** Write it as a normal sentence ("It learns from every correction"). Save colons for lists, labels, and quotes.

### 6. Fragment drumbeat (Cap: one per section)

Stacked fragments or one-line paragraphs for manufactured punch. "Simple. Fast. Done." "That's it. That's the whole thing."

**Rewrite:** Merge them into one full sentence that carries a fact. One fragment that lands a real payoff is a copywriting device. A paragraph of them is a tic.

### 7. Reflexive threes (Cap: one per section)

Everything comes in threes: adjectives, benefits, clauses, bullets. "Fast, secure, and scalable." "Save time, cut costs, and grow revenue."

**Rewrite:** Use as many items as the facts support: one, two, or four. Usually the fix is the single strongest concrete claim: "Fast, secure, and scalable" → "Handles 40,000 webhooks a second on the free plan."

### 8. Em dashes (Ban in short copy; cap at 1–2 per page in long copy)

The dash as the default pause, several per paragraph, often carrying a contrast reveal ("It's not a tool — it's a teammate").

**Rewrite:** Use a period, a comma, a colon, or parentheses. In heroes, ads, subject lines, and social posts, use none.

### 9. Uniform rhythm (Cap)

Every sentence 12–18 words. Every paragraph is topic sentence → elaboration → wrap-up. Every section the same length. Three pros, three cons, every time.

**Rewrite:** Vary on purpose. A long sentence, then a short one. Let a section be two lines if that's all it needs. Put the payoff first sometimes.

### 10. Dodging "is" and "has" (Cap)

"Serves as a central hub." "Stands as a testament." "Boasts a library of 200 templates." "Represents a new approach."

**Rewrite:** Use "is" and "has", or better, the actual verb: "Tracks every contract, renewal date, and owner in one place."

### 11. Abstract subjects (Cap)

"The platform empowers teams to..." "Our solution enables..." Nobody does anything.

**Rewrite:** Make the customer the subject. "Your team ships experiments without filing a ticket."

### 12. False ranges (Cap)

"From startups to enterprises." "From onboarding to renewal." The two ends don't describe a real span.

**Rewrite:** Name the segment you actually serve, or the steps you actually cover.

### 13. Synonym cycling (Cap)

Calling the same thing a dashboard, an interface, a portal, and a hub in one page to avoid repeating a word.

**Rewrite:** Pick the word your customer uses and repeat it.

---

## Openers, Closers, and Setups (Ban)

| Pattern | Example | Instead |
|---------|---------|---------|
| Era opener | "In today's fast-paced world..." | Open with the customer's problem |
| False-choice opener | "Whether you're a solo founder or a Fortune 500..." | Name who the page is for |
| "Imagine..." | "Imagine never chasing an invoice again." | Show the actual before and after |
| "When it comes to..." | "When it comes to billing, ..." | Start with the subject |
| Throat-clearing | "Here's the thing:" "The truth is" "Let me be clear" "Here's what nobody tells you" | Cut it. If the claim can't stand alone, it needs evidence, not a drumroll |
| Announcing | "In this guide, we'll explore..." "Let's dive in" | Start with the content |
| Recap ending | "In conclusion" "Ultimately" "At the end of the day" | End on the last concrete point or the CTA |
| Fake-profound kicker | "Because growth shouldn't wait." "And that changes everything." | Cut it. End on a concrete sentence |
| Filler transitions | "It's worth noting" "Moreover" "Additionally" "Importantly" | Delete. The sentence usually works without it |

---

## Marketing Phrases (Ban)

| Phrase | Instead |
|--------|---------|
| "Say goodbye to X" / "Say hello to Y" | Show the new workflow: "Reconciliation runs nightly. You review the exceptions." |
| "Unlock / unleash the power of X" | Name the outcome and the number |
| "X, reimagined" / "X, redefined" | Say what's actually different: "Billing that retries on payday" |
| "Take X to the next level" | Name the level: the metric and the target |
| "Transform the way you work" | A before and after with numbers |
| "The X you deserve" | The specific gap you close |
| "The future of X is here" | What ships today |
| "Built for teams who move fast" | The real customer and trigger: "For subscription teams past $1M ARR fighting failed payments" |
| "Everything you need to X" / "all-in-one" | The 2–3 things buyers actually check for |
| "Effortless" / "in just a few clicks" | The real step count or time: "3 steps, about 4 minutes" |
| "Join thousands of happy customers" | The real count, logos, or a named quote |
| "Game-changer" / "this changes everything" | What changes, for whom, by how much |

---

## Vocabulary

Swapping a banned word for a synonym just creates a new tell. Replace the word with the fact it was standing in for: "robust" → "99.99% uptime over two years"; "seamless" → "imports your Stripe data in about 90 seconds."

**Ban:** delve, tapestry, testament to, realm, embark, beacon, multifaceted, paradigm, synergy, myriad, plethora, meticulous, intricate, utilize, leverage (as a verb), supercharge, turbocharge, game-changer, "ever-evolving landscape," "plays a crucial role"

**Cap (two in a paragraph means rewrite it):** seamless, robust, streamline, empower, elevate, unlock, unleash, harness, foster, enhance, optimize, cutting-edge, innovative, revolutionary, transformative, holistic, comprehensive, pivotal, crucial, vital, powerful, next-level, world-class, best-in-class, landscape, navigate, ecosystem, journey (unless literal)

**Cap (empty intensifiers):** truly, genuinely, incredibly, deeply, fundamentally, significantly, simply, actually, literally, quietly

Favored words drift as models change ("delve" peaked in 2024; "enhance," "showcase," "foster," and "align with" rose after). Treat the lists as current examples, and lean on the structural patterns and the tests below, which don't go stale.

---

## Hedges, Puffery, and Weasels

- **Hedge stacks** (Cap): "can help you potentially reduce..." State what you know, or scope the claim honestly.
- **Importance puffery** (Ban): "marks a pivotal moment," "redefines the category." State the fact; let the reader judge.
- **Weasel sources** (Ban): "experts agree," "studies show," "trusted by industry leaders." Name the source or the customer, or cut it.
- **Invented labels** (Cap): "the integration tax," "the growth trap." Only coin a term you'll define and use across the site.

---

## Tone

- **Chummy openers** (Ban in email and social): "Great question!" "Let's be honest..." "We get it."
- **Fake vulnerability** (Ban): "I'll be honest, I was skeptical too..." with no real story behind it.
- **Over-explaining** (Cap): "Let's break this down," "Think of it as..." Give the explanation directly.
- **Hype punctuation** (Ban): "Ready to level up?!" Exclamation points and interrobangs in body copy.

---

## Formatting

- **Emoji as structure** (Ban in B2B): 🚀 ✨ ✅ leading bullets or headings.
- **Bold label on every bullet** (Cap): "**Seamless integration:** ..." Keep it for reference tables, not every list.
- **Parallel bullet openers** (Cap): every bullet starting "Ensures... / Provides... / Enables..." Start bullets with the customer outcome and vary the grammar.
- **Title Case Everywhere** (Cap): use sentence case unless the brand style guide says otherwise.
- **Unicode decoration** (Ban): arrows, ×, 𝗯𝗼𝗹𝗱 letters in body copy.
- **Label headings** (Cap): "What / Why / How" sections. Write headings that make a claim.

---

## Second-Generation Tells

These show up in copy that has already been de-slopped. The banned words and contrast reveals are gone, but the draft still reads as generated because the model swapped one set of habits for another. Check for them after the patterns above are fixed.

| Tell | Example (✗) | Fix |
|---|---|---|
| **Wisdom-shaped sentences** (Ban) | "Great tools get out of the way." "Speed is a feature." | A sentence with the shape of an insight that nobody would disagree with. Replace it with the specific fact it gestures at, or cut it |
| **Performed cleverness** (Cap) | "Your inbox, minus the noise." "Spreadsheets with a pulse." | Unexpected word pairings built to sound witty. Keep one if the brand is playful and it says something true; otherwise say the plain thing |
| **Staccato bursts** (Cap) | "It's fast. It's simple. And it just works." | Three or more short sentences in a row, then a longer one, as a rhythm device. Merge them into a sentence that carries a fact (see Fragment drumbeat) |
| **Perfect balance** (Cap) | Every section has a heading, two sentences, and three bullets; every benefit gets the same weight | Real writers spend more words on what they care about. Let the strongest section run long and the weakest shrink or go |
| **Omniscient casual** (Cap) | A relaxed, chatty voice that knows every answer and never admits a limit | Casual tone plus total certainty reads as generated. Scope claims honestly and say who the product isn't for |
| **Self-narration** (Ban) | "Here's why this matters." "This is where it gets interesting." "The takeaway is simple." | Sentences that comment on the copy itself. Delete them; if the point needs help, add a detail |
| **Tidy closers** (Ban) | "Because your team deserves better." "The future of billing starts now." | A balanced, quotable last line that could close any page. End on a number, a named customer, the offer, or the CTA |
| **Reflexive specificity** (Cap) | Every claim has a suspiciously round stat or a too-neat customer anecdote | Specificity copied as a style. Every number and story must be real and sourced; mark gaps `[NEED: proof]` instead of filling them |

---

## Build a Writer

Removing patterns leaves copy that's clean and flat. Human-sounding copy comes from a specific person with uneven knowledge and real opinions. Before a full rewrite of Situation A copy (see the Diagnosis section in SKILL.md), answer these silently:

1. **Who is writing?** Name the person and role: the founder, the head of support, the engineer who built the feature. Say why they're writing this page.
2. **What do they know cold?** Those parts get the most words and the most specific detail.
3. **What do they find boring or not know well?** Those parts get compressed, or cut.
4. **What's their honest, arguable opinion** about the problem, the category, or the old way of doing it?
5. **If they had to cut a third, what goes first?** Cut it now.

The answers produce traits that generated copy lacks:

- **Uneven density.** The section the writer cares about runs longest. Equal coverage of everything is a tell.
- **Mixed register.** A precise technical term in one sentence, plain words in the next. Don't polish every word to the same level.
- **Honest limits.** When the writer doesn't know something, the copy skips it or says so. Saying who the product isn't for is a strong version of this.
- **Lopsided structure.** At least one section is noticeably longer, and at least one is short, because that's how much there was to say.
- **Sentence length from the thought.** Write each sentence as long as its idea needs. Don't plan short-short-long rhythms.
- **Opinions that cost something.** A real opinion is specific and someone could disagree with it ("Most onboarding checklists are busywork. Ours has three steps."). "We believe in quality" costs nothing.
- **First person only when it means something.** "I built this after losing a client to a missed invoice" earns the "I." First person that adds no fact is decoration.

**Rules that override the persona:**
- **Never invent experience.** The writer's opinions and emphasis can be constructed; their anecdotes, customers, and results cannot. A made-up "when I ran my agency..." story is fabrication, and so is a fake customer quote. Use what the user gave you or mark `[NEED: founder story]`.
- **In Situation B, the writer already exists.** Match the real voice from the draft or sample; don't build a new one.
- **Keep the brand's register.** A persona for an enterprise security product is still formal. Uneven density and real opinions work in a formal voice too.

---

## Rewrite Rules

1. **Rewrite from the facts.** Go back to what's true (the mechanism, the number, the customer, the step) and write that. Synonym swaps and "humanizer" substitutions produce new tells.
2. **Specificity test.** Every claim sentence needs a number, a name, a mechanism, or a concrete action.
3. **Swap test.** If the line would work unchanged on a competitor's site, rewrite it.
4. **Stacking test.** Two or more Cap patterns in one paragraph means rewrite the whole paragraph.
5. **Don't invent to de-slop.** Replacing "industry-leading" with a made-up stat is worse. Mark it `[NEED: proof]` and ask.
6. **Choose devices on purpose.** A fragment you picked once, for a reason, is copywriting. The same device on every line is slop.
7. **Keep the brand's register.** A formal sentence that makes a specific claim is fine. Don't flatten an enterprise voice into clipped startup copy, which is its own tell.
8. **Vary the fixes.** The ✓ examples show one way out. Don't reuse them as templates. If every reveal becomes ", because..." and every negation list becomes "There's nothing to X," those are the new tics.
9. **Flag a missing differentiator.** If no headline can pass the swap test with what you have, write the best one and mark `[NEED: differentiator vs. named competitors]`.

---

## The Self-Check

Run this on every draft before delivering it:

1. **Search for the bans.** Look for "not ", "isn't", "no ", "without", "?", ":" and "—" in headlines, subheads, and short copy, and check each hit against patterns 1–5 and 8.
2. **Read every sentence over 20 words.** If it has more than two commas, check for a trailing pile-on (pattern 3).
3. **Count the caps.** Fragments, threes, and Cap vocabulary per section.
4. **Read it aloud.** Mark anywhere you'd sound like a press release or a LinkedIn post.
5. **Apply the swap test** to the headline, subhead, and every section heading.
6. **Scan for second-generation tells.** Check the last line of every section for a tidy closer, look for wisdom-shaped sentences, and compare section lengths. If they're all about the same, the draft has perfect balance.

If a fix needs information you don't have (a number, a customer, a mechanism), flag it rather than writing around it.

---

## Sources

Patterns and evidence drawn from, and rewritten in our own words:

- Wikipedia, [Signs of AI writing](https://en.wikipedia.org/wiki/Wikipedia:Signs_of_AI_writing) (WikiProject AI Cleanup)
- Kobak et al., excess vocabulary in 15M+ PubMed abstracts ([arXiv 2406.07016](https://arxiv.org/abs/2406.07016))
- Juzek & Ward, [Why Does ChatGPT "Delve" So Much?](https://aclanthology.org/2025.coling-main.426/) (COLING 2025)
- Paech et al., Antislop ([arXiv 2510.15061](https://arxiv.org/abs/2510.15061)) and [EQ-Bench Slop Score](https://eqbench.com/slop-score.html)
- [tropes.fyi](https://tropes.fyi/tropes-md) catalog of AI writing tropes
- Charlie Guo, [The Field Guide to AI Slop](https://www.ignorance.ai/p/the-field-guide-to-ai-slop)
- Blake Stockton, [Don't write like AI: negation](https://www.blakestockton.com/p/dont-write-like-ai-1-101-negation)
- Profound's `humanizer` and `improved-copywriting` skills and Wispr Flow's `writing` skill, published in [skills-marketing-library](https://github.com/retieedra-profound/skills-marketing-library) (MIT): the build-a-writer questions, human-writing traits, and second-generation tells
- Counter-view: [A case for the defense](https://robotsatemyhomework.substack.com/p/ai-writing-patterns) (devices are fine when chosen, not defaulted)

For a broader word-level list used in content audits, see the seo-audit skill's `references/ai-writing-detection.md`.


---

## 上游参考附件：references/copy-frameworks.md

# Copy Frameworks Reference

Headline formulas, page section types, and structural templates.

## Contents
- Headline Formulas (outcome-focused, problem-focused, audience-focused, differentiation-focused, proof-focused, additional formulas)
- Landing Page Section Types (core sections, supporting sections)
- Page Structure Templates (feature-heavy page, varied engaging page, compact landing page, enterprise/B2B landing page, product launch page)
- Section Writing Tips (problem section, benefits section, how it works section, testimonial selection)
- Clarity & Message-Market Fit (the "Now you can" test, Human Action Model, the Perception Gap, the SavvyCal case, clarity metrics)

## Headline Formulas

These are starting points. Fill every slot with specifics, and check the result against [ai-tells.md](ai-tells.md): a "without" or "Never X again" headline is fine once, but don't follow it with a negation list.

### Outcome-Focused

**{Achieve desirable outcome} without {pain point}**
> Understand how users are really experiencing your site without drowning in numbers

**{Achieve desirable outcome} by {how product makes it possible}**
> Generate more leads by seeing which companies visit your site

**Turn {input} into {outcome}**
> Turn your hard-earned sales into repeat customers

**[Achieve outcome] in [timeframe]**
> Get your tax refund in 10 days

---

### Problem-Focused

**Never {unpleasant event} again**
> Never miss a sales opportunity again

**{Question highlighting the main pain point}**
> Hate returning stuff to Amazon?

**Stop [pain]. Start [pleasure].**
> Stop chasing invoices. Start getting paid on time.

---

### Audience-Focused

**{Key feature/product type} for {target audience}**
> Advanced analytics for Shopify e-commerce

**{Key feature/product type} for {target audience} to {what it's used for}**
> An online whiteboard for teams to ideate and brainstorm together

**You don't have to {skills or resources} to {achieve desirable outcome}**
> With Ahrefs, you don't have to be an SEO pro to rank higher and get more traffic

---

### Differentiation-Focused

**The {opposite of usual process} way to {achieve desirable outcome}**
> The easiest way to turn your passion into income

**The [category] that [key differentiator]**
> The CRM that updates itself

---

### Proof-Focused

**[Number] [people] use [product] to [outcome]**
> 50,000 marketers use Drip to send better emails

**{Key benefit of your product}**
> Sound clear in online meetings

---

### Additional Formulas

**The simple way to {outcome}**
> The simple way to track your time

**Finally, {category} that {benefit}**
> Finally, accounting software that doesn't suck

**{Outcome} without {common pain}**
> Build your website without writing code

**Get {benefit} from your {thing}**
> Get more revenue from your existing traffic

**{Action verb} your {thing} like {admirable example}**
> Market your SaaS like a Fortune 500

**What if you could {desirable outcome}?**
> What if you could close deals 30% faster?

**The {adjective} {category} built for {audience}**
> The lightweight CRM built for startups

---

## Landing Page Section Types

### Core Sections

**Hero (Above the Fold)**
- Headline + subheadline
- Primary CTA
- Supporting visual (product screenshot, hero image)
- Optional: Social proof bar

**Social Proof Bar**
- Customer logos (recognizable > many)
- Key metric ("10,000+ teams")
- Star rating with review count
- Short testimonial snippet

**Problem/Pain Section**
- Articulate their problem better than they can
- Create recognition ("that's exactly my situation")
- Hint at cost of not solving it

**Solution/Benefits Section**
- Bridge from problem to your solution
- 3-5 key benefits (not 10)
- Each: headline + explanation + proof if available

**How It Works**
- 3-4 numbered steps
- Reduces perceived complexity
- Each step: action + outcome

**Final CTA Section**
- Recap value proposition
- Repeat primary CTA
- Risk reversal (guarantee, free trial)

---

### Supporting Sections

**Testimonials**
- Full quotes with names, roles, companies
- Photos when possible
- Specific results over vague praise
- Formats: quote cards, video, tweet embeds

**Case Studies**
- Problem → Solution → Results
- Specific metrics and outcomes
- Customer name and context
- Can be snippets with "Read more" links

**Use Cases**
- Different ways product is used
- Helps visitors self-identify
- "For marketers who need X" format

**Personas / "Built For" Sections**
- Explicitly call out target audience
- "Perfect for [role]" blocks
- Addresses "Is this for me?" question

**FAQ Section**
- Address common objections
- Good for SEO
- Reduces support burden
- 5-10 most common questions

**Comparison Section**
- vs. competitors (name them or don't)
- vs. status quo (spreadsheets, manual processes)
- Tables or side-by-side format

**Integrations / Partners**
- Logos of tools you connect with
- "Works with your stack" messaging
- Builds credibility

**Founder Story / Manifesto**
- Why you built this
- What you believe
- Emotional connection
- Differentiates from faceless competitors

**Demo / Product Tour**
- Interactive demos
- Video walkthroughs
- GIF previews
- Shows product in action

**Pricing Preview**
- Teaser even on non-pricing pages
- Starting price or "from $X/mo"
- Moves decision-makers forward

**Guarantee / Risk Reversal**
- Money-back guarantee
- Free trial terms
- "Cancel anytime"
- Reduces friction

**Stats Section**
- Key metrics that build credibility
- "10,000+ customers"
- "4.9/5 rating"
- "$2M saved for customers"

---

## Page Structure Templates

### Feature-Heavy Page (Weak)

```
1. Hero
2. Feature 1
3. Feature 2
4. Feature 3
5. Feature 4
6. CTA
```

This is a list, not a persuasive narrative.

---

### Varied, Engaging Page (Strong)

```
1. Hero with clear value prop
2. Social proof bar (logos or stats)
3. Problem/pain section
4. How it works (3 steps)
5. Key benefits (2-3, not 10)
6. Testimonial
7. Use cases or personas
8. Comparison to alternatives
9. Case study snippet
10. FAQ
11. Final CTA with guarantee
```

This tells a story and addresses objections.

---

### Compact Landing Page

```
1. Hero (headline, subhead, CTA, image)
2. Social proof bar
3. 3 key benefits with icons
4. Testimonial
5. How it works (3 steps)
6. Final CTA with guarantee
```

Good for ad landing pages where brevity matters.

---

### Enterprise/B2B Landing Page

```
1. Hero (outcome-focused headline)
2. Logo bar (recognizable companies)
3. Problem section (business pain)
4. Solution overview
5. Use cases by role/department
6. Security/compliance section
7. Integration logos
8. Case study with metrics
9. ROI/value section
10. Contact/demo CTA
```

Addresses enterprise buyer concerns.

---

### Product Launch Page

```
1. Hero with launch announcement
2. Video demo or walkthrough
3. Feature highlights (3-5)
4. Before/after comparison
5. Early testimonials
6. Launch pricing or early access offer
7. CTA with urgency
```

Good for ProductHunt, launches, or announcements.

---

## Section Writing Tips

### Problem Section

Start with phrases like:
- "You know the feeling..."
- "If you're like most [role]..."
- "Every day, [audience] struggles with..."
- "We've all been there..."

Then describe:
- The specific frustration
- The time/money wasted
- The impact on their work/life

### Benefits Section

For each benefit, include:
- **Headline**: The outcome they get
- **Body**: How it works (1-2 sentences)
- **Proof**: Number, testimonial, or example (optional)

### How It Works Section

Each step should be:
- **Numbered**: Creates sense of progress
- **Simple verb**: "Connect," "Set up," "Get"
- **Outcome-oriented**: What they get from this step

Example:
1. Connect your tools (takes 2 minutes)
2. Set your preferences
3. Get automated reports every Monday

### Testimonial Selection

Best testimonials include:
- Specific results ("increased conversions by 32%")
- Before/after context ("We used to spend hours...")
- Role + company for credibility
- Something quotable and specific

Avoid testimonials that just say:
- "Great product!"
- "Love it!"
- "Easy to use!"

---

## Clarity & Message-Market Fit

Headline formulas give you the shape of a line. These tools tell you whether the line is actually *working*: whether it's clear, whether it maps to how the reader already thinks, and whether it lands with the right person. Positioning is the prologue to your novel: it sets up everything that follows. Get it clear and the rest of the page writes itself.

### The "Now you can" Test

A fast gut-check for any headline or benefit line. Mentally prefix it with **"Now you can…"**. If the result is both **compelling** and **true**, the line is doing its job. If it reads as vague, obvious, or a stretch, rewrite it.

The test works because "Now you can…" forces the copy into the reader's world. It has to name a concrete new ability they didn't have before. Feature-speak and buzzwords collapse under it.

| Original line | "Now you can…" version | Verdict |
|---------------|------------------------|---------|
| "Powerful analytics platform" | Now you can… have a powerful analytics platform | Fails. not a new ability, just a description |
| "See which companies visit your site" | Now you can… see which companies visit your site | Works. compelling + true |
| "Streamline your workflow" | Now you can… streamline your workflow | Fails. vague, unfalsifiable |
| "Send unlimited docs, images, and audio in one place" | Now you can… send unlimited docs, images, and audio in one place | Works. concrete + true |

Use it as a filter, not a formula: draft with the headline formulas above, then run each candidate through "Now you can…" and keep the survivors.

### The Human Action Model (landing-page narrative spine)

Ludwig von Mises' Human Action Model explains *why* anyone acts: a person acts only when three things line up. Every above-the-fold that converts follows the same three-beat spine:

1. **Current discomfort**: the felt problem, named in the reader's own words. They have to recognize their situation ("that's exactly me").
2. **Better vision**: a clearly imagined, more satisfying state. What life looks like once the discomfort is gone.
3. **Path to action**: the belief that *this specific step* closes the gap between the two. The product is the bridge, and the CTA is how they cross it.

Miss any beat and the reader stalls. No discomfort = no reason to move. No vision = no destination. No path = no reason to believe *you're* the way there.

**Mapping it onto the hero:**

| Beat | Where it usually lives | Example |
|------|------------------------|---------|
| Current discomfort | Eyebrow, subhead, or problem-framed headline | "You shouldn't have to feel awkward sending out your scheduling link" |
| Better vision | Headline or subhead | "Scheduling that feels considerate, not one-sided" |
| Path to action | CTA + supporting proof | "Start scheduling free" |

This is the transformation spine underneath the "6 essential sections" of a landing page (hero, social proof, problem, solution, how-it-works, and final CTA). The hero states the transformation; the rest of the page substantiates each beat.

### The Perception Gap

The same benefit can read as a **selling point to one segment and a red flag to another**. The gap is between what *you* think you're saying and what a given reader hears through their own risk tolerance.

The fix is **matching the value prop to the reader's risk tolerance**. Segment first, then swap the framing.

| Benefit as written | Startup / early-adopter hears | Enterprise / risk-averse hears |
|--------------------|-------------------------------|--------------------------------|
| "Move fast. Ship in a weekend." | Speed, momentum (✅) | Immature, unstable (🚩) |
| "Brand-new approach" | Innovative edge (✅) | Unproven, risky (🚩) |
| "Enterprise-grade security & SLAs" | Bloated, slow, expensive (🚩) | Safe, trustworthy (✅) |
| "Trusted by the Fortune 500" | Not built for me (🚩) | Proven, de-risked (✅) |

**Value-prop swap in practice** (same product, two audiences):

- *Startup landing page:* "Ship your first integration this afternoon. Pay by card and skip the sales call."
- *Enterprise landing page:* "SOC 2 Type II, 99.99% uptime SLA, and a named implementation lead. Roll out with confidence."

When a page has to serve both, don't average them into mush. Segment the traffic (separate pages, or a persona split) and let each read its own version of the truth.

### Worked Example: SavvyCal (message-market fit)

SavvyCal (a scheduling tool) originally led with feature-forward copy. They rewrote the hero around a single felt discomfort:

> **"You shouldn't have to feel awkward sending out your scheduling link."**

That one line **roughly tripled (3×) conversions**. It works because it hits all three beats of the Human Action Model at once:

- **Discomfort:** the small social awkwardness of "here's my link, pick a time," named exactly as users feel it.
- **Vision:** scheduling that feels considerate to *both* people.
- **Path:** SavvyCal's overlay-your-calendar mechanic is the bridge, so the CTA feels like the obvious next step.

The lesson: message-market fit beats feature lists. The winning line named a real feeling the reader hadn't heard a scheduling tool acknowledge before. Run your own hero through "Now you can…" and the Human Action Model to find that line.

### Clarity Beats Cleverness (the metrics)

When teams measure it, clarity is what moves the numbers. Figures cited in Corey Haines's *Founding Marketing* (Ch. 3) associate clearer positioning and copy with:

- **+81% conversions**
- **−38% sales cycle** (shorter time to close)
- **−28% CAC** (lower customer acquisition cost)
- **+175% referrals**

The mechanism: clear copy lets the *right* buyer self-qualify fast and the wrong one bounce early, so every downstream metric improves. Clever copy that requires decoding does the opposite. It adds a comprehension tax at the exact moment attention is scarcest.

**Practical rule:** if a reader has to pause to figure out what you mean, you've already lost. When forced to choose between a clever line and a clear one, ship the clear one, then use the tests above ("Now you can…", the Human Action Model, the Perception Gap) to make the clear line compelling too.


---

## 上游参考附件：references/natural-transitions.md

# Natural Transitions

Transitional phrases to guide readers through your content. Good signposting improves readability, user engagement, and helps search engines understand content structure.

Adapted from: University of Manchester Academic Phrasebank (2023), Plain English Campaign, web content best practices

---

## Contents
- Previewing Content Structure
- Introducing a New Topic
- Referring Back
- Moving Between Sections
- Indicating Addition
- Indicating Contrast
- Indicating Similarity
- Indicating Cause and Effect
- Giving Examples
- Emphasising Key Points
- Providing Evidence (neutral attribution, expert quotes, supporting claims)
- Summarising Sections
- Concluding Content
- Question-Based Transitions
- List Introductions
- Hedging Language
- Best Practice Guidelines
- Transitions to Avoid (AI Tells)

## Previewing Content Structure

Use in long guides to orient readers. On marketing pages, start with the content instead.

- Here's what we'll cover...
- This guide walks you through...
- Below, you'll find...
- We'll start with X, then move to Y...
- First, let's look at...
- The sections below explain...

---

## Introducing a New Topic

- Regarding X,...
- Speaking of X,...
- Now let's talk about X.
- Another key factor is...
- X is worth exploring because...

---

## Referring Back

Use to connect ideas and reinforce key points:

- As mentioned earlier,...
- As we covered above,...
- Remember when we discussed X?
- Building on that point,...
- Going back to X,...
- Earlier, we explained that...

---

## Moving Between Sections

- Now let's look at...
- Next up:...
- Moving on to...
- With that covered, let's turn to...
- Now that you understand X, here's Y.
- That brings us to...

---

## Indicating Addition

- Also,...
- Plus,...
- On top of that,...
- What's more,...
- Another benefit is...
- Beyond that,...
- In addition,...
- There's also...

**Note:** Avoid "moreover" and "furthermore" in marketing copy. They read as AI-generated.

---

## Indicating Contrast

- However,...
- But,...
- That said,...
- On the flip side,...
- In contrast,...
- Unlike X, Y...
- While X is true, Y...
- Despite this,...

---

## Indicating Similarity

- Similarly,...
- Likewise,...
- In the same way,...
- Just like X, Y also...
- This mirrors...
- The same applies to...

---

## Indicating Cause and Effect

- So,...
- This means...
- As a result,...
- That's why...
- Because of this,...
- This leads to...

---

## Giving Examples

- For example,...
- For instance,...
- Here's an example:...
- Take X, for instance.
- Consider this:...
- A good example is...
- To illustrate,...
- Like when...
- Say you want to...

---

## Emphasising Key Points

- Here's the key takeaway:...
- The important thing is...
- What matters most is...
- Pay attention to...

---

## Providing Evidence

Use when citing sources, data, or expert opinions:

### Neutral attribution
- According to [Source],...
- [Source] reports that...
- Research shows that...
- Data from [Source] indicates...
- A study by [Source] found...

### Expert quotes
- As [Expert] puts it,...
- [Expert] explains,...
- In the words of [Expert],...
- [Expert] notes that...

### Supporting claims
- This is backed by...
- Evidence suggests...
- The numbers confirm...
- This aligns with findings from...

---

## Summarising Sections

- To recap,...
- In short,...
- Quick summary:...

---

## Concluding Content

- Wrapping up,...
- The bottom line is...
- Here's what to do next:...
- To sum up,...
- Final thoughts:...
- Ready to get started?...
- Now it's your turn.

**Note:** Avoid "In conclusion" at the start of a paragraph. It's overused and signals AI writing.

---

## Question-Based Transitions

Useful in long-form content for conversational tone and featured snippet optimization. Use them as headings or questions the reader would really ask, then answer with substance. Don't use them as a setup for your own punchline, and keep them out of landing-page copy (see [ai-tells.md](ai-tells.md)).

- So what does this mean for you?
- How do you actually do this?
- Wondering where to start?

---

## List Introductions

For numbered lists and step-by-step content:

- Here's how to do it:
- Follow these steps:
- The process is straightforward:
- Here's what you need to know:
- Key things to consider:
- The main factors are:

---

## Hedging Language

For claims that need qualification or aren't absolute:

- may, might, could
- tends to, generally
- often, usually, typically
- in most cases
- it appears that
- evidence suggests
- this can help

---

## Best Practice Guidelines

1. **Match tone to audience**: B2B content can be slightly more formal; B2C often benefits from conversational transitions
2. **Vary your transitions**: Repeating the same phrase gets noticed (and not in a good way)
3. **Don't over-signpost**: Trust your reader; every sentence doesn't need a transition
4. **Use for scannability**: Transitions at paragraph starts help skimmers navigate
5. **Keep it natural**: Read aloud; if it sounds forced, simplify
6. **Front-load key info**: Put the important word or phrase early in the transition

---

## Transitions to Avoid (AI Tells)

These phrases are overused in AI-generated content:

- "That being said,..."
- "It's worth noting that..."
- "At its core,..."
- "In today's digital landscape,..."
- "When it comes to the realm of..."
- "This begs the question..."
- "Let's delve into..."

See [ai-tells.md](ai-tells.md) for the full copy blacklist, including structural patterns like contrast reveals and negation lists.


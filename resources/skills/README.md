# Forma curated skills

This directory vendors **16 instruction skills** from pinned GitHub revisions. The application reads these local assets; normal startup and use do not download or execute remote packages.

| Upstream | Revision | Applicable license | Included skills |
| --- | --- | --- | --- |
| [anthropics/skills](https://github.com/anthropics/skills) | `ca45fc496a3436251f191354091d557da31c15b5` | Apache-2.0, from the frontend-design folder | frontend-design |
| [anthropics/knowledge-work-plugins](https://github.com/anthropics/knowledge-work-plugins) | `2574e29377c7173d0cecffef29a6ecbd7f8ccb5d` | Apache-2.0 | design-critique, ux-copy, write-spec, roadmap-update, research-synthesis, knowledge-synthesis, documentation, sql-queries, data-visualization |
| [obra/superpowers](https://github.com/obra/superpowers) | `2ce8aa15d05bd57213e6f746f953aafb7ded7a8b` | MIT | systematic-debugging, verification-before-completion |
| [coreyhaines31/marketingskills](https://github.com/coreyhaines31/marketingskills) | `88c79f6528a9347420e57ceb1fff9a60de651768` | MIT | copy-editing, copywriting, content-strategy, launch |

Each `curated-*` directory contains:

- `UPSTREAM.md`: the upstream `SKILL.md`, preserved as retrieved.
- `LICENSE.txt`: the applicable upstream license, preserved.
- `SOURCE.json`: repository, path, revision, checksums and adaptation notes.
- `SKILL.md`: the Forma-compatible instruction text.
- `references-upstream/`, where applicable: unmodified Markdown supporting material.

`catalog.json` records Chinese titles, summaries, categories, tags, examples, requirements and source hashes. Runtime initialization verifies original and adapted text hashes. User copies retain source metadata and license files.

## Adaptation

Forma adds a capability and language preface, uses a concise Chinese description, removes unavailable connector-file hints where present, and inlines the selected skill's Markdown reference files. Original methodology and supporting material remain available in the preserved files. These changes do not turn upstream CLI, browser, Figma, database, Python or plugin instructions into installed tools.

Skills supplement the current role and output protocol. They do not grant permissions or authorize external publishing, uploads or messages. Missing tools must be reported; the agent can produce a plan or code instead of claiming execution.

## Maintaining the catalog

Review the specific skill's license, inherited notices, dependencies and references before adding it. Retrieve individual files through GitHub at a full commit SHA; do not run upstream installation scripts. Retain original bytes, include required license material and record each adaptation. Update both SHA-256 values if deliberately changing the adapted content or upstream version. Run `npm run check`, including the catalog tests, and inspect the packaged application for these assets.

Do not import a complete repository merely because its root license looks suitable: individual skills may have different terms. Source-available document-processing skills and executable support packages are not part of this catalog.

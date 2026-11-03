# Third-party notices

Forma's own source code is licensed under [MIT](LICENSE). This does not change the licenses of dependencies, separately installed tools or model services.

## Direct runtime dependencies

Versions are pinned through `package-lock.json`. The license texts distributed with each package remain authoritative.

| Package | License | Project |
| --- | --- | --- |
| mammoth 1.9.1 | BSD-2-Clause | https://github.com/mwilliamson/mammoth.js |
| pdf-parse 1.1.1 | MIT | https://gitlab.com/autokent/pdf-parse |
| yaml 2.8.1 | ISC | https://github.com/eemeli/yaml |
| zod 4.3.6 | MIT | https://github.com/colinhacks/zod |

Collected runtime license files and upstream README declarations are included in [THIRD_PARTY_LICENSES.txt](THIRD_PARTY_LICENSES.txt), generated with `npm run licenses:generate`. This preserves what the locked packages ship; some upstream packages provide only a short license declaration. JSZip is used under its MIT option.

The application runs on Electron (MIT and bundled third-party components, including Chromium and Node.js). Preserve the Electron runtime's `LICENSE` and `LICENSES.chromium.html` files when distributing installers. Dependency directories included by the packager retain their own notices. Build tools and transitive packages also have separate licenses; this table is not a full software bill of materials. `npm ls --all` and the lockfile describe the installed dependency tree.

## Separately installed integrations

Codex, Claude Code and Magpie are not bundled by Forma. Their executables, credentials, subscriptions and service access are managed separately. Connecting to an API or reusing an existing sign-in does not confer access beyond the user's account or replace the original service terms.

## References and acknowledgment

- Tencent/WeKnora: documentation organization and knowledge-processing interactions.
- yetone/magpie: login reuse and routing concepts; an optional local gateway integration.
- nashsu/llm_wiki: personal knowledge-curation workflow inspiration.

No source code, documentation prose or screenshots from those projects are copied into Forma. Their names are used for attribution and compatibility descriptions; no affiliation or endorsement is implied. Forma's Wiki and job features are independent implementations, not vendored connectors to those projects.

The screenshots under `docs/images/readme` show Forma itself using verification data. The repository's icon assets are part of Forma.

## Curated skill materials

The instruction catalog under `resources/skills` redistributes adapted materials from `anthropics/skills` (frontend-design only, Apache-2.0), `anthropics/knowledge-work-plugins` (Apache-2.0), `obra/superpowers` (MIT), and `coreyhaines31/marketingskills` (MIT). These materials retain their original licenses; they are not relicensed as Forma-owned code. Each bundle includes the pinned original, license, source record and supporting Markdown where applicable. See [the catalog inventory](resources/skills/README.md) for exact revisions and changes. User copies retain upstream attribution.

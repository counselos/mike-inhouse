export const BUILTIN_WORKFLOWS: { id: string; title: string; prompt_md: string }[] = [
    {
        id: "builtin-nda-playbook-review",
        title: "NDA Review Against Playbook",
        prompt_md:
            "## NDA Review Against In-House Playbook\n\n" +
            "Review the uploaded NDA(s) against an in-house counsel playbook for SaaS companies. Flag every deviation from playbook standards and classify each as RED (block-and-renegotiate), AMBER (negotiate-if-possible), or GREEN (acceptable).\n\n" +
            "Deliver the review inline in chat as a structured memo. Do NOT call generate_docx unless the user explicitly asks for a Word version.\n\n" +
            "Structure your memo with these sections:\n\n" +
            "1. **Snapshot** — counterparty, date, mutual or one-way, term, governing law, jurisdiction. One short paragraph.\n\n" +
            "2. **Deviation Table** — every clause that diverges from the playbook below, with three columns: Clause Reference | Issue | Risk (RED/AMBER/GREEN). Include direct quotes from the NDA where helpful.\n\n" +
            "3. **Suggested Redlines** — for each RED and AMBER item, propose specific redline language the user can send back to the counterparty.\n\n" +
            "4. **Sign-off Recommendation** — one paragraph: \"Sign as drafted\" / \"Sign with the proposed redlines\" / \"Escalate before signing.\"\n\n" +
            "Playbook (apply unless the user provides their own):\n\n" +
            "- **Mutuality:** Default to mutual. One-way only if the user is the disclosing party and there is a clear commercial rationale.\n" +
            "- **Term of confidentiality:** 3-5 years from disclosure for ordinary business information; perpetual for trade secrets. Flag any \"perpetual\" obligation on ordinary information as RED.\n" +
            "- **Definition of Confidential Information:** Must require a written or marking-based notice for oral disclosures, or impose obligations only on information a reasonable recipient would treat as confidential. Flag \"all information disclosed\" with no carve-outs as AMBER.\n" +
            "- **Standard exclusions:** Must include public-domain, prior knowledge, independent development, third-party-rightful, and required-by-law carve-outs. Missing any is AMBER.\n" +
            "- **Permitted disclosures:** Must permit disclosure to professional advisors and to actual or potential investors / acquirers under similar confidentiality. Missing is AMBER.\n" +
            "- **Required-by-law:** Must allow disclosure required by law/regulation/court order, with prompt notice to the disclosing party where lawful. Missing the notice obligation is AMBER.\n" +
            "- **Residual knowledge:** Should preserve unaided memory of recipient personnel for non-trade-secret information. Absence is GREEN unless the counterparty is a competitor.\n" +
            "- **No license:** Must state that no IP license is granted. Missing is AMBER.\n" +
            "- **Return / destruction:** Must allow destruction (rather than return) at recipient's option, with backup-tape and regulatory-retention carve-outs. \"Return only\" is AMBER.\n" +
            "- **No solicitation:** Any non-solicit longer than 12 months from termination is RED. Any non-solicit covering customers is RED.\n" +
            "- **Non-compete:** Any non-compete obligation in an NDA is RED — escalate immediately.\n" +
            "- **Injunctive relief:** Acceptable to permit injunctive relief without bond. AMBER if it includes liquidated damages above EUR 50,000 / USD 50,000.\n" +
            "- **Governing law / jurisdiction:** Acceptable list — England & Wales, Ireland, Netherlands, Delaware, New York, California. Anything else is AMBER and warrants a venue-risk note.\n" +
            "- **Term of agreement:** Should be 1-2 years for active disclosures. Anything longer than 5 years is AMBER.\n" +
            "- **Onward transfers / affiliates:** Must explicitly permit sharing with affiliates and contractors under similar confidentiality terms. Missing is AMBER.\n\n" +
            "Before finalizing, double-check that every clause flagged in section 2 has a corresponding redline in section 3 and that the sign-off in section 4 reflects the highest-severity item in section 2.",
    },
    {
        id: "builtin-dpa-art28-review",
        title: "DPA Review (GDPR Art. 28)",
        prompt_md:
            "## DPA Review — GDPR Article 28\n\n" +
            "Review the uploaded Data Processing Agreement (DPA) against the requirements of GDPR Article 28(3)(a)–(h) and standard EU/UK data protection expectations. The review is from the perspective of a controller engaging a processor.\n\n" +
            "You MUST use the generate_docx tool to produce the review as a downloadable Word document. " +
            "You MUST pass landscape: true to the generate_docx tool — the document must be in landscape orientation.\n\n" +
            "Structure the document as a sequence of section objects passed to generate_docx. For each section below, set the `heading` field to the heading text shown in quotes (do NOT include the word \"Heading:\" in the heading text). For sections that contain a table, populate the section's `table` field; for sections that contain only paragraphs, populate the section's `content` field.\n\n" +
            "1. Section heading: \"Snapshot\" — content (paragraph, no table): parties, effective date, underlying agreement, role allocation (who is controller / processor / joint), whether the user is the controller or processor.\n\n" +
            "2. Section heading: \"Article 28 Compliance Matrix\" — table with exactly four columns:\n" +
            "   - Requirement (one of the eight Article 28(3) sub-paragraphs, written out)\n" +
            "   - DPA Reference (the clause number in the uploaded DPA)\n" +
            "   - Coverage (Yes / Partial / No)\n" +
            "   - Notes (one to two sentences — what is missing or onerous)\n\n" +
            "The eight rows in this table, in order:\n" +
            "- 28(3)(a) — Process only on documented controller instructions, including transfers\n" +
            "- 28(3)(b) — Confidentiality undertakings from authorised personnel\n" +
            "- 28(3)(c) — Article 32 security measures\n" +
            "- 28(3)(d) — Sub-processor controls (general or specific authorisation, prior notice, opportunity to object)\n" +
            "- 28(3)(e) — Assistance with data subject rights\n" +
            "- 28(3)(f) — Assistance with Articles 32–36 obligations (security, breach notification, DPIA, prior consultation)\n" +
            "- 28(3)(g) — Deletion or return of personal data on termination\n" +
            "- 28(3)(h) — Information and audit rights\n\n" +
            "3. Section heading: \"International Transfer Mechanism\" — table with three columns: Transfer (origin → destination) | Mechanism (SCC module, IDTA, BCR, adequacy, derogation) | Adequacy of Mechanism (Adequate / Insufficient / Unclear). Include a separate row for each onward transfer to a sub-processor in a third country. If no third-country transfers are identified, write \"No third-country transfers identified\" as the section's content paragraph and omit the table.\n\n" +
            "4. Section heading: \"Sub-processor List\" — table with three columns: Sub-processor | Service | Location. Pull the list from any annex or schedule referenced in the DPA. If the DPA permits sub-processors but does not list them, include a single row with name \"Sub-processors permitted but not enumerated\" and empty Service/Location.\n\n" +
            "5. Section heading: \"Risk Tier and Action\" — content (paragraph, no table). Classify the DPA as ACCEPT (sign as drafted), NEGOTIATE (sign only after specific changes), or REJECT (do not sign). State the top three issues to negotiate, in priority order, with proposed clause language for each.\n\n" +
            "Headers must match exactly. Every row must have the same number of cells as the headers. No stray markdown or newlines in any cell.",
    },
    {
        id: "builtin-ai-vendor-review",
        title: "AI Vendor Addendum Review (EU AI Act)",
        prompt_md:
            "## AI Vendor Addendum Review — EU AI Act and GPAI\n\n" +
            "Review the uploaded AI vendor addendum, terms of service, or model-use agreement from the perspective of an enterprise customer in the EU/UK. Identify obligations and risks under Regulation (EU) 2024/1689 (AI Act), with particular focus on Articles 50 (transparency) and 53–55 (general-purpose AI / GPAI providers and downstream deployers).\n\n" +
            "Deliver the review inline as a structured memo. Do NOT call generate_docx unless the user explicitly asks.\n\n" +
            "Structure your memo with these sections:\n\n" +
            "1. **Snapshot** — vendor, product name, model(s) referenced, addendum date, role allocation (provider / deployer / downstream provider under AI Act), whether the vendor's model is GPAI, whether it has systemic risk under Art. 51.\n\n" +
            "2. **Article 50 Transparency Obligations** — a table with three columns: Obligation | Allocation in Addendum (Customer / Vendor / Silent) | Risk (RED / AMBER / GREEN). Cover, in order:\n" +
            "   - Disclosure to natural persons that they are interacting with an AI system (Art. 50(1))\n" +
            "   - Marking of synthetic audio / image / video / text content as artificially generated (Art. 50(2))\n" +
            "   - Disclosure of emotion-recognition or biometric-categorisation use (Art. 50(3))\n" +
            "   - Disclosure that text is AI-generated when published to inform the public on matters of public interest (Art. 50(4))\n\n" +
            "3. **GPAI / Foundation Model Clauses** — a table with three columns: Issue | Addendum Position | Risk (RED / AMBER / GREEN). Cover, in order:\n" +
            "   - Training data — does the vendor warrant compliance with Art. 53(1)(c) on copyright and EU law generally?\n" +
            "   - Training data summary — does the vendor commit to publish or share the Art. 53(1)(d) sufficiently detailed summary?\n" +
            "   - Model documentation — does the vendor provide technical documentation sufficient for the customer to meet downstream AI Act obligations (Art. 53(1)(b))?\n" +
            "   - Systemic risk — if Art. 51 applies, does the vendor warrant compliance with Art. 55 obligations (model evaluations, adversarial testing, incident reporting)?\n" +
            "   - Incident reporting — does the vendor commit to notify the customer of serious incidents within a defined period?\n" +
            "   - Model changes — does the vendor commit to notify the customer of material model updates that affect performance or risk profile?\n\n" +
            "4. **Customer-Facing Risk Allocation** — a table with three columns: Risk | Allocation | Comment. Cover, in order:\n" +
            "   - IP infringement of training data outputs (indemnity / cap / carve-out)\n" +
            "   - Hallucinations / inaccurate output (disclaimer / warranty / liability cap)\n" +
            "   - Customer data used to train future models (opt-out / contractual prohibition / silence)\n" +
            "   - Customer prompts and outputs retained by vendor (retention period / deletion / contractual prohibition on training)\n" +
            "   - Sub-processors and model hosting (location, transfer mechanism)\n" +
            "   - Audit and inspection rights (none / questionnaire only / on-site)\n\n" +
            "5. **Sign-off Recommendation** — one paragraph. Classify as ACCEPT, NEGOTIATE, or REJECT. List the top three changes to push back on, with proposed clause language for each.\n\n" +
            "Before finalizing, double-check that every RED-flagged item in sections 2-4 appears in section 5 with proposed redline language.",
    },
    {
        id: "builtin-msa-redflag",
        title: "MSA / Order Form Red-Flag Review",
        prompt_md:
            "## MSA / SaaS Order Form Red-Flag Review\n\n" +
            "Review the uploaded master services agreement or SaaS order form and produce a plain-English risk memo for the business owner who needs to sign it. Assume the reader is a non-lawyer. Use plain language. Avoid Latin.\n\n" +
            "Deliver the memo inline. Do NOT call generate_docx unless the user explicitly asks.\n\n" +
            "Structure the memo with these sections:\n\n" +
            "1. **One-Liner** — one sentence: what the contract is, who the counterparty is, the total value if stated, and the term.\n\n" +
            "2. **Traffic-Light Summary** — a table with three columns: Topic | Status (Red / Amber / Green) | Plain-English Comment. Cover every topic below in this order, even if Green. Use Green for \"no issue,\" Amber for \"negotiate if you can,\" Red for \"do not sign without changing this.\"\n" +
            "   - Term and auto-renewal (length, notice required to terminate, automatic price escalators)\n" +
            "   - Price and price-escalation cap (annual cap, indexation, true-up mechanism)\n" +
            "   - Payment terms (net days, late-payment interest, audit rights against the customer)\n" +
            "   - Service levels (uptime commitment, credits as sole remedy, minimum service standards)\n" +
            "   - Liability cap (multiplier of fees paid, mutual or one-sided, super-cap exceptions)\n" +
            "   - Carve-outs from liability cap (data breach, IP infringement, confidentiality, gross negligence, fraud)\n" +
            "   - Indemnities (IP, data, third-party claims — direction and scope)\n" +
            "   - Termination rights (for cause, for convenience, for change of control, for insolvency)\n" +
            "   - Data ownership and exit (return of customer data, format, retention period after exit, deletion certificate)\n" +
            "   - Data protection (GDPR DPA referenced, transfer mechanism, sub-processor list)\n" +
            "   - Security (certifications referenced, audit rights, breach notification window)\n" +
            "   - Governing law and jurisdiction (acceptable for the customer)\n" +
            "   - Assignment (vendor's right to assign, customer's right to assign on M&A)\n" +
            "   - Acceptable use restrictions (limits on customer's permitted users, geographies, use cases)\n\n" +
            "3. **Top Three Things to Negotiate** — three numbered items, ordered by impact. For each: the issue in one sentence, the proposed change in one sentence, and the fallback if the vendor refuses.\n\n" +
            "4. **Sign-off Recommendation** — one short paragraph: \"Sign as drafted\" / \"Sign once items 1-N are fixed\" / \"Do not sign — escalate to legal leadership.\"\n\n" +
            "Before finalizing, double-check that the table covers every topic listed (no skips), that every Red row appears in section 3 with a proposed redline, and that section 4 reflects the highest-severity row in section 2.",
    },
    {
        id: "builtin-vendor-intake",
        title: "Vendor Intake Triage",
        prompt_md:
            "## Vendor Intake Triage\n\n" +
            "You are receiving a new vendor request from a business owner. Triage the request and produce an intake memo for the in-house legal team. The user will paste a contract (DPA, MSA, order form, NDA, or vendor proposal) and a short business description. If the business description is missing, ask one targeted clarifying question before proceeding.\n\n" +
            "Deliver the memo inline. Do NOT call generate_docx unless the user explicitly asks.\n\n" +
            "Structure the memo with these sections:\n\n" +
            "1. **Request Summary** — three sentences. What the business owner wants to do, with whom, why.\n\n" +
            "2. **Risk Tier** — classify as TIER 1 / TIER 2 / TIER 3 / TIER 4 using these definitions:\n" +
            "   - **TIER 1 — Critical.** Personal data of customers, employees, or candidates is processed; OR financial data; OR the vendor will have material access to source code or production systems; OR the use case is a high-risk AI system under AI Act Annex III; OR contract value exceeds EUR 250,000 / GBP 250,000 annually.\n" +
            "   - **TIER 2 — Standard.** Limited personal data (business contact details only); standard SaaS use case; contract value EUR 25,000 - 250,000 annually; uses an AI model that is not high-risk under Annex III.\n" +
            "   - **TIER 3 — Light-touch.** No personal data beyond user account credentials; commodity SaaS; contract value below EUR 25,000 annually; standard terms with no material amendments.\n" +
            "   - **TIER 4 — Self-serve.** Free tools or trials; no personal data; no integration with production systems; the business owner can sign without legal review (note any guardrails).\n\n" +
            "3. **Applicable Regulations Checklist** — a table with three columns: Regulation | Applies? (Yes / No / Possibly) | What it triggers. Cover in order:\n" +
            "   - GDPR (any personal data of EU/UK individuals)\n" +
            "   - EU AI Act (any AI system deployed; Annex III if high-risk)\n" +
            "   - DORA (financial services entity engaging an ICT third party)\n" +
            "   - NIS2 (essential or important entity engaging a critical supplier)\n" +
            "   - EU/UK transfer mechanism required (data leaving the EEA / UK)\n" +
            "   - Sectoral rules — flag if FCA / DNB / BaFin / regulated activity (assess the business description)\n\n" +
            "4. **Required Approvers** — a numbered list. Always start with: \"Legal — required\" plus the named in-house counsel (assume \"In-house Counsel\" if not specified). Then add any of the following that apply:\n" +
            "   - DPO / Privacy — if any personal data\n" +
            "   - InfoSec — if access to production systems, customer data, or source code\n" +
            "   - Finance — if contract value exceeds the budget owner's authority (assume EUR 50,000)\n" +
            "   - Procurement — if contract value exceeds EUR 100,000 or if a competitive process is required\n" +
            "   - Executive sponsor — for TIER 1 only\n\n" +
            "5. **Documents Required from Vendor** — a numbered list. For each, state why it is needed in one short sentence. Include only those applicable based on the tier and regulations identified.\n\n" +
            "6. **Next Action** — one short paragraph stating who in legal picks this up, the SLA (TIER 1: 5 business days; TIER 2: 10 business days; TIER 3: 20 business days; TIER 4: same-day async approval), and what the business owner needs to do in the meantime.\n\n" +
            "Before finalizing, double-check that the tier in section 2 is consistent with the regulations in section 3 and the approvers in section 4.",
    },
    {
        id: "builtin-cp-checklist",
        title: "Generate CP Checklist",
        prompt_md:
            "## Generate Conditions Precedent Checklist\n\n" +
            "Review the uploaded credit agreement or financing document and generate a comprehensive " +
            "Conditions Precedent (CP) checklist.\n\n" +
            "You MUST use the generate_docx tool to produce the checklist as a downloadable Word document. " +
            "You MUST pass landscape: true to the generate_docx tool — the document must be in landscape orientation. " +
            "Do not display the checklist inline — generate the .docx file and provide the download link.\n\n" +
            "Structure the document as follows:\n" +
            "- For each category of conditions (e.g. Corporate, Financial, Legal, Security), add a section with a heading\n" +
            "- Under each category heading, include a table with exactly these four columns in this order:\n" +
            "  1. Index — sequential number within the category (1, 2, 3…)\n" +
            "  2. Clause Number — the clause or schedule reference from the agreement\n" +
            "  3. Clause — a concise description of the condition precedent\n" +
            "  4. Status — leave blank (empty string) for the user to fill in\n\n" +
            "Use the table field in the section object (not content) for each category's rows.\n\n" +
            "Before finalizing, double-check that every table is formatted correctly: each table must have exactly the four columns above in the same order, headers must match exactly (Index, Clause Number, Clause, Status), every row must have the same number of cells as the headers, the Index column must be sequential starting from 1 within each category, and no cells should contain stray markdown, newlines, or placeholder text (use an empty string for Status).",
    },
    {
        id: "builtin-credit-summary",
        title: "Credit Agreement Summary",
        prompt_md:
            "## Credit Agreement Summary\n\n" +
            "Review the uploaded credit agreement and produce a comprehensive legal summary covering the following topics. " +
            "For each section, identify the key provisions, quote the relevant clause or schedule references, and flag any unusual, onerous, or non-market terms.\n\n" +
            "1. **Lenders** — All lenders or members of the lender syndicate, including their full legal name and role (e.g. mandated lead arranger, original lender, agent bank)\n" +
            "2. **Borrowers** — All borrowers, including their full legal name and jurisdiction of incorporation\n" +
            "3. **Guarantors** — All guarantors, including their full legal name and the scope of their guarantee obligation\n" +
            "4. **Other Parties** — Any other material parties (e.g. facility agent, security agent, hedge counterparties, issuing bank) and their roles\n" +
            "5. **Date of Agreement** — Date of the credit agreement\n" +
            "6. **Facilities** — Each facility available (e.g. Revolving Credit Facility, Term Loan A, Term Loan B, Term Loan C), the facility type, tranche name, and any key structural features\n" +
            "7. **Amount** — Total committed amount across all facilities, the currency, and breakdown by tranche if applicable\n" +
            "8. **Purpose** — Stated purpose for which borrowings may be used and any restrictions on use of proceeds\n" +
            "9. **Interest** — Applicable reference rate (e.g. SOFR, EURIBOR, base rate), the margin, any margin ratchet mechanism, and how interest periods are structured\n" +
            "10. **Commitment Fee** — Commitment or utilisation fees, the applicable rate, how they are calculated, and the basis (e.g. undrawn commitment, average utilisation)\n" +
            "11. **Repayment Schedule** — Repayment profile for each facility, whether by scheduled instalments or bullet repayment, and the repayment dates and amounts\n" +
            "12. **Maturity** — Final maturity date for each facility\n" +
            "13. **Security** — Each class of security granted or required (e.g. share pledges, fixed and floating charges, real estate mortgages, account pledges) and the assets or entities over which security is taken\n" +
            "14. **Guarantees** — Guarantee obligations, the guarantors, the scope of the guarantee, and any limitations (e.g. up-stream guarantee limitations, guarantor coverage test)\n" +
            "15. **Financial Covenants** — Each financial covenant, the metric (e.g. leverage ratio, interest cover, cashflow cover), the applicable test, testing frequency, and any equity cure rights\n" +
            "16. **Events of Default** — Each event of default, noting any grace periods, materiality thresholds, or cross-default provisions\n" +
            "17. **Assignment** — Restrictions or permissions on assignment or transfer (e.g. white/blacklists, borrower consent for lender transfers; restrictions on borrower assignment)\n" +
            "18. **Change of Control** — What constitutes a change of control, what obligations it triggers (e.g. mandatory prepayment, cancellation, lender consent), and any cure period\n" +
            "19. **Prepayment Fee** — Any prepayment fees, make-whole premiums, or soft-call protections, the applicable fee, the period during which it applies, and any exceptions (e.g. prepayment from insurance proceeds or asset disposals)\n" +
            "20. **Governing Law** — Governing law of the agreement\n" +
            "21. **Dispute Resolution** — Whether disputes go to litigation or arbitration, the chosen forum or seat, and any submission to jurisdiction provisions\n\n" +
            "Deliver the summary inline in your chat response — do NOT call generate_docx. Only produce a downloadable Word document if the user explicitly asks for one.",
    },
    {
        id: "builtin-sha-summary",
        title: "Shareholder Agreement Summary",
        prompt_md:
            "## Shareholder Agreement Summary\n\n" +
            "Review the uploaded shareholder agreement and produce a comprehensive legal summary covering the following topics. " +
            "For each section, identify the key provisions, quote the relevant clause references, and flag any unusual, onerous, or market-standard deviations.\n\n" +
            "1. **Parties & Shareholdings** — Full legal names, roles, share classes held, and percentage interests (on a fully diluted basis if stated)\n" +
            "2. **Share Classes & Rights** — For each class: voting rights, dividend rights, liquidation preference, conversion or redemption features\n" +
            "3. **Board Composition & Governance** — Board size, director appointment rights (and the shareholding thresholds required to maintain them), quorum, and casting vote\n" +
            "4. **Reserved Matters** — Decisions requiring a special majority, unanimity, or a specific shareholder's consent; note the threshold and whose consent is required for each\n" +
            "5. **Pre-emption on New Shares** — Who holds pre-emption rights, procedure, timeline, and any carve-outs (e.g. employee option schemes)\n" +
            "6. **Transfer Restrictions** — Lock-up periods, prohibited transfers, permitted transfers (e.g. to affiliates), and any board or shareholder approval requirements\n" +
            "7. **Right of First Refusal / Pre-emption on Transfer** — Trigger, procedure, pricing mechanics, and any exceptions\n" +
            "8. **Drag-Along Rights** — Who holds the right, threshold to trigger, conditions (e.g. minimum price, independent valuation), and minority protections\n" +
            "9. **Tag-Along Rights** — Who holds the right, triggering threshold, exercise procedure, and price terms\n" +
            "10. **Anti-Dilution Protections** — Type (full ratchet, weighted average), trigger events, calculation mechanics, and exceptions\n" +
            "11. **Dividend Policy** — Any obligation or target to pay dividends, preferential dividend rights, and restrictions on distributions\n" +
            "12. **Exit & Liquidity** — Agreed exit routes (trade sale, IPO, drag sale), timelines, and liquidation preferences on exit\n" +
            "13. **Deadlock** — Deadlock definition, escalation and resolution mechanisms (e.g. Russian roulette, put/call options), and consequences if unresolved\n" +
            "14. **Non-Compete & Non-Solicitation** — Who is bound, scope of activities and geography, duration, and carve-outs\n" +
            "15. **Governing Law & Dispute Resolution** — Applicable law, forum, arbitration or litigation, and any mandatory escalation steps\n\n" +
            "Generate the summary as a downloadable Word document.",
    },
];

# census-login-kt

BDD test suite for the **2026 Census Test** respondent login flow, covering the
"enter a 12-digit Census ID" screen at `access.uat.dice.census.gov`.

Built with **Cucumber.js** + **Playwright** + **TypeScript**.

## Stack

| Tool | Role |
|---|---|
| [Cucumber.js](https://github.com/cucumber/cucumber-js) | Runs Gherkin `.feature` files against TypeScript step definitions |
| [Playwright](https://playwright.dev/) | Drives a real (headed) Chromium browser |
| TypeScript + `ts-node` | Steps/pages/config are written in TS and run directly, no build step |
| `dotenv` | Loads test data from `.env.uat` into `process.env` |

## Project layout

```
census-login-kt/
├── .env.uat                                   # test data: URL, Census IDs, warning text
├── cucumber.json                               # wires everything together
├── resources/
│   └── gov.census.isr.feature/
│       └── login.feature                       # the spec, in plain English
└── src/
    ├── gov.census.isr.pages/
    │   └── loginPage.ts                         # Page Object — locators + actions + assertions
    ├── gov.census.isr.steps/
    │   └── loginSteps.ts                        # step definitions — glue between feature and page
    └── gov.census.isr.utils/
        ├── browserSetup.ts                      # Before/After hooks — launches/closes the browser
        ├── configReader.ts                      # reads .env.uat, one method per value
        └── customWorld.ts                       # per-scenario state container (Cucumber World)
```

The `gov.census.isr.*` folder naming follows a reverse-DNS convention (mirroring the
Java package style used elsewhere in the Census test tooling), not a TypeScript default.

## How it fits together

```
login.feature  →  loginSteps.ts  →  loginPage.ts  →  configReader.ts  →  .env.uat
   (spec)          (glue)            (page object)     (config reader)    (data)
```

1. **`login.feature`** describes the two scenarios (valid ID → landing page, invalid ID →
   warning) in Gherkin. Cucumber matches each line to a step definition by text.
2. **`browserSetup.ts`** runs automatically before/after every scenario — launches a headed
   Chromium browser and stores it on `this` (the scenario's `CustomWorld` instance), then
   closes it afterward.
3. **`loginSteps.ts`** implements each Given/When/Then. It never touches Playwright locators
   directly — it only calls methods on `loginPage`.
4. **`loginPage.ts`** is the Page Object: it owns every locator (all `private`) and exposes
   actions (`enterCensusId`, `clickLogin`, `goto`) and assertions
   (`assertQuestionnaireLandingVisible`, `assertWarningVisible`, `assertWarningMessage`).
   If a selector ever changes, this is the only file that needs to change.
5. **`configReader.ts`** is the single place that knows the `.env.uat` key names. Every other
   file asks it for a value (`ConfigReader.getBaseUrl()`, `.getValidCensusId()`, etc.) instead
   of hardcoding strings.
6. **`.env.uat`** holds the actual values. It's committed to the repo (not gitignored) because
   it's UAT test data, not secrets — update a Census ID or point the suite at a different URL
   here, with no code change required.

## Why a `CustomWorld`

Cucumber creates a fresh **World** instance per scenario and binds it as `this` inside every
step (using `function`, not arrow functions, so `this` binds correctly). `CustomWorld`
(`customWorld.ts`) extends that World to hold `browser`, `page`, and `loginPage`.

Before this was added, the browser `page` lived in a single module-level `let page` shared by
every scenario. `CustomWorld` fixes that:

- Each scenario gets its **own** `page`/`loginPage` — no shared mutable state between scenarios.
- It's safe to run scenarios in **parallel** later; a shared module-level variable is not.
- State lives in one typed place (`this.page`, `this.loginPage`) instead of scattered imports.

## Setup

```bash
npm install
npx playwright install chromium   # downloads the browser binary; one-time
```

## Configuration (`.env.uat`)

```
BASE_URL=https://access.uat.dice.census.gov/gqisr/authcode
CENSUS_ID_VALID=123456789012
CENSUS_ID_INVALID=000000000000
WARNING_MESSAGE=Please enter a valid 12-digit Census ID
```

`ConfigReader` throws a clear error naming the missing key if any of these aren't set, so a
misconfigured environment fails fast instead of silently using `undefined`.

## Running the tests

```bash
npm test
```

Runs headed (a visible Chromium window opens) against the live UAT site defined in
`.env.uat`. This requires network access to `access.uat.dice.census.gov`.

## Known gaps / TODOs

These are flagged inline in the code and should be verified against the real UAT page before
relying on this suite for CI:

- **`loginPage.ts`** — `authCodeInput` is assumed to be the accessible name of the Census ID
  field; `page.getByLabel('Census ID (12-digit)')` may be more reliable. `#component54` (the
  questionnaire-landing locator) is a placeholder — confirm whether the real page uses an ID,
  class, or `data-testid`.
- **`.env.uat`** — `WARNING_MESSAGE` is a placeholder string. Update it once someone confirms
  the exact warning text shown on the live UAT page, or the invalid-ID scenario's message
  assertion will fail.
- Tests run **headed** by default (`browserSetup.ts`, `headless: false`) — useful while
  selectors are unverified, but should switch to headless once the suite is stable, for CI.

## Adding a new scenario

1. Add the Gherkin scenario to `login.feature`.
2. Add any new step text to `loginSteps.ts`, calling a method on `loginPage` — don't reach for
   `page.locator(...)` directly in a step.
3. If the step needs a new interaction or assertion, add a method to `loginPage.ts` rather than
   exposing a new locator.
4. If the step needs new test data, add a key to `.env.uat` and a matching getter to
   `configReader.ts`.

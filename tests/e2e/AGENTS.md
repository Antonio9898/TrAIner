# E2E testing rules

- Use `seed.spec.ts` as the reference; one independent scenario per spec file.
- Use `getByRole`, `getByLabel`, or `getByText`; use `getByTestId` only if accessibility attributes are ambiguous. No CSS/XPath/DOM structure locators.
- Wait for observable state with Playwright assertions; never use `waitForTimeout`.
- Name each test after a risk and assert the user-visible outcome.
- Keep routing, authentication and database boundaries real. Mock only external services when necessary.
- For authenticated scenarios, prepare `storageState` outside individual tests. Never commit session files.
- Tests creating data must use unique identifiers and clean up even after failure.
- Review assertions, selectors, isolation, waits and cleanup; verify the test fails when its protected behavior breaks.

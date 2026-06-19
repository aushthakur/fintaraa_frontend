# TODO

- [x] Implement Apply Now behavior in fintaraa-website navbar
  - [x] Apply Now (desktop + mobile) now routes logged-out users to /login?ref=apply-now and logged-in users to /products
  - [ ] If logged in: redirect to /products (or current intent target) (spec says go to products pages)
  - [ ] If not logged in: redirect to /login with referrer (preserve from which apply button was clicked)
  - [ ] If logged in and user clicks other apply buttons (not Apply Now): go to respective form only (needs mapping)
  - [x] If user opens /login with no referrer while logged in: redirect to dashboard
  - [ ] Ensure login flow sends user back to referrer target after successful login/create account
  - [x] Update /login route to read redirect/referrer query and pass into LoginPage
  - [ ] If needed, update login flow to store pending referrer across steps and redirect to it after completion
- [ ] Add/adjust helper in src/lib/loginRedirect.ts (already has redirect param) to support `ref`/`referrer`
- [ ] Test flows manually (Apply Now → login → back; logged in → Apply Now → products; logged in → /login → dashboard)

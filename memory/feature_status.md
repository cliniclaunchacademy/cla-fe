---
name: Feature Implementation Status
description: Full audit of Phase 1 & Phase 2 LMS features vs what is implemented (audited 2026-04-07)
type: project
---

Audited against LMS_Feature_Scope_v3.docx on 2026-04-07. ~85-90% of Phase 1 complete.

**Why:** Track remaining work so future sessions can pick up where we left off.
**How to apply:** Reference this before starting any new feature work to avoid duplicating effort.

---

## REMAINING WORK

### Phase 1 — Not Done / Partial (2026-04-07 session closed these out)

#### Lab Partners (Student Side)
- [ ] Embedded application form — clicking "Complete Application" should open an iframe embed with the lab's application form; submitting creates a pending application record. Currently lab cards only have external portal links, no iframe form.
- [ ] Rejection reason message — when admin rejects, student sees the reason on their lab card alongside Re-Apply button. Currently no rejection reason display.
- [ ] Application status-driven CTA — the full 5-state CTA (Complete Application → Application Under Review → View Portal → Re-Apply + Coming Soon/Maintenance locked states). Verify all states are wired to real application status from backend.

#### Admin — Lab Partners & Applications (ENTIRE MODULE MISSING)
- [ ] Create / Edit / Delete lab cards — admin UI to manage lab partners (name, logo, subheading, portal URL, application iframe embed, status: Live/Coming Soon/Maintenance)
- [ ] Review and update application status — admin reviews individual applications, sets Pending/Verified/Rejected, optionally adds rejection reason message
- [ ] Filter and search applications — filter by lab name, status, date range; search by student name or email; paginated results

#### Admin Settings
- [ ] Support Email field — editable support email displayed to students when they need help (Discord URL and Maintenance Mode are done; support email is missing)

#### Recordings
- [ ] Search by title within a category — verify or implement basic title search on the recordings page (category filtering exists, title search may be missing)

---

### Phase 2 — Not Done

| Priority | Module | Feature |
|---|---|---|
| 1 | Community | Community page (student) + admin link management |
| 2 | Admin Lab Apps | Bulk approve / reject applications |
| 3 | Admin Instructors | Social media links (LinkedIn, Instagram, Twitter/X, Website) |

### Phase 2 — Already Implemented

| Module | Feature | Notes |
|---|---|---|
| Admin Dashboard | Per-Student Overview drill-down | `/admin/users/[userId]/page.jsx` |
| Admin Dashboard | At-Risk Learners table | In admin dashboard page |
| Admin Dashboard | Analytics charts (weekly signups + popular courses) | Recharts BarChart |
| Admin Dashboard | Activity Heatmap | 7×24 grid |
| Admin Dashboard | Course Completion Rate stat card | In stat cards row |
| Student Dashboard | Watch Time stat card | Shows "Watch Events" (totalWatchEvents) |
| Admin Courses | Lesson Coming Soon per-lesson | ✅ Implemented 2026-04-07 — toggle + releaseDate in curriculum editor; locked state in student sidebar |

---

## FULLY IMPLEMENTED (Phase 1)

- Authentication: Login, Forgot Password, Role Redirect
- Student Dashboard: Welcome Banner, 4 Stat Cards, Continue Learning, Recent Activity, Community Discord Banner
- Courses & Lessons: All 6 features (list, detail, video, sidebar nav, mark complete, flag issues)
- Resources: Resources page, Lesson resources panel
- Recordings: Category list, Recording viewer (search/filter partial)
- Lab Partners: Lab cards display, View Portal redirect (application flow incomplete)
- Student Settings: Edit name/username, Upload profile photo
- Notifications: Bell (student), Send notification (admin)
- Admin Dashboard: 3 stat cards, Recently Joined table, Notification history
- Admin Users: All 6 features
- Admin Courses: All Phase 1 features (CRUD, modules/lessons, coming soon, publish, reorder)
- Admin Instructors: CRUD, photo upload, assign to course
- Admin Recordings: All 4 features
- Admin Banners: All 3 features
- Admin Settings: Discord URL, Maintenance Mode

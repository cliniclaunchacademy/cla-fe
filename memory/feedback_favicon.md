---
name: Favicon setup with client layout
description: How to set favicon when root layout.js uses "use client"
type: feedback
---

When `app/layout.js` uses `"use client"`, Next.js cannot process `app/favicon.ico` automatically. Fix: add `<link rel="icon" href="/filename.ico" />` inside a `<head>` tag in the layout JSX, pointing to the file in `/public/`.

**Why:** `"use client"` blocks Next.js special file handling for favicon.
**How to apply:** Any time favicon needs to be set in this project, use the manual `<link>` tag approach, not the `app/favicon.ico` convention.

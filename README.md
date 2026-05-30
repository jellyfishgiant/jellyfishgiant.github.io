# the rockshow — site guide

My personal site, live at **patasonic.com**. It's a static site hosted for free on
GitHub Pages and built with Jekyll. This file is here to remind me how everything
works when I've inevitably forgotten.

---

## How to update the site (the normal workflow)

Every change runs through Claude. I describe what I want, Claude hands back a zip,
I drop it into the repo and push. Start to finish:

1. **Open Claude** and start a new conversation. Tell it I'm working on my GitHub
   Pages site (the rockshow / patasonic.com) and describe the change I want. It
   helps to mention it's a Jekyll site so it has the context.

2. **Claude makes the change** and gives me a **zip file** to download.

3. **Download and unzip** the file (double-click it on the Mac).

4. **Copy the unzipped files into my local repo folder** (`jellyfishgiant.github.io`).
   When the Mac asks, choose **"Replace"** / **"Merge"** — this drops the new files
   on top of the old ones. It won't delete anything that isn't in the zip.

5. **Open GitHub Desktop.** The changed files show up automatically in the left panel.

6. **Type a short commit message** (e.g. "update blog styling") and click
   **"Commit to main."**

7. **Click "Push origin"** at the top.

8. **Wait about a minute.** The site rebuilds itself and the changes go live at
   patasonic.com.

---

## If something looks broken after pushing

1. Go to **github.com -> my repo -> the "Actions" tab.**
2. Find the most recent run:
   - **Green check** = built fine. Give it a minute, then hard-refresh the site.
   - **Red X** = the build failed. Click into it, copy the error text, and paste it
     to Claude — that error says exactly what's wrong.

---

## What's where (site structure)

| File / folder        | What it is                                               |
|----------------------|----------------------------------------------------------|
| `index.html`         | The home page (my photography)                           |
| `moodboard/`         | The mood board page                                      |
| `blog/`              | The blog listing page                                    |
| `info/`              | The info / about page                                    |
| `_posts/`            | All blog articles live here as `.md` files               |
| `_layouts/`          | Page templates (shared header, nav, post wrapper)        |
| `styles.css`         | All the styling for the whole site                       |
| `script.js`          | Loads the photos, shuffling, blog scroll behavior        |
| `photos/`            | Home page photos go here                                 |
| `images/`            | Mood board photos + blog post images                     |
| `_config.yml`        | Jekyll settings (don't usually need to touch this)       |
| `CNAME`              | Connects the site to the patasonic.com domain            |

---

## Common things I'll want to do

### Add a new blog post

I can do this myself without Claude:

1. In `_posts/`, make a new file named like `2026-07-15-my-post-title.md`
   (the date in the filename controls the post's date and order).
2. At the top of the file, paste this and fill it in:

   ```
   ---
   layout: post
   title: "My Post Title"
   date: 2026-07-15
   category: thought
   ---

   My writing goes here. Just normal paragraphs.
   ```

   - `category` is either `story` or `thought` (controls the little tag label).
3. To add an image to a post, upload the image into the `images/blog/` folder, then
   reference it like this (the username/repo below is already correct):

   ```
   ![description](https://raw.githubusercontent.com/jellyfishgiant/jellyfishgiant.github.io/main/images/blog/my-photo.jpg)
   ```
4. Commit and push in GitHub Desktop.

### Add / change photos on the HOME page

1. Drop the photos into the `photos/` folder.
2. **Name them with number prefixes to control the order**, e.g. `01-sunset.jpg`,
   `02-portrait.jpg`, `03-beach.jpg`. They display in that order. (No need for
   leading zeros past 9 — `2-x.jpg` correctly sorts before `10-x.jpg`.)
3. Commit and push.

### Add photos to the MOOD BOARD

1. Drop the photos straight into the `images/` folder.
2. That's it — the mood board reshuffles automatically on every visit, so order
   doesn't matter here.
3. Commit and push.

---

## Good-to-know quirks (so I don't panic later)

- **The home page shows "Nothing here yet" when the `photos/` folder is empty.**
  That's normal, not broken — just add photos.

- **Photos load straight from GitHub, not the built site.** The `images/` folder is
  deliberately left out of the Jekyll build (see `_config.yml`) because it's huge
  (1+ GB) and would make builds time out. The site fetches the photos directly from
  GitHub instead, so this is on purpose — don't "fix" it.

- **Never delete the `images/` folder.** If it ever goes missing, it's still in the
  Git history. It can be restored with a command like
  `git checkout <old-commit-hash> -- images/` from Terminal.

- **The site is plain HTML/CSS/JS + Jekyll.** No build tools to install, no
  dependencies. Editing a file and pushing is all it takes.

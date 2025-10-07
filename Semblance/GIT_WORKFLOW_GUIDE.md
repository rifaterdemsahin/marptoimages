# Git Workflow Guide - Practical Commit & Push

**Date:** January 7, 2025  
**Purpose:** A practical guide for committing and pushing changes to GitHub

---

## Quick Reference

### Basic Workflow

```bash
# 1. Check what files changed
git status

# 2. Add files you want to commit
git add .                    # Add all files
git add filename.txt         # Add specific file
git add folder/              # Add specific folder

# 3. Commit with a meaningful message
git commit -m "Description of what you changed"

# 4. Push to GitHub
git push
```

---

## Understanding Git Status

### Check What Changed

```bash
git status
```

**You'll see one of these:**

#### ✅ Changes Ready to Commit
```
Changes to be committed:
  (use "git restore --staged <file>..." to unstage)
        modified:   README.md
        new file:   newfile.txt
```

#### 📝 Changes Not Staged
```
Changes not staged for commit:
  (use "git add <file>..." to update what will be committed)
        modified:   index.js
```

#### 🆕 Untracked Files
```
Untracked files:
  (use "git add <file>..." to include in what will be committed)
        temp.txt
```

#### ✅ Nothing to Commit
```
On branch main
Your branch is up to date with 'origin/main'.

nothing to commit, working tree clean
```

This means:
- ✅ All changes are already committed
- ✅ Everything is up to date with GitHub
- 💡 You don't need to commit/push anything

---

## Step-by-Step Examples

### Example 1: You Modified a File

```bash
# You edited README.md

# Step 1: Check status
git status
# Output: "modified: README.md"

# Step 2: Add the file
git add README.md

# Step 3: Commit with message
git commit -m "Update README with new instructions"

# Step 4: Push to GitHub
git push
```

### Example 2: You Created New Files

```bash
# You created newfile.js and newfile.css

# Step 1: Check status
git status
# Output: "Untracked files: newfile.js, newfile.css"

# Step 2: Add all new files
git add .

# Step 3: Commit
git commit -m "Add new JavaScript and CSS files"

# Step 4: Push
git push
```

### Example 3: Multiple Changes

```bash
# You modified 5 files and created 2 new ones

# Step 1: Check what changed
git status

# Step 2: Add everything
git add .

# Step 3: Commit with descriptive message
git commit -m "Refactor authentication system and add new login page"

# Step 4: Push
git push
```

### Example 4: Nothing to Commit

```bash
git status
# Output: "nothing to commit, working tree clean"

# This means: All your work is already saved!
# No need to commit or push.
```

---

## Writing Good Commit Messages

### ❌ Bad Commit Messages
```bash
git commit -m "update"           # What did you update?
git commit -m "fix"              # What did you fix?
git commit -m "asdf"             # Not descriptive
git commit -m "changes"          # What changes?
```

### ✅ Good Commit Messages
```bash
git commit -m "Fix server health check endpoint returning 404"
git commit -m "Add debug console for troubleshooting conversion errors"
git commit -m "Update README with Vercel deployment link"
git commit -m "v1.0.1: Add server monitoring and URL guide"
```

### Commit Message Template

```bash
# Format: [Type] Brief description
git commit -m "[Feature] Add user authentication"
git commit -m "[Fix] Resolve database connection timeout"
git commit -m "[Docs] Update API documentation"
git commit -m "[Refactor] Simplify error handling logic"
```

### For This Project

```bash
# Good examples for marptoimages:
git commit -m "Fix Marp CLI output path issue"
git commit -m "Add file validation for .md files only"
git commit -m "Update homepage with project links"
git commit -m "Add comprehensive troubleshooting guide"
```

---

## Common Scenarios

### Scenario 1: "I Made Changes But `git status` Shows Nothing"

**Possible Reasons:**

1. **Changes not saved in editor**
   ```bash
   # Make sure you saved the file (Cmd+S or Ctrl+S)
   ```

2. **Looking at wrong directory**
   ```bash
   pwd  # Check where you are
   cd /correct/path
   ```

3. **Changes in ignored files**
   ```bash
   # Check .gitignore
   cat .gitignore
   ```

### Scenario 2: "Everything Up-to-Date"

```bash
git push
# Output: "Everything up-to-date"
```

**This means:**
- ✅ Your latest commit is already on GitHub
- ✅ Nothing new to push
- 💡 You're all set!

### Scenario 3: "Forgot to Add Files"

```bash
# You committed but forgot to add a file

# Option 1: Add to previous commit (if not pushed yet)
git add forgotten-file.txt
git commit --amend --no-edit
git push

# Option 2: Make a new commit
git add forgotten-file.txt
git commit -m "Add forgotten file"
git push
```

### Scenario 4: "Want to Undo Last Commit"

```bash
# BEFORE pushing to GitHub
git reset HEAD~1  # Undo commit, keep changes
git reset --hard HEAD~1  # Undo commit AND changes (careful!)

# AFTER pushing to GitHub
# Don't undo! Make a new commit instead:
git revert HEAD
git push
```

---

## Viewing Your Changes

### Before Committing

```bash
# See what you changed
git diff

# See what you changed in a specific file
git diff filename.txt

# See what's staged for commit
git diff --staged
```

### After Committing

```bash
# See recent commits
git log

# See recent commits (short)
git log --oneline

# See last 5 commits
git log -5
```

---

## Practical Workflow for This Project

### Daily Development Workflow

```bash
# 1. Start your day - get latest changes
git pull

# 2. Make your changes
# (edit files in VSCode)

# 3. Before taking a break - save your work
git status                    # See what changed
git add .                     # Add all changes
git commit -m "Describe changes"
git push                      # Backup to GitHub

# 4. End of day
git status                    # Make sure everything is committed
git push                      # Final push
```

### Working on a Feature

```bash
# Day 1: Start feature
git add .
git commit -m "Start implementing debug console"
git push

# Day 2: Continue feature
git add .
git commit -m "Add debug logging to backend"
git push

# Day 3: Finish feature
git add .
git commit -m "Complete debug console with health checks"
git push
```

---

## Troubleshooting

### "Your branch is behind 'origin/main'"

```bash
# Someone else pushed changes, or you pushed from another computer

# Get the latest changes
git pull

# If there are conflicts
# 1. VSCode will show conflicts
# 2. Resolve them manually
# 3. Then:
git add .
git commit -m "Merge remote changes"
git push
```

### "Permission Denied"

```bash
# Check your GitHub authentication
ssh -T git@github.com

# If fails, set up SSH key:
# https://docs.github.com/en/authentication/connecting-to-github-with-ssh
```

### "Fatal: Not a Git Repository"

```bash
# You're not in a git repository

# Navigate to your project
cd /Users/rifaterdemsahin/projects/marptoimages

# Verify it's a git repo
ls -la .git
```

---

## Quick Tips

### 1. Check Before You Push

```bash
# Always check what you're about to commit
git status
git diff
```

### 2. Commit Often

```bash
# Small, frequent commits are better than large ones
# Commit after each logical change
```

### 3. Pull Before You Push

```bash
# If working on multiple machines
git pull
# Make changes
git add .
git commit -m "Changes"
git push
```

### 4. Use Meaningful Messages

```bash
# Future you will thank you!
git commit -m "Fix: Server returns 404 on /health endpoint"
# Not: git commit -m "fix stuff"
```

---

## Git Aliases (Optional Time-Savers)

### Setup Shortcuts

```bash
# Add to ~/.gitconfig
git config --global alias.st status
git config --global alias.co checkout
git config --global alias.br branch
git config --global alias.cm commit
git config --global alias.ps push
```

### Then Use:

```bash
git st      # Instead of: git status
git cm -m "message"  # Instead of: git commit -m "message"
git ps      # Instead of: git push
```

---

## Complete Example Session

```bash
# Morning: Start work
cd /Users/rifaterdemsahin/projects/marptoimages
git pull
git status
# "On branch main, up to date, clean"

# Make some changes in VSCode...
# - Edit README.md
# - Create new-feature.js
# - Update index.js

# Check what changed
git status
# Shows:
# - modified: README.md
# - modified: index.js
# - untracked: new-feature.js

# Add all changes
git add .

# Verify what's staged
git status
# All 3 files now "Changes to be committed"

# Commit with descriptive message
git commit -m "Add new authentication feature and update documentation"

# Push to GitHub
git push

# Verify everything is clean
git status
# "nothing to commit, working tree clean"

# Done! Changes are on GitHub
```

---

## Summary

**The 3-Step Process:**

```bash
1. git add .              # Stage your changes
2. git commit -m "msg"    # Save locally
3. git push               # Upload to GitHub
```

**Check Everything:**

```bash
git status    # Before and after each step!
```

**Remember:**
- ✅ Commit often with clear messages
- ✅ Always `git status` before committing
- ✅ Pull before you start working
- ✅ Push when you're done
- ✅ "nothing to commit" is good news!

---

## For This Project Specifically

```bash
# Always work from the right directory
cd /Users/rifaterdemsahin/projects/marptoimages

# Check status
git status

# If you see changes:
git add .
git commit -m "Meaningful description of what you changed"
git push

# If you see "nothing to commit":
# ✅ Great! Everything is already saved on GitHub
# No action needed!
```

**Most common mistake:** Using vague commit messages like "update"

**Best practice:** Describe WHAT you changed and WHY
- ✅ "Fix Marp CLI path issue causing empty output"
- ✅ "Add health check to detect server connectivity"
- ❌ "update"
- ❌ "changes"

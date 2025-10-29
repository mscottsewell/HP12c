# FAQ Content Management Workflow

This document explains how to export, edit, and re-import the FAQ/help content for the HP12c Calculator.

## Overview

The FAQ content is stored in `help.js` as a JavaScript object. To make it easier for non-technical people to edit the content, we have a workflow that:

1. **Exports** the FAQ content to an editable Markdown file
2. Allows editing in a **simple text format**
3. **Re-imports** the changes back into the code

## Files Involved

- **`help.js`** - The main JavaScript file containing FAQ data and functions
- **`faq-content.md`** - Editable Markdown file with FAQ content (generated)
- **`export-faq.js`** - Script to export FAQ from help.js to Markdown
- **`import-faq.js`** - Script to import edited Markdown back to help.js

## Step-by-Step Instructions

### Step 1: Export Current FAQ Content

Run this command in your terminal:

```powershell
node export-faq.js
```

**What it does:**
- Reads the FAQ content from `help.js`
- Creates/updates `faq-content.md` with all categories and examples
- Displays a summary (e.g., "Total categories: 9, Total examples: 33")

**Result:** You now have a `faq-content.md` file that can be edited.

### Step 2: Edit the FAQ Content

Open `faq-content.md` in any text editor. You can edit:

✅ **Category titles** (## headers, e.g., `## Time Value of Money (TVM)`)
✅ **Example names** (### headers, e.g., `### Mortgage Payment Calculation`)
✅ **Problem descriptions** (after `**Problem:**`)
✅ **Steps** (list items under `**Steps:**`, keep the backticks ` around button names)
✅ **Results** (after `**Result:**`)
✅ **Add new examples** (copy the format)
✅ **Remove examples** (delete entire example blocks)
✅ **Reorder examples** (move example blocks around)

❌ **DO NOT change:**
- Category key metadata (e.g., `[//]: # (Category Key: tvm)`)
- The general Markdown structure (##, ###, **bold** labels)

**Example of an example:**
```markdown
### Mortgage Payment Calculation

**Problem:** Calculate the monthly payment for a $300,000 mortgage at 4.5% annual interest for 30 years.

**Steps:**
1. `360` `n` (30 years × 12 months = 360 payments)
2. `4.5` `ENTER` `12` `÷` `i` (4.5% ÷ 12 = monthly rate)
3. `300000` `PV` (loan amount)
4. `PMT` (calculate payment)

**Result:** $-1,520.06 (negative indicates cash outflow)
```

### Step 3: Re-import the Updated Content

After editing and saving `faq-content.md`, run:

```powershell
node import-faq.js
```

**What it does:**
- Reads your edited `faq-content.md`
- Updates `help.js` with the new content
- Preserves all JavaScript functions and code structure
- Displays a summary of what was updated

**Result:** The `help.js` file now contains your updated FAQ content!

### Step 4: Test the Changes

Open `index.html` in a browser and:
1. Click the FAQ button
2. Navigate through categories
3. Check that your changes appear correctly
4. Verify all examples display properly

## Tips for Editing

### Backticks for Button Names
Keep backticks around calculator buttons and operations:
- ✅ Correct: `` `360` `n` (30 years × 12 months) ``
- ❌ Wrong: `360 n (30 years × 12 months)`

### Multi-line Problems
If a problem is long, keep it on one line in the Markdown file:
```markdown
Problem: Calculate the monthly payment for a $300,000 mortgage at 4.5% annual interest for 30 years.
```

### Adding a New Example
Copy an existing example block and modify it:
```markdown
### Your New Example

**Problem:** Description of the problem

**Steps:**
1. `step` `one` (explanation)
2. `step` `two` (explanation)

**Result:** The expected result
```

### Adding a New Category
To add a completely new category:
1. Choose a unique key (lowercase, no spaces, e.g., `bonds`)
2. Add it to both `export-faq.js` and `import-faq.js` in the `categoryOrder` arrays
3. Add the category HTML button in `index.html`

## Sharing with Non-Technical Reviewers

When sending `faq-content.md` to someone for review:

1. Export the current content: `node export-faq.js`
2. Send them `faq-content.md` AND this `FAQ-WORKFLOW.md` file
3. Tell them to:
   - Edit only the content (not the marker lines)
   - Keep backticks around button names
   - Save the file when done
4. When you receive the edited file back:
   - Replace your `faq-content.md` with their version
   - Run `node import-faq.js`
   - Test the changes

## Troubleshooting

### "Could not find exampleData in help.js"
- The `help.js` file structure may have been modified
- Check that the `const exampleData = {` line exists

### "Skipping category with missing key or title"
- Make sure each category has a `## Title` header
- Check that category key metadata exists (format: `[//]: # (Category Key: tvm)`)

### "Skipping example with missing fields"
- Each example needs: `### Name` header, `**Problem:**`, `**Steps:**`, and `**Result:**`
- Check for typos in field names

### Changes don't appear in browser
- Hard refresh the browser (Ctrl+F5 or Cmd+Shift+R)
- Clear browser cache
- Check browser console for JavaScript errors

## Version Control

If using Git:

```powershell
# After importing changes
git add help.js faq-content.md
git commit -m "Updated FAQ content"
git push
```

## Summary of Commands

```powershell
# Export FAQ to Markdown
node export-faq.js

# Import edited Markdown to help.js
node import-faq.js
```

---

**Questions?** Contact the repository maintainer or open an issue on GitHub.

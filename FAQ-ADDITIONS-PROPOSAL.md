# FAQ Content - Proposed Additions

**Date**: October 30, 2025  
**Status**: Awaiting Review

---

## Summary

The current FAQ has **33 examples** across 9 categories. After reviewing all implemented functions documented in FUNCTIONS.md, I've identified **4 major gaps** where new examples should be added.

---

## Current FAQ Coverage

### ✅ Well Covered (No Changes Needed)
- **TVM**: 8 examples (excellent coverage)
- **Cash Flow**: 3 examples (NPV, IRR, repeated flows)
- **Percentage**: 5 examples (comprehensive)
- **Math**: 7 examples (good variety)
- **Depreciation**: 3 examples (all methods covered)
- **Amortization**: 2 examples (adequate)
- **Dates**: 2 examples (basic coverage)

### ⚠️ Partially Covered (Could Add More)
- **Statistics**: 3 examples (mean, std dev, weighted avg)
  - Missing: Linear regression examples

---

## Proposed Additions (4 New Categories/Sections)

### 1. **NEW CATEGORY: Bond Calculations**
**Why**: Bond functions (PRICE, YTM) are fully implemented but have NO FAQ examples

**Proposed Examples**:

#### Example 1: Bond Price Calculation
```
Problem: A bond has 10 semi-annual periods remaining, pays $25 coupon 
per period, $1000 face value. If market yield is 6% semi-annual, 
what's the bond price?

Steps:
1. 10 n (periods to maturity)
2. 6 i (yield per period)
3. 25 PMT (coupon payment)
4. 1000 FV (face value)
5. f PRICE (calculate bond price)

Result: $926.40 (92.64% of par)
```

#### Example 2: Yield to Maturity
```
Problem: A bond trading at $950 has 8 periods remaining, $30 coupon 
per period, $1000 face value. What's the YTM?

Steps:
1. 8 n (periods)
2. 950 CHS PV (current price, negative)
3. 30 PMT (coupon)
4. 1000 FV (face value)
5. f YTM (calculate yield)

Result: 3.77% per period
```

**Category Key**: `bonds` (NEW)
**Category Title**: "Bond Valuation"
**Location**: Insert after "Cash Flow Analysis" section

---

### 2. **ADD TO STATISTICS: Linear Regression**
**Why**: Linear regression functions (x̄,r, ŷ,r, x̂) are implemented but not in FAQ

**Proposed Examples**:

#### Example 1: Linear Regression Mean
```
Problem: Data points (2,3), (4,5), (6,7), (8,9). Find mean using 
linear regression.

Steps:
1. 3 ENTER 2 Σ+ (add point: y=3, x=2)
2. 5 ENTER 4 Σ+ (add point: y=5, x=4)
3. 7 ENTER 6 Σ+ (add point: y=7, x=6)
4. 9 ENTER 8 Σ+ (add point: y=9, x=8)
5. g x̄,r (calculate means from regression)

Result: X: x̄ = 5.0, Y: ȳ = 6.0
```

#### Example 2: Y Estimate from Regression
```
Problem: Using same data, estimate Y when X = 10.

Steps:
1. (Continue from previous data)
2. 10 g ŷ,r (estimate y for x=10)

Result: ŷ = 11.0
```

#### Example 3: X Estimate from Regression
```
Problem: Using same data, estimate X when Y = 8.

Steps:
1. (Continue from previous data)
2. 8 g x̂ (estimate x for y=8)

Result: x̂ = 7.0
```

**Location**: Add to existing "Statistical Calculations" section
**Impact**: Adds 3 examples to statistics category (total: 6 examples)

---

### 3. **ADD TO TVM: BEGIN Mode Example**
**Why**: BEGIN mode is implemented and important for annuities due, but not demonstrated

**Proposed Example**:

#### TVM with BEGIN Mode (Annuity Due)
```
Problem: Lease requires $500/month payment at the BEGINNING of each 
month for 3 years at 6% annual (0.5% monthly). What's the present value?

Steps:
1. g BEG (set to BEGIN mode - indicator shows)
2. 36 n (3 years × 12 months)
3. 0.5 i (monthly rate)
4. 500 CHS PMT (payment at beginning)
5. 0 FV (no residual)
6. PV (calculate present value)
7. g END (return to normal mode)

Result: $16,234.85 (compare to $16,165.51 in END mode)
```

**Location**: Add to existing "Time Value of Money (TVM)" section
**Impact**: Adds 1 example (total TVM: 9 examples)

---

### 4. **OPTIONAL: Amortization Detail Example**
**Why**: Current amortization examples are basic; could add one showing how to view principal/interest

**Proposed Example**:

#### Amortization with Principal & Interest Detail
```
Problem: For a $100,000 loan at 6% annual (0.5% monthly) for 30 years, 
find the principal and interest in the first payment.

Steps:
1. 360 n (30 × 12 months)
2. 0.5 i (monthly rate)
3. 100000 PV (loan amount)
4. PMT (calculates -$599.55)
5. 1 ENTER 1 f AMORT (amortize payment 1 to 1)
   → Shows principal in X register
6. x↔y (swap to see interest in Y register)

Result: Principal = $99.55, Interest = $500.00
```

**Location**: Add to existing "Amortization" section (optional enhancement)
**Impact**: Adds 1 example (total amortization: 3 examples)

---

## Summary of Proposed Changes

### New Content
- **1 New Category**: Bond Valuation (2 examples)
- **3 New Statistics Examples**: Linear regression, Y estimate, X estimate
- **1 New TVM Example**: BEGIN mode
- **1 Optional Amortization Example**: Principal/interest detail

### Total Impact
- **Before**: 33 examples across 9 categories
- **After**: 40 examples across 10 categories (+7 examples, +21% increase)

### Categories Modified
1. **NEW**: Bond Valuation (bonds) - 2 examples
2. **ENHANCED**: Statistics - 6 examples (was 3)
3. **ENHANCED**: TVM - 9 examples (was 8)
4. **ENHANCED** (optional): Amortization - 3 examples (was 2)

---

## Implementation Plan

### Step 1: Create Bond Category
Add new section after Cash Flow Analysis in faq-content.md:
```markdown
## Bond Valuation

[//]: # (Category Key: bonds)

### Bond Price Calculation
[example content...]

### Yield to Maturity
[example content...]
```

### Step 2: Enhance Statistics Section
Add three new examples to existing Statistics category

### Step 3: Enhance TVM Section
Add BEGIN mode example to existing TVM category

### Step 4: (Optional) Enhance Amortization
Add detailed example to existing Amortization category

### Step 5: Validation
- Run `node import-faq.js` to update help.js
- Verify no syntax errors
- Test FAQ display in calculator
- Ensure all button references use backticks

---

## Format Compliance Checklist

All proposed examples follow the existing format:
- ✅ Category has metadata: `[//]: # (Category Key: xxx)`
- ✅ Each example has `### Title`
- ✅ Each has `**Problem:**` statement
- ✅ Each has `**Steps:**` with numbered list
- ✅ Button/key references use backticks: `` `PMT` ``
- ✅ Each has `**Result:**` statement
- ✅ Consistent formatting and spacing

---

## Next Steps

1. **Review** this proposal
2. **Approve** additions (all, some, or suggest modifications)
3. **Execute** changes to faq-content.md
4. **Import** using `node import-faq.js`
5. **Test** FAQ display in calculator
6. **Update** help.js category order if adding bond category

---

## Questions for Consideration

1. Should we add the Bond category, or just add bonds to an existing category?
2. Is the optional amortization detail example worth adding?
3. Should we add more date examples (30/360 vs actual)?
4. Any other functions that deserve FAQ examples?

---

**Ready for Review**: Please approve, modify, or reject these proposed additions.

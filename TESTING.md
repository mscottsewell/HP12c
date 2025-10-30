# HP12c Function Implementation - Test Guide

## Quick Test Instructions

1. **Open the Test Suite**:
   - Navigate to the project folder
   - Double-click `test-functions.html` to open in your default browser
   - Click "Run All Tests" button

2. **Expected Results**:
   All tests should pass (green). The test suite validates:
   - ✅ Financial TVM calculations (n, i, PV, PMT, FV)
   - ✅ Statistical functions (means, standard deviation, regression)
   - ✅ Date arithmetic
   - ✅ Bond pricing and yields
   - ✅ Depreciation methods
   - ✅ Amortization schedules
   - ✅ NPV and IRR calculations

## Manual Testing Examples

### Test 1: Calculate Loan Periods (n)
**Scenario**: $10,000 loan at 1% monthly interest, $300 payment

**Steps**:
1. Open `index.html` in browser
2. Enter: `10000` `PV`
3. Enter: `1` `i`
4. Enter: `300` `CHS` `PMT`
5. Enter: `0` `FV`
6. Press: `n`

**Expected**: Display shows ~39.52 periods

---

### Test 2: Calculate Interest Rate (i)
**Scenario**: $10,000 loan, 40 payments of $300

**Steps**:
1. Enter: `40` `n`
2. Enter: `10000` `PV`
3. Enter: `300` `CHS` `PMT`
4. Enter: `0` `FV`
5. Press: `i`

**Expected**: Display shows ~1.0% per period

---

### Test 3: Linear Regression
**Scenario**: Data points (2,3), (4,5), (6,7), (8,9)

**Steps**:
1. Enter: `3` `ENTER` `2` `Σ+`
2. Enter: `5` `ENTER` `4` `Σ+`
3. Enter: `7` `ENTER` `6` `Σ+`
4. Enter: `9` `ENTER` `8` `Σ+`
5. Press: `g` `x̄,r` (mean)

**Expected**: x̄ = 5.0, ȳ = 6.0

6. Enter: `10`
7. Press: `g` `ŷ,r` (estimate y)

**Expected**: ŷ = 11.0

---

### Test 4: Date Calculation
**Scenario**: Days from Jan 15, 2024 to Mar 20, 2024

**Steps**:
1. Press: `g` `M.DY` (set date format)
2. Enter: `1.152024` `ENTER`
3. Enter: `3.202024`
4. Press: `g` `ΔDYS`

**Expected**: Display shows 65 days

---

### Test 5: Bond Price
**Scenario**: 10-period bond, 5% coupon, $1000 face, 6% yield

**Steps**:
1. Enter: `10` `n`
2. Enter: `6` `i`
3. Enter: `50` `PMT`
4. Enter: `1000` `FV`
5. Press: `f` `PRICE`

**Expected**: Display shows ~926.40

---

### Test 6: Depreciation (SOYD)
**Scenario**: $10,000 asset, $1,000 salvage, 5-year life, year 1

**Steps**:
1. Enter: `10000` `PV`
2. Enter: `1000` `FV`
3. Enter: `5` `n`
4. Enter: `1`
5. Press: `f` `SOYD`

**Expected**: Display shows ~3000

---

### Test 7: Amortization
**Scenario**: First payment on $100,000 loan at 0.5% monthly

**Steps**:
1. Enter: `360` `n`
2. Enter: `0.5` `i`
3. Enter: `100000` `PV`
4. Enter: `0` `FV`
5. Press: `PMT` (calculates ~-599.55)
6. Enter: `1` `ENTER` `1`
7. Press: `f` `AMORT`

**Expected**: 
- X register: ~99.55 (principal)
- Y register: ~500.00 (interest)
- Z register: ~99,900.45 (balance)

---

### Test 8: NPV and IRR
**Scenario**: CF₀=-1000, CF₁=300, CF₂=400, CF₃=500

**Steps for NPV at 10%**:
1. Enter: `1000` `CHS` `CFo`
2. Enter: `300` `CFj`
3. Enter: `400` `CFj`
4. Enter: `500` `CFj`
5. Enter: `10` `i`
6. Press: `f` `NPV`

**Expected**: ~49.21

**Steps for IRR**:
1. (Using same cash flows from above)
2. Press: `f` `IRR`

**Expected**: ~14.3%

---

## Verification Checklist

- [ ] All automated tests pass
- [ ] Financial calculations (n, i) converge correctly
- [ ] Statistical regression produces accurate results
- [ ] Date functions handle format conversion properly
- [ ] Bond pricing matches expected values
- [ ] Depreciation methods calculate correctly
- [ ] Amortization shows principal/interest split
- [ ] NPV and IRR match reference values
- [ ] No JavaScript errors in browser console
- [ ] Display formatting shows proper decimal places
- [ ] Steps panel records all operations correctly

---

## Known Limitations

1. **Program Mode**: PSE, BST, GTO, PRGM buttons are placeholder implementations
2. **Precision**: Results may differ slightly from physical HP12c due to floating-point arithmetic
3. **Date Range**: Very old dates (pre-1900) may have formatting issues
4. **Iterative Methods**: calculateI() and IRR may not converge for extreme values

---

## Troubleshooting

### Tests Fail
- Check browser console for JavaScript errors
- Verify calculator.js loaded correctly
- Ensure no modifications were made to core algorithms

### Results Slightly Different
- Small differences (<0.1) are acceptable due to floating-point precision
- Large differences indicate implementation error

### Functions Not Available
- Press `f` for orange functions (above keys)
- Press `g` for blue functions (below keys)
- Check that calculator initialized correctly

---

## References

All implementations are based on:
- HP 12C Owner's Handbook and Problem-Solving Guide
- HP 12C Platinum Solutions Handbook
- Standard financial calculation formulas
- Newton-Raphson numerical methods for TVM

See **FUNCTIONS.md** for detailed formulas and mathematical explanations.

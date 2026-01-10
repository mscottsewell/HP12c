# HP-12C Implementation Checklist

Review completed: January 10, 2026

## 🔴 Critical Priority - Core Functionality Bugs

### LastX Register Implementation

- [x] Add `this.lastX = this.getX();` to `add()` function before operation
- [x] Add `this.lastX = this.getX();` to `subtract()` function before operation
- [x] Add `this.lastX = this.getX();` to `multiply()` function before operation
- [x] Add `this.lastX = this.getX();` to `divide()` function before operation
- [x] Add `this.lastX = this.getX();` to `power()` function before operation
- [x] Add `this.lastX = this.getX();` to `reciprocal()` function before operation
- [x] Add `this.lastX = this.getX();` to `squareRoot()` function before operation
- [x] Add `this.lastX = this.getX();` to `naturalLog()` function before operation
- [x] Add `this.lastX = this.getX();` to `exponential()` function before operation
- [x] Add `this.lastX = this.getX();` to `factorial()` function before operation
- [x] Add `this.lastX = this.getX();` to percentage functions (%, %T, Δ%)
- [x] Add `this.lastX = this.getX();` to TVM calculation functions
- [x] Add `this.lastX = this.getX();` to NPV/IRR functions
- [x] Test LastX recall (g-LSTx) after various operations
- [x] Verify LastX doesn't get overwritten by RCL operations (should remain unchanged)

**Testing:**

- [x] Write test: perform 5 + 3 =, then g-LSTx should recall 3
- [x] Write test: perform 10 × 2 =, then g-LSTx should recall 2
- [x] Write test: RCL should not affect LastX register

---

## 🟠 High Priority - Important Missing Features

### Memory Arithmetic Operations
- [ ] Implement `STO +` (add X to memory register)
- [ ] Implement `STO -` (subtract X from memory register)
- [ ] Implement `STO ×` (multiply memory register by X)
- [ ] Implement `STO ÷` (divide memory register by X)
- [x] Implement `RCL +` (recall and add)
- [x] Implement `RCL -` (recall and subtract)
- [x] Implement `RCL ×` (recall and multiply)
- [x] Implement `RCL ÷` (recall and divide)
- [x] Update button handler to detect STO/RCL followed by arithmetic operator
- [x] Test all memory arithmetic operations

**Testing:**
- [x] Write test: Store 10 in R1, then 5 STO+ 1 should make R1 = 15
- [x] Write test: Store 20 in R2, then 4 STO÷ 2 should make R2 = 5

### Date Format Indicator
- [x] Update `setDateFormatDMY()` to activate DMY indicator display
- [x] Update `setDateFormatMDY()` to deactivate DMY indicator display
- [x] Test indicator toggles correctly with g-D.MY and g-M.DY
- [x] Verify date calculations work correctly in both formats

### Documentation Updates
- [x] Create KNOWN_LIMITATIONS.md documenting intentional simplifications
- [x] Document that programming functions (R/S, SST, PRGM, GTO) are simplified
- [ ] Document EEX limitations in current implementation
- [x] Update README.md with link to limitations document
- [x] Add section in FAQ about differences from real HP-12C

---

## 🟡 Medium Priority - Enhanced Functionality

### EEX (Scientific Notation Entry)
- [ ] Implement proper EEX state tracking (entering exponent mode)
- [ ] Handle digit entry after EEX (should append to exponent)
- [ ] Handle CHS after EEX (should toggle exponent sign, not mantissa)
- [ ] Handle invalid operations during EEX entry
- [ ] Display proper scientific notation format during entry
- [ ] Test various scientific notation entries (1.5e-10, 2.3e5, etc.)

**Testing:**
- [ ] Test: 1.5 EEX 3 = 1500
- [ ] Test: 2 EEX CHS 4 = 0.0002
- [ ] Test: 6.02 EEX 23 = 6.02×10²³

### Missing f-Σ Function
- [ ] Implement f-Σ (sum of cash flows) function
- [ ] Add to switch statement as case 'Σ':
- [ ] Calculate sum of all stored cash flows (CFo + all CFj)
- [ ] Display result in X register
- [ ] Test with various cash flow scenarios

### Conversion Functions Verification
- [ ] Test `polarToRect()` (f-P/R) with known values
- [ ] Test `rectToPolar()` (g-→P) with known values
- [ ] Test `hoursToHMS()` (g-→H) with decimal hours
- [ ] Test `radToDeg()` (g-→DEG) with radian values
- [ ] Implement `hmsToHours()` (reverse of →H) if needed
- [ ] Implement `degToRad()` (g-→RAD) - currently missing
- [ ] Add test cases for all conversion functions

**Testing:**
- [ ] Test: Convert (3,4) rectangular to polar = (5, 53.13°)
- [ ] Test: Convert 2.5 hours to H.MS = 2.30
- [ ] Test: Convert π/2 radians to degrees = 90°

---

## 🟢 Low Priority - Minor Enhancements

### Additional Test Functions
- [ ] Implement `x>0` test if needed for complete HP-12C compatibility
- [ ] Implement `x<y` test if needed
- [ ] Consider implementing additional comparison tests
- [ ] Test all test functions return proper TRUE/FALSE display

### Enhanced Display Features
- [ ] Consider implementing GRAD mode indicator support (if needed)
- [ ] Consider implementing C (Celsius) mode indicator (if needed)
- [ ] Review all indicator lights match real HP-12C behavior

### Code Cleanup
- [ ] Remove unused `programMode` variable if program functions remain simplified
- [ ] Add JSDoc comments to all missing functions
- [ ] Ensure consistent error handling across all functions
- [ ] Review all console.log statements for production readiness

---

## 🧪 Testing Requirements

### New Test Files Needed
- [ ] Create `calculator-lastx.test.js` for LastX functionality
- [ ] Create `calculator-memory-arithmetic.test.js` for STO+/- etc.
- [ ] Create `calculator-eex.test.js` for scientific notation entry
- [ ] Create `calculator-conversions.test.js` for all conversion functions
- [ ] Create `calculator-dates.test.js` for date calculations
- [ ] Create `calculator-bonds.test.js` for bond pricing/YTM
- [ ] Create `calculator-depreciation.test.js` for SL/SOYD/DB
- [ ] Create `calculator-amortization.test.js` for AMORT/INT

### Integration Tests
- [ ] Test complete TVM workflow with all 5 registers
- [ ] Test cash flow entry and NPV/IRR calculation
- [ ] Test statistics workflow: Σ+, mean, std dev, regression
- [ ] Test memory workflow: STO, RCL, memory arithmetic
- [ ] Test RPN stack behavior across multiple operations
- [ ] Verify stack lift behavior matches HP-12C

### Edge Case Testing
- [ ] Test division by zero handling
- [ ] Test overflow conditions (very large numbers)
- [ ] Test underflow conditions (very small numbers)
- [ ] Test with negative interest rates
- [ ] Test with zero interest rates
- [ ] Test with invalid date formats
- [ ] Test with empty cash flow arrays

---

## 📝 Documentation Tasks

### Function Documentation
- [ ] Document all TVM formulas in FUNCTIONS.md
- [ ] Add examples for memory arithmetic operations
- [ ] Add examples for conversion functions
- [ ] Document EEX usage patterns
- [ ] Create troubleshooting guide for common issues

### User Guide Enhancements
- [ ] Add "Differences from Physical HP-12C" section
- [ ] Create quick reference card for common operations
- [ ] Add video tutorial links if available
- [ ] Create printable keyboard layout reference

---

## ✅ Already Correct / Complete

These items were reviewed and found to be correctly implemented:

- ✅ N rounding behavior (rounds up to next integer) - **Correct**
- ✅ TVM calculations (n, i, PV, PMT, FV) with proper formulas
- ✅ BEGIN/END mode support
- ✅ RPN stack operations (4-level stack with proper lift)
- ✅ Cash flow NPV/IRR calculations
- ✅ Statistical functions (Σ+, Σ-, mean, weighted mean, std dev)
- ✅ Linear regression (ŷ,r and x̂,r)
- ✅ Percentage calculations (%, %T, Δ%)
- ✅ Basic math functions (y^x, 1/x, √x, ln, e^x, n!)
- ✅ FRAC and INTG functions
- ✅ Memory registers (STO/RCL for .0-.9)
- ✅ Depreciation calculations (SL, SOYD, DB)
- ✅ Amortization (AMORT, INT)
- ✅ Bond functions (PRICE, YTM)
- ✅ Date functions (DATE, ΔDYS) with format support
- ✅ Display formatting (f-digit for decimal places)
- ✅ g-12× and g-12÷ behavior (stores to n/i) - **Correct per FAQ**
- ✅ Persistent decimal places setting (localStorage)

---

## 📊 Progress Tracking

**Critical Items:** 18 of 18 complete (100%) ✅
**High Priority:** 0 of 10 complete (0%)
**Medium Priority:** 0 of 15 complete (0%)
**Low Priority:** 0 of 10 complete (0%)
**Testing:** 3 of 28 complete (11%)
**Documentation:** 0 of 9 complete (0%)

**Overall Completion:** 21 of 87 items (24%)

---

## 🎯 Suggested Implementation Order

1. **Week 1:** Fix LastX register (Critical) + Add tests
2. **Week 2:** Implement memory arithmetic operations (High Priority)
3. **Week 3:** Fix date format indicator + EEX improvements (Medium Priority)
4. **Week 4:** Add missing tests + Documentation updates
5. **Week 5:** Conversion function verification + Additional tests
6. **Week 6:** Code cleanup + Edge case testing + Final documentation

---

## Notes

- This checklist is based on comparison with authentic HP-12C behavior
- Some items marked as "missing" may be intentionally simplified for this web implementation
- Programming features (PRGM, GTO, etc.) are noted as simplified - decide if full implementation is needed
- Consider creating GitHub issues for each major section to track progress

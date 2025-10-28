# HP12c Financial Calculator Examples

This file contains step-by-step examples of common financial calculations using the HP12c simulator. These examples can be used for teaching and practice.

## Example 1: Mortgage Payment Calculation

**Problem**: Calculate the monthly payment for a $300,000 mortgage at 4.5% annual interest for 30 years.

**Steps**:
1. `360` `n` (30 years × 12 months = 360 payments)
2. `4.5` `ENTER` `12` `÷` `i` (4.5% ÷ 12 = monthly rate)
3. `300000` `PV` (loan amount)
4. `PMT` (calculate payment)

**Result**: $-1,520.06 (negative indicates cash outflow)

## Example 2: Future Value of Investment

**Problem**: How much will $10,000 grow to in 20 years at 7% annual return?

**Steps**:
1. `20` `n` (20 years)
2. `7` `i` (7% annual interest)
3. `10000` `CHS` `PV` (initial investment, negative for cash outflow)
4. `FV` (calculate future value)

**Result**: $38,696.84

## Example 3: Present Value of Annuity

**Problem**: What's the present value of receiving $1,000 per year for 10 years at 6% discount rate?

**Steps**:
1. `10` `n` (10 payments)
2. `6` `i` (6% discount rate)
3. `1000` `PMT` (annual payment)
4. `PV` (calculate present value)

**Result**: $-7,360.09

## Example 4: Compound Interest Calculation

**Problem**: How long will it take $5,000 to double at 8% annual interest?

**Steps**:
1. `8` `i` (8% annual interest)
2. `5000` `CHS` `PV` (initial amount, negative)
3. `10000` `FV` (target amount)
4. `n` (calculate time periods)

**Result**: 9.01 years

## Example 5: Interest Rate Calculation

**Problem**: What interest rate is needed for $1,000 to grow to $2,000 in 10 years?

**Steps**:
1. `10` `n` (10 years)
2. `1000` `CHS` `PV` (initial amount)
3. `2000` `FV` (final amount)
4. `i` (calculate interest rate)

**Result**: 7.18% annual interest rate

## Example 6: Percentage Calculations

### Simple Percentage
**Problem**: What is 15% of $250?

**Steps**:
1. `250` `ENTER`
2. `15` `%`

**Result**: $37.50

### Percentage Change
**Problem**: Sales increased from $80,000 to $95,000. What's the percentage increase?

**Steps**:
1. `80000` `ENTER`
2. `95000` `Δ%`

**Result**: 18.75% increase

### Percentage of Total
**Problem**: $45,000 is what percentage of $180,000?

**Steps**:
1. `180000` `ENTER`
2. `45000` `%T`

**Result**: 25%

## Example 7: Date Calculations

### Days Between Dates
**Problem**: How many days between January 15, 2024 and March 30, 2024?

**Steps** (using calculator date format):
1. `1.152024` `ENTER` (January 15, 2024)
2. `3.302024` `g` `ΔDYS` (days between)

**Result**: 75 days

## Example 8: Statistical Calculations

### Basic Statistics
**Problem**: Find the mean of: 10, 15, 20, 25, 30

**Steps**:
1. `10` `Σ+`
2. `15` `Σ+`
3. `20` `Σ+`
4. `25` `Σ+`
5. `30` `Σ+`
6. `g` `x̄` (calculate mean)

**Result**: 20

## Example 9: Power and Root Calculations

### Power Calculation
**Problem**: Calculate 3⁴

**Steps**:
1. `3` `ENTER`
2. `4` `y^x`

**Result**: 81

### Square Root
**Problem**: Find the square root of 144

**Steps**:
1. `144` `f` `√x`

**Result**: 12

## Example 10: Cash Flow Analysis (NPV)

**Problem**: Calculate NPV of cash flows: Initial -$1000, Year 1: $300, Year 2: $400, Year 3: $500 at 10% discount rate

**Steps**:
1. `1000` `CHS` `f` `CFo` (initial cash flow)
2. `300` `f` `CFj` (first year cash flow)
3. `400` `f` `CFj` (second year cash flow)
4. `500` `f` `CFj` (third year cash flow)
5. `10` `i` (discount rate)
6. `f` `NPV` (calculate net present value)

**Result**: $47.67

## Practice Tips

1. **Always Clear**: Press `ON` to clear the calculator before starting new problems
2. **Check Signs**: Remember that cash outflows are negative (use `CHS`)
3. **Verify Units**: Ensure interest rates and time periods match (annual vs. monthly)
4. **Use ENTER**: For multi-step calculations, use `ENTER` to separate values
5. **Practice RPN**: Get comfortable with Reverse Polish Notation logic

## Common Errors to Avoid

1. **Wrong Sign Convention**: Forgetting to make initial investments negative
2. **Mismatched Periods**: Using annual interest rate with monthly payments
3. **Forgetting ENTER**: Not using ENTER between stack operations
4. **Calculator Mode**: Not clearing previous calculations

## Educational Notes

These examples progress from simple to complex calculations. Students should:
- Master basic operations before attempting financial functions
- Understand the cash flow sign convention
- Practice with known answers to build confidence
- Use the step recording feature to track their work

For each example, encourage students to:
1. Work through manually first
2. Use the simulator to verify
3. Export the steps for reference
4. Practice on their physical HP12c
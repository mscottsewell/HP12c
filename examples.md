# HP12c Financial Calculator Examples
This file contains step-by-step examples of common financial calculations using the HP12c simulator. These examples are grouped by calculation type for easy reference.


## Practice Tips

1. **Always Clear**: Press `f` `REG` or `ON` to clear before starting new problems
2. **Check Signs**: Cash outflows are negative (use `CHS`)
3. **Verify Units**: Ensure interest rates and time periods match (annual vs. monthly)
4. **Use ENTER**: For multi-step calculations, use `ENTER` to separate values
5. **Practice RPN**: Get comfortable with Reverse Polish Notation logic
6. **Verify Results**: Use known examples to check your technique 

**Common Errors to Avoid**

1. **Wrong Sign Convention**: Forgetting to make initial investments negative
2. **Mismatched Periods**: Using annual interest rate with monthly payments
3. **Forgetting ENTER**: Not using ENTER between stack operations
4. **Calculator Mode**: Not clearing previous calculations
5. **Date Format**: Using wrong date format (M.DY vs D.MY)
6. **Statistics**: Not clearing registers with `f` `REG` before new calculations


## Time Value of Money (TVM) Calculations

### Mortgage Payment Calculation

**Problem**: Calculate the monthly payment for a $300,000 mortgage at 4.5% annual interest for 30 years.

**Steps**:
1. `360` `n` (30 years × 12 months = 360 payments)
2. `4.5` `ENTER` `12` `÷` `i` (4.5% ÷ 12 = monthly rate)
3. `300000` `PV` (loan amount)
4. `PMT` (calculate payment)

**Result**: $-1,520.06 (negative indicates cash outflow)

### Future Value of Investment

**Problem**: How much will $10,000 grow to in 20 years at 7% annual return?

**Steps**:
1. `20` `n` (20 years)
2. `7` `i` (7% annual interest)
3. `10000` `CHS` `PV` (initial investment, negative for cash outflow)
4. `FV` (calculate future value)

**Result**: $38,696.84

### Present Value of Annuity

**Problem**: What's the present value of receiving $1,000 per year for 10 years at 6% discount rate?

**Steps**:
1. `10` `n` (10 payments)
2. `6` `i` (6% discount rate)
3. `1000` `PMT` (annual payment)
4. `PV` (calculate present value)

**Result**: $-7,360.09

### Compound Interest - Time Calculation

**Problem**: How long will it take $5,000 to double at 8% annual interest?

**Steps**:
1. `8` `i` (8% annual interest)
2. `5000` `CHS` `PV` (initial amount, negative)
3. `10000` `FV` (target amount)
4. `n` (calculate time periods)

**Result**: 9.01 years

### Interest Rate Calculation

**Problem**: What interest rate is needed for $1,000 to grow to $2,000 in 10 years?

**Steps**:
1. `10` `n` (10 years)
2. `1000` `CHS` `PV` (initial amount)
3. `2000` `FV` (final amount)
4. `i` (calculate interest rate)

**Result**: 7.18% annual interest rate

### Car Loan Payment

**Problem**: Calculate monthly payment on a $25,000 car loan at 5.9% APR for 5 years.

**Steps**:
1. `60` `n` (5 years × 12 months)
2. `5.9` `ENTER` `12` `÷` `i` (monthly rate)
3. `25000` `PV` (loan amount)
4. `PMT` (calculate payment)

**Result**: $-483.15

### Retirement Savings Goal

**Problem**: How much must you save monthly to accumulate $1,000,000 in 30 years at 8% annual return?

**Steps**:
1. `360` `n` (30 years × 12 months)
2. `8` `ENTER` `12` `÷` `i` (monthly rate)
3. `1000000` `FV` (target amount)
4. `PMT` (calculate payment)

**Result**: $-670.98 per month

### Loan Payoff Time

**Problem**: How long to pay off $15,000 at 12% annual interest with $500 monthly payments?

**Steps**:
1. `12` `ENTER` `12` `÷` `i` (monthly rate)
2. `15000` `PV` (loan amount)
3. `500` `CHS` `PMT` (monthly payment, negative)
4. `n` (calculate periods)

**Result**: 36.56 months

---

## Cash Flow Analysis (NPV & IRR)

### Net Present Value (NPV)

**Problem**: Calculate NPV of cash flows: Initial -$1000, Year 1: $300, Year 2: $400, Year 3: $500 at 10% discount rate

**Steps**:
1. `1000` `CHS` `g` `CFo` (initial cash flow)
2. `300` `g` `CFj` (first year cash flow)
3. `400` `g` `CFj` (second year cash flow)
4. `500` `g` `CFj` (third year cash flow)
5. `10` `i` (discount rate)
6. `f` `NPV` (calculate net present value)

**Result**: $47.67

### Internal Rate of Return (IRR)

**Problem**: Find IRR for project: Initial -$50,000, Year 1: $15,000, Year 2: $20,000, Year 3: $25,000

**Steps**:
1. `50000` `CHS` `g` `CFo` (initial investment)
2. `15000` `g` `CFj` (year 1 return)
3. `20000` `g` `CFj` (year 2 return)
4. `25000` `g` `CFj` (year 3 return)
5. `f` `IRR` (calculate internal rate of return)

**Result**: 11.79% annual return

### Uneven Cash Flows with Repeated Values

**Problem**: Initial -$100,000, Years 1-3: $20,000 each, Years 4-5: $30,000 each. Find NPV at 8%.

**Steps**:
1. `100000` `CHS` `g` `CFo`
2. `20000` `g` `CFj`
3. `3` `g` `Nj` (repeat 3 times)
4. `30000` `g` `CFj`
5. `2` `g` `Nj` (repeat 2 times)
6. `8` `i`
7. `f` `NPV`

**Result**: $2,431.57

---

## Percentage Calculations

### Simple Percentage

**Problem**: What is 15% of $250?

**Steps**:
1. `250` `ENTER`
2. `15` `%`

**Result**: $37.50

### Percentage Change (Delta %)

**Problem**: Sales increased from $80,000 to $95,000. What's the percentage increase?

**Steps**:
1. `80000` `ENTER`
2. `95000` `Δ%`

**Result**: 18.75% increase

### Percentage of Total (%T)

**Problem**: $45,000 is what percentage of $180,000?

**Steps**:
1. `180000` `ENTER`
2. `45000` `%T`

**Result**: 25%

### Markup Calculation

**Problem**: A product costs $60. Add 35% markup. What's the selling price?

**Steps**:
1. `60` `ENTER`
2. `35` `%` (calculate markup amount)
3. `+` (add to cost)

**Result**: $81.00

### Discount Calculation

**Problem**: Original price $150, 20% discount. What's the sale price?

**Steps**:
1. `150` `ENTER`
2. `20` `%` (calculate discount amount)
3. `-` (subtract from original)

**Result**: $120.00

---

## Statistical Calculations

### Mean (Average)

**Problem**: Find the mean of: 10, 15, 20, 25, 30

**Steps**:
1. `f` `REG` (clear statistics)
2. `10` `Σ+`
3. `15` `Σ+`
4. `20` `Σ+`
5. `25` `Σ+`
6. `30` `Σ+`
7. `g` `x̄` (calculate mean)

**Result**: 20

### Standard Deviation

**Problem**: Find standard deviation of: 5, 10, 15, 20, 25

**Steps**:
1. `f` `REG` (clear statistics)
2. `5` `Σ+`
3. `10` `Σ+`
4. `15` `Σ+`
5. `20` `Σ+`
6. `25` `Σ+`
7. `g` `s` (standard deviation)

**Result**: 7.91

### Weighted Average

**Problem**: Test scores: 85 (weight 3), 90 (weight 2), 78 (weight 1). Find weighted average.

**Steps**:
1. `f` `REG` (clear statistics)
2. `85` `ENTER` `3` `Σ+` (score, weight)
3. `90` `ENTER` `2` `Σ+`
4. `78` `ENTER` `1` `Σ+`
5. `g` `x̄,w` (weighted mean)

**Result**: 85.67

---

## Mathematical Operations

### Power Calculation

**Problem**: Calculate 3⁴

**Steps**:
1. `3` `ENTER`
2. `4` `y^x`

**Result**: 81

### Square Root

**Problem**: Find the square root of 144

**Steps**:
1. `144` `g` `√x`

**Result**: 12

### Factorial

**Problem**: Calculate 5! (5 factorial)

**Steps**:
1. `5` `g` `n!`

**Result**: 120

### Natural Logarithm

**Problem**: Find ln(100)

**Steps**:
1. `100` `g` `LN`

**Result**: 4.61

### Exponential (e^x)

**Problem**: Calculate e²

**Steps**:
1. `2` `g` `e^x`

**Result**: 7.39

### Reciprocal

**Problem**: Find 1/8

**Steps**:
1. `8` `1/x`

**Result**: 0.125

### Compound Calculation

**Problem**: Calculate (15 + 25) × (8 - 3)

**Steps**:
1. `15` `ENTER` `25` `+` (= 40)
2. `8` `ENTER` `3` `-` (= 5)
3. `×`

**Result**: 200

---

## Depreciation Calculations

### Straight-Line Depreciation (SL)

**Problem**: Asset costs $50,000, salvage value $5,000, useful life 10 years. Annual depreciation?

**Steps**:
1. `50000` `ENTER` (cost)
2. `5000` `ENTER` (salvage)
3. `10` `f` `SL` (straight-line)

**Result**: $4,500 per year

### Sum-of-Years-Digits (SOYD)

**Problem**: Same asset, find first year depreciation using SOYD method.

**Steps**:
1. `50000` `ENTER` (cost)
2. `5000` `ENTER` (salvage)
3. `10` `ENTER` (life)
4. `1` `f` `SOYD` (year 1)

**Result**: $8,181.82

### Declining Balance (DB)

**Problem**: Asset $30,000, salvage $3,000, 5 years, 200% declining balance. Year 1 depreciation?

**Steps**:
1. `30000` `ENTER` (cost)
2. `3000` `ENTER` (salvage)
3. `5` `ENTER` (life)
4. `1` `f` `DB` (year 1)

**Result**: $12,000

---

## Amortization

### Loan Amortization

**Problem**: $200,000 loan at 6% for 30 years. How much principal and interest in first year?

**Steps**:
1. `360` `n` (30 × 12 months)
2. `6` `ENTER` `12` `÷` `i`
3. `200000` `PV`
4. `PMT` (get payment first)
5. `1` `f` `AMORT` (amortize period 1)
6. `x↔y` (view principal)
7. `RCL` `n` (recall for interest - from memory)

**Result**: Payment: $-1,199.10

### Remaining Balance

**Problem**: After 5 years of payments on above loan, what's the remaining balance?

**Steps**:
1. (Continue from Example 30)
2. `60` `f` `AMORT` (amortize 60 payments)
3. `RCL` `PV` (recall remaining balance)

**Result**: Approximately $186,108

---

## Date Calculations

### Days Between Dates

**Problem**: How many days between January 15, 2024 and March 30, 2024?

**Steps** (M.DY format):
1. `g` `M.DY` (set date format)
2. `1.152024` `ENTER`
3. `3.302024` `g` `ΔDYS`

**Result**: 75 days (actual), interest calculation varies

### Future Date

**Problem**: What date is 90 days after February 15, 2024?

**Steps**:
1. `2.152024` `ENTER`
2. `90` `g` `DATE`

**Result**: 5.152024 (May 15, 2024)

---

## Bond Calculations

### Bond Price

**Problem**: Bond with 8% coupon, 10 years to maturity, semi-annual payments, 6% yield. Find price per $100 face.

**Steps**:
1. `20` `n` (10 years × 2)
2. `3` `i` (6% ÷ 2 for semi-annual)
3. `4` `PMT` (8% ÷ 2 for coupon)
4. `100` `FV` (par value)
5. `f` `PRICE`

**Result**: $114.72

---

## Practice Tips

1. **Always Clear**: Press `f` `REG` or `ON` to clear before starting new problems
2. **Check Signs**: Cash outflows are negative (use `CHS`)
3. **Verify Units**: Ensure interest rates and time periods match (annual vs. monthly)
4. **Use ENTER**: For multi-step calculations, use `ENTER` to separate values
5. **Practice RPN**: Get comfortable with Reverse Polish Notation logic
6. **Verify Results**: Use known examples to check your technique

## Common Errors to Avoid

1. **Wrong Sign Convention**: Forgetting to make initial investments negative
2. **Mismatched Periods**: Using annual interest rate with monthly payments
3. **Forgetting ENTER**: Not using ENTER between stack operations
4. **Calculator Mode**: Not clearing previous calculations
5. **Date Format**: Using wrong date format (M.DY vs D.MY)
6. **Statistics**: Not clearing registers with `f` `REG` before new calculations


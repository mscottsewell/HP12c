# HP12c Calculator FAQ Content

<!-- This file is auto-generated from help.js -->
<!-- Edit this file and run import-faq.js to update help.js -->
<!-- Keep category key metadata unchanged -->

> **Instructions for Editing:**
> 1. Edit category titles (## headers), example names (### headers), problems, steps, and results
> 2. Keep the category key metadata unchanged (format: `[//]: # (Category Key: tvm)`)
> 3. Keep backticks (`) around button/key references in steps
> 4. After editing, run: `node import-faq.js`

---


## Practice Tips & Common Errors

[//]: # (Category Key: tips)

*(No examples - handled separately in HTML)*


## Time Value of Money (TVM)

[//]: # (Category Key: tvm)

### Mortgage Payment Calculation

**Problem:** Calculate the monthly payment for a $300,000 mortgage at 4.5% annual interest for 30 years.

**Steps:**
1. `360` `n` (30 years × 12 months = 360 payments)
2. `4.5` `ENTER` `12` `÷` `i` (4.5% ÷ 12 = monthly rate)
3. `300000` `PV` (loan amount)
4. `PMT` (calculate payment)

**Result:** $-1,520.06 (negative indicates cash outflow)

### Future Value of Investment

**Problem:** How much will $10,000 grow to in 20 years at 7% annual return?

**Steps:**
1. `20` `n` (20 years)
2. `7` `i` (7% annual interest)
3. `10000` `CHS` `PV` (initial investment, negative for cash outflow)
4. `FV` (calculate future value)

**Result:** $38,696.84

### Present Value of Annuity

**Problem:** What's the present value of receiving $1,000 per year for 10 years at 6% discount rate?

**Steps:**
1. `10` `n` (10 payments)
2. `6` `i` (6% discount rate)
3. `1000` `PMT` (annual payment)
4. `PV` (calculate present value)

**Result:** $-7,360.09

### Compound Interest - Time Calculation

**Problem:** How long will it take $5,000 to double at 8% annual interest?

**Steps:**
1. `8` `i` (8% annual interest)
2. `5000` `CHS` `PV` (initial amount, negative)
3. `10000` `FV` (target amount)
4. `n` (calculate time periods)

**Result:** 9.01 years

### Interest Rate Calculation

**Problem:** What interest rate is needed for $1,000 to grow to $2,000 in 10 years?

**Steps:**
1. `10` `n` (10 years)
2. `1000` `CHS` `PV` (initial amount)
3. `2000` `FV` (final amount)
4. `i` (calculate interest rate)

**Result:** 7.18% annual interest rate

### Car Loan Payment

**Problem:** Calculate monthly payment on a $25,000 car loan at 5.9% APR for 5 years.

**Steps:**
1. `60` `n` (5 years × 12 months)
2. `5.9` `ENTER` `12` `÷` `i` (monthly rate)
3. `25000` `PV` (loan amount)
4. `PMT` (calculate payment)

**Result:** $-483.15

### Retirement Savings Goal

**Problem:** How much must you save monthly to accumulate $1,000,000 in 30 years at 8% annual return?

**Steps:**
1. `360` `n` (30 years × 12 months)
2. `8` `ENTER` `12` `÷` `i` (monthly rate)
3. `1000000` `FV` (target amount)
4. `PMT` (calculate payment)

**Result:** $-670.98 per month

### Loan Payoff Time

**Problem:** How long to pay off $15,000 at 12% annual interest with $500 monthly payments?

**Steps:**
1. `12` `ENTER` `12` `÷` `i` (monthly rate)
2. `15000` `PV` (loan amount)
3. `500` `CHS` `PMT` (monthly payment, negative)
4. `n` (calculate periods)

**Result:** 36.56 months

### TVM with BEGIN Mode (Annuity Due)

**Problem:** Lease requires $500/month payment at the BEGINNING of each month for 3 years at 6% annual (0.5% monthly). What's the present value?

**Steps:**
1. `g-BEG` (set to BEGIN mode - indicator shows)
2. `36` `n` (3 years × 12 months)
3. `0.5` `i` (monthly rate)
4. `500` `CHS` `PMT` (payment at beginning)
5. `0` `FV` (no residual)
6. `PV` (calculate present value)
7. `g-END` (return to normal mode)

**Result:** $16,234.85 (compare to $16,165.51 in END mode)


## Cash Flow Analysis (NPV & IRR)

[//]: # (Category Key: cashflow)

### Net Present Value (NPV)

**Problem:** Calculate NPV of cash flows: Initial -$1000, Year 1: $300, Year 2: $400, Year 3: $500 at 10% discount rate

**Steps:**
1. `1000` `CHS` `g-CFo` (initial cash flow)
2. `300` `g-CFj` (first year cash flow)
3. `400` `g-CFj` (second year cash flow)
4. `500` `g-CFj` (third year cash flow)
5. `10` `i` (discount rate)
6. `f-NPV` (calculate net present value)

**Result:** $47.67

### Internal Rate of Return (IRR)

**Problem:** Find IRR for project: Initial -$50,000, Year 1: $15,000, Year 2: $20,000, Year 3: $25,000

**Steps:**
1. `50000` `CHS` `g-CFo` (initial investment)
2. `15000` `g-CFj` (year 1 return)
3. `20000` `g-CFj` (year 2 return)
4. `25000` `g-CFj` (year 3 return)
5. `f-IRR` (calculate internal rate of return)

**Result:** 8.90% annual return

### Uneven Cash Flows with Repeated Values

**Problem:** Initial -$100,000, Years 1-3: $20,000 each, Years 4-5: $30,000 each. Find NPV at 8%.

**Steps:**
1. `100000` `CHS` `g-CFo` (initial investment)
2. `20000` `g-CFj` (cash flow)
3. `3` `g-Nj` (repeat 3 times)
4. `30000` `g-CFj` (cash flow)
5. `2` `g-Nj` (repeat 2 times)
6. `8` `i` (discount rate)
7. `f-NPV` (calculate NPV)

**Result:** $2,431.57


## Bond Valuation

[//]: # (Category Key: bonds)

### Bond Price Calculation

**Problem:** A bond has 10 semi-annual periods remaining, pays $25 coupon per period, $1000 face value. If market yield is 6% semi-annual, what's the bond price?

**Steps:**
1. `10` `n` (periods to maturity)
2. `6` `i` (yield per period)
3. `25` `PMT` (coupon payment)
4. `1000` `FV` (face value)
5. `f-PRICE` (calculate bond price)

**Result:** $926.40 (92.64% of par)

### Yield to Maturity

**Problem:** A bond trading at $950 has 8 periods remaining, $30 coupon per period, $1000 face value. What's the YTM?

**Steps:**
1. `8` `n` (periods)
2. `950` `CHS` `PV` (current price, negative)
3. `30` `PMT` (coupon)
4. `1000` `FV` (face value)
5. `f-YTM` (calculate yield)

**Result:** 3.77% per period

### Yield to Call

**Problem:** A callable bond has 12 periods until call date, currently trading at $1,050, pays $35 coupon per period, and has a call price of $1,020. What's the yield to call?

**Steps:**
1. `12` `n` (periods to call date)
2. `1050` `CHS` `PV` (current price, negative)
3. `35` `PMT` (coupon payment)
4. `1020` `FV` (call price)
5. `f-YTM` (calculate yield to call)

**Result:** 2.96% per period


## Percentage Calculations

[//]: # (Category Key: percentage)

### Simple Percentage

**Problem:** What is 15% of $250?

**Steps:**
1. `250` `ENTER` (base amount)
2. `15` `%` (calculate percentage)

**Result:** $37.50

### Percentage Change (Delta %)

**Problem:** Sales increased from $80,000 to $95,000. What's the percentage increase?

**Steps:**
1. `80000` `ENTER` (old value)
2. `95000` `Δ%` (new value, calculate % change)

**Result:** 18.75% increase

### Percentage of Total (%T)

**Problem:** $45,000 is what percentage of $180,000?

**Steps:**
1. `180000` `ENTER` (total amount)
2. `45000` `%T` (part amount, calculate % of total)

**Result:** 25%

### Markup Calculation

**Problem:** A product costs $60. Add 35% markup. What's the selling price?

**Steps:**
1. `60` `ENTER` (cost)
2. `35` `%` (calculate markup amount)
3. `+` (add to cost)

**Result:** $81.00

### Discount Calculation

**Problem:** Original price $150, 20% discount. What's the sale price?

**Steps:**
1. `150` `ENTER` (original price)
2. `20` `%` (calculate discount amount)
3. `-` (subtract from original)

**Result:** $120.00


## Statistical Calculations

[//]: # (Category Key: statistics)

### Mean (Average)

**Problem:** Find the mean of: 10, 15, 20, 25, 30

**Steps:**
1. `10` `Σ+` (add to data set)
2. `15` `Σ+` (add to data set)
3. `20` `Σ+` (add to data set)
4. `25` `Σ+` (add to data set)
5. `30` `Σ+` (add to data set)
6. `g-x̄` (calculate mean)

**Result:** 20

### Standard Deviation

**Problem:** Find standard deviation of: 5, 10, 15, 20, 25

**Steps:**
1. `5` `Σ+` (add to data set)
2. `10` `Σ+` (add to data set)
3. `15` `Σ+` (add to data set)
4. `20` `Σ+` (add to data set)
5. `25` `Σ+` (add to data set)
6. `g-s` (standard deviation)

**Result:** 7.91

### Weighted Average

**Problem:** Test scores: 85 (weight 3), 90 (weight 2), 78 (weight 1). Find weighted average.

**Steps:**
1. `85` `ENTER` `3` `Σ+` (score, weight)
2. `90` `ENTER` `2` `Σ+` (score, weight)
3. `78` `ENTER` `1` `Σ+` (score, weight)
4. `g-x̄,w` (weighted mean)

**Result:** 85.67

### Linear Regression Mean

**Problem:** Data points (2,3), (4,5), (6,7), (8,9). Find mean using linear regression.

**Steps:**
1. `3` `ENTER` `2` `Σ+` (add point: y=3, x=2)
2. `5` `ENTER` `4` `Σ+` (add point: y=5, x=4)
3. `7` `ENTER` `6` `Σ+` (add point: y=7, x=6)
4. `9` `ENTER` `8` `Σ+` (add point: y=9, x=8)
5. `g-x̄,r` (calculate means from regression)

**Result:** x̄ = 5.0, ȳ = 6.0

### Y Estimate from Regression

**Problem:** Using same data, estimate Y when X = 10.

**Steps:**
1. (Continue from previous data)
2. `10` `g-ŷ,r` (estimate y for x=10)

**Result:** ŷ = 11.0

### X Estimate from Regression

**Problem:** Using same data, estimate X when Y = 8.

**Steps:**
1. (Continue from previous data)
2. `8` `g-x̂` (estimate x for y=8)

**Result:** x̂ = 7.0


## Mathematical Operations

[//]: # (Category Key: math)

### Power Calculation

**Problem:** Calculate 3⁴

**Steps:**
1. `3` `ENTER` (base)
2. `4` `y^x` (exponent, calculate power)

**Result:** 81

### Square Root

**Problem:** Find the square root of 144

**Steps:**
1. `144` `g-√x` (calculate square root)

**Result:** 12

### Factorial

**Problem:** Calculate 5! (5 factorial)

**Steps:**
1. `5` `g-n!` (calculate factorial)

**Result:** 120

### Natural Logarithm

**Problem:** Find ln(100)

**Steps:**
1. `100` `g-LN` (calculate natural log)

**Result:** 4.61

### Exponential (e^x)

**Problem:** Calculate e²

**Steps:**
1. `2` `g-e^x` (calculate e to the power)

**Result:** 7.39

### Reciprocal

**Problem:** Find 1/8

**Steps:**
1. `8` `1/x` (calculate reciprocal)

**Result:** 0.125

### Compound Calculation

**Problem:** Calculate (15 + 25) × (8 - 3)

**Steps:**
1. `15` `ENTER` `25` `+` (first sum = 40)
2. `8` `ENTER` `3` `-` (second difference = 5)
3. `×` (multiply results)

**Result:** 200


## Depreciation Calculations

[//]: # (Category Key: depreciation)

### Straight-Line Depreciation (SL)

**Problem:** Asset costs $50,000, salvage value $5,000, useful life 10 years. Annual depreciation?

**Steps:**
1. `50000` `ENTER` (cost)
2. `5000` `ENTER` (salvage)
3. `10` `f-SL` (straight-line)

**Result:** $4,500 per year

### Sum-of-Years-Digits (SOYD)

**Problem:** Same asset, find first year depreciation using SOYD method.

**Steps:**
1. `50000` `ENTER` (cost)
2. `5000` `ENTER` (salvage)
3. `10` `ENTER` (life)
4. `1` `f-SOYD` (year 1)

**Result:** $8,181.82

### Declining Balance (DB)

**Problem:** Asset $30,000, salvage $3,000, 5 years, 200% declining balance. Year 1 depreciation?

**Steps:**
1. `30000` `ENTER` (cost)
2. `3000` `ENTER` (salvage)
3. `5` `ENTER` (life)
4. `1` `f-DB` (year 1)

**Result:** $12,000


## Amortization

[//]: # (Category Key: amortization)

### Loan Amortization

**Problem:** $200,000 loan at 6% for 30 years. How much principal and interest in first year?

**Steps:**
1. `360` `n` (30 × 12 months)
2. `6` `ENTER` `12` `÷` `i` (monthly rate)
3. `200000` `PV` (loan amount)
4. `PMT` (get payment first)
5. `1` `f-AMORT` (amortize period 1)
6. `x↔y` (view principal)
7. `RCL` `n` (recall for interest - from memory)

**Result:** Payment: $-1,199.10

### Remaining Balance

**Problem:** After 5 years of payments on above loan, what's the remaining balance?

**Steps:**
1. (Continue from previous example)
2. `60` `f-AMORT` (amortize 60 payments)
3. `RCL` `PV` (recall remaining balance)

**Result:** Approximately $186,108

### Amortization with Principal & Interest Detail

**Problem:** For a $100,000 loan at 6% annual (0.5% monthly) for 30 years, find the principal and interest in the first payment.

**Steps:**
1. `360` `n` (30 × 12 months)
2. `0.5` `i` (monthly rate)
3. `100000` `PV` (loan amount)
4. `PMT` (calculates -$599.55)
5. `1` `ENTER` `1` `f-AMORT` (amortize payment 1 to 1)
6. (X register shows principal paid)
7. `x↔y` (swap to see interest in Y register)

**Result:** Principal = $99.55, Interest = $500.00


## Date Calculations

[//]: # (Category Key: dates)

### Days Between Dates

**Problem:** How many days between January 15, 2024 and March 30, 2024?

**Steps:**
1. `g-M.DY` (set date format)
2. `1.152024` `ENTER` (first date)
3. `3.302024` `g-ΔDYS` (second date, calculate days)

**Result:** 75 days (actual), interest calculation varies

### Future Date

**Problem:** What date is 90 days after February 15, 2024?

**Steps:**
1. `2.152024` `ENTER` (start date)
2. `90` `g-DATE` (number of days, calculate future date)

**Result:** 5.152024 (May 15, 2024)


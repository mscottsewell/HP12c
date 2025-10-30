# HP12c Calculator Functions Documentation

This document provides detailed information about all implemented calculator functions, including formulas, usage examples, and reference calculations.

## Table of Contents
- [Financial Functions (TVM)](#financial-functions-tvm)
- [Statistical Functions](#statistical-functions)
- [Date Functions](#date-functions)
- [Bond Functions](#bond-functions)
- [Depreciation Functions](#depreciation-functions)
- [Amortization Functions](#amortization-functions)
- [Cash Flow Functions](#cash-flow-functions)

---

## Financial Functions (TVM)

### Time Value of Money Calculations

The HP12c uses five financial registers for Time Value of Money calculations:
- **n**: Number of compounding periods
- **i**: Interest rate per period (as percentage)
- **PV**: Present Value
- **PMT**: Payment per period
- **FV**: Future Value

#### calculateN()
**Purpose**: Calculate the number of periods needed for an investment or loan.

**Formula**:
```
When i ≠ 0:
n = ln((PMT - FV×i) / (PV×i + PMT)) / ln(1 + i)

When i = 0:
n = -(PV + FV) / PMT
```

**Example**: How long to pay off a $10,000 loan at 1% monthly with $300 payments?
```
10000 PV
1 i
300 CHS PMT
0 FV
n → 39.52 months
```

#### calculateI()
**Purpose**: Calculate the interest rate per period using iterative Newton-Raphson method.

**Method**: Iteratively solves the TVM equation by adjusting the interest rate until:
```
PV + PMT × ((1-(1+i)^-n)/(i)) + FV/(1+i)^n = 0
```

**Example**: What's the monthly rate on a $10,000 loan with $300 payments over 40 months?
```
40 n
10000 PV
300 CHS PMT
0 FV
i → 1.0% per month
```

#### calculatePV()
**Purpose**: Calculate present value.

**Formula**:
```
PV = PMT × ((1 - (1+i)^-n) / i) + FV / (1+i)^n
```

#### calculatePMT()
**Purpose**: Calculate payment amount.

**Formula**:
```
PMT = (PV × i × (1+i)^n + FV × i) / ((1+i)^n - 1)
```

**Example**: Monthly payment on $100,000 mortgage at 6% annual (0.5% monthly) for 30 years?
```
360 n
0.5 i
100000 PV
0 FV
PMT → -$599.55
```

#### calculateFV()
**Purpose**: Calculate future value.

**Formula**:
```
FV = -PV × (1+i)^n - PMT × (((1+i)^n - 1) / i)
```

---

## Statistical Functions

### Data Entry
- **Σ+**: Add data point (x in X register, y in Y register)
- **Σ-**: Remove data point

The calculator maintains six statistical registers:
- R₁₁: n (count of data points)
- R₁₂: Σx (sum of x values)
- R₁₃: Σy (sum of y values)
- R₁₄: Σx² (sum of x squared)
- R₁₅: Σy² (sum of y squared)
- R₁₆: Σxy (sum of x times y)

### meanWeighted()
**Purpose**: Calculate weighted mean where y values are weights.

**Formula**:
```
x̄w = Σ(x·y) / Σy
ȳ = Σy / n
```

**Returns**: Weighted mean in X, arithmetic mean of y in Y

### meanLinearReg()
**Purpose**: Calculate arithmetic means for linear regression.

**Formula**:
```
x̄ = Σx / n
ȳ = Σy / n
```

**Returns**: Mean of x in X register, mean of y in Y register

### standardDeviation()
**Purpose**: Calculate sample standard deviations.

**Formula** (sample standard deviation):
```
sx = √((Σx² - (Σx)²/n) / (n-1))
sy = √((Σy² - (Σy)²/n) / (n-1))
```

**Returns**: sx in X register, sy in Y register

**Example**: Data points (2,3), (4,5), (6,7), (8,9)
```
3 ENTER 2 Σ+
5 ENTER 4 Σ+
7 ENTER 6 Σ+
9 ENTER 8 Σ+
g s → sx = 2.582, sy = 2.582
```

### yEstimate()
**Purpose**: Estimate y value from x using linear regression: ŷ = a + bx

**Formula**:
```
slope m = (n·Σxy - Σx·Σy) / (n·Σx² - (Σx)²)
intercept b = (Σy - m·Σx) / n
ŷ = b + m·x
```

**Returns**: ŷ in X register, slope m in Y register

**Example**: Predict y when x=10 (using data from above)
```
10 g ŷ,r → ŷ = 11.0
```

### xEstimate()
**Purpose**: Estimate x value from y using linear regression: x̂ = (y - a) / b

**Formula**:
```
x̂ = (y - b) / m
```

**Returns**: x̂ in X register, 1/slope in Y register

---

## Date Functions

The HP12c supports two date formats:
- **M.DY**: Month.DayYear (e.g., 3.152024 = March 15, 2024)
- **D.MY**: Day.MonthYear (e.g., 15.032024 = 15 March 2024)

### date()
**Purpose**: Calculate future or past date by adding/subtracting days.

**Input**:
- Y register: Starting date (M.DDYYYY or DD.MMYYYY)
- X register: Number of days to add (negative to subtract)

**Returns**:
- X register: New date
- Y register: Day of week (1=Monday, 7=Sunday)

**Example**: What date is 30 days after January 1, 2024?
```
1.012024 ENTER
30 g DATE → 1.312024 (January 31, 2024)
```

### daysBetween()
**Purpose**: Calculate days between two dates.

**Input**:
- Y register: Earlier date
- X register: Later date

**Returns**:
- X register: Actual days (calendar days)
- Y register: 30/360 days (bond basis)

**Example**: Days from Jan 15, 2024 to Mar 20, 2024
```
1.152024 ENTER
3.202024 g ΔDYS → 65 actual days
```

---

## Bond Functions

### bondPrice()
**Purpose**: Calculate bond price given yield to maturity.

**Formula**:
```
Price = PV(coupons) + PV(redemption)
      = PMT × ((1-(1+i)^-n)/i) + FV/(1+i)^n
```

**Input** (using TVM registers):
- n: Periods to maturity
- i: Yield per period (%)
- PMT: Coupon payment per period
- FV: Face value (redemption value)

**Returns**: Bond price as % of par

**Example**: 10-period bond, 5% coupon ($50/period), $1000 face, 6% yield
```
10 n
6 i
50 PMT
1000 FV
f PRICE → $926.40
```

### bondYTM()
**Purpose**: Calculate yield to maturity given bond price.

**Input** (using TVM registers):
- n: Periods to maturity
- PV: Bond price (negative)
- PMT: Coupon payment per period
- FV: Face value

**Returns**: Yield to maturity as percentage

**Method**: Uses Newton-Raphson iterative method to solve for yield.

**Example**: What's the YTM of a bond priced at $926.40?
```
10 n
926.40 CHS PV
50 PMT
1000 FV
f YTM → 6.0%
```

---

## Depreciation Functions

All depreciation functions use these TVM registers:
- **PV**: Initial cost
- **FV**: Salvage value
- **n**: Useful life in periods
- **i**: Depreciation rate (for DB method)

The X register should contain the period number for which to calculate depreciation.

### straightLineDepreciation()
**Purpose**: Calculate straight-line depreciation.

**Formula**:
```
Annual Depreciation = (Cost - Salvage) / Life
```

**Example**: $10,000 asset, $1,000 salvage, 5-year life
```
10000 PV
1000 FV
5 n
f SL → $1,800 per year
```

### sumOfYearsDepreciation()
**Purpose**: Calculate sum-of-years'-digits depreciation.

**Formula**:
```
Sum of Years = n(n+1)/2
Year k Depreciation = (Cost - Salvage) × (n-k+1) / Sum
```

**Returns**:
- X register: Depreciation for the period
- Y register: Remaining book value

**Example**: Year 1 depreciation for asset above
```
10000 PV
1000 FV
5 n
1 f SOYD → $3,000 (year 1)
```

### decliningBalanceDepreciation()
**Purpose**: Calculate declining balance depreciation.

**Formula**:
```
Per-period Rate = (i/100) / n
Year k Depreciation = Book Value × Per-period Rate
```

Note: For 200% double-declining with n=5, the per-period rate is (200/100)/5 = 40%

**Returns**:
- X register: Depreciation for the period
- Y register: Remaining book value

**Example**: Year 1 double-declining (200%) for asset above
```
10000 PV
1000 FV
5 n
200 i
1 f DB → $4,000 (year 1)
```

---

## Amortization Functions

### amortization()
**Purpose**: Calculate principal and interest for a range of loan payments.

**Input**:
- TVM registers must contain loan details (n, i, PV, PMT, FV)
- Y register: Starting payment number
- X register: Ending payment number

**Returns**:
- X register: Total principal paid
- Y register: Total interest paid
- Z register: Remaining balance

**Example**: First payment on $100,000 loan at 0.5% monthly
```
360 n
0.5 i
100000 PV
PMT (calculates payment)
1 ENTER 1 f AMORT
→ X: $99.55 principal
→ Y: $500.00 interest
→ Z: $99,900.45 remaining
```

### amortizationInterest()
**Purpose**: Calculate interest portion only for a range of payments.

**Input**: Same as amortization()

**Returns**: Total interest paid in X register

**Example**: Interest for first 12 payments
```
1 ENTER 12 f INT → Total interest for year 1
```

---

## Cash Flow Functions

### Cash Flow Entry
- **CFo**: Initial cash flow (CF₀)
- **CFj**: Subsequent cash flow
- **Nj**: Number of times to repeat last CFj

### calculateNPV()
**Purpose**: Calculate Net Present Value of cash flows.

**Formula**:
```
NPV = CF₀ + Σ(CFⱼ / (1+i)^j)
```

**Input**:
- Cash flows stored via CFo, CFj, Nj
- i register: Discount rate per period

**Returns**: NPV in X register

**Example**: CF₀=-1000, CF₁=300, CF₂=400, CF₃=500 at 10%
```
1000 CHS CFo
300 CFj
400 CFj
500 CFj
10 i
f NPV → -$21.04
```

### calculateIRR()
**Purpose**: Calculate Internal Rate of Return.

**Method**: Uses Newton-Raphson to find the rate where NPV = 0.

**Input**: Cash flows stored via CFo, CFj, Nj

**Returns**: IRR as percentage in X register

**Example**: Using same cash flows as above
```
f IRR → 8.9%
```

---

## Testing

Open `test-functions.html` in a web browser to run automated tests for all implemented functions. The test suite validates:
- Financial TVM calculations
- Statistical regression and means
- Date arithmetic
- Bond pricing and yields
- All depreciation methods
- Amortization schedules
- NPV and IRR calculations

---

## References

- HP 12C Owner's Handbook and Problem-Solving Guide
- HP 12C Platinum Solutions Handbook
- Financial calculator formulas and algorithms

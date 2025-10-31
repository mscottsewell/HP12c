// HP12c Help System - Examples and Documentation

const exampleData = {
    tvm: {
        title: "Time Value of Money - Basics",
        examples: [
            {
                name: "Future Value of $1.00",
                problem: "If $1,000 is deposited in an account earning 6% per year, what will the account balance be at the end of 8 years?",
                steps: [
                    "`8` `n` (8 years)",
                    "`6` `i` (6% annual interest)",
                    "`1000` `CHS` `PV` (initial deposit, negative for cash outflow)",
                    "`FV` (calculate future value)"
                ],
                result: "$1,593.85"
            },
            {
                name: "Present Value of $1.00",
                problem: "What is the present value of the right to receive $11,000 in four years at a discount rate of 10% per year?",
                steps: [
                    "`4` `n` (4 years)",
                    "`10` `i` (10% discount rate)",
                    "`11000` `FV` (future amount to receive)",
                    "`PV` (calculate present value)"
                ],
                result: "$-7,513.15 (negative = amount you'd pay today)"
            },
            {
                name: "Future Value of $1.00 Per Period",
                problem: "What will be the value of an Individual Retirement Account in 30 years assuming deposits of $2,000 are made at the end of each year and the account earns 7.5% per year?",
                steps: [
                    "`30` `n` (30 years)",
                    "`7.5` `i` (7.5% annual interest)",
                    "`2000` `CHS` `PMT` (annual deposit, negative)",
                    "`FV` (calculate future value)"
                ],
                result: "$206,798.81"
            },
            {
                name: "Future Value of Investment",
                problem: "How much will $10,000 grow to in 20 years at 7% annual return?",
                steps: [
                    "`20` `n` (20 years)",
                    "`7` `i` (7% annual interest)",
                    "`10000` `CHS` `PV` (initial investment, negative for cash outflow)",
                    "`FV` (calculate future value)"
                ],
                result: "$38,696.84"
            },
            {
                name: "Present Value of Annuity (Annual Payments)",
                problem: "What is the present value of the right to receive a payment of $36,000 at the end of every year for 15 years at a discount rate of 8%?",
                steps: [
                    "`15` `n` (15 payments)",
                    "`8` `i` (8% discount rate)",
                    "`36000` `PMT` (annual payment)",
                    "`PV` (calculate present value)"
                ],
                result: "$-308,131.19"
            },
            {
                name: "Present Value of Annuity (Monthly Payments)",
                problem: "What is the present value of the right to receive a payment of $3,000 at the end of every month for 15 years at a discount rate of 8% per year?",
                steps: [
                    "`180` `n` (15 years × 12 months)",
                    "`8` `ENTER` `12` `÷` `i` (8% ÷ 12 = monthly rate)",
                    "`3000` `PMT` (monthly payment)",
                    "`PV` (calculate present value)"
                ],
                result: "$-313,921.78"
            },
            {
                name: "Compound Interest - Time Calculation",
                problem: "How long will it take $5,000 to double at 8% annual interest?",
                steps: [
                    "`8` `i` (8% annual interest)",
                    "`5000` `CHS` `PV` (initial amount, negative)",
                    "`10000` `FV` (target amount)",
                    "`n` (calculate time periods)"
                ],
                result: "9.01 years"
            },
            {
                name: "Interest Rate Calculation",
                problem: "What interest rate is needed for $1,000 to grow to $2,000 in 10 years?",
                steps: [
                    "`10` `n` (10 years)",
                    "`1000` `CHS` `PV` (initial amount)",
                    "`2000` `FV` (final amount)",
                    "`i` (calculate interest rate)"
                ],
                result: "7.18% annual interest rate"
            },
            {
                name: "Sinking Fund Factor",
                problem: "How much must be deposited at the end of each month into an account that earns 6% interest to have an account balance of $50,000 at the end of 10 years?",
                steps: [
                    "`120` `n` (10 years × 12 months)",
                    "`6` `ENTER` `12` `÷` `i` (monthly rate)",
                    "`50000` `FV` (target amount)",
                    "`PMT` (calculate payment)"
                ],
                result: "$-305.10 per month"
            },
            {
                name: "Retirement Savings Goal",
                problem: "To have $1,000,000 in 25 years with 8% annual return, how much to invest annually?",
                steps: [
                    "`25` `n` (25 years)",
                    "`8` `i` (8% annual interest)",
                    "`1000000` `FV` (retirement goal)",
                    "`PMT` (calculate annual payment)"
                ],
                result: "$-13,678.78 per year"
            }
        ]
    },
    math: {
        title: "Mathematical Operations",
        examples: [
            {
                name: "Power Calculation",
                problem: "Calculate 3⁴",
                steps: [
                    "`3` `ENTER` (base)",
                    "`4` `y^x` (exponent, calculate power)"
                ],
                result: "81"
            },
            {
                name: "Square Root",
                problem: "Find the square root of 144",
                steps: [
                    "`144` `g-√x` (calculate square root)"
                ],
                result: "12"
            },
            {
                name: "Factorial",
                problem: "Calculate 5! (5 factorial)",
                steps: [
                    "`5` `g-n!` (calculate factorial)"
                ],
                result: "120"
            },
            {
                name: "Natural Logarithm",
                problem: "Find ln(100)",
                steps: [
                    "`100` `g-LN` (calculate natural log)"
                ],
                result: "4.61"
            },
            {
                name: "Exponential (e^x)",
                problem: "Calculate e²",
                steps: [
                    "`2` `g-e^x` (calculate e to the power)"
                ],
                result: "7.39"
            },
            {
                name: "Reciprocal",
                problem: "Find 1/8",
                steps: [
                    "`8` `1/x` (calculate reciprocal)"
                ],
                result: "0.125"
            },
            {
                name: "Compound Calculation",
                problem: "Calculate (15 + 25) × (8 - 3)",
                steps: [
                    "`15` `ENTER` `25` `+` (first sum = 40)",
                    "`8` `ENTER` `3` `-` (second difference = 5)",
                    "`×` (multiply results)"
                ],
                result: "200"
            }
        ]
    },
    percentage: {
        title: "Percentage Calculations",
        examples: [
            {
                name: "Simple Percentage",
                problem: "What is 15% of $250?",
                steps: [
                    "`250` `ENTER` (base amount)",
                    "`15` `%` (calculate percentage)"
                ],
                result: "$37.50"
            },
            {
                name: "Percentage Change (Delta %)",
                problem: "Sales increased from $80,000 to $95,000. What's the percentage increase?",
                steps: [
                    "`80000` `ENTER` (old value)",
                    "`95000` `Δ%` (new value, calculate % change)"
                ],
                result: "18.75% increase"
            },
            {
                name: "Percentage of Total (%T)",
                problem: "$45,000 is what percentage of $180,000?",
                steps: [
                    "`180000` `ENTER` (total amount)",
                    "`45000` `%T` (part amount, calculate % of total)"
                ],
                result: "25%"
            },
            {
                name: "Markup Calculation",
                problem: "A product costs $60. Add 35% markup. What's the selling price?",
                steps: [
                    "`60` `ENTER` (cost)",
                    "`35` `%` (calculate markup amount)",
                    "`+` (add to cost)"
                ],
                result: "$81.00"
            },
            {
                name: "Discount Calculation",
                problem: "Original price $150, 20% discount. What's the sale price?",
                steps: [
                    "`150` `ENTER` (original price)",
                    "`20` `%` (calculate discount amount)",
                    "`-` (subtract from original)"
                ],
                result: "$120.00"
            }
        ]
    },
    statistics: {
        title: "Statistical Calculations",
        examples: [
            {
                name: "Mean (Average)",
                problem: "Find the mean of: 10, 15, 20, 25, 30",
                steps: [
                    "`10` `Σ+` (add to data set)",
                    "`15` `Σ+` (add to data set)",
                    "`20` `Σ+` (add to data set)",
                    "`25` `Σ+` (add to data set)",
                    "`30` `Σ+` (add to data set)",
                    "`g-x̄` (calculate mean)"
                ],
                result: "20"
            },
            {
                name: "Standard Deviation",
                problem: "Find standard deviation of: 5, 10, 15, 20, 25",
                steps: [
                    "`5` `Σ+` (add to data set)",
                    "`10` `Σ+` (add to data set)",
                    "`15` `Σ+` (add to data set)",
                    "`20` `Σ+` (add to data set)",
                    "`25` `Σ+` (add to data set)",
                    "`g-s` (standard deviation)"
                ],
                result: "7.91"
            },
            {
                name: "Weighted Average",
                problem: "Test scores: 85 (weight 3), 90 (weight 2), 78 (weight 1). Find weighted average.",
                steps: [
                    "`85` `ENTER` `3` `Σ+` (score, weight)",
                    "`90` `ENTER` `2` `Σ+` (score, weight)",
                    "`78` `ENTER` `1` `Σ+` (score, weight)",
                    "`g-x̄,w` (weighted mean)"
                ],
                result: "85.67"
            }
        ]
    },
    dates: {
        title: "Date Calculations",
        examples: [
            {
                name: "Days Between Dates",
                problem: "How many days between January 15, 2024 and March 30, 2024?",
                steps: [
                    "`g-M.DY` (set date format)",
                    "`1.152024` `ENTER` (first date)",
                    "`3.302024` `g-ΔDYS` (second date, calculate days)"
                ],
                result: "75 days (actual), interest calculation varies"
            },
            {
                name: "Future Date",
                problem: "What date is 90 days after February 15, 2024?",
                steps: [
                    "`2.152024` `ENTER` (start date)",
                    "`90` `g-DATE` (number of days, calculate future date)"
                ],
                result: "5.152024 (May 15, 2024)"
            }
        ]
    },
    loans: {
        title: "Loans & Financing",
        examples: [
            {
                name: "Mortgage Payment Calculation",
                problem: "Calculate the monthly payment for a $300,000 mortgage at 4.5% annual interest for 30 years.",
                steps: [
                    "`360` `n` (30 years × 12 months = 360 payments)",
                    "`4.5` `ENTER` `12` `÷` `i` (4.5% ÷ 12 = monthly rate)",
                    "`300000` `PV` (loan amount)",
                    "`PMT` (calculate payment)"
                ],
                result: "$-1,520.06 (negative indicates cash outflow)"
            },
            {
                name: "Car Loan Payment",
                problem: "Calculate monthly payment on a $25,000 car loan at 5.9% APR for 5 years.",
                steps: [
                    "`60` `n` (5 years × 12 months)",
                    "`5.9` `ENTER` `12` `÷` `i` (monthly rate)",
                    "`25000` `PV` (loan amount)",
                    "`PMT` (calculate payment)"
                ],
                result: "$-483.15"
            },
            {
                name: "Loan Payoff Time",
                problem: "How long to pay off $15,000 at 12% annual interest with $500 monthly payments?",
                steps: [
                    "`12` `ENTER` `12` `÷` `i` (monthly rate)",
                    "`15000` `PV` (loan amount)",
                    "`500` `CHS` `PMT` (monthly payment, negative)",
                    "`n` (calculate periods)"
                ],
                result: "36.56 months"
            }
        ]
    },
    investment: {
        title: "Investment Analysis",
        examples: [
            {
                name: "Internal Rate of Return (Level Income)",
                problem: "A property is purchased for $500,000 and generates annual net income of $40,000. After 10 years it is sold for $650,000. What is the IRR?",
                steps: [
                    "`500000` `CHS` `g-CFo` (initial investment)",
                    "`40000` `g-CFj` (annual income)",
                    "`9` `g-Nj` (repeat 9 times for years 1-9)",
                    "`40000` `ENTER` `650000` `+` `g-CFj` (year 10: income + sale)",
                    "`f-IRR` (calculate IRR)"
                ],
                result: "9.89% annual return"
            },
            {
                name: "Net Present Value (NPV)",
                problem: "Calculate NPV of cash flows: Initial -$1000, Year 1: $300, Year 2: $400, Year 3: $500 at 10% discount rate",
                steps: [
                    "`1000` `CHS` `g-CFo` (initial cash flow)",
                    "`300` `g-CFj` (first year cash flow)",
                    "`400` `g-CFj` (second year cash flow)",
                    "`500` `g-CFj` (third year cash flow)",
                    "`10` `i` (discount rate)",
                    "`f-NPV` (calculate net present value)"
                ],
                result: "$-21.04"
            }
        ]
    },
    bonds: {
        title: "Bond Valuation",
        examples: [
            {
                name: "Bond Price Calculation",
                problem: "A bond has 10 semi-annual periods remaining, pays $25 coupon per period, $1000 face value. If market yield is 3% per semi-annual period (6% annual), what's the bond price?",
                steps: [
                    "`10` `n` (periods to maturity)",
                    "`3` `i` (yield per period - semi-annual)",
                    "`25` `PMT` (coupon payment)",
                    "`1000` `FV` (face value)",
                    "`f-PRICE` (calculate bond price)"
                ],
                result: "$957.35 (95.74% of par)"
            },
            {
                name: "Yield to Maturity",
                problem: "A bond trading at $950 has 8 periods remaining, $30 coupon per period, $1000 face value. What's the YTM?",
                steps: [
                    "`8` `n` (periods)",
                    "`950` `CHS` `PV` (current price, negative)",
                    "`30` `PMT` (coupon)",
                    "`1000` `FV` (face value)",
                    "`f-YTM` (calculate yield)"
                ],
                result: "3.77% per period"
            }
        ]
    },
    depreciation: {
        title: "Depreciation Calculations",
        examples: [
            {
                name: "Straight-Line Depreciation (SL)",
                problem: "Asset costs $50,000, salvage value $5,000, useful life 10 years. Annual depreciation?",
                steps: [
                    "`50000` `ENTER` (cost)",
                    "`5000` `ENTER` (salvage)",
                    "`10` `f-SL` (straight-line)"
                ],
                result: "$4,500 per year"
            },
            {
                name: "Sum-of-Years-Digits (SOYD)",
                problem: "Same asset, find first year depreciation using SOYD method.",
                steps: [
                    "`50000` `ENTER` (cost)",
                    "`5000` `ENTER` (salvage)",
                    "`10` `ENTER` (life)",
                    "`1` `f-SOYD` (year 1)"
                ],
                result: "$8,181.82"
            },
            {
                name: "Declining Balance (DB)",
                problem: "Asset $30,000, salvage $3,000, 5 years, 200% declining balance. Year 1 depreciation?",
                steps: [
                    "`30000` `ENTER` (cost)",
                    "`3000` `ENTER` (salvage)",
                    "`5` `ENTER` (life)",
                    "`1` `f-DB` (year 1)"
                ],
                result: "$12,000"
            }
        ]
    },
    tips: {
        title: "Practice Tips & Common Errors",
        examples: [] // This is handled differently in the HTML
    }
};























let currentCategory = null;
let currentCategoryKey = null;
let helpExpanded = false;

function toggleFAQ() {
    const helpContent = document.getElementById('help-content');
    const helpSection = document.querySelector('.help-section');
    const faqBtn = document.getElementById('faq-btn');
    
    if (helpExpanded) {
        // Collapse everything
        collapseFAQ();
    } else {
        // Expand and show category menu
        helpContent.style.display = 'block';
        helpSection.classList.remove('collapsed');
        faqBtn.style.display = 'none';
        showCategoryMenu();
        helpExpanded = true;
    }
}

function collapseFAQ() {
    const helpContent = document.getElementById('help-content');
    const helpSection = document.querySelector('.help-section');
    const faqBtn = document.getElementById('faq-btn');
    
    helpContent.style.display = 'none';
    helpSection.classList.add('collapsed');
    faqBtn.style.display = 'block';
    helpExpanded = false;
}

function showCategoryMenu() {
    document.getElementById('help-categories-view').style.display = 'block';
    document.getElementById('help-tips').style.display = 'none';
    document.getElementById('help-example-list').style.display = 'none';
    document.getElementById('help-example-detail').style.display = 'none';
}

function backToCategoryMenu() {
    showCategoryMenu();
}

function toggleHelp(mode) {
    // Deprecated - kept for compatibility if needed
    toggleFAQ();
}

function showHelpDefault() {
    // Deprecated - replaced by category menu
    showCategoryMenu();
}

function showExamplesMenu() {
    // Deprecated - replaced by category menu
    showCategoryMenu();
}

function showCategory(categoryKey) {
    currentCategoryKey = categoryKey;
    
    // Handle tips specially - show the tips view instead of example list
    if (categoryKey === 'tips') {
        document.getElementById('help-categories-view').style.display = 'none';
        document.getElementById('help-tips').style.display = 'block';
        document.getElementById('help-example-list').style.display = 'none';
        document.getElementById('help-example-detail').style.display = 'none';
        return;
    }
    
    currentCategory = exampleData[categoryKey];
    
    document.getElementById('help-categories-view').style.display = 'none';
    document.getElementById('help-tips').style.display = 'none';
    document.getElementById('help-example-list').style.display = 'block';
    document.getElementById('help-example-detail').style.display = 'none';
    
    document.getElementById('category-title').textContent = currentCategory.title;
    
    const buttonContainer = document.getElementById('example-buttons');
    buttonContainer.innerHTML = '';
    
    currentCategory.examples.forEach((example, index) => {
        const btn = document.createElement('button');
        btn.className = 'help-example-btn';
        btn.textContent = example.name;
        btn.onclick = () => showExample(index);
        buttonContainer.appendChild(btn);
    });
}

function formatStep(step) {
    // Replace backtick content with code tags for shaded background
    return step.replace(/`([^`]+)`/g, (match, content) => {
        // Wrap all content in code tag for shaded background
        return `<code>${content}</code>`;
    });
}

function showExample(exampleIndex) {
    const example = currentCategory.examples[exampleIndex];
    
    document.getElementById('help-example-list').style.display = 'none';
    document.getElementById('help-example-detail').style.display = 'block';
    
    // Set the title in the header
    document.getElementById('example-title').textContent = example.name;
    
    const content = document.getElementById('example-content');
    content.innerHTML = `
        <div class="example-problem">
            <strong>Problem:</strong> ${example.problem}
        </div>
        <div class="example-steps">
            <div class="steps-header" onclick="toggleSteps(this)">
                <strong>Steps</strong> <span class="toggle-icon">▶ Click to show</span>
            </div>
            <ol class="steps-list" style="display: none;">
                ${example.steps.map(step => `<li>${formatStep(step)}</li>`).join('')}
            </ol>
        </div>
        <div class="example-result">
            <strong>Result:</strong> ${example.result}
        </div>
    `;
}

function toggleSteps(header) {
    const stepsList = header.nextElementSibling;
    const icon = header.querySelector('.toggle-icon');
    const helpContent = document.getElementById('help-content');
    
    if (stepsList.style.display === 'none') {
        stepsList.style.display = 'block';
        icon.textContent = '▼ Click to hide';
        // Expand the help content area to fit the steps
        helpContent.style.maxHeight = '600px';
    } else {
        stepsList.style.display = 'none';
        icon.textContent = '▶ Click to show';
        // Restore original max height
        helpContent.style.maxHeight = '400px';
    }
}

function backToExampleList() {
    document.getElementById('help-example-detail').style.display = 'none';
    document.getElementById('help-example-list').style.display = 'block';
}

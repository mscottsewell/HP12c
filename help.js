// HP12c Help System - Examples and Documentation

const exampleData = {
    tips: {
        title: "Practice Tips & Common Errors",
        examples: [] // This is handled differently in the HTML
    },
    tvm: {
        title: "Time Value of Money (TVM)",
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
                name: "Present Value of Annuity",
                problem: "What's the present value of receiving $1,000 per year for 10 years at 6% discount rate?",
                steps: [
                    "`10` `n` (10 payments)",
                    "`6` `i` (6% discount rate)",
                    "`1000` `PMT` (annual payment)",
                    "`PV` (calculate present value)"
                ],
                result: "$-7,360.09"
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
                name: "Retirement Savings Goal",
                problem: "How much must you save monthly to accumulate $1,000,000 in 30 years at 8% annual return?",
                steps: [
                    "`360` `n` (30 years × 12 months)",
                    "`8` `ENTER` `12` `÷` `i` (monthly rate)",
                    "`1000000` `FV` (target amount)",
                    "`PMT` (calculate payment)"
                ],
                result: "$-670.98 per month"
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
    cashflow: {
        title: "Cash Flow Analysis (NPV & IRR)",
        examples: [
            {
                name: "Net Present Value (NPV)",
                problem: "Calculate NPV of cash flows: Initial -$1000, Year 1: $300, Year 2: $400, Year 3: $500 at 10% discount rate",
                steps: [
                    "`1000` `CHS` `g` `CFo` (initial cash flow)",
                    "`300` `g` `CFj` (first year cash flow)",
                    "`400` `g` `CFj` (second year cash flow)",
                    "`500` `g` `CFj` (third year cash flow)",
                    "`10` `i` (discount rate)",
                    "`f` `NPV` (calculate net present value)"
                ],
                result: "$47.67"
            },
            {
                name: "Internal Rate of Return (IRR)",
                problem: "Find IRR for project: Initial -$50,000, Year 1: $15,000, Year 2: $20,000, Year 3: $25,000",
                steps: [
                    "`50000` `CHS` `g` `CFo` (initial investment)",
                    "`15000` `g` `CFj` (year 1 return)",
                    "`20000` `g` `CFj` (year 2 return)",
                    "`25000` `g` `CFj` (year 3 return)",
                    "`f` `IRR` (calculate internal rate of return)"
                ],
                result: "8.90% annual return"
            },
            {
                name: "Uneven Cash Flows with Repeated Values",
                problem: "Initial -$100,000, Years 1-3: $20,000 each, Years 4-5: $30,000 each. Find NPV at 8%.",
                steps: [
                    "`100000` `CHS` `g` `CFo` (initial investment)",
                    "`20000` `g` `CFj` (cash flow)",
                    "`3` `g` `Nj` (repeat 3 times)",
                    "`30000` `g` `CFj` (cash flow)",
                    "`2` `g` `Nj` (repeat 2 times)",
                    "`8` `i` (discount rate)",
                    "`f` `NPV` (calculate NPV)"
                ],
                result: "$2,431.57"
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
                    "`g` `x̄` (calculate mean)"
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
                    "`g` `s` (standard deviation)"
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
                    "`g` `x̄,w` (weighted mean)"
                ],
                result: "85.67"
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
                    "`144` `g` `√x` (calculate square root)"
                ],
                result: "12"
            },
            {
                name: "Factorial",
                problem: "Calculate 5! (5 factorial)",
                steps: [
                    "`5` `g` `n!` (calculate factorial)"
                ],
                result: "120"
            },
            {
                name: "Natural Logarithm",
                problem: "Find ln(100)",
                steps: [
                    "`100` `g` `LN` (calculate natural log)"
                ],
                result: "4.61"
            },
            {
                name: "Exponential (e^x)",
                problem: "Calculate e²",
                steps: [
                    "`2` `g` `e^x` (calculate e to the power)"
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
    depreciation: {
        title: "Depreciation Calculations",
        examples: [
            {
                name: "Straight-Line Depreciation (SL)",
                problem: "Asset costs $50,000, salvage value $5,000, useful life 10 years. Annual depreciation?",
                steps: [
                    "`50000` `ENTER` (cost)",
                    "`5000` `ENTER` (salvage)",
                    "`10` `f` `SL` (straight-line)"
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
                    "`1` `f` `SOYD` (year 1)"
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
                    "`1` `f` `DB` (year 1)"
                ],
                result: "$12,000"
            }
        ]
    },
    amortization: {
        title: "Amortization",
        examples: [
            {
                name: "Loan Amortization",
                problem: "$200,000 loan at 6% for 30 years. How much principal and interest in first year?",
                steps: [
                    "`360` `n` (30 × 12 months)",
                    "`6` `ENTER` `12` `÷` `i` (monthly rate)",
                    "`200000` `PV` (loan amount)",
                    "`PMT` (get payment first)",
                    "`1` `f` `AMORT` (amortize period 1)",
                    "`x↔y` (view principal)",
                    "`RCL` `n` (recall for interest - from memory)"
                ],
                result: "Payment: $-1,199.10"
            },
            {
                name: "Remaining Balance",
                problem: "After 5 years of payments on above loan, what's the remaining balance?",
                steps: [
                    "(Continue from previous example)",
                    "`60` `f` `AMORT` (amortize 60 payments)",
                    "`RCL` `PV` (recall remaining balance)"
                ],
                result: "Approximately $186,108"
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
                    "`g` `M.DY` (set date format)",
                    "`1.152024` `ENTER` (first date)",
                    "`3.302024` `g` `ΔDYS` (second date, calculate days)"
                ],
                result: "75 days (actual), interest calculation varies"
            },
            {
                name: "Future Date",
                problem: "What date is 90 days after February 15, 2024?",
                steps: [
                    "`2.152024` `ENTER` (start date)",
                    "`90` `g` `DATE` (number of days, calculate future date)"
                ],
                result: "5.152024 (May 15, 2024)"
            }
        ]
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

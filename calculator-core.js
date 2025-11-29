/**
 * HP12c Calculator Core - Pure calculation functions
 * These functions contain no DOM dependencies and can be tested independently
 */

/**
 * @typedef {Object} TVMParams
 * @property {number} n - Number of periods
 * @property {number} i - Interest rate per period (as percentage)
 * @property {number} pv - Present value
 * @property {number} pmt - Payment per period
 * @property {number} fv - Future value
 * @property {boolean} [beginMode=false] - Whether payments are at beginning of period
 */

/**
 * Calculate Future Value
 * @param {number} n - Number of periods
 * @param {number} i - Interest rate per period (percentage)
 * @param {number} pv - Present value
 * @param {number} pmt - Payment per period
 * @param {boolean} [beginMode=false] - Payments at beginning of period
 * @returns {number} Future value
 */
function calculateFV(n, i, pv, pmt = 0, beginMode = false) {
    const rate = i / 100;
    if (rate === 0) {
        return -pv - pmt * n;
    }
    const factor = Math.pow(1 + rate, n);
    let pmtFactor = (factor - 1) / rate;
    if (beginMode) {
        pmtFactor = pmtFactor * (1 + rate);
    }
    return -pv * factor - pmt * pmtFactor;
}

/**
 * Calculate Present Value
 * @param {number} n - Number of periods
 * @param {number} i - Interest rate per period (percentage)
 * @param {number} pmt - Payment per period
 * @param {number} fv - Future value
 * @param {boolean} [beginMode=false] - Payments at beginning of period
 * @returns {number} Present value
 */
function calculatePV(n, i, pmt = 0, fv = 0, beginMode = false) {
    const rate = i / 100;
    if (rate === 0) {
        return -pmt * n - fv;
    }
    let pmtFactor = (1 - Math.pow(1 + rate, -n)) / rate;
    if (beginMode) {
        pmtFactor = pmtFactor * (1 + rate);
    }
    const pvPmt = pmt * pmtFactor;
    const pvFv = fv / Math.pow(1 + rate, n);
    return -(pvPmt + pvFv);
}

/**
 * Calculate Payment
 * @param {number} n - Number of periods
 * @param {number} i - Interest rate per period (percentage)
 * @param {number} pv - Present value
 * @param {number} fv - Future value
 * @param {boolean} [beginMode=false] - Payments at beginning of period
 * @returns {number} Payment per period
 */
function calculatePMT(n, i, pv, fv = 0, beginMode = false) {
    const rate = i / 100;
    if (rate === 0) {
        return -(pv + fv) / n;
    }
    const factor = Math.pow(1 + rate, n);
    let pmt = (pv * rate * factor + fv * rate) / (factor - 1);
    if (beginMode) {
        pmt = pmt / (1 + rate);
    }
    return -pmt;
}

/**
 * Calculate Number of Periods
 * @param {number} i - Interest rate per period (percentage)
 * @param {number} pv - Present value
 * @param {number} pmt - Payment per period
 * @param {number} fv - Future value
 * @param {boolean} [beginMode=false] - Payments at beginning of period
 * @returns {number} Number of periods
 */
function calculateN(i, pv, pmt = 0, fv = 0, beginMode = false) {
    const rate = i / 100;
    
    if (rate === 0) {
        if (pmt === 0) return 0;
        return -(pv + fv) / pmt;
    }
    
    let pmtAdj = pmt;
    if (beginMode) {
        pmtAdj = pmt / (1 + rate);
    }
    
    const numerator = pmtAdj - fv * rate;
    const denominator = pv * rate + pmtAdj;
    
    if (denominator === 0 || numerator / denominator <= 0) {
        return 0;
    }
    
    return Math.log(numerator / denominator) / Math.log(1 + rate);
}

/**
 * Calculate Interest Rate (iterative)
 * @param {number} n - Number of periods
 * @param {number} pv - Present value
 * @param {number} pmt - Payment per period
 * @param {number} fv - Future value
 * @param {boolean} [beginMode=false] - Payments at beginning of period
 * @returns {number} Interest rate per period (percentage)
 */
function calculateI(n, pv, pmt = 0, fv = 0, beginMode = false) {
    if (n === 0) return 0;
    
    // Initial guess
    let guess = 0.01;
    if (pv !== 0 && n > 0) {
        const simpleGuess = Math.abs((pmt * n + fv - pv) / (pv * n));
        if (simpleGuess > 0 && simpleGuess < 0.5) {
            guess = simpleGuess;
        }
    }
    
    const maxIterations = 100;
    const tolerance = 0.00001;
    
    for (let iter = 0; iter < maxIterations; iter++) {
        const factor = Math.pow(1 + guess, n);
        
        let npv;
        if (guess === 0) {
            npv = pv + pmt * n + fv;
        } else {
            let annuityFactor = (factor - 1) / (guess * factor);
            if (beginMode) {
                annuityFactor = annuityFactor * (1 + guess);
            }
            npv = pv + pmt * annuityFactor + fv / factor;
        }
        
        // Numerical derivative
        const delta = 0.00001;
        const guessPlusDelta = guess + delta;
        const factorPlus = Math.pow(1 + guessPlusDelta, n);
        let npvPlus;
        if (guessPlusDelta === 0) {
            npvPlus = pv + pmt * n + fv;
        } else {
            let annuityFactorPlus = (factorPlus - 1) / (guessPlusDelta * factorPlus);
            if (beginMode) {
                annuityFactorPlus = annuityFactorPlus * (1 + guessPlusDelta);
            }
            npvPlus = pv + pmt * annuityFactorPlus + fv / factorPlus;
        }
        
        const derivative = (npvPlus - npv) / delta;
        
        if (Math.abs(npv) < tolerance) {
            return guess * 100;
        }
        
        if (derivative !== 0) {
            guess = guess - npv / derivative;
        }
        
        if (guess < -0.99) guess = -0.99;
        if (guess > 10) guess = 10;
    }
    
    return guess * 100;
}

/**
 * Calculate Net Present Value
 * @param {number} rate - Discount rate (percentage)
 * @param {number[]} cashFlows - Array of cash flows (CF0, CF1, CF2, ...)
 * @param {number[]} [counts] - Array of counts for each cash flow
 * @returns {number} Net Present Value
 */
function calculateNPV(rate, cashFlows, counts = null) {
    if (!cashFlows || cashFlows.length === 0) return 0;
    
    const r = rate / 100;
    let npv = cashFlows[0]; // CF0 is not discounted
    
    let period = 1;
    for (let j = 1; j < cashFlows.length; j++) {
        const count = counts ? (counts[j] || 1) : 1;
        for (let k = 0; k < count; k++) {
            npv += cashFlows[j] / Math.pow(1 + r, period);
            period++;
        }
    }
    
    return npv;
}

/**
 * Calculate Internal Rate of Return
 * @param {number[]} cashFlows - Array of cash flows (CF0, CF1, CF2, ...)
 * @param {number[]} [counts] - Array of counts for each cash flow
 * @returns {number} IRR as percentage
 */
function calculateIRR(cashFlows, counts = null) {
    if (!cashFlows || cashFlows.length < 2) return 0;
    
    let irr = 0.1; // Initial guess 10%
    const maxIterations = 100;
    const tolerance = 0.0001;
    
    for (let iter = 0; iter < maxIterations; iter++) {
        let npv = cashFlows[0];
        let dnpv = 0;
        let period = 1;
        
        for (let j = 1; j < cashFlows.length; j++) {
            const count = counts ? (counts[j] || 1) : 1;
            for (let k = 0; k < count; k++) {
                const factor = Math.pow(1 + irr, period);
                npv += cashFlows[j] / factor;
                dnpv -= period * cashFlows[j] / (factor * (1 + irr));
                period++;
            }
        }
        
        if (Math.abs(npv) < tolerance) {
            return irr * 100;
        }
        
        if (dnpv !== 0) {
            irr = irr - npv / dnpv;
        }
    }
    
    return irr * 100;
}

/**
 * Calculate sample standard deviation
 * @param {number[]} data - Array of data points
 * @returns {number} Sample standard deviation
 */
function calculateStdDev(data) {
    if (!data || data.length < 2) return 0;
    
    const n = data.length;
    const mean = data.reduce((a, b) => a + b, 0) / n;
    const variance = data.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / (n - 1);
    
    return Math.sqrt(variance);
}

/**
 * Calculate mean
 * @param {number[]} data - Array of data points
 * @returns {number} Arithmetic mean
 */
function calculateMean(data) {
    if (!data || data.length === 0) return 0;
    return data.reduce((a, b) => a + b, 0) / data.length;
}

/**
 * Calculate weighted mean
 * @param {Array<{value: number, weight: number}>} data - Array of value/weight pairs
 * @returns {number} Weighted mean
 */
function calculateWeightedMean(data) {
    if (!data || data.length === 0) return 0;
    
    const totalWeight = data.reduce((sum, d) => sum + d.weight, 0);
    if (totalWeight === 0) return 0;
    
    const weightedSum = data.reduce((sum, d) => sum + d.value * d.weight, 0);
    return weightedSum / totalWeight;
}

/**
 * Calculate days between two dates
 * @param {Date} date1 - First date
 * @param {Date} date2 - Second date
 * @returns {{actual: number, basis360: number}} Days between dates
 */
function calculateDaysBetween(date1, date2) {
    const msPerDay = 1000 * 60 * 60 * 24;
    const actual = Math.round((date2 - date1) / msPerDay);
    
    // 30/360 basis
    const y1 = date1.getFullYear();
    const m1 = date1.getMonth() + 1;
    const d1 = date1.getDate();
    const y2 = date2.getFullYear();
    const m2 = date2.getMonth() + 1;
    const d2 = date2.getDate();
    
    const basis360 = (y2 - y1) * 360 + (m2 - m1) * 30 + (d2 - d1);
    
    return { actual, basis360 };
}

/**
 * Calculate straight-line depreciation
 * @param {number} cost - Initial cost
 * @param {number} salvage - Salvage value
 * @param {number} life - Useful life in years
 * @returns {number} Annual depreciation
 */
function calculateStraightLineDepreciation(cost, salvage, life) {
    if (life === 0) return 0;
    return (cost - salvage) / life;
}

/**
 * Calculate sum-of-years-digits depreciation for a specific year
 * @param {number} cost - Initial cost
 * @param {number} salvage - Salvage value
 * @param {number} life - Useful life in years
 * @param {number} year - Year to calculate (1-based)
 * @returns {number} Depreciation for that year
 */
function calculateSOYDDepreciation(cost, salvage, life, year) {
    if (year < 1 || year > life || life === 0) return 0;
    
    const depreciableBase = cost - salvage;
    const sumOfYears = (life * (life + 1)) / 2;
    const yearsRemaining = life - year + 1;
    
    return (depreciableBase * yearsRemaining) / sumOfYears;
}

/**
 * Calculate declining balance depreciation for a specific year
 * @param {number} cost - Initial cost
 * @param {number} salvage - Salvage value
 * @param {number} life - Useful life in years
 * @param {number} year - Year to calculate (1-based)
 * @param {number} [factor=200] - Declining balance factor (200 = double declining)
 * @returns {number} Depreciation for that year
 */
function calculateDBDepreciation(cost, salvage, life, year, factor = 200) {
    if (year < 1 || year > life || life === 0) return 0;
    
    const rate = (factor / 100) / life;
    let bookValue = cost;
    let depreciation = 0;
    
    for (let yr = 1; yr <= year; yr++) {
        depreciation = bookValue * rate;
        if (bookValue - depreciation < salvage) {
            depreciation = bookValue - salvage;
        }
        bookValue -= depreciation;
    }
    
    return depreciation;
}

// Export for Node.js/Jest testing
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        calculateFV,
        calculatePV,
        calculatePMT,
        calculateN,
        calculateI,
        calculateNPV,
        calculateIRR,
        calculateStdDev,
        calculateMean,
        calculateWeightedMean,
        calculateDaysBetween,
        calculateStraightLineDepreciation,
        calculateSOYDDepreciation,
        calculateDBDepreciation
    };
}

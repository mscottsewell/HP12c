// HP12c Financial Calculator Simulator

/**
 * @typedef {Object} CalculatorStep
 * @property {number} stepNum - The step number (1-based)
 * @property {string} button - The button(s) pressed (e.g., "5", "f-NPV", "PV ENTER")
 * @property {string} operation - Human-readable operation description
 * @property {string} result - The formatted result value
 */

/**
 * @typedef {Object} CashFlow
 * @property {number} value - The cash flow amount
 * @property {number} count - Number of times this cash flow repeats
 */

/**
 * HP12c Financial Calculator Class
 * Implements a full simulation of the HP12c financial calculator
 * with RPN (Reverse Polish Notation) stack operations.
 */
class HP12cCalculator {
    /**
     * Creates a new HP12c Calculator instance
     */
    constructor() {
        /** @type {number[]} X, Y, Z, T registers (RPN stack) */
        this.stack = [0, 0, 0, 0];
        
        /** @type {number[]} Storage registers .0-.9 and R0-R9 */
        this.memory = new Array(20).fill(0);
        
        // Settings - load displayDecimals first before setting display
        /** @type {boolean} Begin/End mode for annuity calculations */
        this.beginMode = false;
        
        /** @type {number} Number of decimal places to display (0-9) */
        // Load displayDecimals from localStorage, default to 4 if not set
        this.displayDecimals = localStorage.getItem('hp12c_displayDecimals') 
            ? parseInt(localStorage.getItem('hp12c_displayDecimals')) 
            : 4;
        
        /** @type {'MDY'|'DMY'} Date format setting */
        this.dateFormat = 'MDY';
        
        /** @type {boolean} Program mode flag */
        this.programMode = false;
        
        /** @type {Array<{x: number, y: number}>} Statistics data pairs */
        this.stats = [];
        
        // Now set display with correct decimal places
        /** @type {string} Current display value as formatted string */
        this.display = (0).toFixed(this.displayDecimals);
        
        /** @type {boolean} Ready for new number entry */
        this.isNewNumber = true;
        
        /** @type {boolean} Currently typing a number */
        this.isTyping = false;
        
        /** @type {boolean} Decimal point has been entered */
        this.decimalEntered = false;
        /** @type {boolean} Whether stack-lift is enabled for next digit */
        this.stackLiftEnabled = true;
        
        /** @type {number} Last X register value (for LASTx recall) */
        this.lastX = 0;
        
        // Function key states
        /** @type {boolean} f (gold) function key active */
        this.fActive = false;
        
        /** @type {boolean} g (blue) function key active */
        this.gActive = false;
        
        // Financial registers (TVM)
        /** @type {number} Number of periods */
        this.n = 0;
        
        /** @type {number} Interest rate per period (percentage) */
        this.i = 0;
        
        /** @type {number} Present value */
        this.pv = 0;
        
        /** @type {number} Payment per period */
        this.pmt = 0;
        
        /** @type {number} Future value */
        this.fv = 0;
        
        // Cash flow registers
        /** @type {number[]} Array of cash flow values (CF0, CF1, ...) */
        this.cashFlows = [];
        
        /** @type {number[]} Array of counts for each cash flow (Nj) */
        this.cashFlowCounts = [];
        
        // Steps tracking
        /** @type {CalculatorStep[]} Array of recorded calculation steps */
        this.steps = [];
        
        /** @type {number} Current step counter */
        this.stepCounter = 0;
        
        /** @type {boolean} Last step was a number entry */
        this.lastStepWasNumber = false;
        
        /** @type {boolean} Last TVM operation was a calculation (not storage) */
        this.lastTVMWasCalculation = false;
        
        /** @type {boolean} Just completed a calculation */
        this.justCalculated = false;
        
        /** @type {CalculatorStep|null} Backup of step before modification (for CLx undo) */
        this.previousStep = null;
        
        /** @type {boolean} Already saved a backup for current step */
        this.stepBackupSaved = false;

        /** @type {('store'|'recall'|null)} Pending memory register operation */
        this.waitingForRegister = null;

        /** @type {boolean} User manually hid storage panel */
        this.storagePanelHiddenByUser = false;

        /** @type {{type:'store'|'recall', stepIndex:number, displayBefore:string}|null} Track in-progress memory step until digit chosen */
        this.pendingMemory = null;
        
        // Double-tap detection for CLx
        /** @type {string|null} Last key pressed (for double-tap detection) */
        this.lastKeyPressed = null;
        
        this.initializeEventListeners();
        this.updateDisplay();
        this.showReadyStep();
    }
    
    initializeEventListeners() {
        // Calculator button listeners
        document.querySelectorAll('.calc-btn').forEach(button => {
            button.addEventListener('click', (e) => {
                e.preventDefault();
                this.handleButtonPress(button);
            });
        });
    }
    
    handleButtonPress(button) {
        const key = button.dataset.key;
        const primary = button.dataset.primary;
        const fFunction = button.dataset.f;
        const gFunction = button.dataset.g;
        
        // Add visual feedback
        button.classList.add('pressed');
        setTimeout(() => button.classList.remove('pressed'), 200);
        
        let functionUsed = primary;
        
        // Handle display format setting (f + digit sets decimal places) - do this first
        if (this.fActive && this.isDigit(key)) {
            const decimals = parseInt(key);
            this.displayDecimals = decimals;
            // Save to localStorage to persist across browser sessions
            localStorage.setItem('hp12c_displayDecimals', decimals.toString());
            
            // Reformat the current display value with new decimal places
            const currentValue = parseFloat(this.stack[0]);
            this.display = this.formatNumber(currentValue);
            
            // Reformat all existing steps with new decimal places
            this.steps.forEach(step => {
                // Parse the numeric result and reformat with new decimals
                const numericResult = parseFloat(step.result.replace(/,/g, ''));
                if (!isNaN(numericResult)) {
                    step.result = this.formatNumber(numericResult);
                }
            });
            
            // Re-render all steps with updated formatting
            const stepsContainer = document.getElementById('steps-container');
            stepsContainer.innerHTML = '';
            if (this.steps.length === 0) {
                this.showReadyStep();
            } else {
                this.steps.forEach(step => this.renderStep(step));
            }
            
            this.fActive = false;
            this.updateFunctionIndicators();
            this.updateDisplay();
            return;
        }
        
        // Determine which function to execute and create combined display for f/g functions
        let displayButton = primary;
        if (this.fActive && fFunction && fFunction.trim() !== '') {
            functionUsed = fFunction;
            displayButton = 'f-' + fFunction;  // Combined display
            this.fActive = false;
            this.updateFunctionIndicators();
        } else if (this.gActive && gFunction && gFunction.trim() !== '') {
            functionUsed = gFunction;
            displayButton = 'g-' + gFunction;  // Combined display
            this.gActive = false;
            this.updateFunctionIndicators();
        } else if (this.fActive && key === 'plus') {
            // Special case: f-+ toggles stack debug
            functionUsed = 'XYZT';
            displayButton = 'f-XYZT';
            this.fActive = false;
            this.updateFunctionIndicators();
        }
        
        // Capture display value BEFORE executing the function
        const displayBeforeExecution = this.display;
        
        // Execute the function
        this.executeFunction(key, functionUsed);

        // If STO/RCL pressed, mark pending memory operation to merge digit into same step
        if (functionUsed === 'STO' || functionUsed === 'RCL') {
            // We'll add/append step now (without digit) and finalize when digit arrives
            // Record pending state so a subsequent digit updates this step instead of starting number entry
            this.pendingMemory = { type: functionUsed === 'STO' ? 'store' : 'recall', stepIndex: this.steps.length, displayBefore: displayBeforeExecution };
        }

        // If this is the register digit immediately after STO/RCL, finalize before any step creation
        if (this.pendingMemory && this.waitingForRegister === null && this.isDigit(key) && functionUsed === key) {
            // Finalize pending STO/RCL step without creating a separate digit step
            const pending = this.pendingMemory;
            const stepObj = this.steps[pending.stepIndex];
            if (stepObj) {
                stepObj.button = stepObj.button + ' ' + key; // e.g., STO 1
                if (pending.type === 'store') {
                    stepObj.operation = `Store X to register .${key}`;
                    stepObj.result = this.formatNumber(parseFloat(pending.displayBefore.replace(/,/g,'')) || this.getX());
                } else {
                    stepObj.operation = `Recall register .${key} to X`;
                    stepObj.result = this.display; // after recall
                }
                // Re-render steps
                const stepsContainer = document.getElementById('steps-container');
                if (stepsContainer) {
                    stepsContainer.innerHTML = '';
                    this.steps.forEach(s => this.renderStep(s));
                }
            }
            this.pendingMemory = null;
            this.lastStepWasNumber = false; // next digit should start new step
            this.updateDisplay();
            return; // Skip normal step recording block
        }
        
                // Record the step (group consecutive number entries and operations that follow them)
                // Only treat digit keys as number entry when they're used as digits (not when g-shift maps them to a function).
                const isNumberEntry = (this.isDigit(key) && functionUsed === key) || key === 'decimal' || key === 'eex' || key === 'chs';
                const isOperatorOrStorage = ['plus', 'minus', 'multiply', 'divide', 'n', 'i', 'pv', 'pmt', 'fv', 
                                                                             'enter', 'sto', 'rcl', 'percent', 'delta-percent',
                                                                             'percent-total', 'power', 'reciprocal', 'sum'].includes(key) ||
                                     ['CFo', 'CFj', 'Nj'].includes(functionUsed);
        
        // Use the appropriate display value for the step
        // For TVM calculations and NPV/IRR, use the calculated value (after execution)
        // For operations that modify existing steps, use current display to show the result
        // For TVM storage operations, use the value before execution (what was stored)
        // For new standalone operations, use the value before execution
        // For swap operations, use the value after the swap
        const isTVMCalculation = this.lastTVMWasCalculation && ['n', 'i', 'pv', 'pmt', 'fv'].includes(key);
        const isCalculationFunction = ['NPV', 'IRR', 'ΔDYS', 'DATE'].includes(functionUsed);
        const isSwapOperation = functionUsed === 'x↔y';
        const isSigmaOperation = ['Σ+', 'Σ-'].includes(functionUsed);
        const isStatCalculation = ['x̄,w', 'x̄', 'x̄,r', 'ŷ,r', 'x̂', 'x̂,r', 's'].includes(functionUsed);
        const stepDisplayValue = (isTVMCalculation || isCalculationFunction || isSwapOperation || isStatCalculation) ? this.display :
                     ((isSigmaOperation && this.lastStepWasNumber) ? displayBeforeExecution :
                      ((isOperatorOrStorage && this.lastStepWasNumber) ? this.display : displayBeforeExecution));
        
        // Don't record steps for f and g key presses, CLRG, CLx, or ON
        if (key === 'f' || key === 'g') {
            // Don't reset lastStepWasNumber - f and g are just modifiers
            this.updateDisplay();
            return;
        }
        
        // Don't add a step for ON - it just clears everything
        if (key === 'ON' || functionUsed === 'ON') {
            this.lastStepWasNumber = false;
            this.updateDisplay();
            return;
        }
        
        // Don't add a step for CLRG/REG since it clears all steps
        if (functionUsed === 'CLRG' || functionUsed === 'REG') {
            this.lastStepWasNumber = false;
            this.updateDisplay();
            return;
        }
        
        // Don't add a step for CLx - it removes the last step instead
        if (functionUsed === 'CLx') {
            // After removing the step in clearX(), check if we should restore lastStepWasNumber
            // This is handled in clearX() function
            this.updateDisplay();
            return;
        }

        // Don't add a step for stack debug toggle (f-XYZT)
        if (functionUsed === 'XYZT') {
            this.updateDisplay();
            return;
        }
        
        // Special functions that should always appear as separate steps
        const isSpecialFunction = ['D.MY', 'M.DY', 'ΔDYS'].includes(functionUsed);
        
        // Check if last step was a special function (to prevent grouping numbers with it)
        const lastStepButton = this.steps.length > 0 ? (this.steps[this.steps.length - 1].button || '') : '';
        const lastStepWasSpecial = lastStepButton.includes('g-D.MY') || lastStepButton.includes('g-M.DY') || lastStepButton.includes('g-ΔDYS');
        
        if (isSpecialFunction) {
            // Always create a new step for special functions
            this.addStep(displayButton, functionUsed, stepDisplayValue);
            this.lastStepWasNumber = false;
        } else if (this.pendingMemory && (functionUsed === 'STO' || functionUsed === 'RCL')) {
            // Create the base STO/RCL step now (will be completed after digit)
            this.addStep(displayButton, functionUsed, displayBeforeExecution);
            // Do NOT mark as number; keep lastStepWasNumber false but allow digit to update this step
            this.lastStepWasNumber = false;
        } else if (isNumberEntry && this.lastStepWasNumber && !lastStepWasSpecial) {
            // Update the last step instead of creating a new one (but not if last was special)
            this.updateLastStep(displayButton, functionUsed, this.display);
            this.lastStepWasNumber = true;
        } else if (isOperatorOrStorage && this.lastStepWasNumber && !lastStepWasSpecial) {
            // Append operator/storage to the number entry on same row (but not if last was special)
            this.updateLastStep(displayButton, functionUsed, stepDisplayValue);
            this.lastStepWasNumber = false;  // Reset so next operation starts new row
        } else {
            this.addStep(displayButton, functionUsed, stepDisplayValue);
            this.lastStepWasNumber = isNumberEntry;
        }

        // If user pressed something other than digit after STO/RCL, abort pending merge
        if (this.pendingMemory && !(functionUsed === 'STO' || functionUsed === 'RCL')) {
            this.pendingMemory = null;
        }
        
        // Update display
        this.updateDisplay();
    }
    
    executeFunction(key, func) {
        // Track last function for double-tap detection (must be before early returns)
        const isDoubleTapCLx = (func === 'CLx' && this.lastKeyPressed === 'CLx');
        
        switch (func) {
            case 'f':
                this.fActive = !this.fActive;
                this.gActive = false;
                this.updateFunctionIndicators();
                this.lastKeyPressed = func;
                return;
            case 'g':
                this.gActive = !this.gActive;
                this.fActive = false;
                this.updateFunctionIndicators();
                this.lastKeyPressed = func;
                return;
            case 'ON':
                this.clearAll();
                this.lastKeyPressed = func;
                return;
        }

        // If we're waiting for a memory register selection, treat digit as register, not number entry
        if (this.waitingForRegister && this.isDigit(key)) {
            const register = parseInt(key);
            if (this.waitingForRegister === 'store') {
                this.store(register);
            } else if (this.waitingForRegister === 'recall') {
                this.recall(register);
            }
            this.waitingForRegister = null;
            // Do not enter number typing mode; just return so handleButtonPress can finalize step
            return;
        }
        
        // Number entry - only if the function being executed is the primary (not an f/g function)
        if (this.isDigit(key) && this.isDigit(func)) {
            this.enterDigit(key);
            this.updateDisplay();
            return;
        }
        
        // Decimal only works when using primary function (not f/g functions)
        if (func === '.' || (func === 'decimal' && key === 'decimal')) {
            this.enterDecimal();
            this.updateDisplay();
            return;
        }
        
        // EEX only works when using primary function (not f/g functions)
        if (func === 'EEX' || (func === 'eex' && key === 'eex')) {
            this.enterExponent();
            this.updateDisplay();
            return;
        }
        
        // Clear functions based on function used
        if (func === 'CLx') {
            // Clear display and steps only (not financial registers)
            this.stack = [0, 0, 0, 0];
            this.display = '0';
            this.isNewNumber = false;
            this.isTyping = false;
            this.decimalEntered = false;
            this.steps = [];
            this.stepCounter = 0;
            this.lastStepWasNumber = false;
            this.previousStep = null;
            this.stepBackupSaved = false;
            
            // Clear steps display and show ready
            const stepsContainer = document.getElementById('steps-container');
            stepsContainer.innerHTML = '';
            this.showReadyStep();
            
            this.updateDisplay();
            return;
        }
        
        // Update last key pressed for other functions
        this.lastKeyPressed = func;
        
        if (func === 'CLRG') {
            this.clearRegisters();
            return;
        }
        
        if (func === 'x=0') {
            this.testXZero();
            return;
        }
        
        // Handle specific functions
        switch (func) {
            // Basic arithmetic
            case '+':
                this.add();
                break;
            case '−':
                this.subtract();
                break;
            case '×':
                this.multiply();
                break;
            case '÷':
                this.divide();
                break;
                
            // Stack operations
            case 'ENTER':
                this.enter();
                break;
            case 'R↓':
                this.rollDown();
                break;
            case 'x↔y':
                this.swapXY();
                break;
            case 'CHS':
                this.changeSign();
                break;
                
            // Functions
            case 'y^x':
                this.power();
                break;
            case '1/x':
                this.reciprocal();
                break;
            case '√x':
                this.squareRoot();
                break;
            case 'LN':
                this.naturalLog();
                break;
            case 'e^x':
                this.exponential();
                break;
                
            // Financial functions
            case 'n':
                // Store if: typing, not a new number (continuing from last), OR just calculated
                // Calculate only if: new number, not typing, and didn't just calculate
                if (this.isTyping || !this.isNewNumber || this.justCalculated) {
                    this.storeN();
                    this.justCalculated = false;
                } else {
                    this.calculateN();
                    this.justCalculated = false;
                }
                break;
            case 'i':
                if (this.isTyping || !this.isNewNumber || this.justCalculated) {
                    this.storeI();
                    this.justCalculated = false;
                } else {
                    this.calculateI();
                    this.justCalculated = false;
                }
                break;
            case 'PV':
                if (this.isTyping || !this.isNewNumber || this.justCalculated) {
                    this.storePV();
                    this.justCalculated = false;
                } else {
                    this.calculatePV();
                    this.justCalculated = false;
                }
                break;
            case 'PMT':
                if (this.isTyping || !this.isNewNumber || this.justCalculated) {
                    this.storePMT();
                    this.justCalculated = false;
                } else {
                    this.calculatePMT();
                    this.justCalculated = false;
                }
                break;
            case 'FV':
                if (this.isTyping || !this.isNewNumber || this.justCalculated) {
                    this.storeFV();
                    this.justCalculated = false;
                } else {
                    this.calculateFV();
                    this.justCalculated = false;
                }
                break;
            
            // Cash flow functions
            case 'CFo':
                this.storeCFo();
                break;
            case 'CFj':
                this.storeCFj();
                break;
            case 'Nj':
                this.storeNj();
                break;
            case 'NPV':
                this.calculateNPV();
                break;
            case 'IRR':
                this.calculateIRR();
                break;
                
            // Memory operations
            case 'STO':
                // Wait for next key press for register
                this.waitingForRegister = 'store';
                break;
            case 'RCL':
                // Wait for next key press for register
                this.waitingForRegister = 'recall';
                break;
                
            // Percentage functions
            case '%':
                this.percent();
                break;
            case '%T':
                this.percentOfTotal();
                break;
            case 'Δ%':
                this.percentChange();
                break;
                
            // Mode functions
            case 'BEG':
                this.setBeginMode();
                break;
            case 'END':
                this.setEndMode();
                break;
                
            // Date functions
            case 'DATE':
                this.date();
                break;
            case 'ΔDYS':
                this.daysBetween();
                break;
                
            // Statistics
            case 'Σ+':
                this.sigmaPlus();
                break;
            case 'Σ-':
                this.sigmaMinus();
                break;
                
            // Math functions - g-shift
            case 'FRAC':
                this.fractionalPart();
                break;
            case 'INTG':
                this.integerPart();
                break;
            case 'n!':
                this.factorial();
                break;
                
            // 12x and 12÷ functions - g-shift
            case '12×':
                // Real HP-12C behavior: g-12× (on the n key) multiplies by 12 and stores into n
                this.multiply12();
                if (key === 'n') {
                    this.storeN();
                }
                break;
            case '12÷':
                // Real HP-12C behavior: g-12÷ (on the i key) divides by 12 and stores into i
                this.divide12();
                if (key === 'i') {
                    this.storeI();
                }
                break;
                
            // Memory and display
            case 'MEM':
                this.showMemory();
                break;
            case 'RND':
                this.round();
                break;
                
            // Date formats
            case 'D.MY':
                this.setDateFormatDMY();
                break;
            case 'M.DY':
                this.setDateFormatMDY();
                break;
                
            // Statistical functions - g-shift
            case 'x̄,w':
                this.meanWeighted();
                break;
            case 'x̄':
            case 'x̄,r':
                this.meanLinearReg();
                break;
            case 'ŷ,r':
                this.yEstimate();
                break;
            case 's':
                this.standardDeviation();
                break;
            case 'x̂':
            case 'x̂,r':
                this.xEstimate();
                break;
                
            // Conversion functions - g-shift
            case 'P/R':
                this.polarToRect();
                break;
            case '→P':
                this.rectToPolar();
                break;
            case '→H':
                this.hoursToHMS();
                break;
            case '→DEG':
                this.radToDeg();
                break;
                
            // Test functions - g-shift
            case 'x≤y':
                this.testXLessOrEqual();
                break;
                
            // Last X - g-shift
            case 'LSTx':
                this.recallLastX();
                break;
                
            // Program functions - f-shift
            case 'PSE':
                this.pause();
                break;
            case 'BST':
                this.backStep();
                break;
            case 'GTO':
                this.gotoLine();
                break;
            case 'PRGM':
                this.programMode();
                break;
                
            // Clear functions - f-shift
            case 'FIN':
                this.clearFinancial();
                break;
            case 'REG':
                this.clearRegisters();
                break;
            case 'PREFIX':
                this.clearPrefix();
                break;
                
            // Debug toggle - f-shift
            case 'XYZT':
                this.toggleStackDebug();
                break;
                
            // Bond functions - f-shift
            case 'PRICE':
                this.bondPrice();
                break;
            case 'YTM':
                this.bondYTM();
                break;
                
            // Depreciation functions - f-shift
            case 'SL':
                this.straightLineDepreciation();
                break;
            case 'SOYD':
                this.sumOfYearsDepreciation();
                break;
            case 'DB':
                this.decliningBalanceDepreciation();
                break;
                
            // Amortization - f-shift
            case 'AMORT':
                this.amortization();
                break;
            case 'INT':
                this.amortizationInterest();
                break;
                
            default:
                console.log('Function not implemented:', func);
        }
        
        // Handle register operations
        if (this.waitingForRegister && this.isDigit(key)) {
            const register = parseInt(key);
            if (this.waitingForRegister === 'store') {
                this.store(register);
                // Refresh memory panel to reflect new value
                this.renderStorageRegisters();
            } else if (this.waitingForRegister === 'recall') {
                this.recall(register);
            }
            this.waitingForRegister = null;
            this.updateDisplay();
        }
    }
    
    isDigit(key) {
        return ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'].includes(key);
    }
    
    enterDigit(digit) {
        if (this.isNewNumber) {
            // Lift stack only when stack-lift is enabled (after operations). ENTER disables it.
            if (this.stackLiftEnabled) {
                this.stack[3] = this.stack[2];
                this.stack[2] = this.stack[1];
                this.stack[1] = this.stack[0];
            }
            this.display = digit;
            this.isNewNumber = false;
            this.isTyping = true;
            // Once typing begins, re-enable stack-lift for subsequent number entries
            this.stackLiftEnabled = true;
        } else {
            if (this.display.length < 10) {
                this.display = this.display === '0' ? digit : this.display + digit;
                this.isTyping = true;  // Set isTyping when appending digits
            }
        }
    }
    
    enterDecimal() {
        if (this.isNewNumber) {
            this.display = '0.';
            this.isNewNumber = false;
            this.isTyping = true;
            this.decimalEntered = true;
        } else if (!this.decimalEntered && this.display.indexOf('.') === -1) {
            this.display += '.';
            this.decimalEntered = true;
        }
    }
    
    enterExponent() {
        if (this.display.indexOf('e') === -1) {
            this.display += 'e';
        }
    }
    
    // Stack operations
    enter() {
        // HP12C ENTER duplicates X into Y without altering X
        const value = this.getX();
        // If user was typing, commit the typed value to X before duplicating
        if (this.isTyping) {
            this.stack[0] = value;
        }
        // Shift stack and duplicate X into Y
        this.stack[3] = this.stack[2];
        this.stack[2] = this.stack[1];
        this.stack[1] = this.stack[0];
        this.isNewNumber = true;
        this.isTyping = false;
        this.decimalEntered = false;
        // After ENTER, HP12C disables stack-lift for the next digit
        this.stackLiftEnabled = false;
        // Format the display with proper decimal places
        this.display = this.formatNumber(this.stack[0]);
    }
    
    pushStack(value) {
        this.stack[3] = this.stack[2]; // T
        this.stack[2] = this.stack[1]; // Z
        this.stack[1] = this.stack[0]; // Y
        this.stack[0] = value;         // X
    }
    
    popStack() {
        const result = this.stack[0];
        this.stack[0] = this.stack[1]; // X = Y
        this.stack[1] = this.stack[2]; // Y = Z
        this.stack[2] = this.stack[3]; // Z = T
        this.stack[3] = this.stack[3]; // T stays the same
        return result;
    }
    
    getX() {
        // If we're typing, return the display value (being entered)
        // Otherwise return the stack value (preserves full precision)
        if (this.isTyping) {
            // Remove commas before parsing in case display has been formatted
            return parseFloat(this.display.replace(/,/g, '')) || 0;
        }
        return this.stack[0];
    }
    
    setX(value) {
        this.stack[0] = value;
        this.display = this.formatNumber(value);
        this.isNewNumber = true;
        this.isTyping = false;
        this.decimalEntered = false;
        this.justCalculated = true; // Mark that we just calculated
        // Results of operations enable stack-lift for the next digit entry
        this.stackLiftEnabled = true;
    }
    
    // Basic arithmetic operations
    add() {
        const x = this.getX();
        const y = this.stack[1];
        this.stack[0] = this.stack[1]; // Drop stack
        this.stack[1] = this.stack[2];
        this.stack[2] = this.stack[3];
        this.setX(y + x);
    }
    
    subtract() {
        const x = this.getX();
        const y = this.stack[1];
        this.stack[0] = this.stack[1]; // Drop stack
        this.stack[1] = this.stack[2];
        this.stack[2] = this.stack[3];
        this.setX(y - x);
    }
    
    multiply() {
        const x = this.getX();
        const y = this.stack[1];
        this.stack[0] = this.stack[1]; // Drop stack
        this.stack[1] = this.stack[2];
        this.stack[2] = this.stack[3];
        this.setX(y * x);
    }
    
    divide() {
        const x = this.getX();
        const y = this.stack[1];
        if (x === 0) {
            this.setX(Infinity);
        } else {
            this.stack[0] = this.stack[1]; // Drop stack
            this.stack[1] = this.stack[2];
            this.stack[2] = this.stack[3];
            this.setX(y / x);
        }
    }
    
    // Mathematical functions
    power() {
        // HP-12C behavior: y^x computes Y raised to X (base in Y, exponent in X)
        const x = this.getX();
        const y = this.stack[1];
        // Drop stack (binary op consumes X and Y)
        this.stack[0] = this.stack[1];
        this.stack[1] = this.stack[2];
        this.stack[2] = this.stack[3];
        this.setX(Math.pow(y, x));
    }
    
    reciprocal() {
        const x = this.getX();
        if (x === 0) {
            this.setX(Infinity);
        } else {
            this.setX(1 / x);
        }
    }
    
    squareRoot() {
        const x = this.getX();
        this.setX(Math.sqrt(x));
    }
    
    naturalLog() {
        const x = this.getX();
        this.setX(Math.log(x));
    }
    
    exponential() {
        const x = this.getX();
        this.setX(Math.exp(x));
    }
    
    changeSign() {
        if (this.isTyping) {
            if (this.display.startsWith('-')) {
                this.display = this.display.substring(1);
            } else {
                this.display = '-' + this.display;
            }
        } else {
            this.setX(-this.getX());
        }
    }
    
    // Stack manipulation
    rollDown() {
        const temp = this.stack[0];
        this.stack[0] = this.stack[1];
        this.stack[1] = this.stack[2];
        this.stack[2] = this.stack[3];
        this.stack[3] = temp;
        this.display = this.formatNumber(this.stack[0]);
    }
    
    swapXY() {
        const temp = this.stack[0];
        this.stack[0] = this.stack[1];
        this.stack[1] = temp;
        this.display = this.formatNumber(this.stack[0]);
        this.updateDisplay();
    }
    
    // Financial functions
    storeN() {
        const value = this.getX();
        this.n = value;
        this.display = this.formatNumber(value);
        this.isNewNumber = true;
        this.isTyping = false;
        this.lastTVMWasCalculation = false;
        this.updateDisplay();
    }
    
    calculateN() {
        /**
         * Calculate number of periods (n) from PV, PMT, FV, and i
         * Uses logarithmic formula when possible, iterative method otherwise
         * Rounds up to next integer to match real HP-12C behavior
         */
        const rate = this.i / 100;

        if (rate === 0) {
            // Simple case: no interest
            if (this.pmt === 0) {
                this.setX(0);
            } else {
                const result = -(this.pv + this.fv) / this.pmt;
                // Round up to next integer (HP-12C behavior)
                this.setX(Math.ceil(result));
            }
        } else {
            // Use logarithmic formula
            let pmtAdj = this.pmt;
            if (this.beginMode) {
                pmtAdj = this.pmt / (1 + rate);
            }

            const numerator = pmtAdj - this.fv * rate;
            const denominator = this.pv * rate + pmtAdj;

            if (denominator === 0 || numerator / denominator <= 0) {
                this.setX(0);
            } else {
                const n = Math.log(numerator / denominator) / Math.log(1 + rate);
                // HP-12C always rounds N up to the next highest integer
                // This matches real calculator behavior where fractional periods mean
                // you need one more complete period to reach your goal
                this.setX(Math.ceil(n));
            }
        }

        this.n = this.getX();
        this.lastTVMWasCalculation = true;
    }
    
    storeI() {
        const value = this.getX();
        this.i = value;
        this.display = this.formatNumber(value);
        this.isNewNumber = true;
        this.isTyping = false;
        this.lastTVMWasCalculation = false;
        this.updateDisplay();
    }
    
    calculateI() {
        /**
         * Calculate interest rate (i) from n, PV, PMT, and FV
         * Uses Newton-Raphson iterative method
         */
        if (this.n === 0) {
            this.setX(0);
            this.lastTVMWasCalculation = true;
            return;
        }
        
        // Better initial guess: simple interest approximation
        // For typical loans: i ≈ (PMT * n - PV) / (PV * n)
        let i = 0.01; // 1% initial guess (safer than 10% for large n)
        if (this.pv !== 0 && this.n > 0) {
            let simpleGuess = Math.abs((this.pmt * this.n + this.fv - this.pv) / (this.pv * this.n));
            if (simpleGuess > 0 && simpleGuess < 0.5) {
                i = simpleGuess;
            }
        }
        
        const maxIterations = 100;
        const tolerance = 0.00001;
        
        for (let iter = 0; iter < maxIterations; iter++) {
            let factor = Math.pow(1 + i, this.n);
            
            // Calculate NPV = PV + PMT*annuity + FV/(1+i)^n
            // We want to find i where NPV = 0
            let npv;
            if (i === 0) {
                npv = this.pv + this.pmt * this.n + this.fv;
            } else {
                let annuityFactor = (factor - 1) / (i * factor);
                if (this.beginMode) {
                    annuityFactor = annuityFactor * (1 + i);
                }
                npv = this.pv + this.pmt * annuityFactor + this.fv / factor;
            }
            
            // Calculate derivative for Newton-Raphson
            const delta = 0.00001;
            const iPlus = i + delta;
            const factorPlus = Math.pow(1 + iPlus, this.n);
            let npvPlus;
            if (iPlus === 0) {
                npvPlus = this.pv + this.pmt * this.n + this.fv;
            } else {
                let annuityFactorPlus = (factorPlus - 1) / (iPlus * factorPlus);
                if (this.beginMode) {
                    annuityFactorPlus = annuityFactorPlus * (1 + iPlus);
                }
                npvPlus = this.pv + this.pmt * annuityFactorPlus + this.fv / factorPlus;
            }
            
            const derivative = (npvPlus - npv) / delta;
            
            // Check convergence
            if (Math.abs(npv) < tolerance) {
                this.setX(i * 100); // Return as percentage
                this.i = this.getX();
                this.lastTVMWasCalculation = true;
                return;
            }
            
            // Newton-Raphson update: i_new = i_old - f(i)/f'(i)
            if (derivative !== 0) {
                i = i - npv / derivative;
            }
            
            // Keep i in reasonable bounds
            if (i < -0.99) i = -0.99;
            if (i > 10) i = 10;
        }
        
        // Return best guess even if not fully converged
        this.setX(i * 100);
        this.i = this.getX();
        this.lastTVMWasCalculation = true;
    }
    
    storePV() {
        const value = this.getX();
        this.pv = value;
        this.display = this.formatNumber(value);
        this.isNewNumber = true;
        this.isTyping = false;
        this.lastTVMWasCalculation = false;
        this.updateDisplay();
    }
    
    storePMT() {
        const value = this.getX();
        this.pmt = value;
        this.display = this.formatNumber(value);
        this.isNewNumber = true;
        this.isTyping = false;
        this.lastTVMWasCalculation = false;
        this.updateDisplay();
    }
    
    storeFV() {
        const value = this.getX();
        this.fv = value;
        this.display = this.formatNumber(value);
        this.isNewNumber = true;
        this.isTyping = false;
        this.lastTVMWasCalculation = false;
        this.updateDisplay();
    }
    
    calculatePV() {
        // PV = PMT * ((1 - (1 + i)^(-n)) / i) + FV / (1 + i)^n
        const rate = this.i / 100;
        if (rate === 0) {
            this.setX(-this.pmt * this.n - this.fv);
        } else {
            let pmtFactor = ((1 - Math.pow(1 + rate, -this.n)) / rate);
            // Adjust for BEGIN mode - payments at start of period
            if (this.beginMode) {
                pmtFactor = pmtFactor * (1 + rate);
            }
            const pv = this.pmt * pmtFactor + this.fv / Math.pow(1 + rate, this.n);
            this.setX(-pv);
        }
        this.pv = this.getX();
        this.lastTVMWasCalculation = true;
    }
    
    calculatePMT() {
        // HP12c PMT calculation
        // Standard formula: PMT = (PV * i * (1 + i)^n) / ((1 + i)^n - 1) + (FV * i) / ((1 + i)^n - 1)
        const rate = this.i / 100;
        if (rate === 0) {
            this.setX(-(this.pv + this.fv) / this.n);
        } else {
            const factor = Math.pow(1 + rate, this.n);
            let pmt = (this.pv * rate * factor + this.fv * rate) / (factor - 1);
            // Adjust for BEGIN mode - payments at start of period
            if (this.beginMode) {
                pmt = pmt / (1 + rate);
            }
            this.setX(-pmt);
        }
        this.pmt = this.getX();
        this.lastTVMWasCalculation = true;
    }
    
    calculateFV() {
        // FV = -PV * (1 + i)^n - PMT * (((1 + i)^n - 1) / i)
        const rate = this.i / 100;
        if (rate === 0) {
            this.setX(-this.pv - this.pmt * this.n);
        } else {
            const factor = Math.pow(1 + rate, this.n);
            let pmtFactor = ((factor - 1) / rate);
            // Adjust for BEGIN mode - payments at start of period
            if (this.beginMode) {
                pmtFactor = pmtFactor * (1 + rate);
            }
            const fv = -this.pv * factor - this.pmt * pmtFactor;
            this.setX(fv);
        }
        this.fv = this.getX();
        this.lastTVMWasCalculation = true;
    }
    
    // Cash flow functions
    storeCFo() {
        // Store initial cash flow (CF0)
        const value = this.getX();
        this.cashFlows = [value];
        this.cashFlowCounts = [1];
        this.isNewNumber = true;
        this.isTyping = false;
        // Reformat display with thousands separator
        this.display = this.formatNumber(value);
    }
    
    storeCFj() {
        // Store subsequent cash flow
        const value = this.getX();
        this.cashFlows.push(value);
        this.cashFlowCounts.push(1);
        this.isNewNumber = true;
        this.isTyping = false;
        // Reformat display with thousands separator
        this.display = this.formatNumber(value);
    }
    
    storeNj() {
        // Store count for last cash flow
        const count = Math.floor(this.getX());
        if (this.cashFlowCounts.length > 0) {
            this.cashFlowCounts[this.cashFlowCounts.length - 1] = count;
        }
        this.isNewNumber = true;
        this.isTyping = false;
        // Reformat display with thousands separator
        this.display = this.formatNumber(count);
    }
    
    calculateNPV() {
        // Net Present Value calculation
        if (this.cashFlows.length === 0) {
            this.setX(0);
            return;
        }
        
        const rate = this.i / 100;
        let npv = this.cashFlows[0]; // CF0 is not discounted
        
        let period = 1;
        for (let j = 1; j < this.cashFlows.length; j++) {
            const count = this.cashFlowCounts[j] || 1;
            for (let k = 0; k < count; k++) {
                npv += this.cashFlows[j] / Math.pow(1 + rate, period);
                period++;
            }
        }
        
        this.setX(npv);
    }
    
    calculateIRR() {
        // Internal Rate of Return using Newton-Raphson method
        if (this.cashFlows.length < 2) {
            this.setX(0);
            return;
        }
        
        let irr = 0.1; // Initial guess 10%
        const maxIterations = 100;
        const tolerance = 0.0001;
        
        for (let iter = 0; iter < maxIterations; iter++) {
            let npv = this.cashFlows[0];
            let dnpv = 0;
            let period = 1;
            
            for (let j = 1; j < this.cashFlows.length; j++) {
                const count = this.cashFlowCounts[j] || 1;
                for (let k = 0; k < count; k++) {
                    const factor = Math.pow(1 + irr, period);
                    npv += this.cashFlows[j] / factor;
                    dnpv -= period * this.cashFlows[j] / (factor * (1 + irr));
                    period++;
                }
            }
            
            if (Math.abs(npv) < tolerance) {
                this.setX(irr * 100); // Return as percentage
                return;
            }
            
            irr = irr - npv / dnpv;
        }
        
        this.setX(irr * 100); // Return as percentage even if not fully converged
    }
    
    // Percentage functions
    percent() {
        if (this.isTyping) this.pushStack(this.getX());
        const y = this.stack[1];
        const x = this.getX();
        this.setX((x / 100) * y);
    }
    
    percentOfTotal() {
        if (this.isTyping) this.pushStack(this.getX());
        const y = this.stack[1];
        const x = this.getX();
        this.setX((x / y) * 100);
    }
    
    percentChange() {
        if (this.isTyping) this.pushStack(this.getX());
        const y = this.stack[1]; // old value
        const x = this.getX();   // new value
        this.setX(((x - y) / y) * 100);
    }
    
    // Memory operations
    store(register) {
        this.memory[register] = this.getX();
        // After completing a STO operation (with register selected),
        // HP12C terminates the current numeric entry. The next digit
        // should begin a new number rather than appending to the
        // previously displayed value.
        this.isNewNumber = true;
        this.isTyping = false;
        this.decimalEntered = false;
        // Auto-show storage panel if a value is stored and user has not hidden it
        if (!this.storagePanelHiddenByUser) {
            this.autoShowMemoryPanel();
        }
    }
    
    recall(register) {
        // RCL lifts the stack before placing recalled value in X
        const value = this.memory[register];
        // Lift stack
        this.stack[3] = this.stack[2];
        this.stack[2] = this.stack[1];
        this.stack[1] = this.stack[0];
        // Set the recalled value and enable stack-lift for next entry
        this.setX(value);
    }
    
    // Statistics
    sigmaPlus() {
        /**
         * Add data point to statistics
         * X register = x value, Y register = y value
         * Stores: n, Σx, Σy, Σx², Σy², Σxy in registers
         */
        const x = this.getX();
        const y = this.stack[1];
        
        // Store in stats array for later calculations
        this.stats.push({x: x, y: y});
        
        // Update statistical registers (using memory registers 11-16)
        this.memory[11] = (this.memory[11] || 0) + 1;      // n (count)
        this.memory[12] = (this.memory[12] || 0) + x;      // Σx
        this.memory[13] = (this.memory[13] || 0) + y;      // Σy
        this.memory[14] = (this.memory[14] || 0) + x * x;  // Σx²
        this.memory[15] = (this.memory[15] || 0) + y * y;  // Σy²
        this.memory[16] = (this.memory[16] || 0) + x * y;  // Σxy
        
        // Display updated count
        this.setX(this.memory[11]);
    }
    
    sigmaMinus() {
        /**
         * Remove data point from statistics
         * X register = x value, Y register = y value to remove
         */
        const x = this.getX();
        const y = this.stack[1];
        
        // Remove from stats array
        const index = this.stats.findIndex(point => point.x === x && point.y === y);
        if (index !== -1) {
            this.stats.splice(index, 1);
        }
        
        // Update statistical registers
        this.memory[11] = Math.max(0, (this.memory[11] || 0) - 1);     // n
        this.memory[12] = (this.memory[12] || 0) - x;                   // Σx
        this.memory[13] = (this.memory[13] || 0) - y;                   // Σy
        this.memory[14] = (this.memory[14] || 0) - x * x;               // Σx²
        this.memory[15] = (this.memory[15] || 0) - y * y;               // Σy²
        this.memory[16] = (this.memory[16] || 0) - x * y;               // Σxy
        
        // Display updated count
        this.setX(this.memory[11]);
    }
    
    // Clear functions
    clearX() {
        // CLx clears the X register (display) only, not the entire stack
        // It should undo the last entry/operation by removing or restoring the step
        // Set display to "0" (not formatted) so next digit replaces it without lifting stack
        
        this.stack[0] = 0;
        this.display = '0';  // Use '0' not formatted so enterDigit will replace it
        this.isNewNumber = false;  // Don't lift stack on next entry
        this.isTyping = false;
        this.decimalEntered = false;
        
        // Handle step restoration or removal
        if (this.previousStep && this.steps.length > 0) {
            // We have a backup - this means the last step was modified (number appended to operator)
            // Restore the step to its state before the number was added
            const lastStep = this.steps[this.steps.length - 1];
            
            // Check if this is the same step that was backed up (same step number)
            if (lastStep.number === this.previousStep.number) {
                // Restore the previous state
                lastStep.button = this.previousStep.button;
                lastStep.description = this.previousStep.description;
                lastStep.result = this.previousStep.result;
                
                // Re-render all steps
                const stepsContainer = document.getElementById('steps-container');
                stepsContainer.innerHTML = '';
                this.steps.forEach(step => this.renderStep(step));
                
                // After restoring, the step ends with an operator, so next number creates new step
                this.lastStepWasNumber = false;
                
                // Clear the backup
                this.previousStep = null;
                this.stepBackupSaved = false;
            } else {
                // The backup is for a different step, just remove the current last step
                this.steps.pop();
                this.stepCounter--;
                
                const stepsContainer = document.getElementById('steps-container');
                stepsContainer.innerHTML = '';
                if (this.steps.length === 0) {
                    this.showReadyStep();
                    this.lastStepWasNumber = false;
                } else {
                    this.steps.forEach(step => this.renderStep(step));
                    const lastStep = this.steps[this.steps.length - 1];
                    const isNumberStep = !lastStep.button.includes('[') && lastStep.button !== 'ENTER';
                    this.lastStepWasNumber = isNumberStep;
                }
                
                // Clear the backup since it's no longer relevant
                this.previousStep = null;
                this.stepBackupSaved = false;
            }
        } else if (this.steps.length > 0) {
            // No backup - just remove the last step
            this.steps.pop();
            this.stepCounter--;
            
            // Re-render all steps
            const stepsContainer = document.getElementById('steps-container');
            stepsContainer.innerHTML = '';
            if (this.steps.length === 0) {
                this.showReadyStep();
                this.lastStepWasNumber = false;
            } else {
                this.steps.forEach(step => this.renderStep(step));
                
                // Check if the last remaining step is a number entry
                const lastStep = this.steps[this.steps.length - 1];
                const isNumberStep = !lastStep.button.includes('[') && lastStep.button !== 'ENTER';
                this.lastStepWasNumber = isNumberStep;
            }
        } else {
            this.lastStepWasNumber = false;
            this.previousStep = null;
            this.stepBackupSaved = false;
        }
    }
    
    clearAll() {
        this.stack = [0, 0, 0, 0];
        // Use current displayDecimals setting instead of hardcoded value
        this.display = (0).toFixed(this.displayDecimals);
        this.isNewNumber = true;
        this.isTyping = false;
        this.decimalEntered = false;
        this.fActive = false;
        this.gActive = false;
        this.updateFunctionIndicators();
    }
    
    clearRegisters() {
        // Clear all storage registers (R0-R9) and financial registers
        this.memory = new Array(20).fill(0);
        this.n = 0;
        this.i = 0;
        this.pv = 0;
        this.pmt = 0;
        this.fv = 0;
        // Also clear cash flow registers
        this.cashFlows = [];
        this.cashFlowCounts = [];
        // Clear the display and stack
        this.stack = [0, 0, 0, 0];
        // Use current displayDecimals setting
        this.display = (0).toFixed(this.displayDecimals);
        this.isNewNumber = true;
        // Clear the steps display
        this.steps = [];
        this.stepCounter = 0;
        this.lastStepWasNumber = false;
        this.previousStep = null;
        this.stepBackupSaved = false;
        const stepsContainer = document.getElementById('steps-container');
        stepsContainer.innerHTML = '';
        this.showReadyStep();
        this.updateDisplay();
    }
    
    testXZero() {
        // Test if X register is zero
        const isZero = this.getX() === 0;
        // In real HP12c, this would affect program flow, but for now just display result
        this.display = isZero ? 'TRUE' : 'FALSE';
        setTimeout(() => this.updateDisplay(), 1000);
    }
    
    // Mode functions
    setBeginMode() {
        this.beginMode = true;
        document.getElementById('begin-indicator').classList.add('active');
        this.addStep('Enter BEGIN mode (payments at start of period)', 'BEGIN');
        // Show BEGIN indicator briefly
        const oldDisplay = this.display;
        this.display = 'BEGIN';
        this.updateDisplay();
        setTimeout(() => {
            this.display = oldDisplay;
            this.updateDisplay();
        }, 1000);
    }
    
    setEndMode() {
        this.beginMode = false;
        document.getElementById('begin-indicator').classList.remove('active');
        this.addStep('Enter END mode (payments at end of period)', 'END');
        // Show END indicator briefly
        const oldDisplay = this.display;
        this.display = 'END';
        this.updateDisplay();
        setTimeout(() => {
            this.display = oldDisplay;
            this.updateDisplay();
        }, 1000);
    }
    
    // Date functions (simplified)
    date() {
        /**
         * Calculate future or past date based on days in X register
         * Enter: date in Y (M.DDYYYY or DD.MMYYYY), days in X
         * Returns: new date in X register, day of week in Y (1=Mon, 7=Sun)
         */
        const days = Math.floor(this.getX());
        const dateValue = this.stack[1];
        
        // Parse date based on format
        let month, day, year;
        if (this.dateFormat === 'MDY') {
            // M.DDYYYY format
            month = Math.floor(dateValue);
            const decimal = dateValue - month;
            const ddyyyy = Math.round(decimal * 1000000);
            day = Math.floor(ddyyyy / 10000);
            year = ddyyyy % 10000;
        } else {
            // D.MMYYYY format (DMY)
            day = Math.floor(dateValue);
            const decimal = dateValue - day;
            const mmyyyy = Math.round(decimal * 1000000);
            month = Math.floor(mmyyyy / 10000);
            year = mmyyyy % 10000;
        }
        
        // Create date and add days
        const baseDate = new Date(year, month - 1, day);
        baseDate.setDate(baseDate.getDate() + days);
        
        // Format result
        const newMonth = baseDate.getMonth() + 1;
        const newDay = baseDate.getDate();
        const newYear = baseDate.getFullYear();
        
        let result;
        if (this.dateFormat === 'MDY') {
            result = newMonth + (newDay * 10000 + newYear) / 1000000;
        } else {
            result = newDay + (newMonth * 10000 + newYear) / 1000000;
        }
        
        // Calculate day of week (1=Monday, 7=Sunday)
        const dayOfWeek = baseDate.getDay();
        const hp12cDay = dayOfWeek === 0 ? 7 : dayOfWeek;
        
        this.stack[1] = hp12cDay;
        this.setX(result);
    }
    
    daysBetween() {
        /**
         * Calculate days between two dates
         * Enter: earlier date in Y, later date in X (M.DDYYYY or DD.MMYYYY format)
         * Returns: actual days in X register, 30/360 days in Y register
         */
        // Use raw stack values, not getX() which might use typed display
        const date1Value = this.stack[1];
        const date2Value = this.stack[0];
        
        // Parse first date
        let month1, day1, year1;
        if (this.dateFormat === 'MDY') {
            month1 = Math.floor(date1Value);
            const decimal1 = date1Value - month1;
            const ddyyyy1 = Math.round(decimal1 * 1000000);
            day1 = Math.floor(ddyyyy1 / 10000);
            year1 = ddyyyy1 % 10000;
        } else { // D.MY format
            day1 = Math.floor(date1Value);
            const decimal1 = date1Value - day1;
            const mmyyyy1 = Math.round(decimal1 * 1000000);
            month1 = Math.floor(mmyyyy1 / 10000);
            year1 = mmyyyy1 % 10000;
        }
        
        // Parse second date
        let month2, day2, year2;
        if (this.dateFormat === 'MDY') {
            month2 = Math.floor(date2Value);
            const decimal2 = date2Value - month2;
            const ddyyyy2 = Math.round(decimal2 * 1000000);
            day2 = Math.floor(ddyyyy2 / 10000);
            year2 = ddyyyy2 % 10000;
        } else { // D.MY format
            day2 = Math.floor(date2Value);
            const decimal2 = date2Value - day2;
            const mmyyyy2 = Math.round(decimal2 * 1000000);
            month2 = Math.floor(mmyyyy2 / 10000);
            year2 = mmyyyy2 % 10000;
        }
        
        // Calculate actual days
        const firstDate = new Date(year1, month1 - 1, day1);
        const secondDate = new Date(year2, month2 - 1, day2);
        const actualDays = Math.round((secondDate - firstDate) / (1000 * 60 * 60 * 24));
        
        // Calculate 30/360 days (bond basis)
        const days360 = (year2 - year1) * 360 + (month2 - month1) * 30 + (day2 - day1);
        
        this.stack[1] = days360;
        this.setX(actualDays);
    }
    
    // Math functions - g-shift
    fractionalPart() {
        const x = this.getX();
        this.setX(x - Math.floor(x));
    }
    
    integerPart() {
        const x = this.getX();
        this.setX(Math.floor(x));
    }
    
    factorial() {
        const n = Math.floor(this.getX());
        if (n < 0) {
            this.setX(NaN);
            return;
        }
        if (n > 69) {
            this.setX(Infinity);
            return;
        }
        let result = 1;
        for (let i = 2; i <= n; i++) {
            result *= i;
        }
        this.setX(result);
    }
    
    // 12x operations
    multiply12() {
        const x = this.getX();
        this.setX(x * 12);
    }
    
    divide12() {
        const x = this.getX();
        this.setX(x / 12);
    }
    
    // Memory and display
    showMemory() {
        // Toggle and render storage registers (.0-.9 and R0-R9)
        const group = document.getElementById('storage-register-group');
        if (group) {
            group.style.display = '';
            this.storagePanelHiddenByUser = false;
        }
        this.renderStorageRegisters();
        this.updateDisplay();
    }

    renderStorageRegisters() {
        const container = document.getElementById('storage-registers');
        if (!container) return;
        // Build a compact grid: registers 0-9 and 10-19
        const format = (v) => this.formatNumber(v || 0);
        let html = '';
        for (let r = 0; r < 10; r++) {
            html += `<div class="register-item"><span class="register-label">.${r}:</span><span>${format(this.memory[r])}</span></div>`;
        }
        for (let r = 10; r < 20; r++) {
            html += `<div class="register-item"><span class="register-label">R${r-10}:</span><span>${format(this.memory[r])}</span></div>`;
        }
        container.innerHTML = html;
    }

    autoShowMemoryPanel() {
        const group = document.getElementById('storage-register-group');
        if (!group) return;
        const hasNonZero = this.memory.some(v => v !== 0);
        if (hasNonZero && group.style.display === 'none') {
            group.style.display = '';
            this.renderStorageRegisters();
        }
    }

    toggleStorageRegisters() {
        const group = document.getElementById('storage-register-group');
        const btn = document.getElementById('toggle-storage-btn');
        if (!group || !btn) return;
        if (group.style.display === 'none') {
            group.style.display = '';
            this.storagePanelHiddenByUser = false;
            btn.textContent = 'Hide';
            this.renderStorageRegisters();
        } else {
            group.style.display = 'none';
            this.storagePanelHiddenByUser = true;
            btn.textContent = 'Show';
        }
    }
    
    round() {
        const x = this.getX();
        const factor = Math.pow(10, this.displayDecimals);
        this.setX(Math.round(x * factor) / factor);
    }
    
    // Date formats
    setDateFormatDMY() {
        this.dateFormat = 'DMY';
        const indicator = document.getElementById('dmy-indicator');
        if (indicator) {
            indicator.classList.add('active');
        }
    }
    
    setDateFormatMDY() {
        this.dateFormat = 'MDY';
        const indicator = document.getElementById('dmy-indicator');
        if (indicator) {
            indicator.classList.remove('active');
        }
    }
    
    // Statistical functions
    meanWeighted() {
        /**
         * Calculate weighted mean where y values are weights
         * Returns x̄w = Σ(x·y) / Σy
         * Also returns ȳ in Y register
         */
        const n = this.memory[11] || 0;
        if (n === 0) {
            this.setX(0);
            return;
        }
        
        const sumY = this.memory[13] || 0;
        const sumXY = this.memory[16] || 0;
        
        if (sumY === 0) {
            this.setX(0);
            return;
        }
        
        // Weighted mean of x
        const xMeanWeighted = sumXY / sumY;
        
        // Mean of y (standard arithmetic mean)
        const yMean = sumY / n;
        
        // Set results in stack
        this.stack[1] = yMean;  // ȳ in Y register
        this.setX(xMeanWeighted); // x̄w in X register
    }
    
    meanLinearReg() {
        /**
         * Calculate arithmetic means for linear regression
         * Returns x̄ in X register, ȳ in Y register
         */
        const n = this.memory[11] || 0;
        if (n === 0) {
            this.setX(0);
            return;
        }
        
        const sumX = this.memory[12] || 0;
        const sumY = this.memory[13] || 0;
        
        const xMean = sumX / n;
        const yMean = sumY / n;
        
        // Set results in stack
        this.stack[1] = yMean;  // ȳ in Y register
        this.setX(xMean);       // x̄ in X register
    }
    
    yEstimate() {
        /**
         * Estimate y value from x using linear regression: ŷ = a + bx
         * X register contains the x value for estimation
         * Returns ŷ in X register, slope m in Y register
         */
        const n = this.memory[11] || 0;
        if (n < 2) {
            this.setX(0);
            return;
        }
        
        const sumX = this.memory[12] || 0;
        const sumY = this.memory[13] || 0;
        const sumX2 = this.memory[14] || 0;
        const sumXY = this.memory[16] || 0;
        
        // Calculate slope (m) and intercept (b)
        const denominator = n * sumX2 - sumX * sumX;
        if (denominator === 0) {
            this.setX(0);
            return;
        }
        
        const m = (n * sumXY - sumX * sumY) / denominator;  // slope
        const b = (sumY - m * sumX) / n;                     // intercept
        
        // Get x value from X register
        const x = this.getX();
        
        // Calculate ŷ = b + mx
        const yEstimate = b + m * x;
        
        // Set results in stack
        this.stack[1] = m;        // slope in Y register
        this.setX(yEstimate);     // ŷ in X register
    }
    
    standardDeviation() {
        /**
         * Calculate sample standard deviations
         * Returns sx in X register, sy in Y register
         * Uses sample standard deviation formula (n-1 denominator)
         */
        const n = this.memory[11] || 0;
        if (n < 2) {
            this.setX(0);
            return;
        }
        
        const sumX = this.memory[12] || 0;
        const sumY = this.memory[13] || 0;
        const sumX2 = this.memory[14] || 0;
        const sumY2 = this.memory[15] || 0;
        
        // Sample standard deviation: s = sqrt((Σx² - (Σx)²/n) / (n-1))
        const varianceX = (sumX2 - (sumX * sumX) / n) / (n - 1);
        const varianceY = (sumY2 - (sumY * sumY) / n) / (n - 1);
        
        const sx = Math.sqrt(Math.max(0, varianceX));
        const sy = Math.sqrt(Math.max(0, varianceY));
        
        // Set results in stack
        this.stack[1] = sy;  // sy in Y register
        this.setX(sx);       // sx in X register
    }
    
    xEstimate() {
        /**
         * Estimate x value from y using linear regression: x̂ = (y - a) / b
         * Y register contains the y value for estimation
         * Returns x̂ in X register, 1/slope in Y register
         */
        const n = this.memory[11] || 0;
        if (n < 2) {
            this.setX(0);
            return;
        }
        
        const sumX = this.memory[12] || 0;
        const sumY = this.memory[13] || 0;
        const sumX2 = this.memory[14] || 0;
        const sumXY = this.memory[16] || 0;
        
        // Calculate slope (m) and intercept (b)
        const denominator = n * sumX2 - sumX * sumX;
        if (denominator === 0) {
            this.setX(0);
            return;
        }
        
        const m = (n * sumXY - sumX * sumY) / denominator;  // slope
        const b = (sumY - m * sumX) / n;                     // intercept
        
        if (m === 0) {
            this.setX(0);
            return;
        }
        
        // Get y value from X register
        const y = this.getX();
        
        // Calculate x̂ = (y - b) / m
        const xEstimate = (y - b) / m;
        
        // Set results in stack
        this.stack[1] = 1 / m;     // 1/slope in Y register
        this.setX(xEstimate);      // x̂ in X register
    }
    
    // Conversion functions
    polarToRect() {
        // Convert polar (r, θ) to rectangular (x, y)
        // Y register has r, X register has θ in degrees
        if (this.isTyping) this.pushStack(this.getX());
        const theta = this.popStack() * Math.PI / 180; // Convert to radians
        const r = this.getX();
        const x = r * Math.cos(theta);
        const y = r * Math.sin(theta);
        this.stack[0] = x;
        this.stack[1] = y;
        this.display = this.formatNumber(x);
    }
    
    rectToPolar() {
        // Convert rectangular (x, y) to polar (r, θ)
        // Y register has x, X register has y
        if (this.isTyping) this.pushStack(this.getX());
        const y = this.popStack();
        const x = this.getX();
        const r = Math.sqrt(x * x + y * y);
        const theta = Math.atan2(y, x) * 180 / Math.PI; // Convert to degrees
        this.stack[0] = r;
        this.stack[1] = theta;
        this.display = this.formatNumber(r);
    }
    
    hoursToHMS() {
        // Convert decimal hours to Hours.MinutesSeconds format
        const hours = this.getX();
        const h = Math.floor(hours);
        const minutesDecimal = (hours - h) * 60;
        const m = Math.floor(minutesDecimal);
        const s = Math.round((minutesDecimal - m) * 60);
        const hms = h + m / 100 + s / 10000;
        this.setX(hms);
    }
    
    radToDeg() {
        // Convert radians to degrees
        const radians = this.getX();
        this.setX(radians * 180 / Math.PI);
    }
    
    // Test functions
    testXLessOrEqual() {
        // Test if X ≤ Y
        if (this.isTyping) this.pushStack(this.getX());
        const x = this.getX();
        const y = this.stack[1];
        const result = x <= y;
        this.display = result ? 'TRUE' : 'FALSE';
        setTimeout(() => this.updateDisplay(), 1000);
    }
    
    // Last X
    recallLastX() {
        // Recall last X value
        if (this.lastX !== undefined) {
            this.pushStack(this.lastX);
        }
    }
    
    // Program functions
    pause() {
        // Pause program execution - simplified
        this.addStep('Pause program', 'PSE');
        this.display = 'PAUSE';
        setTimeout(() => this.updateDisplay(), 1000);
    }
    
    backStep() {
        // Back step in program - simplified
        this.addStep('Back step in program', 'BST');
    }
    
    gotoLine() {
        // Go to program line - simplified
        this.addStep('Go to line', 'GTO');
    }
    
    programMode() {
        // Toggle program mode - simplified
        this.programMode = !this.programMode;
        this.addStep(this.programMode ? 'Enter program mode' : 'Exit program mode', 'PRGM');
        this.display = this.programMode ? 'PRGM' : '';
        setTimeout(() => this.updateDisplay(), 1000);
    }
    
    // Clear functions
    clearFinancial() {
        // Clear financial registers
        this.n = 0;
        this.i = 0;
        this.pv = 0;
        this.pmt = 0;
        this.fv = 0;
        this.addStep('Clear financial registers', '[FIN]');
    }
    
    clearPrefix() {
        // Clear prefix (f or g shift)
        this.fActive = false;
        this.gActive = false;
        this.updateFunctionIndicators();
    }
    
    // Bond functions (simplified implementations)
    bondPrice() {
        /**
         * Calculate bond price given yield
         * Uses financial registers:
         * n = periods to maturity
         * i = yield to maturity (annual %)
         * PMT = coupon payment per period
         * FV = face value (redemption value)
         * Returns price as % of par
         */
        if (this.n === 0) {
            this.setX(100);
            return;
        }
        
        const yieldPerPeriod = this.i / 100;
        
        if (yieldPerPeriod === 0) {
            // If yield is zero, price = redemption + all coupon payments
            this.setX(this.fv + this.pmt * this.n);
        } else {
            // Present value of coupon payments (annuity)
            const pvCoupons = this.pmt * ((1 - Math.pow(1 + yieldPerPeriod, -this.n)) / yieldPerPeriod);
            
            // Present value of redemption value
            const pvRedemption = this.fv / Math.pow(1 + yieldPerPeriod, this.n);
            
            // Total price
            const price = pvCoupons + pvRedemption;
            this.setX(price);
        }
    }
    
    bondYTM() {
        /**
         * Calculate yield to maturity given bond price
         * Uses financial registers:
         * n = periods to maturity
         * PV = price (negative)
         * PMT = coupon payment per period
         * FV = face value (redemption value)
         * Returns YTM as annual percentage
         */
        if (this.n === 0) {
            this.setX(0);
            return;
        }
        
        // Use Newton-Raphson method to solve for yield
        let ytm = 0.05; // Initial guess: 5%
        const maxIterations = 100;
        const tolerance = 0.000001;
        
        for (let iter = 0; iter < maxIterations; iter++) {
            // Calculate price at current yield guess
            let price;
            if (ytm === 0) {
                price = this.fv + this.pmt * this.n;
            } else {
                const pvCoupons = this.pmt * ((1 - Math.pow(1 + ytm, -this.n)) / ytm);
                const pvRedemption = this.fv / Math.pow(1 + ytm, this.n);
                price = pvCoupons + pvRedemption;
            }
            
            // Calculate derivative (price sensitivity to yield)
            const delta = 0.0001;
            const ytmPlus = ytm + delta;
            const pvCouponsPlus = this.pmt * ((1 - Math.pow(1 + ytmPlus, -this.n)) / ytmPlus);
            const pvRedemptionPlus = this.fv / Math.pow(1 + ytmPlus, this.n);
            const pricePlus = pvCouponsPlus + pvRedemptionPlus;
            
            const derivative = (pricePlus - price) / delta;
            
            // Check convergence
            if (Math.abs(price + this.pv) < tolerance) {
                this.setX(ytm * 100); // Return as percentage
                this.i = this.getX();
                return;
            }
            
            // Newton-Raphson update
            if (derivative !== 0) {
                ytm = ytm - (price + this.pv) / derivative;
            }
            
            // Keep yield in reasonable bounds
            if (ytm < -0.99) ytm = -0.99;
            if (ytm > 5) ytm = 5;
        }
        
        // Return best guess
        this.setX(ytm * 100);
        this.i = this.getX();
    }
    
    // Depreciation functions (simplified implementations)
    straightLineDepreciation() {
        // Straight-line depreciation
        // Formula: (Cost - Salvage) / Life
        // Assumes: Cost in PV, Salvage in FV, Life in n
        if (this.n === 0) {
            this.setX(0);
            return;
        }
        const depreciation = (this.pv - this.fv) / this.n;
        this.setX(depreciation);
    }
    
    sumOfYearsDepreciation() {
        /**
         * Sum-of-Years'-Digits depreciation
         * Uses financial registers:
         * PV = cost (initial value)
         * FV = salvage value
         * n = useful life in periods
         * X register = period number for calculation
         * Returns depreciation for that period in X, remaining book value in Y
         */
        const period = Math.floor(this.getX());
        
        if (period < 1 || period > this.n || this.n === 0) {
            this.setX(0);
            return;
        }
        
        const depreciableBase = this.pv - this.fv;
        const sumOfYears = (this.n * (this.n + 1)) / 2;
        const yearsRemaining = this.n - period + 1;
        
        // Depreciation for this period
        const depreciation = (depreciableBase * yearsRemaining) / sumOfYears;
        
        // Calculate accumulated depreciation up to this period
        let accumulated = 0;
        for (let i = 1; i <= period; i++) {
            const yr = this.n - i + 1;
            accumulated += (depreciableBase * yr) / sumOfYears;
        }
        
        // Remaining book value
        const bookValue = this.pv - accumulated;
        
        this.stack[1] = bookValue;
        this.setX(depreciation);
    }
    
    decliningBalanceDepreciation() {
        /**
         * Declining Balance depreciation
         * Uses financial registers:
         * PV = cost (initial value)
         * FV = salvage value
         * n = useful life in periods
         * i = depreciation rate (e.g., 200 for double-declining)
         * X register = period number for calculation
         * Returns depreciation for that period in X, remaining book value in Y
         * 
         * Note: HP12c uses rate = (i/100) / n as the per-period rate
         */
        const period = Math.floor(this.getX());
        
        if (period < 1 || period > this.n || this.n === 0) {
            this.setX(0);
            return;
        }
        
        const rate = (this.i / 100) / this.n; // Per-period rate: (i/100)/n
        let bookValue = this.pv;
        let depreciation = 0;
        
        // Calculate depreciation for each year up to the specified period
        for (let yr = 1; yr <= period; yr++) {
            depreciation = bookValue * rate;
            
            // Don't depreciate below salvage value
            if (bookValue - depreciation < this.fv) {
                depreciation = bookValue - this.fv;
            }
            
            bookValue -= depreciation;
        }
        
        this.stack[1] = bookValue;
        this.setX(depreciation);
    }
    
    // Amortization functions (simplified)
    amortization() {
        /**
         * Calculate amortization for a range of payments
         * Enter: starting payment number in Y, ending payment number in X
         * Returns: principal paid in X, interest paid in Y, remaining balance in Z
         * Uses TVM registers: n, i, PV, PMT, FV
         */
        const startPmt = Math.floor(this.stack[1]);
        const endPmt = Math.floor(this.getX());
        
        if (startPmt < 1 || endPmt < startPmt || endPmt > this.n) {
            this.setX(0);
            return;
        }
        
        const rate = this.i / 100;
        let balance = this.pv;
        let totalInterest = 0;
        let totalPrincipal = 0;
        
        // Calculate balance at start of amortization period
        for (let pmt = 1; pmt < startPmt; pmt++) {
            const interest = balance * rate;
            const principal = -this.pmt - interest;
            balance += principal;
        }
        
        // Calculate amortization for the specified range
        for (let pmt = startPmt; pmt <= endPmt; pmt++) {
            const interest = balance * rate;
            let principal = -this.pmt - interest;
            
            // Handle final payment adjustment
            if (Math.abs(balance + principal) < 0.01) {
                principal = -balance;
            }
            
            totalInterest += interest;
            totalPrincipal += principal;
            balance += principal;
        }
        
        // Return results in stack (all positive values)
        this.stack[2] = Math.abs(balance);      // Z: remaining balance
        this.stack[1] = Math.abs(totalInterest); // Y: total interest paid
        this.setX(Math.abs(totalPrincipal));     // X: total principal paid
    }
    
    amortizationInterest() {
        /**
         * Calculate interest portion of amortization
         * Uses same inputs as amortization() but returns interest details
         * Enter: starting payment number in Y, ending payment number in X
         * Returns: total interest in X register
         */
        const startPmt = Math.floor(this.stack[1]);
        const endPmt = Math.floor(this.getX());
        
        if (startPmt < 1 || endPmt < startPmt || endPmt > this.n) {
            this.setX(0);
            return;
        }
        
        const rate = this.i / 100;
        let balance = this.pv;
        let totalInterest = 0;
        
        // Calculate balance at start of period
        for (let pmt = 1; pmt < startPmt; pmt++) {
            const interest = balance * rate;
            const principal = -this.pmt - interest;
            balance += principal;
        }
        
        // Calculate interest for the specified range
        for (let pmt = startPmt; pmt <= endPmt; pmt++) {
            const interest = balance * rate;
            const principal = -this.pmt - interest;
            totalInterest += interest;
            balance += principal;
        }
        
        this.setX(-totalInterest);
    }
    
    // Display and formatting
    addThousandsSeparator(numStr) {
        // Add commas as thousands separators
        const parts = numStr.split('.');
        parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
        return parts.join('.');
    }
    
    formatNumber(num) {
        if (isNaN(num) || !isFinite(num)) return 'Error';
        
        // Handle very large or very small numbers
        if (Math.abs(num) >= 1e10 || (Math.abs(num) < 1e-4 && num !== 0)) {
            return num.toExponential(this.displayDecimals);
        }
        
        // Format with fixed decimals (keep trailing zeros)
        const formatted = num.toFixed(this.displayDecimals);
        return this.addThousandsSeparator(formatted);
    }
    
    updateDisplay() {
        // Format the display value for showing (add thousands separators and decimal places)
        let displayValue = this.display;
        
        // Only format if it's a valid number (not during typing with decimal point at end, etc.)
        if (this.display && !this.isTyping) {
            // Not typing, display is already formatted by setX
            displayValue = this.display;
        } else if (this.isTyping) {
            // While typing, check if user has entered a decimal point
            const hasDecimalPoint = this.display.includes('.');
            
            if (hasDecimalPoint) {
                // User is typing decimal digits, preserve what they type
                const numValue = parseFloat(this.display.replace(/,/g, ''));
                if (!isNaN(numValue) && isFinite(numValue)) {
                    displayValue = this.addThousandsSeparator(numValue.toString());
                    // Preserve any decimal digits being typed
                    const decimalPart = this.display.split('.')[1];
                    if (decimalPart !== undefined) {
                        displayValue = displayValue.split('.')[0] + '.' + decimalPart;
                    } else {
                        // Just typed the decimal point
                        displayValue += '.';
                    }
                } else {
                    displayValue = this.display;
                }
            } else {
                // No decimal point entered yet, format as whole number with decimal places
                const numValue = parseFloat(this.display.replace(/,/g, ''));
                if (!isNaN(numValue) && isFinite(numValue)) {
                    displayValue = this.formatNumber(numValue);
                } else {
                    displayValue = this.display;
                }
            }
        }
        
        document.getElementById('display-screen').textContent = displayValue;
        
        // Update registers display
        this.updateRegisters();
        // Update XY debug display (temporary troubleshooting)
        this.updateXYDebug();
    }
    
    updateFunctionIndicators() {
        document.getElementById('f-indicator').classList.toggle('active', this.fActive);
        document.getElementById('g-indicator').classList.toggle('active', this.gActive);
        
        // Update button highlighting
        document.querySelectorAll('.calc-btn').forEach(btn => {
            btn.classList.remove('f-active', 'g-active');
        });
        
        if (this.fActive) {
            document.querySelectorAll('.calc-btn').forEach(btn => {
                // Check if data-f attribute exists and has a non-empty value
                // Exclude digit keys (0-9) since f-digit is handled separately for decimal formatting
                const isDigit = btn.dataset.key && /^[0-9]$/.test(btn.dataset.key);
                if (btn.dataset.f && btn.dataset.f.trim() !== '' && !isDigit) {
                    btn.classList.add('f-active');
                }
            });
        }
        
        if (this.gActive) {
            document.querySelectorAll('.calc-btn').forEach(btn => {
                // Check if data-g attribute exists and has a non-empty value
                if (btn.dataset.g && btn.dataset.g.trim() !== '') {
                    btn.classList.add('g-active');
                }
            });
        }
    }
    
    // Steps recording system
    showReadyStep() {
        const stepsContainer = document.getElementById('steps-container');
        const stepElement = document.createElement('div');
        stepElement.className = 'step ready-step';
        stepElement.innerHTML = `
            <div class="step-number">1</div>
            <div class="step-content">
                <div class="step-description">Ready</div>
            </div>
            <div class="step-result">${this.formatNumber(0)}</div>
        `;
        stepsContainer.appendChild(stepElement);
    }
    
    addStep(button, functionUsed, result) {
        // Remove the ready step if this is the first real step
        if (this.stepCounter === 0) {
            const stepsContainer = document.getElementById('steps-container');
            const readyStep = stepsContainer.querySelector('.ready-step');
            if (readyStep) readyStep.remove();
        }
        
        this.stepCounter++;
        
        // No bracket wrapping - keep button text as-is
        const formattedButton = button;
        
        // Format the result value to ensure thousands separators
        // Remove any existing commas first before parsing
        const numericResult = parseFloat(result.toString().replace(/,/g, '')) || 0;
        const formattedResult = this.formatNumber(numericResult);
        const description = this.getStepDescription(formattedButton, functionUsed, formattedResult);
        const step = {
            number: this.stepCounter,
            button: formattedButton,
            description: description,
            result: formattedResult,
            timestamp: new Date().toLocaleTimeString()
        };
        
        this.steps.push(step);
        this.renderStep(step);
        this.scrollToBottom();
        
        // Reset backup flag when adding a new step
        this.stepBackupSaved = false;
    }
    
    updateLastStep(button, functionUsed, result) {
        if (this.steps.length === 0) {
            // No step to update, create a new one
            this.addStep(button, functionUsed, result);
            return;
        }
        
        const lastStep = this.steps[this.steps.length - 1];
        
        // Check if this is a non-digit operator/function
        const isOperator = ![...button].every(char => /[0-9.]/.test(char));
        
        // Save backup ONLY if we're appending an operator to an existing step
        // This means we're appending to "2 +" not just updating "45" to "456"
        if (!this.stepBackupSaved && isOperator && lastStep.button.length > 0) {
            this.previousStep = {
                number: lastStep.number,
                button: lastStep.button,
                description: lastStep.description,
                result: lastStep.result,
                timestamp: lastStep.timestamp
            };
            this.stepBackupSaved = true;
        }
        
        // For number entry, limit to 10 digits (matching calculator display limit)
        let newButtonText;
        const isNumberEntry = this.isDigit(button) || button === '.' || button === 'decimal' || button === 'EEX' || button === 'CHS';
        if (isNumberEntry) {
            // Count only the digits in current button text
            const currentDigits = lastStep.button.replace(/[^0-9]/g, '');
            if (currentDigits.length >= 10 && this.isDigit(button)) {
                // Don't append more digits - keep the current button text
                newButtonText = lastStep.button;
            } else {
                // Special handling for CHS - always keep it at end of digit sequence
                if (button === 'CHS') {
                    // Remove any existing CHS from the button text
                    let baseText = lastStep.button.replace(/ CHS/g, '').replace(/CHS/g, '');
                    // Extract digits portion (before any operators)
                    const parts = baseText.split(' ').filter(p => p.length > 0);
                    
                    if (parts.length > 0) {
                        // First part contains the digits, append CHS with space after digits
                        const digitPart = parts[0];
                        parts[0] = digitPart + ' CHS';
                        newButtonText = parts.join(' ');
                    } else {
                        newButtonText = 'CHS';
                    }
                } else if (lastStep.button.includes('CHS')) {
                    // Adding a digit when CHS already exists - insert digit before CHS
                    let baseText = lastStep.button.replace(/ CHS/g, '').replace(/CHS/g, '');
                    // Find where to insert the digit (before operators)
                    const parts = baseText.split(' ').filter(p => p.length > 0);
                    if (parts.length > 0) {
                        parts[0] = parts[0] + button + ' CHS';
                        newButtonText = parts.join(' ');
                    } else {
                        newButtonText = button + ' CHS';
                    }
                } else {
                    newButtonText = lastStep.button + button;
                }
            }
        } else {
            // Add space before operators/functions if there's existing content
            newButtonText = lastStep.button ? lastStep.button + ' ' + button : button;
        }
        
        // Update the last step - append the button to the sequence
        lastStep.button = newButtonText;
        // Format the result value to ensure thousands separators
        // Remove any existing commas first before parsing
        const numericResult = parseFloat(result.toString().replace(/,/g, '')) || 0;
        lastStep.result = this.formatNumber(numericResult);
        lastStep.description = this.getStepDescription(lastStep.button, functionUsed, lastStep.result);
        
        // Update the rendered step in the DOM
        const stepsContainer = document.getElementById('steps-container');
        const stepElements = stepsContainer.querySelectorAll('.step');
        if (stepElements.length > 0) {
            const lastStepElement = stepElements[stepElements.length - 1];
            const buttonElement = lastStepElement.querySelector('.step-button');
            const resultElement = lastStepElement.querySelector('.step-result');
            let descElement = lastStepElement.querySelector('.step-description');
            
            if (buttonElement) {
                buttonElement.innerHTML = this.formatKeystrokeDisplay(lastStep.button);
            }
            if (resultElement) {
                resultElement.textContent = lastStep.result;
            }
            
            // Create or update description element
            if (lastStep.description) {
                if (!descElement) {
                    // Create the description element if it doesn't exist
                    descElement = document.createElement('div');
                    descElement.className = 'step-description';
                    const stepContent = lastStepElement.querySelector('.step-content');
                    stepContent.appendChild(descElement);
                }
                descElement.textContent = lastStep.description;
            }
        }
        
        // Scroll to keep the updated step visible
        this.scrollToBottom();
    }
    
    getStepDescription(button, functionUsed, result) {
        // Generate meaningful descriptions for steps
        // For storage operations, use the result (what was actually stored) instead of button text
        const isTVMButton = ['n', 'i', 'PV', 'PMT', 'FV'].includes(functionUsed);
        const isStorageOperation = ['CFo', 'CFj', 'Nj'].includes(functionUsed);
        const value = (isTVMButton || isStorageOperation) ? result : '';
        
        // Also extract number from button text for other operations
        // Button text like "123 CHS +" or "100 ×"
        const cleanButton = button.replace(/\s+/g, ' ').trim(); // Normalize spaces
        
        // Check if CHS is present in the button text
        const hasCHS = cleanButton.includes('CHS');
        
        // Extract the number portion (before CHS or operators)
        let numberMatch = cleanButton.match(/^([\d.]+)/);
        let numberValue = numberMatch ? numberMatch[1] : '';
        
        // Add thousands separators to the number value for display
        if (numberValue) {
            numberValue = this.addThousandsSeparator(numberValue);
            // Add negative sign if CHS is present
            if (hasCHS) {
                numberValue = '-' + numberValue;
            }
        }
        
        const descriptions = {
            'n': this.lastTVMWasCalculation ? (value ? `calculate ${value} periods` : 'calculate periods') : (value ? `store ${value} periods` : 'store periods'),
            'i': this.lastTVMWasCalculation ? (value ? `calculate ${value}% interest rate` : 'calculate interest rate') : (value ? `store ${value}% interest rate` : 'store interest rate'),
            'PV': this.lastTVMWasCalculation ? (value ? `calculate $${value} present value` : 'calculate present value') : (value ? `store $${value} present value` : 'store present value'),
            'PMT': this.lastTVMWasCalculation ? (value ? `calculate $${value} payment` : 'calculate payment') : (value ? `store $${value} payment` : 'store payment'),
            'FV': this.lastTVMWasCalculation ? (value ? `calculate $${value} future value` : 'calculate future value') : (value ? `store $${value} future value` : 'store future value'),
            'CFo': value ? `store $${value} initial cash flow` : 'store initial cash flow',
            'CFj': value ? `store $${value} cash flow` : 'store cash flow',
            'Nj': value ? `repeat ${value} times` : 'set cash flow count',
            'ENTER': 'enter value into stack',
            '+': numberValue ? `add ${numberValue}` : 'add',
            '−': numberValue ? `subtract ${numberValue}` : 'subtract',
            '×': numberValue ? `multiply by ${numberValue}` : 'multiply',
            '÷': numberValue ? `divide by ${numberValue}` : 'divide',
            'CLx': 'clear X register',
            'CLRG': 'clear all registers',
            '%': 'calculate percentage',
            'Δ%': 'calculate percentage change',
            '%T': 'percentage of total',
            'y^x': 'raise to power',
            '1/x': 'reciprocal',
            '√x': 'square root',
            'LN': 'natural logarithm',
            'e^x': 'e to the x power',
            'STO': 'store to memory',
            'RCL': 'recall from memory',
            'NPV': 'calculate net present value',
            'IRR': 'calculate internal rate of return',
            'x=0': 'test if zero',
            'x≤y': 'test if x ≤ y',
            'CHS': 'change sign',
            'R↓': 'roll stack down',
            'x↔y': 'swap X and Y',
            'LSTx': 'recall last X',
            '12×': 'multiply by 12 and store to n',
            '12÷': 'divide by 12 and store to i',
            'FRAC': 'fractional part',
            'INTG': 'integer part',
            'n!': 'factorial',
            'RND': 'round to display',
            'P/R': 'polar to rectangular',
            '→P': 'rectangular to polar',
            '→H': 'decimal hours to H.MS',
            '→DEG': 'radians to degrees',
            's': 'standard deviation',
            'x̄,w': 'weighted mean',
            'x̄': 'mean',
            'x̄,r': 'mean',
            'ŷ,r': 'y estimate (regression)',
            'x̂': 'x estimate (regression)',
            'x̂,r': 'x estimate (regression)',
            'PRICE': 'bond price',
            'YTM': 'bond yield to maturity',
            'SL': 'straight-line depreciation',
            'SOYD': 'sum of years depreciation',
            'DB': 'declining balance depreciation',
            'AMORT': 'amortization',
            'INT': 'amortization interest',
            'Σ': 'sum statistics',
            'Σ+': 'add to data set',
            'Σ-': 'remove from data set',
            'D.MY': 'set date format D.MY',
            'M.DY': 'set date format M.DY',
            'ΔDYS': 'calculate days between dates',
            'DATE': 'calculate future/past date'
        };
        
        return descriptions[functionUsed] || '';
    }
    
    formatKeystrokeDisplay(buttonText) {
        // Split button text by spaces to get individual keys
        // Each key is already a complete unit (e.g., "ENTER", "f-REG", "1", "2", "3")
        const keys = buttonText.split(' ').filter(key => key.length > 0);
        
        // Process each key
        let html = '';
        keys.forEach((key, idx) => {
            const isDigit = /^[0-9.]$/.test(key);
            // Keep original text so users can copy/paste symbols like x̄
            const renderedKey = key;
            // Add space before non-digit keys (except first key)
            if (idx > 0 && !isDigit) {
                html += ' ';
            }
            html += `<span class="step-key">${renderedKey}</span>`;
        });
        
        return html;
    }

    renderStep(step) {
        const stepsContainer = document.getElementById('steps-container');
        
        // Remove intro text if it exists
        const intro = stepsContainer.querySelector('.steps-intro');
        if (intro) intro.remove();
        
        const stepElement = document.createElement('div');
        stepElement.className = 'step';
        const formattedButton = this.formatKeystrokeDisplay(step.button);
        stepElement.innerHTML = `
            <div class="step-number">${step.number}</div>
            <div class="step-content">
                <div class="step-button">${formattedButton}</div>
                ${step.description ? `<div class="step-description">${step.description}</div>` : ''}
            </div>
            <div class="step-result">${step.result}</div>
        `;
        
        stepsContainer.appendChild(stepElement);
    }
    
    scrollToBottom() {
        const stepsContainer = document.getElementById('steps-container');
        stepsContainer.scrollTop = stepsContainer.scrollHeight;
    }
    
    updateRegisters() {
        // Update financial registers
        document.getElementById('reg-n').textContent = this.formatRegisterValue(this.n);
        document.getElementById('reg-i').textContent = this.formatRegisterValue(this.i) + '%';
        document.getElementById('reg-pv').textContent = '$' + this.formatRegisterValue(this.pv);
        document.getElementById('reg-pmt').textContent = '$' + this.formatRegisterValue(this.pmt);
        document.getElementById('reg-fv').textContent = '$' + this.formatRegisterValue(this.fv);
        
        // Show/hide financial register group based on whether any values are non-zero
        const hasFinancialValues = this.n !== 0 || this.i !== 0 || this.pv !== 0 || this.pmt !== 0 || this.fv !== 0;
        const financialGroup = document.getElementById('financial-register-group');
        financialGroup.style.display = hasFinancialValues ? 'block' : 'none';
        
        // Update storage registers (only show non-zero)
        const storageContainer = document.getElementById('storage-registers');
        storageContainer.innerHTML = '';
        
        let hasNonZero = false;
        for (let i = 0; i < this.memory.length; i++) {
            if (this.memory[i] !== 0) {
                hasNonZero = true;
                const row = document.createElement('div');
                row.className = 'register-row';
                row.innerHTML = `<span class="register-label">R${i}:</span><span>${this.formatRegisterValue(this.memory[i])}</span>`;
                storageContainer.appendChild(row);
            }
        }
        
        // Show/hide storage register group based on whether any values are stored
        const storageGroup = document.getElementById('storage-register-group');
        if (this.storagePanelHiddenByUser) {
            storageGroup.style.display = 'none';
        } else {
            storageGroup.style.display = hasNonZero ? 'block' : 'none';
        }
    }
    
    formatRegisterValue(value) {
        return this.formatNumber(value, this.displayDecimals);
    }

    updateXYDebug() {
        const xEl = document.getElementById('debug-x');
        const yEl = document.getElementById('debug-y');
        const zEl = document.getElementById('debug-z');
        const tEl = document.getElementById('debug-t');
        if (!xEl || !yEl || !zEl || !tEl) return;
        // Use stack values for full precision when not typing; while typing use display for X
        const xVal = this.isTyping ? parseFloat(this.display.replace(/,/g,'')) || 0 : this.stack[0];
        const yVal = this.stack[1];
        const zVal = this.stack[2];
        const tVal = this.stack[3];
        xEl.textContent = this.formatNumber(xVal);
        yEl.textContent = this.formatNumber(yVal);
        zEl.textContent = this.formatNumber(zVal);
        tEl.textContent = this.formatNumber(tVal);
    }

    toggleStackDebug() {
        const debugPanel = document.getElementById('xy-debug');
        if (debugPanel) {
            if (debugPanel.style.display === 'none') {
                debugPanel.style.display = 'flex';
            } else {
                debugPanel.style.display = 'none';
            }
        }
    }
}

// Initialize calculator when page loads
document.addEventListener('DOMContentLoaded', () => {
    window.calculator = new HP12cCalculator();
    console.log('HP12c Calculator initialized');
    
    // Add g-shift and f-shift labels to buttons
    const buttons = document.querySelectorAll('.calc-btn');
    buttons.forEach(button => {
        const gFunction = button.getAttribute('data-g');
        const fFunction = button.getAttribute('data-f');
        const primaryLabel = button.textContent;
        
        // Build HTML with both f-label and g-label spans
        let labelHTML = `<span class="primary-label">${primaryLabel}</span>`;
        
        // Add f-label if exists (will be shown/hidden by CSS based on f-active class)
        if (fFunction && fFunction.trim() !== '') {
            labelHTML += `<span class="f-label">${fFunction}</span>`;
        }
        
        // Add g-label if exists
        if (gFunction && gFunction.trim() !== '') {
            labelHTML += `<span class="g-label">${gFunction}</span>`;
        } else {
            labelHTML += `<span class="g-label">&nbsp;</span>`;
        }
        
        button.innerHTML = labelHTML;
    });
});
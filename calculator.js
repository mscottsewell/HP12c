// HP12c Financial Calculator Simulator
class HP12cCalculator {
    constructor() {
        this.stack = [0, 0, 0, 0]; // X, Y, Z, T registers (RPN stack)
        this.memory = new Array(20).fill(0); // .0 to .9 and R0 to R9
        
        // Settings - load displayDecimals first before setting display
        this.beginMode = false;
        // Load displayDecimals from localStorage, default to 4 if not set
        this.displayDecimals = localStorage.getItem('hp12c_displayDecimals') 
            ? parseInt(localStorage.getItem('hp12c_displayDecimals')) 
            : 4;
        this.dateFormat = 'MDY'; // Default date format
        this.programMode = false; // Program mode flag
        this.stats = []; // Statistics data
        
        // Now set display with correct decimal places
        this.display = (0).toFixed(this.displayDecimals);
        this.isNewNumber = true;
        this.isTyping = false;
        this.decimalEntered = false;
        this.lastX = 0;
        
        // Function key states
        this.fActive = false;
        this.gActive = false;
        
        // Financial registers
        this.n = 0;    // Number of periods
        this.i = 0;    // Interest rate per period
        this.pv = 0;   // Present value
        this.pmt = 0;  // Payment
        this.fv = 0;   // Future value
        
        // Cash flow registers
        this.cashFlows = [];  // Array to store cash flows
        this.cashFlowCounts = [];  // Array to store counts for each cash flow
        
        // Steps tracking
        this.steps = [];
        this.stepCounter = 0;
        this.lastStepWasNumber = false;
        this.lastTVMWasCalculation = false;
        this.justCalculated = false; // Track if we just completed a calculation
        this.previousStep = null; // Backup of step before it was modified (for CLx undo)
        this.stepBackupSaved = false; // Track if we've already saved a backup for current step
        
        // Double-tap detection for CLx
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
        }
        
        // Capture display value BEFORE executing the function
        const displayBeforeExecution = this.display;
        
        // Execute the function
        this.executeFunction(key, functionUsed);
        
        // Record the step (group consecutive number entries and operations that follow them)
        const isNumberEntry = this.isDigit(key) || key === 'decimal' || key === 'eex' || key === 'chs';
        const isOperatorOrStorage = ['plus', 'minus', 'multiply', 'divide', 'n', 'i', 'pv', 'pmt', 'fv', 
                                       'enter', 'sto', 'rcl', 'percent', 'delta-percent',
                                       'percent-total', 'power', 'reciprocal'].includes(key) ||
                                     ['CFo', 'CFj', 'Nj'].includes(functionUsed);
        
        // Use the appropriate display value for the step
        // For TVM calculations and NPV/IRR, use the calculated value (after execution)
        // For operations that modify existing steps, use current display to show the result
        // For TVM storage operations, use the value before execution (what was stored)
        // For new standalone operations, use the value before execution
        const isTVMCalculation = this.lastTVMWasCalculation && ['n', 'i', 'pv', 'pmt', 'fv'].includes(key);
        const isCalculationFunction = ['NPV', 'IRR'].includes(functionUsed);
        const stepDisplayValue = (isTVMCalculation || isCalculationFunction) ? this.display : 
                                 ((isOperatorOrStorage && this.lastStepWasNumber) ? this.display : displayBeforeExecution);
        
        // Don't record steps for f and g key presses, CLRG, or CLx
        if (key === 'f' || key === 'g') {
            // Don't reset lastStepWasNumber - f and g are just modifiers
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
        
        if (isNumberEntry && this.lastStepWasNumber) {
            // Update the last step instead of creating a new one
            this.updateLastStep(displayButton, functionUsed, this.display);
        } else if (isOperatorOrStorage && this.lastStepWasNumber) {
            // Append operator/storage to the number entry on same row
            this.updateLastStep(displayButton, functionUsed, stepDisplayValue);
            this.lastStepWasNumber = false;  // Reset so next operation starts new row
        } else {
            this.addStep(displayButton, functionUsed, stepDisplayValue);
        }
        this.lastStepWasNumber = isNumberEntry;
        
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
        
        // Number entry - only if the function being executed is the primary (not an f/g function)
        if (this.isDigit(key) && this.isDigit(func)) {
            this.enterDigit(key);
            this.updateDisplay();
            return;
        }
        
        if (func === 'decimal' || key === 'decimal') {
            this.enterDecimal();
            this.updateDisplay();
            return;
        }
        
        if (func === 'EEX' || key === 'eex') {
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
                this.multiply12();
                break;
            case '12÷':
                this.divide12();
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
            } else if (this.waitingForRegister === 'recall') {
                this.recall(register);
            }
            this.waitingForRegister = null;
        }
    }
    
    isDigit(key) {
        return ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'].includes(key);
    }
    
    enterDigit(digit) {
        if (this.isNewNumber) {
            // Lift stack when starting a new number after ENTER or operation
            this.stack[3] = this.stack[2];
            this.stack[2] = this.stack[1];
            this.stack[1] = this.stack[0];
            this.display = digit;
            this.isNewNumber = false;
            this.isTyping = true;
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
        const value = this.getX();
        this.pushStack(value);
        this.isNewNumber = true;
        this.isTyping = false;
        this.decimalEntered = false;
        // Format the display with proper decimal places
        this.display = this.formatNumber(value);
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
        if (this.isTyping) this.pushStack(this.getX());
        const y = this.popStack();
        const x = this.popStack();
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
        // Calculate n from other values (simplified - full implementation is complex)
        this.setX(0);
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
        // Calculate i from other values (simplified - requires iterative solution)
        this.setX(0);
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
    }
    
    recall(register) {
        this.setX(this.memory[register]);
    }
    
    // Statistics
    sigmaPlus() {
        // Simplified implementation
        this.memory[11] = (this.memory[11] || 0) + 1; // n
        this.memory[12] = (this.memory[12] || 0) + this.getX(); // sum of x
        this.memory[13] = (this.memory[13] || 0) + this.stack[1]; // sum of y
    }
    
    sigmaMinus() {
        // Remove from statistics
        this.memory[11] = Math.max(0, (this.memory[11] || 0) - 1);
        this.memory[12] = (this.memory[12] || 0) - this.getX();
        this.memory[13] = (this.memory[13] || 0) - this.stack[1];
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
        const today = new Date();
        const dateStr = today.toLocaleDateString('en-US');
        this.display = dateStr;
    }
    
    daysBetween() {
        // Simplified implementation
        const date1 = new Date(this.stack[1]);
        const date2 = new Date(this.getX());
        const diffTime = Math.abs(date2 - date1);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        this.setX(diffDays);
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
        // Show memory status - simplified version
        this.display = 'MEM OK';
        setTimeout(() => this.updateDisplay(), 1000);
    }
    
    round() {
        const x = this.getX();
        const factor = Math.pow(10, this.displayDecimals);
        this.setX(Math.round(x * factor) / factor);
    }
    
    // Date formats
    setDateFormatDMY() {
        this.dateFormat = 'DMY';
        this.addStep('Set date format to D.MY', 'D.MY');
        this.display = 'D.MY';
        setTimeout(() => this.updateDisplay(), 1000);
    }
    
    setDateFormatMDY() {
        this.dateFormat = 'MDY';
        this.addStep('Set date format to M.DY', 'M.DY');
        this.display = 'M.DY';
        setTimeout(() => this.updateDisplay(), 1000);
    }
    
    // Statistical functions
    meanWeighted() {
        // Weighted mean - requires statistics data
        if (!this.stats || this.stats.length === 0) {
            this.setX(0);
            return;
        }
        // Simplified: just return mean
        const sum = this.stats.reduce((a, b) => a + b, 0);
        this.setX(sum / this.stats.length);
    }
    
    meanLinearReg() {
        // Mean for linear regression
        if (!this.stats || this.stats.length === 0) {
            this.setX(0);
            return;
        }
        const sum = this.stats.reduce((a, b) => a + b, 0);
        this.setX(sum / this.stats.length);
    }
    
    yEstimate() {
        // Y estimate from linear regression - simplified
        this.setX(0);
    }
    
    standardDeviation() {
        // Standard deviation
        if (!this.stats || this.stats.length < 2) {
            this.setX(0);
            return;
        }
        const mean = this.stats.reduce((a, b) => a + b, 0) / this.stats.length;
        const variance = this.stats.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / (this.stats.length - 1);
        this.setX(Math.sqrt(variance));
    }
    
    xEstimate() {
        // X estimate from linear regression - simplified
        this.setX(0);
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
        // Bond price calculation - simplified
        // Requires: settlement date, maturity date, coupon rate, yield
        this.setX(0);
        this.addStep('Calculate bond price', '[PRICE]');
    }
    
    bondYTM() {
        // Bond yield to maturity - simplified
        this.setX(0);
        this.addStep('Calculate bond YTM', '[YTM]');
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
        this.addStep('Calculate straight-line depreciation', '[SL]');
    }
    
    sumOfYearsDepreciation() {
        // Sum of years digits depreciation - simplified
        this.setX(0);
        this.addStep('Calculate SOYD depreciation', '[SOYD]');
    }
    
    decliningBalanceDepreciation() {
        // Declining balance depreciation - simplified
        this.setX(0);
        this.addStep('Calculate declining balance depreciation', '[DB]');
    }
    
    // Amortization functions (simplified)
    amortization() {
        // Amortization calculation - simplified
        this.setX(0);
        this.addStep('Calculate amortization', '[AMORT]');
    }
    
    amortizationInterest() {
        // Amortization interest - simplified
        this.setX(0);
        this.addStep('Calculate amortization interest', '[INT]');
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
            '12×': 'multiply by 12',
            '12÷': 'divide by 12',
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
            'x̄,r': 'mean (linear regression)',
            'ŷ,r': 'y estimate (regression)',
            'x̂': 'x estimate (regression)',
            'PRICE': 'bond price',
            'YTM': 'bond yield to maturity',
            'SL': 'straight-line depreciation',
            'SOYD': 'sum of years depreciation',
            'DB': 'declining balance depreciation',
            'AMORT': 'amortization',
            'INT': 'amortization interest',
            'Σ': 'sum statistics'
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
            // Add space before non-digit keys (except first key)
            if (idx > 0 && !isDigit) {
                html += ' ';
            }
            html += `<span class="step-key">${key}</span>`;
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
        storageGroup.style.display = hasNonZero ? 'block' : 'none';
    }
    
    formatRegisterValue(value) {
        return this.formatNumber(value, this.displayDecimals);
    }
}

// Initialize calculator when page loads
document.addEventListener('DOMContentLoaded', () => {
    window.calculator = new HP12cCalculator();
    console.log('HP12c Calculator initialized');
});
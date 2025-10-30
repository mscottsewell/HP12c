# HP12c Financial Calculator Simulator

An educational web-based simulator of the HP12c Financial Calculator designed to help students learn how to use their real HP12c calculators. The simulator provides an exact replica of the calculator interface with a step-by-step recording system.

## Features

### 🧮 Full Calculator Functionality
- **RPN (Reverse Polish Notation) Logic**: Authentic HP12c stack-based calculations
- **Complete Financial Functions**: 
  - Time Value of Money (TVM): Calculate n, i, PV, PMT, FV with Newton-Raphson methods
  - Cash Flow Analysis: NPV and IRR with multiple cash flows
  - Bond Pricing: Calculate bond price and yield to maturity
  - Amortization: Principal and interest payment schedules
  - Depreciation: Straight-line, SOYD, and declining balance methods
- **Advanced Mathematical Functions**: Powers, roots, logarithms, exponentials
- **Complete Statistical Suite**: 
  - Linear regression with slope and intercept calculations
  - Mean (arithmetic and weighted)
  - Sample standard deviation
  - Y and X estimation from regression line
  - Full Σ+ and Σ- data point management
- **Date Calculations**: 
  - Date arithmetic (add/subtract days with day-of-week)
  - Days between dates (actual and 30/360 bond basis)
  - Support for M.DY and D.MY formats
- **Memory Registers**: 20 storage registers (.0-.9, R0-R9) plus statistical registers

### 📚 Educational Features
- **Step Recording**: Every button press is recorded in sequence
- **CHS Smart Positioning**: Change Sign (CHS) always displays at end of number for clarity
- **Visual Feedback**: Buttons highlight when pressed with smooth animations
- **Function Indicators**: Shows when f or g functions are active
- **Clear Documentation**: Each step shows button name, function, and result
- **Interactive FAQ**: Built-in help system with real calculator examples
- **Auto-scroll**: Steps panel automatically scrolls to show latest entry

### 🎯 Learning Benefits
- **Exact Reproduction**: Students can follow the exact same steps on their physical calculator
- **Visual Learning**: See the calculator layout and button relationships
- **Practice Mode**: Try calculations without risk of breaking anything
- **Export Functionality**: Save step sequences for later reference

## File Structure

```
AmyCalc12c/
├── index.html              # Main HTML structure with button overlays
├── styles.css              # CSS styling and responsive design
├── calculator.js           # Core calculator logic (2400+ lines, all functions)
├── help.js                 # FAQ/Help system with interactive examples
├── export-faq.js           # Tool to export FAQ to Markdown for editing
├── import-faq.js           # Tool to import edited FAQ back to help.js
├── faq-content.md          # Markdown version of FAQ (edit this, not help.js)
├── FAQ-WORKFLOW.md         # Instructions for editing FAQ content
├── CODE-ANALYSIS.md        # Technical analysis and recommendations
├── FUNCTIONS.md            # Complete function documentation (450+ lines)
├── IMPLEMENTATION-SUMMARY.md  # Detailed implementation notes
├── TESTING.md              # Manual testing guide and procedures
├── PROJECT-STATUS.md       # Current status, fixes, and evaluation
├── test-functions.html     # Automated test suite (36 tests)
├── Assets/
│   └── AmyCalc_HP12c.png  # Calculator background image
└── README.md               # This documentation
```

## Usage Instructions

### Starting the Calculator
1. Open `index.html` in a web browser
2. The calculator will initialize with display showing "0.00"
3. Click any button to begin calculations

### Basic Operations

#### Number Entry
- Click number buttons (0-9) to enter digits
- Click `.` for decimal point
- Click `EEX` for scientific notation
- Click `CHS` to change sign

#### RPN Stack Operations
- Click `ENTER` to push number to stack
- Operations work on stack automatically
- Example: 2 ENTER 3 + = 5

#### Function Keys
- Click `f` to access orange functions (shown above buttons)
- Click `g` to access blue functions (shown below buttons)
- Indicators show when f or g mode is active

### Financial Calculations

#### Time Value of Money
1. Enter values for known variables:
   - `n` - Number of periods
   - `i` - Interest rate per period
   - `PV` - Present Value
   - `PMT` - Payment amount
   - `FV` - Future Value

2. Press the key for unknown variable to calculate

#### Example: Loan Payment Calculation
```
360 n           (30 years × 12 months)
6.5 i           (6.5% annual rate)
200000 PV       ($200,000 loan amount)
PMT             (Calculate payment = $1,264.14)
```

### Step Recording System

#### Features
- **Automatic Recording**: Every button press is logged
- **Sequential Numbering**: Steps are numbered for easy following
- **Real-time Display**: See steps appear as you calculate
- **Export Function**: Save steps to text file

#### Educational Use
1. Teacher demonstrates calculation
2. Students follow exact button sequence
3. Export steps for homework/reference
4. Practice with confidence

### Memory Operations

#### Storage
- `STO` + digit: Store display value in register
- `RCL` + digit: Recall value from register
- Example: `5 STO 1` stores 5 in register 1

#### Registers
- `.0` through `.9`: General purpose
- `R0` through `R9`: General purpose
- Special registers for statistics

### Advanced Functions

#### Mathematical
- `y^x`: Raise y to power x
- `1/x`: Reciprocal
- `√x` (f + y^x): Square root
- `LN` (f + %T): Natural logarithm
- `e^x` (f + 1/x): Exponential

#### Statistical
- `Σ+`: Add data point
- `Σ-` (f + Σ+): Remove data point
- Statistics automatically calculated

## Browser Compatibility

### Supported Browsers
- Chrome/Chromium 80+
- Firefox 75+
- Safari 13+
- Edge 80+

### Requirements
- JavaScript enabled
- Modern CSS support
- Local file access (for image loading)

## Educational Implementation

### Classroom Use
1. **Projection**: Display on classroom screen/projector
2. **Individual Practice**: Students use on their devices
3. **Homework**: Export steps for take-home practice
4. **Assessment**: Verify student button sequences

### Learning Objectives
- Master RPN calculation logic
- Understand financial function relationships
- Develop muscle memory for button locations
- Build confidence with calculator operations

### Teaching Tips
- Start with basic arithmetic to introduce RPN
- Demonstrate stack operations visually
- Use real-world financial examples
- Encourage students to verify with physical calculator

## Technical Implementation

### Architecture
- **Pure JavaScript**: No external dependencies
- **CSS Grid/Flexbox**: Responsive button positioning
- **Event-Driven**: Real-time user interaction
- **Local Storage**: Session persistence (optional)

### Calculator Engine
- **IEEE 754**: Standard floating-point arithmetic
- **RPN Stack**: Four-register stack (X, Y, Z, T)
- **Financial Algorithms**: Standard TVM formulas
- **Error Handling**: Graceful overflow/underflow

### Button Mapping
Each button is precisely positioned over the calculator image using CSS absolute positioning. The coordinate system ensures perfect alignment across different screen sizes.

## Troubleshooting

### Common Issues

#### Buttons Not Responding
- Check JavaScript console for errors
- Verify image has loaded completely
- Ensure browser JavaScript is enabled

#### Display Shows "Error"
- Calculator detected invalid operation
- Press `ON` to reset
- Check for division by zero

#### Steps Not Recording
- Verify steps container is visible
- Check browser console for JavaScript errors
- Refresh page and try again

#### Changes Not Showing in Browser
- Hard refresh: Press `Ctrl+F5` (Windows) or `Cmd+Shift+R` (Mac)
- Clear browser cache
- Check that you're viewing the correct file (not a cached version)
- Version numbers in HTML ensure cache-busting: `styles.css?v=47`

### Performance
- Optimized for 60fps button animations
- Minimal memory footprint
- Efficient DOM manipulation
- Auto-scroll keeps latest step visible

## FAQ System

### For Users
- Click the **FAQ** button below the calculator
- Browse categories or search for specific topics
- Follow step-by-step examples for common calculations

### For Editors (Updating FAQ Content)

The FAQ system uses a bidirectional sync between `help.js` (JavaScript) and `faq-content.md` (Markdown):

1. **To Edit FAQ Content:**
   ```bash
   node export-faq.js          # Export current FAQ to Markdown
   # Edit faq-content.md in your text editor
   node import-faq.js          # Import changes back to help.js
   ```

2. **Editing Guidelines:**
   - Keep category key metadata unchanged: `[//]: # (Category Key: tvm)`
   - Maintain backticks (\`) around button references in steps
   - Follow existing format for examples

3. **See FAQ-WORKFLOW.md** for detailed instructions

## Development

### Project Status
- **Core Functions**: ✅ Fully implemented and tested (RPN, basic math, stack operations)
- **Financial TVM**: ✅ Complete and verified (n, i, PV, PMT, FV with END/BEGIN modes)
  - Newton-Raphson solver for interest rate calculations (NPV=0 method)
  - Logarithmic formula for period calculations
  - Proper sign conventions and convergence
- **Cash Flow Analysis**: ✅ Complete (NPV, IRR with iterative methods)
- **Bond Functions**: ✅ Implemented (price, yield to maturity)
- **Depreciation**: ✅ All methods (SL, SOYD, DB with corrected formulas)
- **Amortization**: ✅ Complete (principal/interest schedules)
- **Statistical Functions**: ✅ Fully implemented (Σ+/Σ-, regression, means, std dev, estimates)
- **Date Functions**: ✅ Complete (date arithmetic, days between, M.DY/D.MY formats)
- **Program Mode**: ⚠️ Not implemented (PSE, BST, GTO, PRGM are placeholders)

**Key Fixes Implemented (October 2025)**:
- ✅ Fixed `calculateI()` to solve NPV equation correctly
- ✅ Fixed `decliningBalanceDepreciation()` formula (rate/n)
- ✅ Fixed `amortization()` to return positive values
- ✅ Corrected NPV and IRR test expectations
- ✅ All 36 automated tests passing

See **PROJECT-STATUS.md** for complete evaluation and status report, **FUNCTIONS.md** for complete documentation with formulas, **IMPLEMENTATION-SUMMARY.md** for detailed notes, and **TESTING.md** for verification procedures.

### Testing

A comprehensive test suite is available in `test-functions.html`:
1. Open `test-functions.html` in your web browser
2. Click "Run All Tests" to validate all implementations
3. Tests cover:
   - Financial TVM calculations (n, i, PV, PMT, FV)
   - Statistical functions (regression, means, standard deviation)
   - Date arithmetic and day counting
   - Bond pricing and yield calculations
   - All depreciation methods
   - Amortization schedules
   - NPV and IRR calculations

All tests include known-good reference values from HP12c documentation.

### Customization
- Button positions can be adjusted in CSS (absolute positioning)
- Additional functions can be added to calculator.js
- Display formatting is configurable (localStorage persistence)
- Decimal places: Press `f` then digit (0-9) to set display decimals

### Special Features

#### CHS (Change Sign) Positioning
The CHS button has special handling to improve readability:
- When entering `1` `2` `3` `CHS` `4` `5` `6`, displays as `123456 CHS`
- CHS always appears at end of the number sequence in steps
- Maintains proper negative sign in calculations and descriptions

### Extension Ideas
- Sound effects for button presses
- Keyboard shortcuts
- Custom problem sets
- Integration with LMS systems
- Export calculation history
- Save/load calculator state

## License

This project is designed for educational use. The HP12c is a trademark of HP Inc. This simulator is not affiliated with or endorsed by HP Inc.

## Support

For educational institutions interested in customizing this simulator for their curriculum, please refer to the source code comments for detailed implementation notes.

---

**Note**: This simulator replicates the essential functions of the HP12c for educational purposes. While comprehensive, it may not include every advanced feature of the physical calculator. Always verify critical calculations with the actual HP12c calculator.
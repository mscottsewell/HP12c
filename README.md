# HP12c Financial Calculator Simulator

A web-based educational simulator of the HP12c Financial Calculator with full RPN functionality, comprehensive financial calculations, and an interactive step-by-step recording system. Perfect for learning calculator operations before using the physical device.
<img width="1889" height="1445" alt="image" src="https://github.com/user-attachments/assets/feab38dd-5f6c-4d89-80d6-690c37f92ec4" />

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
├── calculator.js           # Core calculator logic (2400+ lines)
├── help.js                 # FAQ system (auto-generated from faq-content.md)
├── export-faq.js           # Export help.js to Markdown for editing
├── import-faq.js           # Import edited Markdown back to help.js
├── faq-content.md          # Markdown FAQ source (edit this, not help.js)
├── FUNCTIONS.md            # Complete function documentation
├── test-functions.html     # Automated test suite (36 tests)
├── Assets/
│   └── AmyCalc_HP12c.png  # Calculator background image
└── README.md               # This file
```

## Quick Start

1. **Run Locally**: Open `index.html` in any modern web browser
2. **Or Use Web Server**: 
   ```bash
   python -m http.server 8000
   # Navigate to http://localhost:8000
   ```
3. The calculator initializes showing `0.00` - click any button to begin

## Usage Instructions

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

## Educational Use

### For Instructors
- **Live Demonstrations**: Project on classroom screen
- **Step-by-Step Teaching**: Every button press is visible and recorded
- **Export Sequences**: Save calculation steps for handouts
- **Homework Assignments**: Students can practice without physical calculator
- **Assessment**: Verify students understand correct button sequences

### For Students
- **Risk-Free Practice**: Learn without fear of damaging equipment
- **Visual Learning**: See button layout and relationships
- **Muscle Memory**: Develop familiarity before using physical device
- **Self-Paced**: Practice anywhere with just a web browser
- **Reference Tool**: Built-in FAQ with 55+ worked examples

### Learning Path
1. **Start with Basic Arithmetic**: Get comfortable with RPN logic
2. **Practice Stack Operations**: Understand ENTER, stack lift, drop
3. **Learn TVM Functions**: Master loan and savings calculations
4. **Explore Cash Flows**: Work with NPV and IRR for investments
5. **Advanced Topics**: Statistics, bonds, depreciation

### Recommended Workflow
1. Watch instructor demonstration on simulator
2. Follow exact button sequence on physical HP-12c
3. Export steps from simulator for reference
4. Practice independently to build confidence

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

## Browser Compatibility

### Supported Browsers
- Chrome/Chromium 80+
- Firefox 75+
- Safari 13+
- Edge 80+

### Requirements
- JavaScript enabled
- Modern CSS support (transforms, animations)
- Local file access (for image loading)

## Troubleshooting

### Display Shows "Error"
- Invalid operation detected (e.g., division by zero)
- **Solution**: Press `ON` to clear and reset

### Buttons Not Responding
- Check browser console for JavaScript errors
- Verify calculator image has loaded
- Ensure JavaScript is enabled in browser
- **Solution**: Refresh page (Ctrl+F5 / Cmd+Shift+R)

### Changes Not Appearing
- Browser may be serving cached version
- **Solution**: Hard refresh (Ctrl+F5 on Windows, Cmd+Shift+R on Mac)
- Check version numbers in HTML: `styles.css?v=74`, `help.js?v=76`

### Steps Not Recording
- Check that steps panel is visible
- Look for console errors
- **Solution**: Refresh page and retry

### Performance Issues
- Calculator optimized for 60fps animations
- Uses efficient DOM manipulation
- Auto-scrolls to latest step
- **Solution**: Close other browser tabs if sluggish

## FAQ System

### Using the Built-in Help
- Click **FAQ** button to access comprehensive examples
- 10 categories with 55+ worked problems:
  - 💰 Time Value of Money - Basics
  - 🏦 Loans & Financing  
  - 📈 Investment Analysis (IRR, NPV, Leased Fee)
  - 📑 Bond Valuation
  - 💯 Percentage Calculations
  - 📊 Statistical Calculations
  - 🔢 Mathematical Operations
  - 📉 Depreciation Calculations
  - 📅 Date Calculations
  - 💡 Practice Tips

### Editing FAQ Content

**To update examples:**

1. **Export current FAQ to Markdown:**
   ```bash
   node export-faq.js
   ```

2. **Edit `faq-content.md`** in any text editor
   - Keep category metadata: `[//]: # (Category Key: tvm)`
   - Use backticks (\`) around button names in steps
   - Follow existing format for consistency

3. **Import changes back:**
   ```bash
   node import-faq.js
   ```

4. **Update cache version** in `index.html`:
   ```html
   <script src="help.js?v=77"></script>
   ```

**Important:** All FAQ examples have been verified against HP-12C calculations for mathematical accuracy.

## Development

### Testing

**Automated Test Suite** (`test-functions.html`):
- 36 comprehensive tests covering all calculator functions
- All tests passing ✅
- Validates against HP12c reference values

**To run tests:**
1. Open `test-functions.html` in browser
2. Click "Run All Tests"

**Test Coverage:**
- Financial TVM (n, i, PV, PMT, FV)
- Cash flow analysis (NPV, IRR)
- Statistical functions (regression, mean, std dev)
- Date arithmetic and day counting
- Bond pricing and yield
- All depreciation methods
- Amortization schedules

### Implementation Status

| Feature | Status | Notes |
|---------|--------|-------|
| RPN Stack Operations | ✅ Complete | Four-register stack (X, Y, Z, T) |
| Basic Math | ✅ Complete | +, −, ×, ÷, powers, roots, logs |
| Financial TVM | ✅ Complete | Newton-Raphson solver, END/BEGIN modes |
| Cash Flow (NPV/IRR) | ✅ Complete | Iterative methods for complex flows |
| Bond Functions | ✅ Complete | Price and yield to maturity |
| Depreciation | ✅ Complete | SL, SOYD, DB with corrected formulas |
| Amortization | ✅ Complete | Principal/interest schedules |
| Statistics | ✅ Complete | Linear regression, Σ operations |
| Date Functions | ✅ Complete | M.DY/D.MY formats, day counting |
| Memory Registers | ✅ Complete | 20 storage registers |
| Program Mode | ❌ Not Implemented | PSE, BST, GTO, PRGM placeholders |

**Recent Fixes (October 2025):**
- Fixed interest rate calculation (NPV=0 solver)
- Corrected depreciation formulas
- Fixed amortization sign conventions
- Verified all FAQ examples for mathematical accuracy (55 problems)

See **FUNCTIONS.md** for complete documentation with formulas.

### Customization & Extension

**Display Settings:**
- Press `f` + digit (0-9) to set decimal places
- Settings persist in localStorage

**Button Positioning:**
- Adjust coordinates in CSS (absolute positioning over image)
- Each button precisely aligned with background image

**Adding Functions:**
- Extend `calculator.js` with new operations
- Update button handlers in event listeners
- Add corresponding tests to `test-functions.html`

**Extension Ideas:**
- Keyboard shortcuts for button presses
- Sound effects for tactile feedback
- Custom problem sets for specific courses
- LMS integration for homework tracking
- Calculation history export/import
- Save/restore calculator state

## License & Disclaimer

This project is designed for educational use to help students learn HP-12c calculator operations. 

**Trademark Notice**: HP12c is a trademark of HP Inc. This simulator is an independent educational tool and is not affiliated with, endorsed by, or sponsored by HP Inc.

**Educational Purpose**: This simulator replicates essential HP-12c functions for learning purposes. While comprehensive and mathematically verified, always verify critical financial calculations with the actual HP-12c calculator or professional financial software.

**No Warranty**: This software is provided "as is" without warranty of any kind. Use for educational purposes only.

---

**For Support**: Refer to source code comments for implementation details. All FAQ examples have been verified for mathematical accuracy against HP-12c calculations.

# Known Limitations

This HP-12C simulator aims for high fidelity to the original calculator, but includes some intentional simplifications and differences from the physical hardware.

## Programming Feature Simplifications

### Not Implemented

The following programming features from the physical HP-12C are not currently implemented:

1. **Program Entry Mode** - The physical calculator allows entering a sequence of keystrokes that can be replayed
   - `P/R` (Program/Run mode toggle)
   - `SST` (Single Step Through program)
   - `BST` (Back Step through program)
   - `GTO` (Go To line number)
   - `GSB` (Go Subroutine)
   - `RTN` (Return from subroutine)

2. **Conditional Operations**
   - `x≤y` (Test if X less than or equal to Y)
   - `x=0` (Test if X equals zero)
   - `x>y` (Test if X greater than Y)  
   - `x≠0` (Test if X not equal to zero)

3. **Program Memory Management**
   - `MEM` key to view available memory
   - Dynamic allocation between program steps and storage registers

### Rationale

These features were omitted to:

- Simplify the implementation for initial release
- Focus on the calculator's core financial, statistical, and mathematical capabilities
- Reduce complexity for typical web-based usage patterns

Programming capabilities may be added in future versions based on user demand.

## Other Differences

### Display Precision

- The simulator uses JavaScript's native floating-point arithmetic (IEEE 754 double precision)
- The physical HP-12C uses BCD (Binary Coded Decimal) arithmetic
- This may result in minor rounding differences in edge cases

### Continuous Memory

- The simulator saves state to browser localStorage rather than battery-backed RAM
- Settings persist across browser sessions but are isolated per-browser

### Performance

- The simulator executes calculations instantaneously
- The physical HP-12C has slight delays for complex TVM calculations

## What IS Implemented

This simulator includes full support for:

- **RPN Stack Operations** - Four-register stack (X, Y, Z, T) with proper lift behavior
- **LastX Register** - Saves X value before operations for error recovery
- **Scientific Notation (EEX)** - Full support for entering and manipulating scientific notation with proper exponent handling
- **Arithmetic Operations** - Add, subtract, multiply, divide, power, reciprocal, square root
- **Financial Calculations** - TVM (N, I/Y, PV, PMT, FV), NPV, IRR, bonds, amortization, depreciation
- **Statistical Functions** - Σ+, Σ-, mean, standard deviation, linear regression
- **Memory Operations** - 20 storage registers (R0-R9, R.0-R.9) with arithmetic (STO+, STO-, STO×, STO÷, RCL+, RCL-, RCL×, RCL÷)
- **Date Calculations** - Date arithmetic with M.DY and D.MY formats
- **Number Formatting** - Scientific notation, fixed decimal places
- **Percentage Functions** - %, Δ%, %T
- **Conversion Functions** - Polar↔Rectangular, Hours↔H.MS, Degrees↔Radians
- **Cash Flow Sum** - f-Σ calculates sum of all stored cash flows

## Reporting Issues

If you discover calculator behavior that deviates from the physical HP-12C (outside of the documented limitations above), please report it as a bug. The goal is 100% accuracy for all implemented features.

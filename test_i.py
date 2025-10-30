import math

def calculate_pv(n, i, pmt, fv):
    """Calculate PV given n, i, pmt, fv"""
    rate = i / 100
    if rate == 0:
        return -pmt * n - fv
    factor = math.pow(1 + rate, n)
    pv = pmt * ((factor - 1) / (rate * factor)) + fv / factor
    return pv

# Test: For n=40, PMT=-300, FV=0, what i gives PV=10000?
# Note: PV and PMT have opposite signs
print("For n=40, PMT=-300, FV=0 (testing around 0.97%):")
for i_test in [0.95, 0.96, 0.97, 0.98, 0.99, 1.0]:
    pv = calculate_pv(40, i_test, -300, 0)
    print(f"i={i_test:.2f}%: PV={-pv:.2f}")
    
print("\n\nHP12c TVM: Solves for i where PV + PMT×annuity + FV/(1+i)^n = 0")
print("With: PV=10000, PMT=-300, n=40, FV=0")
for i_test in [0.85, 0.87, 0.89, 0.90, 0.91, 0.92, 0.93]:
    rate = i_test / 100
    factor = math.pow(1 + rate, 40)
    annuity = (factor - 1) / (rate * factor)
    npv = 10000 + (-300) * annuity + 0 / factor
    print(f"i={i_test:.2f}%: NPV={npv:.2f} (should be ~0 for solution)")

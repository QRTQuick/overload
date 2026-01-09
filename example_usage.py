#!/usr/bin/env python3
"""
Example usage of Overload client library
"""
import sys
import os

# Add client to path for testing
sys.path.insert(0, os.path.join(os.path.dirname(__file__), 'client'))

from overload import analyze, OverloadError

def main():
    print("🧠 Overload Client Example")
    print("=" * 40)
    
    # Example Python code with bugs
    buggy_code = """
def calculate_average(numbers):
    total = 0
    for num in numbers:
        total += num
    return total / len(numbers)  # Bug: no empty list check

def unsafe_eval(user_input):
    return eval(user_input)  # Security vulnerability

# More bugs
x = 10
if x = 5:  # Syntax error: should be ==
    print("x is 5")

result = calculate_average([])  # Will cause division by zero
print(result)
"""
    
    try:
        print("Analyzing code...")
        bugs = analyze(buggy_code)
        
        if bugs:
            print(f"\n🐛 Found {len(bugs)} issues:")
            print("-" * 40)
            
            for i, bug in enumerate(bugs, 1):
                print(f"{i}. {bug['type']} ({bug['severity']})")
                print(f"   Line: {bug['line'] or 'Multiple'}")
                print(f"   Issue: {bug['description']}")
                print(f"   Fix: {bug['fix']}")
                print()
        else:
            print("✅ No issues found!")
            
    except OverloadError as e:
        print(f"❌ Overload error: {e}")
    except Exception as e:
        print(f"❌ Unexpected error: {e}")

if __name__ == "__main__":
    main()
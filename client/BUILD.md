# Overload Client

This directory contains the Overload client library packaging.

## Building for PyPI

1. Install build tools:
   ```bash
   pip install build twine
   ```

2. Build the package:
   ```bash
   python -m build
   ```

3. Upload to PyPI (test first):
   ```bash
   twine upload --repository testpypi dist/*
   # Then for real PyPI:
   twine upload dist/*
   ```

## Local Installation

```bash
pip install .
```
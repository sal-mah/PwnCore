#!/bin/sh
# Run from this folder. Then open http://localhost:8000
php -S localhost:8000 2>/dev/null || python3 -m http.server 8000

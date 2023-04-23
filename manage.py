#!/usr/bin/env python
"""Django's command-line utility for administrative tasks."""
import os
import sys
import joblib
import pandas as pd


def preprocess(x):
    return pd.Series(x).replace(r'\b([A-Za-z])\1+\b', '', regex=True).replace(r'\b[A-Za-z]\b', '', regex=True)

model = joblib.load('model/model_RF_nonhyper.pkl')

def main():
    """Run administrative tasks."""
    os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'moeApp.settings')
    try:
        from django.core.management import execute_from_command_line
        
    except ImportError as exc:
        raise ImportError(
            "Couldn't import Django. Are you sure it's installed and "
            "available on your PYTHONPATH environment variable? Did you "
            "forget to activate a virtual environment?"
        ) from exc
    execute_from_command_line(sys.argv)

if __name__ == '__main__':
    main()

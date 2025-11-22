#!/bin/bash
export PYTHONPATH=$PYTHONPATH:$(pwd)/src
uvicorn beanscounter.api.app:app --reload --port 8000

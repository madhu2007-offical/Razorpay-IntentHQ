.PHONY: install test run-core run-client benchmark docker-up docker-down help

PYTHON ?= uv run --python 3.12
UVICORN ?= uv run --python 3.12 uvicorn
PYTEST ?= uv run --python 3.12 pytest

help:
	@echo "Razorpay IntentHQ Automation Commands:"
	@echo "  make install     - Setup virtualenv, install Python & Next.js dependencies"
	@echo "  make test        - Run backend pytest test suites"
	@echo "  make run-core    - Start FastAPI verification core on port 8000"
	@echo "  make run-client  - Start Next.js Client Arena on port 3000"
	@echo "  make benchmark   - Run red-team 105-payload adversarial stress test"
	@echo "  make docker-up   - Start full monorepo stack via docker-compose"
	@echo "  make docker-down - Stop docker containers"

install:
	@echo "==> Setting up core-engine dependencies with uv..."
	uv pip install -r core-engine/requirements.txt
	@echo "==> Installing client-arena npm dependencies..."
	cd client-arena && npm install

test:
	@echo "==> Executing formal SMT, neural drift, and Merkle test suites..."
	$(PYTEST) core-engine/tests -v

run-core:
	@echo "==> Launching Razorpay IntentHQ Core Engine on http://localhost:8000..."
	cd core-engine && $(UVICORN) app.main:app --host 0.0.0.0 --port 8000 --reload

run-client:
	@echo "==> Launching Next.js 15 Client Arena on http://localhost:3000..."
	cd client-arena && npm run dev

benchmark:
	@echo "==> Running Red-Team Adversarial SLA & Recall Benchmark..."
	$(PYTHON) redteam-harness/benchmark_runner.py

docker-up:
	docker-compose up --build

docker-down:
	docker-compose down

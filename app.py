
from flask import Flask, render_template, request, jsonify

from scanner.scanner_engine import run_scan

app = Flask(__name__)


# Dashboard
@app.route("/")
def dashboard():
    return render_template("dashboard.html")


# Network Scan Page
@app.route("/network-scan")
def network_scan():
    return render_template("network_scan.html")
@app.route("/risk-analysis")
def risk_analysis():
    return render_template("risk_analysis.html")


# Scan API
@app.route("/scan", methods=["POST"])
def scan():
    data = request.get_json(silent=True) or {}

    target = str(data.get("target", "")).strip()
    port_range = str(data.get("port_range", "1-1000")).strip()
    scan_type = str(data.get("scan_type", "full")).strip()

    if not target:
        return jsonify({
            "success": False,
            "error": "Target cannot be empty."
        }), 400

    if scan_type not in {"full", "port", "service"}:
        return jsonify({
            "success": False,
            "error": "Invalid scan type."
        }), 400

    if not port_range or len(port_range) > 100:
        return jsonify({
            "success": False,
            "error": "Please enter a valid port range."
        }), 400

    try:
        results = run_scan(
            target,
            port_range=port_range,
            scan_type=scan_type
        )

        return jsonify({
            "success": True,
            "results": results
        })

    except ValueError as error:
        return jsonify({
            "success": False,
            "error": str(error)
        }), 400

    except Exception:
        app.logger.exception("Network scan failed")
        return jsonify({
            "success": False,
            "error": "The scan failed. Check the Flask terminal for details."
        }), 500


# Start Application
if __name__ == "__main__":
    app.run(
        debug=True,
        host="127.0.0.1",
        port=5000
    )

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


# Scan API

@app.route("/scan", methods=["POST"])
def scan():

    data = request.get_json()

    target = data.get("target", "").strip()

    if not target:
        return jsonify({
            "success": False,
            "error": "Target cannot be empty."
        }), 400

    try:

        results = run_scan(target)

        return jsonify({
            "success": True,
            "results": results
        })

    except Exception as error:

        return jsonify({
            "success": False,
            "error": str(error)
        }), 500


# Start Application

if __name__ == "__main__":

    app.run(
        debug=True,
        host="127.0.0.1",
        port=5000
    )
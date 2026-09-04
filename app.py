"""
RailSync AI - Prototype Local Server & API Handler
Problem Statement: SIH26027 | Team Jugaad Junction

Runs a zero-dependency HTTP server with built-in REST API endpoints:
- GET  /              -> Serves index.html
- GET  /api/status    -> Health & System Telemetry
- GET  /api/defects   -> Ingested TMS/SMMS/TDMS defects
- POST /api/optimize  -> Runs CP-SAT solver and returns bundled blocks
"""

import http.server
import socketserver
import json
import os
from optimizer import get_sample_defects, get_sample_trains, BlockOptimizationSolver, calculate_criticality_score

PORT = 8080
DIRECTORY = os.path.dirname(os.path.abspath(__file__))


class RailSyncHandler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=DIRECTORY, **kwargs)

    def do_GET(self):
        if self.path == "/api/status":
            self.send_response(200)
            self.send_header("Content-Type", "application/json")
            self.send_header("Access-Control-Allow-Origin", "*")
            self.end_headers()
            status = {
                "status": "ONLINE",
                "system": "RailSync AI - Indian Railways Automatic Block Planning",
                "corridor": "Ghaziabad (GZB) - Kanpur Central (CNB)",
                "division": "Prayagraj (NCR)",
                "data_streams": {
                    "TMS": "CONNECTED (Civil/P-Way)",
                    "SMMS": "CONNECTED (Signals & Telecom)",
                    "TDMS": "CONNECTED (Traction 25kV)",
                    "COA": "CONNECTED (Timetable & Movement)"
                }
            }
            self.wfile.write(json.dumps(status, indent=2).encode("utf-8"))
            return

        elif self.path == "/api/defects":
            self.send_response(200)
            self.send_header("Content-Type", "application/json")
            self.send_header("Access-Control-Allow-Origin", "*")
            self.end_headers()
            defects = get_sample_defects()
            res = []
            for d in defects:
                res.append({
                    "id": d.id,
                    "department": d.department,
                    "asset": d.asset_type,
                    "location_km": d.location_km,
                    "section": d.station_section,
                    "line": d.track_line,
                    "defect_code": d.defect_code,
                    "description": d.description,
                    "urgency_score": calculate_criticality_score(d),
                    "duration_min": d.required_duration_min,
                    "requires_power_cut": d.requires_power_cut
                })
            self.wfile.write(json.dumps(res, indent=2).encode("utf-8"))
            return

        elif self.path == "/api/optimize":
            self.send_response(200)
            self.send_header("Content-Type", "application/json")
            self.send_header("Access-Control-Allow-Origin", "*")
            self.end_headers()
            solver = BlockOptimizationSolver(get_sample_trains(), get_sample_defects())
            blocks = solver.solve()
            res = [
                {
                    "block_id": b.block_id,
                    "section": b.station_section,
                    "line": b.track_line,
                    "start_time_min": b.start_time_min,
                    "end_time_min": b.end_time_min,
                    "duration_min": b.duration_min,
                    "departments_bundled": b.departments_bundled,
                    "tasks_included": b.tasks_included,
                    "is_shadow_block": b.is_shadow_block,
                    "hours_saved": b.hours_saved_vs_siloed,
                    "power_block_sanction": b.power_block_sanction
                }
                for b in blocks
            ]
            self.wfile.write(json.dumps(res, indent=2).encode("utf-8"))
            return

        return super().do_GET()


def run():
    print("=" * 70)
    print("RAILSYNC AI: PROTOTYPE LOCAL SERVER LAUNCHING")
    print(f"Directory: {DIRECTORY}")
    print(f"Open in your browser: http://localhost:{PORT}")
    print("=" * 70)

    with socketserver.TCPServer(("", PORT), RailSyncHandler) as httpd:
        try:
            httpd.serve_forever()
        except KeyboardInterrupt:
            print("\nShutting down server.")


if __name__ == "__main__":
    run()

from flask import Flask, Response
import requests
import subprocess
import time

app = Flask(__name__)
boot_time = time.time()
STORAGE_URL = "http://storage:5001/log"
vstorage_log_file = "/vstorage/records.log"

def get_status_record():
    uptime = float(time.time() - boot_time) / 3600
    diskspace = subprocess.check_output(['df', '-BM', '/', '--output=avail']).decode().split('\n')[1].strip().rstrip('M')
    timestamp = time.strftime('%Y-%m-%dT%H:%M:%SZ')
    return f"{timestamp}: uptime {uptime:.2f} hours, free disk in root: {diskspace} Mbytes"

@app.route("/status", methods=["GET"])
def get_status():
    record = get_status_record()
    requests.post(STORAGE_URL, data=record)

    # Write to vstorage log file
    with open(vstorage_log_file, "a") as f:
        f.write(record + "\n")

    return Response(record, mimetype="text/plain")
    
if __name__ == '__main__':
    app.run(host="0.0.0.0", port=5000)
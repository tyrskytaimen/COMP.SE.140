from flask import Flask, Response, request

app = Flask(__name__)

log_file = "/vstorage/records.log"

@app.route("/log", methods=["POST"])
def save_content():
    record = request.data.decode()

    # Write to container log file vstorage
    with open(log_file, "a") as f:
        f.write(record + "\n")

    return Response(record, mimetype="text/plain")

@app.route("/log", methods=["GET"])
def get_content():
    with open(log_file, "r") as f:
        record = f.read()
    return Response(record, mimetype="text/plain")
    
if __name__ == '__main__':
    app.run(host="0.0.0.0", port=5001)
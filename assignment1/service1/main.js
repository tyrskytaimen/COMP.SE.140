import express from "express";
import checkDiskSpace from "check-disk-space";
import fs from "fs";

const app = express();

const PORT = 8199;
const vstorage_log_file = "/vstorage/records.log";
const SERVICE2_URL = "http://service2:5000/status";
const STORAGE_URL = "http://storage:5001/log";
const boot_time = Date.now()

async function get_diskspace() {
    const diskspace = await checkDiskSpace('/');
    const free_space = (diskspace.free / (1024 * 1024)).toFixed(0)
    return free_space;
}

async function get_status_record() {
    const uptime = ((Date.now() - boot_time) / 1000 / 60 / 60).toFixed(2)
    const diskspace = await get_diskspace()
    const timestamp = new Date().toISOString().split('.')[0] + "Z";
    return `${timestamp}: uptime ${uptime} hours, free disk in root: ${diskspace} Mbytes`
}

app.get('/status', async (req, res) => {
    try {
        // Service 1 status
        const record1 = await get_status_record();

        // Send record to storage
        await fetch(STORAGE_URL, {
            method: "POST",
            headers: { "Content-Type": "text/plain" },
            body: record1,
        });

        // Write record to vstorage log file
        fs.appendFileSync(vstorage_log_file, record1 + "\n");

        // Service 2 status
        const response = await fetch(SERVICE2_URL);
        const record2 = await response.text();

        res.type('text/plain').send(`${record1}\n${record2}\n`);
    } catch (err) {
        res.status(500).send(err.message);
    }
});

app.get('/log', async (req, res) => {
    try {
        const response = await fetch(STORAGE_URL);
        const text = await response.text();
        res.type('text/plain').send(text);
    } catch (err) {
        res.status(500).send(err.message);
    }
});

app.listen(PORT);

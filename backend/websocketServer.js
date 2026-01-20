import cors from "cors";
import express from "express";
import { Server as HttpServer } from "http";
import path from "path";
import { Server as SocketIOServer } from "socket.io";
import { fileURLToPath } from "url";

/* HTTP PORT SERVER */
const app = express();
const server = new HttpServer(app);
const io = new SocketIOServer(server, {
	cors: { origin: "http://localhost:5173", methods: ["GET", "POST"] },
});
const port = 8081;

app.use(cors());
server.listen(port, () =>
	console.log("Socket IO Server - mh-kiosk - running on port " + port),
);

const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);

console.log(dirname);

app.use(express.static(dirname + "/"));

io.on("connection", (socket) => {
	console.log("socket id: ", socket.id);
  socket.emit("hello", socket.id);
  socket.on("trigger", (data) => {
    console.log("trigger number; ", data)
    setTimeout(() => sendCommand(`G005B[A ${data} 100 12]`), 50);
  })
});

/* SERIAL PORT SERVER */
import { ReadlineParser } from "@serialport/parser-readline";
import { SerialPort } from "serialport";
//import { MockBinding } from "@serialport/binding-mock";

//MockBinding.createPort('/dev/null', { echo: true, record: true })
//const serial_port = new SerialPort({ binding: MockBinding, path: "/dev/ttyUSB0",baudRate: 115200 });
const serial_port = new SerialPort({ path: "/dev/ttyUSB0", baudRate: 115200 });
console.log(serial_port);

serial_port.on("open", (socket) => {
	console.log("Serial port - mh-kiosk - opened. Listening for Nexmosphere data...");
});

serial_port.on("connection", (socket) => {
	console.log("Serial port - mh-kiosk - connected");
});
const parser = serial_port.pipe(new ReadlineParser({ delimiter: "\r\n" }));

function sendCommand(command) {
	serial_port.write(`${command}\r\n`, (err) => {
		if (err) {
			console.error("Error sending command:", err.message);
		} else {
			console.log("Command sent:", command);
		}
	});
}

setTimeout(() => sendCommand("G005B[A 1 100 12]"), 50);

// Receive msgs from client
parser.on("data", (data) => {

	console.log("data received from serial dev: ", data)
	//if (data === "X007B[ZONE01=EXIT]") {
	//	console.log("Signal Received:", data);
	//	io.emit("serialdata", { data: data, time: Date.now(), point: 10 });

	//	setTimeout(() => sendCommand("X001B[240301]"), 50);
	//	setTimeout(() => sendCommand("X001B[260001]"), 100);
	//	//serial_port.close()
	//	//serial_port.on('open', () => console.log('connection reestablished with NEXMO'))
	//}
	//if (data === "X007B[ZONE02=EXIT]") {
	//	console.log("Signal Received:", data);
	//	io.emit("serialdata", { data: data, time: Date.now(), point: 5 });

	//	setTimeout(() => sendCommand("X002B[240301]"), 50);
	//	setTimeout(() => sendCommand("X002B[260001]"), 500);
	//}
	//setTimeout(() => sendCommand('X001B[260301]'), 50);
	//setTimeout(() => sendCommand('X002B[260301]'), 100);
	//setTimeout(() => sendCommand('X003B[260301]'), 150);
	//setTimeout(() => sendCommand('X004B[260301]'), 200);
	//setTimeout(() => sendCommand('X005B[260301]'), 250);
	//setTimeout(() => sendCommand('X006B[260301]'), 300);
	//setTimeout(() => sendCommand('X008B[260301]'), 350);
});

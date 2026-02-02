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
  //cors: { origin: "http://localhost:*", methods: ["GET", "POST"] },
  cors: { origin: "http://localhost:5173", methods: ["GET", "POST"] },
});
const port = 8081;

app.use(cors());
server.listen(port, () =>
  console.log("http server - MH-KIOSK - running on port " + port),
);

const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);

console.log(dirname);

app.use(express.static(dirname + "/"));

const triggerLight = (data) => {
  switch (data) {
    case 0:
      setTimeout(() => sendCommand(`G005B[A 0 25 22 0 50 12]`), 50);

      setTimeout(() => sendCommand(`G005B[B 0 0 22]`), 100);
      setTimeout(() => sendCommand(`G111B[D 0 0 22]`), 150);
      setTimeout(() => sendCommand(`G111B[C 0 0 22]`), 200);
      break;
    case 1:
      setTimeout(() => sendCommand(`G005B[B 0 25 22 0 50 12]`), 50);

      setTimeout(() => sendCommand(`G005B[A 0 0 22]`), 100);
      setTimeout(() => sendCommand(`G111B[D 0 0 22]`), 150);
      setTimeout(() => sendCommand(`G111B[C 0 0 22]`), 200);
      break;
    case 2:
      setTimeout(() => sendCommand(`G111B[D 0 25 22 0 50 12]`), 50);

      setTimeout(() => sendCommand(`G005B[A 0 0 22]`), 100);
      setTimeout(() => sendCommand(`G005B[B 0 0 22]`), 150);
      setTimeout(() => sendCommand(`G111B[C 0 0 22]`), 200);
      break;
    case 3:
      setTimeout(() => sendCommand(`G111B[C 0 25 22 0 50 12]`), 50);

      setTimeout(() => sendCommand(`G005B[A 0 0 22]`), 100);
      setTimeout(() => sendCommand(`G005B[B 0 0 22]`), 150);
      setTimeout(() => sendCommand(`G111B[D 0 0 22]`), 200);
      break;
    default:
      setTimeout(() => sendCommand(`G005B[A 0 0 22]`), 50);
      setTimeout(() => sendCommand(`G005B[B 0 0 22]`), 150);
      setTimeout(() => sendCommand(`G111B[D 0 0 22]`), 200);
      setTimeout(() => sendCommand(`G111B[C 0 0 22]`), 250);
      break;
  }
};

const triggerLight_DEV = (data) => {
  // turns on led with two ramp ups, then turns off led
  switch (data) {
    case 0:
      setTimeout(() => sendCommand(`G005B[A 0 25 22 0 50 12]`), 50);
      setTimeout(() => sendCommand("G005B[A 0 0 1]"), 10000);
      break;
    case 1:
      setTimeout(() => sendCommand(`G005B[A 2 25 22 2 50 12]`), 50);
      setTimeout(() => sendCommand("G005B[A 0 0 1]"), 10000);
      break;
    case 2:
      setTimeout(() => sendCommand(`G005B[A 1 25 22 1 50 12]`), 50);
      setTimeout(() => sendCommand("G005B[A 0 0 1]"), 10000);
      break;
    case 3:
      setTimeout(() => sendCommand(`G005B[A 3 25 22 3 50 12]`), 50);
      setTimeout(() => sendCommand("G005B[A 0 0 1]"), 10000);
      break;
    default:
      setTimeout(() => sendCommand(`G005B[A 0 0 22]`), 50);
      break;
  }
};

io.on("connection", (socket) => {
  console.log("socket id: ", socket.id);
  // Sent messages
  socket.emit("hello", socket.id);

  // Received messages
  socket.on("trigger", (data) => {
    console.log("trigger number; ", data);
    triggerLight_DEV(data);
  });
});

/* SERIAL PORT SERVER */
import { ReadlineParser } from "@serialport/parser-readline";
import { SerialPort } from "serialport";

/* Mock Seria Port Binding */
import { MockBinding } from "@serialport/binding-mock";
MockBinding.createPort('/dev/null', { echo: true, record: true })
const serial_port = new SerialPort({ binding: MockBinding, path: "/dev/null",baudRate: 115200 });

//const serial_port = new SerialPort({ path: "/dev/ttyUSB0", baudRate: 115200 });
console.log(serial_port);

serial_port.on("open", (socket) => {
  console.log(
    "Serial port - mh-kiosk - opened. Listening for Nexmosphere data...",
  );
});

//serial_port.on("connection", (socket) => {
//  console.log("Serial port - mh-kiosk - connected");
//});
//
const parser = serial_port.pipe(new ReadlineParser({ delimiter: "\r\n" }));

// send command to serial device
function sendCommand(command) {
  serial_port.write(`${command}\r\n`, (err) => {
    if (err) {
      console.error("Error sending command:", err.message);
    } else {
      console.log("Command sent:", command);
    }
  });
}

// Receive msgs from serial device
parser.on("data", (data) => {
  console.log("data received from serial dev: ", data);
  //if (data === "X007B[ZONE01=EXIT]") {
  //	console.log("Signal Received:", data);
  //	io.emit("serialdata", { data: data, time: Date.now(), point: 10 });
});

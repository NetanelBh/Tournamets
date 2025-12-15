import express from "express";
import net from "net";

const router = express.Router();

router.get("/smtp-test", (req, res) => {
  const socket = net.createConnection(465, "smtp.gmail.com");

  socket.on("connect", () => {
    console.log("✅ Can connect to Gmail SMTP!");
    socket.end();
    res.send("✅ SMTP connection works!");
  });

  socket.on("error", (err) => {
    console.log("❌ Connection error:", err);
    res.status(500).send("❌ SMTP connection failed: " + err.message);
  });
});

export default router;

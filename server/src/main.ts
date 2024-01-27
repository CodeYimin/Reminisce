import cors from "cors";
import express from "express";
import session from "express-session";

async function start() {
  const PORT = 4000;

  const app = express();

  app.use(
    cors(),
    session({
      name: "cook",
      secret: "oesuntoheu",
      saveUninitialized: false,
      resave: false,
    })
  );

  app.get("", (req, res) => {
    res.send("Helo");
  });

  app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
  });
}

start();

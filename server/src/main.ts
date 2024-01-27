import bodyParser from "body-parser";
import cors from "cors";
import express from "express";
import session from "express-session";
import fs from "fs/promises";
import { db } from "./db";

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
    }),
    bodyParser.json({ limit: 1000000000 })
  );

  app.get("", (req, res) => {
    res.send("Helo");
  });

  app.post("/uploadPhoto", async (req, res) => {
    console.log(req.body);
    await fs.writeFile(
      "photo.jpg",
      req.body.data.replace(/^data:image\/png;base64,/, ""),
      "base64"
    );
  });

  app.post("/location", async (req, res) => {
    const data = req.body;
    console.log(data);
  });

  app.post("/register", async (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) {
      res.sendStatus(400);
      return;
    }

    const existingUser = await db.user.findFirst({
      where: {
        username: username,
      },
    });
    if (existingUser) {
      res.sendStatus(400);
      return;
    }

    const user = await db.user.create({
      data: {
        username: username,
        password: password,
      },
    });

    // @ts-ignore
    req.session.userId = user.id;
    res.sendStatus(200);
  });

  app.post("/login", async (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) {
      res.sendStatus(400);
      return;
    }

    const existingUser = await db.user.findFirst({
      where: {
        username: username,
      },
    });
    if (!existingUser || existingUser.password !== password) {
      res.sendStatus(400);
      return;
    }

    // @ts-ignore
    req.session.userId = existingUser.id;
    res.sendStatus(200);
  });

  app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
  });
}

start();

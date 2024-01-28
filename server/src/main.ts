import bodyParser from "body-parser";
import cors from "cors";
import express from "express";
import session from "express-session";
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
    const userId = (req as any).session.userId;

    if (!userId) {
      res.sendStatus(400);
      return;
    }

    const user = await db.user.findUnique({
      where: {
        id: userId,
      },
      include: {
        incomingFriendRequests: {
          select: {
            id: true,
            username: true,
          },
        },
      },
    });

    if (!user) {
      res.sendStatus(400);
      return;
    }

    const { data, location, taggedUserIds } = req.body as {
      data: string;
      location: {
        coords: {
          longitude: number;
          latitude: number;
        };
      };
      taggedUserIds: string[];
    };

    if (!data || !location || !taggedUserIds) {
      res.sendStatus(400);
      return;
    }

    console.log(taggedUserIds);

    await db.photo.create({
      data: {
        data: data,
        ownerId: user.id,
        location: JSON.stringify(location),
        taggedUsers: {
          connect: taggedUserIds.map((taggedUserId) => ({ id: taggedUserId })),
        },
      },
    });

    res.sendStatus(200);
  });

  app.post("/location", async (req, res) => {
    const data = req.body;
    console.log("New location");

    res.sendStatus(200);
  });

  app.get("/getFriends", async (req, res) => {
    const userId = (req as any).session.userId;

    if (!userId) {
      res.sendStatus(400);
      return;
    }

    const user = await db.user.findUnique({
      where: {
        id: userId,
      },
      include: {
        friends: {
          select: {
            id: true,
            username: true,
          },
        },
      },
    });

    if (!user) {
      res.sendStatus(400);
      return;
    }

    res.send(user.friends);
  });

  app.get("/getFriendRequests", async (req, res) => {
    const userId = (req as any).session.userId;

    if (!userId) {
      res.sendStatus(400);
      return;
    }

    const user = await db.user.findUnique({
      where: {
        id: userId,
      },
      include: {
        incomingFriendRequests: {
          select: {
            id: true,
            username: true,
          },
        },
      },
    });

    if (!user) {
      res.sendStatus(400);
      return;
    }

    res.send(user.incomingFriendRequests);
  });

  app.post("/acceptFriendRequest", async (req, res) => {
    const userId = (req as any).session.userId;
    const { otherId } = req.body;

    if (!userId || !otherId) {
      res.sendStatus(400);
      return;
    }

    const user = await db.user.findUnique({
      where: {
        id: userId,
      },
    });

    const other = await db.user.findUnique({
      where: {
        id: otherId,
      },
    });

    if (!user || !other || user.id === other.id) {
      res.sendStatus(400);
      return;
    }

    await db.user.update({
      where: {
        id: userId,
      },
      data: {
        friends: {
          connect: other,
        },
        friendsRelation: {
          connect: other,
        },
        incomingFriendRequests: {
          disconnect: other,
        },
      },
    });

    res.sendStatus(200);
  });

  app.post("/delineFriendRequest", async (req, res) => {
    const userId = (req as any).session.userId;
    const { otherId } = req.body;

    if (!userId || !otherId) {
      res.sendStatus(400);
      return;
    }

    const user = await db.user.findUnique({
      where: {
        id: userId,
      },
    });

    const other = await db.user.findUnique({
      where: {
        id: otherId,
      },
    });

    if (!user || !other || user.id === other.id) {
      res.sendStatus(400);
      return;
    }

    await db.user.update({
      where: {
        id: userId,
      },
      data: {
        incomingFriendRequests: {
          disconnect: other,
        },
      },
    });

    res.sendStatus(200);
  });

  app.post("/removeFriend", async (req, res) => {
    const userId = (req as any).session.userId;
    const { otherId } = req.body;

    if (!userId || !otherId) {
      res.sendStatus(400);
      return;
    }

    const user = await db.user.findUnique({
      where: {
        id: userId,
      },
    });

    const other = await db.user.findUnique({
      where: {
        id: otherId,
      },
    });

    if (!user || !other || user.id === other.id) {
      res.sendStatus(400);
      return;
    }

    await db.user.update({
      where: {
        id: userId,
      },
      data: {
        friends: {
          disconnect: other,
        },
        friendsRelation: {
          disconnect: other,
        },
      },
    });

    res.sendStatus(200);
  });

  app.post("/sendFriendRequest", async (req, res) => {
    const userId = (req as any).session.userId;
    const { otherUsername } = req.body;

    if (!userId || !otherUsername) {
      res.sendStatus(400);
      return;
    }

    const user = await db.user.findUnique({
      where: {
        id: userId,
      },
    });

    const other = await db.user.findUnique({
      where: {
        username: otherUsername,
      },
      include: {
        friends: true,
      },
    });

    if (
      !user ||
      !other ||
      user.id === other.id ||
      other.friends.some((f) => f.id === user.id)
    ) {
      res.sendStatus(400);
      return;
    }

    await db.user.update({
      where: {
        id: other.id,
      },
      data: {
        incomingFriendRequests: {
          connect: user,
        },
      },
    });

    res.sendStatus(200);
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

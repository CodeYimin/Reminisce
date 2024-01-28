import axios from "axios";
import bodyParser from "body-parser";
import cors from "cors";
import express from "express";
import session from "express-session";
import { getDistance } from "geolib";
import { db } from "./db";

interface Location {
  longitude: number;
  latitude: number;
  time: number;
}

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

  app.get("/notification", async (req, res) => {
    const { id, includePhoto } = req.query;

    if (!id) {
      res.sendStatus(400);
      return;
    }

    const notification = await db.notification.findUnique({
      where: { id: id as string },
      include: {
        photo: includePhoto === "1",
        messages: {
          include: {
            owner: {
              select: {
                user: {
                  select: {
                    id: true,
                    username: true,
                  },
                },
              },
            },
          },
          orderBy: {
            createdAt: "desc",
          },
        },
        recipients: {
          select: {
            user: {
              select: { id: true, username: true },
            },
            sharingLocation: true,
            longitude: true,
            latitude: true,
          },
        },
      },
    });

    if (!notification) {
      res.sendStatus(400);
      return;
    }

    res.send({
      ...notification,
      recipients: notification.recipients.map((r) => ({
        ...r,
        longitude: r.sharingLocation ? r.longitude?.toNumber() : undefined,
        latitude: r.sharingLocation ? r.latitude?.toNumber() : undefined,
      })),
    });
  });

  app.post("/sendNotificationMessage", async (req, res) => {
    const userId = (req as any).session.userId;

    if (!userId) {
      res.sendStatus(400);
      return;
    }

    const { notificationId, message } = req.body as {
      notificationId: string;
      message: string;
    };

    if (!notificationId || !message) {
      res.sendStatus(400);
      return;
    }

    const user = await db.notificationUser.findFirst({
      where: {
        userId: userId,
        notificationId: notificationId,
      },
    });

    if (!user) {
      res.sendStatus(400);
      return;
    }

    await db.message.create({
      data: {
        content: message,
        ownerId: user.id,
        notificationId: notificationId,
      },
    });

    res.sendStatus(200);
  });

  app.post("/toggleVisibility", async (req, res) => {
    const userId = (req as any).session.userId;

    if (!userId) {
      res.sendStatus(400);
      return;
    }

    const { notificationId } = req.body as {
      notificationId: string;
    };

    if (!notificationId) {
      res.sendStatus(400);
      return;
    }

    const user = await db.notificationUser.findFirst({
      where: {
        userId: userId,
        notificationId: notificationId,
      },
    });

    if (!user) {
      res.sendStatus(400);
      return;
    }

    await db.notificationUser.update({
      where: {
        id: user.id,
      },
      data: {
        sharingLocation: !user.sharingLocation,
      },
    });

    res.sendStatus(200);
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

    await db.photo.create({
      data: {
        data: data,
        ownerId: user.id,
        longitude: location.coords.longitude,
        latitude: location.coords.latitude,
        taggedUsers: {
          connect: taggedUserIds.map((taggedUserId) => ({ id: taggedUserId })),
        },
      },
    });

    res.sendStatus(200);
  });

  const userLocations: { [userId: string]: Location } = {};

  setInterval(async () => {
    const photos = await db.photo.findMany({
      where: {
        relived: false,
      },
      select: {
        longitude: true,
        latitude: true,
        timeCreated: true,
        owner: true,
        taggedUsers: true,
        id: true,
      },
    });

    photos.forEach(async (photo) => {
      const users = [photo.owner, ...photo.taggedUsers];

      for (const user of users) {
        if (userLocations[user.id]) {
          console.log(
            getDistance(
              {
                latitude: photo.latitude.toNumber(),
                longitude: photo.longitude.toNumber(),
              },
              userLocations[user.id]
            )
          );
        }
        if (
          !userLocations[user.id] ||
          getDistance(
            {
              latitude: photo.latitude.toNumber(),
              longitude: photo.longitude.toNumber(),
            },
            userLocations[user.id]
          ) > 1000
        ) {
          return;
        }
      }

      const notification = await db.notification.create({
        data: {
          photoId: photo.id,
          recipients: {
            create: users.map((u) => ({ userId: u.id })),
          },
        },
      });

      await db.photo.update({
        where: { id: photo.id },
        data: {
          relived: true,
        },
      });

      await Promise.all(
        users.map((u) =>
          axios.post(`https://app.nativenotify.com/api/indie/notification`, {
            subID: u.id,
            appId: 19139,
            appToken: "DLvOby9T6bf4IVzrvpA6CN",
            title: "Reminisce!",
            message: "Relive a memory!",
            pushData: `{ \"id\": "${notification.id}" }`,
          })
        )
      );
    });
  }, 5000);

  app.post("/location", async (req, res) => {
    const data = req.body;

    const userId = (req as any).session.userId;
    if (!userId) {
      res.sendStatus(400);
      return;
    }

    userLocations[userId] = {
      longitude: parseFloat(data.coords.longitude),
      latitude: parseFloat(data.coords.latitude),
      time: data.timestamp,
    };

    await db.notificationUser.updateMany({
      where: {
        sharingLocation: true,
        userId: userId,
      },
      data: {
        longitude: parseFloat(data.coords.longitude),
        latitude: parseFloat(data.coords.latitude),
      },
    });

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
      select: {
        id: true,
        username: true,
        password: true,
      },
    });
    if (!existingUser || existingUser.password !== password) {
      res.sendStatus(400);
      return;
    }

    // @ts-ignore
    req.session.userId = existingUser.id;
    res.status(200);
    res.send({ id: existingUser.id, username: existingUser.username });
  });

  app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
  });
}

start();

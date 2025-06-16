import * as functions from "firebase-functions";
import { initializeApp, getApps } from "firebase-admin/app";
import next from "next";
import { Request, Response } from "express";

// Initialize Admin if not already done
if (!getApps().length) initializeApp();

const dev = process.env.NODE_ENV !== "production";
const app = next({
  dev,
  // Tell Next where your .next build output is
  conf: { distDir: "../.next" }
});
const handle = app.getRequestHandler();

export const nextServer = functions
  .runWith({ memory: "1GB", timeoutSeconds: 60 })
  .https.onRequest(async (req: Request, res: Response) => {
    await app.prepare();
    return handle(req, res);
  });
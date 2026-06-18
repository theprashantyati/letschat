import { getAuth } from "@clerk/express";
import User from "../models/user.model.js";

export async function checkAuth(req, res, next) {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    res.status(200).json(req.user);
  } catch (error) {
    console.error("Error in checkAuth:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

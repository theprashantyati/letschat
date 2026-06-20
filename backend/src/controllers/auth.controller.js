// import { getAuth } from "@clerk/express";
// import User from "../models/user.model.js";

// export async function checkAuth(req, res, next) {
//   try {
//     if (!req.user) {
//       return res.status(401).json({ message: "Unauthorized" });
//     }

//     res.status(200).json(req.user);
//   } catch (error) {
//     console.error("Error in checkAuth:", error);
//     res.status(500).json({ message: "Internal server error" });
//   }
// }

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

// NEW ENDPOINT: Create or sync user to MongoDB
export async function createOrUpdateUser(req, res) {
  try {
    const user = req.user;

    if (!user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const email =
      user.emailAddresses?.find((e) => e.id === user.primaryEmailAddressId)?.emailAddress ||
      user.emailAddresses?.[0]?.emailAddress;

    const fullName = [user.firstName, user.lastName].filter(Boolean).join(" ") || user.username || email?.split("@")[0];

    if (!email || !fullName) {
      return res.status(400).json({ message: "Invalid user data from Clerk" });
    }

    const dbUser = await User.findOneAndUpdate(
      { clerkId: user.id },
      {
        clerkId: user.id,
        email,
        fullName,
        profilePic: user.imageUrl || "",
      },
      { new: true, upsert: true, setDefaultsOnInsert: true }
    );

    console.log(`✅ User synced to MongoDB: ${dbUser._id}`);

    res.status(200).json({
      message: "User synced successfully",
      user: dbUser,
    });
  } catch (error) {
    console.error("❌ Error in createOrUpdateUser:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}
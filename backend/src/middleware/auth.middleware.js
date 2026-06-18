import { getAuth } from "@clerk/express";
import User from "../models/user.model.js";

export async function protectRoute(req, res, next) {
  try {
    const { userId, user: clerkUser } = getAuth(req);

    if (!userId) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }

    let user = await User.findOne({ clerkId: userId });

    // If user doesn't exist in MongoDB, create them (fallback sync)
    if (!user && clerkUser) {
      console.log(`Syncing user ${userId} from Clerk to MongoDB (fallback)`);

      const email =
        clerkUser.emailAddresses?.find((e) => e.id === clerkUser.primaryEmailAddressId)?.emailAddress ??
        clerkUser.emailAddresses?.[0]?.emailAddress;

      const fullName =
        `${clerkUser.firstName || ""} ${clerkUser.lastName || ""}`.trim() ||
        clerkUser.username ||
        email?.split("@")[0] ||
        "User";

      user = await User.create({
        clerkId: userId,
        email: email || `user-${userId}@clerk.local`,
        fullName,
        profilePic: clerkUser.imageUrl || "",
      });

      console.log(`User ${userId} created in MongoDB via fallback sync`);
    }

    if (!user) {
      res.status(404).json({ message: "User profile could not be created" });
      return;
    }

    req.user = user;

    next();
  } catch (error) {
    console.error("Error in protectRoute middleware:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
}

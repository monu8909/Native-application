import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import { connectDB } from "./config/db.js";
import { env } from "./config/env.js";
import { User, USER_ROLES } from "./models/User.js";

async function run() {
  try {
    await connectDB(env.MONGODB_URI);

    const phone = "8433203463";
    const password = "123456";
    const passwordHash = await bcrypt.hash(password, 10);

    let user = await User.findOne({ phone });
    if (user) {
      user.passwordHash = passwordHash;
      user.role = USER_ROLES.ADMIN;
      await user.save();
      console.log("Admin user updated securely.");
    } else {
      await User.create({
        phone,
        passwordHash,
        role: USER_ROLES.ADMIN,
        name: "Super Admin",
        isActive: true,
      });
      console.log("Admin user created securely.");
    }

    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

run();

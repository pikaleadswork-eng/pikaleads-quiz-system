import { drizzle } from "drizzle-orm/mysql2";
import { users } from "../drizzle/schema.ts";
import bcrypt from "bcryptjs";
import { eq } from "drizzle-orm";

const DATABASE_URL = process.env.DATABASE_URL;

if (!DATABASE_URL) {
  console.error("DATABASE_URL environment variable is not set");
  process.exit(1);
}

const db = drizzle(DATABASE_URL);

async function createAdmin() {
  const email = "pikaleadswork@gmail.com";
  const password = "29031997aSS@";
  const name = "Admin User";

  try {
    // Check if admin already exists
    const existing = await db.select().from(users).where(eq(users.email, email)).limit(1);

    if (existing.length > 0) {
      console.log("Admin user already exists");
      
      // Update password
      const passwordHash = await bcrypt.hash(password, 10);
      await db.update(users).set({ passwordHash }).where(eq(users.email, email));
      console.log("Admin password updated successfully");
    } else {
      // Create new admin
      const passwordHash = await bcrypt.hash(password, 10);
      await db.insert(users).values({
        name,
        email,
        passwordHash,
        role: "admin",
        isActive: true,
      });
      console.log("Admin user created successfully");
    }

    console.log(`
Admin credentials:
Email: ${email}
Password: ${password}
`);
    
    process.exit(0);
  } catch (error) {
    console.error("Error creating admin:", error);
    process.exit(1);
  }
}

createAdmin();

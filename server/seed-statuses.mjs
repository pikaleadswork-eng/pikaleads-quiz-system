import { drizzle } from "drizzle-orm/mysql2";
import { leadStatuses } from "../drizzle/schema.ts";

const db = drizzle(process.env.DATABASE_URL);

const defaultStatuses = [
  { name: "New", color: "#3B82F6", order: 1, isDefault: 1, createdBy: 1 },
  { name: "In Progress", color: "#F59E0B", order: 2, isDefault: 0, createdBy: 1 },
  { name: "Contacted", color: "#8B5CF6", order: 3, isDefault: 0, createdBy: 1 },
  { name: "Qualified", color: "#10B981", order: 4, isDefault: 0, createdBy: 1 },
  { name: "Closed Won", color: "#22C55E", order: 5, isDefault: 0, createdBy: 1 },
  { name: "Closed Lost", color: "#EF4444", order: 6, isDefault: 0, createdBy: 1 },
];

async function seed() {
  console.log("Seeding default lead statuses...");
  
  for (const status of defaultStatuses) {
    await db.insert(leadStatuses).values(status).onDuplicateKeyUpdate({ set: { order: status.order } });
  }
  
  console.log("✓ Default statuses seeded successfully");
  process.exit(0);
}

seed().catch((err) => {
  console.error("Error seeding statuses:", err);
  process.exit(1);
});

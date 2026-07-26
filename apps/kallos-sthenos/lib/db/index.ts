import { getDb } from "./connection";
import { migrate } from "./migrate";

// Initialize the database on first import
migrate();

export { getDb };

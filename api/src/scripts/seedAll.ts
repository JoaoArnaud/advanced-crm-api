/**
 * Seed script stub used in deployment environments (Render)
 * to satisfy the build command even when no seeding is needed.
 * Add your seed logic here if/when required.
 */
async function seed() {
  console.info("[seed] No seed operations defined. Skipping.");
}

seed()
  .then(() => {
    console.info("[seed] Completed successfully.");
  })
  .catch((err) => {
    console.error("[seed] Failed:", err);
    process.exit(1);
  });

import { closeDatabaseConnection, getConnection } from "./server";
import { faker } from "@faker-js/faker";
import { createTask, createUser } from "./lib/databaseHelpers";

async function seed(entriesNumber: number) {
  try {
    await seedUserTable(entriesNumber);
    await seedTaskTable(entriesNumber * 5, entriesNumber);
    console.log("Database seeding completed successfully");
  } catch (error) {
    console.error("Error seeding database:", error);
  }
}

async function seedUserTable(entriesNumber: number) {
  const connection = await getConnection();

  try {
    await connection.execute("DELETE FROM users");
    await connection.execute("ALTER TABLE users AUTO_INCREMENT = 1");

    const userPromises = Array.from({ length: entriesNumber }).map(() => {
      const username = faker.internet.userName();
      const password = faker.internet.password();
      return createUser(username, password);
    });

    await Promise.all(userPromises);
    console.log(`${entriesNumber} users seeded successfully`);
  } catch (error) {
    console.error("Error seeding users:", error);
  }
}

async function seedTaskTable(entriesNumber: number, maxUserId: number) {
  const connection = await getConnection();

  try {
    await connection.execute("DELETE FROM tasks");
    await connection.execute("ALTER TABLE tasks AUTO_INCREMENT = 1");

    const taskPromises = Array.from({ length: entriesNumber }).map(() => {
      const title = faker.lorem.sentence();
      const description = faker.lorem.lines();
      const userId = faker.number.int({ min: 1, max: maxUserId });
      return createTask(title, description, userId);
    });

    await Promise.all(taskPromises);
    console.log(`${entriesNumber} tasks seeded successfully`);
  } catch (error) {
    console.error("Error seeding tasks:", error);
  }
}

(async function () {
  await seed(100);
  await closeDatabaseConnection();
})();

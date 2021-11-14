import readline from "readline";
import mongoSetup from "../database/mongoSetup";
import { generateMockAdmins, generateMockBlogPosts, generateMockProjects, generateMockUsers } from "./mockDataGeneration";

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const options = `
  1: Seed Blog Posts
  2: Seed Blog Post Comments
  3: Seed Projects
  4: Seed Users
  5: Seed Admins
  0: Exit
`;



/*
(async function() {
  await mongoSetup();
  await generateMockBlogPosts();
  console.log("done");
  process.exit(0);
})();
*/
const setUpDB = async (): Promise<void> => {
  try {
    console.log("Setting up database");
    await mongoSetup();
  } catch (error) {
    console.log("Database error occured");
    console.log(error);
    process.exit(1);
  }
}
const processCreateBlogPosts = async (data: string): Promise<void> => {
  try {
    const num = parseInt(data, 10);
    await generateMockBlogPosts({ number: num });
  } catch (error) {
    throw error;
  }
};
const processCreateProjects = async (data: string): Promise<void> => {
  try {
    const num = parseInt(data, 10);
    await generateMockProjects(num);
  } catch (error) {
    throw error;
  }
};
const processCreateUserModels = async (data: string): Promise<void> => {
  try {
    const num = parseInt(data, 10);
    await generateMockUsers({ number: num });
  } catch (error) {
    throw error;
  }
};
const processCreateAdminModels = async (data: string): Promise<void> => {
  try {
    const num = parseInt(data, 10);
    await generateMockAdmins(num);
  } catch (error) {
    throw error;
  }
};

const processOption = async (data: any): Promise<void> => {
  try {
    const num = parseInt(data, 10);
    switch (num) {
      case (1): {
        rl.question("How many blog posts would you like to create?\n", async (data) => {
          try {
            await processCreateBlogPosts(data);
            return showMainScreen();
          } catch (error) {
            console.log(error);
            process.exit(0);
          }
        });
        break;
      }
      case (2): {
        console.log("Comments are not implemented yet.\n");
        return showMainScreen();
      }
      case (3): {
        rl.question("How many mock projects would you like to create?\n", async (data) => {
          try {
            await processCreateProjects(data);
            return showMainScreen();
          } catch (error) {
            console.log(error);
            process.exit(0);
          }
        });
        break;
      }
      case (4): {
        rl.question("How many regular mock <User> models would you like to create?\n", async (data) => {
          try {
            await processCreateUserModels(data);
            return showMainScreen();
          } catch (error) {
            console.log(error);
            process.exit(1);
          }
        });
        break;
      }
      case (5): {
        rl.question("How many mock <Admin> models would you like to create?\n", async (data) => {
          try {
            await processCreateAdminModels(data);
            return showMainScreen();
          } catch (error) {
            console.log(error);
            process.exit(1);
          }
        });
        break;
      }
      case (0): {
        console.log("Good Bye!\n");
        process.exit(0);
      }
      default: {
        console.log("Invalid input\n");
        return showMainScreen();
      }
    }
  } catch (error) {
    console.log(error)
    process.exit(1);
  }
}
const showMainScreen = () => {
  console.log("Hey there! Mock data generation:\n");
  console.log(options);
  rl.question("Please select an option\n", async (data) => {
    await processOption(data);
  });
};

async function seedDbGen() {
  await setUpDB();
  console.log("Hello there\n");
  showMainScreen();
}

seedDbGen();


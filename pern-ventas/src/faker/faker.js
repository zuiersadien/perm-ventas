const { faker } = require("@faker-js/faker");
const fs = require("fs");

function generateUsers() {
  let users = [];

  for (let id = 1; id <= 100; id++) {
    const product = faker.commerce.product();
    const firstName = faker.name.firstName();
    const number = Math.random() * 1000000;
    const code = (Math.random() * 1000000).toFixed(0);
    users.push({
      id: id,
      firsName,
      lastName,
      code,
    });
  }
  return { data: users };
}
export const generatedata = generateUsers();
fs.writeFileSync("data.json", JSON.stringify(generatedata));

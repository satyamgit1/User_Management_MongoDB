const express = require("express");
const users = require("./MOCK_DATA.json");
const fs = require("fs");
const app = express();
const PORT = 2000;

//Middleware - plugin
// use to send data from body
app.use(express.urlencoded({ extended: false }));

// ROUTES
app.get("/api/users", (req, res) => {
  return res.json(users);
});
// this will display all the users with their details

// HTML DOCUMENT RENDER
app.get("/users", (req, res) => {
  // Generate HTML dynamically using template literals
  const html = `
      <ul>
        ${users.map((user) => `<li>${user.first_name}</li>`).join("")}
      </ul>
    `;
  // Send the HTML response
  // http://localhost:2000/users this will display all the users
  //     Phillip
  // Cissiee
  // Steven
  // Antonino
  // Starlin
  res.send(html);
});

//   Display only user with particular id
// http://localhost:2000/api/users/1

// app.get("/api/users/:id", (req, res) => {
//     const id = Number(req.params.id);
//     const user = users.find((user) => user.id === id);
//     if (user) {
//         return res.json(user);
//     } else {
//         return res.status(404).json({ error: 'User not found' });
//     }
// });

app
  .route("/api/users/:id")
  .get((req, res) => {
    const id = Number(req.params.id);
    const user = users.find((user) => user.id === id);
    if (user) {
      return res.json(user);
    } else {
      return res.status(404).json({ error: "User not found" });
    }
  })
  .put((req, res) => {
    const id = Number(req.params.id);
    const index = users.findIndex(user => user.id === id);
    if (index !== -1) {
        users[index] = req.body;
        users[index].id = id; // Ensure ID remains unchanged
        return res.json(users[index]);
    } else {
        return res.status(404).json({ error: 'User not found' });
    }
})
.patch((req, res) => {
    const id = Number(req.params.id);
    const index = users.findIndex(user => user.id === id);
    if (index !== -1) {
        users[index] = { ...users[index], ...req.body };
        return res.json(users[index]);
    } else {
        return res.status(404).json({ error: 'User not found' });
    }
})
 // DELETE request to delete user by ID
 app.delete("/api/users/:id", (req, res) => {
    const id = Number(req.params.id);
    const index = users.findIndex((user) => user.id === id);
    if (index !== -1) {
      users.splice(index, 1);
      return res.json({ success: true, message: "User deleted successfully" });
    } else {
      return res.status(404).json({ error: "User not found" });
    }
  });

app.post("/api/users", (req, res) => {
  const body = req.body;
  users.push({...body, id: users.length+1});
  fs.writeFile("./MOCK_DATA.json", JSON.stringify(users), (error, data) => {
    return res.json({ status: "Success", id: users.length });
  });
});

app.listen(PORT, () => {
  console.log("Server started on port 2000);");
});

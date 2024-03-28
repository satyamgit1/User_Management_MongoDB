const express = require("express");
// const users = require("./MOCK_DATA.json");
const fs = require("fs");
const mongoose = require("mongoose");

const app = express();
const PORT = 2000;

//connection
mongoose
  .connect("mongodb://127.0.0.1:27017/user_management")
  .then(() => console.log("MongoDb is Connected"))
  .catch((err) => console.log("Mongodb error", err));

//Schema of Mongoose
const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
    },
    email: {
      type: String,
      // required: true,
    },
    jobTitle: {
      type: String,
    },
    gender: {
      type: String,
    },
  },
  { timestamps: true }
);
const User = mongoose.model("user", userSchema); //model name is also collection name

// DATE: 26 march 2024
//Middleware - plugin
// use to send data from body
app.use(express.urlencoded({ extended: false }));

app.use((req, res, next) => {
  console.log("hello from middleware 1");
  // req.Username = "satyam singh";
  fs.appendFile(
    "log.txt",
    `\n${Date.now()}:${req.ip} ${req.method}: ${req.path}`,
    (err, data) => {
      next();
    }
  );

  // return res.json({msg : "hello from middleware 1"});
});

// app.use((req,res,next)=>{
//   console.log("helo from middleware 2", req.Username);

//   return next();
//   })

// ROUTES
app.get("/api/users", async (req, res) => {
  const allDbUsers = await User.find({});

  // console.log("I am in get route",req.Username);
  res.setHeader("X-myname", "satyam singh"); //  put x before header it indicate that it is a custom header
  return res.json(allDbUsers);
});
// this will display all the users with their details

// HTML DOCUMENT RENDER
app.get("/users", async (req, res) => {
  const allDbUsers = await User.find({});
  // Generate HTML dynamically using template literals
  const html = `
      <ul>
        ${allDbUsers
          .map((user) => `<li>${user.firstName} - ${user.email}</li>`)
          .join("")}
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
  .get(async (req, res) => {
    const user = await User.findById(req.params.id);
    if (user) {
      return res.json(user);
    } else {
      return res.status(404).json({ error: "User not found" });
    }
  })
  .put((req, res) => {
    const id = Number(req.params.id);
    const index = users.findIndex((user) => user.id === id);
    if (index !== -1) {
      users[index] = req.body;
      users[index].id = id; // Ensure ID remains unchanged
      return res.json(users[index]);
    } else {
      return res.status(404).json({ error: "User not found" });
    }
  })
  .patch(async (req, res) => {
    await User.findByIdAndUpdate(req.params.id, { lastName: "tiwari" });
    return res.json({ status: "success" });
  })
  .delete(async (req, res) => {
    await User.findByIdAndDelete(req.params.id);
    return res.json({ status: "success" });
  });

app.post("/api/users", async (req, res) => {
  const body = req.body;
  if (
    !body ||
    !body.first_name ||
    !body.last_name ||
    !body.email ||
    !body.gender ||
    !body.job_title
  ) {
    // to check 400 status code
    return res.status(400).json({ msg: "All fields are required" });
  }
  const result = await User.create({
    firstName: body.first_name,
    lastName: body.last_name,
    email: body.email,
    gender: body.gender,
    jobTitle: body.job_title,
  });
  console.log("result", result);
  return res.status(201).json({ msg: "success" });
  // below lines is commented out for mongoDB
  // users.push({ ...body, id: users.length + 1 });
  // fs.writeFile("./MOCK_DATA.json", JSON.stringify(users), (error, data) => {
  //   return res.json({ status: "Success", id: users.length });
  // });
});

app.listen(PORT, () => {
  console.log("Server started on port 2000);");
});

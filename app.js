//Imprting Package
const express = require("express");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");
const morgan = require("morgan");
const flash = require("connect-flash");
const path = require("path");
const request = require("request");
const e = require("express");

const app = express();

// Load env vars
dotenv.config({ path: "./config/config.env" });

// Logging Morgan
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

//Setting static file
app.use(express.static("public"));

//Bodyparser
app.use(bodyParser.urlencoded({ extended: true }));

//seting ejs template
app.set("view engine", "ejs");

app.get("/", (req, res) => {
  res.render("index");
});

app.post("/", (req, res) => {
  const { firstName, lastName, email, phone } = req.body;
  let errors = [];

  //Data Validation
  if (!firstName || !lastName || !email || !phone) {
    errors.push({ msg: "Please fill in all fields" });
  }
  if (errors.length > 0) {
    res.render("index", { errors, firstName, lastName, email, phone });
  } else {
    var data = {
      members: [
        {
          email_address: email,
          status: "subscribed",
          merge_fields: {
            FNAME: firstName,
            LNAME: lastName,
            PHONE: phone,
          },
        },
      ],
    };

    var jsonData = JSON.stringify(data);

    const options = {
      url: "https://us14.api.mailchimp.com/3.0/lists/abc447db13",
      method: "POST",
      headers: {
        Authorization: "Master1 735554e6f30f15ebcb3aacb39bf6519c-us14",
      },
      body: jsonData,
    };

    request(options, function (error, response, body) {
      if (error) {
        console.log(error);
      } else {
        console.log(response.statusCode);
      }
      if (response.statusCode === 200) {
        // res.send("Succesfully subscribed!");
        res.render("success");
      } else {
        //res.send("There was an error with signing up, please try again!");
        res.render("failure");
      }
    });
  }
});

// Setting the PORT
const PORT = process.env.PORT || 3000;

app.listen(PORT, () =>
  console.log(
    ` The server running in ${process.env.NODE_ENV} mode on port ${PORT}`
  )
);

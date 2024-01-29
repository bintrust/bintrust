const User = require("../models/user");

module.exports = {
  saveUser: async (req, res) => {
    // check for password_confirmation
    if (!(req.body.password === req.body.password_confirmation)) {
      return "PASSWORD_MISMATCH";
    }

    // remove password_confirmation field
    delete req.body.password_confirmation;
    req.body.email = req.body.email.toLowerCase().trim();
    balance = {
      profit: 0.0,
      bonus: 10.0,
      ref_bonus: 0.0,
      active: 0.0,
      total: 10.0,
    };
    // Check if user already exists
    const foundUser = await User.findOne({ email: req.body.email });
    if (foundUser) {
      return "USER_EXISTS";
    }

    // Create new user
    const newUser = new User({ ...req.body, balance: { ...balance } });
    const savedUser = await newUser.save();

    return savedUser;
  },
  updateUser: async (req, res, what = "WITHDRAWAL_INFO") => {
    let userId = req.user._id;
    if (what == "PROFILE") {
      userId = req.body.user_id;
    }
    let data = null;

    const user = await User.findById(userId);

    switch (what) {
      case "WITHDRAWAL_INFO":
        data = {
          bank: {
            bank_name: req.body.bank_name,
            account_name: req.body.actname,
            account_number: req.body.actnum,
            routing_number: req.body.routnum,
          },
          crypto: {
            btc_address: req.body.btc_address,
          },
          cash_app: {
            cash_app_tag: req.body.cash_app_tag,
          },
        };
        user.withdrawal_info = { ...data };
        break;
      case "PASSWORD":
        if (req.body.password !== req.body.password_confirmation) {
          return res.status(401).json("Password doesn't match");
        }
        if (user.password !== req.body.old_password) {
          return res.status(401).json("Incorrect password");
        }
        user.password = req.body.password;
        break;
      case "PROFILE":
        user.fname = req.body.firstname;
        user.lname = req.body.surname;
        user.phone = req.body.phone;
        user.address = req.body.address;
        break;
    }

    await user.save();
    // res.status(200).json("done");
  },
  loginUser: async (req, res) => {
    const user = await User.findOne({ email: req.body.email });
    if (!user || !(req.body.password === user.password))
      return res.status(401).json({ error: "Incorrect email or password" });

    req.session.userId = user._id;
    res.status(200).json("login");
  },
};

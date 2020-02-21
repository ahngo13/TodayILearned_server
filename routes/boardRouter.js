const express = require("express");
const router = express.Router();
const Board = require("../schemas/board");

//회원가입
router.post("/join", (req, res) => {
  res.json({ message: true });
});

//로그인
router.post("/login", (req, res) => {
  res.json({ message: true });
});

router.post("/delete", async (req, res) => {
  try {
    const result = await User.remove({
      _id: req.body._id
    });
    res.json({ message: true });
  } catch (err) {
    console.log(err);
    res.json({ message: false });
  }
});

router.post("/update", async (req, res) => {
  try {
    const result = await User.update({
      _id: req.body._id,
      name: req.body.name,
      age: req.body.age,
      married: req.body.married
    });
    res.json({ message: true });
  } catch (err) {
    console.log(err);
    res.json({ message: false });
  }
});

router.post("/add", async (req, res) => {
  try {
    const user = new User(req.body);
    const result = await user.save();
    res.json({ message: true });
  } catch (err) {
    console.log(err);
    res.json({ message: false });
  }
});

router.post("/getAllMember", async (req, res) => {
  try {
    const user = await User.find({});
    res.json({ message: user });
  } catch (err) {
    console.log(err);
    res.json({ message: false });
  }
});

module.exports = router;

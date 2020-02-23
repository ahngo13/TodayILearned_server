const express = require("express");
const router = express.Router();
const Board = require("../schemas/board");

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

router.post("/write", async (req, res) => {
  try {
    const obj = {
      writer: req.body._id,
      title: req.body.title,
      content: req.body.content
    };
    console.log(obj);
    const board = new Board(obj);
    await board.save();
    res.json({ message: "게시글이 업로드 되었습니다." });
  } catch (err) {
    console.log(err);
    res.json({ message: false });
  }
});

router.post("/getBoardList", async (req, res) => {
  try {
    const _id = req.body._id;
    const board = await Board.find({writer:_id});
    res.json({ list: board });
  } catch (err) {
    console.log(err);
    res.json({ message: false });
  }
});

module.exports = router;

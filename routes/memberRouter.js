const express = require("express");
const router = express.Router();
const User = require("../schemas/user");

//회원가입
router.post("/join", async (req, res) => {
  try {
    let obj = { email: req.body.email };

    let user = await User.findOne(obj);
    console.log(user);

    if (user) {
      res.json({
        message: "이메일이 중복되었습니다. 새로운 이메일을 입력해주세요.",
        dupYn: "1"
      });
    } else {
      obj = {
        email: req.body.email,
        name: req.body.name,
        password: req.body.password
      };

      user = new User(obj);
      await user.save();
      res.json({ message: "회원가입 되었습니다!", dupYn: "0" });
    }
  } catch (err) {
    console.log(err);
    res.json({ message: false });
  }
});

//로그인
router.post("/login", async (req, res) => {
  try {
    
    //이메일 값으로 아이디가 존재하는지 확인
    await User.findOne({email:req.body.email}, async(err, user)=>{
        if(err){
          console.log(err);
        }else{
          console.log(user);
          if(user){
          //아이디가 존재할 경우 이메일과 패스워드가 일치하는 회원이 있는지 확인
          const obj = {
            email: req.body.email,
            password: req.body.password
          };

          const user2 = await User.findOne(obj);
          console.log(user2);
          if (user2) { // 있으면 로그인 처리
            console.log(req.body._id);
            await User.updateOne({
              email: req.body.email},
              {$set: {loginCnt:0}
            });
            res.json({ message: "로그인 되었습니다!", _id: user2._id });
          } else { //없으면 로그인 실패횟수 추가
            if(user.loginCnt > 4){
              res.json({ message: "아이디나 패스워드가 5회 이상 일치하지 않아 잠겼습니다.\n고객센터에 문의 바랍니다." });
            }else{
              await User.updateOne({
                email: req.body.email},
                {$set: {loginCnt:user.loginCnt+1}
              });
              if(user.loginCnt >= 5){
                await User.updateOne({
                  email: req.body.email},
                  {$set: {lockYn :true}
                });
                res.json({ message: "아이디나 패스워드가 5회 이상 일치하지 않아 잠겼습니다.\n고객센터에 문의 바랍니다." });
              }else{
                res.json({ message: "아이디나 패스워드가 일치하지 않습니다." });
              }
            }
          }
        }else{
          res.json({ message: "아이디나 패스워드가 일치하지 않습니다." });
        }
      }
    });
    
  } catch (err) {
    console.log(err);
    res.json({ message: "로그인 실패" });
  }
});

router.get("/logout", (req, res) => {
  console.log("/logout" + req.sessionID);
  req.session.destroy(() => {
    res.json({ message: true });
  });
});

router.post("/delete", async (req, res) => {
  try {
    await User.remove({
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
    await User.update({
      _id: req.body._id,
      name: req.body.name,
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
    await user.save();
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

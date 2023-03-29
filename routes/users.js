var express = require('express');
const { connectDb, closeConnection } = require('../config');
var router = express.Router();
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

/* GET users listing. */

router.post('/login', async (req, res) => {
  const { UserName, Password } = req.body
  try {
    const db = await connectDb()
    const user = await db.collection('login').findOne({ UserName })

    if (user) {
      const hash = await bcrypt.compare(Password, user.Password)
      if (hash) {
        const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, { expiresIn: "3h" })
        await closeConnection();
        return res.send(token)
      }
      else {
        await closeConnection();
        return res.status(400).json('User/Password Incorrect')
      }
    }
    else {
      await closeConnection();

      return res.status(400).json('User Not Found')
    }
  } catch (error) {
    console.log(error)
    return res.status(400).json(error)
  }
})

router.post('/reg', async (req, res) => {
  try {
    let { UserName, Password } = req.body
    const salt = await bcrypt.genSalt(10)
    const hash = await bcrypt.hash(Password, salt);
    Password = hash
    const db = await connectDb()
    const user = await db.collection('login').insertOne({ UserName, Password })
    await closeConnection()
    res.send(user)
  } catch (error) {
    console.log(error)
    return res.status(400).json(error)
  }
})

module.exports = router;

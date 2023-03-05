var express = require('express');
const { connectDb, closeConnection } = require('../config');
var router = express.Router();

/* GET users listing. */

router.post('/login', async (req, res) => {
  const { UserName, Password } = req.body
  try {
    const db = await connectDb()
    const user = await db.collection('login').findOne({ UserName })

    if (user) {
      console.log(user.Password, Password)
      if (Password == user.Password) {
        await closeConnection();
        return res.send(user)
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
    const { UserName, Password } = req.body
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

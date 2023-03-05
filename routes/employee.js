var express = require('express');
const { connectDb, closeConnection } = require('../config');
var router = express.Router();
var mongodb = require('mongodb');

// Create Employee
router.post('/create', async function (req, res, next) {

    try {
        const db = await connectDb();
        console.log(db)
        await db.collection("users").insertOne({ available: true, ...req.body });
        await closeConnection();

        res.json({ message: "Employee Created Successfuly" })
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: "Something Went Wrong in Creating Employee" })
    }
});

// Read employeee details
router.get("/read", async function (req, res, next) {

    try {
        const db = await connectDb();
        const details = await db.collection("users").find({}).toArray();
        await closeConnection();

        res.json(details)

    } catch (error) {
        console.log(error)
        res.status(500).json({ message: "Something Went Wrong in Reading Employee" })
    }
})

// Update selected Employee
router.put("/update/:id", async function (req, res, next) {

    try {
        const db = await connectDb();
        delete req.body._id;
        const user = await db.collection("users").updateOne({ _id: mongodb.ObjectId(req.params.id) }, { $set: req.body })
        await closeConnection();

        res.json({ message: "Employee Updated Successfully" })

    } catch (error) {
        console.log(error)
        res.status(500).json({ message: "Something Went Wrong in Reading Employee" })
    }
})

// Assigning and Unassigning work
router.put("/assign/:id", async function (req, res, next) {

    try {
        const db = await connectDb();
        var { available, task } = req.body;


        if (available) {
            await db.collection("users").updateOne({ _id: mongodb.ObjectId(req.params.id) }, { $set: { available }, $unset: { task: 1 } })
            await closeConnection();
            res.json({ message: "Work Unassigned" })
        } else {
            await db.collection("users").updateOne({ _id: mongodb.ObjectId(req.params.id) }, { $set: { available, task } })
            await closeConnection();
            res.json({ message: "Work Assigned" })
        }


    } catch (error) {
        console.log(error)
        res.status(500).json({ message: "Something Went Wrong in Reading Employee" })
    }
})

// Delete the selected Employee
router.delete("/delete/:id", async function (req, res, next) {

    try {
        const db = await connectDb();
        await db.collection("users").deleteOne({ _id: mongodb.ObjectId(req.params.id) })
        await closeConnection();

        res.json({ message: "Employee Deleted Successfully" })

    } catch (error) {
        console.log(error)
        res.status(500).json({ message: "Something Went Wrong in Reading Employee" })
    }
})

module.exports = router;
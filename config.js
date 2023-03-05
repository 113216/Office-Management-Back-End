var mongodb = require('mongodb')
var mongoClient = mongodb.MongoClient;
let db;
let connection;

async function connectDb(req, res, next) {
    connection = await mongoClient.connect(process.env.DB);
    db = await connection.db("Employee");
    return db
    //     try {
    //         connection = await mongoClient.connect(process.env.DB);
    //         db = await connection.db("Employee");
    //         return db
    //     } catch (error) {
    //         console.log(error)
    //         res.status(500).json({message : "Something Went Wrong in Connecting DB"})
    //     }
}

async function closeConnection(req, res, next) {

    try {
        if (connection) {
            await connection.close()
        } else {
            console.log("No Connection")
        }
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: "Something Went Wrong in Close Connection" })
    }
}

module.exports = { connectDb, closeConnection, db, connection }
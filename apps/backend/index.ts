import express from "express"

const app = express()

app.get("/", (req, res) => {
    res.send("hi there!")
})

app.listen(4000, () => {
    console.log("Backend is running on port 4000")
})
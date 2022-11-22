const express = require("express")
const User = require("./models/User") // new
const router = express.Router()

// Get all users
// Maybe we want to sort, and find the top 5?
router.get("/users", async (req, res) => {
	const users = await User.find()
	res.send(users)
})

// Create a user
router.post("/users", async (req, res) => {
  const user = new User({
    name: req.body.name,
		country: req.body.country,
    flavor: req.body.flavor
	})
	await user.save()
	res.send(user)
})

module.exports = router
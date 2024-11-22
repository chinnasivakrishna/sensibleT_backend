const authMiddleware = require("../middleware/authMiddleware");

router.get("/transactions", authMiddleware, async (req, res) => {
  try {
    const transactions = await Transaction.find({ user: req.user });
    res.json({ transactions });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

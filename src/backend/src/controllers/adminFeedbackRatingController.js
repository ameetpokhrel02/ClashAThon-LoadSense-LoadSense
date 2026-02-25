import AdminFeedbackRating from "../models/AdminFeedbackRating.js";

export const createFeedbackRating = async (req, res) => {
  try {
    const user_id = req.user?.id;
    if (!user_id) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const { rating, feedback, context } = req.body;
    const numericRating = Number(rating);
    if (!Number.isFinite(numericRating) || numericRating < 1 || numericRating > 5) {
      return res.status(400).json({ message: "rating must be a number from 1 to 5" });
    }

    const doc = await AdminFeedbackRating.create({
      user_id,
      rating: numericRating,
      feedback: feedback ?? "",
      context: context ?? "",
    });

    return res.status(201).json(doc);
  } catch (err) {
    return res.status(500).json({ message: "Server error", error: err.message });
  }
};

export const getFeedbackRatings = async (req, res) => {
  try {
    const user_id = req.user?.id;
    if (!user_id) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const adminEmail = process.env.ADMIN_EMAIL;
    const isAdmin = Boolean(adminEmail && req.user?.email === adminEmail);

    const query = isAdmin ? {} : { user_id };

    const ratings = await AdminFeedbackRating.find(query)
      .sort({ createdAt: -1 })
      .limit(200);

    return res.json({ ratings, scope: isAdmin ? "all" : "mine" });
  } catch (err) {
    return res.status(500).json({ message: "Server error", error: err.message });
  }
};

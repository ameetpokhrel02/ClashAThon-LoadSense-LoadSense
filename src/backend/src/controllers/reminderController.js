import Deadline from "../models/Deadline.js";

// Get reminders for upcoming deadlines (due within 7 days)
export const getReminders = async (req, res) => {
    try {
        const user_id = req.user?.id;
        if (!user_id) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        const today = new Date();
        const nextWeek = new Date();
        nextWeek.setDate(today.getDate() + 7);

        const matchQuery = {
            user_id: user_id,
            dueDate: { $gte: today, $lte: nextWeek },
            is_completed: false, // Optional: only show incomplete deadlines
        };

        const reminders = await Deadline.find(matchQuery).sort({ dueDate: 1 });

        return res.status(200).json({
            success: true,
            count: reminders.length,
            data: reminders,
        });
    } catch (error) {
        console.error("Error fetching reminders:", error);
        return res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};

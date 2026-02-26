📄 MongoDB Schema – LoadSense
# 📊 Database Schema – LoadSense

LoadSense uses MongoDB with Mongoose ODM.
---

## 👤 User Collection

```js
{
  _id: ObjectId,
  name: String,
  email: String,
  password: String,
  academicYear: String,
  program: String,
  createdAt: Date
}
📚 Module (Course) Collection
{
  _id: ObjectId,
  user_id: ObjectId,
  name: String,
  creditHours: Number,
  createdAt: Date
}
📅 Deadline Collection
{
  _id: ObjectId,
  user_id: ObjectId,
  module_id: ObjectId,
  title: String,
  type: String,   // assignment, quiz, viva, etc.
  dueDate: Date,
  weight: Number,
  impactLevel: String,
  isCompleted: Boolean,
  createdAt: Date
}
📊 Workload Collection
{
  _id: ObjectId,
  user_id: ObjectId,
  week_start: Date,
  week_end: Date,
  load_score: Number,
  risk_level: String, // low, moderate, high, critical
  deadline_count: Number
}
🔔 Reminder Collection
{
  _id: ObjectId,
  user_id: ObjectId,
  deadline_id: ObjectId,
  reminder_date: Date
}
🧠 AI Suggestion Collection (Future)
{
  _id: ObjectId,
  user_id: ObjectId,
  generated_plan: String,
  createdAt: Date
}
🔗 Relationships

User → Modules
User → Deadlines
Module → Deadlines
User → Workloads
Deadline → Reminders
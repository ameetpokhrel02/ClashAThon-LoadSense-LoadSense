import Course from "../models/Course.js";

export const createCourse = async (req, res) => {
  const course = await Course.create(req.body);
  res.json(course);
};

export const getCourses = async (req, res) => {
  const courses = await Course.find();
  res.json(courses);
};
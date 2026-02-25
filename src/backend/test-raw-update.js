import axios from 'axios';
import fs from 'fs';
import FormData from 'form-data';
import jwt from 'jsonwebtoken';

async function test() {
  try {
    // 1. Create a dummy token for the test user ID
    // Find a valid user ID from the database first, or we can just try grabbing one from DB
    const mongoose = (await import('mongoose')).default;
    await mongoose.connect('mongodb://localhost:27017/loadsense_db'); // Assuming default
    const User = (await import('./src/models/User.js')).default;
    const user = await User.findOne({ email: 'amyths04@gmail.com' });
    
    if (!user) {
      console.log("No user found by that email. Exiting.");
      process.exit(1);
    }
    
    const token = jwt.sign({ _id: user._id }, 'loadsense_super_secret_jwt_key_2026', { expiresIn: '1h' });
    console.log("Generated token for:", user._id);
    
    // 2. Try to update profile
    const form = new FormData();
    form.append('firstName', 'Amit Update');
    form.append('lastName', 'Leader');
    
    const updateRes = await axios.patch('http://localhost:5000/api/users/profile', form, {
      headers: {
        ...form.getHeaders(),
        Authorization: `Bearer ${token}`
      }
    });
    
    console.log("Success:", updateRes.data);
    process.exit(0);
  } catch (err) {
    if (err.response) {
      console.error("Error Response HTTP", err.response.status);
      console.error("Error Response Data:", err.response.data);
    } else {
      console.error("Error:", err.message);
    }
    process.exit(1);
  }
}
test();

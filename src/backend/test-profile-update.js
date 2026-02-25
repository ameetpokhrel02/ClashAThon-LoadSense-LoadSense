import axios from 'axios';
import fs from 'fs';
import FormData from 'form-data';

async function test() {
  try {
    // 1. Login to get token
    const loginRes = await axios.post('http://localhost:5000/api/auth/login', {
      email: 'amyths04@gmail.com',
      password: 'password123'
    });
    
    const token = loginRes.data.token;
    console.log("Got token length:", token.length);

    // 2. Try to update profile
    const form = new FormData();
    form.append('firstName', 'Amit Update');
    form.append('lastName', 'Leader');
    
    console.log("Sending PATCH request to /api/users/profile");
    
    const updateRes = await axios.patch('http://localhost:5000/api/users/profile', form, {
      headers: {
        ...form.getHeaders(),
        Authorization: `Bearer ${token}`
      }
    });
    
    console.log("Success:", updateRes.data);
  } catch (err) {
    if (err.response) {
      console.error("Error Response HTTP", err.response.status);
      console.error("Error Response Data:", err.response.data);
    } else {
      console.error("Error:", err.message);
    }
  }
}
test();

const API_URL = 'http://localhost:5000/api';
let token = '';

async function testProfile() {
  try {
    console.log('--- Registering User ---');
    const regRes = await fetch(`${API_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        firstName: 'Test',
        lastName: 'User',
        email: `test${Date.now()}@example.com`,
        password: 'password123'
      })
    });
    const regData = await regRes.json();
    if (!regRes.ok) throw new Error(regData.message || 'Registration failed');
    
    token = regData.token;
    console.log('Registered successfully');

    console.log('\n--- Getting Profile ---');
    const profileRes = await fetch(`${API_URL}/users/profile`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    const profileData = await profileRes.json();
    console.log('Profile:', profileData.user);

    console.log('\n--- Updating Profile (Fields Only) ---');
    const updateRes = await fetch(`${API_URL}/users/profile`, {
      method: 'PUT',
      headers: { 
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        phone: '9876543210',
        address: 'Kathmandu',
        ward: '10'
      })
    });
    const updateData = await updateRes.json();
    console.log('Update Response:', updateData.user);

    console.log('\n--- Testing Image Upload ---');
    console.log('Note: Image upload requires a multipart form with a real file.');
    console.log('You can test this via Postman or the cURL command provided in the walkthrough.');

  } catch (error) {
    console.error('Test failed:', error.message);
  }
}

testProfile();

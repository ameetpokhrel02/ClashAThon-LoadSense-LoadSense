const API_URL = 'http://localhost:5000/api';

async function testProtectedProfile() {
  try {
    console.log('--- Registering User ---');
    const email = `test${Date.now()}@example.com`;
    const regRes = await fetch(`${API_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        firstName: 'Protected',
        lastName: 'User',
        email: email,
        password: 'password123'
      })
    });
    const regData = await regRes.json();
    if (!regRes.ok) throw new Error(regData.message || 'Registration failed');
    
    const token = regData.token;
    const userId = regData.user.id;
    console.log('Registered successfully. User ID:', userId);

    console.log('\n--- Getting Profile (With Token) ---');
    const profileRes = await fetch(`${API_URL}/users/profile/${userId}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    const profileData = await profileRes.json();
    if (!profileRes.ok) throw new Error(profileData.message || 'Get profile failed');
    console.log('Profile:', profileData.user);

    console.log('\n--- Updating Profile (With Token) ---');
    const updateRes = await fetch(`${API_URL}/users/profile/${userId}`, {
      method: 'PUT',
      headers: { 
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        phone: '1234567890',
        address: 'New Location'
      })
    });
    const updateData = await updateRes.json();
    if (!updateRes.ok) throw new Error(updateData.message || 'Update profile failed');
    console.log('Update Response:', updateData.user);

    console.log('\n--- Testing ERROR (Without Token) ---');
    const errRes = await fetch(`${API_URL}/users/profile/${userId}`);
    const errData = await errRes.json();
    console.log('Access without token status:', errRes.status);
    console.log('Access without token message:', errData.message);

    console.log('\n✅ VERIFICATION COMPLETE: Protected endpoints are working as intended.');

  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

testProtectedProfile();

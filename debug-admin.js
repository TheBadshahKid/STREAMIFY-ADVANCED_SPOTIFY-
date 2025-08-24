const axios = require('axios');

const testAdminEndpoints = async () => {
    const baseURL = 'http://localhost:5000/api';
    
    console.log('🔍 Testing admin endpoints...\n');
    
    try {
        // Test 1: Check if server is running
        console.log('1. Testing server connection...');
        const healthCheck = await axios.get(`${baseURL}/songs/featured`);
        console.log('✅ Server is running and responding\n');
        
        // Test 2: Test admin check without auth (should fail)
        console.log('2. Testing admin endpoint without auth (should fail)...');
        try {
            await axios.get(`${baseURL}/admin/check`);
            console.log('❌ Unexpected success - auth might be disabled');
        } catch (error) {
            if (error.response?.status === 401) {
                console.log('✅ Correctly blocked - authentication required');
            } else {
                console.log(`⚠️  Unexpected error: ${error.response?.status} - ${error.response?.data?.message}`);
            }
        }
        console.log('');
        
        // Test 3: Test song creation endpoint without auth (should fail)
        console.log('3. Testing song creation without auth (should fail)...');
        try {
            await axios.post(`${baseURL}/admin/songs`, {
                title: 'Test Song',
                artist: 'Test Artist',
                duration: 180
            });
            console.log('❌ Unexpected success - auth might be disabled');
        } catch (error) {
            if (error.response?.status === 401) {
                console.log('✅ Correctly blocked - authentication required');
            } else {
                console.log(`⚠️  Unexpected error: ${error.response?.status} - ${error.response?.data?.message}`);
            }
        }
        console.log('');
        
        console.log('🎉 Basic server tests completed');
        console.log('📋 Next steps:');
        console.log('   1. Make sure you are logged in as admin in the frontend');
        console.log('   2. Check browser console for authentication errors');
        console.log('   3. Check browser Network tab for the exact error response');
        console.log('   4. Make sure your email matches ADMIN_EMAIL in .env');
        
    } catch (error) {
        console.error('❌ Server connection failed:', error.message);
        console.log('🔧 Possible issues:');
        console.log('   - Backend server is not running on port 5000');
        console.log('   - CORS issues');
        console.log('   - Database connection problems');
    }
};

testAdminEndpoints();

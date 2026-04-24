// Quick API test script
const http = require('http');

const BASE = 'http://localhost:5000';

function request(method, path, body, token) {
  return new Promise((resolve, reject) => {
    const url = new URL(path, BASE);
    const data = body ? JSON.stringify(body) : null;
    const opts = {
      hostname: url.hostname,
      port: url.port,
      path: url.pathname,
      method,
      headers: { 'Content-Type': 'application/json' }
    };
    if (token) opts.headers['Authorization'] = 'Bearer ' + token;

    const req = http.request(opts, (res) => {
      let chunks = '';
      res.on('data', (c) => chunks += c);
      res.on('end', () => {
        try { resolve(JSON.parse(chunks)); }
        catch { resolve(chunks); }
      });
    });
    req.on('error', reject);
    if (data) req.write(data);
    req.end();
  });
}

async function runTests() {
  console.log('========================================');
  console.log('  SMART STUDY API - Test Suite');
  console.log('========================================\n');

  // 1. Health Check
  console.log('1. Health Check...');
  const health = await request('GET', '/');
  console.log('   ✅', health.message, '\n');

  // 2. Signup
  console.log('2. Signup Test...');
  const signup = await request('POST', '/api/auth/signup', {
    name: 'Alex Jordan',
    email: 'alex@smartstudy.io',
    password: 'Test12345',
    subjects: ['Mathematics', 'Algorithms', 'Machine Learning'],
    availability: ['Evening'],
    university: 'MIT',
    major: 'Computer Science',
    level: 'Undergraduate (Year 3)'
  });
  console.log('   ', signup.success ? '✅' : '❌', signup.message);
  const token = signup.token;
  console.log('   Token:', token ? token.substring(0, 30) + '...' : 'N/A', '\n');

  // 3. Login
  console.log('3. Login Test...');
  const login = await request('POST', '/api/auth/login', {
    email: 'alex@smartstudy.io',
    password: 'Test12345'
  });
  console.log('   ', login.success ? '✅' : '❌', login.message, '\n');

  const authToken = login.token || token;

  // 4. Get Profile
  console.log('4. Get Profile...');
  const profile = await request('GET', '/api/users/profile', null, authToken);
  console.log('   ', profile.success ? '✅' : '❌', 'User:', profile.user?.name, '\n');

  // 5. Update Profile
  console.log('5. Update Profile...');
  const update = await request('PUT', '/api/users/profile', {
    bio: 'Passionate about AI and machine learning!',
    subjects: ['Mathematics', 'Algorithms', 'Machine Learning', 'Physics']
  }, authToken);
  console.log('   ', update.success ? '✅' : '❌', update.message, '\n');

  // 6. Create Study Group
  console.log('6. Create Study Group...');
  const group = await request('POST', '/api/groups/create', {
    name: 'Advanced Algorithms',
    subject: 'Computer Science',
    description: 'Deep dive into advanced algorithms and data structures',
    maxMembers: 10,
    schedule: 'Mon & Wed 6pm',
    level: 'Advanced',
    tags: ['DSA', 'LeetCode', 'Competitive'],
    avatar: '⚙️'
  }, authToken);
  console.log('   ', group.success ? '✅' : '❌', group.message);
  const groupId = group.group?._id;
  console.log('   Group ID:', groupId, '\n');

  // 7. Get All Groups
  console.log('7. Get All Groups...');
  const groups = await request('GET', '/api/groups', null, authToken);
  console.log('   ', groups.success ? '✅' : '❌', 'Found', groups.count, 'groups\n');

  // 8. Create Task
  console.log('8. Create Task...');
  const task = await request('POST', '/api/tasks', {
    title: 'Complete Chapter 7 exercises',
    description: 'Finish all practice problems from chapter 7',
    subject: 'Mathematics',
    priority: 'high',
    deadline: '2026-04-01'
  }, authToken);
  console.log('   ', task.success ? '✅' : '❌', task.message);
  const taskId = task.task?._id;
  console.log('   Task ID:', taskId, '\n');

  // 9. Get Tasks
  console.log('9. Get Tasks...');
  const tasks = await request('GET', '/api/tasks', null, authToken);
  console.log('   ', tasks.success ? '✅' : '❌', 'Found', tasks.count, 'tasks');
  console.log('   Stats:', JSON.stringify(tasks.stats), '\n');

  // 10. Update Task
  console.log('10. Update Task Status...');
  const updatedTask = await request('PUT', '/api/tasks/' + taskId, {
    status: 'completed'
  }, authToken);
  console.log('   ', updatedTask.success ? '✅' : '❌', updatedTask.message, '\n');

  // 11. Matchmaking
  console.log('11. AI Matchmaking...');
  const matches = await request('GET', '/api/matchmaking', null, authToken);
  console.log('   ', matches.success ? '✅' : '❌', matches.message);
  console.log('   Users scanned:', matches.data?.totalUsersScanned);
  console.log('   Groups scanned:', matches.data?.totalGroupsScanned, '\n');

  // Summary
  console.log('========================================');
  console.log('  ✅ All API Endpoints Tested!');
  console.log('========================================');
}

runTests().catch(console.error);

const axios = require('axios');

const BASE_URL = 'http://localhost:8080/api';

const users = [
  { email: 'harsha@example.com', password: '123456' },
  { email: 'john@example.com', password: 'securepass123' },
  { email: 'alice@example.com', password: 'password456' },
];

const notes = [
  { title: 'My First Todo', content: 'Complete project documentation by Friday' },
  { title: 'Shopping List', content: 'Milk, Eggs, Bread, Cheese, Tomatoes, Spinach, Chicken' },
  { title: 'Team Meeting - May 16', content: 'Discussion points:\n1. Project status update\n2. Q2 roadmap review\n3. Resource allocation\n4. Next sprint planning' },
  { title: 'Express Middleware Pattern', content: 'const auth = (req, res, next) => {\n  const token = req.header("Authorization");\n  if (!token) return res.status(401).json({ error: "No token" });\n  try {\n    const payload = jwt.verify(token, SECRET);\n    req.user = payload;\n    next();\n  } catch (err) {\n    res.status(401).json({ error: "Invalid token" });\n  }\n};' },
  { title: 'Product Ideas', content: '- Mobile app for note taking\n- Dark mode support\n- Markdown formatting\n- Cloud sync\n- Collaboration features\n- Export to PDF' },
];

async function seedDatabase() {
  console.log('🌱 Starting database seeding...\n');

  try {
    for (let i = 0; i < users.length; i++) {
      const user = users[i];
      console.log(`📝 Registering user: ${user.email}`);

      // Register user
      const regRes = await axios.post(`${BASE_URL}/auth/register`, user);
      const token = regRes.data.token;
      console.log(`✅ Registered! Token: ${token.substring(0, 20)}...\n`);

      // Create notes for this user
      for (let j = 0; j < notes.length; j++) {
        const note = notes[j];
        console.log(`  📌 Creating note: "${note.title}"`);

        await axios.post(`${BASE_URL}/api/notes`, note, {
          headers: { Authorization: `Bearer ${token}` },
        });
        console.log(`  ✅ Note created!\n`);
      }
    }

    console.log('🎉 Database seeding completed successfully!');
  } catch (error) {
    if (error.response?.status === 400 && error.response?.data?.message?.includes('already')) {
      console.log('⚠️  Some users already exist. Skipping duplicates.');
    } else {
      console.error('❌ Error during seeding:', error.response?.data || error.message);
      process.exit(1);
    }
  }
}

seedDatabase();

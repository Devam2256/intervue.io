// Import required packages
const mongoose = require('mongoose');
const Company = require('../models/Company');
const Job = require('../models/Job');
const Candidate = require('../models/Candidate');
const User = require('../models/User');

// MongoDB connection string (use environment variable or default to local MongoDB)
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/intervue';

// Main setup function
async function setupDatabase() {
  try {
    console.log('🔌 Connecting to MongoDB...');
    
    // Connect to MongoDB database
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB successfully!');

    // Check if we already have companies in the database
    const existingCompany = await Company.findOne();
    
    if (!existingCompany) {
      console.log('📝 Creating sample company...');
      
      // Create a sample company for testing
      const sampleCompany = new Company({
        name: 'Sample Tech Company',
        description: 'A leading technology company focused on innovation',
        website: 'https://example.com',
        location: 'San Francisco, CA'
      });
      
      // Save the company to database
      await sampleCompany.save();
      console.log('✅ Created sample company with ID:', sampleCompany._id);
    } else {
      console.log('ℹ️  Company already exists with ID:', existingCompany._id);
    }

    // Show all companies in database
    console.log('\n📋 All companies in database:');
    const companies = await Company.find();
    companies.forEach(company => {
      console.log(`   - ${company.name} (ID: ${company._id})`);
    });

    // Show all jobs in database
    console.log('\n💼 All jobs in database:');
    const jobs = await Job.find().populate('company_id');
    if (jobs.length === 0) {
      console.log('   - No jobs found (this is normal for a fresh setup)');
      
      // Create a sample job if no jobs exist
      if (existingCompany) {
        console.log('📝 Creating sample job...');
        const sampleJob = new Job({
          company_id: existingCompany._id,
          title: 'Sample Software Engineer',
          description: 'We are looking for a talented software engineer to join our team.',
          category: 'Tech',
          type: 'Full-time',
          location: 'San Francisco, CA',
          salary: '$80,000 - $120,000',
          priority: 'Medium',
          requirements: ['3+ years of experience', 'Knowledge of React', 'Good communication skills'],
          skills: ['React', 'JavaScript', 'Node.js'],
          benefits: ['Health insurance', 'Remote work', '401k matching']
        });
        await sampleJob.save();
        console.log('✅ Created sample job:', sampleJob.title);
      }
    } else {
      jobs.forEach(job => {
        console.log(`   - ${job.title} at ${job.company_id?.name || 'Unknown Company'}`);
      });
    }

    // Show all candidates in database
    console.log('\n👥 All candidates in database:');
    const candidates = await Candidate.find().populate('job_id').populate('company_id');
    if (candidates.length === 0) {
      console.log('   - No candidates found (this is normal for a fresh setup)');
      
      // Create a sample candidate if we have a job
      const existingJob = await Job.findOne();
      if (existingJob && existingCompany) {
        console.log('📝 Creating sample candidate...');
        const sampleCandidate = new Candidate({
          job_id: existingJob._id,
          company_id: existingCompany._id,
          name: 'John Doe',
          email: 'john.doe@example.com',
          phone: '+1 (555) 123-4567',
          status: 'Applied',
          experience: '5 years',
          location: 'San Francisco, CA',
          coverLetter: 'I am excited to apply for this position...',
          skills: ['React', 'JavaScript', 'Node.js'],
          source: 'Website'
        });
        await sampleCandidate.save();
        console.log('✅ Created sample candidate:', sampleCandidate.name);
      }
    } else {
      candidates.forEach(candidate => {
        console.log(`   - ${candidate.name} applied for ${candidate.job_id?.title || 'Unknown Job'}`);
      });
    }

    // Show all users in database
    console.log('\n👤 All users in database:');
    const users = await User.find();
    if (users.length === 0) {
      console.log('   - No users found (this is normal for a fresh setup)');
      
      // Create a sample user
      console.log('📝 Creating sample user...');
      const sampleUser = new User({
        firstName: 'Jane',
        lastName: 'Smith',
        email: 'jane.smith@example.com',
        phone: '+1 (555) 987-6543',
        location: 'New York, NY',
        headline: 'Senior Frontend Developer',
        bio: 'Passionate developer with 5+ years of experience in React and modern web technologies.',
        experience: '5 years',
        employmentStatus: 'Looking for opportunities',
        skills: ['React', 'TypeScript', 'Node.js', 'CSS', 'JavaScript'],
        preferredCategories: ['Tech'],
        preferredJobTypes: ['Full-time', 'Remote'],
        preferredLocations: ['New York, NY', 'Remote'],
        education: [{
          degree: 'Bachelor of Science in Computer Science',
          institution: 'University of Technology',
          year: 2019,
          description: 'Focused on web development and software engineering'
        }],
        workExperience: [{
          title: 'Frontend Developer',
          company: 'Tech Solutions Inc',
          location: 'New York, NY',
          startDate: new Date('2020-01-01'),
          endDate: new Date('2023-12-31'),
          current: false,
          description: 'Developed responsive web applications using React and TypeScript'
        }],
        portfolio: 'https://janesmith.dev',
        socialMedia: {
          linkedin: 'https://linkedin.com/in/janesmith',
          github: 'https://github.com/janesmith'
        }
      });
      await sampleUser.save();
      console.log('✅ Created sample user:', sampleUser.fullName);
    } else {
      users.forEach(user => {
        console.log(`   - ${user.fullName} (${user.headline || 'No headline'})`);
      });
    }

    // Disconnect from database
    await mongoose.disconnect();
    console.log('\n✅ Database setup completed successfully!');
    console.log('🚀 You can now start your backend server with: npm run dev');
    
  } catch (error) {
    console.error('❌ Setup failed:', error.message);
    console.log('\n💡 Make sure MongoDB is running on your system');
    console.log('   If using MongoDB Atlas, check your connection string');
    process.exit(1);
  }
}

// Run the setup function
setupDatabase();
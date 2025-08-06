const nodemailer = require('nodemailer');

// Create transporter
const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 465,
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

// Email templates
const emailTemplates = {
  otpVerification: (otp, userType) => ({
    subject: `InterVue.io - Email Verification`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f8f9fa;">
        <div style="background-color: #ffffff; padding: 30px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #2563eb; margin: 0; font-size: 28px; font-weight: bold;">InterVue.io</h1>
            <p style="color: #6b7280; margin: 10px 0 0 0; font-size: 16px;">Your ${userType === 'company' ? 'Company' : 'Job Seeker'} Account Verification</p>
          </div>
          
          <div style="background-color: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h2 style="color: #374151; margin: 0 0 15px 0; font-size: 20px;">Email Verification Required</h2>
            <p style="color: #6b7280; margin: 0 0 20px 0; line-height: 1.6;">
              Thank you for joining InterVue.io! To complete your registration, please use the verification code below:
            </p>
            
            <div style="background-color: #ffffff; border: 2px solid #2563eb; border-radius: 8px; padding: 20px; text-align: center; margin: 20px 0;">
              <h3 style="color: #2563eb; margin: 0; font-size: 32px; font-weight: bold; letter-spacing: 4px;">${otp}</h3>
              <p style="color: #6b7280; margin: 10px 0 0 0; font-size: 14px;">This code expires in 10 minutes</p>
            </div>
            
            <p style="color: #6b7280; margin: 20px 0 0 0; line-height: 1.6;">
              If you didn't create an account with InterVue.io, please ignore this email.
            </p>
          </div>
          
          <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb;">
            <p style="color: #9ca3af; margin: 0; font-size: 14px;">
              © 2024 InterVue.io. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    `
  }),
  
  welcomeEmail: (userType, name) => ({
    subject: `Welcome to InterVue.io!`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f8f9fa;">
        <div style="background-color: #ffffff; padding: 30px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #2563eb; margin: 0; font-size: 28px; font-weight: bold;">InterVue.io</h1>
            <p style="color: #6b7280; margin: 10px 0 0 0; font-size: 16px;">Connecting Talent with Opportunity</p>
          </div>
          
          <div style="background-color: #f0f9ff; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #2563eb;">
            <h2 style="color: #1e40af; margin: 0 0 15px 0; font-size: 20px;">Welcome to InterVue.io, ${name}! 🎉</h2>
            <p style="color: #374151; margin: 0 0 15px 0; line-height: 1.6;">
              Your email has been successfully verified and your ${userType === 'company' ? 'company' : 'job seeker'} account is now active.
            </p>
            
            <div style="background-color: #ffffff; padding: 15px; border-radius: 6px; margin: 15px 0;">
              <h3 style="color: #2563eb; margin: 0 0 10px 0; font-size: 16px;">What's Next?</h3>
              <ul style="color: #374151; margin: 0; padding-left: 20px; line-height: 1.6;">
                ${userType === 'company' ? 
                  '<li>Complete your company profile</li><li>Post your first job opening</li><li>Start receiving applications from qualified candidates</li>' :
                  '<li>Complete your professional profile</li><li>Browse available job opportunities</li><li>Apply to positions that match your skills</li>'
                }
              </ul>
            </div>
          </div>
          
          <div style="text-align: center; margin-top: 30px;">
            <a href="${process.env.FRONTEND_URL || 'http://localhost:5173'}" 
               style="background-color: #2563eb; color: #ffffff; padding: 12px 30px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block;">
              Get Started
            </a>
          </div>
          
          <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb;">
            <p style="color: #9ca3af; margin: 0; font-size: 14px;">
              © 2025 InterVue.io. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    `
  }),
  
  passwordReset: (resetToken) => ({
    subject: `InterVue.io - Password Reset Request`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f8f9fa;">
        <div style="background-color: #ffffff; padding: 30px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #2563eb; margin: 0; font-size: 28px; font-weight: bold;">InterVue.io</h1>
            <p style="color: #6b7280; margin: 10px 0 0 0; font-size: 16px;">Password Reset Request</p>
          </div>
          
          <div style="background-color: #fef2f2; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #dc2626;">
            <h2 style="color: #991b1b; margin: 0 0 15px 0; font-size: 20px;">Reset Your Password</h2>
            <p style="color: #374151; margin: 0 0 15px 0; line-height: 1.6;">
              We received a request to reset your password. Click the button below to create a new password:
            </p>
            
            <div style="text-align: center; margin: 20px 0;">
              <a href="${process.env.FRONTEND_URL || 'http://localhost:5173'}/reset-password?token=${resetToken}" 
                 style="background-color: #dc2626; color: #ffffff; padding: 12px 30px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block;">
                Reset Password
              </a>
            </div>
            
            <p style="color: #6b7280; margin: 20px 0 0 0; line-height: 1.6; font-size: 14px;">
              This link will expire in 1 hour. If you didn't request a password reset, please ignore this email.
            </p>
          </div>
          
          <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb;">
            <p style="color: #9ca3af; margin: 0; font-size: 14px;">
              © 2024 InterVue.io. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    `
  }),
  
  passwordResetOTP: (otp) => ({
    subject: `InterVue.io - Password Reset Verification Code`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f8f9fa;">
        <div style="background-color: #ffffff; padding: 30px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #2563eb; margin: 0; font-size: 28px; font-weight: bold;">InterVue.io</h1>
            <p style="color: #6b7280; margin: 10px 0 0 0; font-size: 16px;">Password Reset Verification</p>
          </div>
          
          <div style="background-color: #fef2f2; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #dc2626;">
            <h2 style="color: #991b1b; margin: 0 0 15px 0; font-size: 20px;">Reset Your Password</h2>
            <p style="color: #374151; margin: 0 0 15px 0; line-height: 1.6;">
              We received a request to reset your password. Use the verification code below to proceed:
            </p>
            
            <div style="background-color: #ffffff; border: 2px solid #dc2626; border-radius: 8px; padding: 20px; text-align: center; margin: 20px 0;">
              <h3 style="color: #dc2626; margin: 0; font-size: 32px; font-weight: bold; letter-spacing: 4px;">${otp}</h3>
              <p style="color: #6b7280; margin: 10px 0 0 0; font-size: 14px;">This code expires in 10 minutes</p>
            </div>
            
            <p style="color: #6b7280; margin: 20px 0 0 0; line-height: 1.6; font-size: 14px;">
              If you didn't request a password reset, please ignore this email or contact support if you have concerns.
            </p>
          </div>
          
          <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb;">
            <p style="color: #9ca3af; margin: 0; font-size: 14px;">
              © 2024 InterVue.io. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    `
  }),

  applicationRejection: (candidateName, jobTitle, companyName, applicationDetails) => ({
    subject: `InterVue.io - Application Update for ${jobTitle || 'the position'}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f8f9fa;">
        <div style="background-color: #ffffff; padding: 30px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #2563eb; margin: 0; font-size: 28px; font-weight: bold;">InterVue.io</h1>
            <p style="color: #6b7280; margin: 10px 0 0 0; font-size: 16px;">Application Status Update</p>
          </div>
          
          <div style="background-color: #fef2f2; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #dc2626;">
            <h2 style="color: #991b1b; margin: 0 0 15px 0; font-size: 20px;">Application Status Update</h2>
            <p style="color: #374151; margin: 0 0 15px 0; line-height: 1.6;">
              Dear ${candidateName || 'Candidate'},
            </p>
            <p style="color: #374151; margin: 0 0 15px 0; line-height: 1.6;">
              Thank you for your interest in the <strong>${jobTitle || 'the position'}</strong> position at <strong>${companyName || 'the company'}</strong>. 
              After careful consideration, we regret to inform you that we will not be moving forward with your application at this time.
            </p>
            
            <div style="background-color: #ffffff; padding: 15px; border-radius: 6px; margin: 15px 0;">
              <h3 style="color: #2563eb; margin: 0 0 10px 0; font-size: 16px;">Application Details:</h3>
              <ul style="color: #374151; margin: 0; padding-left: 20px; line-height: 1.6;">
                <li><strong>Position:</strong> ${jobTitle || 'Not specified'}</li>
                <li><strong>Company:</strong> ${companyName || 'Not specified'}</li>
                <li><strong>Applied Date:</strong> ${applicationDetails && applicationDetails.appliedAt ? new Date(applicationDetails.appliedAt).toLocaleDateString() : 'Not specified'}</li>
                <li><strong>Expected Salary:</strong> ${applicationDetails && applicationDetails.expectedSalary ? applicationDetails.expectedSalary : 'Not specified'}</li>
                <li><strong>Availability:</strong> ${applicationDetails && applicationDetails.availability ? applicationDetails.availability : 'Not specified'}</li>
              </ul>
            </div>
            
            <p style="color: #374151; margin: 20px 0 0 0; line-height: 1.6;">
              We appreciate the time and effort you put into your application. We encourage you to continue exploring opportunities on InterVue.io and wish you the best in your job search.
            </p>
          </div>
          
          <div style="text-align: center; margin-top: 30px;">
            <a href="${process.env.FRONTEND_URL || 'http://localhost:5173'}/user" 
               style="background-color: #2563eb; color: #ffffff; padding: 12px 30px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block;">
              Browse More Jobs
            </a>
          </div>
          
          <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb;">
            <p style="color: #9ca3af; margin: 0; font-size: 14px;">
              © 2024 InterVue.io. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    `
  }),

  interviewScheduled: (candidateName, jobTitle, companyName, meetLink, applicationDetails) => ({
    subject: `InterVue.io - Interview Scheduled for ${jobTitle}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f8f9fa;">
        <div style="background-color: #ffffff; padding: 30px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #2563eb; margin: 0; font-size: 28px; font-weight: bold;">InterVue.io</h1>
            <p style="color: #6b7280; margin: 10px 0 0 0; font-size: 16px;">Interview Scheduled</p>
          </div>
          
          <div style="background-color: #f0f9ff; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #2563eb;">
            <h2 style="color: #1e40af; margin: 0 0 15px 0; font-size: 20px;">Interview Scheduled! 🎉</h2>
            <p style="color: #374151; margin: 0 0 15px 0; line-height: 1.6;">
              Dear ${candidateName || 'Candidate'},
            </p>
            <p style="color: #374151; margin: 0 0 15px 0; line-height: 1.6;">
              Great news! Your application for the <strong>${jobTitle || 'the position'}</strong> position at <strong>${companyName || 'the company'}</strong> has been selected for an interview.
            </p>
            
            <div style="background-color: #ffffff; padding: 15px; border-radius: 6px; margin: 15px 0;">
              <h3 style="color: #2563eb; margin: 0 0 10px 0; font-size: 16px;">Interview Details:</h3>
              <ul style="color: #374151; margin: 0; padding-left: 20px; line-height: 1.6;">
                <li><strong>Position:</strong> ${jobTitle || 'Not specified'}</li>
                <li><strong>Company:</strong> ${companyName || 'Not specified'}</li>
                <li><strong>Platform:</strong> Google Meet</li>
                <li><strong>Meeting Link:</strong> <a href="${meetLink || '#'}" style="color: #2563eb;">Join Meeting</a></li>
              </ul>
            </div>
            
            <div style="background-color: #fef3c7; padding: 15px; border-radius: 6px; margin: 15px 0; border-left: 4px solid #f59e0b;">
              <h4 style="color: #92400e; margin: 0 0 10px 0; font-size: 14px;">📋 Preparation Tips:</h4>
              <ul style="color: #92400e; margin: 0; padding-left: 20px; line-height: 1.6; font-size: 14px;">
                <li>Test your camera and microphone before the interview</li>
                <li>Find a quiet, well-lit environment</li>
                <li>Have your resume and portfolio ready</li>
                <li>Prepare questions about the role and company</li>
              </ul>
            </div>
          </div>
          
          <div style="text-align: center; margin-top: 30px;">
            <a href="${meetLink || '#'}" 
               style="background-color: #2563eb; color: #ffffff; padding: 12px 30px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block;">
              Join Interview
            </a>
          </div>
          
          <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb;">
            <p style="color: #9ca3af; margin: 0; font-size: 14px;">
              © 2024 InterVue.io. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    `
  }),

  applicationAccepted: (candidateName, jobTitle, companyName, applicationDetails) => ({
    subject: `InterVue.io - Congratulations! Application Accepted for ${jobTitle || 'the position'}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f8f9fa;">
        <div style="background-color: #ffffff; padding: 30px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #2563eb; margin: 0; font-size: 28px; font-weight: bold;">InterVue.io</h1>
            <p style="color: #6b7280; margin: 10px 0 0 0; font-size: 16px;">Application Accepted</p>
          </div>
          
          <div style="background-color: #f0fdf4; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #16a34a;">
            <h2 style="color: #15803d; margin: 0 0 15px 0; font-size: 20px;">Congratulations! 🎉</h2>
            <p style="color: #374151; margin: 0 0 15px 0; line-height: 1.6;">
              Dear ${candidateName || 'Candidate'},
            </p>
            <p style="color: #374151; margin: 0 0 15px 0; line-height: 1.6;">
              We are thrilled to inform you that your application for the <strong>${jobTitle || 'the position'}</strong> position at <strong>${companyName || 'the company'}</strong> has been accepted!
            </p>
            
            <div style="background-color: #ffffff; padding: 15px; border-radius: 6px; margin: 15px 0;">
              <h3 style="color: #2563eb; margin: 0 0 10px 0; font-size: 16px;">Application Details:</h3>
              <ul style="color: #374151; margin: 0; padding-left: 20px; line-height: 1.6;">
                <li><strong>Position:</strong> ${jobTitle || 'Not specified'}</li>
                <li><strong>Company:</strong> ${companyName || 'Not specified'}</li>
                <li><strong>Applied Date:</strong> ${applicationDetails && applicationDetails.appliedAt ? new Date(applicationDetails.appliedAt).toLocaleDateString() : 'Not specified'}</li>
                <li><strong>Expected Salary:</strong> ${applicationDetails && applicationDetails.expectedSalary ? applicationDetails.expectedSalary : 'Not specified'}</li>
                <li><strong>Availability:</strong> ${applicationDetails && applicationDetails.availability ? applicationDetails.availability : 'Not specified'}</li>
              </ul>
            </div>
            
            <p style="color: #374151; margin: 20px 0 0 0; line-height: 1.6;">
              The company will be in touch with you shortly to discuss the next steps in the hiring process. 
              Congratulations on this achievement!
            </p>
          </div>
          
          <div style="text-align: center; margin-top: 30px;">
            <a href="${process.env.FRONTEND_URL || 'http://localhost:5173'}/user" 
               style="background-color: #16a34a; color: #ffffff; padding: 12px 30px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block;">
              View Dashboard
            </a>
          </div>
          
          <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb;">
            <p style="color: #9ca3af; margin: 0; font-size: 14px;">
              © 2024 InterVue.io. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    `
  })
};

// Send email function
const sendEmail = async (to, template, ...args) => {
  try {
    const { subject, html } = emailTemplates[template](...args);
    
    const mailOptions = {
      from: `"InterVue.io" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      html
    };
    
    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent:', info.messageId);
    return true;
  } catch (error) {
    console.error('Email sending failed:', error);
    return false;
  }
};

module.exports = { sendEmail };
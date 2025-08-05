import { useNavigate } from "react-router-dom";
import { ArrowRight, Building, Users, Briefcase, Search, Globe, Shield, Zap, Star, CheckCircle, Award, ChevronRight } from "lucide-react";

export function LandingPage() {
  const navigate = useNavigate();

  const handleGetStarted = () => {
    navigate('/auth/signup');
  };

  const handleLogin = () => {
    navigate('/auth/login');
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-blue-600">
                InterVue.io
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={handleLogin}
                className="text-gray-600 hover:text-gray-900 transition-colors"
              >
                Login
              </button>
              <button
                onClick={handleGetStarted}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
              >
                Get Started
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white mb-6">
              Connect Talent with
              <span className="text-blue-600 dark:text-blue-400"> Opportunity</span>
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto">
              InterVue.io is the modern job portal that connects talented professionals with innovative companies. 
              Whether you're hiring or looking for your next opportunity, we make the process seamless and efficient.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={handleGetStarted}
                className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors text-lg font-semibold flex items-center justify-center gap-2"
              >
                Start Hiring
                <Building className="h-5 w-5" />
              </button>
              <button
                onClick={handleGetStarted}
                className="bg-green-600 text-white px-8 py-3 rounded-lg hover:bg-green-700 transition-colors text-lg font-semibold flex items-center justify-center gap-2"
              >
                Find Jobs
                <Briefcase className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-50 dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Why Choose InterVue.io?
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              We provide the tools and platform you need to succeed in today's competitive job market.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="bg-white dark:bg-gray-900 p-6 rounded-lg shadow-lg">
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center mb-4">
                <Search className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                Smart Matching
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Our AI-powered algorithm matches candidates with the perfect job opportunities based on skills, experience, and preferences.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-white dark:bg-gray-900 p-6 rounded-lg shadow-lg">
              <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center mb-4">
                <Globe className="h-6 w-6 text-green-600 dark:text-green-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                Global Reach
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Connect with top talent and companies from around the world, expanding your opportunities beyond geographical boundaries.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-white dark:bg-gray-900 p-6 rounded-lg shadow-lg">
              <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-lg flex items-center justify-center mb-4">
                <Shield className="h-6 w-6 text-purple-600 dark:text-purple-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                Secure & Private
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Your data is always protected with enterprise-grade security. We never share your information without your explicit permission.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="bg-white dark:bg-gray-900 p-6 rounded-lg shadow-lg">
              <div className="w-12 h-12 bg-yellow-100 dark:bg-yellow-900 rounded-lg flex items-center justify-center mb-4">
                <Zap className="h-6 w-6 text-yellow-600 dark:text-yellow-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                Fast & Efficient
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Our streamlined process helps companies find the right candidates quickly, and job seekers land their dream roles faster.
              </p>
            </div>

            {/* Feature 5 */}
            <div className="bg-white dark:bg-gray-900 p-6 rounded-lg shadow-lg">
              <div className="w-12 h-12 bg-red-100 dark:bg-red-900 rounded-lg flex items-center justify-center mb-4">
                <Star className="h-6 w-6 text-red-600 dark:text-red-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                Premium Opportunities
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Access exclusive job listings and top-tier talent not available on other platforms, giving you a competitive edge.
              </p>
            </div>

            {/* Feature 6 */}
            <div className="bg-white dark:bg-gray-900 p-6 rounded-lg shadow-lg">
              <div className="w-12 h-12 bg-indigo-100 dark:bg-indigo-900 rounded-lg flex items-center justify-center mb-4">
                <CheckCircle className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                Verified Profiles
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                All companies and candidates are verified, ensuring authentic connections and reducing time wasted on unqualified leads.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              How InterVue.io Works
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Our platform makes hiring and job searching simple and effective.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
            <div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">For Employers</h3>
              <ul className="space-y-6">
                <li className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                    <span className="text-blue-600 dark:text-blue-400 font-semibold">1</span>
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">Create Your Company Profile</h4>
                    <p className="text-gray-600 dark:text-gray-300">Set up your company page with your brand, culture, and values to attract the right talent.</p>
                  </div>
                </li>
                <li className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                    <span className="text-blue-600 dark:text-blue-400 font-semibold">2</span>
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">Post Job Opportunities</h4>
                    <p className="text-gray-600 dark:text-gray-300">Create detailed job listings with requirements, benefits, and company culture information.</p>
                  </div>
                </li>
                <li className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                    <span className="text-blue-600 dark:text-blue-400 font-semibold">3</span>
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">Review Matched Candidates</h4>
                    <p className="text-gray-600 dark:text-gray-300">Our AI matches your jobs with qualified candidates, saving you time on initial screening.</p>
                  </div>
                </li>
                <li className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                    <span className="text-blue-600 dark:text-blue-400 font-semibold">4</span>
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">Hire the Best Talent</h4>
                    <p className="text-gray-600 dark:text-gray-300">Connect with candidates, schedule interviews, and make offers all within our platform.</p>
                  </div>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">For Job Seekers</h3>
              <ul className="space-y-6">
                <li className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-8 h-8 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center">
                    <span className="text-green-600 dark:text-green-400 font-semibold">1</span>
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">Create Your Professional Profile</h4>
                    <p className="text-gray-600 dark:text-gray-300">Showcase your skills, experience, and career goals to stand out to employers.</p>
                  </div>
                </li>
                <li className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-8 h-8 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center">
                    <span className="text-green-600 dark:text-green-400 font-semibold">2</span>
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">Discover Opportunities</h4>
                    <p className="text-gray-600 dark:text-gray-300">Browse job listings or receive personalized job recommendations based on your profile.</p>
                  </div>
                </li>
                <li className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-8 h-8 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center">
                    <span className="text-green-600 dark:text-green-400 font-semibold">3</span>
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">Apply with Ease</h4>
                    <p className="text-gray-600 dark:text-gray-300">Submit applications with just a few clicks, using your profile information automatically.</p>
                  </div>
                </li>
                <li className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-8 h-8 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center">
                    <span className="text-green-600 dark:text-green-400 font-semibold">4</span>
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">Land Your Dream Job</h4>
                    <p className="text-gray-600 dark:text-gray-300">Track application status, communicate with employers, and accept offers securely.</p>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-gray-50 dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Success Stories
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Hear from companies and professionals who found success with InterVue.io.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Testimonial 1 */}
            <div className="bg-white dark:bg-gray-900 p-6 rounded-lg shadow-lg">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mr-4">
                  <span className="text-blue-600 dark:text-blue-400 font-bold">TC</span>
                </div>
                <div>
                  <h4 className="text-lg font-semibold text-gray-900 dark:text-white">TechCorp Inc.</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Software Company</p>
                </div>
              </div>
              <p className="text-gray-600 dark:text-gray-300 italic">
                "We've reduced our hiring time by 40% since using InterVue.io. The quality of candidates has been exceptional, and the platform's interface makes the entire process seamless."
              </p>
              <div className="mt-4 flex">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star key={star} className="h-5 w-5 text-yellow-500 fill-current" />
                ))}
              </div>
            </div>

            {/* Testimonial 2 */}
            <div className="bg-white dark:bg-gray-900 p-6 rounded-lg shadow-lg">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mr-4">
                  <span className="text-green-600 dark:text-green-400 font-bold">JS</span>
                </div>
                <div>
                  <h4 className="text-lg font-semibold text-gray-900 dark:text-white">John Smith</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Senior Developer</p>
                </div>
              </div>
              <p className="text-gray-600 dark:text-gray-300 italic">
                "After months of searching on other platforms, I found my dream job within two weeks on InterVue.io. The job matching algorithm really works!"
              </p>
              <div className="mt-4 flex">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star key={star} className="h-5 w-5 text-yellow-500 fill-current" />
                ))}
              </div>
            </div>

            {/* Testimonial 3 */}
            <div className="bg-white dark:bg-gray-900 p-6 rounded-lg shadow-lg">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center mr-4">
                  <span className="text-purple-600 dark:text-purple-400 font-bold">GD</span>
                </div>
                <div>
                  <h4 className="text-lg font-semibold text-gray-900 dark:text-white">Global Designs</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Design Agency</p>
                </div>
              </div>
              <p className="text-gray-600 dark:text-gray-300 italic">
                "As a growing agency, we needed to find specialized talent quickly. InterVue.io connected us with qualified designers who fit our company culture perfectly."
              </p>
              <div className="mt-4 flex">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star key={star} className="h-5 w-5 text-yellow-500 fill-current" />
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-blue-600 dark:bg-blue-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6">
            Ready to Transform Your Career or Hiring Process?
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-3xl mx-auto">
            Join thousands of companies and professionals already using InterVue.io to connect and grow.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={handleGetStarted}
              className="bg-white text-blue-600 px-8 py-3 rounded-lg hover:bg-gray-100 transition-colors text-lg font-semibold flex items-center justify-center gap-2"
            >
              Get Started Now
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-4">InterVue.io</h3>
              <p className="text-gray-400">Connecting talent with opportunity in the digital age.</p>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">For Employers</h4>
              <ul className="space-y-2 text-gray-400">
                <li>Post a Job</li>
                <li>Browse Candidates</li>
                <li>Pricing</li>
                <li>Enterprise Solutions</li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">For Job Seekers</h4>
              <ul className="space-y-2 text-gray-400">
                <li>Browse Jobs</li>
                <li>Career Resources</li>
                <li>Resume Builder</li>
                <li>Skill Assessments</li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-gray-400">
                <li>About Us</li>
                <li>Contact</li>
                <li>Privacy Policy</li>
                <li>Terms of Service</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-400">
            <p>© {new Date().getFullYear()} InterVue.io. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
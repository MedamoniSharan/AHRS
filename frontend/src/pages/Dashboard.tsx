import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Package, 
  User, 
  ChevronRight, 
  ChevronLeft, 
  BarChart3, 
  Users, 
  Target, 
  PlusCircle,
  CreditCard,
  Clock,
  Check,
  X,
  Zap,
  RefreshCw,
  Mic,
  Home
} from 'lucide-react';

function Dashboard() {
  const navigate = useNavigate();
  const [isSubscriptionExpanded, setIsSubscriptionExpanded] = useState(false);
  const [currentPage, setCurrentPage] = useState('home'); // 'home', 'packages', or 'interview-maker'

  const toggleSubscription = () => {
    setIsSubscriptionExpanded(!isSubscriptionExpanded);
  };

  const navigateTo = (page) => {
    setCurrentPage(page);
    // Reset subscription panel state when navigating
    if (page !== 'home') {
      setIsSubscriptionExpanded(false);
    }
  };

  

  const openInterviewMaker = () => {
    navigateTo('interview-maker');
  };

  return (
    <div className="min-h-screen bg-[#0f172a] text-white">
      {/* Header */}
      <header className="flex items-center justify-between p-4 border-b border-gray-800">
        <div className="flex items-center space-x-2">
          <h1 className="text-2xl font-bold"></h1>
        </div>
        <nav className="hidden md:flex items-center space-x-6">
          <a 
            href="#" 
            className={`flex items-center space-x-2 ${currentPage === 'home' ? 'text-purple-400' : 'hover:text-purple-400'}`}
            onClick={() => navigateTo('home')}
          >
            <Home size={20} />
            <span>Home</span>
          </a>
          <a 
            href="#" 
            className={`flex items-center space-x-2 ${currentPage === 'packages' ? 'text-purple-400' : 'hover:text-purple-400'}`}
            onClick={() => navigateTo('packages')}
          >
            <Package size={20} />
            <span>Packages</span>
          </a>
          <a 
            href="#" 
            className={`flex items-center space-x-2 ${currentPage === 'interview-maker' ? 'text-purple-400' : 'hover:text-purple-400'}`}
            onClick={openInterviewMaker}
          >
            <Mic size={20} />
            <span>Interview Maker</span>
          </a>
          <a href="#" className="flex items-center space-x-2 hover:text-purple-400">
            <User size={20} />
            <span>Profile</span>
          </a>
        </nav>
        <div className="flex items-center space-x-4">
          <button className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-md">
            Manage Subscription
          </button>
          <div className="w-10 h-10 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 flex items-center justify-center">
            <span className="font-bold">Z</span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="p-6">
        {currentPage === 'home' ? (
          <>
            {/* Post New Interview Button */}
            <div className="flex justify-end mb-8">
              <button 
                onClick={() => navigate('/post-job')} 
                className="flex items-center gap-2 px-4 py-2 bg-[#1A1528] text-white border border-gray-700 rounded-lg hover:bg-[#2A2538] transition-colors"
              >
                <PlusCircle size={20} /> Post New Job
              </button>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              {/* Total Interviews */}
              <div className="bg-purple-600 rounded-lg p-6">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-lg mb-2">Total Interviews</p>
                    <h3 className="text-5xl font-bold mb-2">10</h3>
                    <p className="text-sm mb-4">10 Applications</p>
                    <button className="text-white hover:underline">View Details</button>
                  </div>
                  <BarChart3 size={24} />
                </div>
              </div>

              {/* Total Participants */}
              <div className="bg-blue-500 rounded-lg p-6">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-lg mb-2">Total Participants</p>
                    <h3 className="text-5xl font-bold mb-2">10</h3>
                    <p className="text-sm mb-4">10 Applications</p>
                    <button className="text-white hover:underline">View Details</button>
                  </div>
                  <Users size={24} />
                </div>
              </div>

              {/* Total Qualified */}
              <div className="bg-red-500 rounded-lg p-6">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-lg mb-2">Total Qualified</p>
                    <h3 className="text-5xl font-bold mb-2">4</h3>
                    <p className="text-sm mb-4">10 Applications</p>
                    <button className="text-white hover:underline">View Details</button>
                  </div>
                  <Target size={24} />
                </div>
              </div>
            </div>
          </>
        ) : currentPage === 'packages' ? (
          <>
            {/* Packages Page */}
            <div className="mb-8">
              <h2 className="text-3xl font-bold mb-6">Subscription & Packages</h2>
              
              {/* Current Plan Overview */}
              <div className="bg-gradient-to-r from-purple-600 to-purple-800 rounded-lg p-6 mb-8">
                <div className="flex flex-col md:flex-row justify-between">
                  <div>
                    <div className="flex items-center mb-4">
                      <CreditCard className="mr-2" />
                      <h3 className="text-xl font-bold">Current Plan: Professional</h3>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <p className="text-sm text-purple-200 mb-1">Tokens Usage</p>
                        <div className="w-full bg-purple-900 rounded-full h-3 mb-1">
                          <div className="bg-white h-3 rounded-full" style={{ width: '45%' }}></div>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>450 used</span>
                          <span>550 remaining</span>
                        </div>
                      </div>
                      <div>
                        <p className="text-sm text-purple-200 mb-1">Interviews Conducted</p>
                        <div className="w-full bg-purple-900 rounded-full h-3 mb-1">
                          <div className="bg-white h-3 rounded-full" style={{ width: '30%' }}></div>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>6 used</span>
                          <span>14 remaining</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="mt-6 md:mt-0 flex flex-col justify-center items-start md:items-end">
                    <div className="flex items-center mb-2">
                      <Clock size={16} className="mr-2" />
                      <span>Expires in: <strong>23 days</strong></span>
                    </div>
                    <div className="flex space-x-3 mt-2">
                      <button className="bg-white text-purple-700 hover:bg-gray-100 px-4 py-2 rounded-md text-sm font-medium">
                        Renew Plan
                      </button>
                      <button className="bg-purple-900 text-white hover:bg-purple-800 px-4 py-2 rounded-md text-sm font-medium">
                        Upgrade
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Token Purchase Options */}
              <div className="bg-gray-800 rounded-lg p-6 mb-8">
                <h3 className="text-xl font-bold mb-4">Need More Tokens?</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-gray-700 p-4 rounded-lg hover:bg-gray-600 transition-colors cursor-pointer">
                    <h4 className="font-bold mb-2">100 Tokens</h4>
                    <p className="text-2xl font-bold mb-2">$19</p>
                    <p className="text-sm text-gray-300 mb-4">Best for small teams</p>
                    <button className="w-full bg-purple-600 hover:bg-purple-700 py-2 rounded text-sm">
                      Purchase
                    </button>
                  </div>
                  <div className="bg-gray-700 p-4 rounded-lg hover:bg-gray-600 transition-colors cursor-pointer relative">
                    <div className="absolute -top-3 -right-3 bg-purple-500 text-white text-xs px-2 py-1 rounded-full">
                      Popular
                    </div>
                    <h4 className="font-bold mb-2">500 Tokens</h4>
                    <p className="text-2xl font-bold mb-2">$79</p>
                    <p className="text-sm text-gray-300 mb-4">Best for medium teams</p>
                    <button className="w-full bg-purple-600 hover:bg-purple-700 py-2 rounded text-sm">
                      Purchase
                    </button>
                  </div>
                  <div className="bg-gray-700 p-4 rounded-lg hover:bg-gray-600 transition-colors cursor-pointer">
                    <h4 className="font-bold mb-2">1000 Tokens</h4>
                    <p className="text-2xl font-bold mb-2">$149</p>
                    <p className="text-sm text-gray-300 mb-4">Best for large teams</p>
                    <button className="w-full bg-purple-600 hover:bg-purple-700 py-2 rounded text-sm">
                      Purchase
                    </button>
                  </div>
                </div>
              </div>
              
              {/* Subscription Plans */}
              <h3 className="text-2xl font-bold mb-4">Available Subscription Plans</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
                {/* Basic Plan */}
                <div className="bg-gray-800 rounded-lg overflow-hidden">
                  <div className="p-6">
                    <h4 className="text-xl font-bold mb-2">Basic</h4>
                    <p className="text-3xl font-bold mb-4">$29<span className="text-sm font-normal">/month</span></p>
                    <p className="text-sm text-gray-300 mb-6">Perfect for startups and small businesses</p>
                    
                    <ul className="space-y-3 mb-6">
                      <li className="flex items-start">
                        <Check size={18} className="text-green-400 mr-2 mt-0.5" />
                        <span>300 tokens per month</span>
                      </li>
                      <li className="flex items-start">
                        <Check size={18} className="text-green-400 mr-2 mt-0.5" />
                        <span>Up to 10 interviews</span>
                      </li>
                      <li className="flex items-start">
                        <Check size={18} className="text-green-400 mr-2 mt-0.5" />
                        <span>Basic analytics</span>
                      </li>
                      <li className="flex items-start">
                        <X size={18} className="text-red-400 mr-2 mt-0.5" />
                        <span className="text-gray-400">Custom branding</span>
                      </li>
                      <li className="flex items-start">
                        <X size={18} className="text-red-400 mr-2 mt-0.5" />
                        <span className="text-gray-400">API access</span>
                      </li>
                    </ul>
                  </div>
                  <div className="px-6 pb-6">
                    <button className="w-full bg-gray-700 hover:bg-gray-600 py-3 rounded text-sm font-medium">
                      Choose Plan
                    </button>
                  </div>
                </div>
                
                {/* Professional Plan */}
                <div className="bg-gradient-to-b from-purple-700 to-purple-900 rounded-lg overflow-hidden relative">
                  <div className="absolute top-0 right-0 bg-purple-500 text-white text-xs px-3 py-1">
                    CURRENT
                  </div>
                  <div className="p-6">
                    <h4 className="text-xl font-bold mb-2">Professional</h4>
                    <p className="text-3xl font-bold mb-4">$79<span className="text-sm font-normal">/month</span></p>
                    <p className="text-sm text-purple-200 mb-6">Ideal for growing companies</p>
                    
                    <ul className="space-y-3 mb-6">
                      <li className="flex items-start">
                        <Check size={18} className="text-green-400 mr-2 mt-0.5" />
                        <span>1000 tokens per month</span>
                      </li>
                      <li className="flex items-start">
                        <Check size={18} className="text-green-400 mr-2 mt-0.5" />
                        <span>Up to 20 interviews</span>
                      </li>
                      <li className="flex items-start">
                        <Check size={18} className="text-green-400 mr-2 mt-0.5" />
                        <span>Advanced analytics</span>
                      </li>
                      <li className="flex items-start">
                        <Check size={18} className="text-green-400 mr-2 mt-0.5" />
                        <span>Custom branding</span>
                      </li>
                      <li className="flex items-start">
                        <X size={18} className="text-red-400 mr-2 mt-0.5" />
                        <span className="text-gray-300">API access</span>
                      </li>
                    </ul>
                  </div>
                  <div className="px-6 pb-6">
                    <button className="w-full bg-white text-purple-700 hover:bg-gray-100 py-3 rounded text-sm font-medium flex items-center justify-center">
                      <RefreshCw size={16} className="mr-2" />
                      Renew Plan
                    </button>
                  </div>
                </div>
                
                {/* Enterprise Plan */}
                <div className="bg-gray-800 rounded-lg overflow-hidden">
                  <div className="p-6">
                    <h4 className="text-xl font-bold mb-2">Enterprise</h4>
                    <p className="text-3xl font-bold mb-4">$199<span className="text-sm font-normal">/month</span></p>
                    <p className="text-sm text-gray-300 mb-6">For large organizations with high volume</p>
                    
                    <ul className="space-y-3 mb-6">
                      <li className="flex items-start">
                        <Check size={18} className="text-green-400 mr-2 mt-0.5" />
                        <span>3000 tokens per month</span>
                      </li>
                      <li className="flex items-start">
                        <Check size={18} className="text-green-400 mr-2 mt-0.5" />
                        <span>Unlimited interviews</span>
                      </li>
                      <li className="flex items-start">
                        <Check size={18} className="text-green-400 mr-2 mt-0.5" />
                        <span>Premium analytics & reporting</span>
                      </li>
                      <li className="flex items-start">
                        <Check size={18} className="text-green-400 mr-2 mt-0.5" />
                        <span>Custom branding</span>
                      </li>
                      <li className="flex items-start">
                        <Check size={18} className="text-green-400 mr-2 mt-0.5" />
                        <span>API access</span>
                      </li>
                    </ul>
                  </div>
                  <div className="px-6 pb-6">
                    <button className="w-full bg-purple-600 hover:bg-purple-700 py-3 rounded text-sm font-medium">
                      Upgrade
                    </button>
                  </div>
                </div>
              </div>
              
              {/* Custom Enterprise Solutions */}
              <div className="bg-gradient-to-r from-blue-700 to-purple-700 rounded-lg p-6">
                <div className="flex flex-col md:flex-row justify-between items-center">
                  <div>
                    <h3 className="text-xl font-bold mb-2">Need a Custom Solution?</h3>
                    <p className="max-w-2xl">
                      We offer tailored enterprise solutions for organizations with specific requirements.
                      Our team will work with you to create a custom package that fits your needs.
                    </p>
                  </div>
                  <button className="mt-4 md:mt-0 bg-white text-purple-700 hover:bg-gray-100 px-6 py-3 rounded-md font-medium">
                    Contact Sales
                  </button>
                </div>
              </div>
            </div>
          </>
        ) : currentPage === 'interview-maker' ? (
          <>
            {/* Interview Maker Page */}
            <div className="mb-8">
              <h2 className="text-3xl font-bold mb-6">Choose Interview Type</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* AI Interview */}
                <div className="bg-gradient-to-br from-purple-700 to-purple-900 rounded-lg p-8 hover:shadow-lg transition-all duration-300 cursor-pointer transform hover:-translate-y-1">
                  <div className="flex flex-col items-center text-center">
                    <div className="bg-purple-600 p-4 rounded-full mb-6">
                      <Zap size={48} className="text-white" />
                    </div>
                    <h3 className="text-2xl font-bold mb-4">AI Interview</h3>
                    <p className="text-gray-200 mb-6">
                      Let our AI create and conduct interviews based on job requirements. Perfect for screening candidates efficiently.
                    </p>
                    <ul className="text-left w-full space-y-3 mb-6">
                      <li className="flex items-start">
                        <Check size={18} className="text-green-400 mr-2 mt-0.5" />
                        <span>Automated question generation</span>
                      </li>
                      <li className="flex items-start">
                        <Check size={18} className="text-green-400 mr-2 mt-0.5" />
                        <span>Skill-based assessment</span>
                      </li>
                      <li className="flex items-start">
                        <Check size={18} className="text-green-400 mr-2 mt-0.5" />
                        <span>Detailed candidate reports</span>
                      </li>
                    </ul>
                    <button className="bg-white text-purple-700 hover:bg-gray-100 px-6 py-3 rounded-md font-medium w-full">
                      Create AI Interview
                    </button>
                  </div>
                </div>
                
                {/* Custom Interview */}
                <div className="bg-gradient-to-br from-blue-700 to-blue-900 rounded-lg p-8 hover:shadow-lg transition-all duration-300 cursor-pointer transform hover:-translate-y-1">
                  <div className="flex flex-col items-center text-center">
                    <div className="bg-blue-600 p-4 rounded-full mb-6">
                      <User size={48} className="text-white" />
                    </div>
                    <h3 className="text-2xl font-bold mb-4">Custom Interview</h3>
                    <p className="text-gray-200 mb-6">
                      Create your own interview questions and evaluation criteria. Perfect for specialized roles and unique requirements.
                    </p>
                    <ul className="text-left w-full space-y-3 mb-6">
                      <li className="flex items-start">
                        <Check size={18} className="text-green-400 mr-2 mt-0.5" />
                        <span>Full customization control</span>
                      </li>
                      <li className="flex items-start">
                        <Check size={18} className="text-green-400 mr-2 mt-0.5" />
                        <span>Question templates library</span>
                      </li>
                      <li className="flex items-start">
                        <Check size={18} className="text-green-400 mr-2 mt-0.5" />
                        <span>Custom scoring system</span>
                      </li>
                    </ul>
                    <button className="bg-white text-blue-700 hover:bg-gray-100 px-6 py-3 rounded-md font-medium w-full">
                      Create Custom Interview
                    </button>
                  </div>
                </div>
              </div>
              
              {/* Recent Templates Section */}
              <div className="mt-12">
                <h3 className="text-xl font-bold mb-4">Recent Templates</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-gray-800 p-4 rounded-lg hover:bg-gray-700 transition-colors cursor-pointer">
                    <h4 className="font-bold mb-2">Frontend Developer</h4>
                    <p className="text-sm text-gray-300 mb-2">15 questions • 45 min</p>
                    <div className="flex justify-between items-center">
                      <span className="text-xs bg-purple-600 px-2 py-1 rounded">AI</span>
                      <span className="text-xs text-gray-400">Used 8 times</span>
                    </div>
                  </div>
                  <div className="bg-gray-800 p-4 rounded-lg hover:bg-gray-700 transition-colors cursor-pointer">
                    <h4 className="font-bold mb-2">Product Manager</h4>
                    <p className="text-sm text-gray-300 mb-2">12 questions • 30 min</p>
                    <div className="flex justify-between items-center">
                      <span className="text-xs bg-blue-600 px-2 py-1 rounded">Custom</span>
                      <span className="text-xs text-gray-400">Used 5 times</span>
                    </div>
                  </div>
                  <div className="bg-gray-800 p-4 rounded-lg hover:bg-gray-700 transition-colors cursor-pointer">
                    <h4 className="font-bold mb-2">UX Designer</h4>
                    <p className="text-sm text-gray-300 mb-2">10 questions • 25 min</p>
                    <div className="flex justify-between items-center">
                      <span className="text-xs bg-purple-600 px-2 py-1 rounded">AI</span>
                      <span className="text-xs text-gray-400">Used 3 times</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </>
        ) : null}
      </main>

      {/* Subscription Panel - Only visible on home page */}
      {currentPage === 'home' && (
        <div className={`fixed bottom-0 left-0 right-0 bg-gray-800 transition-all duration-300 ${isSubscriptionExpanded ? 'h-64' : 'h-16'}`}>
          <div className="flex items-center justify-between p-4 border-b border-gray-700">
            <div className="flex items-center">
              <button 
                onClick={toggleSubscription}
                className="mr-4 bg-gray-700 hover:bg-gray-600 p-2 rounded-full"
              >
                {isSubscriptionExpanded ? <ChevronDown size={20} /> : <ChevronUp size={20} />}
              </button>
              <div>
                <p className="font-medium">Current Plan: <span className="text-purple-400">Professional</span></p>
              </div>
            </div>
            <button className="bg-purple-600 hover:bg-purple-700 px-4 py-1 rounded text-sm">
              Upgrade Plan
            </button>
          </div>

          {isSubscriptionExpanded && (
            <div className="p-4 grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-gray-700 p-4 rounded-lg">
                <h3 className="font-bold mb-2">Usage Statistics</h3>
                <div className="space-y-2">
                  <div>
                    <p className="text-sm text-gray-300">Tokens Used</p>
                    <div className="w-full bg-gray-600 rounded-full h-2.5">
                      <div className="bg-purple-600 h-2.5 rounded-full" style={{ width: '45%' }}></div>
                    </div>
                    <p className="text-xs text-right mt-1">450 / 1000</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-300">Interviews Conducted</p>
                    <div className="w-full bg-gray-600 rounded-full h-2.5">
                      <div className="bg-blue-500 h-2.5 rounded-full" style={{ width: '30%' }}></div>
                    </div>
                    <p className="text-xs text-right mt-1">6 / 20</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-gray-700 p-4 rounded-lg">
                <h3 className="font-bold mb-2">Available Plans</h3>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <p className="text-sm">Basic</p>
                    <p className="text-sm font-bold">$29/mo</p>
                  </div>
                  <div className="flex justify-between items-center">
                    <p className="text-sm">Professional</p>
                    <p className="text-sm font-bold text-purple-400">$79/mo (Current)</p>
                  </div>
                  <div className="flex justify-between items-center">
                    <p className="text-sm">Enterprise</p>
                    <p className="text-sm font-bold">$199/mo</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-gray-700 p-4 rounded-lg">
                <h3 className="font-bold mb-2">Custom Options</h3>
                <p className="text-sm mb-3">Need a tailored solution for your organization?</p>
                <button className="w-full bg-purple-600 hover:bg-purple-700 py-2 rounded text-sm">
                  Contact Sales
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// Custom ChevronUp and ChevronDown components
const ChevronUp = ({ size = 24, ...props }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    {...props}
  >
    <polyline points="18 15 12 9 6 15"></polyline>
  </svg>
);

const ChevronDown = ({ size = 24, ...props }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    {...props}
  >
    <polyline points="6 9 12 15 18 9"></polyline>
  </svg>
);

export default Dashboard;
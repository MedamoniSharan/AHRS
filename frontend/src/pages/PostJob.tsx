import React, { useState, useEffect } from 'react';
import { ArrowLeft, PlusCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

function PostJob() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    companyId: '',
    jobId: '',
    displayName: '',
    postedOn: '',
    title: '',
    description: '',
    experience: '',
    salary: '',
    location: '',
    keyResponsibilities: '',
    benefits: '',
    approvalRequired: false,
    privateJob: false,
    collegeNames: '',
  });
  const [showToast, setShowToast] = useState(false); // Added toast state

  useEffect(() => {
    // Retrieve logged in user's data from sessionStorage
    const storedUser = sessionStorage.getItem('user');
    const sessionEmail = storedUser ? JSON.parse(storedUser).email : 'default@example.com';
    const sessionDisplayName = storedUser ? JSON.parse(storedUser).username : 'No Display Name';
    const randomJobId = Math.floor(Math.random() * 1000000);
    if (storedUser) {
      const userData = JSON.parse(storedUser);
      console.log('User Data:', userData);
    } else {
      console.log('No user data found in sessionStorage');
    }
    setFormData((prevData) => ({
      ...prevData,
      companyId: sessionEmail,
      jobId: randomJobId,
      displayName: sessionDisplayName,
    }));
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  // Added validation function
  const validateForm = () => {
    const requiredFields = ['title', 'description', 'salary', 'location'];
    return requiredFields.every(field => formData[field].trim() !== '');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Added validation check
    if (!validateForm()) {
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
      return;
    }

    try {
      const response = await fetch('https://y0nraqyq18.execute-api.us-east-1.amazonaws.com/default/post_job', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
        mode: 'cors',
      });

      const result = await response.json();
      if (response.ok) {
        alert('Job posted successfully!');
        navigate('/company-dashboard#');
      } else {
        alert('Error posting job');
      }
    } catch (error) {
      console.error('Error posting job:', error);
    }
  };

  return (
    <main style={{ backgroundColor: '#000000' }} className="min-h-screen p-8 text-white">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold mb-8 drop-shadow-[0_0_8px_rgba(128,0,128,0.8)]">
          Company Posted Jobs
        </h1>
        {/* Added Toast Notification */}
        {showToast && (
          <div className="fixed top-4 right-4 z-50 animate-fade-in">
            <div className="bg-red-500 text-white px-4 py-2 rounded-lg shadow-lg">
              Please enter all required details (Job Title, Description, Salary, and Location)
            </div>
          </div>
        )}
        {/* Post New Job Button */}
        <div className="flex justify-end mb-8">
          <button
            onClick={() => navigate('/post-job')}
            className="flex items-center gap-2 px-4 py-2 bg-[#1A1528] text-white border border-gray-700 rounded-lg hover:bg-[#2A2538] transition-colors drop-shadow-[0_0_8px_rgba(128,0,128,0.8)]"
          >
            <PlusCircle size={20} /> Post New Job
          </button>
        </div>

        <button
          onClick={() => navigate('/company-dashboard')}
          className="flex items-center gap-2 text-gray-400 hover:text-white mb-6 transition-colors"
        >
          <ArrowLeft size={20} />
          Back to Dashboard
        </button>

        <div className="bg-[#1A1528] rounded-xl p-8 shadow-lg border border-gray-800 drop-shadow-[0_0_8px_rgba(128,0,128,0.8)]">
          <h2 className="text-2xl font-bold text-white mb-6">Post New Interview</h2>
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="grid grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Company ID</label>
                <input
                  type="text"
                  name="companyId"
                  value={formData.companyId}
                  onChange={handleChange}
                  className="w-full px-3 py-2 bg-[#2A2538] border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  readOnly
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Job ID</label>
                <input
                  type="text"
                  name="jobId"
                  value={formData.jobId}
                  onChange={handleChange}
                  className="w-full px-3 py-2 bg-[#2A2538] border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  readOnly
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Display Name</label>
                <input
                  type="text"
                  name="displayName"
                  value={formData.displayName}
                  className="w-full px-3 py-2 bg-[#2A2538] border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  readOnly
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Posted On</label>
              <input
                type="date"
                name="postedOn"
                value={formData.postedOn}
                onChange={handleChange}
                className="w-full px-3 py-2 bg-[#2A2538] border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Job Title *</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                className="w-full px-3 py-2 bg-[#2A2538] border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Job Description *</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={4}
                className="w-full px-3 py-2 bg-[#2A2538] border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                required
              />
            </div>

            {/* New Fields for Key Responsibilities and Benefits */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Key Responsibilities</label>
              <textarea
                name="keyResponsibilities"
                value={formData.keyResponsibilities}
                onChange={handleChange}
                rows={4}
                className="w-full px-3 py-2 bg-[#2A2538] border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Benefits</label>
              <textarea
                name="benefits"
                value={formData.benefits}
                onChange={handleChange}
                rows={4}
                className="w-full px-3 py-2 bg-[#2A2538] border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Experience</label>
                <input
                  type="text"
                  name="experience"
                  value={formData.experience}
                  onChange={handleChange}
                  className="w-full px-3 py-2 bg-[#2A2538] border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Salary *</label>
                <input
                  type="text"
                  name="salary"
                  value={formData.salary}
                  onChange={handleChange}
                  className="w-full px-3 py-2 bg-[#2A2538] border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Location *</label>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleChange}
                className="w-full px-3 py-2 bg-[#2A2538] border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                required
              />
            </div>

            <div className="flex items-center">
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  name="approvalRequired"
                  checked={formData.approvalRequired}
                  onChange={handleChange}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-800 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                <span className="ml-3 text-sm font-medium text-gray-300">Approval Required</span>
              </label>
            </div>

            <div className="flex items-center gap-4">
              <label className="block text-sm font-medium text-gray-300">Private Job</label>
              <input
                type="checkbox"
                name="privateJob"
                checked={formData.privateJob}
                onChange={handleChange}
                className="toggle-checkbox"
              />
            </div>

            {formData.privateJob && (
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  College Names
                </label>
                <textarea
                  name="collegeNames"
                  value={formData.collegeNames}
                  onChange={handleChange}
                  className="w-full px-3 py-2 bg-[#2A2538] border border-gray-700 rounded-lg text-white"
                  placeholder="Enter college names separated by commas"
                  rows={3}
                />
              </div>
            )}

            <div className="flex justify-end gap-4 pt-6">
              <button
                type="button"
                onClick={() => navigate('/company-dashboard')}
                className="px-4 py-2 text-gray-300 bg-[#2A2538] border border-gray-700 rounded-lg hover:bg-[#3A3548] transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 text-white bg-gradient-to-r from-purple-600 to-blue-500 rounded-lg hover:from-purple-700 hover:to-blue-600 transition-colors"
              >
                Submit
              </button>
            </div>
          </form>
        </div>
      </div>
    </main>
  );
}

export default PostJob;
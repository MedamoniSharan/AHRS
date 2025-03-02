import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  Zap,
  User,
  ArrowLeft,
  Plus,
  Minus,
  Clock,
  Briefcase,
  Building,
  Award,
  FileText,
  CheckCircle
} from 'lucide-react';
import axios from 'axios';

// NOTE: Exposing your API key in client code is not secure for production.
const OPENAI_API_KEY = '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';

type Question = {
  question: string;
  answer: string;
  marks?: number;
};

type PreviewSummary = {
  total_time: string;
  num_questions: number;
  total_marks: number;
};

type InterviewFormData = {
  // Common fields
  job_id: string;
  company_id: string;
  experience: string;
  job_title: string;
  job_description: string;
  manager_approval: boolean;
  compulsory: boolean;
  total_time: string;
  // For AI Interview only:
  technical_skills: string;
  soft_skills: string;
  num_questions: string; // how many questions to generate
  // For both flows:
  marks: string[]; // marks per question
  // For Custom Interview: manually entered Q&A; for AI Interview, these will be generated
  questions: Question[];
};

function InterviewMaker() {
  const location = useLocation();
  const navigate = useNavigate();
  // Prepopulate fields from job state (if available)
  const job = location.state || {};

  const [interviewType, setInterviewType] = useState<'selection' | 'ai' | 'custom'>('selection');
  const [showPreview, setShowPreview] = useState(false);
  const [previewSummary, setPreviewSummary] = useState<PreviewSummary | null>(null);
  const [formData, setFormData] = useState<InterviewFormData>({
    job_id: job.job_id || '',
    company_id: job.company_id || '',
    experience: job.experience || '',
    job_title: job.job_title || '',
    job_description: job.job_description || '',
    manager_approval: false,
    compulsory: false,
    total_time: '30',
    // AI Interview fields
    technical_skills: job.technical_skills || '',
    soft_skills: job.soft_skills || '',
    num_questions: job.num_questions || '3',
    // Common fields
    marks: ['10'],
    questions: [{ question: '', answer: '' }],
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  // Calculate total marks from marks array
  const totalMarks = formData.marks.reduce((acc, cur) => acc + Number(cur), 0);

  // Common field handlers
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setFormData({ ...formData, [name]: checked });
  };

  const handleMarksChange = (index: number, value: string) => {
    const newMarks = [...formData.marks];
    newMarks[index] = value;
    setFormData({ ...formData, marks: newMarks });
  };

  const addMarksField = () => {
    setFormData({ ...formData, marks: [...formData.marks, '10'] });
  };

  const removeMarksField = (index: number) => {
    if (formData.marks.length > 1) {
      const newMarks = formData.marks.filter((_, i) => i !== index);
      setFormData({ ...formData, marks: newMarks });
    }
  };

  const handleQuestionChange = (index: number, field: 'question' | 'answer', value: string) => {
    const newQuestions = [...formData.questions];
    newQuestions[index] = { ...newQuestions[index], [field]: value };
    setFormData({ ...formData, questions: newQuestions });
  };

  const addQuestionField = () => {
    setFormData({ ...formData, questions: [...formData.questions, { question: '', answer: '' }] });
  };

  const removeQuestionField = (index: number) => {
    if (formData.questions.length > 1) {
      const newQuestions = formData.questions.filter((_, i) => i !== index);
      setFormData({ ...formData, questions: newQuestions });
    }
  };

  const goBack = () => {
    setInterviewType('selection');
    setShowPreview(false);
    setPreviewSummary(null);
    // Optionally, reset the form (or keep job state values)
    setFormData({
      job_id: job.job_id || '',
      company_id: job.company_id || '',
      experience: job.experience || '',
      job_title: job.job_title || '',
      job_description: job.job_description || '',
      manager_approval: false,
      compulsory: false,
      total_time: '30',
      technical_skills: job.technical_skills || '',
      soft_skills: job.soft_skills || '',
      num_questions: job.num_questions || '3',
      marks: ['10'],
      questions: [{ question: '', answer: '' }],
    });
  };

  // For AI Interview: call OpenAI Chat API to generate questions (and summary)
  async function generateInterviewQuestions(): Promise<{ questions: Question[]; summary?: PreviewSummary }> {
    const numQuestions = Number(formData.num_questions);
    const prompt = `You are an expert interviewer.
Generate a JSON object with two keys: "questions" and "summary".
- "questions" should be an array of ${numQuestions} objects. Each object must include:
    - "question": an interview question based on the details below,
    - "answer": a detailed expected answer,
    - "marks": assign the corresponding mark from the following marks array: [${formData.marks.join(', ')}].
- "summary" should be an object containing:
    - "total_time": the total time for the interview (in minutes) as provided,
    - "num_questions": the total number of questions,
    - "total_marks": the sum of marks for all questions.
Use these details:
Job Title: ${formData.job_title}
Job Description: ${formData.job_description}
Experience Level: ${formData.experience}
Technical Skills: ${formData.technical_skills}
Soft Skills: ${formData.soft_skills}
Return only valid JSON.`;

    const chatGPTResponse = await axios.post(
      "https://api.openai.com/v1/chat/completions",
      {
        model: "gpt-4",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.7,
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${OPENAI_API_KEY}`,
        },
      }
    );

    const content = chatGPTResponse.data.choices[0].message.content;
    try {
      const parsed = JSON.parse(content);
      if (parsed.questions && Array.isArray(parsed.questions)) {
        return parsed;
      }
      throw new Error('Invalid format received from OpenAI.');
    } catch (error) {
      console.error('Error parsing AI response:', error);
      return { questions: [] };
    }
  }

  // Preview step (for both AI and Custom flows)
  // For AI interview, we optionally generate questions before previewing.
  const handlePreview = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    if (interviewType === 'ai') {
      try {
        const result = await generateInterviewQuestions();
        if (result.questions.length > 0) {
          setFormData(prev => ({ ...prev, questions: result.questions }));
          if (result.summary) {
            setPreviewSummary(result.summary);
          }
        }
      } catch (error) {
        console.error('Error generating questions:', error);
      }
    }
    setIsSubmitting(false);
    setShowPreview(true);
  };

  // Final submission for both flows using the same API endpoint.
  const finalSubmit = () => {
    setIsSubmitting(true);
    const formattedData = {
      job_id: parseInt(formData.job_id),
      company_id: formData.company_id,
      experience: formData.experience,
      job_title: formData.job_title,
      job_description: formData.job_description,
      manager_approval: formData.manager_approval ? 1 : 0,
      compulsary: formData.compulsory ? 1 : 0,
      compulsory: formData.compulsory ? 1 : 0,
      marks: formData.marks.map(mark => ({ N: mark })),
      questions: formData.questions.map(q => ({
        M: {
          question: { S: q.question },
          answer: { S: q.answer }
        }
      })),
      total_time: parseInt(formData.total_time)
    };
    console.log('Submitting interview data:', formattedData);
    fetch('https://0x9m8akkg9.execute-api.us-east-1.amazonaws.com/qa/set_questions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formattedData)
    })
      .then(response => response.json())
      .then(data => {
        console.log('API response:', data);
        setIsSuccess(true);
        setTimeout(() => {
          setIsSuccess(false);
          setShowPreview(false);
          setInterviewType('selection');
        }, 3000);
      })
      .catch(error => {
        console.error('Error submitting interview:', error);
      })
      .finally(() => {
        setIsSubmitting(false);
      });
  };

  // --- Render Section ---

  // Preview Screen (common for both flows)
  if (showPreview) {
    return (
      <div className="min-h-screen bg-gray-900 text-white p-6">
        <button onClick={() => setShowPreview(false)} className="flex items-center text-gray-300 hover:text-white mb-6">
          <ArrowLeft size={20} className="mr-2" /> Back to Editing
        </button>
        <h1 className="text-2xl font-bold mb-6">Preview Questions & Answers</h1>
        {formData.questions.map((q, index) => (
          <div key={index} className="p-4 bg-gray-800 rounded-md border border-gray-600 mb-4">
            <h3 className="font-semibold">Question {index + 1}:</h3>
            <p className="mb-2">{q.question}</p>
            <h4 className="font-semibold">Expected Answer:</h4>
            <p className="mb-2">{q.answer}</p>
            <p className="text-sm text-gray-400">Marks: {formData.marks[index] || 'N/A'}</p>
          </div>
        ))}
        {previewSummary && (
          <div className="mt-6 p-4 bg-gray-700 rounded-md border border-gray-600">
            <h3 className="font-semibold">Interview Summary:</h3>
            <p>Total Time: {previewSummary.total_time} minutes</p>
            <p>Number of Questions: {previewSummary.num_questions}</p>
            <p>Total Marks: {previewSummary.total_marks}</p>
          </div>
        )}
        <div className="flex justify-end mt-6">
          <button
            onClick={finalSubmit}
            disabled={isSubmitting}
            className={`bg-green-600 hover:bg-green-700 text-white py-2 px-6 rounded-md font-medium flex items-center ${
              isSubmitting ? 'opacity-70 cursor-not-allowed' : ''
            }`}
          >
            {isSubmitting ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Processing...
              </>
            ) : (
              <>Confirm and Submit Interview</>
            )}
          </button>
        </div>
      </div>
    );
  }

  // Selection Screen
  if (interviewType === 'selection') {
    return (
      <div className="min-h-screen bg-gray-900 text-white p-6">
        <h1 className="text-3xl font-bold mb-8 text-center">Choose Interview Type</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-6xl mx-auto">
          {/* AI Interview Card */}
          <div className="bg-purple-800 rounded-lg p-8 flex flex-col items-center shadow-lg hover:shadow-xl transition-all">
            <div className="bg-purple-700 p-4 rounded-full mb-4">
              <Zap size={48} className="text-white" />
            </div>
            <h2 className="text-2xl font-bold mb-4">AI Interview</h2>
            <p className="text-center mb-6">Let our AI generate interview questions based on job details, technical skills, and soft skills.</p>
            <button onClick={() => setInterviewType('ai')} className="w-full bg-white text-purple-800 py-3 rounded-md font-semibold hover:bg-gray-100 transition-colors">
              Create AI Interview
            </button>
          </div>
          {/* Custom Interview Card */}
          <div className="bg-blue-700 rounded-lg p-8 flex flex-col items-center shadow-lg hover:shadow-xl transition-all">
            <div className="bg-blue-600 p-4 rounded-full mb-4">
              <User size={48} className="text-white" />
            </div>
            <h2 className="text-2xl font-bold mb-4">Custom Interview</h2>
            <p className="text-center mb-6">Manually set your interview questions, assign marks, and define total time.</p>
            <button onClick={() => setInterviewType('custom')} className="w-full bg-white text-blue-700 py-3 rounded-md font-semibold hover:bg-gray-100 transition-colors">
              Create Custom Interview
            </button>
          </div>
        </div>
      </div>
    );
  }

  // AI Interview Form
  if (interviewType === 'ai') {
    return (
      <div className="min-h-screen bg-gray-900 text-white p-6">
        <button onClick={goBack} className="flex items-center text-gray-300 hover:text-white mb-6">
          <ArrowLeft size={20} className="mr-2" /> Back to selection
        </button>
        <div className="max-w-3xl mx-auto bg-gray-800 rounded-lg p-8 shadow-lg">
          <h1 className="text-2xl font-bold mb-6 flex items-center">
            <Zap size={24} className="text-purple-400 mr-2" /> Create AI Interview
          </h1>
          <form onSubmit={handlePreview} className="space-y-6">
            {/* Common Job Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-gray-300 mb-2 flex items-center">
                  <Briefcase size={16} className="mr-2" /> Job ID
                </label>
                <input type="number" name="job_id" value={formData.job_id} onChange={handleInputChange} className="w-full bg-gray-700 border border-gray-600 rounded-md py-2 px-3 text-white" required />
              </div>
              <div>
                <label className="block text-gray-300 mb-2 flex items-center">
                  <Building size={16} className="mr-2" /> Company ID
                </label>
                <input type="text" name="company_id" value={formData.company_id} onChange={handleInputChange} className="w-full bg-gray-700 border border-gray-600 rounded-md py-2 px-3 text-white" required />
              </div>
            </div>
            <div>
              <label className="block text-gray-300 mb-2 flex items-center">
                <Award size={16} className="mr-2" /> Job Title
              </label>
              <input type="text" name="job_title" value={formData.job_title} onChange={handleInputChange} className="w-full bg-gray-700 border border-gray-600 rounded-md py-2 px-3 text-white" required />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-gray-300 mb-2 flex items-center">
                  <Award size={16} className="mr-2" /> Experience Level
                </label>
                <input type="text" name="experience" value={formData.experience} onChange={handleInputChange} placeholder="e.g., 3 years, Entry Level, Senior" className="w-full bg-gray-700 border border-gray-600 rounded-md py-2 px-3 text-white" required />
              </div>
              <div>
                <label className="block text-gray-300 mb-2 flex items-center">
                  <FileText size={16} className="mr-2" /> Technical Skills
                </label>
                <input type="text" name="technical_skills" value={formData.technical_skills} onChange={handleInputChange} placeholder="e.g., React, Node.js, AWS" className="w-full bg-gray-700 border border-gray-600 rounded-md py-2 px-3 text-white" />
              </div>
            </div>
            <div>
              <label className="block text-gray-300 mb-2 flex items-center">
                <FileText size={16} className="mr-2" /> Soft Skills
              </label>
              <input type="text" name="soft_skills" value={formData.soft_skills} onChange={handleInputChange} placeholder="e.g., communication, leadership" className="w-full bg-gray-700 border border-gray-600 rounded-md py-2 px-3 text-white" />
            </div>
            {/* Number of Questions & Marks */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-gray-300 mb-2">Number of Questions</label>
                <input type="number" name="num_questions" value={formData.num_questions} onChange={handleInputChange} className="w-full bg-gray-700 border border-gray-600 rounded-md py-2 px-3 text-white" min="1" required />
              </div>
              <div>
                <label className="block text-gray-300 mb-2">
                  Marks per Question <span className="text-gray-400 text-sm ml-2">(AI will generate questions based on these marks)</span>
                </label>
                {formData.marks.map((mark, index) => (
                  <div key={index} className="flex items-center mb-2">
                    <input type="number" value={mark} onChange={(e) => handleMarksChange(index, e.target.value)} className="w-full bg-gray-700 border border-gray-600 rounded-md py-2 px-3 text-white" min="1" required />
                    <button type="button" onClick={() => removeMarksField(index)} className="ml-2 text-red-400 hover:text-red-300" disabled={formData.marks.length <= 1}>
                      <Minus size={20} />
                    </button>
                  </div>
                ))}
                <button type="button" onClick={addMarksField} className="flex items-center text-purple-400 hover:text-purple-300 mt-2">
                  <Plus size={16} className="mr-1" /> Add another mark value
                </button>
                <div className="mt-2 text-sm text-gray-300">Total Marks: {totalMarks}</div>
              </div>
            </div>
            <div>
              <label className="block text-gray-300 mb-2">Job Description</label>
              <textarea name="job_description" value={formData.job_description} onChange={handleInputChange} rows={4} className="w-full bg-gray-700 border border-gray-600 rounded-md py-2 px-3 text-white" required placeholder="Provide a detailed job description..." ></textarea>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-gray-300 mb-2 flex items-center">
                  <Clock size={16} className="mr-2" /> Total Time (minutes)
                </label>
                <input type="number" name="total_time" value={formData.total_time} onChange={handleInputChange} min="5" max="120" className="w-full bg-gray-700 border border-gray-600 rounded-md py-2 px-3 text-white" required />
              </div>
              <div className="flex flex-col justify-end">
                <div className="flex items-center mb-3">
                  <input type="checkbox" id="manager_approval" name="manager_approval" checked={formData.manager_approval} onChange={handleCheckboxChange} className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded" />
                  <label htmlFor="manager_approval" className="ml-2 block text-gray-300">Requires Manager Approval</label>
                </div>
                <div className="flex items-center">
                  <input type="checkbox" id="compulsory" name="compulsory" checked={formData.compulsory} onChange={handleCheckboxChange} className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded" />
                  <label htmlFor="compulsory" className="ml-2 block text-gray-300">Compulsory Interview</label>
                </div>
              </div>
            </div>
            <div className="flex justify-end">
              <button type="submit" disabled={isSubmitting} className={`bg-blue-600 hover:bg-blue-700 text-white py-2 px-6 rounded-md font-medium flex items-center ${isSubmitting ? 'opacity-70 cursor-not-allowed' : ''}`}>
                {isSubmitting ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Processing...
                  </>
                ) : (
                  <>Preview Interview</>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  // Custom Interview Form – Manual Q&A entry
  if (interviewType === 'custom') {
    return (
      <div className="min-h-screen bg-gray-900 text-white p-6">
        <button onClick={goBack} className="flex items-center text-gray-300 hover:text-white mb-6">
          <ArrowLeft size={20} className="mr-2" /> Back to selection
        </button>
        <div className="max-w-3xl mx-auto bg-gray-800 rounded-lg p-8 shadow-lg">
          <h1 className="text-2xl font-bold mb-6 flex items-center">
            <User size={24} className="text-blue-400 mr-2" /> Create Custom Interview
          </h1>
          <form onSubmit={handlePreview} className="space-y-6">
            {/* Job Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-gray-300 mb-2 flex items-center">
                  <Briefcase size={16} className="mr-2" /> Job ID
                </label>
                <input type="number" name="job_id" value={formData.job_id} onChange={handleInputChange} className="w-full bg-gray-700 border border-gray-600 rounded-md py-2 px-3 text-white" required />
              </div>
              <div>
                <label className="block text-gray-300 mb-2 flex items-center">
                  <Building size={16} className="mr-2" /> Company ID
                </label>
                <input type="text" name="company_id" value={formData.company_id} onChange={handleInputChange} className="w-full bg-gray-700 border border-gray-600 rounded-md py-2 px-3 text-white" required />
              </div>
            </div>
            <div>
              <label className="block text-gray-300 mb-2 flex items-center">
                <Award size={16} className="mr-2" /> Job Title
              </label>
              <input type="text" name="job_title" value={formData.job_title} onChange={handleInputChange} className="w-full bg-gray-700 border border-gray-600 rounded-md py-2 px-3 text-white" required />
            </div>
            <div>
              <label className="block text-gray-300 mb-2 flex items-center">
                <Award size={16} className="mr-2" /> Experience Level
              </label>
              <input type="text" name="experience" value={formData.experience} onChange={handleInputChange} placeholder="e.g., 3 years, Entry Level, Senior" className="w-full bg-gray-700 border border-gray-600 rounded-md py-2 px-3 text-white" required />
            </div>
            <div>
              <label className="block text-gray-300 mb-2 flex items-center">
                <FileText size={16} className="mr-2" /> Job Description
              </label>
              <textarea name="job_description" value={formData.job_description} onChange={handleInputChange} rows={4} className="w-full bg-gray-700 border border-gray-600 rounded-md py-2 px-3 text-white" required></textarea>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-gray-300 mb-2 flex items-center">
                  <Clock size={16} className="mr-2" /> Total Time (minutes)
                </label>
                <input type="number" name="total_time" value={formData.total_time} onChange={handleInputChange} min="5" max="120" className="w-full bg-gray-700 border border-gray-600 rounded-md py-2 px-3 text-white" required />
              </div>
              <div className="flex flex-col justify-end">
                <div className="flex items-center mb-3">
                  <input type="checkbox" id="manager_approval" name="manager_approval" checked={formData.manager_approval} onChange={handleCheckboxChange} className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded" />
                  <label htmlFor="manager_approval" className="ml-2 block text-gray-300">Requires Manager Approval</label>
                </div>
                <div className="flex items-center">
                  <input type="checkbox" id="compulsory" name="compulsory" checked={formData.compulsory} onChange={handleCheckboxChange} className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded" />
                  <label htmlFor="compulsory" className="ml-2 block text-gray-300">Compulsory Interview</label>
                </div>
              </div>
            </div>
            <div>
              <label className="block text-gray-300 mb-2">Marks per Question</label>
              {formData.marks.map((mark, index) => (
                <div key={index} className="flex items-center mb-2">
                  <input type="number" value={mark} onChange={(e) => handleMarksChange(index, e.target.value)} className="w-full bg-gray-700 border border-gray-600 rounded-md py-2 px-3 text-white" min="1" required />
                  <button type="button" onClick={() => removeMarksField(index)} className="ml-2 text-red-400 hover:text-red-300" disabled={formData.marks.length <= 1}>
                    <Minus size={20} />
                  </button>
                </div>
              ))}
              <button type="button" onClick={addMarksField} className="flex items-center text-purple-400 hover:text-purple-300 mt-2">
                <Plus size={16} className="mr-1" /> Add another mark value
              </button>
              <div className="mt-2 text-sm text-gray-300">Total Marks: {totalMarks}</div>
            </div>
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-gray-300">Questions and Answers</label>
                <div className="text-sm text-gray-400">{formData.questions.length} question(s)</div>
              </div>
              {formData.questions.map((q, index) => (
                <div key={index} className="mb-6 p-4 bg-gray-700 rounded-md border border-gray-600">
                  <div className="flex justify-between items-center mb-3">
                    <h3 className="font-medium text-blue-300">Question {index + 1}</h3>
                    <button type="button" onClick={() => removeQuestionField(index)} className="text-red-400 hover:text-red-300" disabled={formData.questions.length <= 1}>
                      <Minus size={18} />
                    </button>
                  </div>
                  <div className="mb-3">
                    <label className="block text-gray-300 mb-1 text-sm">Question Text</label>
                    <textarea value={q.question} onChange={(e) => handleQuestionChange(index, 'question', e.target.value)} rows={2} className="w-full bg-gray-800 border border-gray-600 rounded-md py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500" required></textarea>
                  </div>
                  <div>
                    <label className="block text-gray-300 mb-1 text-sm">Expected Answer</label>
                    <textarea value={q.answer} onChange={(e) => handleQuestionChange(index, 'answer', e.target.value)} rows={3} className="w-full bg-gray-800 border border-gray-600 rounded-md py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500" required></textarea>
                  </div>
                </div>
              ))}
              <button type="button" onClick={addQuestionField} className="flex items-center text-blue-400 hover:text-blue-300 mt-2">
                <Plus size={16} className="mr-1" /> Add another question
              </button>
            </div>
            <div className="flex justify-end">
              <button type="submit" disabled={isSubmitting} className={`bg-blue-600 hover:bg-blue-700 text-white py-2 px-6 rounded-md font-medium flex items-center ${isSubmitting ? 'opacity-70 cursor-not-allowed' : ''}`}>
                {isSubmitting ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Processing...
                  </>
                ) : (
                  <>Preview Interview</>
                )}
              </button>
            </div>
          </form>
      </div>
    </div>
  );
}
}
export default InterviewMaker;

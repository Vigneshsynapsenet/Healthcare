import React, { useState } from 'react';
import { Stethoscope, Globe, Mail } from 'lucide-react';
import { BackgroundMountains } from './BackgroundMountains';

interface FormData {
  url: string;
  email: string;
}

interface LandingPageProps {
  onAnalyze: (formData: FormData) => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onAnalyze }) => {
  const [formData, setFormData] = useState<FormData>({
    url: '',
    email: '',
  });
  const [agreed, setAgreed] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAnalyze(formData);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#E6F3FF] to-white relative overflow-hidden">
      <BackgroundMountains />
      
      <div className="relative z-10 max-w-6xl mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-gray-800 mb-4">Digital Health Score</h1>
          <p className="text-xl text-gray-600">Evaluate your healthcare website's digital vitality</p>
        </div>

        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
          <div className="flex flex-col md:flex-row">
            <div className="w-full md:w-1/2 p-8 md:p-12">
              <div className="flex items-center gap-2 mb-6">
                <Stethoscope className="w-8 h-8 text-blue-600" />
                <h2 className="text-3xl font-bold text-gray-800">Website Analysis</h2>
              </div>
              <p className="text-gray-600 mb-8">
                Get a comprehensive analysis of your healthcare website's digital presence and patient experience features.
              </p>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Company Email</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      id="email"
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="pl-10 w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="your@company.com"
                      required
                    />
                  </div>
                </div>
                <div>
                  <label htmlFor="url" className="block text-sm font-medium text-gray-700 mb-1">Website URL</label>
                  <div className="relative">
                    <Globe className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      id="url"
                      type="url"
                      name="url"
                      value={formData.url}
                      onChange={handleInputChange}
                      className="pl-10 w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="https://example.com"
                      required
                    />
                  </div>
                </div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="agree"
                    checked={agreed}
                    onChange={(e) => setAgreed(e.target.checked)}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    required
                  />
                  <label htmlFor="agree" className="ml-2 block text-sm text-gray-600">
                    Help me build a digital health website
                  </label>
                </div>
                <button
                  type="submit"
                  className="w-full bg-blue-600 text-white rounded-lg py-3 px-6 hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
                >
                  Analyze Website
                </button>
              </form>
            </div>
            
            <div className="w-full md:w-1/2 bg-gradient-to-br from-blue-50 to-blue-100 p-8 md:p-12 flex items-center justify-center">
              <img
                src="https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
                alt="Healthcare Analytics"
                className="rounded-lg shadow-lg max-w-full h-auto"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
import React from 'react';
import { Users, Globe, Gauge, Share2, ArrowLeft } from 'lucide-react';
import type { WebsiteAnalysis } from '../types';
import { BackgroundMountains } from './BackgroundMountains';
import { getWittyComment } from '../utils/comments';

interface ResultsPageProps {
  analysis: WebsiteAnalysis | null;
  onNewAnalysis: () => void;
  onShare: () => void;
}

interface ScoreCardProps {
  title: string;
  score: number;
  icon: React.ElementType;
  children: React.ReactNode;
}

interface FeatureItemProps {
  title: string;
  present: boolean;
}

const ScoreCard: React.FC<ScoreCardProps> = ({ title, score, icon: Icon, children }) => (
  <div className="bg-white rounded-lg shadow-lg p-6">
    <div className="flex items-center justify-between mb-4">
      <div className="flex items-center space-x-3">
        <Icon className="text-blue-600" />
        <h3 className="text-xl font-semibold">{title}</h3>
      </div>
      <div className="flex items-center space-x-2">
        <span className="text-2xl font-bold text-blue-600">{score.toFixed(1)}</span>
        <span className="text-gray-500">/10</span>
      </div>
    </div>
    <div className="space-y-4">
      {children}
    </div>
  </div>
);

const FeatureItem: React.FC<FeatureItemProps> = ({ title, present }) => (
  <div className="flex items-center justify-between">
    <span className="text-gray-700">{title}</span>
    <span className={`px-2 py-1 rounded-full text-sm ${present ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
      {present ? 'Available' : 'Not detected'}
    </span>
  </div>
);

export const ResultsPage: React.FC<ResultsPageProps> = ({ analysis, onNewAnalysis, onShare }) => {
  if (!analysis) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#E6F3FF] to-white flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-lg">
          <p className="text-xl text-gray-800">No analysis results available</p>
          <button
            onClick={onNewAnalysis}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Start New Analysis
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#E6F3FF] to-white relative overflow-hidden">
      <BackgroundMountains />
      
      <div className="relative z-10 max-w-5xl mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <button
            onClick={onNewAnalysis}
            className="flex items-center gap-2 text-blue-600 hover:text-blue-700 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            New Analysis
          </button>
          
          <button
            onClick={onShare}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Share2 className="w-5 h-5" />
            Share Analysis
          </button>
        </div>

        <h1 className="text-4xl font-bold text-center text-gray-800 mb-4">
          Analysis Results
        </h1>
        
        <p className="text-center text-gray-600 mb-8">
          Analysis for: <span className="font-semibold">{analysis.url}</span>
          <br />
          <span className="text-sm">
            Generated on: {new Date(analysis.timestamp).toLocaleString()}
          </span>
        </p>
        
        {analysis.error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-8 text-red-600">
            {analysis.error}
          </div>
        )}

        {!analysis.loading && !analysis.error && (
          <div className="space-y-8">
            <div className="bg-white rounded-lg shadow-lg p-6 text-center">
              <h2 className="text-2xl font-bold mb-2">Overall Score</h2>
              <div className="text-5xl font-bold text-blue-600 mb-4">
                {analysis.overallScore.toFixed(1)}<span className="text-2xl text-gray-500">/10</span>
              </div>
              <p className="text-gray-700 italic">{getWittyComment(analysis.overallScore)}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <ScoreCard title="Patient Experience" score={analysis.patientExperience.score} icon={Users}>
                <FeatureItem title="Doctor Search" present={analysis.patientExperience.doctorSearch} />
                <FeatureItem title="Video Consultation" present={analysis.patientExperience.videoConsultation} />
                <FeatureItem title="Online Payment" present={analysis.patientExperience.onlinePayment} />
                <FeatureItem title="Chatbot" present={analysis.patientExperience.chatbot} />
                <FeatureItem title="Helpline" present={analysis.patientExperience.helpline} />
              </ScoreCard>

              <ScoreCard title="Digital Presence" score={analysis.digitalPresence.score} icon={Globe}>
                <FeatureItem title="Instagram" present={analysis.digitalPresence.socialMedia.instagram} />
                <FeatureItem title="Facebook" present={analysis.digitalPresence.socialMedia.facebook} />
                <FeatureItem title="YouTube" present={analysis.digitalPresence.socialMedia.youtube} />
              </ScoreCard>

              <ScoreCard title="Website Performance" score={analysis.websitePerformance.score} icon={Gauge}>
                <FeatureItem title="Mobile Responsive" present={analysis.websitePerformance.responsive} />
                {analysis.websitePerformance.loadTime && (
                  <div className="flex items-center justify-between">
                    <span className="text-gray-700">Load Time</span>
                    <span className="px-2 py-1 rounded-full text-sm bg-blue-100 text-blue-800">
                      {(analysis.websitePerformance.loadTime / 1000).toFixed(2)}s
                    </span>
                  </div>
                )}
              </ScoreCard>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
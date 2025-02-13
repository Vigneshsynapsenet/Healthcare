import React, { useState, useEffect } from 'react';
import type { WebsiteAnalysis } from './types';
import axios from 'axios';
import { parse } from 'node-html-parser';
import { LandingPage } from './components/LandingPage';
import { ResultsPage } from './components/ResultsPage';

interface FormData {
  url: string;
  email: string;
}

const generateAnalysisId = (url: string): string => {
  const timestamp = Date.now();
  const urlSlug = url
    .replace(/^https?:\/\//, '')
    .replace(/[^a-zA-Z0-9]/g, '-')
    .toLowerCase();
  return `${urlSlug}-${timestamp}`;
};

const calculateScores = (analysis: Partial<WebsiteAnalysis>): { patientScore: number; digitalScore: number; performanceScore: number; overall: number } => {
  const patientFeatures = [
    analysis.patientExperience?.doctorSearch,
    analysis.patientExperience?.videoConsultation,
    analysis.patientExperience?.onlinePayment,
    analysis.patientExperience?.chatbot,
    analysis.patientExperience?.helpline,
  ];
  const patientScore = (patientFeatures.filter(Boolean).length / patientFeatures.length) * 10;

  const socialMediaCount = [
    analysis.digitalPresence?.socialMedia.instagram,
    analysis.digitalPresence?.socialMedia.facebook,
    analysis.digitalPresence?.socialMedia.youtube,
  ].filter(Boolean).length;
  const digitalScore = (socialMediaCount / 3) * 10;

  // Calculate performance score using Lighthouse metrics
  const lighthouse = analysis.websitePerformance?.lighthouse;
  const lighthouseScore = lighthouse
    ? (lighthouse.performance + lighthouse.accessibility + lighthouse.bestPractices + lighthouse.seo) / 40 // Convert to 0-10 scale
    : 0;
  
  const responsiveScore = analysis.websitePerformance?.responsive ? 10 : 5;
  const performanceScore = lighthouse ? (lighthouseScore * 0.7 + responsiveScore * 0.3) : responsiveScore;

  const overall = Math.round(((patientScore + digitalScore + performanceScore) / 30) * 10);

  return { patientScore, digitalScore, performanceScore, overall };
};

function App() {
  const [analysis, setAnalysis] = useState<WebsiteAnalysis | null>(null);
  const [showResults, setShowResults] = useState(false);
  const [shareUrl, setShareUrl] = useState<string>('');

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const analysisId = urlParams.get('id');
    
    if (analysisId) {
      const savedAnalysis = localStorage.getItem(`analysis_${analysisId}`);
      if (savedAnalysis) {
        setAnalysis(JSON.parse(savedAnalysis));
        setShowResults(true);
      }
    }
  }, []);

  const handleAnalyze = async (formData: FormData) => {
    const analysisId = generateAnalysisId(formData.url);
    const timestamp = new Date().toISOString();

    const initialAnalysis: WebsiteAnalysis = {
      id: analysisId,
      url: formData.url,
      timestamp,
      patientExperience: {
        doctorSearch: false,
        videoConsultation: false,
        onlinePayment: false,
        chatbot: false,
        helpline: false,
        score: 0
      },
      digitalPresence: {
        googleReviews: {
          rating: null,
          count: null,
        },
        socialMedia: {
          instagram: false,
          facebook: false,
          youtube: false,
        },
        score: 0
      },
      websitePerformance: {
        loadTime: null,
        responsive: false,
        lighthouse: null,
        score: 0
      },
      overallScore: 0,
      loading: true,
      error: null,
    };

    setAnalysis(initialAnalysis);
    setShowResults(true);

    try {
      const startTime = performance.now();
      const response = await axios.post('http://localhost:3000/analyze', { url: formData.url });
      const loadTime = performance.now() - startTime;
      const root = parse(response.data.data);

      const pageText = root.textContent.toLowerCase();
      const links = root.querySelectorAll('a').map(a => a.getAttribute('href')?.toLowerCase() || '');

      const updatedAnalysis: WebsiteAnalysis = {
        ...initialAnalysis,
        patientExperience: {
          doctorSearch: [
            "find a doctor", "find doctor", "select doctor", "look for a doctor", 
            "search for a doctor", "find a physician", "physician directory", 
            "doctor directory", "book an appointment with a doctor", 
            "schedule a consultation with a doctor", "find a specialist", 
            "locate a healthcare provider", "search medical professionals"
          ].some(phrase => pageText.includes(phrase)) || 
          links.some(l => ["doctor", "physician","our doctors","doctors"].some(keyword => l.includes(keyword))),

          videoConsultation: [
            "video consultation", "virtual consultation", "teleconsultation", 
            "telemedicine appointment", "virtual doctor visit", 
            "online doctor consultation", "consult a doctor online", 
            "schedule a video visit", "e-health consultation", 
            "remote healthcare service","booking an appointment", "schedule appointment","book appointment"
          ].some(phrase => pageText.includes(phrase)),

          onlinePayment: [
            "pay online", "make a payment", "online payment", 
            "secure payment portal", "pay medical bill", "bill payment online", 
            "hospital payment gateway", "healthcare payment portal", 
            "settle medical bills online", "process payment securely"
          ].some(phrase => pageText.includes(phrase)) || 
          links.some(l => l.includes("payment")),

          chatbot: [
            "chat with us", "virtual assistant", "AI chatbot", 
            "automated chat support", "chat now", "ask our chatbot", 
            "talk to our assistant", "get instant answers", 
            "live chat support", "AI-powered chat assistant"
          ].some(phrase => pageText.includes(phrase)) || 
          root.querySelector('#chatbot') !== null,

          helpline: [
            "call us", "emergency contact", "24/7 support line", 
            "hospital contact number", "medical helpline", "patient support line", 
            "reach us at", "customer care number", "talk to a representative", 
            "get in touch with us"
          ].some(phrase => pageText.includes(phrase)) || 
          pageText.match(/\+\d[\d\s-]{8,}/g) !== null,

          score: 0
        },
        
        digitalPresence: {
          googleReviews: {
            rating: null,
            count: null,
          },
          
          socialMedia: {
            instagram: links.some(l => 
              ["instagram.com", "follow us on Instagram", "Instagram handle", 
               "our Instagram page", "check our Instagram updates"].some(phrase => l.includes(phrase))
            ),

            facebook: links.some(l => 
              ["facebook.com", "like us on Facebook", "visit our Facebook page", 
               "connect with us on Facebook", "Facebook community"].some(phrase => l.includes(phrase))
            ),

            youtube: links.some(l => 
              ["youtube.com", "watch our videos on YouTube", "subscribe to our YouTube channel", 
               "see our latest YouTube videos", "healthcare videos on YouTube"].some(phrase => l.includes(phrase))
            ),
          },
          
          score: 0
        },
        websitePerformance: {
          loadTime: loadTime,
          responsive: root.querySelector('meta[name="viewport"]') !== null,
          lighthouse: response.data.lighthouse,
          score: 0
        },
        loading: false,
        error: null,
      };

      const scores = calculateScores(updatedAnalysis);
      updatedAnalysis.patientExperience.score = scores.patientScore;
      updatedAnalysis.digitalPresence.score = scores.digitalScore;
      updatedAnalysis.websitePerformance.score = scores.performanceScore;
      updatedAnalysis.overallScore = scores.overall;

      localStorage.setItem(`analysis_${analysisId}`, JSON.stringify(updatedAnalysis));
      
      const newUrl = `${window.location.origin}${window.location.pathname}?id=${analysisId}`;
      window.history.pushState({ path: newUrl }, '', newUrl);
      setShareUrl(newUrl);

      setAnalysis(updatedAnalysis);
    } catch (error) {
      setAnalysis({
        ...initialAnalysis,
        loading: false,
        error: 'Failed to analyze website. Please check the URL and try again.',
      });
    }
  };

  const handleNewAnalysis = () => {
    setShowResults(false);
    setAnalysis(null);
    window.history.pushState({}, '', window.location.pathname);
  };

  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      alert('Analysis URL copied to clipboard!');
    } catch (err) {
      console.error('Failed to copy URL:', err);
    }
  };

  return showResults ? (
    <ResultsPage
      analysis={analysis}
      onNewAnalysis={handleNewAnalysis}
      onShare={handleShare}
    />
  ) : (
    <LandingPage onAnalyze={handleAnalyze} />
  );
}

export default App;
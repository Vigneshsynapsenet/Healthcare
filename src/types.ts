export interface WebsiteAnalysis {
  id: string;
  url: string;
  timestamp: string;
  patientExperience: {
    doctorSearch: boolean;
    videoConsultation: boolean;
    onlinePayment: boolean;
    chatbot: boolean;
    helpline: boolean;
    score: number;
  };
  digitalPresence: {
    googleReviews: {
      rating: number | null;
      count: number | null;
    };
    socialMedia: {
      instagram: boolean;
      facebook: boolean;
      youtube: boolean;
    };
    score: number;
  };
  websitePerformance: {
    loadTime: number | null;
    responsive: boolean;
    lighthouse: {
      performance: number;
      accessibility: number;
      bestPractices: number;
      seo: number;
    } | null;
    score: number;
  };
  overallScore: number;
  loading: boolean;
  error: string | null;
}
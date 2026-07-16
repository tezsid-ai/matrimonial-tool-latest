export const FALLBACK_INSIGHTS = {
  strengths: [
    "Strong self-awareness and emotional intelligence",
    "Open communication style with your partner",
    "Clear values alignment on family and finances",
  ],
  growthAreas: [
    "Developing stress management techniques together",
    "Building deeper conflict resolution skills",
    "Aligning long-term career expectations",
  ],
  discussionAreas: [
    "Specific financial goals and timeline",
    "Expectations regarding extended family involvement",
    "Career relocation possibilities",
  ],
  risks: {
    level: "low" as const,
    items: [
      "Minor differences in spending habits — manageable with ongoing communication",
    ],
  },
  recommendations: [
    { text: "Schedule a monthly 'state of us' conversation", checked: false },
    { text: "Meet with a financial planner together", checked: false },
    { text: "Discuss boundaries with extended families", checked: false },
    { text: "Read a book on communication together", checked: false },
    { text: "Consider pre-marital counseling", checked: false },
  ],
};

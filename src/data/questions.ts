import { Question } from "@/components/steps/step2/QuestionCard";

export const QUESTIONS: Record<string, Question[]> = {
  personal: [
    {
      id: "personal-1",
      type: "slider",
      text: "How well do you understand your own emotional triggers and patterns?",
      minLabel: "Still learning",
      maxLabel: "Very aware",
    },
    {
      id: "personal-2",
      type: "single-select",
      text: "How do you typically handle stress?",
      options: [
        { value: "withdraw", label: "Withdraw/Need space" },
        { value: "seek-support", label: "Seek support from others" },
        { value: "problem-solve", label: "Focus on solving the problem" },
        { value: "express", label: "Express emotions openly" },
      ],
    },
    {
      id: "personal-3",
      type: "multi-select",
      text: "What personal habits are you working on improving?",
      options: [
        { value: "communication", label: "Communication" },
        { value: "patience", label: "Patience" },
        { value: "finances", label: "Financial management" },
        { value: "health", label: "Health/self-care" },
        { value: "work-life", label: "Work-life balance" },
      ],
    },
  ],
  family: [
    {
      id: "family-1",
      type: "single-select",
      text: "How involved is your family in major life decisions?",
      options: [
        { value: "very-involved", label: "Very involved" },
        { value: "somewhat", label: "Somewhat involved" },
        { value: "consult", label: "I consult them" },
        { value: "independent", label: "I decide independently" },
      ],
    },
    {
      id: "family-2",
      type: "slider",
      text: "How aligned are your family's expectations with your partner's family's expectations?",
      minLabel: "Very different",
      maxLabel: "Highly aligned",
    },
    {
      id: "family-3-religion",
      type: "single-select",
      text: "Do you and your partner share the same religious/cultural beliefs and practices?",
      options: [
        { value: "same", label: "Yes, exactly the same" },
        { value: "similar", label: "Similar but some differences" },
        { value: "different", label: "Quite different" },
        { value: "not-applicable", label: "Not applicable to us" },
      ],
    },
  ],
  financial: [
    {
      id: "financial-1",
      type: "single-select",
      text: "Have you discussed your current financial situation openly with your partner?",
      options: [
        { value: "full", label: "Full disclosure" },
        { value: "partial", label: "Partial disclosure" },
        { value: "general", label: "General idea only" },
        { value: "not-yet", label: "Not yet discussed" },
      ],
    },
    {
      id: "financial-2",
      type: "slider",
      text: "How aligned are you on spending and saving habits?",
      minLabel: "Very different",
      maxLabel: "Highly aligned",
    },
    {
      id: "financial-3",
      type: "multi-select",
      text: "What financial goals have you discussed together?",
      options: [
        { value: "home", label: "Buying a home" },
        { value: "children", label: "Saving for children" },
        { value: "retirement", label: "Retirement planning" },
        { value: "debt", label: "Paying off debt" },
        { value: "business", label: "Starting a business" },
        { value: "none", label: "Haven't discussed goals" },
      ],
    },
  ],
  career: [
    {
      id: "career-1",
      type: "single-select",
      text: "How might marriage affect your career priorities?",
      options: [
        { value: "no-change", label: "No change expected" },
        { value: "balance", label: "Need better work-life balance" },
        { value: "relocate", label: "May need to relocate" },
        { value: "reevaluate", label: "Reevaluating career path" },
      ],
    },
    {
      id: "career-2",
      type: "slider",
      text: "How supportive is your partner of your career ambitions?",
      minLabel: "Not supportive",
      maxLabel: "Very supportive",
    },
  ],
  relationship: [
    {
      id: "relationship-1",
      type: "slider",
      text: "How comfortable are you expressing disagreement with your partner?",
      minLabel: "Very uncomfortable",
      maxLabel: "Very comfortable",
    },
    {
      id: "relationship-2",
      type: "single-select",
      text: "How do you typically resolve conflicts?",
      options: [
        { value: "discuss", label: "Discuss until resolved" },
        { value: "cool-off", label: "Cool off first, then discuss" },
        { value: "avoid", label: "Avoid/let it pass" },
        { value: "mediator", label: "Seek help from others" },
      ],
    },
    {
      id: "relationship-3",
      type: "multi-select",
      text: "What relationship topics have you thoroughly discussed?",
      options: [
        { value: "children", label: "Having children" },
        { value: "finances", label: "Money management" },
        { value: "career", label: "Career changes" },
        { value: "living", label: "Where to live" },
        { value: "in-laws", label: "In-law relationships" },
        { value: "intimacy", label: "Intimacy expectations" },
      ],
    },
  ],
  values: [
    {
      id: "values-1",
      type: "slider",
      text: "How aligned are your core values with your partner's?",
      minLabel: "Very different",
      maxLabel: "Highly aligned",
    },
    {
      id: "values-2",
      type: "single-select",
      text: "What matters most to you in a marriage?",
      options: [
        { value: "partnership", label: "Partnership/Teamwork" },
        { value: "growth", label: "Personal growth together" },
        { value: "security", label: "Security/Stability" },
        { value: "companionship", label: "Companionship" },
      ],
    },
  ],
  health: [
    {
      id: "health-1",
      type: "single-select",
      text: "Have you discussed health histories and any ongoing conditions?",
      options: [
        { value: "full", label: "Full disclosure" },
        { value: "partial", label: "Some discussion" },
        { value: "general", label: "General awareness" },
        { value: "not-yet", label: "Not yet discussed" },
      ],
    },
    {
      id: "health-2",
      type: "slider",
      text: "How important is physical health and wellness in your lifestyle?",
      minLabel: "Not important",
      maxLabel: "Very important",
    },
  ],
};

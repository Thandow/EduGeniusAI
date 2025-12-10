import { ContentTemplate, TemplateConfig, GenerationParams, SampleContent, PromptComparison, Complexity, ContentLength } from './types';

export const GEMINI_MODEL = 'gemini-2.5-flash';
export const GEMINI_IMAGE_MODEL = 'gemini-2.5-flash-image';

// Pricing approximation for Gemini Flash (example rates, verify with actuals)
export const COST_PER_1K_INPUT = 0.00001; 
export const COST_PER_1K_OUTPUT = 0.00002;

export const TEMPLATES: Record<ContentTemplate, TemplateConfig> = {
  [ContentTemplate.LESSON_PLAN]: {
    id: ContentTemplate.LESSON_PLAN,
    label: 'Lesson Plan',
    description: 'A structured lesson plan with objectives, materials, and procedures.',
    systemPrompt: 'You are an expert curriculum developer. Create comprehensive, standards-aligned lesson plans.',
    userPromptTemplate: (p: GenerationParams) => `
      Create a ${p.length} lesson plan for ${p.gradeLevel} students on the subject of ${p.subject}.
      Topic: ${p.topic}.
      Complexity: ${p.complexity}.
      
      Structure required:
      1. Learning Objectives (SWBAT)
      2. Materials Needed
      3. Key Vocabulary
      4. Direct Instruction (Step-by-Step)
      5. Guided Practice
      6. Assessment/Check for Understanding
      
      ${p.additionalInstructions ? `Additional Instructions: ${p.additionalInstructions}` : ''}
    `
  },
  [ContentTemplate.STUDY_GUIDE]: {
    id: ContentTemplate.STUDY_GUIDE,
    label: 'Study Guide',
    description: 'A detailed summary of key concepts, definitions, and review questions.',
    systemPrompt: 'You are an academic tutor. Create clear, concise, and accurate study guides.',
    userPromptTemplate: (p: GenerationParams) => `
      Generate a ${p.length} study guide for ${p.gradeLevel} students studying ${p.subject}.
      Topic: ${p.topic}.
      Difficulty: ${p.complexity}.
      
      Include:
      - Key Concept Summaries
      - Important Definitions
      - Critical Dates/Formulas (if applicable)
      - Common Misconceptions
      - 5 Practice Questions with Answers hidden at the bottom
      
      ${p.additionalInstructions ? `Additional Instructions: ${p.additionalInstructions}` : ''}
    `
  },
  [ContentTemplate.QUIZ]: {
    id: ContentTemplate.QUIZ,
    label: 'Quiz Generator',
    description: 'Multiple choice questions with an answer key.',
    systemPrompt: 'You are an assessment specialist. Create clear, fair, and accurate multiple-choice questions.',
    userPromptTemplate: (p: GenerationParams) => `
      Create a multiple-choice quiz about ${p.topic} for ${p.gradeLevel} ${p.subject} students.
      Difficulty: ${p.complexity}.
      Length: ${p.length === 'Short' ? '5 questions' : p.length === 'Medium' ? '10 questions' : '15 questions'}.
      
      Format:
      - Number each question.
      - Provide 4 options (A, B, C, D).
      - Include an "Answer Key" section at the very end.
      ${p.includeExplanations ? '- Include brief explanations for the correct answers in the key.' : ''}
      
      ${p.additionalInstructions ? `Additional Instructions: ${p.additionalInstructions}` : ''}
    `
  },
  [ContentTemplate.FLASHCARDS]: {
    id: ContentTemplate.FLASHCARDS,
    label: 'Flashcards',
    description: 'A list of terms and definitions suitable for importing into study apps.',
    systemPrompt: 'You are a study aid creator. Focus on clear, memorable definitions.',
    userPromptTemplate: (p: GenerationParams) => `
      Generate a list of flashcards for ${p.topic} in ${p.subject} (${p.gradeLevel}).
      Complexity: ${p.complexity}.
      Quantity: ${p.length === 'Short' ? '10' : p.length === 'Medium' ? '20' : '30'} cards.
      
      Format strictly as:
      [Term] | [Definition]
      
      ${p.additionalInstructions ? `Additional Instructions: ${p.additionalInstructions}` : ''}
    `
  },
  [ContentTemplate.CONCEPT_SIMPLIFIER]: {
    id: ContentTemplate.CONCEPT_SIMPLIFIER,
    label: 'Concept Simplifier (ELI5)',
    description: 'Explain complex topics in simple, relatable terms with analogies.',
    systemPrompt: 'You are a skilled communicator who uses analogies to explain complex ideas simply.',
    userPromptTemplate: (p: GenerationParams) => `
      Explain the topic "${p.topic}" for a student in ${p.gradeLevel}.
      Subject: ${p.subject}.
      Goal: Make it extremely easy to understand.
      
      Use:
      1. A clear, simple definition.
      2. A real-world analogy.
      3. A "Why it matters" section.
      
      ${p.additionalInstructions ? `Additional Instructions: ${p.additionalInstructions}` : ''}
    `
  },
};

export const PROMPT_METHODOLOGY = `
# Prompt Engineering Methodology: The "Edu-Construct" Framework

This tool utilizes a specialized framework designed for educational content generation, focusing on five key pillars:

### 1. Persona Alignment
We assign a specific persona to the AI model based on the selected template.
*   **Lesson Plans**: "Expert Curriculum Developer"
*   **Study Guides**: "Academic Tutor"
*   **Quizzes**: "Assessment Specialist"
This ensures the tone and vocabulary align with professional educational standards.

### 2. Contextual Anchoring
Every prompt strictly defines:
*   **Target Audience**: (Grade Level) - Adjusts readability and cognitive load.
*   **Domain**: (Subject) - Activates domain-specific knowledge bases.
*   **Topic**: (User Input) - Focuses the generation.

### 3. Structural Constraints
Unlike open-ended chat, we inject rigid structural requirements (e.g., "Must include Learning Objectives", "Format as Term | Definition"). This minimizes hallucinations and ensures the output is immediately usable without heavy editing.

### 4. Complexity Calibration
The "Complexity" parameter modifies the depth of reasoning required by the model:
*   **Beginner**: Focuses on recall and basic understanding (Bloom's Taxonomy Levels 1-2).
*   **Intermediate**: Focuses on application and analysis (Bloom's Levels 3-4).
*   **Advanced**: Focuses on evaluation and synthesis (Bloom's Levels 5-6).

### 5. Safety & Input Filtering
To ensure educational suitability, our approach includes:
*   **Input Validation:** Restricting topic length to 200 characters to prevent "jailbreak" attempts via long context stuffing.
*   **Output Scanning:** Checking for refusal tokens or unsafe content before displaying results.
`;

export const SAMPLES: SampleContent[] = [
  {
    id: 'sample-lesson',
    title: 'Lesson Plan: Intro to Photosynthesis',
    description: 'A 45-minute middle school lesson with a leaf chromatography activity.',
    imageUrl: 'https://images.unsplash.com/photo-1502082553048-f009c37129b9?q=80&w=1000&auto=format&fit=crop',
    params: {
      topic: 'Photosynthesis',
      subject: 'Biology',
      gradeLevel: 'Middle School',
      template: ContentTemplate.LESSON_PLAN,
      complexity: Complexity.BEGINNER,
      length: ContentLength.MEDIUM
    },
    content: `# Lesson Plan: Photosynthesis - The Plant's Kitchen

**Grade Level:** Middle School  
**Subject:** Biology  
**Duration:** 45-60 Minutes

## 1. Learning Objectives (SWBAT)
*   Students will be able to **define** photosynthesis and identifying its inputs (sunlight, water, CO2) and outputs (glucose, oxygen).
*   Students will be able to **explain** the role of chlorophyll in capturing sunlight.
*   Students will **observe** pigments in leaves through a simple chromatography experiment.

## 2. Materials Needed
*   Spinach leaves
*   Coin (for rubbing leaves)
*   Filter paper strips
*   Rubbing alcohol (isopropyl)
*   Small clear cups
*   Pencils and tape
*   Whiteboard/Markers

## 3. Key Vocabulary
*   **Photosynthesis:** The process by which green plants use sunlight to synthesize foods from carbon dioxide and water.
*   **Chlorophyll:** A green pigment responsible for the absorption of light to provide energy for photosynthesis.
*   **Stomata:** Tiny pores in leaves where gas exchange occurs.

## 4. Direct Instruction
1.  **Hook (5 mins):** Ask students, "How do you eat lunch?" Then ask, "How does a tree eat lunch?"
2.  **Concept Intro (10 mins):** Draw a simple diagram of a plant. Arrow in: Sun, Water (roots), CO2 (leaves). Arrow out: Oxygen, Glucose (sugar).
3.  **The Equation (5 mins):** Write $6CO_2 + 6H_2O + Light \\rightarrow C_6H_{12}O_6 + 6O_2$. Simplify it: Carbon Dioxide + Water + Light = Sugar + Oxygen.

## 5. Guided Practice (Activity)
**Leaf Chromatography Lab (20 mins):**
1.  Students rub a spinach leaf with a coin onto a strip of filter paper (1 inch from bottom) until a dark green line appears.
2.  Tape the top of the paper to a pencil.
3.  Balance the pencil over a cup with a small amount of alcohol at the bottom (ensure the green line is *above* the liquid).
4.  Wait 10 minutes and observe colors separating (green chlorophyll, yellow xanthophylls).

## 6. Assessment
*   **Exit Ticket:** Write the "recipe" for photosynthesis using 3 ingredients and 2 products.
`
  },
  {
    id: 'sample-quiz',
    title: 'Quiz: Linear Equations',
    description: '10-question multiple choice quiz for Algebra I.',
    imageUrl: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?q=80&w=1000&auto=format&fit=crop',
    params: {
      topic: 'Linear Equations',
      subject: 'Math',
      gradeLevel: 'High School',
      template: ContentTemplate.QUIZ,
      complexity: Complexity.INTERMEDIATE,
      length: ContentLength.MEDIUM
    },
    content: `# Linear Equations Master Quiz

Test your knowledge on slope-intercept form and graphing.

### 1. What is the slope of the line given by the equation y = -3x + 7?
- A) 7
- B) -3
- C) 3
- D) -7

### 2. Which equation represents a line passing through the origin (0,0)?
- A) y = 2x + 1
- B) y = x - 5
- C) y = 4x
- D) y = 5

### 3. If a line rises 4 units for every 2 units it moves to the right, what is its slope?
- A) 1/2
- B) 4
- C) 2
- D) -2

---
### Answer Key

**1. B) -3**
*Explanation: In the form y = mx + b, 'm' is the slope.*

**2. C) y = 4x**
*Explanation: Lines passing through origin have a y-intercept (b) of 0.*

**3. C) 2**
*Explanation: Slope is Rise over Run. 4 divided by 2 is 2.*
`
  },
  {
    id: 'sample-flashcards',
    title: 'Flashcards: Spanish Verbs',
    description: 'Common irregular verbs for beginners.',
    imageUrl: 'https://images.unsplash.com/photo-1543783207-ec64e4d95325?q=80&w=1000&auto=format&fit=crop',
    params: {
      topic: 'Irregular Verbs',
      subject: 'Spanish',
      gradeLevel: 'High School',
      template: ContentTemplate.FLASHCARDS,
      complexity: Complexity.BEGINNER,
      length: ContentLength.SHORT
    },
    content: `Ser | To be (permanent characteristics/time/origin)
Estar | To be (temporary states/location/emotions)
Ir | To go
Tener | To have
Hacer | To do / To make
Poder | To be able to / Can
Decir | To say / To tell
Ver | To see
Dar | To give
Saber | To know (facts/information)`
  },
  {
    id: 'sample-study-guide',
    title: 'Study Guide: The American Revolution',
    description: 'Key events, influential figures, and causes leading to independence.',
    imageUrl: 'https://images.unsplash.com/photo-1552360434-6f77f8f9e0b1?q=80&w=1000&auto=format&fit=crop',
    params: {
      topic: 'The American Revolution',
      subject: 'History',
      gradeLevel: 'High School',
      template: ContentTemplate.STUDY_GUIDE,
      complexity: Complexity.INTERMEDIATE,
      length: ContentLength.MEDIUM
    },
    content: `# Study Guide: The American Revolution

**Subject:** US History
**Grade:** High School

## 1. Key Concept Summaries
*   **No Taxation Without Representation:** The core grievance of colonists. They believed only their own elected colonial assemblies could tax them, not the distant British Parliament.
*   **Salutary Neglect:** The unofficial British policy of avoiding strict enforcement of parliamentary laws, meant to keep American colonies obedient to England. Its end marked the start of tensions.

## 2. Important Definitions
*   **Loyalists (Tories):** Colonists who remained loyal to the British Crown.
*   **Patriots (Whigs):** Colonists who rejected British rule.
*   **Minutemen:** Militia members who vowed to be ready for battle in a minute's notice.

## 3. Critical Dates
*   **1773:** Boston Tea Party
*   **1775:** Battles of Lexington and Concord ("Shot heard 'round the world")
*   **1776:** Declaration of Independence signed
*   **1781:** Battle of Yorktown (British surrender)
*   **1783:** Treaty of Paris (Official end of war)

## 4. Practice Questions
1.  Why was the Battle of Saratoga considered the turning point of the war?
2.  Explain the significance of Thomas Paine's pamphlet *Common Sense*.
3.  What were the main weaknesses of the Articles of Confederation during the war?

> **Answers:** 
> 1. It convinced France to openly ally with the Americans. 
> 2. It argued for independence in simple language, swaying public opinion. 
> 3. The federal government couldn't tax or raise an army easily.`
  },
  {
    id: 'sample-eli5',
    title: 'ELI5: How Do Airplanes Fly?',
    description: 'Explaining lift and aerodynamics using simple spoon analogies.',
    imageUrl: 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?q=80&w=1000&auto=format&fit=crop',
    params: {
      topic: 'Aerodynamics (Lift)',
      subject: 'Physics',
      gradeLevel: 'Elementary',
      template: ContentTemplate.CONCEPT_SIMPLIFIER,
      complexity: Complexity.BEGINNER,
      length: ContentLength.SHORT
    },
    content: `# ELI5: How Do Airplanes Fly?

**Subject:** Physics
**Target:** 5th Grader

## 1. The Simple Definition
Airplanes stay in the sky because their wings are shaped in a special way that pushes air *down*. Since air is pushed down, the plane gets pushed *up*. This push is called **LIFT**.

## 2. The Real-World Analogy: "The Spoon Trick"
Imagine holding a spoon loosely by the handle.
*   Turn on a faucet so water runs smoothly.
*   Bring the curved back of the spoon near the water stream.
*   **What happens?** The spoon gets sucked *into* the water!

**Why?** The water curves around the spoon. In doing so, the spoon pushes the water a little bit. Newton's law says for every action, there is an equal and opposite reaction. So, the water pulls back on the spoon.

Airplane wings are curved on top just like that spoon. Air rushes over the curve, gets pulled down, and the wing gets pulled up!

## 3. Why It Matters
Without understanding this "push" (Lift), we couldn't build huge metal planes that carry hundreds of people across oceans. It's not magic; it's just air moving fast over a curved shape!`
  }
];

export const PROMPT_COMPARISONS: PromptComparison[] = [
  {
    id: 'comp-1',
    scenario: 'Lesson Plan Generation',
    insight: 'Structured prompting reduces hallucination and ensures pedagogical validity.',
    iterations: [
      {
        version: 'v1.0 (Naive)',
        promptSnippet: 'Write a lesson plan about the Civil War.',
        outcome: 'Produces a wall of text. Missing objectives. No clear timing. Often confuses grade levels.',
        qualityScore: 2
      },
      {
        version: 'v3.5 (EduGenie Final)',
        promptSnippet: 'Role: Curriculum Dev. Structure: 1. Objectives 2. Vocab 3. Direct Instruction 4. Guided Practice...',
        outcome: 'Professional formatting. Standards-aligned objectives (SWBAT). Clear, actionable steps for the teacher.',
        qualityScore: 5
      }
    ]
  },
  {
    id: 'comp-2',
    scenario: 'Quiz Generation',
    insight: 'Explicitly requesting structure (Answer Key, Options) ensures usability.',
    iterations: [
      {
        version: 'v1.0 (Naive)',
        promptSnippet: 'Make a quiz about Biology.',
        outcome: 'Sometimes generates open-ended questions. Sometimes True/False. Answers are often inline, spoiling the quiz.',
        qualityScore: 1
      },
      {
        version: 'v4.0 (Text Mode)',
        promptSnippet: 'Format: Number each question. Provide 4 options. Include Answer Key at end.',
        outcome: 'Clean, printable quiz with a separate key for grading.',
        qualityScore: 5
      }
    ]
  },
  {
    id: 'comp-3',
    scenario: 'Study Guide Generation',
    insight: 'Explicitly requesting a hierarchical structure (Concept -> Definition -> Practice) prevents information overload.',
    iterations: [
      {
        version: 'v1.0 (Naive)',
        promptSnippet: 'Create a study guide for Chemistry.',
        outcome: 'A disordered list of facts. No clear separation between core concepts and minor details. Hard to revise from.',
        qualityScore: 2
      },
      {
        version: 'v2.0 (EduGenie Final)',
        promptSnippet: 'Role: Academic Tutor. Include: Key Concept Summaries, Important Definitions, Critical Formulas...',
        outcome: 'Organized sections. Clear definitions. Practice questions included for active recall testing.',
        qualityScore: 5
      }
    ]
  },
  {
    id: 'comp-4',
    scenario: 'Concept Simplifier (ELI5)',
    insight: 'Forcing the model to use analogies ("The Spoon Trick") creates mental hooks that stick better than abstract definitions.',
    iterations: [
      {
        version: 'v1.0 (Naive)',
        promptSnippet: 'Explain how the internet works.',
        outcome: 'Technical jargon about TCP/IP and packets. Accurate but not "simple" for a child or layperson.',
        qualityScore: 3
      },
      {
        version: 'v3.0 (EduGenie Final)',
        promptSnippet: 'Goal: Make it extremely easy. Use: 1. Simple Definition 2. Real-world analogy 3. Why it matters.',
        outcome: 'Relatable metaphors (e.g., "The Internet is like a digital postal service"). accessible language.',
        qualityScore: 5
      }
    ]
  },
  {
    id: 'comp-5',
    scenario: 'Flashcards Generation',
    insight: 'Enforcing a strict separator (e.g., "|") enables programmatic parsing and easy export to spaced repetition tools.',
    iterations: [
      {
        version: 'v1.0 (Naive)',
        promptSnippet: 'Give me some flashcards about Spanish verbs.',
        outcome: 'Inconsistent format. Some lines are sentences, others are bullets. Hard to copy-paste into Anki.',
        qualityScore: 2
      },
      {
        version: 'v2.5 (EduGenie Final)',
        promptSnippet: 'Format strictly as: [Term] | [Definition]. Quantity: 10.',
        outcome: 'Clean, pipe-separated values. Uniform structure. Perfect for import scripts.',
        qualityScore: 5
      }
    ]
  }
];
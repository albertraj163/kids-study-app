/**
 * Curriculum-aligned quiz bank (seed v2).
 * Ages ~10–14: application-based questions, not trivial drills.
 */

const SEED_VERSION = '2';

const SUBJECTS = [
  {
    name: 'Mathematics',
    emoji: '📐',
    description: 'Number sense, algebra, geometry, and problem solving',
  },
  {
    name: 'Science',
    emoji: '🔬',
    description: 'Biology, chemistry, physics, and scientific reasoning',
  },
  {
    name: 'English',
    emoji: '📖',
    description: 'Grammar, vocabulary, reading comprehension, and writing',
  },
  {
    name: 'Digital Literacy',
    emoji: '💻',
    description: 'Computing concepts, logic, and modern software practices',
  },
];

const QUESTIONS = [
  // Mathematics (subject_id 1)
  {
    subjectId: 1,
    question: 'A cyclist covers 45 km in 1.5 hours. What is the average speed?',
    options: ['20 km/h', '30 km/h', '45 km/h', '67.5 km/h'],
    correctIndex: 1,
  },
  {
    subjectId: 1,
    question: 'Which of the following is a prime number?',
    options: ['21', '29', '33', '51'],
    correctIndex: 1,
  },
  {
    subjectId: 1,
    question: 'What is 15% of 240?',
    options: ['24', '30', '36', '48'],
    correctIndex: 2,
  },
  {
    subjectId: 1,
    question: 'If 3x − 5 = 16, what is the value of x?',
    options: ['5', '6', '7', '11'],
    correctIndex: 2,
  },
  {
    subjectId: 1,
    question: 'What is the area of a rectangle with length 12 cm and width 7 cm?',
    options: ['19 cm²', '38 cm²', '84 cm²', '96 cm²'],
    correctIndex: 2,
  },
  // Science (subject_id 2)
  {
    subjectId: 2,
    question: 'During photosynthesis, plants primarily absorb which gas from the air?',
    options: ['Oxygen', 'Carbon dioxide', 'Nitrogen', 'Helium'],
    correctIndex: 1,
  },
  {
    subjectId: 2,
    question: 'Which organelle is the main site of cellular respiration in eukaryotic cells?',
    options: ['Nucleus', 'Mitochondria', 'Golgi apparatus', 'Ribosome'],
    correctIndex: 1,
  },
  {
    subjectId: 2,
    question: 'What is the chemical formula for table salt?',
    options: ['H₂O', 'CO₂', 'NaCl', 'O₂'],
    correctIndex: 2,
  },
  {
    subjectId: 2,
    question: 'In which state of matter are particles generally closest together?',
    options: ['Solid', 'Liquid', 'Gas', 'Plasma'],
    correctIndex: 0,
  },
  {
    subjectId: 2,
    question: 'Which planet is the fourth from the Sun in our solar system?',
    options: ['Venus', 'Earth', 'Mars', 'Jupiter'],
    correctIndex: 2,
  },
  // English (subject_id 3)
  {
    subjectId: 3,
    question: 'In the sentence "The diligent student revised her notes," which word is an adjective?',
    options: ['student', 'diligent', 'revised', 'notes'],
    correctIndex: 1,
  },
  {
    subjectId: 3,
    question: 'Which word is the best synonym for "concise"?',
    options: ['Verbose', 'Brief', 'Chaotic', 'Ancient'],
    correctIndex: 1,
  },
  {
    subjectId: 3,
    question: 'A thesis statement in an academic essay most often belongs in the…',
    options: ['Introduction', 'Works cited', 'Random footnote', 'Cover page only'],
    correctIndex: 0,
  },
  {
    subjectId: 3,
    question: 'Which sentence uses correct subject–verb agreement?',
    options: [
      'The team are winning.',
      'The team is winning.',
      'The team were winning.',
      'The team be winning.',
    ],
    correctIndex: 1,
  },
  {
    subjectId: 3,
    question: 'To infer information from a passage means to…',
    options: [
      'Memorize every adjective',
      'Draw a reasoned conclusion from evidence',
      'Ignore context clues',
      'Replace the author’s argument',
    ],
    correctIndex: 1,
  },
  // Digital Literacy (subject_id 4)
  {
    subjectId: 4,
    question: 'In software delivery, what does CI/CD typically stand for?',
    options: [
      'Central Internet / Cloud Download',
      'Continuous Integration / Continuous Delivery',
      'Compiled Input / Compiled Data',
      'Certificate Issuer / Certificate Directory',
    ],
    correctIndex: 1,
  },
  {
    subjectId: 4,
    question: 'Which HTTP status code indicates a successful GET request?',
    options: ['404', '500', '200', '301'],
    correctIndex: 2,
  },
  {
    subjectId: 4,
    question: 'What is the purpose of a unit test in a codebase?',
    options: [
      'Replace production databases',
      'Verify small pieces of logic in isolation',
      'Disable security scanning',
      'Increase network latency',
    ],
    correctIndex: 1,
  },
  {
    subjectId: 4,
    question: 'Which practice helps keep secrets out of Git repositories?',
    options: [
      'Committing .env files with passwords',
      'Sharing API keys in chat',
      'Using environment variables and secret managers',
      'Hard-coding credentials in source',
    ],
    correctIndex: 2,
  },
  {
    subjectId: 4,
    question: 'Docker containers are best described as…',
    options: [
      'Physical servers in a data centre',
      'Lightweight, portable runtime environments for applications',
      'Replacement for all programming languages',
      'Antivirus programs',
    ],
    correctIndex: 1,
  },
];

module.exports = { SEED_VERSION, SUBJECTS, QUESTIONS };

export type JobRoleId =
  | 'lawyer'
  | 'doctor'
  | 'vet'
  | 'astronaut'
  | 'actress'
  | 'fashion_designer'
  | 'pilot';

export interface Part1Character {
  id: JobRoleId;
  label: string;
}

export interface Part1Prompt {
  id: string;
  quote: string;
  targetRole: JobRoleId;
}

export type FeelingId = 'happy' | 'sad' | 'nervous' | 'afraid' | 'angry' | 'excited';

export interface Part2Prompt {
  id: string;
  quote: string;
  targetFeeling: FeelingId;
}

export interface Part3Question {
  id: string;
  image: string;
  sentenceBefore: string;
  sentenceAfter: string;
  targetAdjective: string;
  altText: string;
}

export type PartDScenarioId =
  | 'homework'
  | 'lion'
  | 'doctor'
  | 'christmas'
  | 'test'
  | 'robber';

export interface PartDHeadSlot {
  cx: number;
  cy: number;
  r: number;
}

export const PARTD_STUDENT_SPRITES = {
  boy: {
    image: './images/partd/student-boy.png',
    headSlot: { cx: 0.7, cy: 0.155, r: 0.072 },
  },
  girl: {
    image: './images/partd/student-girl.png',
    headSlot: { cx: 0.713, cy: 0.173, r: 0.072 },
  },
} as const;

export interface PartDScenario {
  id: PartDScenarioId;
  speaker: 'teacher' | 'other' | 'student' | 'robber';
  speakerLabel: string;
  speechText: string;
  expectedFeelings: string[];
}

export const PART1_CHARACTERS: Part1Character[] = [
  { id: 'lawyer', label: 'Lawyer' },
  { id: 'doctor', label: 'Doctor' },
  { id: 'pilot', label: 'Pilot' },
  { id: 'fashion_designer', label: 'Fashion Designer' },
  { id: 'actress', label: 'Actress' },
  { id: 'vet', label: 'Vet' },
  { id: 'astronaut', label: 'Astronaut' },
];

export const PART1_POOL: Part1Prompt[] = [
  {
    id: 'p1_lawyer',
    quote: 'I want to interview someone who speaks for people in court.',
    targetRole: 'lawyer',
  },
  {
    id: 'p1_doctor',
    quote: 'I want to interview someone who cures sick people.',
    targetRole: 'doctor',
  },
  {
    id: 'p1_vet',
    quote: 'I want to interview someone who cures sick animals.',
    targetRole: 'vet',
  },
  {
    id: 'p1_astronaut',
    quote: 'I want to interview someone who goes to space.',
    targetRole: 'astronaut',
  },
  {
    id: 'p1_actress',
    quote: 'I want to interview someone who acts in films and plays.',
    targetRole: 'actress',
  },
  {
    id: 'p1_fashion',
    quote: 'I want to interview someone who designs amazing clothes!',
    targetRole: 'fashion_designer',
  },
  {
    id: 'p1_pilot',
    quote: 'I want to interview someone who can fly an aeroplane or helicopter!',
    targetRole: 'pilot',
  },
];

export const PART2_FEELINGS: { id: FeelingId; label: string }[] = [
  { id: 'happy', label: 'happy' },
  { id: 'sad', label: 'sad' },
  { id: 'nervous', label: 'nervous' },
  { id: 'afraid', label: 'afraid' },
  { id: 'angry', label: 'angry' },
  { id: 'excited', label: 'excited' },
];

export const PART2_POOL: Part2Prompt[] = [
  {
    id: 'p2_afraid',
    quote: 'I can see a big cassowary!',
    targetFeeling: 'afraid',
  },
  {
    id: 'p2_excited',
    quote: 'I can see a famous actor!',
    targetFeeling: 'excited',
  },
  {
    id: 'p2_happy',
    quote: 'I like to interview people.',
    targetFeeling: 'happy',
  },
  {
    id: 'p2_angry',
    quote: 'Go away, reporters!',
    targetFeeling: 'angry',
  },
  {
    id: 'p2_sad',
    quote: 'I have no job now.',
    targetFeeling: 'sad',
  },
  {
    id: 'p2_nervous',
    quote: 'Oh no, I have a test tomorrow!',
    targetFeeling: 'nervous',
  },
];

export const PART3_OPTIONS: string[] = [
  'calm',
  'hard-working',
  'good-looking',
  'attentive',
  'uncaring',
  'creative',
];

export const PART3_POOL: Part3Question[] = [
  {
    id: 'p3_calm',
    image: './images/part3/calm.png',
    sentenceBefore: 'Billy is very ',
    sentenceAfter: '.',
    targetAdjective: 'calm',
    altText: 'A child sitting calmly at a classroom desk reading while two children run wildly behind him',
  },
  {
    id: 'p3_uncaring',
    image: './images/part3/uncaring.png',
    sentenceBefore: 'King Booboo is so ',
    sentenceAfter: '!',
    targetAdjective: 'uncaring',
    altText: 'An arrogant king on a throne ignoring two begging peasants',
  },
  {
    id: 'p3_hard_working',
    image: './images/part3/hard-working.png',
    sentenceBefore: 'My father is so ',
    sentenceAfter: '.',
    targetAdjective: 'hard-working',
    altText: 'A construction worker carrying heavy wooden beams and sweating',
  },
  {
    id: 'p3_good_looking',
    image: './images/part3/good-looking.png',
    sentenceBefore: 'I am so ',
    sentenceAfter: '.',
    targetAdjective: 'good-looking',
    altText: 'A handsome man looking in a handheld mirror',
  },
  {
    id: 'p3_attentive',
    image: './images/part3/attentive.png',
    sentenceBefore: 'Kitty Fung is so ',
    sentenceAfter: '.',
    targetAdjective: 'attentive',
    altText: 'A Primary 6 schoolgirl sitting upright listening carefully to her teacher',
  },
  {
    id: 'p3_creative',
    image: './images/part3/creative.png',
    sentenceBefore: 'This artist is so ',
    sentenceAfter: '!',
    targetAdjective: 'creative',
    altText: 'A sculptor carving a white marble unicorn statue in an art studio',
  },
];

export const PARTD_FEELING_WORDS = [
  'afraid',
  'nervous',
  'excited',
  'happy',
  'unhappy',
  'sick',
] as const;

export const PARTD_POOL: PartDScenario[] = [
  {
    id: 'homework',
    speaker: 'teacher',
    speakerLabel: 'Teacher says',
    speechText: 'You need to do 100 pages of homework!',
    expectedFeelings: ['unhappy', 'afraid', 'nervous'],
  },
  {
    id: 'lion',
    speaker: 'other',
    speakerLabel: 'Classmate shouts',
    speechText: 'There is a lion in the school!',
    expectedFeelings: ['afraid'],
  },
  {
    id: 'doctor',
    speaker: 'student',
    speakerLabel: 'You say',
    speechText: "I don't feel good. I want to see the doctor.",
    expectedFeelings: ['sick', 'unhappy'],
  },
  {
    id: 'christmas',
    speaker: 'student',
    speakerLabel: 'You say',
    speechText: 'Thank you for the Christmas present!',
    expectedFeelings: ['happy', 'excited'],
  },
  {
    id: 'test',
    speaker: 'student',
    speakerLabel: 'You say',
    speechText: 'I have a big test tomorrow!',
    expectedFeelings: ['nervous', 'afraid'],
  },
  {
    id: 'robber',
    speaker: 'robber',
    speakerLabel: 'Robber shouts',
    speechText: 'Give me all your money!',
    expectedFeelings: ['afraid'],
  },
];

export function pickRandomItems<T>(items: T[], count: number): T[] {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy.slice(0, count);
}

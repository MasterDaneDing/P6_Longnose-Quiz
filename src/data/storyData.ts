export type VocabCategory = 'job' | 'action' | 'adjective';

export interface VocabEntry {
  id: string;
  term: string;
  partOfSpeech: string;
  category: VocabCategory;
  definition: string;
  exampleSentence: string;
  antonym?: string;
  pageRef: number;
}

export interface TextSegment {
  text: string;
  vocabId?: string;
  emphasis?: 'sfx' | 'red';
}

export interface StoryPage {
  pageNumber: number;
  chapter: string;
  image: string;
  sfx?: string;
  paragraphs: TextSegment[][];
}

export interface JobLabItem {
  id: string;
  job: string;
  duty: string;
  storyCharacterNote: string;
  pageRef: number;
}

export interface Part3Adjective {
  id: string;
  word: string;
  image: string;
  definition: string;
  sceneCaption: string;
  storyConnection: string;
  exampleSentence: string;
  antonym: string;
  promptQuestion: string;
  distractors: string[];
}

export interface QuizQuestion {
  id: string;
  type: 'comprehension' | 'vocabulary';
  prompt: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  pageRef: number;
}

export const VOCAB_DICTIONARY: Record<string, VocabEntry> = {
  reporter: {
    id: 'reporter',
    term: 'reporter',
    partOfSpeech: 'noun',
    category: 'job',
    definition: 'A person whose job is to find out news and tell people about it on TV, radio, or in newspapers.',
    exampleSentence: 'Mr. Longnose was a reporter who interviewed people in the city.',
    pageRef: 2,
  },
  talkative: {
    id: 'talkative',
    term: 'talkative',
    partOfSpeech: 'adjective',
    category: 'adjective',
    definition: 'Liking to talk a lot.',
    exampleSentence: 'The talkative host asked his guests dozens of questions.',
    antonym: 'quiet',
    pageRef: 2,
  },
  'interviewed people': {
    id: 'interviewed people',
    term: 'interview people',
    partOfSpeech: 'verb phrase',
    category: 'action',
    definition: 'To ask people questions to find out information or opinions for news or a job.',
    exampleSentence: 'Reporters interview people on the street to hear their stories.',
    pageRef: 2,
  },
  reported: {
    id: 'reported',
    term: 'report news',
    partOfSpeech: 'verb phrase',
    category: 'action',
    definition: 'To share information about something that happened.',
    exampleSentence: 'He interviewed people and reported news every morning.',
    pageRef: 2,
  },
  lawyer: {
    id: 'lawyer',
    term: 'lawyer',
    partOfSpeech: 'noun',
    category: 'job',
    definition: 'A person who knows the law well and helps or speaks for people in court.',
    exampleSentence: 'The lawyer wore a neat grey suit outside the courthouse.',
    pageRef: 3,
  },
  'speak for people in court': {
    id: 'speak for people in court',
    term: 'speak for people in court',
    partOfSpeech: 'verb phrase',
    category: 'action',
    definition: 'To explain a client’s side of a case in front of a judge in a law court.',
    exampleSentence: 'A lawyer speaks for people in court to help them get fair treatment.',
    pageRef: 3,
  },
  'hard-working': {
    id: 'hard-working',
    term: 'hard-working',
    partOfSpeech: 'adjective',
    category: 'adjective',
    definition: 'Putting a lot of effort and care into your work; never lazy.',
    exampleSentence: 'You must be very hard-working to prepare so many court cases.',
    antonym: 'lazy',
    pageRef: 4,
  },
  doctor: {
    id: 'doctor',
    term: 'doctor',
    partOfSpeech: 'noun',
    category: 'job',
    definition: 'A person trained in medicine who treats sick or injured people.',
    exampleSentence: 'Mr. Longnose thought the man helping the lawyer was a doctor.',
    pageRef: 6,
  },
  'cure sick people': {
    id: 'cure sick people',
    term: 'cure sick people',
    partOfSpeech: 'verb phrase',
    category: 'action',
    definition: 'To make people who are ill healthy again.',
    exampleSentence: 'Doctors work in hospitals and clinics to cure sick people.',
    pageRef: 6,
  },
  vet: {
    id: 'vet',
    term: 'vet',
    partOfSpeech: 'noun',
    category: 'job',
    definition: 'Short for veterinarian — an animal doctor who treats sick or hurt animals.',
    exampleSentence: 'The vet invited Mr. Longnose to see the big animals at his clinic.',
    pageRef: 7,
  },
  'cure sick animals': {
    id: 'cure sick animals',
    term: 'cure sick animals',
    partOfSpeech: 'verb phrase',
    category: 'action',
    definition: 'To care for ill or injured animals so they become healthy again.',
    exampleSentence: 'Vets cure sick animals, from tiny pets to giant lions.',
    pageRef: 7,
  },
  caring: {
    id: 'caring',
    term: 'caring',
    partOfSpeech: 'adjective',
    category: 'adjective',
    definition: 'Kind, helpful, and showing concern for other people or animals.',
    exampleSentence: 'Even in space, Mr. Longnose called his mother because he could be caring.',
    antonym: 'uncaring',
    pageRef: 7,
  },
  cure: {
    id: 'cure',
    term: 'cure',
    partOfSpeech: 'verb',
    category: 'action',
    definition: 'To make a sick person or animal healthy again.',
    exampleSentence: 'We cure big animals at this special clinic.',
    pageRef: 8,
  },
  animals: {
    id: 'animals',
    term: 'animals',
    partOfSpeech: 'noun (plural)',
    category: 'job',
    definition: 'Living creatures such as lions, tigers, birds, and dogs.',
    exampleSentence: 'The cages held lions, tigers, and tall cassowaries.',
    pageRef: 8,
  },
  calm: {
    id: 'calm',
    term: 'calm',
    partOfSpeech: 'adjective',
    category: 'adjective',
    definition: 'Peaceful, relaxed, and not panicked or angry even in a noisy or dangerous moment.',
    exampleSentence: 'Stay calm and follow the safety instructions slowly.',
    antonym: 'panicked',
    pageRef: 10,
  },
  pilot: {
    id: 'pilot',
    term: 'pilot',
    partOfSpeech: 'noun',
    category: 'job',
    definition: 'A person who flies an aeroplane or helicopter.',
    exampleSentence: 'The helicopter pilot lowered a rope ladder to rescue people.',
    pageRef: 13,
  },
  attentive: {
    id: 'attentive',
    term: 'attentive',
    partOfSpeech: 'adjective',
    category: 'adjective',
    definition: 'Paying close attention and watching or listening carefully.',
    exampleSentence: 'A good pilot must stay attentive to every instrument and danger.',
    antonym: 'inattentive / careless',
    pageRef: 13,
  },
  'saves people in danger': {
    id: 'saves people in danger',
    term: 'save people in danger',
    partOfSpeech: 'verb phrase',
    category: 'action',
    definition: 'To rescue people from a dangerous or life-threatening situation.',
    exampleSentence: 'The rescue pilot saves people in danger during city emergencies.',
    pageRef: 13,
  },
  'fashion designer': {
    id: 'fashion designer',
    term: 'fashion designer',
    partOfSpeech: 'noun',
    category: 'job',
    definition: 'A person who draws, plans, and creates new clothes and styles.',
    exampleSentence: 'The fashion designer was getting outfits ready backstage.',
    pageRef: 16,
  },
  clothes: {
    id: 'clothes',
    term: 'clothes',
    partOfSpeech: 'noun',
    category: 'action',
    definition: 'Things people wear, such as shirts, suits, coats, and dresses.',
    exampleSentence: 'Racks of colourful clothes lined both sides of the dressing room.',
    pageRef: 16,
  },
  'fashion show': {
    id: 'fashion show',
    term: 'fashion show',
    partOfSpeech: 'noun',
    category: 'action',
    definition: 'An event where models walk down a catwalk wearing new clothes designed by a fashion designer.',
    exampleSentence: 'Mr. Longnose walked down the catwalk and made the fashion show a hit.',
    pageRef: 16,
  },
  model: {
    id: 'model',
    term: 'model',
    partOfSpeech: 'noun',
    category: 'job',
    definition: 'A person whose job is to wear new clothes in fashion shows or photos.',
    exampleSentence: 'Because the other models were missing, Mr. Longnose became a model.',
    pageRef: 17,
  },
  'appear in our fashion show': {
    id: 'appear in our fashion show',
    term: 'appear in a fashion show',
    partOfSpeech: 'verb phrase',
    category: 'action',
    definition: 'To take part on stage in a fashion show so the audience can see the outfits.',
    exampleSentence: 'The designer asked him to appear in the fashion show right away.',
    pageRef: 17,
  },
  'good-looking': {
    id: 'good-looking',
    term: 'good-looking',
    partOfSpeech: 'adjective',
    category: 'adjective',
    definition: 'Attractive or handsome in appearance.',
    exampleSentence: 'Mr. Longnose proudly thought he was very good-looking.',
    pageRef: 17,
  },
  actor: {
    id: 'actor',
    term: 'actor',
    partOfSpeech: 'noun',
    category: 'job',
    definition: 'A person who performs in films, plays, or television shows.',
    exampleSentence: 'Mr. Longnose became the number one actor in the world!',
    pageRef: 21,
  },
  actress: {
    id: 'actress',
    term: 'actress',
    partOfSpeech: 'noun',
    category: 'job',
    definition: 'A female actor who performs in films, plays, or television shows.',
    exampleSentence: 'He walked down the red carpet beside the number one actress.',
    pageRef: 21,
  },
  uncaring: {
    id: 'uncaring',
    term: 'uncaring',
    partOfSpeech: 'adjective',
    category: 'adjective',
    definition: 'Not showing kindness, sympathy, or concern when someone else is hurt or in trouble.',
    exampleSentence: 'Reporters called him uncaring when he blamed the actress instead of helping.',
    antonym: 'caring',
    pageRef: 24,
  },
  astronaut: {
    id: 'astronaut',
    term: 'astronaut',
    partOfSpeech: 'noun',
    category: 'job',
    definition: 'A person trained to travel and work in a spacecraft in outer space.',
    exampleSentence: 'Mr. Longnose wore a special extra-long helmet as an astronaut.',
    pageRef: 25,
  },
  'go into space': {
    id: 'go into space',
    term: 'go into space',
    partOfSpeech: 'verb phrase',
    category: 'action',
    definition: 'To travel beyond Earth’s atmosphere in a rocket or spacecraft.',
    exampleSentence: 'As an astronaut, he could go into space far away from reporters.',
    pageRef: 25,
  },
  creative: {
    id: 'creative',
    term: 'creative',
    partOfSpeech: 'adjective',
    category: 'adjective',
    definition: 'Good at thinking of new, clever, or original ideas and making things.',
    exampleSentence: 'His friend praised him as creative for thinking of a job in space.',
    antonym: 'unimaginative',
    pageRef: 25,
  },
  'tour guide': {
    id: 'tour guide',
    term: 'tour guide',
    partOfSpeech: 'noun',
    category: 'job',
    definition: 'A person who shows visitors around interesting places and explains facts about them.',
    exampleSentence: 'He became a tour guide for friendly aliens on the space station.',
    pageRef: 28,
  },
};

export const STORY_PAGES: StoryPage[] = [
  {
    pageNumber: 1,
    chapter: 'Title Cover',
    image: './images/story/page-01.jpg',
    paragraphs: [
      [{ text: 'Mr. Longnose', emphasis: 'red' }],
      [{ text: 'Follow a talkative reporter with an impossibly long nose through five unexpected careers — from the courthouse steps to outer space.' }],
    ],
  },
  {
    pageNumber: 2,
    chapter: 'Chapter 1 · On the News',
    image: './images/story/page-02.jpg',
    paragraphs: [
      [
        { text: 'Mr. Longnose was a ' },
        { text: 'reporter', vocabId: 'reporter' },
        { text: '. He was very ' },
        { text: 'talkative', vocabId: 'talkative' },
        { text: '.' },
      ],
      [
        { text: 'He ' },
        { text: 'interviewed people', vocabId: 'interviewed people' },
        { text: ' and ' },
        { text: 'reported', vocabId: 'reported' },
        { text: ' news.' },
      ],
      [{ text: 'Unfortunately, he sometimes made news too.' }],
      [{ text: '‘Today, I will ask people about their jobs in our city,’ said Mr. Longnose to the camera.' }],
    ],
  },
  {
    pageNumber: 3,
    chapter: 'Chapter 1 · At the Courthouse',
    image: './images/story/page-03.jpg',
    paragraphs: [
      [{ text: '‘What do you do?’ asked Mr. Longnose to a man wearing a grey suit.' }],
      [
        { text: '‘I’m a ' },
        { text: 'lawyer', vocabId: 'lawyer' },
        { text: '. I ' },
        { text: 'speak for people in court', vocabId: 'speak for people in court' },
        { text: ',’ the man said.' },
      ],
    ],
  },
  {
    pageNumber: 4,
    chapter: 'Chapter 1 · Windy Weather',
    image: './images/story/page-04.jpg',
    paragraphs: [
      [
        { text: '‘You must be very ' },
        { text: 'hard-working', vocabId: 'hard-working' },
        { text: '!’ said Mr. Longnose.' },
      ],
      [{ text: 'Suddenly, his tie blew away! It was a windy day.' }],
    ],
  },
  {
    pageNumber: 5,
    chapter: 'Chapter 1 · Oops!',
    image: './images/story/page-05.jpg',
    sfx: 'SMACK!',
    paragraphs: [
      [{ text: '‘Sorry, let’s continue the interview,’ said Mr. Longnose as he turned around.' }],
      [{ text: 'SMACK!', emphasis: 'sfx' }],
      [
        { text: 'His nose hit the ' },
        { text: 'lawyer', vocabId: 'lawyer' },
        { text: ' on the head.' },
      ],
    ],
  },
  {
    pageNumber: 6,
    chapter: 'Chapter 2 · Rescue on the Steps',
    image: './images/story/page-06.jpg',
    paragraphs: [
      [{ text: 'Luckily, a man came to help the lawyer.' }],
      [
        { text: '‘Are you a ' },
        { text: 'doctor', vocabId: 'doctor' },
        { text: '? Do you ' },
        { text: 'cure sick people', vocabId: 'cure sick people' },
        { text: '?’ asked Mr. Longnose.' },
      ],
    ],
  },
  {
    pageNumber: 7,
    chapter: 'Chapter 2 · The Animal Doctor',
    image: './images/story/page-07.jpg',
    paragraphs: [
      [
        { text: '‘No, I’m a ' },
        { text: 'vet', vocabId: 'vet' },
        { text: '. I ' },
        { text: 'cure sick animals', vocabId: 'cure sick animals' },
        { text: '. Do you want to see where I work? Let’s go!’' },
      ],
      [
        { text: '‘You are so ' },
        { text: 'caring', vocabId: 'caring' },
        { text: ',’ said Mr. Longnose.' },
      ],
    ],
  },
  {
    pageNumber: 8,
    chapter: 'Chapter 2 · Inside the Clinic',
    image: './images/story/page-08.jpg',
    paragraphs: [
      [
        { text: '‘We ' },
        { text: 'cure', vocabId: 'cure' },
        { text: ' big ' },
        { text: 'animals', vocabId: 'animals' },
        { text: ',’ said the vet.' },
      ],
      [{ text: 'Mr. Longnose saw lions, tigers and cassowaries. ‘Wow!’ he shouted.' }],
    ],
  },
  {
    pageNumber: 9,
    chapter: 'Chapter 2 · The Red Button',
    image: './images/story/page-09.jpg',
    sfx: 'CLICK!',
    paragraphs: [
      [{ text: 'Mr. Longnose turned around.' }],
      [{ text: 'Click!', emphasis: 'sfx' }],
      [{ text: 'He heard a sound.' }],
      [{ text: '‘Oh no!’ screamed Mr. Longnose.' }],
    ],
  },
  {
    pageNumber: 10,
    chapter: 'Chapter 2 · Escape Plan',
    image: './images/story/page-10.jpg',
    paragraphs: [
      [
        { text: '‘Please stay ' },
        { text: 'calm', vocabId: 'calm' },
        { text: ',’ Mr. Longnose said to the lion.' },
      ],
      [
        { text: 'Mr. Longnose looked at the ' },
        { text: 'vet', vocabId: 'vet' },
        { text: '. ‘Don’t worry, I will save…' },
      ],
      [{ text: '…myself!’ shouted Mr. Longnose as he ran outside.' }],
    ],
  },
  {
    pageNumber: 11,
    chapter: 'Chapter 3 · Wild Chase',
    image: './images/story/page-11.jpg',
    paragraphs: [
      [{ text: 'The lions, tigers and cassowaries ran outside and followed Mr. Longnose.' }],
    ],
  },
  {
    pageNumber: 12,
    chapter: 'Chapter 3 · Rope Ladder',
    image: './images/story/page-12.jpg',
    paragraphs: [
      [{ text: 'A helicopter came to save the people.' }],
      [{ text: 'Mr. Longnose jumped and grabbed onto the rope ladder.' }],
      [{ text: 'He was saved!' }],
    ],
  },
  {
    pageNumber: 13,
    chapter: 'Chapter 3 · Up in the Sky',
    image: './images/story/page-13.jpg',
    paragraphs: [
      [
        { text: '‘This is a great ' },
        { text: 'pilot', vocabId: 'pilot' },
        { text: '!’ shouted Mr. Longnose.' },
      ],
      [
        { text: '‘He is ' },
        { text: 'calm', vocabId: 'calm' },
        { text: ' and ' },
        { text: 'attentive', vocabId: 'attentive' },
        { text: ' and he ' },
        { text: 'saves people in danger', vocabId: 'saves people in danger' },
        { text: '!’' },
      ],
    ],
  },
  {
    pageNumber: 14,
    chapter: 'Chapter 3 · Uninvited Passenger',
    image: './images/story/page-14.jpg',
    paragraphs: [
      [{ text: 'But the pilot was not calm anymore.' }],
      [{ text: 'A very angry cassowary was in the helicopter!' }],
    ],
  },
  {
    pageNumber: 15,
    chapter: 'Chapter 3 · Freefall',
    image: './images/story/page-15.jpg',
    paragraphs: [
      [{ text: 'Mr. Longnose jumped out of the helicopter.' }],
      [{ text: '‘Help me!’ shouted Mr. Longnose.' }],
    ],
  },
  {
    pageNumber: 16,
    chapter: 'Chapter 4 · Through the Roof',
    image: './images/story/page-16.jpg',
    sfx: 'CRASH!',
    paragraphs: [
      [
        { text: 'A ' },
        { text: 'fashion designer', vocabId: 'fashion designer' },
        { text: ' was getting some ' },
        { text: 'clothes', vocabId: 'clothes' },
        { text: ' ready for a ' },
        { text: 'fashion show', vocabId: 'fashion show' },
        { text: '.' },
      ],
      [{ text: 'CRASH!', emphasis: 'sfx' }],
      [{ text: 'Mr. Longnose fell through the glass roof.' }],
    ],
  },
  {
    pageNumber: 17,
    chapter: 'Chapter 4 · Backstage Emergency',
    image: './images/story/page-17.jpg',
    paragraphs: [
      [
        { text: '‘All of our models are missing!’ shouted the ' },
        { text: 'fashion designer', vocabId: 'fashion designer' },
        { text: '.' },
      ],
      [
        { text: '‘Quick, wear these clothes! I need you to be a ' },
        { text: 'model', vocabId: 'model' },
        { text: ' and ' },
        { text: 'appear in our fashion show', vocabId: 'appear in our fashion show' },
        { text: ',’ she said.' },
      ],
      [
        { text: '‘I am very ' },
        { text: 'good-looking', vocabId: 'good-looking' },
        { text: ',’ said Mr. Longnose. ‘It’s a good idea!’' },
      ],
    ],
  },
  {
    pageNumber: 18,
    chapter: 'Chapter 4 · On the Catwalk',
    image: './images/story/page-18.jpg',
    paragraphs: [
      [{ text: 'Mr. Longnose walked down the catwalk.' }],
      [{ text: 'The fashion show was a big success!' }],
    ],
  },
  {
    pageNumber: 19,
    chapter: 'Chapter 4 · The Contract',
    image: './images/story/page-19.jpg',
    paragraphs: [
      [{ text: 'After the fashion show, a man ran into the dressing room and said to Mr. Longnose, ‘You are amazing! I want to make you a star!’' }],
    ],
  },
  {
    pageNumber: 20,
    chapter: 'Chapter 4 · Captain Nose',
    image: './images/story/page-20.jpg',
    paragraphs: [
      [{ text: 'Mr. Longnose became a big star.' }],
      [{ text: '‘I am so good-looking, of course I should be a star!’ he thought.' }],
    ],
  },
  {
    pageNumber: 21,
    chapter: 'Chapter 4 · Red Carpet',
    image: './images/story/page-21.jpg',
    paragraphs: [
      [
        { text: 'Mr. Longnose became the number one ' },
        { text: 'actor', vocabId: 'actor' },
        { text: ' in the world!' },
      ],
      [
        { text: 'He was walking down the red carpet with the number one ' },
        { text: 'actress', vocabId: 'actress' },
        { text: '.' },
      ],
    ],
  },
  {
    pageNumber: 22,
    chapter: 'Chapter 4 · Red Carpet Trouble',
    image: './images/story/page-22.jpg',
    sfx: 'SMACK!',
    paragraphs: [
      [{ text: 'Mr. Longnose turned his head to smile at the cameras.' }],
      [{ text: 'SMACK!', emphasis: 'sfx' }],
      [
        { text: 'He hit the ' },
        { text: 'actress', vocabId: 'actress' },
        { text: ' in the head with his long, long, nose.' },
      ],
    ],
  },
  {
    pageNumber: 23,
    chapter: 'Chapter 4 · Bad Press',
    image: './images/story/page-23.jpg',
    paragraphs: [
      [{ text: '‘Be careful, next time!’ he said to the actress.' }],
      [
        { text: 'He was not ' },
        { text: 'attentive', vocabId: 'attentive' },
        { text: ' to her.' },
      ],
      [{ text: 'The reporters took many pictures.' }],
    ],
  },
  {
    pageNumber: 24,
    chapter: 'Chapter 5 · Rock Bottom',
    image: './images/story/page-24.jpg',
    paragraphs: [
      [
        { text: 'Every day, reporters followed him. The news said he was ' },
        { text: 'uncaring', vocabId: 'uncaring' },
        { text: '.' },
      ],
      [{ text: 'Mr. Longnose could not get a job because of all the bad news about him.' }],
      [{ text: 'One day, he saw a poster.' }],
    ],
  },
  {
    pageNumber: 25,
    chapter: 'Chapter 5 · A Clever Idea',
    image: './images/story/page-25.jpg',
    paragraphs: [
      [
        { text: '‘I can be an ' },
        { text: 'astronaut', vocabId: 'astronaut' },
        { text: '! I can ' },
        { text: 'go into space', vocabId: 'go into space' },
        { text: '. All the reporters can’t follow me there!’' },
      ],
      [
        { text: '‘That’s a good idea,’ said his friend. ‘You are so ' },
        { text: 'creative', vocabId: 'creative' },
        { text: '!’' },
      ],
    ],
  },
  {
    pageNumber: 26,
    chapter: 'Chapter 5 · Blast Off',
    image: './images/story/page-26.jpg',
    paragraphs: [
      [
        { text: 'Mr. Longnose became an ' },
        { text: 'astronaut', vocabId: 'astronaut' },
        { text: '. He loved his job. He could ' },
        { text: 'go into space', vocabId: 'go into space' },
        { text: '!' },
      ],
      [{ text: 'Now the reporters could not find him.' }],
    ],
  },
  {
    pageNumber: 27,
    chapter: 'Chapter 5 · Friendly Aliens',
    image: './images/story/page-27.jpg',
    paragraphs: [
      [{ text: 'He even helped Earth make friends with aliens.' }],
      [{ text: 'Many of the aliens loved Mr. Longnose.' }],
      [{ text: 'I wonder why?' }],
    ],
  },
  {
    pageNumber: 28,
    chapter: 'Chapter 5 · Calling Home',
    image: './images/story/page-28.jpg',
    paragraphs: [
      [
        { text: 'He became a ' },
        { text: 'tour guide', vocabId: 'tour guide' },
        { text: ' for aliens on the space station.' },
      ],
      [{ text: 'Sometimes, he would call his mother on Earth.' }],
      [
        { text: 'Isn’t he ' },
        { text: 'caring', vocabId: 'caring' },
        { text: '?' },
      ],
    ],
  },
  {
    pageNumber: 29,
    chapter: 'Chapter 5 · Looking Back',
    image: './images/story/page-29.jpg',
    paragraphs: [
      [{ text: 'Mr. Longnose has had many different jobs.' }],
      [{ text: 'He was a:' }],
      [{ text: 'reporter, a model, an actor, an astronaut and a tour guide.', emphasis: 'red' }],
      [{ text: 'But one thing never changed:' }],
    ],
  },
  {
    pageNumber: 30,
    chapter: 'Chapter 5 · One Thing Never Changed',
    image: './images/story/page-30.jpg',
    sfx: 'CRACK!',
    paragraphs: [
      [{ text: 'He was very clumsy!' }],
    ],
  },
  {
    pageNumber: 31,
    chapter: 'Epilogue · What Next?',
    image: './images/story/page-31.jpg',
    paragraphs: [
      [{ text: '‘I think I need a new job,’ said Mr. Longnose.' }],
    ],
  },
];

export const JOBS_LAB_ITEMS: JobLabItem[] = [
  {
    id: 'reporter',
    job: 'Reporter',
    duty: 'Interviews people and reports news',
    storyCharacterNote: 'Mr. Longnose started as a talkative reporter asking citizens about their jobs.',
    pageRef: 2,
  },
  {
    id: 'lawyer',
    job: 'Lawyer',
    duty: 'Speaks for people in court',
    storyCharacterNote: 'Wore a grey suit outside the courthouse until Mr. Longnose accidentally smacked him.',
    pageRef: 3,
  },
  {
    id: 'doctor',
    job: 'Doctor',
    duty: 'Cures sick people',
    storyCharacterNote: 'Mr. Longnose mistook the vet for a doctor when he helped the knocked-out lawyer.',
    pageRef: 6,
  },
  {
    id: 'vet',
    job: 'Vet',
    duty: 'Cures sick animals',
    storyCharacterNote: 'Cared for lions, tigers, and cassowaries at his big-animal clinic.',
    pageRef: 7,
  },
  {
    id: 'pilot',
    job: 'Pilot',
    duty: 'Flies aircraft and saves people in danger',
    storyCharacterNote: 'Stayed calm and attentive until an angry cassowary climbed inside the helicopter.',
    pageRef: 13,
  },
  {
    id: 'fashion-designer',
    job: 'Fashion Designer',
    duty: 'Gets clothes ready for a fashion show',
    storyCharacterNote: 'Gave Mr. Longnose an outfit right after he crashed through her glass roof.',
    pageRef: 16,
  },
  {
    id: 'model',
    job: 'Model',
    duty: 'Walks down the catwalk and appears in fashion shows',
    storyCharacterNote: 'Mr. Longnose filled in for the missing models and became an instant hit.',
    pageRef: 17,
  },
  {
    id: 'actor',
    job: 'Actor / Actress',
    duty: 'Performs in movies and walks the red carpet',
    storyCharacterNote: 'Mr. Longnose starred as Captain Nose before knocking down the number one actress.',
    pageRef: 21,
  },
  {
    id: 'astronaut',
    job: 'Astronaut',
    duty: 'Goes into space to work beyond Earth',
    storyCharacterNote: 'Applied from a Wanted poster so reporters could not follow him.',
    pageRef: 25,
  },
  {
    id: 'tour-guide',
    job: 'Tour Guide',
    duty: 'Shows visitors around interesting places',
    storyCharacterNote: 'Led friendly long-nosed aliens on tours around the space station.',
    pageRef: 28,
  },
];

export const PART3_ADJECTIVES: Part3Adjective[] = [
  {
    id: 'calm',
    word: 'calm',
    image: './images/part3/calm.png',
    definition: 'Peaceful, steady, and not panicked even when everything around you is noisy or stressful.',
    sceneCaption: 'A Primary 6 student sits quietly reading his book while classmates run wildly behind him.',
    storyConnection: 'Mr. Longnose begged the roaring lion to stay calm, and praised the helicopter pilot for staying calm until the cassowary appeared.',
    exampleSentence: 'Jason stayed calm and finished his reading even though the classroom was noisy.',
    antonym: 'panicked / nervous',
    promptQuestion: 'The classroom is loud and chaotic, yet this student keeps reading peacefully without panicking. Which adjective describes him?',
    distractors: ['uncaring', 'creative', 'good-looking'],
  },
  {
    id: 'uncaring',
    word: 'uncaring',
    image: './images/part3/uncaring.png',
    definition: 'Not showing kindness, sympathy, or help when someone else is hurt or asking for support.',
    sceneCaption: 'A smug king crosses his arms on his velvet throne and looks away from two kneeling villagers.',
    storyConnection: 'When Mr. Longnose hit the actress on the red carpet and told her to be careful without helping, newspapers called him uncaring.',
    exampleSentence: 'It was uncaring of the king to ignore the hungry villagers begging for help.',
    antonym: 'caring / kind',
    promptQuestion: 'The king looks away with crossed arms while poor villagers kneel and ask for help. Which adjective fits the king?',
    distractors: ['attentive', 'hard-working', 'calm'],
  },
  {
    id: 'hard-working',
    word: 'hard-working',
    image: './images/part3/hard-working.png',
    definition: 'Putting strong effort, energy, and persistence into your job or studies.',
    sceneCaption: 'A father carries heavy wooden timber beams across a sunny construction site, wiping sweat from his brow.',
    storyConnection: 'On page 4, Mr. Longnose told the lawyer in front of the courthouse, "You must be very hard-working!"',
    exampleSentence: 'My father is hard-working; he carries heavy beams all day without complaining.',
    antonym: 'lazy',
    promptQuestion: 'This builder carries heavy wooden beams under the hot sun and wipes sweat off his forehead. Which adjective describes him?',
    distractors: ['good-looking', 'uncaring', 'calm'],
  },
  {
    id: 'good-looking',
    word: 'good-looking',
    image: './images/part3/good-looking.png',
    definition: 'Attractive, handsome, or neat and pleasing in appearance.',
    sceneCaption: 'A stylish young man with neat 1980s hair smiles confidently into a handheld mirror.',
    storyConnection: 'Mr. Longnose insisted he was "very good-looking" when asked to appear in the fashion show and star in movies.',
    exampleSentence: 'The actor smiled at his reflection because he wanted to look good-looking for the premiere.',
    antonym: 'plain / unattractive',
    promptQuestion: 'He smiles proudly into a handheld mirror, admiring his sharp suit and styled hair. Which adjective best matches this scene?',
    distractors: ['attentive', 'hard-working', 'uncaring'],
  },
  {
    id: 'attentive',
    word: 'attentive',
    image: './images/part3/attentive.png',
    definition: 'Listening or watching very carefully and paying full attention to what is happening.',
    sceneCaption: 'A Primary 6 schoolgirl sits upright with folded hands, focusing carefully on her teacher at the board.',
    storyConnection: 'The pilot was attentive while flying, whereas Mr. Longnose was NOT attentive to the actress on the red carpet.',
    exampleSentence: 'Mei-lin is an attentive student who listens closely to every instruction.',
    antonym: 'careless / distracted',
    promptQuestion: 'Sitting upright with folded hands, the schoolgirl focuses carefully on her teacher’s lesson. Which adjective describes her?',
    distractors: ['creative', 'uncaring', 'good-looking'],
  },
  {
    id: 'creative',
    word: 'creative',
    image: './images/part3/creative.png',
    definition: 'Full of imagination and original ideas for solving problems or making art.',
    sceneCaption: 'A joyful artist in a paint-splattered apron chisels a white marble unicorn sculpture in her studio.',
    storyConnection: 'Mr. Longnose’s friend called him creative when he came up with the idea to become an astronaut so reporters could not chase him.',
    exampleSentence: 'Sculpting a unicorn out of a block of marble takes a creative mind.',
    antonym: 'unimaginative',
    promptQuestion: 'Using a mallet and chisel, the artist imagines and carves a marble unicorn in her studio. Which adjective describes her?',
    distractors: ['calm', 'hard-working', 'uncaring'],
  },
];

export const COMPREHENSION_QUIZ: QuizQuestion[] = [
  {
    id: 'q1',
    type: 'comprehension',
    prompt: 'What happened right after Mr. Longnose’s red polka-dot tie blew away on a windy day?',
    options: [
      'He turned around and accidentally smacked the lawyer on the head with his nose.',
      'He jumped onto a helicopter rope ladder.',
      'He fell through a glass roof into a fashion studio.',
      'He took a rocket ship to the space station.',
    ],
    correctIndex: 0,
    explanation: 'On pages 4–5, the wind blew his tie away, and as he turned around to continue the interview, SMACK—his long nose hit the lawyer on the head.',
    pageRef: 5,
  },
  {
    id: 'q2',
    type: 'vocabulary',
    prompt: 'Why did the man helping the lawyer say he was a vet instead of a doctor?',
    options: [
      'Because he flies rescue helicopters.',
      'Because he cures sick animals rather than sick people.',
      'Because he designs clothes for fashion shows.',
      'Because he speaks for people in court.',
    ],
    correctIndex: 1,
    explanation: 'On pages 6–7, Mr. Longnose asked if he cured sick people, and the man explained: "No, I’m a vet. I cure sick animals."',
    pageRef: 7,
  },
  {
    id: 'q3',
    type: 'comprehension',
    prompt: 'How did the lions, tigers, and cassowaries escape from their cages at the vet’s clinic?',
    options: [
      'The vet unlocked all the doors to feed them.',
      'Mr. Longnose turned around and accidentally pressed the red OPEN button with his nose.',
      'An earthquake broke the iron bars.',
      'The pilot opened the doors from outside.',
    ],
    correctIndex: 1,
    explanation: 'On page 9, Mr. Longnose turned around and his nose pressed the red OPEN button with a loud CLICK!',
    pageRef: 9,
  },
  {
    id: 'q4',
    type: 'comprehension',
    prompt: 'Why did the calm and attentive helicopter pilot suddenly lose his calm on page 14?',
    options: [
      'The helicopter ran out of fuel over the ocean.',
      'Reporters were taking too many photos of him.',
      'A very angry cassowary was inside the helicopter!',
      'Mr. Longnose dropped his microphone.',
    ],
    correctIndex: 2,
    explanation: 'On page 14, an angry cassowary had gotten into the helicopter cockpit right behind the pilot.',
    pageRef: 14,
  },
  {
    id: 'q5',
    type: 'vocabulary',
    prompt: 'Which job prepares clothes for a fashion show and needed a last-minute model?',
    options: [
      'A tour guide',
      'A lawyer',
      'A fashion designer',
      'An astronaut',
    ],
    correctIndex: 2,
    explanation: 'On pages 16–17, a fashion designer was preparing clothes for a fashion show when Mr. Longnose crashed through the glass roof.',
    pageRef: 16,
  },
  {
    id: 'q6',
    type: 'vocabulary',
    prompt: 'Why did the newspapers say Mr. Longnose was "uncaring" after the red carpet accident?',
    options: [
      'He knocked down the actress with his nose and told her "Be careful, next time!" instead of helping her.',
      'He refused to wear the pirate costume for Captain Nose.',
      'He forgot to interview the lawyer outside the court.',
      'He gave tours to aliens in space.',
    ],
    correctIndex: 0,
    explanation: 'On pages 22–24, he was not attentive to the actress, blamed her instead of caring for her, and reporters spread the news that he was uncaring.',
    pageRef: 23,
  },
  {
    id: 'q7',
    type: 'vocabulary',
    prompt: 'Why did Mr. Longnose’s friend call him "creative" on page 25?',
    options: [
      'He painted a picture of a lion and a tiger.',
      'He invented a clever plan to become an astronaut so reporters couldn’t follow him into space.',
      'He sewed a brand-new blue suit with polka dots.',
      'He built a helicopter out of wooden beams.',
    ],
    correctIndex: 1,
    explanation: 'Seeing the "WANTED: ASTRONAUTS!" poster gave Mr. Longnose the original idea to escape reporters by going into space.',
    pageRef: 25,
  },
  {
    id: 'q8',
    type: 'comprehension',
    prompt: 'Why did many of the aliens on the space station love Mr. Longnose right away?',
    options: [
      'He gave them free red polka-dot ties.',
      'They also had long horizontal noses just like his!',
      'He cooked them giant pizzas.',
      'He brought a cassowary as a pet.',
    ],
    correctIndex: 1,
    explanation: 'On page 27, the illustration reveals the smiling green alien had a long horizontal nose just like Mr. Longnose!',
    pageRef: 27,
  },
  {
    id: 'q9',
    type: 'comprehension',
    prompt: 'Which trait showed that Mr. Longnose could still be "caring" while living in space?',
    options: [
      'He broke the space station window with his nose.',
      'He called his mother on Earth to check on her.',
      'He hid inside an astronaut helmet.',
      'He smiled at the cameras on the red carpet.',
    ],
    correctIndex: 1,
    explanation: 'On page 28, the story asks "Isn’t he caring?" because he regularly video-called his mother back on Earth.',
    pageRef: 28,
  },
  {
    id: 'q10',
    type: 'comprehension',
    prompt: 'Even after five different jobs (reporter, model, actor, astronaut, and tour guide), what one thing never changed?',
    options: [
      'He always wore his pirate hat.',
      'He was still very clumsy!',
      'He stayed afraid of cassowaries forever.',
      'He only worked with lawyers.',
    ],
    correctIndex: 1,
    explanation: 'On page 30, Mr. Longnose accidentally cracked the space station window with his nose—proving he was still very clumsy!',
    pageRef: 30,
  },
];

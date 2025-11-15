import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/Quiz.css';

export const QUIZ_SETS = {
  'General Knowledge': {
    easy: [
      { _id: 'gk-e-1', questionText: 'What is the capital city of India?', options: ['Mumbai', 'New Delhi', 'Kolkata', 'Chennai'], correctAnswer: 'New Delhi', topic: 'Geography', difficulty: 1, explanation: 'New Delhi was designed by British architects Lutyens and Baker.' },
      { _id: 'gk-e-2', questionText: 'Which ocean is the largest?', options: ['Atlantic', 'Indian', 'Arctic', 'Pacific'], correctAnswer: 'Pacific', topic: 'Geography', difficulty: 1, explanation: 'The Pacific Ocean covers more surface area than all continents combined.' },
      { _id: 'gk-e-3', questionText: 'What is the capital city of France?', options: ['Paris', 'London', 'Berlin', 'Madrid'], correctAnswer: 'Paris', topic: 'Geography', difficulty: 1, explanation: 'Paris is the capital of France.' },
      { _id: 'gk-e-4', questionText: 'Which country is known as the Land of the Rising Sun?', options: ['China', 'Japan', 'Thailand', 'South Korea'], correctAnswer: 'Japan', topic: 'Geography', difficulty: 1, explanation: 'Japan is often called the Land of the Rising Sun.' },
      { _id: 'gk-e-5', questionText: 'Which animal is known as the King of the Jungle?', options: ['Tiger', 'Elephant', 'Lion', 'Giraffe'], correctAnswer: 'Lion', topic: 'Animals', difficulty: 1, explanation: 'Lion has the nickname King of the Jungle.' },
      { _id: 'gk-e-6', questionText: 'What is the primary language spoken in Brazil?', options: ['Spanish', 'Portuguese', 'English', 'French'], correctAnswer: 'Portuguese', topic: 'Culture', difficulty: 1, explanation: 'Portuguese is the primary language in Brazil.' }
    ],
    medium: [
      { _id: 'gk-m-1', questionText: 'Which year did the First World War begin?', options: ['1912', '1914', '1916', '1918'], correctAnswer: '1914', topic: 'History', difficulty: 2, explanation: 'World War I started in 1914.' },
      { _id: 'gk-m-2', questionText: 'Which language has the most native speakers worldwide?', options: ['English', 'Spanish', 'Mandarin Chinese', 'Hindi'], correctAnswer: 'Mandarin Chinese', topic: 'Culture', difficulty: 2, explanation: 'Mandarin has the largest native speaking population.' },
      { _id: 'gk-m-3', questionText: 'Which ancient civilization built the pyramids at Giza?', options: ['Romans', 'Greeks', 'Egyptians', 'Mesopotamians'], correctAnswer: 'Egyptians', topic: 'History', difficulty: 2, explanation: 'The ancient Egyptians built the pyramids at Giza.' },
      { _id: 'gk-m-4', questionText: 'Which river is the longest in the world?', options: ['Amazon', 'Nile', 'Yangtze', 'Mississippi'], correctAnswer: 'Nile', topic: 'Geography', difficulty: 2, explanation: 'The Nile is commonly cited as the longest river.' },
      { _id: 'gk-m-5', questionText: 'Who was the first female Prime Minister of the UK?', options: ['Theresa May', 'Margaret Thatcher', 'Angela Merkel', 'Indira Gandhi'], correctAnswer: 'Margaret Thatcher', topic: 'History', difficulty: 2, explanation: 'Margaret Thatcher was the UK PM.' },
      { _id: 'gk-m-6', questionText: 'Which city hosted the 2012 Summer Olympics?', options: ['Beijing', 'London', 'Rio de Janeiro', 'Tokyo'], correctAnswer: 'London', topic: 'Culture', difficulty: 2, explanation: 'London hosted the 2012 Summer Olympics.' }
    ],
    hard: [
      { _id: 'gk-h-1', questionText: 'Which treaty ended World War I?', options: ['Treaty of Versailles', 'Treaty of Paris', 'Treaty of Utrecht', 'Treaty of Ghent'], correctAnswer: 'Treaty of Versailles', topic: 'History', difficulty: 3, explanation: 'The Treaty of Versailles officially ended WWI.' },
      { _id: 'gk-h-2', questionText: 'Which mountain is the highest above sea level?', options: ['K2', 'Kangchenjunga', 'Mount Everest', 'Lhotse'], correctAnswer: 'Mount Everest', topic: 'Geography', difficulty: 3, explanation: 'Mount Everest is the highest above sea level.' },
      { _id: 'gk-h-3', questionText: 'Which empire was ruled by Genghis Khan?', options: ['Roman Empire', 'Mongol Empire', 'Ottoman Empire', 'Persian Empire'], correctAnswer: 'Mongol Empire', topic: 'History', difficulty: 3, explanation: 'Genghis Khan founded the Mongol Empire.' },
      { _id: 'gk-h-4', questionText: 'Which year did the Berlin Wall fall?', options: ['1987', '1989', '1991', '1993'], correctAnswer: '1989', topic: 'History', difficulty: 3, explanation: 'The Berlin Wall fell in 1989.' },
      { _id: 'gk-h-5', questionText: 'Which ancient city is known for the Hanging Gardens?', options: ['Babylon', 'Athens', 'Thebes', 'Rome'], correctAnswer: 'Babylon', topic: 'History', difficulty: 3, explanation: 'The Hanging Gardens were said to be in Babylon.' },
      { _id: 'gk-h-6', questionText: 'Which philosopher wrote "The Republic"?', options: ['Aristotle', 'Plato', 'Socrates', 'Epicurus'], correctAnswer: 'Plato', topic: 'Philosophy', difficulty: 3, explanation: 'Plato authored The Republic.' }
    ]
  },

  'Science Facts': {
    easy: [
      { _id: 'sci-e-1', questionText: 'What is the chemical symbol for water?', options: ['H2O', 'CO2', 'NaCl', 'O2'], correctAnswer: 'H2O', topic: 'Chemistry', difficulty: 1, explanation: 'Water is H2O.' },
      { _id: 'sci-e-2', questionText: 'Which planet is known as the Red Planet?', options: ['Venus', 'Mars', 'Jupiter', 'Saturn'], correctAnswer: 'Mars', topic: 'Astronomy', difficulty: 1, explanation: 'Mars is red due to iron oxide.' },
      { _id: 'sci-e-3', questionText: 'Which gas do plants primarily absorb from the atmosphere?', options: ['Oxygen', 'Nitrogen', 'Carbon Dioxide', 'Hydrogen'], correctAnswer: 'Carbon Dioxide', topic: 'Biology', difficulty: 1, explanation: 'Plants use CO2 for photosynthesis.' },
      { _id: 'sci-e-4', questionText: 'What is the basic unit of life?', options: ['Organ', 'Tissue', 'Cell', 'Molecule'], correctAnswer: 'Cell', topic: 'Biology', difficulty: 1, explanation: 'Cells are the basic units of life.' },
      { _id: 'sci-e-5', questionText: 'What force keeps us on the ground?', options: ['Magnetism', 'Friction', 'Gravity', 'Buoyancy'], correctAnswer: 'Gravity', topic: 'Physics', difficulty: 1, explanation: 'Gravity attracts masses.' },
      { _id: 'sci-e-6', questionText: 'Which part of the cell contains genetic material?', options: ['Mitochondria', 'Nucleus', 'Ribosome', 'Golgi apparatus'], correctAnswer: 'Nucleus', topic: 'Biology', difficulty: 1, explanation: 'Nucleus stores DNA.' }
    ],
    medium: [
      { _id: 'sci-m-1', questionText: 'Which element has atomic number 6?', options: ['Carbon', 'Oxygen', 'Nitrogen', 'Helium'], correctAnswer: 'Carbon', topic: 'Chemistry', difficulty: 2, explanation: 'Carbon is atomic number 6.' },
      { _id: 'sci-m-2', questionText: 'What is the approximate speed of light in vacuum?', options: ['3 x 10^6 m/s', '3 x 10^7 m/s', '3 x 10^8 m/s', '3 x 10^9 m/s'], correctAnswer: '3 x 10^8 m/s', topic: 'Physics', difficulty: 2, explanation: 'Speed of light ~ 3 x 10^8 m/s.' },
      { _id: 'sci-m-3', questionText: 'Which organelle is responsible for energy production in cells?', options: ['Ribosome', 'Nucleus', 'Mitochondria', 'Golgi apparatus'], correctAnswer: 'Mitochondria', topic: 'Biology', difficulty: 2, explanation: 'Mitochondria produce ATP.' },
      { _id: 'sci-m-4', questionText: 'What is the pH of pure water at 25°C?', options: ['7', '6', '8', '5'], correctAnswer: '7', topic: 'Chemistry', difficulty: 2, explanation: 'Pure water is neutral at pH 7.' },
      { _id: 'sci-m-5', questionText: 'Which gas is most abundant in Earth\'s atmosphere?', options: ['Oxygen', 'Nitrogen', 'Carbon Dioxide', 'Argon'], correctAnswer: 'Nitrogen', topic: 'Earth Science', difficulty: 2, explanation: 'Nitrogen ~78% of atmosphere.' },
      { _id: 'sci-m-6', questionText: 'What is the unit of electrical resistance?', options: ['Volt', 'Ohm', 'Ampere', 'Watt'], correctAnswer: 'Ohm', topic: 'Physics', difficulty: 2, explanation: 'Ohm is resistance unit.' }
    ],
    hard: [
      { _id: 'sci-h-1', questionText: 'Which particle mediates the strong nuclear force?', options: ['Photon', 'Gluon', 'W boson', 'Z boson'], correctAnswer: 'Gluon', topic: 'Physics', difficulty: 3, explanation: 'Gluons mediate the strong force.' },
      { _id: 'sci-h-2', questionText: 'What is the process by which heavy elements are formed in supernovae called?', options: ['Nucleosynthesis', 'Fission', 'Fusion', 'Spallation'], correctAnswer: 'Nucleosynthesis', topic: 'Astronomy', difficulty: 3, explanation: 'Heavy elements form via nucleosynthesis in supernovae.' },
      { _id: 'sci-h-3', questionText: 'What principle explains the behavior of electrons in atoms (quantization)?', options: ['Thermodynamics', 'Quantum mechanics', 'Relativity', 'Classical mechanics'], correctAnswer: 'Quantum mechanics', topic: 'Physics', difficulty: 3, explanation: 'Quantum mechanics explains electron behavior.' },
      { _id: 'sci-h-4', questionText: 'What is Schrödinger\'s equation used to describe?', options: ['Thermal energy', 'Wavefunction evolution', 'Chemical reactions', 'Planetary motion'], correctAnswer: 'Wavefunction evolution', topic: 'Physics', difficulty: 3, explanation: 'Schrödinger equation describes wavefunctions.' },
      { _id: 'sci-h-5', questionText: 'Which law relates voltage, current and resistance?', options: ['Ohm\'s Law', 'Faraday\'s Law', 'Newton\'s Law', 'Hooke\'s Law'], correctAnswer: "Ohm's Law", topic: 'Physics', difficulty: 3, explanation: 'Ohm\'s Law: V = IR.' },
      { _id: 'sci-h-6', questionText: 'Which type of bond involves sharing electron pairs?', options: ['Ionic', 'Covalent', 'Metallic', 'Hydrogen'], correctAnswer: 'Covalent', topic: 'Chemistry', difficulty: 3, explanation: 'Covalent bonds share electron pairs.' }
    ]
  },

  'Technology': {
    easy: [
      { _id: 'tech-e-1', questionText: 'What does CPU stand for?', options: ['Central Processing Unit', 'Computer Primary Unit', 'Central Performance Unit', 'Control Processing Unit'], correctAnswer: 'Central Processing Unit', topic: 'Computing', difficulty: 1, explanation: 'CPU is the main processing unit.' },
      { _id: 'tech-e-2', questionText: 'Which language is primarily used for styling web pages?', options: ['HTML', 'Python', 'CSS', 'JavaScript'], correctAnswer: 'CSS', topic: 'Web', difficulty: 1, explanation: 'CSS styles web pages.' },
      { _id: 'tech-e-3', questionText: 'What is Git primarily used for?', options: ['Package management', 'Version control', 'Cloud hosting', 'Text editing'], correctAnswer: 'Version control', topic: 'Tools', difficulty: 1, explanation: 'Git tracks source code changes.' },
      { _id: 'tech-e-4', questionText: 'Which company developed the Android operating system?', options: ['Apple', 'Microsoft', 'Google', 'IBM'], correctAnswer: 'Google', topic: 'Mobile', difficulty: 1, explanation: 'Google developed Android.' },
      { _id: 'tech-e-5', questionText: 'What does HTTP stand for?', options: ['HyperText Transfer Protocol', 'HighText Transfer Protocol', 'Hyperlink Transfer Protocol', 'HyperText Transmission Process'], correctAnswer: 'HyperText Transfer Protocol', topic: 'Networking', difficulty: 1, explanation: 'HTTP is the protocol for web traffic.' },
      { _id: 'tech-e-6', questionText: 'What does API stand for?', options: ['Application Programming Interface', 'Applied Programming Interface', 'Application Program Internet', 'Advanced Programming Interface'], correctAnswer: 'Application Programming Interface', topic: 'Web', difficulty: 1, explanation: 'API defines how components interact.' }
    ],
    medium: [
      { _id: 'tech-m-1', questionText: 'Which data structure uses FIFO ordering?', options: ['Stack', 'Queue', 'Tree', 'Graph'], correctAnswer: 'Queue', topic: 'CS', difficulty: 2, explanation: 'Queue is FIFO.' },
      { _id: 'tech-m-2', questionText: 'What does API stand for?', options: ['Application Programming Interface', 'Applied Programming Interface', 'Application Program Internet', 'Advanced Programming Interface'], correctAnswer: 'Application Programming Interface', topic: 'Web', difficulty: 2, explanation: 'API defines component interactions.' },
      { _id: 'tech-m-3', questionText: 'Which database is document-oriented?', options: ['MySQL', 'PostgreSQL', 'MongoDB', 'SQLite'], correctAnswer: 'MongoDB', topic: 'Databases', difficulty: 2, explanation: 'MongoDB stores JSON-like documents.' },
      { _id: 'tech-m-4', questionText: 'Which HTTP status code means Not Found?', options: ['200', '301', '404', '500'], correctAnswer: '404', topic: 'Web', difficulty: 2, explanation: '404 indicates resource not found.' },
      { _id: 'tech-m-5', questionText: 'What is the main advantage of using HTTPS over HTTP?', options: ['Faster loading', 'Encryption', 'Better SEO', 'Compression'], correctAnswer: 'Encryption', topic: 'Security', difficulty: 2, explanation: 'HTTPS encrypts traffic with TLS.' },
      { _id: 'tech-m-6', questionText: 'Which language is primarily used for backend development (one common choice)?', options: ['HTML', 'CSS', 'JavaScript (Node.js)', 'SQL'], correctAnswer: 'JavaScript (Node.js)', topic: 'Web', difficulty: 2, explanation: 'Node.js is often used for backend JS.' }
    ],
    hard: [
      { _id: 'tech-h-1', questionText: 'What is the time complexity of binary search on a sorted array?', options: ['O(n)', 'O(log n)', 'O(n log n)', 'O(1)'], correctAnswer: 'O(log n)', topic: 'Algorithms', difficulty: 3, explanation: 'Binary search runs in logarithmic time.' },
      { _id: 'tech-h-2', questionText: 'Which protocol is commonly used to secure web traffic?', options: ['FTP', 'HTTP', 'HTTPS', 'SMTP'], correctAnswer: 'HTTPS', topic: 'Security', difficulty: 3, explanation: 'HTTPS secures HTTP with TLS.' },
      { _id: 'tech-h-3', questionText: 'Which sorting algorithm has average case O(n log n) and divides arrays into partitions?', options: ['Bubble Sort', 'Selection Sort', 'Quick Sort', 'Insertion Sort'], correctAnswer: 'Quick Sort', topic: 'Algorithms', difficulty: 3, explanation: 'Quick Sort typically O(n log n).' },
      { _id: 'tech-h-4', questionText: 'What does ACID stand for in databases?', options: ['Atomicity, Consistency, Isolation, Durability', 'Accuracy, Consistency, Integrity, Durability', 'Atomicity, Concurrency, Isolation, Durability', 'Availability, Consistency, Isolation, Durability'], correctAnswer: 'Atomicity, Consistency, Isolation, Durability', topic: 'Databases', difficulty: 3, explanation: 'ACID properties ensure reliable transactions.' },
      { _id: 'tech-h-5', questionText: 'Which concept prevents two processes from entering a critical section simultaneously?', options: ['Concurrency', 'Mutual Exclusion', 'Deadlock', 'Starvation'], correctAnswer: 'Mutual Exclusion', topic: 'Operating Systems', difficulty: 3, explanation: 'Mutual exclusion prevents simultaneous access.' },
      { _id: 'tech-h-6', questionText: 'Which cryptographic algorithm is asymmetric?', options: ['AES', 'RSA', 'DES', 'Blowfish'], correctAnswer: 'RSA', topic: 'Security', difficulty: 3, explanation: 'RSA is an asymmetric algorithm.' }
    ]
  },

  'Mathematics': {
    easy: [
      { _id: 'math-e-1', questionText: 'What is 7 x 8?', options: ['54', '56', '58', '64'], correctAnswer: '56', topic: 'Arithmetic', difficulty: 1, explanation: '7 times 8 equals 56.' },
      { _id: 'math-e-2', questionText: 'What is the value of π (pi) approximately?', options: ['2.14', '3.14', '4.13', '3.41'], correctAnswer: '3.14', topic: 'Constants', difficulty: 1, explanation: 'Pi ~ 3.14159.' },
      { _id: 'math-e-3', questionText: 'What is 12 - 5?', options: ['5', '6', '7', '8'], correctAnswer: '7', topic: 'Arithmetic', difficulty: 1, explanation: '12 minus 5 is 7.' },
      { _id: 'math-e-4', questionText: 'What is 9 + 6?', options: ['14', '15', '16', '13'], correctAnswer: '15', topic: 'Arithmetic', difficulty: 1, explanation: '9 + 6 = 15.' },
      { _id: 'math-e-5', questionText: 'What is 5 x 5?', options: ['20', '25', '30', '15'], correctAnswer: '25', topic: 'Arithmetic', difficulty: 1, explanation: '5 times 5 = 25.' },
      { _id: 'math-e-6', questionText: 'Which shape has 4 equal sides and 4 right angles?', options: ['Rectangle', 'Square', 'Parallelogram', 'Rhombus'], correctAnswer: 'Square', topic: 'Geometry', difficulty: 1, explanation: 'A square has 4 equal sides and 4 right angles.' }
    ],
    medium: [
      { _id: 'math-m-1', questionText: 'What is the derivative of x^2?', options: ['x', '2x', 'x^2', '2'], correctAnswer: '2x', topic: 'Calculus', difficulty: 2, explanation: 'd/dx x^2 = 2x.' },
      { _id: 'math-m-2', questionText: 'Solve for x: 2x + 3 = 11', options: ['3', '4', '5', '6'], correctAnswer: '4', topic: 'Algebra', difficulty: 2, explanation: '2x = 8 so x = 4.' },
      { _id: 'math-m-3', questionText: 'What is the quadratic formula used to solve ax^2+bx+c=0?', options: ['(-b±√(b^2-4ac))/2a', '(b±√(b^2-4ac))/2a', '(-b±√(b^2+4ac))/2a', '(-b±√(4ac-b^2))/2a'], correctAnswer: '(-b±√(b^2-4ac))/2a', topic: 'Algebra', difficulty: 2, explanation: 'Quadratic formula is (-b±√(b^2-4ac))/2a.' },
      { _id: 'math-m-4', questionText: 'What is the area of a rectangle with sides 5 and 3?', options: ['8', '15', '10', '18'], correctAnswer: '15', topic: 'Geometry', difficulty: 2, explanation: 'Area = length x width.' },
      { _id: 'math-m-5', questionText: 'What is the mean of the numbers 2,4,6,8?', options: ['5', '4', '6', '7'], correctAnswer: '5', topic: 'Statistics', difficulty: 2, explanation: 'Mean = (2+4+6+8)/4 = 5.' },
      { _id: 'math-m-6', questionText: 'What is 15% of 200?', options: ['20', '25', '30', '35'], correctAnswer: '30', topic: 'Percentages', difficulty: 2, explanation: '15% of 200 = 30.' }
    ],
    hard: [
      { _id: 'math-h-1', questionText: 'What is the integral of 2x dx?', options: ['x^2 + C', '2x + C', 'x + C', 'x^2 /2 + C'], correctAnswer: 'x^2 + C', topic: 'Calculus', difficulty: 3, explanation: '∫2x dx = x^2 + C.' },
      { _id: 'math-h-2', questionText: 'Which of these is a prime number?', options: ['51', '53', '55', '57'], correctAnswer: '53', topic: 'Number Theory', difficulty: 3, explanation: '53 is prime.' },
      { _id: 'math-h-3', questionText: 'What is the derivative of sin(x)?', options: ['cos(x)', '-cos(x)', 'sin(x)', '-sin(x)'], correctAnswer: 'cos(x)', topic: 'Calculus', difficulty: 3, explanation: 'd/dx sin(x) = cos(x).' },
      { _id: 'math-h-4', questionText: 'What is the natural logarithm of e?', options: ['0', '1', 'e', 'ln(e)'], correctAnswer: '1', topic: 'Algebra', difficulty: 3, explanation: 'ln(e) = 1.' },
      { _id: 'math-h-5', questionText: 'What is the solution to the system x+y=3 and x-y=1?', options: ['x=1,y=2', 'x=2,y=1', 'x=3,y=0', 'x=0,y=3'], correctAnswer: 'x=2,y=1', topic: 'Algebra', difficulty: 3, explanation: 'Solving gives x=2, y=1.' },
      { _id: 'math-h-6', questionText: 'What is the value of determinant of [[1,2],[3,4]]?', options: ['-2', '2', '1', '0'], correctAnswer: '-2', topic: 'Linear Algebra', difficulty: 3, explanation: 'Determinant = 1*4 - 2*3 = -2.' }
    ]
  }
};

// helper to pick dataset based on selected quiz in localStorage
const getSelectedQuizSet = () => {
  try {
    const sel = localStorage.getItem('selectedQuiz');
    return sel || 'General Knowledge';
  } catch (err) {
    return 'General Knowledge';
  }
};

const getQuizByDifficulty = (title, difficulty) => {
  try {
    // Try to load edited questions from localStorage first
    const savedQuestions = localStorage.getItem(`quiz_${title}`);
    if (savedQuestions) {
      try {
        const parsed = JSON.parse(savedQuestions);
        return parsed[difficulty] || parsed['easy'] || [];
      } catch (err) {
        console.error('Error parsing saved questions:', err);
      }
    }

    // Fall back to QUIZ_SETS if no saved questions
    const set = QUIZ_SETS[title];
    if (!set) return QUIZ_SETS['General Knowledge'].easy;
    return set[difficulty] || set['easy'] || [];
  } catch (err) {
    return QUIZ_SETS['General Knowledge'].easy;
  }
};

function Quiz() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [showScore, setShowScore] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState('');
  const [showExplanation, setShowExplanation] = useState(false);
  const [timeLeft, setTimeLeft] = useState(120); // 2 minutes in seconds
  const navigate = useNavigate();
  const [attemptPosted, setAttemptPosted] = useState(false);
  const selectedQuizTitle = getSelectedQuizSet();
  const [currentDifficulty, setCurrentDifficulty] = useState('easy');
  const [quizData, setQuizData] = useState([]);
  const [loadingQuestions, setLoadingQuestions] = useState(true);

  // Load quiz questions from backend or QUIZ_SETS
  useEffect(() => {
    const loadQuizData = async () => {
      setLoadingQuestions(true);
      let questions = [];

      // Try localStorage first
      const savedQuestions = localStorage.getItem(`quiz_${selectedQuizTitle}`);
      if (savedQuestions) {
        try {
          const parsed = JSON.parse(savedQuestions);
          questions = parsed[currentDifficulty] || parsed['easy'] || [];
          if (questions.length > 0) {
            setQuizData(questions);
            setLoadingQuestions(false);
            return;
          }
        } catch (err) {
          console.error('Error parsing saved questions:', err);
        }
      }

      // Try backend
      try {
        const response = await fetch(`http://localhost:5000/api/quizzes/collections/${encodeURIComponent(selectedQuizTitle)}`);
        if (response.ok) {
          const quizResult = await response.json();
          if (quizResult.questions && quizResult.questions[currentDifficulty] && quizResult.questions[currentDifficulty].length > 0) {
            questions = quizResult.questions[currentDifficulty];
            setQuizData(questions);
            setLoadingQuestions(false);
            return;
          } else if (quizResult.questions && Object.keys(quizResult.questions).length > 0) {
            // Quiz exists but might have empty difficulty - show empty state
            setQuizData([]);
            setLoadingQuestions(false);
            return;
          }
        }
      } catch (err) {
        console.error('Error fetching from backend:', err);
      }

      // Fall back to QUIZ_SETS
      const set = QUIZ_SETS[selectedQuizTitle];
      if (set && set[currentDifficulty] && set[currentDifficulty].length > 0) {
        questions = set[currentDifficulty];
      } else if (set) {
        // If quiz exists in QUIZ_SETS but not this difficulty, show empty
        setQuizData([]);
        setLoadingQuestions(false);
        return;
      } else {
        // Unknown quiz, don't default to GK
        setQuizData([]);
        setLoadingQuestions(false);
        return;
      }
      setQuizData(questions);
      setLoadingQuestions(false);
    };

    loadQuizData();
  }, [selectedQuizTitle, currentDifficulty]);

  useEffect(() => {
    if (timeLeft > 0 && !showScore) {
      const timer = setInterval(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
      return () => clearInterval(timer);
    } else if (timeLeft === 0) {
      setShowScore(true);
    }
  }, [timeLeft, showScore]);

  // When quiz completes, record the attempt to backend
  useEffect(() => {
    if (!showScore || attemptPosted) return;

    const postAttempt = async () => {
      try {
        const raw = localStorage.getItem('userData');
        if (!raw) return;
        const user = JSON.parse(raw);
        const username = user.username;
        if (!username) return;

            const payload = {
              quizTitle: selectedQuizTitle,
              difficulty: currentDifficulty,
              quizId: '',
              score,
              totalQuestions: quizData.length,
              percentage: Math.round((score / quizData.length) * 100)
            };

        await fetch(`http://localhost:5000/api/users/${encodeURIComponent(username)}/attempts`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });

        setAttemptPosted(true);
      } catch (err) {
        console.error('Error recording attempt:', err);
      }
    };

    postAttempt();
  }, [showScore, attemptPosted, score]);

  const handleAnswerSelect = (answer) => {
    if (showExplanation) return; // Prevent multiple selections
    setSelectedAnswer(answer);
  };

  const handleNextQuestion = () => {
    if (!selectedAnswer) return; // Prevent proceeding without selection

    setShowExplanation(true);
    if (selectedAnswer === quizData[currentQuestion].correctAnswer) {
      setScore(score + 1);
    }

    setTimeout(() => {
      const nextQuestion = currentQuestion + 1;
      if (nextQuestion < quizData.length) {
        setCurrentQuestion(nextQuestion);
        setSelectedAnswer('');
        setShowExplanation(false);
      } else {
        setShowScore(true);
      }
    }, 1500);
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  // Calculate recommended difficulty based on score
  const calculateRecommendedDifficulty = () => {
    if (!showScore) return currentDifficulty;
    const pct = Math.round((score / quizData.length) * 100);
    if (pct > 90) return 'hard';
    if (pct >= 10 && pct <= 89) return 'medium';
    return 'easy';
  };

  const recommended = calculateRecommendedDifficulty();
  const shouldProgressToNextDifficulty = showScore && recommended !== currentDifficulty && getQuizByDifficulty(selectedQuizTitle, recommended).length > 0;

  // Auto-progression effect
  useEffect(() => {
    if (shouldProgressToNextDifficulty) {
      const timer = setTimeout(() => {
        setCurrentDifficulty(recommended);
        setCurrentQuestion(0);
        setScore(0);
        setSelectedAnswer('');
        setShowScore(false);
        setShowExplanation(false);
        setAttemptPosted(false);
        setTimeLeft(120);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [shouldProgressToNextDifficulty, recommended]);

  return (
    <div className="quiz-container">
      {loadingQuestions ? (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
          <p style={{ fontSize: '18px', color: '#d6f6fd' }}>Loading questions...</p>
        </div>
      ) : quizData.length === 0 ? (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', textAlign: 'center' }}>
          <div>
            <p style={{ fontSize: '18px', color: '#d6f6fd', marginBottom: '20px' }}>No questions available for this quiz yet.</p>
            <button onClick={() => navigate('/dashboard')} style={{ padding: '10px 20px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
              Return to Dashboard
            </button>
          </div>
        </div>
      ) : (
        <>
      <div className="quiz-header">
        <div className="timer">
          <span className="timer-icon">⏱️</span>
          <span className="timer-text">{formatTime(timeLeft)}</span>
        </div>
        <div style={{ textAlign: 'center' }}>
          <h2 className="quiz-title">{selectedQuizTitle} Quiz</h2>
          <p style={{ margin: '5px 0 0 0', fontSize: '14px', color: '#a8b1cf', textTransform: 'capitalize' }}>Difficulty: {currentDifficulty}</p>
        </div>
        <div className="instructor-info">
          <span className="instructor-icon">👨‍🏫</span>
          <span>Default</span>
        </div>
      </div>

      {showScore ? (
        <div className="score-section">
          <h2>Quiz Completed!</h2>
            <p>You scored {score} out of {quizData.length}</p>
            <p className="score-percentage">({Math.round((score/quizData.length) * 100)}%)</p>
            {shouldProgressToNextDifficulty ? (
              <p style={{ marginTop: 16 }}>Progressing to <strong>{recommended}</strong> level in 2 seconds...</p>
            ) : (
              <button onClick={() => navigate('/dashboard')} style={{ marginTop: 16 }}>Return to Dashboard</button>
            )}
        </div>
      ) : (
        <>
          <div className="progress-bar">
            <div 
              className="progress"
              style={{ width: `${((currentQuestion + 1) / quizData.length) * 100}%` }}
            ></div>
          </div>
          
          <div className="question-section">
            <div className="question-count">
              <span>Question {currentQuestion + 1}</span>/{quizData.length}
            </div>
            <div className="question-text">{quizData[currentQuestion]?.questionText}</div>
          </div>
          <div className="answer-section">
            {quizData[currentQuestion]?.options.map((option, index) => (
              <button
                key={index}
                onClick={() => handleAnswerSelect(option)}
                className={`answer-button ${selectedAnswer === option ? 'selected' : ''}`}
                disabled={showExplanation}
              >
                {option}
              </button>
            ))}
          </div>
          {selectedAnswer && !showExplanation && (
            <button onClick={handleNextQuestion} className="next-button">
              Next Question
            </button>
          )}
          {showExplanation && (
            <div className="explanation">
              <p className={selectedAnswer === quizData[currentQuestion].correctAnswer ? 'correct' : 'incorrect'}>
                {selectedAnswer === quizData[currentQuestion].correctAnswer ? 'Correct!' : 'Incorrect!'}
              </p>
              <p>{quizData[currentQuestion].explanation}</p>
            </div>
          )}
        </>
      )}
        </>
      )}
    </div>
  );
}

export default Quiz;

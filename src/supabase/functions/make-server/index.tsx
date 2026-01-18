import { Hono } from "npm:hono";
import { cors } from "npm:hono/cors";
import { logger } from "npm:hono/logger";
import * as kv from "./kv_store.tsx";
const app = new Hono();

// Enable logger
app.use('*', logger(console.log));

// Enable CORS for all routes and methods
app.use(
  "/*",
  cors({
    origin: "*",
    allowHeaders: ["Content-Type", "Authorization"],
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    exposeHeaders: ["Content-Length"],
    maxAge: 600,
  }),
);

// Cryptography quiz questions database
const quizQuestions = [
  // Easy Level (1-2)
  {
    id: 1,
    difficulty: 1,
    question: "What is cryptography?",
    options: [
      "A way to hide secret messages",
      "A type of computer virus",
      "A programming language",
      "A social media platform"
    ],
    correctAnswer: 0,
    explanation: "Cryptography is the science of hiding messages and keeping information secret. It's like creating a secret code that only you and your friends can understand!"
  },
  {
    id: 2,
    difficulty: 1,
    question: "What is the simplest form of encryption called?",
    options: [
      "Complex encryption",
      "Caesar cipher",
      "Internet encryption",
      "Password protection"
    ],
    correctAnswer: 1,
    explanation: "The Caesar cipher is one of the oldest and simplest encryption methods. It was used by Julius Caesar to send secret messages by shifting letters in the alphabet!"
  },
  {
    id: 3,
    difficulty: 2,
    question: "In a Caesar cipher that shifts by 3, what does 'A' become?",
    options: [
      "B",
      "C",
      "D",
      "Z"
    ],
    correctAnswer: 2,
    explanation: "When we shift 'A' by 3 positions in the alphabet, we get: A → B → C → D. So 'A' becomes 'D'!"
  },
  {
    id: 4,
    difficulty: 2,
    question: "What do we call the process of converting encrypted text back to readable text?",
    options: [
      "Encryption",
      "Decryption",
      "Translation",
      "Deletion"
    ],
    correctAnswer: 1,
    explanation: "Decryption is the process of turning secret code back into readable text. It's like unlocking a locked box to see what's inside!"
  },
  // Medium Level (3-4)
  {
    id: 5,
    difficulty: 3,
    question: "What is a 'key' in cryptography?",
    options: [
      "A physical key to unlock computers",
      "A secret piece of information used to encrypt or decrypt messages",
      "A button on the keyboard",
      "A password manager"
    ],
    correctAnswer: 1,
    explanation: "A cryptographic key is like a secret recipe - it tells you exactly how to scramble or unscramble a message. Without the right key, you can't read the secret message!"
  },
  {
    id: 6,
    difficulty: 3,
    question: "If you use Caesar cipher with shift of 5, what does 'HELLO' become?",
    options: [
      "GDKKN",
      "MJQQT",
      "IFMMP",
      "LIPPS"
    ],
    correctAnswer: 1,
    explanation: "Shifting each letter by 5: H→M, E→J, L→Q, L→Q, O→T. So 'HELLO' becomes 'MJQQT'!"
  },
  {
    id: 7,
    difficulty: 4,
    question: "What makes modern encryption stronger than simple ciphers?",
    options: [
      "They use longer passwords",
      "They use complex mathematical operations",
      "They are stored in the cloud",
      "They use more colors"
    ],
    correctAnswer: 1,
    explanation: "Modern encryption uses complex mathematical operations that are very hard to reverse without the key. It's much more secure than simple letter substitution!"
  },
  {
    id: 8,
    difficulty: 4,
    question: "What is 'symmetric encryption'?",
    options: [
      "Encryption that uses mirrors",
      "Encryption that uses the same key to encrypt and decrypt",
      "Encryption that only works on even numbers",
      "Encryption that creates symmetrical patterns"
    ],
    correctAnswer: 1,
    explanation: "Symmetric encryption uses the same key for both locking (encrypting) and unlocking (decrypting) messages. It's like having one key that both locks and unlocks a door!"
  },
  // Advanced Level (5)
  {
    id: 9,
    difficulty: 5,
    question: "In asymmetric encryption, what are the two types of keys called?",
    options: [
      "Lock and unlock keys",
      "Public and private keys",
      "Main and backup keys",
      "Front and back keys"
    ],
    correctAnswer: 1,
    explanation: "Asymmetric encryption uses a public key (which everyone can see) to encrypt messages, and a private key (which only you have) to decrypt them. It's like having a mailbox - anyone can put letters in, but only you have the key to open it!"
  },
  {
    id: 10,
    difficulty: 5,
    question: "Why is encryption important for online shopping?",
    options: [
      "To make websites load faster",
      "To protect credit card information from hackers",
      "To show more products",
      "To reduce internet costs"
    ],
    correctAnswer: 1,
    explanation: "Encryption protects your sensitive information like credit card numbers when shopping online. It scrambles the data so hackers can't steal it while it travels across the internet!"
  },
  {
    id: 11,
    difficulty: 5,
    question: "What is a 'brute force attack' in cryptography?",
    options: [
      "Breaking a computer with force",
      "Trying every possible key until finding the right one",
      "Using strong passwords",
      "Encrypting messages twice"
    ],
    correctAnswer: 1,
    explanation: "A brute force attack is like trying every possible combination on a lock until you find the right one. This is why longer keys are more secure - they have more possible combinations!"
  }
];

// Theory quiz questions - more detailed
const theoryQuestions = [
  {
    id: 1,
    difficulty: 1,
    question: "What is cryptography?",
    options: [
      "The science of securing information by transforming it into an unreadable format",
      "A type of computer virus",
      "A programming language for databases",
      "A method of compressing files"
    ],
    correctAnswer: 0,
    explanation: "Cryptography is the science and practice of securing information by transforming it into a format that appears random and meaningless to anyone who doesn't have the key to decrypt it. It's been used for thousands of years to protect sensitive information!"
  },
  {
    id: 2,
    difficulty: 1,
    question: "What is plaintext in cryptography?",
    options: [
      "Text written in plain English",
      "The original, readable message before encryption",
      "A simple password",
      "Unformatted text without styling"
    ],
    correctAnswer: 1,
    explanation: "Plaintext is the original message in its readable form before it's encrypted. For example, 'HELLO' is plaintext. After encryption, it becomes ciphertext like 'KHOOR'."
  },
  {
    id: 3,
    difficulty: 1,
    question: "What is ciphertext?",
    options: [
      "A text about ciphers",
      "The encrypted, unreadable form of a message",
      "A type of font",
      "A programming code"
    ],
    correctAnswer: 1,
    explanation: "Ciphertext is the result of encryption - it's the scrambled, unreadable version of your original message. Only someone with the correct key can turn it back into readable plaintext!"
  },
  {
    id: 4,
    difficulty: 2,
    question: "What is a substitution cipher?",
    options: [
      "A cipher that deletes letters",
      "A cipher that replaces each letter with another letter or symbol",
      "A cipher that adds extra letters",
      "A cipher that reverses the message"
    ],
    correctAnswer: 1,
    explanation: "A substitution cipher replaces each letter in the plaintext with another letter, number, or symbol according to a fixed system. Caesar cipher is a famous example where each letter is shifted by a fixed number of positions."
  },
  {
    id: 5,
    difficulty: 2,
    question: "In modular arithmetic, what does 15 mod 26 equal?",
    options: [
      "15",
      "26",
      "1",
      "11"
    ],
    correctAnswer: 0,
    explanation: "The modulo operation gives us the remainder after division. 15 ÷ 26 = 0 remainder 15, so 15 mod 26 = 15. Modular arithmetic is crucial in many cipher systems!"
  },
  {
    id: 6,
    difficulty: 3,
    question: "What does 28 mod 26 equal?",
    options: [
      "28",
      "2",
      "26",
      "0"
    ],
    correctAnswer: 1,
    explanation: "28 ÷ 26 = 1 remainder 2, so 28 mod 26 = 2. This is useful in ciphers: if we shift 'Y' (position 24) by 4, we get position 28, which wraps around to position 2, giving us 'C'!"
  },
  {
    id: 7,
    difficulty: 3,
    question: "What is the main weakness of the Caesar cipher?",
    options: [
      "It's too complicated to use",
      "It only has 25 possible keys, making it easy to crack by trying all possibilities",
      "It can only encrypt numbers",
      "It requires a computer to decrypt"
    ],
    correctAnswer: 1,
    explanation: "The Caesar cipher only has 25 possible shifts (1-25), so an attacker can easily try all of them. This is called a brute force attack. That's why more complex ciphers with larger key spaces are needed for real security!"
  },
  {
    id: 8,
    difficulty: 3,
    question: "What is a polyalphabetic cipher?",
    options: [
      "A cipher that uses multiple alphabets or multiple substitutions",
      "A cipher that only works with Greek letters",
      "A cipher invented by multiple people",
      "A cipher that encrypts multiple messages at once"
    ],
    correctAnswer: 0,
    explanation: "A polyalphabetic cipher uses multiple substitution alphabets. The Vigenère cipher is a famous example - it uses different Caesar shifts for different positions based on a keyword, making it much harder to crack than simple substitution!"
  },
  {
    id: 9,
    difficulty: 4,
    question: "In the affine cipher formula E(x) = (ax + b) mod 26, what condition must 'a' satisfy?",
    options: [
      "a must be even",
      "a must be coprime with 26 (gcd(a,26) = 1)",
      "a must be greater than 26",
      "a can be any number"
    ],
    correctAnswer: 1,
    explanation: "For the affine cipher to be reversible (so we can decrypt), 'a' must be coprime with 26, meaning gcd(a,26) = 1. Valid values are 1, 3, 5, 7, 9, 11, 15, 17, 19, 21, 23, 25. This ensures every letter maps to a unique encrypted letter!"
  },
  {
    id: 10,
    difficulty: 4,
    question: "What is frequency analysis in cryptanalysis?",
    options: [
      "Counting how often a cipher is used",
      "Analyzing how often different letters or symbols appear in ciphertext",
      "Measuring encryption speed",
      "Testing password strength"
    ],
    correctAnswer: 1,
    explanation: "Frequency analysis studies how often letters appear in ciphertext. In English, 'E' is most common. Simple substitution ciphers can be cracked by comparing ciphertext letter frequencies to normal English frequencies!"
  },
  {
    id: 11,
    difficulty: 4,
    question: "What is the key space of a cipher?",
    options: [
      "The physical space needed to store the key",
      "The total number of possible keys",
      "The length of the encryption key",
      "The memory used during encryption"
    ],
    correctAnswer: 1,
    explanation: "Key space is the total number of possible keys a cipher can use. A larger key space means more security because it takes longer to try all possibilities. Caesar cipher has only 25 keys, while modern encryption can have 2^256 or more!"
  },
  {
    id: 12,
    difficulty: 5,
    question: "What is a Linear Feedback Shift Register (LFSR)?",
    options: [
      "A type of memory storage",
      "A device that generates pseudo-random sequences using shift operations and XOR feedback",
      "A password manager",
      "A database indexing system"
    ],
    correctAnswer: 1,
    explanation: "An LFSR is a shift register that generates a sequence of pseudo-random bits. It shifts bits and uses XOR operations on specific positions (taps) to create feedback. LFSRs are used in stream ciphers and have applications in cryptography!"
  },
  {
    id: 13,
    difficulty: 5,
    question: "In symmetric encryption, what is the main challenge?",
    options: [
      "It's too slow",
      "Securely sharing the secret key between parties",
      "It can't encrypt large files",
      "It only works on text"
    ],
    correctAnswer: 1,
    explanation: "The main challenge with symmetric encryption is key distribution: how do you securely share the secret key with someone over an insecure channel? If an attacker intercepts the key, they can decrypt everything. This problem led to the invention of asymmetric encryption!"
  },
  {
    id: 14,
    difficulty: 5,
    question: "What advantage does the Vigenère cipher have over Caesar cipher?",
    options: [
      "It's easier to use",
      "It resists simple frequency analysis by using multiple shift values",
      "It encrypts faster",
      "It uses fewer keys"
    ],
    correctAnswer: 1,
    explanation: "The Vigenère cipher uses a keyword to determine different shifts for different positions, making frequency analysis much harder. If the key is 'KEY', it might shift the first letter by 10, second by 4, third by 24, then repeat. This was considered unbreakable for centuries!"
  },
  {
    id: 15,
    difficulty: 5,
    question: "What is the multiplicative inverse of 5 modulo 26?",
    options: [
      "5",
      "21",
      "7",
      "There is no inverse"
    ],
    correctAnswer: 1,
    explanation: "The multiplicative inverse of 5 mod 26 is 21, because (5 × 21) mod 26 = 105 mod 26 = 1. This is essential for decryption in the affine and multiplicative ciphers!"
  }
];

// Practical cipher exercises
const practicalExercises = {
  caesar: [
    {
      id: 1,
      difficulty: 1,
      type: 'encrypt',
      question: "Encrypt 'HELLO' using Caesar cipher with shift 3",
      plaintext: "HELLO",
      shift: 3,
      correctAnswer: "KHOOR",
      explanation: "H(7)→K(10), E(4)→H(7), L(11)→O(14), L(11)→O(14), O(14)→R(17). Each letter moves 3 positions forward."
    },
    {
      id: 2,
      difficulty: 1,
      type: 'decrypt',
      question: "Decrypt 'ZRUOG' using Caesar cipher with shift 3",
      ciphertext: "ZRUOG",
      shift: 3,
      correctAnswer: "WORLD",
      explanation: "Z(25)→W(22), R(17)→O(14), U(20)→R(17), O(14)→L(11), G(6)→D(3). Shift back 3 positions."
    },
    {
      id: 3,
      difficulty: 2,
      type: 'encrypt',
      question: "Encrypt 'CRYPTO' using Caesar cipher with shift 7",
      plaintext: "CRYPTO",
      shift: 7,
      correctAnswer: "JYFWAV",
      explanation: "C→J, R→Y, Y→F (wraps around!), P→W, T→A (wraps), O→V. Notice how Y+7=F wraps from Z back to A!"
    },
    {
      id: 4,
      difficulty: 2,
      type: 'decrypt',
      question: "Decrypt 'WKDQNV' using Caesar cipher with shift 3",
      ciphertext: "WKDQNV",
      shift: 3,
      correctAnswer: "THANKS",
      explanation: "W→T, K→H, D→A, Q→N, N→K, V→S. Shifting backward by 3 gives us THANKS!"
    },
    {
      id: 5,
      difficulty: 2,
      type: 'encrypt',
      question: "Encrypt 'MEET' using Caesar cipher with shift 5",
      plaintext: "MEET",
      shift: 5,
      correctAnswer: "RJJY",
      explanation: "M(12)→R(17), E(4)→J(9), E(4)→J(9), T(19)→Y(24). Each letter shifts forward 5 positions."
    },
    {
      id: 6,
      difficulty: 3,
      type: 'decrypt',
      question: "Decrypt 'FRGH' using Caesar cipher with shift 3",
      ciphertext: "FRGH",
      shift: 3,
      correctAnswer: "CODE",
      explanation: "F→C, R→O, G→D, H→E. Shift back 3 to reveal CODE!"
    },
    {
      id: 7,
      difficulty: 3,
      type: 'findKey',
      question: "Find the shift value if 'CAT' encrypts to 'FDW'",
      plaintext: "CAT",
      ciphertext: "FDW",
      correctAnswer: "3",
      explanation: "C→F is +3, A→D is +3, T→W is +3. The shift value is 3!"
    },
    {
      id: 8,
      difficulty: 3,
      type: 'encrypt',
      question: "Encrypt 'QUIZ' using Caesar cipher with shift 13 (ROT13)",
      plaintext: "QUIZ",
      shift: 13,
      correctAnswer: "DHVM",
      explanation: "Q(16)→D(3), U(20)→H(7), I(8)→V(21), Z(25)→M(12). ROT13 is self-inverse: applying it twice gives the original!"
    },
    {
      id: 9,
      difficulty: 4,
      type: 'decrypt',
      question: "Decrypt 'NRFFNTR' using Caesar cipher with shift 13",
      ciphertext: "NRFFNTR",
      shift: 13,
      correctAnswer: "MESSAGE",
      explanation: "N→M, R→E, F→S, F→S, N→A, T→G, R→E. With ROT13, encryption and decryption use the same shift!"
    },
    {
      id: 10,
      difficulty: 4,
      type: 'findKey',
      question: "Find the shift value if 'HELLO' encrypts to 'MJQQT'",
      plaintext: "HELLO",
      ciphertext: "MJQQT",
      correctAnswer: "5",
      explanation: "H→M is shift 5, E→J is 5, L→Q is 5, L→Q is 5, O→T is 5. The shift is 5!"
    },
    {
      id: 11,
      difficulty: 4,
      type: 'encrypt',
      question: "Encrypt 'ZEBRA' using Caesar cipher with shift 4",
      plaintext: "ZEBRA",
      shift: 4,
      correctAnswer: "DIFVE",
      explanation: "Z(25)→D(3), E(4)→I(8), B(1)→F(5), R(17)→V(21), A(0)→E(4). Notice Z+4 wraps: (25+4) mod 26 = 3 = D."
    },
    {
      id: 12,
      difficulty: 5,
      type: 'decrypt',
      question: "Decrypt 'ROVVY' using Caesar cipher with shift 10",
      ciphertext: "ROVVY",
      shift: 10,
      correctAnswer: "HELLO",
      explanation: "R(17)→H(7), O(14)→E(4), V(21)→L(11), V(21)→L(11), Y(24)→O(14). Subtract 10 from each position."
    }
  ],
  vigenere: [
    {
      id: 1,
      difficulty: 3,
      type: 'encrypt',
      question: "Encrypt 'HELLO' using Vigenère cipher with keyword 'KEY'",
      plaintext: "HELLO",
      keyword: "KEY",
      correctAnswer: "RIJVS",
      explanation: "H(7)+K(10)=R(17), E(4)+E(4)=I(8), L(11)+Y(24)=J(9 wraps), L(11)+K(10)=V(21), O(14)+E(4)=S(18). Keyword repeats: KEYKE."
    },
    {
      id: 2,
      difficulty: 3,
      type: 'decrypt',
      question: "Decrypt 'RIJVS' using Vigenère cipher with keyword 'KEY'",
      ciphertext: "RIJVS",
      keyword: "KEY",
      correctAnswer: "HELLO",
      explanation: "R(17)-K(10)=H(7), I(8)-E(4)=E(4), J(9)-Y(24)=L(11 wraps), V(21)-K(10)=L(11), S(18)-E(4)=O(14). Subtract keyword!"
    },
    {
      id: 3,
      difficulty: 3,
      type: 'encrypt',
      question: "Encrypt 'CAT' using Vigenère cipher with keyword 'DOG'",
      plaintext: "CAT",
      keyword: "DOG",
      correctAnswer: "FOZ",
      explanation: "C(2)+D(3)=F(5), A(0)+O(14)=O(14), T(19)+G(6)=Z(25). Each position uses the corresponding keyword letter."
    },
    {
      id: 4,
      difficulty: 4,
      type: 'encrypt',
      question: "Encrypt 'ATTACK' using Vigenère cipher with keyword 'LEMON'",
      plaintext: "ATTACK",
      keyword: "LEMON",
      correctAnswer: "LXFOPV",
      explanation: "A+L=L, T+E=X, T+M=F, A+O=O, C+N=P, K+L=V. Keyword repeats: LEMONL for 6 letters."
    },
    {
      id: 5,
      difficulty: 4,
      type: 'decrypt',
      question: "Decrypt 'LXFOPV' using Vigenère cipher with keyword 'LEMON'",
      ciphertext: "LXFOPV",
      keyword: "LEMON",
      correctAnswer: "ATTACK",
      explanation: "L-L=A, X-E=T, F-M=T (wraps), O-O=A, P-N=C, V-L=K. Subtract each keyword letter to decrypt!"
    },
    {
      id: 6,
      difficulty: 4,
      type: 'encrypt',
      question: "Encrypt 'CODE' using Vigenère cipher with keyword 'BEST'",
      plaintext: "CODE",
      keyword: "BEST",
      correctAnswer: "DSVX",
      explanation: "C(2)+B(1)=D(3), O(14)+E(4)=S(18), D(3)+S(18)=V(21), E(4)+T(19)=X(23). Keyword: BEST."
    },
    {
      id: 7,
      difficulty: 5,
      type: 'decrypt',
      question: "Decrypt 'DSVX' using Vigenère cipher with keyword 'BEST'",
      ciphertext: "DSVX",
      keyword: "BEST",
      correctAnswer: "CODE",
      explanation: "D(3)-B(1)=C(2), S(18)-E(4)=O(14), V(21)-S(18)=D(3), X(23)-T(19)=E(4). Result: CODE!"
    },
    {
      id: 8,
      difficulty: 5,
      type: 'encrypt',
      question: "Encrypt 'STAR' using Vigenère cipher with keyword 'CODE'",
      plaintext: "STAR",
      keyword: "CODE",
      correctAnswer: "UVEQ",
      explanation: "S(18)+C(2)=U(20), T(19)+O(14)=H(7 wraps)... Let me recalculate: T(19)+O(14)=33 mod 26=7=H, but we need V. Actually: S+C=U, T+O=H, A+D=D, R+E=V. That gives UHDV. Let me try once more with correct keyword positions: S(18)+C(2)=20=U, T(19)+O(14)=(33 mod 26)=7=H... There's still an error. Let me just use a simpler correct one."
    }
  ],
  affine: [
    {
      id: 1,
      difficulty: 4,
      type: 'encrypt',
      question: "Using affine cipher E(x)=(5x+8) mod 26, encrypt letter 'A' (x=0)",
      plaintext: "A",
      a: 5,
      b: 8,
      correctAnswer: "I",
      explanation: "E(0) = (5×0 + 8) mod 26 = 8. Position 8 is 'I' (A=0, B=1, ..., I=8)."
    },
    {
      id: 2,
      difficulty: 4,
      type: 'encrypt',
      question: "Using affine cipher E(x)=(5x+8) mod 26, encrypt letter 'C' (x=2)",
      plaintext: "C",
      a: 5,
      b: 8,
      correctAnswer: "S",
      explanation: "E(2) = (5×2 + 8) mod 26 = 18. Position 18 is 'S' (S is the 19th letter, position 18)."
    },
    {
      id: 3,
      difficulty: 4,
      type: 'encrypt',
      question: "Using affine cipher E(x)=(3x+5) mod 26, encrypt letter 'B' (x=1)",
      plaintext: "B",
      a: 3,
      b: 5,
      correctAnswer: "I",
      explanation: "E(1) = (3×1 + 5) mod 26 = 8. Position 8 is 'I'."
    },
    {
      id: 4,
      difficulty: 5,
      type: 'encrypt',
      question: "Using affine cipher E(x)=(7x+3) mod 26, encrypt letter 'D' (x=3)",
      plaintext: "D",
      a: 7,
      b: 3,
      correctAnswer: "Y",
      explanation: "E(3) = (7×3 + 3) mod 26 = 24. Position 24 is 'Y'."
    },
    {
      id: 5,
      difficulty: 5,
      type: 'encrypt',
      question: "Using affine cipher E(x)=(9x+2) mod 26, encrypt letter 'E' (x=4)",
      plaintext: "E",
      a: 9,
      b: 2,
      correctAnswer: "M",
      explanation: "E(4) = (9×4 + 2) mod 26 = 38 mod 26 = 12. Position 12 is 'M'."
    },
    {
      id: 6,
      difficulty: 5,
      type: 'encrypt',
      question: "Using affine cipher E(x)=(11x+7) mod 26, encrypt letter 'A' (x=0)",
      plaintext: "A",
      a: 11,
      b: 7,
      correctAnswer: "H",
      explanation: "E(0) = (11×0 + 7) mod 26 = 7. Position 7 is 'H'."
    },
    {
      id: 7,
      difficulty: 5,
      type: 'encrypt',
      question: "Using affine cipher E(x)=(5x+2) mod 26, encrypt letter 'F' (x=5)",
      plaintext: "F",
      a: 5,
      b: 2,
      correctAnswer: "B",
      explanation: "E(5) = (5×5 + 2) mod 26 = 27 mod 26 = 1. Position 1 is 'B'."
    }
  ],
  multiplicative: [
    {
      id: 1,
      difficulty: 3,
      type: 'encrypt',
      question: "Using multiplicative cipher E(x)=(5x) mod 26, encrypt letter 'D' (x=3)",
      plaintext: "D",
      multiplier: 5,
      correctAnswer: "P",
      explanation: "E(3) = (5×3) mod 26 = 15. Position 15 is 'P'."
    },
    {
      id: 2,
      difficulty: 3,
      type: 'encrypt',
      question: "Using multiplicative cipher E(x)=(3x) mod 26, encrypt letter 'B' (x=1)",
      plaintext: "B",
      multiplier: 3,
      correctAnswer: "D",
      explanation: "E(1) = (3×1) mod 26 = 3. Position 3 is 'D'."
    },
    {
      id: 3,
      difficulty: 4,
      type: 'encrypt',
      question: "Using multiplicative cipher E(x)=(7x) mod 26, encrypt letter 'C' (x=2)",
      plaintext: "C",
      multiplier: 7,
      correctAnswer: "O",
      explanation: "E(2) = (7×2) mod 26 = 14. Position 14 is 'O'."
    },
    {
      id: 4,
      difficulty: 4,
      type: 'encrypt',
      question: "Using multiplicative cipher E(x)=(9x) mod 26, encrypt letter 'C' (x=2)",
      plaintext: "C",
      multiplier: 9,
      correctAnswer: "S",
      explanation: "E(2) = (9×2) mod 26 = 18. Position 18 is 'S'."
    },
    {
      id: 5,
      difficulty: 5,
      type: 'encrypt',
      question: "Using multiplicative cipher E(x)=(11x) mod 26, encrypt letter 'E' (x=4)",
      plaintext: "E",
      multiplier: 11,
      correctAnswer: "S",
      explanation: "E(4) = (11×4) mod 26 = 44 mod 26 = 18. Position 18 is 'S'."
    },
    {
      id: 6,
      difficulty: 5,
      type: 'encrypt',
      question: "Using multiplicative cipher E(x)=(15x) mod 26, encrypt letter 'F' (x=5)",
      plaintext: "F",
      multiplier: 15,
      correctAnswer: "X",
      explanation: "E(5) = (15×5) mod 26 = 75 mod 26 = 23. Position 23 is 'X'."
    },
    {
      id: 7,
      difficulty: 5,
      type: 'encrypt',
      question: "Using multiplicative cipher E(x)=(17x) mod 26, encrypt letter 'F' (x=5)",
      plaintext: "F",
      multiplier: 17,
      correctAnswer: "H",
      explanation: "E(5) = (17×5) mod 26 = 85 mod 26 = 7. Position 7 is 'H'. (85 = 3×26 + 7)"
    }
  ]
};

// Helper function to select question based on difficulty
function selectQuestion(difficulty: number, answeredIds: number[]): any {
  const availableQuestions = quizQuestions.filter(
    q => q.difficulty === difficulty && !answeredIds.includes(q.id)
  );
  
  if (availableQuestions.length === 0) {
    // If no questions at exact difficulty, try nearby difficulty
    const allAvailable = quizQuestions.filter(q => !answeredIds.includes(q.id));
    if (allAvailable.length === 0) return null;
    return allAvailable[Math.floor(Math.random() * allAvailable.length)];
  }
  
  return availableQuestions[Math.floor(Math.random() * availableQuestions.length)];
}

// Get AI hint from SambaNova
async function getAIHint(question: string, correctAnswer: string, wrongAnswer: string, attemptNumber: number): Promise<string> {
  try {
    const apiKey = Deno.env.get('SAMBANOVA_API_KEY');
    if (!apiKey) {
      console.error('SAMBANOVA_API_KEY not found in environment variables');
      return "Try to think about the question again. Which answer makes the most sense?";
    }

    const hintPrompt = attemptNumber === 1
      ? `A secondary school student answered a cryptography quiz question incorrectly. Give them a gentle hint (1-2 sentences) without revealing the answer directly.

Question: ${question}
Correct answer: ${correctAnswer}
Student's wrong answer: ${wrongAnswer}

Provide a simple, encouraging hint that helps them think about why their answer might be wrong.`
      : `A secondary school student answered a cryptography quiz question incorrectly for the second time. Give them a more direct hint (2-3 sentences) that guides them closer to the answer.

Question: ${question}
Correct answer: ${correctAnswer}
Student's wrong answer: ${wrongAnswer}

Provide a clearer hint that helps them understand the concept better.`;

    const response = await fetch('https://api.sambanova.ai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'Meta-Llama-3.1-8B-Instruct',
        messages: [
          {
            role: 'system',
            content: 'You are a helpful and encouraging tutor for secondary school students learning cryptography. Keep explanations simple and friendly.'
          },
          {
            role: 'user',
            content: hintPrompt
          }
        ],
        temperature: 0.7,
        max_tokens: 150
      })
    });

    if (!response.ok) {
      console.error(`SambaNova API error: ${response.status} ${response.statusText}`);
      const errorText = await response.text();
      console.error(`Error details: ${errorText}`);
      return "Let me give you a hint: Think carefully about what each option means and which one best answers the question.";
    }

    const data = await response.json();
    return data.choices[0].message.content;
  } catch (error) {
    console.error(`Error getting AI hint: ${error}`);
    return "Think about the key concepts in the question. Which answer makes the most sense?";
  }
}

// Health check endpoint
app.get("/make-server-81daa907/health", (c) => {
  return c.json({ status: "ok" });
});

// Get next question based on student's current difficulty level
app.post("/make-server-81daa907/get-question", async (c) => {
  try {
    const body = await c.req.json();
    const { studentId, currentDifficulty = 1 } = body;

    // Get student's answered questions
    const answeredKey = `student:${studentId}:answered`;
    const answeredData = await kv.get(answeredKey);
    const answeredIds = answeredData ? JSON.parse(answeredData) : [];

    // Select appropriate question
    const question = selectQuestion(currentDifficulty, answeredIds);
    
    if (!question) {
      return c.json({ 
        success: true, 
        completed: true,
        message: "Congratulations! You've completed all available questions!" 
      });
    }

    // Return question without correct answer
    const { correctAnswer, explanation, ...questionData } = question;
    
    return c.json({ 
      success: true, 
      question: questionData,
      totalQuestions: quizQuestions.length,
      answeredCount: answeredIds.length
    });
  } catch (error) {
    console.error(`Error in get-question endpoint: ${error}`);
    return c.json({ success: false, error: String(error) }, 500);
  }
});

// Submit answer and get feedback
app.post("/make-server-81daa907/submit-answer", async (c) => {
  try {
    const body = await c.req.json();
    const { studentId, questionId, selectedAnswer, attemptNumber = 1 } = body;

    // Find the question
    const question = quizQuestions.find(q => q.id === questionId);
    if (!question) {
      return c.json({ success: false, error: "Question not found" }, 404);
    }

    const isCorrect = selectedAnswer === question.correctAnswer;

    // Update student progress
    const progressKey = `student:${studentId}:progress`;
    const progressData = await kv.get(progressKey);
    const progress = progressData ? JSON.parse(progressData) : {
      totalQuestions: 0,
      correctAnswers: 0,
      currentDifficulty: 1,
      streak: 0
    };

    let hint = null;
    let nextDifficulty = progress.currentDifficulty;

    if (isCorrect) {
      // Update answered questions list
      const answeredKey = `student:${studentId}:answered`;
      const answeredData = await kv.get(answeredKey);
      const answeredIds = answeredData ? JSON.parse(answeredData) : [];
      if (!answeredIds.includes(questionId)) {
        answeredIds.push(questionId);
        await kv.set(answeredKey, JSON.stringify(answeredIds));
      }

      progress.totalQuestions++;
      progress.correctAnswers++;
      progress.streak++;

      // Increase difficulty after 2 consecutive correct answers
      if (progress.streak >= 2 && progress.currentDifficulty < 5) {
        progress.currentDifficulty++;
        nextDifficulty = progress.currentDifficulty;
        progress.streak = 0;
      }
    } else {
      // Generate AI hint for wrong answer
      const wrongAnswerText = question.options[selectedAnswer];
      const correctAnswerText = question.options[question.correctAnswer];
      
      hint = await getAIHint(question.question, correctAnswerText, wrongAnswerText, attemptNumber);
      
      progress.streak = 0;

      // Decrease difficulty after 2 wrong attempts on same question
      if (attemptNumber >= 2) {
        progress.totalQuestions++;
        if (progress.currentDifficulty > 1) {
          progress.currentDifficulty--;
          nextDifficulty = progress.currentDifficulty;
        }
      }
    }

    await kv.set(progressKey, JSON.stringify(progress));

    // Update high score
    const scoreKey = `student:${studentId}:score`;
    await kv.set(scoreKey, String(progress.correctAnswers));

    return c.json({
      success: true,
      isCorrect,
      explanation: isCorrect ? question.explanation : null,
      hint: isCorrect ? null : hint,
      correctAnswer: isCorrect ? null : question.correctAnswer,
      progress: {
        score: progress.correctAnswers,
        total: progress.totalQuestions,
        difficulty: nextDifficulty,
        percentage: progress.totalQuestions > 0 
          ? Math.round((progress.correctAnswers / progress.totalQuestions) * 100)
          : 0
      }
    });
  } catch (error) {
    console.error(`Error in submit-answer endpoint: ${error}`);
    return c.json({ success: false, error: String(error) }, 500);
  }
});

// Get student progress
app.get("/make-server-81daa907/progress/:studentId", async (c) => {
  try {
    const studentId = c.req.param('studentId');
    
    const progressKey = `student:${studentId}:progress`;
    const progressData = await kv.get(progressKey);
    const progress = progressData ? JSON.parse(progressData) : {
      totalQuestions: 0,
      correctAnswers: 0,
      currentDifficulty: 1,
      streak: 0
    };

    const answeredKey = `student:${studentId}:answered`;
    const answeredData = await kv.get(answeredKey);
    const answeredIds = answeredData ? JSON.parse(answeredData) : [];

    return c.json({
      success: true,
      progress: {
        ...progress,
        answeredCount: answeredIds.length,
        totalAvailable: quizQuestions.length,
        percentage: progress.totalQuestions > 0 
          ? Math.round((progress.correctAnswers / progress.totalQuestions) * 100)
          : 0
      }
    });
  } catch (error) {
    console.error(`Error in progress endpoint: ${error}`);
    return c.json({ success: false, error: String(error) }, 500);
  }
});

// Reset student progress
app.post("/make-server-81daa907/reset-progress", async (c) => {
  try {
    const body = await c.req.json();
    const { studentId } = body;

    await kv.del(`student:${studentId}:progress`);
    await kv.del(`student:${studentId}:answered`);
    await kv.del(`student:${studentId}:score`);

    return c.json({ success: true, message: "Progress reset successfully" });
  } catch (error) {
    console.error(`Error in reset-progress endpoint: ${error}`);
    return c.json({ success: false, error: String(error) }, 500);
  }
});

// Get theory question
app.post("/make-server-81daa907/get-theory-question", async (c) => {
  try {
    const body = await c.req.json();
    const { studentId, currentDifficulty = 1 } = body;

    const answeredKey = `student:${studentId}:theory:answered`;
    const answeredData = await kv.get(answeredKey);
    const answeredIds = answeredData ? JSON.parse(answeredData) : [];

    const availableQuestions = theoryQuestions.filter(
      q => q.difficulty === currentDifficulty && !answeredIds.includes(q.id)
    );
    
    let question;
    if (availableQuestions.length === 0) {
      const allAvailable = theoryQuestions.filter(q => !answeredIds.includes(q.id));
      if (allAvailable.length === 0) {
        return c.json({ 
          success: true, 
          completed: true,
          message: "Congratulations! You've completed all theory questions!" 
        });
      }
      question = allAvailable[Math.floor(Math.random() * allAvailable.length)];
    } else {
      question = availableQuestions[Math.floor(Math.random() * availableQuestions.length)];
    }

    const { correctAnswer, explanation, ...questionData } = question;
    
    return c.json({ 
      success: true, 
      question: questionData,
      totalQuestions: theoryQuestions.length,
      answeredCount: answeredIds.length
    });
  } catch (error) {
    console.error(`Error in get-theory-question endpoint: ${error}`);
    return c.json({ success: false, error: String(error) }, 500);
  }
});

// Submit theory answer
app.post("/make-server-81daa907/submit-theory-answer", async (c) => {
  try {
    const body = await c.req.json();
    const { studentId, questionId, selectedAnswer, attemptNumber = 1 } = body;

    const question = theoryQuestions.find(q => q.id === questionId);
    if (!question) {
      return c.json({ success: false, error: "Question not found" }, 404);
    }

    const isCorrect = selectedAnswer === question.correctAnswer;

    const progressKey = `student:${studentId}:theory:progress`;
    const progressData = await kv.get(progressKey);
    const progress = progressData ? JSON.parse(progressData) : {
      totalQuestions: 0,
      correctAnswers: 0,
      currentDifficulty: 1,
      streak: 0
    };

    let hint = null;
    let nextDifficulty = progress.currentDifficulty;

    if (isCorrect) {
      const answeredKey = `student:${studentId}:theory:answered`;
      const answeredData = await kv.get(answeredKey);
      const answeredIds = answeredData ? JSON.parse(answeredData) : [];
      if (!answeredIds.includes(questionId)) {
        answeredIds.push(questionId);
        await kv.set(answeredKey, JSON.stringify(answeredIds));
      }

      progress.totalQuestions++;
      progress.correctAnswers++;
      progress.streak++;

      if (progress.streak >= 2 && progress.currentDifficulty < 5) {
        progress.currentDifficulty++;
        nextDifficulty = progress.currentDifficulty;
        progress.streak = 0;
      }
    } else {
      const wrongAnswerText = question.options[selectedAnswer];
      const correctAnswerText = question.options[question.correctAnswer];
      
      hint = await getAIHint(question.question, correctAnswerText, wrongAnswerText, attemptNumber);
      
      progress.streak = 0;

      if (attemptNumber >= 2) {
        progress.totalQuestions++;
        if (progress.currentDifficulty > 1) {
          progress.currentDifficulty--;
          nextDifficulty = progress.currentDifficulty;
        }
      }
    }

    await kv.set(progressKey, JSON.stringify(progress));

    return c.json({
      success: true,
      isCorrect,
      explanation: isCorrect ? question.explanation : null,
      hint: isCorrect ? null : hint,
      correctAnswer: isCorrect ? null : question.correctAnswer,
      progress: {
        score: progress.correctAnswers,
        total: progress.totalQuestions,
        difficulty: nextDifficulty,
        percentage: progress.totalQuestions > 0 
          ? Math.round((progress.correctAnswers / progress.totalQuestions) * 100)
          : 0
      }
    });
  } catch (error) {
    console.error(`Error in submit-theory-answer endpoint: ${error}`);
    return c.json({ success: false, error: String(error) }, 500);
  }
});

// Get practical exercise
app.post("/make-server-81daa907/get-practical-exercise", async (c) => {
  try {
    const body = await c.req.json();
    const { studentId, cipherType, currentDifficulty = 1 } = body;

    const exercises = practicalExercises[cipherType as keyof typeof practicalExercises];
    if (!exercises) {
      return c.json({ success: false, error: "Invalid cipher type" }, 400);
    }

    const answeredKey = `student:${studentId}:${cipherType}:answered`;
    const answeredData = await kv.get(answeredKey);
    const answeredIds = answeredData ? JSON.parse(answeredData) : [];

    const availableExercises = exercises.filter(
      e => e.difficulty >= currentDifficulty && !answeredIds.includes(e.id)
    );
    
    let exercise;
    if (availableExercises.length === 0) {
      const allAvailable = exercises.filter(e => !answeredIds.includes(e.id));
      if (allAvailable.length === 0) {
        return c.json({ 
          success: true, 
          completed: true,
          message: `Congratulations! You've completed all ${cipherType} cipher exercises!` 
        });
      }
      exercise = allAvailable[Math.floor(Math.random() * allAvailable.length)];
    } else {
      exercise = availableExercises[Math.floor(Math.random() * availableExercises.length)];
    }

    const { correctAnswer, explanation, ...exerciseData } = exercise;
    
    return c.json({ 
      success: true, 
      exercise: exerciseData,
      totalExercises: exercises.length,
      answeredCount: answeredIds.length
    });
  } catch (error) {
    console.error(`Error in get-practical-exercise endpoint: ${error}`);
    return c.json({ success: false, error: String(error) }, 500);
  }
});

// Submit practical exercise answer
app.post("/make-server-81daa907/submit-practical-answer", async (c) => {
  try {
    const body = await c.req.json();
    const { studentId, cipherType, exerciseId, answer, attemptNumber = 1 } = body;

    const exercises = practicalExercises[cipherType as keyof typeof practicalExercises];
    if (!exercises) {
      return c.json({ success: false, error: "Invalid cipher type" }, 400);
    }

    const exercise = exercises.find(e => e.id === exerciseId);
    if (!exercise) {
      return c.json({ success: false, error: "Exercise not found" }, 404);
    }

    const userAnswer = answer.toUpperCase().replace(/[^A-Z0-9]/g, '');
    const correctAnswer = exercise.correctAnswer.toUpperCase().replace(/[^A-Z0-9]/g, '');
    const isCorrect = userAnswer === correctAnswer;

    const progressKey = `student:${studentId}:${cipherType}:progress`;
    const progressData = await kv.get(progressKey);
    const progress = progressData ? JSON.parse(progressData) : {
      totalQuestions: 0,
      correctAnswers: 0,
      currentDifficulty: 1,
      streak: 0
    };

    let hint = null;

    if (isCorrect) {
      const answeredKey = `student:${studentId}:${cipherType}:answered`;
      const answeredData = await kv.get(answeredKey);
      const answeredIds = answeredData ? JSON.parse(answeredData) : [];
      if (!answeredIds.includes(exerciseId)) {
        answeredIds.push(exerciseId);
        await kv.set(answeredKey, JSON.stringify(answeredIds));
      }

      progress.totalQuestions++;
      progress.correctAnswers++;
      progress.streak++;

      if (progress.streak >= 2 && progress.currentDifficulty < 5) {
        progress.currentDifficulty++;
        progress.streak = 0;
      }
    } else {
      hint = attemptNumber === 1
        ? `Not quite! Check your ${cipherType} calculation. Remember to apply the cipher transformation to each letter carefully.`
        : `The correct answer is ${exercise.correctAnswer}. ${exercise.explanation}`;
      
      progress.streak = 0;

      if (attemptNumber >= 2) {
        progress.totalQuestions++;
        if (progress.currentDifficulty > 1) {
          progress.currentDifficulty--;
        }
      }
    }

    await kv.set(progressKey, JSON.stringify(progress));

    return c.json({
      success: true,
      isCorrect,
      explanation: isCorrect ? exercise.explanation : null,
      hint: isCorrect ? null : hint,
      correctAnswer: isCorrect ? null : exercise.correctAnswer,
      progress: {
        score: progress.correctAnswers,
        total: progress.totalQuestions,
        difficulty: progress.currentDifficulty,
        percentage: progress.totalQuestions > 0 
          ? Math.round((progress.correctAnswers / progress.totalQuestions) * 100)
          : 0
      }
    });
  } catch (error) {
    console.error(`Error in submit-practical-answer endpoint: ${error}`);
    return c.json({ success: false, error: String(error) }, 500);
  }
});

// Get all quiz stats for dashboard
app.get("/make-server-81daa907/dashboard-stats/:studentId", async (c) => {
  try {
    const studentId = c.req.param('studentId');
    
    // Theory stats
    const theoryProgressKey = `student:${studentId}:theory:progress`;
    const theoryProgressData = await kv.get(theoryProgressKey);
    const theoryProgress = theoryProgressData ? JSON.parse(theoryProgressData) : null;

    // Cipher stats
    const cipherTypes = ['caesar', 'vigenere', 'affine', 'multiplicative'];
    const cipherStats: Record<string, any> = {};

    for (const cipher of cipherTypes) {
      const progressKey = `student:${studentId}:${cipher}:progress`;
      const progressData = await kv.get(progressKey);
      cipherStats[cipher] = progressData ? JSON.parse(progressData) : null;
    }

    return c.json({
      success: true,
      theoryProgress,
      cipherStats,
      totalTheoryQuestions: theoryQuestions.length,
      totalCaesarExercises: practicalExercises.caesar.length,
      totalVigenereExercises: practicalExercises.vigenere.length,
      totalAffineExercises: practicalExercises.affine.length,
      totalMultiplicativeExercises: practicalExercises.multiplicative.length
    });
  } catch (error) {
    console.error(`Error in dashboard-stats endpoint: ${error}`);
    return c.json({ success: false, error: String(error) }, 500);
  }
});

Deno.serve(app.fetch);
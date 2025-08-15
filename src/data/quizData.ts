export interface Lesson {
  id: string;
  name: string;
}

export interface Topic {
  id: string;
  name: string;
  lessons: Lesson[];
}

export interface Subject {
  id: string;
  name: string;
  icon: string;
  topics: Topic[];
  isScience?: boolean;
  isComputerScience?: boolean;
}
interface MCQChoice {
  id: string;
  text: string;
  isCorrect: boolean;
}
interface MCQQuestion {
  id: string;
  question: string;
  choices: MCQChoice[];
  explanation: string;
  year: string;
  session: string;
  variant: string;
  difficulty: "easy" | "medium" | "hard";
  tip?: string;
}

export interface QuestionPart {
  id: string;
  part: string; // e.g., "(a)(i)", "(b)", "(c)(iv)"
  question: string;
  answer: string;
  hasImage?: boolean;
  imageUrl?: string;
  hasCode?: boolean;
  code?: string;
  codeLanguage?: string;
  keywords?: Array<{ word: string; definition: string }>;
  hasLinks?: boolean;
  links?: Array<{ text: string; url: string }>;
  tip?: string;
}

export interface Question {
  id: string;
  subject: string;
  topic: string;
  lesson: string;
  difficulty: "easy" | "medium" | "hard";
  year: number;
  session: "feb/march" | "may/june" | "oct/nov";
  variant: "v1" | "v2" | "v3";
  paper?: "paper1" | "paper2" | "paper4" | "paper6";
  level?: "core" | "extended";
  tags: string[];
  parts: QuestionPart[];
}

export interface QuizFilters {
  subject: string;
  topics: string[];
  lessons: string[];
  difficulty: "easy" | "medium" | "hard" | "mixed";
  yearRange: [number, number];
  sessions: Array<"feb/march" | "may/june" | "oct/nov">;
  variants: Array<"v1" | "v2" | "v3">;
  papers?: Array<"paper1" | "paper2" | "paper4" | "paper6">;
  level?: "core" | "extended";
  tags: string[];
  numberOfQuestions: number;
}

export const subjects: Subject[] = [
  {
    id: "physics",
    name: "Physics",
    icon: "Atom",
    isScience: true,
    topics: [
      {
        id: "mechanics",
        name: "Mechanics",
        lessons: [
          { id: "motion", name: "Motion" },
          { id: "forces", name: "Forces" },
          { id: "energy and work", name: "Energy and Work" },
          { id: "momentum", name: "Momentum" },
        ],
      },
      {
        id: "electricity",
        name: "Electricity",
        lessons: [
          { id: "current", name: "Electric Current" },
          { id: "voltage and emf", name: "Voltage and EMF" },
          { id: "resistance", name: "Resistance" },
          { id: "circuits", name: "Electric Circuits" },
        ],
      },
      {
        id: "waves",
        name: "Waves",
        lessons: [
          { id: "wave-properties", name: "Wave Properties" },
          { id: "sound", name: "Sound Waves" },
          { id: "light", name: "Light and Optics" },
        ],
      },
    ],
  },
  {
    id: "chemistry",
    name: "Chemistry",
    icon: "Beaker",
    isScience: true,
    topics: [
      {
        id: "atomic-structure",
        name: "Atomic Structure",
        lessons: [
          { id: "atoms and elements", name: "Atoms and Elements" },
          { id: "ions and compounds", name: "Ions and Compounds" },
          { id: "isotopes", name: "Isotopes" },
          { id: "periodic-table", name: "Periodic Table" },
        ],
      },
      {
        id: "bonding",
        name: "Chemical Bonding",
        lessons: [
          { id: "ionic-bonding", name: "Ionic Bonding" },
          { id: "covalent-bonding", name: "Covalent Bonding" },
          { id: "metallic-bonding", name: "Metallic Bonding" },
        ],
      },
      {
        id: "reactions",
        name: "Chemical Reactions",
        lessons: [
          { id: "acids-bases", name: "Acids and Bases" },
          { id: "oxidation-reduction", name: "Oxidation and Reduction" },
          { id: "rates", name: "Rates of Reaction" },
        ],
      },
    ],
  },
  {
    id: "biology",
    name: "Biology",
    icon: "Dna",
    isScience: true,
    topics: [
      {
        id: "cells",
        name: "Cell Biology",
        lessons: [
          { id: "cell-structure", name: "Cell Structure" },
          { id: "cell-division", name: "Cell Division" },
          { id: "transport", name: "Transport in Cells" },
        ],
      },
      {
        id: "genetics",
        name: "Genetics",
        lessons: [
          { id: "inheritance", name: "Inheritance" },
          { id: "dna", name: "DNA and RNA" },
          { id: "variation", name: "Variation and Selection" },
        ],
      },
    ],
  },
  {
    id: "combined",
    name: "Combined",
    icon: "Layers",
    isScience: true,
    topics: [
      {
        id: "interdisciplinary",
        name: "Interdisciplinary Topics",
        lessons: [
          { id: "environmental", name: "Environmental Science" },
          { id: "materials", name: "Materials Science" },
        ],
      },
    ],
  },
  {
    id: "economics",
    name: "Economics",
    icon: "DollarSign",
    topics: [
      {
        id: "microeconomics",
        name: "Microeconomics",
        lessons: [
          { id: "demand-supply", name: "Demand and Supply" },
          { id: "market-structures", name: "Market Structures" },
          { id: "elasticity", name: "Price Elasticity" },
        ],
      },
      {
        id: "macroeconomics",
        name: "Macroeconomics",
        lessons: [
          { id: "gdp", name: "GDP and Economic Growth" },
          { id: "inflation", name: "Inflation and Unemployment" },
          { id: "fiscal-policy", name: "Fiscal Policy" },
        ],
      },
    ],
  },
];

export const sampleQuestions: Question[] = [
  {
    id: "1",
    subject: "physics",
    topic: "mechanics",
    lesson: "motion",
    difficulty: "easy",
    year: 2023,
    session: "may/june",
    variant: "v1",
    paper: "paper2",
    level: "extended",
    tags: ["calculation", "important"],
    parts: [
      {
        id: "1a",
        part: "(a)",
        question:
          "A car accelerates uniformly from rest to a velocity of 20 m/s in 4 seconds. Calculate the acceleration of the car.",
        answer:
          "Using the equation: v = u + at\n\nGiven:\n- Initial velocity (u) = 0 m/s\n- Final velocity (v) = 20 m/s\n- Time (t) = 4 s\n\nSubstituting:\n20 = 0 + a × 4\na = 20/4 = 5 m/s²\n\nTherefore, the acceleration is 5 m/s².",
        keywords: [
          {
            word: "acceleration",
            definition: "The rate of change of velocity with respect to time",
          },
          { word: "uniform", definition: "Constant or unchanging" },
        ],
      },
    ],
  },
  {
    id: "2",
    subject: "physics",
    topic: "electricity",
    lesson: "circuits",
    difficulty: "medium",
    year: 2022,
    session: "oct/nov",
    variant: "v2",
    paper: "paper2",
    level: "extended",
    tags: ["calculation", "circuit-analysis"],
    parts: [
      {
        id: "2a",
        part: "(a)",
        question:
          "In the circuit diagram below, calculate the total resistance when the resistors are connected in parallel.",
        answer:
          "For resistors in parallel:\n1/Rtotal = 1/R1 + 1/R2 + 1/R3\n\n1/Rtotal = 1/4 + 1/6 + 1/12\n1/Rtotal = 3/12 + 2/12 + 1/12 = 6/12 = 1/2\n\nTherefore: Rtotal = 2 Ω",
        hasImage: true,
        imageUrl:
          "https://images.unsplash.com/photo-1518770660439-4636190af475?w=400",
        keywords: [
          {
            word: "parallel",
            definition:
              "Circuit arrangement where components are connected alongside each other",
          },
        ],
      },
    ],
  },
  {
    id: "3",
    subject: "chemistry",
    topic: "atomic-structure",
    lesson: "periodic-table",
    difficulty: "hard",
    year: 2024,
    session: "feb/march",
    variant: "v2",
    paper: "paper2",
    level: "extended",
    tags: ["definition", "important"],
    parts: [
      {
        id: "3a",
        part: "(a)",
        question:
          "Explain the trend in atomic radius across Period 3 of the periodic table.",
        answer:
          "As we move across Period 3 from left to right:\n\n1. Atomic radius decreases\n2. This is because:\n   - Nuclear charge increases (more protons)\n   - Electrons are added to the same shell\n   - Increased nuclear charge pulls electrons closer\n   - Effective nuclear charge increases\n\nExample: Na > Mg > Al > Si > P > S > Cl > Ar",
        keywords: [
          {
            word: "atomic radius",
            definition:
              "Half the distance between the nuclei of two bonded atoms",
          },
          {
            word: "nuclear charge",
            definition: "The total charge of the nucleus due to protons",
          },
        ],
      },
    ],
  },
  {
    id: "4",
    subject: "physics",
    topic: "mechanics",
    lesson: "forces",
    difficulty: "medium",
    year: 2023,
    session: "may/june",
    variant: "v1",
    paper: "paper2",
    level: "extended",
    tags: ["calculation", "forces"],
    parts: [
      {
        id: "4a",
        part: "(a)",
        question:
          "A block of mass 5 kg is pulled across a horizontal surface by a force of 20 N. If the coefficient of friction is 0.3, calculate the acceleration of the block.",
        answer:
          "Given:\n- Mass (m) = 5 kg\n- Applied force (F) = 20 N\n- Coefficient of friction (μ) = 0.3\n- g = 9.8 m/s²\n\nFriction force = μ × Normal force = μ × mg\nFriction force = 0.3 × 5 × 9.8 = 14.7 N\n\nNet force = Applied force - Friction force\nNet force = 20 - 14.7 = 5.3 N\n\nUsing F = ma:\na = F/m = 5.3/5 = 1.06 m/s²",
        keywords: [
          {
            word: "friction",
            definition: "Force that opposes motion between surfaces in contact",
          },
          {
            word: "coefficient of friction",
            definition: "Ratio of friction force to normal force",
          },
        ],
      },
    ],
  },
  {
    id: "5",
    subject: "chemistry",
    topic: "bonding",
    lesson: "ionic-bonding",
    difficulty: "easy",
    year: 2022,
    session: "oct/nov",
    variant: "v3",
    paper: "paper2",
    level: "core",
    tags: ["definition", "bonding"],
    parts: [
      {
        id: "5a",
        part: "(a)",
        question:
          "Explain how ionic bonding occurs between sodium and chlorine atoms.",
        answer:
          "Ionic bonding between Na and Cl:\n\n1. Sodium atom (Na) loses 1 electron to become Na⁺ ion\n   - Electronic configuration: 2,8,1 → 2,8\n   - Achieves stable noble gas configuration\n\n2. Chlorine atom (Cl) gains 1 electron to become Cl⁻ ion\n   - Electronic configuration: 2,8,7 → 2,8,8\n   - Achieves stable noble gas configuration\n\n3. Electrostatic attraction between Na⁺ and Cl⁻ forms ionic bond\n4. Result: NaCl (sodium chloride) compound",
        keywords: [
          {
            word: "electrostatic",
            definition:
              "Force of attraction or repulsion between charged particles",
          },
        ],
      },
    ],
  },
  {
    id: "6",
    subject: "biology",
    topic: "cells",
    lesson: "cell-structure",
    difficulty: "medium",
    year: 2023,
    session: "may/june",
    variant: "v1",
    paper: "paper2",
    level: "extended",
    tags: ["definition", "structure"],
    parts: [
      {
        id: "6a",
        part: "(a)",
        question: "Compare the structure of prokaryotic and eukaryotic cells.",
        answer:
          "Prokaryotic cells:\n- No nucleus (genetic material free in cytoplasm)\n- No membrane-bound organelles\n- Smaller ribosomes (70S)\n- Cell wall present\n- Examples: bacteria\n\nEukaryotic cells:\n- Nucleus present (genetic material enclosed)\n- Membrane-bound organelles present\n- Larger ribosomes (80S)\n- Cell wall in plants only\n- Examples: plant and animal cells",
        hasImage: true,
        imageUrl:
          "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=400",
      },
    ],
  },
  {
    id: "7",
    subject: "physics",
    topic: "waves",
    lesson: "wave-properties",
    difficulty: "hard",
    year: 2024,
    session: "may/june",
    variant: "v1",
    paper: "paper4",
    level: "extended",
    tags: ["calculation", "waves"],
    parts: [
      {
        id: "7a",
        part: "(a)",
        question:
          "A wave has a frequency of 50 Hz and travels at a speed of 340 m/s. Calculate its wavelength.",
        answer:
          "Using the wave equation: v = fλ\n\nGiven:\n- Frequency (f) = 50 Hz\n- Wave speed (v) = 340 m/s\n- Wavelength (λ) = ?\n\nRearranging: λ = v/f\nλ = 340/50 = 6.8 m\n\nTherefore, the wavelength is 6.8 m.",
        hasCode: true,
        code: `# Wave calculation
  frequency = 50  # Hz
  wave_speed = 340  # m/s
  
  wavelength = wave_speed / frequency
  print(f"Wavelength: {wavelength} m")`,
        codeLanguage: "python",
      },
    ],
  },
  {
    id: "8",
    subject: "chemistry",
    topic: "reactions",
    lesson: "acids-bases",
    difficulty: "medium",
    year: 2023,
    session: "oct/nov",
    variant: "v2",
    paper: "paper2",
    level: "extended",
    tags: ["calculation", "acids"],
    parts: [
      {
        id: "8a",
        part: "(a)",
        question:
          "Calculate the pH of a 0.01 M solution of hydrochloric acid (HCl).",
        answer:
          "HCl is a strong acid that completely dissociates:\nHCl → H⁺ + Cl⁻\n\nFor a 0.01 M HCl solution:\n[H⁺] = 0.01 M = 1 × 10⁻² M\n\npH = -log[H⁺]\npH = -log(1 × 10⁻²)\npH = -(-2) = 2\n\nTherefore, the pH is 2.",
        keywords: [
          {
            word: "pH",
            definition: "Measure of hydrogen ion concentration in a solution",
          },
          {
            word: "strong acid",
            definition: "Acid that completely ionizes in solution",
          },
        ],
      },
    ],
  },
  {
    id: "9",
    subject: "biology",
    topic: "genetics",
    lesson: "inheritance",
    difficulty: "hard",
    year: 2022,
    session: "may/june",
    variant: "v2",
    paper: "paper4",
    level: "extended",
    tags: ["calculation", "genetics"],
    parts: [
      {
        id: "9a",
        part: "(a)",
        question:
          "In a monohybrid cross between two heterozygous tall plants (Tt × Tt), calculate the probability of obtaining a dwarf offspring.",
        answer:
          "Monohybrid cross: Tt × Tt\n\nPunnet square:\n    T    t\nT  TT   Tt\nt  Tt   tt\n\nGenotype ratio: 1 TT : 2 Tt : 1 tt\nPhenotype ratio: 3 tall : 1 dwarf\n\nProbability of dwarf offspring (tt) = 1/4 = 25%",
        hasImage: true,
        imageUrl:
          "https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?w=400",
      },
    ],
  },
  {
    id: "10",
    subject: "economics",
    topic: "microeconomics",
    lesson: "demand-supply",
    difficulty: "easy",
    year: 2022,
    session: "oct/nov",
    variant: "v3",
    tags: ["definition", "graph-analysis"],
    parts: [
      {
        id: "10a",
        part: "(a)",
        question:
          "Define the law of demand and explain one factor that causes a shift in the demand curve.",
        answer:
          "Law of Demand:\nAs the price of a good increases, the quantity demanded decreases, ceteris paribus (all other factors remaining constant).\n\nFactor causing demand curve shift:\nIncome change:\n- Normal goods: Increase in income → demand curve shifts right\n- Inferior goods: Increase in income → demand curve shifts left\n\nOther factors: Price of substitutes, consumer preferences, population changes",
        keywords: [
          {
            word: "ceteris paribus",
            definition: "All other things being equal or constant",
          },
          {
            word: "substitutes",
            definition: "Goods that can replace each other in consumption",
          },
        ],
      },
    ],
  },
  {
    id: "11",
    subject: "physics",
    topic: "electricity",
    lesson: "current",
    difficulty: "easy",
    year: 2023,
    session: "feb/march",
    variant: "v2",
    paper: "paper2",
    level: "core",
    tags: ["definition", "current"],
    parts: [
      {
        id: "11a",
        part: "(a)",
        question: "Define electric current and state its SI unit.",
        answer:
          "Electric current is the rate of flow of electric charge.\n\nDefinition: Current = Charge / Time\nI = Q / t\n\nSI unit: Ampere (A)\n\n1 Ampere = 1 Coulomb per second",
        keywords: [
          { word: "ampere", definition: "SI unit of electric current" },
          { word: "coulomb", definition: "SI unit of electric charge" },
        ],
      },
    ],
  },
  {
    id: "12",
    subject: "chemistry",
    topic: "atomic-structure",
    lesson: "atoms and elements",
    difficulty: "medium",
    year: 2024,
    session: "may/june",
    variant: "v1",
    paper: "paper2",
    level: "extended",
    tags: ["calculation", "atoms"],
    parts: [
      {
        id: "12a",
        part: "(a)",
        question:
          "An atom has 17 protons, 18 neutrons, and 17 electrons. Identify the element and calculate its mass number.",
        answer:
          "Given:\n- Protons = 17\n- Neutrons = 18\n- Electrons = 17\n\nElement identification:\n- Number of protons = Atomic number = 17\n- Element with atomic number 17 is Chlorine (Cl)\n\nMass number calculation:\nMass number = Protons + Neutrons\nMass number = 17 + 18 = 35\n\nTherefore, this is Chlorine-35 (³⁵Cl)",
        keywords: [
          {
            word: "mass number",
            definition:
              "Total number of protons and neutrons in an atomic nucleus",
          },
          {
            word: "atomic number",
            definition: "Number of protons in an atomic nucleus",
          },
        ],
      },
    ],
  },
  {
    id: "13",
    subject: "biology",
    topic: "cells",
    lesson: "transport",
    difficulty: "hard",
    year: 2023,
    session: "oct/nov",
    variant: "v3",
    paper: "paper4",
    level: "extended",
    tags: ["definition", "transport"],
    parts: [
      {
        id: "13a",
        part: "(a)",
        question:
          "Explain the process of active transport and give two examples.",
        answer:
          "Active Transport:\n- Movement of substances across cell membranes against concentration gradient\n- Requires energy (ATP)\n- Uses carrier proteins\n- Can move substances from low to high concentration\n\nExamples:\n1. Sodium-Potassium pump in nerve cells\n   - Moves Na⁺ out and K⁺ in against gradients\n\n2. Glucose absorption in small intestine\n   - Moves glucose from intestine to blood against gradient\n\nKey features:\n- Selective and specific\n- Can be inhibited by metabolic poisons",
        hasImage: true,
        imageUrl:
          "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=400",
        keywords: [
          {
            word: "ATP",
            definition: "Adenosine triphosphate - energy currency of cells",
          },
          {
            word: "concentration gradient",
            definition: "Difference in concentration between two areas",
          },
        ],
      },
    ],
  },
  {
    id: "14",
    subject: "physics",
    topic: "mechanics",
    lesson: "energy and work",
    difficulty: "medium",
    year: 2022,
    session: "may/june",
    variant: "v1",
    paper: "paper2",
    level: "extended",
    tags: ["calculation", "energy"],
    parts: [
      {
        id: "14a",
        part: "(a)",
        question:
          "A ball of mass 0.5 kg is dropped from a height of 10 m. Calculate its kinetic energy just before it hits the ground.",
        answer:
          "Using conservation of energy:\nPotential Energy at top = Kinetic Energy at bottom\n\nGiven:\n- Mass (m) = 0.5 kg\n- Height (h) = 10 m\n- g = 9.8 m/s²\n\nPotential Energy = mgh\nPE = 0.5 × 9.8 × 10 = 49 J\n\nAt the bottom:\nKinetic Energy = Potential Energy\nKE = 49 J\n\nAlternatively, using v² = u² + 2as:\nv² = 0 + 2 × 9.8 × 10 = 196\nv = 14 m/s\n\nKE = ½mv² = ½ × 0.5 × 196 = 49 J",
        hasCode: true,
        code: `import math
  
  # Given values
  mass = 0.5  # kg
  height = 10  # m
  g = 9.8  # m/s²
  
  # Calculate potential energy
  pe = mass * g * height
  print(f"Potential Energy: {pe} J")
  
  # At bottom, PE converts to KE
  ke = pe
  print(f"Kinetic Energy: {ke} J")
  
  # Verify with velocity calculation
  velocity = math.sqrt(2 * g * height)
  ke_check = 0.5 * mass * velocity**2
  print(f"Verification: {ke_check} J")`,
        codeLanguage: "python",
      },
    ],
  },
  {
    id: "15",
    subject: "chemistry",
    topic: "bonding",
    lesson: "covalent-bonding",
    difficulty: "easy",
    year: 2023,
    session: "feb/march",
    variant: "v2",
    paper: "paper2",
    level: "core",
    tags: ["definition", "bonding"],
    parts: [
      {
        id: "15a",
        part: "(a)",
        question:
          "Draw the dot-and-cross diagram for water (H₂O) and explain the bonding.",
        answer:
          "Water (H₂O) Bonding:\n\nStructure:\n- Oxygen has 6 electrons in outer shell\n- Each hydrogen has 1 electron\n- Oxygen shares electrons with two hydrogen atoms\n\nBonding explanation:\n1. Oxygen forms 2 covalent bonds\n2. Each O-H bond involves sharing of electron pair\n3. Oxygen achieves stable octet (8 electrons)\n4. Each hydrogen achieves stable duplet (2 electrons)\n\nMolecular shape: Bent (104.5° bond angle)\nReason: Two lone pairs on oxygen repel bonding pairs",
        keywords: [
          {
            word: "covalent bond",
            definition: "Bond formed by sharing electrons between atoms",
          },
          {
            word: "lone pair",
            definition: "Pair of electrons not involved in bonding",
          },
        ],
      },
    ],
  },
  {
    id: "16",
    subject: "economics",
    topic: "macroeconomics",
    lesson: "gdp",
    difficulty: "hard",
    year: 2024,
    session: "oct/nov",
    variant: "v1",
    tags: ["calculation", "gdp"],
    parts: [
      {
        id: "16a",
        part: "(a)",
        question:
          "Calculate the real GDP if nominal GDP is $500 billion and the GDP deflator is 125.",
        answer:
          "Formula for Real GDP:\nReal GDP = (Nominal GDP / GDP Deflator) × 100\n\nGiven:\n- Nominal GDP = $500 billion\n- GDP Deflator = 125\n\nCalculation:\nReal GDP = (500 / 125) × 100\nReal GDP = 4 × 100\nReal GDP = $400 billion\n\nThis means the economy produces $400 billion worth of goods and services at base year prices.",
        keywords: [
          {
            word: "GDP deflator",
            definition: "Price index measuring inflation in the entire economy",
          },
          {
            word: "real GDP",
            definition:
              "GDP adjusted for inflation, measured in constant prices",
          },
        ],
      },
    ],
  },
  {
    id: "17",
    subject: "physics",
    topic: "waves",
    lesson: "sound",
    difficulty: "medium",
    year: 2023,
    session: "may/june",
    variant: "v2",
    paper: "paper4",
    level: "extended",
    tags: ["calculation", "sound"],
    parts: [
      {
        id: "17a",
        part: "(a)",
        question:
          "A sound wave has a frequency of 256 Hz and wavelength of 1.3 m. Calculate the speed of sound.",
        answer:
          "Using the wave equation: v = fλ\n\nGiven:\n- Frequency (f) = 256 Hz\n- Wavelength (λ) = 1.3 m\n- Speed (v) = ?\n\nCalculation:\nv = f × λ\nv = 256 × 1.3\nv = 332.8 m/s\n\nTherefore, the speed of sound is 332.8 m/s (approximately 333 m/s in air at room temperature).",
        keywords: [
          {
            word: "frequency",
            definition: "Number of complete waves passing a point per second",
          },
          {
            word: "wavelength",
            definition:
              "Distance between two consecutive points in phase on a wave",
          },
        ],
      },
    ],
  },
  {
    id: "18",
    subject: "biology",
    topic: "genetics",
    lesson: "dna",
    difficulty: "hard",
    year: 2022,
    session: "oct/nov",
    variant: "v3",
    paper: "paper6",
    level: "extended",
    tags: ["definition", "dna"],
    parts: [
      {
        id: "18a",
        part: "(a)",
        question:
          "Explain the process of DNA replication, including the role of enzymes.",
        answer:
          "DNA Replication Process:\n\n1. Initiation:\n   - DNA helicase unwinds the double helix\n   - Creates replication fork\n   - Single-strand binding proteins stabilize strands\n\n2. Elongation:\n   - DNA primase synthesizes RNA primers\n   - DNA polymerase adds nucleotides to 3' end\n   - Leading strand: continuous synthesis\n   - Lagging strand: discontinuous (Okazaki fragments)\n\n3. Termination:\n   - DNA ligase joins Okazaki fragments\n   - Proofreading by DNA polymerase\n   - Results in two identical DNA molecules\n\nKey Enzymes:\n- Helicase: unwinds DNA\n- Primase: makes RNA primers\n- DNA polymerase: synthesizes new strands\n- Ligase: joins fragments",
        hasImage: true,
        imageUrl:
          "https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?w=400",
        keywords: [
          {
            word: "Okazaki fragments",
            definition: "Short DNA fragments synthesized on lagging strand",
          },
          {
            word: "primer",
            definition: "Short RNA sequence needed to start DNA synthesis",
          },
        ],
      },
    ],
  },
  {
    id: "19",
    subject: "chemistry",
    topic: "reactions",
    lesson: "oxidation-reduction",
    difficulty: "medium",
    year: 2024,
    session: "feb/march",
    variant: "v2",
    paper: "paper2",
    level: "extended",
    tags: ["definition", "redox"],
    parts: [
      {
        id: "19a",
        part: "(a)",
        question:
          "In the reaction Zn + CuSO₄ → ZnSO₄ + Cu, identify the oxidizing and reducing agents.",
        answer:
          "Analysis of the reaction:\nZn + CuSO₄ → ZnSO₄ + Cu\n\nOxidation numbers:\n- Zn: 0 → +2 (loses 2 electrons) - OXIDATION\n- Cu: +2 → 0 (gains 2 electrons) - REDUCTION\n\nIdentification:\n1. Reducing agent: Zinc (Zn)\n   - Loses electrons and gets oxidized\n   - Causes reduction of copper\n\n2. Oxidizing agent: Copper sulfate (CuSO₄) or Cu²⁺\n   - Gains electrons and gets reduced\n   - Causes oxidation of zinc\n\nHalf equations:\nOxidation: Zn → Zn²⁺ + 2e⁻\nReduction: Cu²⁺ + 2e⁻ → Cu",
        keywords: [
          {
            word: "oxidizing agent",
            definition: "Substance that gains electrons and causes oxidation",
          },
          {
            word: "reducing agent",
            definition: "Substance that loses electrons and causes reduction",
          },
        ],
      },
    ],
  },
  {
    id: "20",
    subject: "physics",
    topic: "electricity",
    lesson: "resistance",
    difficulty: "easy",
    year: 2023,
    session: "oct/nov",
    variant: "v1",
    paper: "paper2",
    level: "core",
    tags: ["calculation", "resistance"],
    parts: [
      {
        id: "20a",
        part: "(a)",
        question:
          "A resistor has a voltage of 12 V across it and a current of 3 A flowing through it. Calculate its resistance.",
        answer:
          "Using Ohm's Law: V = IR\n\nGiven:\n- Voltage (V) = 12 V\n- Current (I) = 3 A\n- Resistance (R) = ?\n\nRearranging: R = V/I\nR = 12/3 = 4 Ω\n\nTherefore, the resistance is 4 ohms.",
        keywords: [
          {
            word: "Ohm's Law",
            definition: "V = IR, relating voltage, current, and resistance",
          },
          { word: "ohm", definition: "SI unit of electrical resistance" },
        ],
      },
    ],
  }, // --- Added Physics Questions ---
  {
    id: "21",
    subject: "physics",
    topic: "mechanics",
    lesson: "momentum",
    difficulty: "medium",
    year: 2024,
    session: "may/june",
    variant: "v1",
    paper: "paper2",
    level: "extended",
    tags: ["calculation", "momentum"],
    parts: [
      {
        id: "21a",
        part: "(a)",
        question:
          "A 2 kg object moves with a velocity of 8 m/s. Calculate its momentum.",
        answer:
          "Formula: momentum = mass × velocity\np = 2 × 8 = 16 kg·m/s\n\nTherefore, momentum is 16 kg·m/s.",
        keywords: [
          { word: "momentum", definition: "Product of mass and velocity" },
        ],
      },
    ],
  },
  {
    id: "22",
    subject: "physics",
    topic: "electricity",
    lesson: "power",
    difficulty: "easy",
    year: 2022,
    session: "oct/nov",
    variant: "v3",
    paper: "paper2",
    level: "core",
    tags: ["calculation", "power"],
    parts: [
      {
        id: "22a",
        part: "(a)",
        question:
          "An electric kettle uses 1500 W of power for 4 minutes. Calculate the energy transferred in kWh.",
        answer:
          "Power = 1500 W = 1.5 kW\nTime = 4 min = 4/60 h = 0.0667 h\n\nEnergy = Power × Time\nEnergy = 1.5 × 0.0667 = 0.100 kWh",
        keywords: [
          { word: "kilowatt-hour", definition: "Unit of electrical energy" },
        ],
      },
    ],
  },
  {
    id: "23",
    subject: "physics",
    topic: "waves",
    lesson: "sound",
    difficulty: "medium",
    year: 2023,
    session: "feb/march",
    variant: "v1",
    paper: "paper2",
    level: "extended",
    tags: ["definition", "sound"],
    parts: [
      {
        id: "23a",
        part: "(a)",
        question:
          "State the range of audible frequencies for a healthy human ear.",
        answer:
          "Audible frequency range: 20 Hz to 20,000 Hz (20 kHz)\n\nBelow 20 Hz = infrasound\nAbove 20 kHz = ultrasound",
        keywords: [
          { word: "infrasound", definition: "Sound waves below 20 Hz" },
          { word: "ultrasound", definition: "Sound waves above 20 kHz" },
        ],
      },
    ],
  },
  {
    id: "24",
    subject: "physics",
    topic: "thermal-physics",
    lesson: "specific-heat-capacity",
    difficulty: "hard",
    year: 2024,
    session: "may/june",
    variant: "v2",
    paper: "paper4",
    level: "extended",
    tags: ["calculation", "thermal"],
    parts: [
      {
        id: "24a",
        part: "(a)",
        question:
          "A 0.8 kg block of metal increases in temperature from 25°C to 75°C when 20,000 J of heat is supplied. Calculate its specific heat capacity.",
        answer:
          "Formula: Q = mcΔT\nm = 0.8 kg\nΔT = 75 - 25 = 50°C\nQ = 20,000 J\n\nc = Q / (mΔT)\nc = 20000 / (0.8 × 50)\nc = 20000 / 40 = 500 J/kg°C",
        keywords: [
          {
            word: "specific heat capacity",
            definition: "Energy needed to raise 1 kg by 1°C",
          },
        ],
      },
    ],
  },
  {
    id: "25",
    subject: "physics",
    topic: "mechanics",
    lesson: "circular-motion",
    difficulty: "medium",
    year: 2022,
    session: "oct/nov",
    variant: "v1",
    paper: "paper4",
    level: "extended",
    tags: ["definition", "circular-motion"],
    parts: [
      {
        id: "25a",
        part: "(a)",
        question:
          "Explain why a body moving at constant speed in a circle is accelerating.",
        answer:
          "Acceleration is a change in velocity, not just speed.\nIn circular motion, the direction of velocity changes continuously, hence there is a centripetal acceleration towards the center of the circle.",
        keywords: [
          {
            word: "centripetal acceleration",
            definition:
              "Acceleration directed towards center in circular motion",
          },
        ],
      },
    ],
  },
  {
    id: "26",
    subject: "physics",
    topic: "nuclear-physics",
    lesson: "radioactivity",
    difficulty: "easy",
    year: 2023,
    session: "oct/nov",
    variant: "v2",
    paper: "paper2",
    level: "core",
    tags: ["definition", "radioactivity"],
    parts: [
      {
        id: "26a",
        part: "(a)",
        question: "State two differences between alpha and beta particles.",
        answer:
          "Alpha particles:\n- Helium nuclei (2 protons, 2 neutrons)\n- Heavier and less penetrating\n\nBeta particles:\n- High-speed electrons or positrons\n- Lighter and more penetrating",
        keywords: [
          {
            word: "alpha particle",
            definition: "Helium nucleus emitted in radioactive decay",
          },
          {
            word: "beta particle",
            definition: "Electron or positron emitted in radioactive decay",
          },
        ],
      },
    ],
  },
  {
    id: "27",
    subject: "physics",
    topic: "mechanics",
    lesson: "pressure",
    difficulty: "easy",
    year: 2022,
    session: "may/june",
    variant: "v3",
    paper: "paper2",
    level: "core",
    tags: ["calculation", "pressure"],
    parts: [
      {
        id: "27a",
        part: "(a)",
        question:
          "A force of 200 N acts on an area of 0.5 m². Calculate the pressure exerted.",
        answer: "Formula: Pressure = Force / Area\nP = 200 / 0.5 = 400 Pa",
        keywords: [
          { word: "pascal", definition: "SI unit of pressure (1 N/m²)" },
        ],
      },
    ],
  },
  {
    id: "28",
    subject: "physics",
    topic: "optics",
    lesson: "refraction",
    difficulty: "medium",
    year: 2024,
    session: "may/june",
    variant: "v1",
    paper: "paper2",
    level: "extended",
    tags: ["definition", "refraction"],
    parts: [
      {
        id: "28a",
        part: "(a)",
        question: "State Snell’s Law and define refractive index.",
        answer:
          "Snell’s Law: n₁ sin θ₁ = n₂ sin θ₂\nRefractive index (n) = speed of light in vacuum / speed of light in medium",
        keywords: [
          {
            word: "refractive index",
            definition: "Ratio of speed of light in vacuum to that in medium",
          },
        ],
      },
    ],
  },
  {
    id: "29",
    subject: "physics",
    topic: "electricity",
    lesson: "electromagnetism",
    difficulty: "medium",
    year: 2023,
    session: "feb/march",
    variant: "v3",
    paper: "paper2",
    level: "extended",
    tags: ["definition", "electromagnetism"],
    parts: [
      {
        id: "29a",
        part: "(a)",
        question: "Describe how to increase the strength of an electromagnet.",
        answer:
          "1. Increase current\n2. Add more turns to coil\n3. Use a soft iron core\n4. Reduce air gap between core and object",
        keywords: [
          {
            word: "electromagnet",
            definition: "Magnet created by electric current through coil",
          },
        ],
      },
    ],
  },
  {
    id: "30",
    subject: "physics",
    topic: "mechanics",
    lesson: "density",
    difficulty: "easy",
    year: 2024,
    session: "oct/nov",
    variant: "v2",
    paper: "paper2",
    level: "core",
    tags: ["calculation", "density"],
    parts: [
      {
        id: "30a",
        part: "(a)",
        question:
          "A cube has a mass of 1.2 kg and volume of 0.0005 m³. Calculate its density.",
        answer:
          "Formula: Density = Mass / Volume\nρ = 1.2 / 0.0005 = 2400 kg/m³",
        keywords: [{ word: "density", definition: "Mass per unit volume" }],
      },
    ],
  },
];

export const keywordDefinitions: Record<string, string> = {
  "equation": "A mathematical statement that two expressions are equal",
  "velocity": "Rate of change of displacement with respect to time",
  "vector": "A quantity that has both magnitude and direction",
  "algorithm": "A step-by-step procedure for solving a problem",
  "pseudocode": "An informal high-level description of a program's logic",
  "acceleration": "Rate of change of velocity with respect to time",
  "force": "A push or pull that can change the motion of an object",
  "energy": "The ability to do work",
  "power": "Rate of doing work or transferring energy",
  "momentum": "Product of mass and velocity",
  "frequency": "Number of complete oscillations per unit time",
  "wavelength": "Distance between two consecutive points in phase on a wave",
  "amplitude": "Maximum displacement from equilibrium position",
  "current": "Rate of flow of electric charge",
  "voltage": "Energy per unit charge",
  "resistance": "Opposition to the flow of electric current",
  "atom": "Smallest particle of an element that retains its properties",
  "molecule": "Group of atoms bonded together",
  "ion": "Atom or group of atoms with an electric charge",
  "catalyst": "Substance that speeds up a chemical reaction",
  "enzyme": "Biological catalyst that speeds up biochemical reactions",
  "photosynthesis": "Process by which plants make glucose using sunlight",
  "respiration": "Process of breaking down glucose to release energy",
  "mitosis": "Cell division producing two identical diploid cells",
  "meiosis": "Cell division producing four genetically different gametes",
  "DNA": "Deoxyribonucleic acid - genetic material",
  "RNA": "Ribonucleic acid - involved in protein synthesis",
  "gene": "Unit of heredity that codes for a specific trait",
  "allele": "Different version of the same gene",
  "genotype": "Genetic makeup of an organism",
  "phenotype": "Observable characteristics of an organism",
  "evolution": "Change in heritable traits over successive generations",
  "natural selection": "Process where advantageous traits become more common",
  "ecosystem": "Community of organisms interacting with their environment",
  "biodiversity": "Variety of life in an ecosystem",
  "sustainability":
    "Meeting present needs without compromising future generations",
};
export const dummyMCQs: MCQQuestion[] = [
  {
    id: "mcq-1",
    question: "What is the result of 2 + 2 × 3?",
    choices: [
      { id: "a", text: "8", isCorrect: true },
      { id: "b", text: "12", isCorrect: false },
      { id: "c", text: "10", isCorrect: false },
      { id: "d", text: "6", isCorrect: false },
    ],
    explanation:
      "Following order of operations (BODMAS/PEMDAS), multiplication comes before addition: 2 + (2 × 3) = 2 + 6 = 8",
    year: "2023",
    session: "May/June",
    variant: "P1",
    difficulty: "easy",
    tip: "Always remember BODMAS/PEMDAS: Brackets, Orders, Division/Multiplication, Addition/Subtraction",
  },
  {
    id: "mcq-2",
    question:
      "Which of the following is a characteristic of renewable energy sources?",
    choices: [
      { id: "a", text: "They produce greenhouse gases", isCorrect: false },
      { id: "b", text: "They can be replenished naturally", isCorrect: true },
      { id: "c", text: "They are finite resources", isCorrect: false },
      { id: "d", text: "They are always expensive", isCorrect: false },
    ],
    explanation:
      "Renewable energy sources like solar, wind, and hydroelectric power can be naturally replenished and are considered sustainable.",
    year: "2023",
    session: "Oct/Nov",
    variant: "P2",
    difficulty: "medium",
  },
  {
    id: "mcq-3",
    question: "What is the molecular formula for water?",
    choices: [
      { id: "a", text: "H₂O", isCorrect: true },
      { id: "b", text: "HO", isCorrect: false },
      { id: "c", text: "H₃O", isCorrect: false },
      { id: "d", text: "H₂O₂", isCorrect: false },
    ],
    explanation:
      "Water consists of two hydrogen atoms bonded to one oxygen atom, giving it the formula H₂O.",
    year: "2023",
    session: "May/June",
    variant: "P1",
    difficulty: "easy",
    tip: "Remember that water is made up of 2 hydrogen atoms and 1 oxygen atom - think H-to-O!",
  },
];

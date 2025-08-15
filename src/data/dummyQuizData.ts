import { Question } from "./quizData";

export const questionsWithTipsAndKeywords: Question[] = [
  {
    id: "demo-1",
    year: 2023,
    session: "may/june",
    variant: "v1",
    difficulty: "medium",
    subject: "Physics",
    topic: "Mechanics",
    lesson: "Projectile Motion",
    tags: ["projectile", "motion", "kinematics"],
    parts: [
      {
        id: "demo-1a",
        part: "A",
        question:
          "Calculate the velocity of a projectile launched at 45° with initial speed 20 m/s after 2 seconds.",
        answer:
          "Using kinematic equations:\nHorizontal velocity: vₓ = v₀cos(45°) = 20 × 0.707 = 14.14 m/s\nVertical velocity: vᵧ = v₀sin(45°) - gt = 20 × 0.707 - 9.8 × 2 = 14.14 - 19.6 = -5.46 m/s\nResultant velocity: v = √(vₓ² + vᵧ²) = √(14.14² + (-5.46)²) = √(200 + 29.8) = 15.15 m/s",
        keywords: [
          {
            word: "projectile",
            definition:
              "An object that is launched into the air and moves under the influence of gravity alone",
          },
          {
            word: "kinematic",
            definition:
              "Relating to motion without considering the forces that cause the motion",
          },
          {
            word: "velocity",
            definition: "The speed of an object in a particular direction",
          },
        ],
        tip: "Always break projectile motion into horizontal and vertical components - they are independent of each other!",
      },
    ],
  },
  {
    id: "demo-2",
    year: 2023,
    session: "oct/nov",
    variant: "v2",
    difficulty: "easy",
    subject: "Biology",
    topic: "Plant Biology",
    lesson: "Photosynthesis",
    tags: ["photosynthesis", "plants", "energy"],
    parts: [
      {
        id: "demo-2a",
        part: "A",
        question:
          "What is photosynthesis and why is it important for life on Earth?",
        answer:
          "Photosynthesis is the process by which plants convert light energy into chemical energy (glucose) using carbon dioxide and water. The equation is: 6CO₂ + 6H₂O + light energy → C₆H₁₂O₆ + 6O₂. It is important because it produces oxygen for respiration and forms the base of most food chains.",
        keywords: [
          {
            word: "photosynthesis",
            definition:
              "The process by which plants make their own food using sunlight, carbon dioxide, and water",
          },
          {
            word: "glucose",
            definition:
              "A simple sugar that serves as the primary source of energy for living organisms",
          },
          {
            word: "chlorophyll",
            definition:
              "The green pigment in plants that captures light energy for photosynthesis",
          },
        ],
      },
    ],
  },
  {
    id: "demo-3",
    year: 2023,
    session: "may/june",
    variant: "v1",
    difficulty: "hard",
    subject: "Economics",
    topic: "Market Theory",
    lesson: "Equilibrium",
    tags: ["equilibrium", "supply", "demand"],
    parts: [
      {
        id: "demo-3a",
        part: "A",
        question:
          "Explain the concept of equilibrium in economics and provide an example.",
        answer:
          "Economic equilibrium occurs when supply equals demand in a market. At this point, the quantity supplied equals the quantity demanded, and there is no tendency for the price to change. For example, if the demand for apples increases while supply remains constant, the price will rise until a new equilibrium is reached where the higher price reduces demand to match the available supply.",
        keywords: [
          {
            word: "equilibrium",
            definition:
              "A state of balance where opposing forces or factors are equal",
          },
          {
            word: "supply",
            definition:
              "The amount of a product or service that producers are willing and able to offer at various prices",
          },
          {
            word: "demand",
            definition:
              "The amount of a product or service that consumers are willing and able to buy at various prices",
          },
        ],
        tip: "Remember that equilibrium is a dynamic concept - it can shift when market conditions change!",
      },
    ],
  },
];

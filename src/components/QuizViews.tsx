import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { dummyMCQs } from "@/data/quizData";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import {
  Grid3X3,
  Play,
  FileText,
  ChevronLeft,
  ChevronRight,
  Eye,
  EyeOff,
  RotateCcw,
  ArrowLeft,
  Bookmark,
  BookmarkCheck,
  Smile,
  Meh,
  Frown,
  Save,
  Download,
  Clock,
  ChevronDown,
  PlayCircle,
  Pause,
  RotateCcw as Reset,
  FileQuestion,
  BookOpen,
  ChevronUp,
  Shuffle,
  Lightbulb,
  Image,
  FileDown,
  Timer,
  Plus,
  Minus,
} from "lucide-react";
import { Question, QuizFilters } from "@/data/quizData";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";

interface QuizViewsProps {
  questions: Question[];
  filters: QuizFilters;
  onBack: () => void;
}

interface QuizFolder {
  id: string;
  name: string;
  color: string;
  createdAt: string;
}

interface SavedQuestion {
  questionId: string;
  partId: string;
  folderId: string;
  savedAt: string;
}

interface QuestionMood {
  questionId: string;
  partId: string;
  mood: "happy" | "neutral" | "sad";
  timestamp: string;
}

interface Timer {
  id: string;
  name: string;
  duration: number; // in seconds
  remaining: number;
  isRunning: boolean;
  isCustom: boolean;
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

type ViewMode = "cards" | "live" | "exam";
type MoodType = "happy" | "neutral" | "sad";
type AnyQuestion = Question | MCQQuestion;

const QuizViews: React.FC<QuizViewsProps> = ({
  questions,
  filters,
  onBack,
}) => {
  const [viewMode, setViewMode] = useState<ViewMode>("cards");
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [revealedAnswers, setRevealedAnswers] = useState<Set<string>>(
    new Set()
  );

  const [currentPage, setCurrentPage] = useState(0);
  const [folders, setFolders] = useState<QuizFolder[]>([]);
  const [savedQuestions, setSavedQuestions] = useState<SavedQuestion[]>([]);
  const [questionMoods, setQuestionMoods] = useState<QuestionMood[]>([]);
  const [showSaveQuizDialog, setShowSaveQuizDialog] = useState(false);
  const [showExportDialog, setShowExportDialog] = useState(false);
  const [quizName, setQuizName] = useState("");
  const [selectedFolderId, setSelectedFolderId] = useState<string>("");
  const [showTimerPanel, setShowTimerPanel] = useState(false);
  const [timers, setTimers] = useState<Timer[]>([
    {
      id: "1",
      name: "5 minutes",
      duration: 300,
      remaining: 300,
      isRunning: false,
      isCustom: false,
    },
    {
      id: "2",
      name: "10 minutes",
      duration: 600,
      remaining: 600,
      isRunning: false,
      isCustom: false,
    },
    {
      id: "3",
      name: "15 minutes",
      duration: 900,
      remaining: 900,
      isRunning: false,
      isCustom: false,
    },
  ]);
  const [customTimerDuration, setCustomTimerDuration] = useState("");
  const [customTimerName, setCustomTimerName] = useState("");
  const [mcqQuestions, setMcqQuestions] = useState<MCQQuestion[]>([]);
  const [mcqAnswers, setMcqAnswers] = useState<Record<string, string>>({});
  const [revealedMCQExplanations, setRevealedMCQExplanations] = useState<
    Set<string>
  >(new Set());
  const [shuffledQuestions, setShuffledQuestions] = useState<AnyQuestion[]>([]);
  const [isShuffled, setIsShuffled] = useState(false);
  const [exportOptions, setExportOptions] = useState({
    includeQuestions: true,
    includeAnswers: true,
  });
  const questionsPerPage = 5;
  const [collapsedQuestions, setCollapsedQuestions] = useState<Set<string>>(
    new Set()
  );

  // Dummy MCQ data

  useEffect(() => {
    const saved = localStorage.getItem("quiz-revealed-answers");
    if (saved) {
      setRevealedAnswers(new Set(JSON.parse(saved)));
    }

    // Load dashboard data
    const dashboardData = localStorage.getItem("dashboard-data");
    if (dashboardData) {
      const data = JSON.parse(dashboardData);
      setFolders(data.folders || []);
      setSavedQuestions(data.savedQuestions || []);
      setQuestionMoods(data.questionMoods || []);
    }

    // Initialize MCQ questions
    setMcqQuestions(dummyMCQs);
    setShuffledQuestions(questions);
  }, [questions]);

  useEffect(() => {
    localStorage.setItem(
      "quiz-revealed-answers",
      JSON.stringify([...revealedAnswers])
    );
  }, [revealedAnswers]);

  // Timer management
  useEffect(() => {
    const interval = setInterval(() => {
      setTimers((prevTimers) =>
        prevTimers.map((timer) => {
          if (timer.isRunning && timer.remaining > 0) {
            return { ...timer, remaining: timer.remaining - 1 };
          }
          return timer;
        })
      );
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  // Auto-save quiz when questions are marked or saved
  const autoSaveQuiz = () => {
    const quiz = {
      id: Date.now().toString(),
      name: `Auto-saved Quiz ${new Date().toLocaleString()}`,
      questions: allQuestions,
      filters,
      createdAt: new Date().toISOString(),
    };

    const dashboardData = JSON.parse(
      localStorage.getItem("dashboard-data") || "{}"
    );
    const savedQuizzes = dashboardData.quizzes || [];
    savedQuizzes.push(quiz);

    const stats = dashboardData.stats || {
      totalQuizzes: 0,
      questionsAnswered: 0,
      xp: 0,
    };
    stats.totalQuizzes += 1;
    stats.xp += 15; // Auto-save XP

    dashboardData.quizzes = savedQuizzes;
    dashboardData.stats = stats;
    localStorage.setItem("dashboard-data", JSON.stringify(dashboardData));
  };

  const toggleQuestionCollapse = (questionId: string) => {
    setCollapsedQuestions((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(questionId)) {
        newSet.delete(questionId);
      } else {
        newSet.add(questionId);
      }
      return newSet;
    });
  };

  const shuffleQuestions = () => {
    const shuffled = [...allQuestions].sort(() => Math.random() - 0.5);
    setShuffledQuestions(shuffled);
    setIsShuffled(true);
  };

  const resetShuffle = () => {
    setShuffledQuestions(allQuestions);
    setIsShuffled(false);
  };

  // Combine regular questions and MCQ questions into one array
  const allQuestions: AnyQuestion[] = [...questions, ...mcqQuestions];
  const activeQuestions = isShuffled ? shuffledQuestions : allQuestions;

  const setQuestionMood = (
    questionId: string,
    partId: string,
    mood: MoodType
  ) => {
    const newMood: QuestionMood = {
      questionId,
      partId,
      mood,
      timestamp: new Date().toISOString(),
    };

    const updatedMoods = questionMoods.filter(
      (m) => !(m.questionId === questionId && m.partId === partId)
    );
    updatedMoods.push(newMood);
    setQuestionMoods(updatedMoods);

    // Auto-save quiz when mood is set
    autoSaveQuiz();

    // Save to localStorage and create built-in folders for non-neutral moods
    const dashboardData = JSON.parse(
      localStorage.getItem("dashboard-data") || "{}"
    );
    dashboardData.questionMoods = updatedMoods;

    if (mood !== "neutral") {
      const folderName = mood === "happy" ? "Liked" : "Disliked";
      const folderColor = mood === "happy" ? "#10B981" : "#EF4444";
      const folderIcon = mood === "happy" ? "Smile" : "Frown";

      let folders = dashboardData.folders || [];
      let targetFolder = folders.find((f: QuizFolder) => f.name === folderName);

      if (!targetFolder) {
        targetFolder = {
          id: `built-in-${mood}`,
          name: folderName,
          color: folderColor,
          icon: folderIcon,
          createdAt: new Date().toISOString(),
        };
        folders.push(targetFolder);
        dashboardData.folders = folders;
      }

      // Save question to the built-in folder
      const savedQuestions = dashboardData.savedQuestions || [];
      const alreadySaved = savedQuestions.some(
        (sq: SavedQuestion) =>
          sq.questionId === questionId &&
          sq.partId === partId &&
          sq.folderId === targetFolder.id
      );

      if (!alreadySaved) {
        savedQuestions.push({
          questionId,
          partId,
          folderId: targetFolder.id,
          savedAt: new Date().toISOString(),
        });
        dashboardData.savedQuestions = savedQuestions;
      }
    }

    // Update XP and stats
    const stats = dashboardData.stats || {
      totalQuizzes: 0,
      questionsAnswered: 0,
      xp: 0,
    };
    const moodXP = mood === "happy" ? 10 : mood === "neutral" ? 5 : 2;
    stats.xp += moodXP;
    const currentAnsweredCount = (dashboardData.questionMoods || []).length;
    stats.questionsAnswered = currentAnsweredCount;
    dashboardData.stats = stats;

    localStorage.setItem("dashboard-data", JSON.stringify(dashboardData));
  };

  const getQuestionMood = (questionId: string, partId: string): MoodType => {
    const mood = questionMoods.find(
      (m) => m.questionId === questionId && m.partId === partId
    );
    return mood ? mood.mood : "neutral";
  };

  const saveQuizToFolder = () => {
    if (!quizName.trim()) return;

    const quiz = {
      id: Date.now().toString(),
      name: quizName,
      questions: activeQuestions,
      filters,
      createdAt: new Date().toISOString(),
      folderId: selectedFolderId || undefined,
    };

    const dashboardData = JSON.parse(
      localStorage.getItem("dashboard-data") || "{}"
    );
    const savedQuizzes = dashboardData.quizzes || [];
    savedQuizzes.push(quiz);

    const stats = dashboardData.stats || {
      totalQuizzes: 0,
      questionsAnswered: 0,
      xp: 0,
    };
    stats.totalQuizzes += 1;
    stats.xp += 25; // Bonus XP for saving quiz

    dashboardData.quizzes = savedQuizzes;
    dashboardData.stats = stats;
    localStorage.setItem("dashboard-data", JSON.stringify(dashboardData));

    setQuizName("");
    setSelectedFolderId("");
    setShowSaveQuizDialog(false);
  };

  const exportQuiz = async (format: "json" | "txt" | "pdf" | "image") => {
    const quizData = {
      name: quizName || "Quiz Export",
      filters,
      questions: activeQuestions,
      exportedAt: new Date().toISOString(),
      exportOptions,
    };

    if (format === "pdf") {
      // Generate actual PDF using browser's print functionality
      const printWindow = window.open("", "_blank");
      if (!printWindow) return;

      const pdfContent = `
        <!DOCTYPE html>
        <html>
        <head>
          <title>${quizData.name}</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 40px; line-height: 1.6; }
            .question { margin-bottom: 30px; page-break-inside: avoid; }
            .question-header { font-weight: bold; margin-bottom: 10px; font-size: 18px; }
            .question-part { margin: 15px 0; }
            .answer { background: #f5f5f5; padding: 10px; margin-top: 10px; border-left: 4px solid #007bff; }
            .tip { background: #fff3cd; padding: 8px; border-left: 4px solid #ffc107; margin-top: 10px; }
            .mcq-choices { margin: 10px 0; }
            .mcq-choice { margin: 5px 0; padding: 5px; }
            .correct-choice { background: #d4edda; }
            @media print { 
              .no-print { display: none; }
              body { margin: 20px; }
            }
          </style>
        </head>
        <body>
          <h1>${quizData.name}</h1>
          <p>Subject: ${filters.subject} | Difficulty: ${
        filters.difficulty
      } | Generated: ${new Date().toLocaleDateString()}</p>
          <hr/>
          ${
            exportOptions.includeQuestions
              ? activeQuestions
                  .map((q, index) => {
                    if ("parts" in q) {
                      // Regular question
                      return `
                <div class="question">
                  <div class="question-header">Question ${index + 1} (${
                        q.year
                      } ${q.session} ${q.variant.toUpperCase()})</div>
                  ${q.parts
                    .map(
                      (part) => `
                    <div class="question-part">
                      <strong>${part.part})</strong> ${part.question}
                      ${
                        exportOptions.includeAnswers
                          ? `
                        <div class="answer">
                          <strong>Answer:</strong> ${part.answer}
                        </div>
                        ${
                          part.tip
                            ? `
                          <div class="tip">
                            <strong>💡 Tip:</strong> ${part.tip}
                          </div>
                        `
                            : ""
                        }
                      `
                          : ""
                      }
                    </div>
                  `
                    )
                    .join("")}
                </div>
              `;
                    } else {
                      // MCQ question
                      return `
                <div class="question">
                  <div class="question-header">Question ${index + 1} (${
                        q.year
                      } ${q.session} ${q.variant.toUpperCase()})</div>
                  <div class="question-part">
                    <strong>${q.question}</strong>
                    <div class="mcq-choices">
                      ${q.choices
                        .map(
                          (choice) => `
                        <div class="mcq-choice ${
                          choice.isCorrect && exportOptions.includeAnswers
                            ? "correct-choice"
                            : ""
                        }">
                          ${choice.id.toUpperCase()}) ${choice.text} ${
                            choice.isCorrect && exportOptions.includeAnswers
                              ? "✓"
                              : ""
                          }
                        </div>
                      `
                        )
                        .join("")}
                    </div>
                    ${
                      exportOptions.includeAnswers
                        ? `
                      <div class="answer">
                        <strong>Explanation:</strong> ${q.explanation}
                      </div>
                      ${
                        q.tip
                          ? `
                        <div class="tip">
                          <strong>💡 Tip:</strong> ${q.tip}
                        </div>
                      `
                          : ""
                      }
                    `
                        : ""
                    }
                  </div>
                </div>
              `;
                    }
                  })
                  .join("")
              : ""
          }
        </body>
        </html>
      `;

      printWindow.document.write(pdfContent);
      printWindow.document.close();
      printWindow.focus();
      setTimeout(() => {
        printWindow.print();
        printWindow.close();
      }, 250);
    } else if (format === "image") {
      // Create a canvas to render the quiz as an image
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      canvas.width = 800;
      canvas.height = 1000;

      // White background
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Title
      ctx.fillStyle = "#000000";
      ctx.font = "bold 24px Arial";
      ctx.fillText(quizData.name, 20, 40);

      // Simple text rendering for questions
      ctx.font = "16px Arial";
      let yPos = 80;

      if (exportOptions.includeQuestions) {
        activeQuestions.slice(0, 5).forEach((q, index) => {
          ctx.fillText(`Question ${index + 1}:`, 20, yPos);
          yPos += 25;

          if (isRegularQuestion(q)) {
            q.parts.forEach((part) => {
              ctx.fillText(
                `${part.part}) ${part.question.substring(0, 60)}...`,
                30,
                yPos
              );
              yPos += 20;

              if (exportOptions.includeAnswers) {
                ctx.fillText(
                  `Answer: ${part.answer.substring(0, 60)}...`,
                  40,
                  yPos
                );
                yPos += 25;

                if (part.tip) {
                  ctx.fillText(
                    `Tip: ${part.tip.substring(0, 60)}...`,
                    40,
                    yPos
                  );
                  yPos += 25;
                }
              }
            });
          } else {
            // It's an MCQQuestion
            ctx.fillText(q.question.substring(0, 60) + "...", 30, yPos);
            yPos += 20;

            q.choices.forEach((choice) => {
              ctx.fillText(
                `${choice.id.toUpperCase()}) ${choice.text}`,
                40,
                yPos
              );
              yPos += 20;
            });

            if (exportOptions.includeAnswers) {
              ctx.fillText(
                `Explanation: ${q.explanation.substring(0, 60)}...`,
                40,
                yPos
              );
              yPos += 25;

              if (q.tip) {
                ctx.fillText(`Tip: ${q.tip.substring(0, 60)}...`, 40, yPos);
                yPos += 25;
              }
            }
          }

          yPos += 10;
        });
      }

      // Download as image
      canvas.toBlob((blob) => {
        if (blob) {
          const url = URL.createObjectURL(blob);
          const a = document.createElement("a");
          a.href = url;
          a.download = `${quizData.name.replace(/\s+/g, "_")}.png`;
          a.click();
          URL.revokeObjectURL(url);
        }
      });
    } else {
      let content: string;
      let filename: string;

      if (format === "json") {
        content = JSON.stringify(quizData, null, 2);
        filename = `${quizData.name.replace(/\s+/g, "_")}.json`;
      } else {
        content = `Quiz: ${quizData.name}\n\n`;
        content += `Filters: ${JSON.stringify(filters)}\n\n`;

        if (exportOptions.includeQuestions) {
          activeQuestions.forEach((q, index) => {
            content += `Question ${index + 1}:\n`;
            if ("parts" in q) {
              q.parts.forEach((part) => {
                content += `${part.part}) ${part.question}\n`;
                if (exportOptions.includeAnswers) {
                  content += `Answer: ${part.answer}\n`;
                  if (part.tip) {
                    content += `Tip: ${part.tip}\n`;
                  }
                }
                content += "\n";
              });
            } else {
              content += `${q.question}\n`;
              q.choices.forEach((choice) => {
                content += `${choice.id.toUpperCase()}) ${choice.text}\n`;
              });
              if (exportOptions.includeAnswers) {
                content += `Answer: ${q.explanation}\n`;
                if (q.tip) {
                  content += `Tip: ${q.tip}\n`;
                }
              }
              content += "\n";
            }
          });
        }

        filename = `${quizData.name.replace(/\s+/g, "_")}.txt`;
      }

      const blob = new Blob([content], {
        type: format === "json" ? "application/json" : "text/plain",
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = filename;
      a.click();
      URL.revokeObjectURL(url);
    }

    setShowExportDialog(false);
  };

  const addCustomTimer = () => {
    if (!customTimerName.trim() || !customTimerDuration) return;

    const duration = parseInt(customTimerDuration) * 60; // Convert minutes to seconds
    const newTimer: Timer = {
      id: Date.now().toString(),
      name: customTimerName,
      duration,
      remaining: duration,
      isRunning: false,
      isCustom: true,
    };

    setTimers([...timers, newTimer]);
    setCustomTimerName("");
    setCustomTimerDuration("");
  };

  const toggleTimer = (timerId: string) => {
    setTimers(
      timers.map((timer) =>
        timer.id === timerId ? { ...timer, isRunning: !timer.isRunning } : timer
      )
    );
  };

  const resetTimer = (timerId: string) => {
    setTimers(
      timers.map((timer) =>
        timer.id === timerId
          ? { ...timer, remaining: timer.duration, isRunning: false }
          : timer
      )
    );
  };

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
  };

  const toggleAnswer = (questionId: string, partId: string) => {
    const answerId = `${questionId}-${partId}`;
    setRevealedAnswers((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(answerId)) {
        newSet.delete(answerId);
      } else {
        newSet.add(answerId);
      }
      return newSet;
    });
  };

  const saveQuestionToFolder = (
    questionId: string,
    partId: string,
    folderId: string
  ) => {
    const savedQuestion: SavedQuestion = {
      questionId,
      partId,
      folderId,
      savedAt: new Date().toISOString(),
    };

    const dashboardData = JSON.parse(
      localStorage.getItem("dashboard-data") || "{}"
    );
    const existingSaved = dashboardData.savedQuestions || [];

    const alreadySaved = existingSaved.some(
      (sq: SavedQuestion) =>
        sq.questionId === questionId &&
        sq.partId === partId &&
        sq.folderId === folderId
    );

    if (!alreadySaved) {
      dashboardData.savedQuestions = [...existingSaved, savedQuestion];
      localStorage.setItem("dashboard-data", JSON.stringify(dashboardData));
      setSavedQuestions(dashboardData.savedQuestions);
      // Auto-save quiz when question is saved
      autoSaveQuiz();
    }
  };

  const isQuestionSaved = (questionId: string, partId: string): boolean => {
    return savedQuestions.some(
      (sq) => sq.questionId === questionId && sq.partId === partId
    );
  };

  const revealAllAnswers = () => {
    const allAnswerIds = activeQuestions.flatMap((q) => {
      if ("parts" in q) {
        return q.parts.map((p) => `${q.id}-${p.id}`);
      } else {
        return [`${q.id}-mcq`];
      }
    });
    setRevealedAnswers(new Set(allAnswerIds));
    setRevealedMCQExplanations(new Set(mcqQuestions.map((q) => q.id)));
  };

  const resetAnswers = () => {
    setRevealedAnswers(new Set());
    setMcqAnswers({});
    setRevealedMCQExplanations(new Set());
    localStorage.removeItem("quiz-revealed-answers");
  };

  const handleMCQAnswer = (questionId: string, choiceId: string) => {
    setMcqAnswers((prev) => ({
      ...prev,
      [questionId]: choiceId,
    }));
  };

  const toggleMCQExplanation = (questionId: string) => {
    setRevealedMCQExplanations((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(questionId)) {
        newSet.delete(questionId);
      } else {
        newSet.add(questionId);
      }
      return newSet;
    });
  };

  const handleBackToGenerator = () => {
    onBack();
    // Auto-scroll to generator section after a brief delay
    setTimeout(() => {
      const generatorSection = document.querySelector(
        "[data-generator-section]"
      );
      if (generatorSection) {
        generatorSection.scrollIntoView({ behavior: "smooth" });
      }
    }, 100);
  };

  const renderKeywordWithHover = (
    text: string,
    keywords: Array<{ word: string; definition: string }> = []
  ) => {
    if (!keywords.length) return <span>{text}</span>;

    let result = text;
    keywords.forEach(({ word, definition }) => {
      const regex = new RegExp(`\\b${word}\\b`, "gi");
      result = result.replace(
        regex,
        `<span class="keyword-highlight" data-definition="${definition}">${word}</span>`
      );
    });

    return (
      <span
        dangerouslySetInnerHTML={{ __html: result }}
        className="[&_.keyword-highlight]:underline [&_.keyword-highlight]:decoration-dotted [&_.keyword-highlight]:cursor-help [&_.keyword-highlight]:text-primary"
      />
    );
  };

  const renderKeywords = (
    text: string,
    keywords: Array<{ word: string; definition: string }> = []
  ) => {
    if (!keywords.length) return <span>{text}</span>;

    // Split text and find keywords
    const parts = [];
    let lastIndex = 0;

    keywords.forEach(({ word, definition }) => {
      const regex = new RegExp(`\\b${word}\\b`, "gi");
      let match;
      while ((match = regex.exec(text)) !== null) {
        // Add text before keyword
        if (match.index > lastIndex) {
          parts.push({
            type: "text",
            content: text.slice(lastIndex, match.index),
            index: match.index,
          });
        }

        // Add keyword with hover
        parts.push({
          type: "keyword",
          content: match[0],
          definition,
          index: match.index,
        });

        lastIndex = match.index + match[0].length;
      }
    });

    // Add remaining text
    if (lastIndex < text.length) {
      parts.push({
        type: "text",
        content: text.slice(lastIndex),
        index: lastIndex,
      });
    }

    // Sort by index to maintain order
    parts.sort((a, b) => a.index - b.index);

    return (
      <span>
        {parts.map((part, index) => {
          if (part.type === "keyword") {
            return (
              <HoverCard key={index}>
                <HoverCardTrigger asChild>
                  <span className="underline decoration-dotted cursor-help text-primary">
                    {part.content}
                  </span>
                </HoverCardTrigger>
                <HoverCardContent className="w-80">
                  <div className="space-y-2">
                    <h4 className="text-sm font-semibold">{part.content}</h4>
                    <p className="text-sm text-muted-foreground">
                      {part.definition}
                    </p>
                  </div>
                </HoverCardContent>
              </HoverCard>
            );
          }
          return <span key={index}>{part.content}</span>;
        })}
      </span>
    );
  };
  const isRegularQuestion = (q: AnyQuestion): q is Question => {
    return "parts" in q;
  };
  const renderQuestionPart = (
    question: Question,
    part: any,
    showAnswer: boolean = false
  ) => {
    const currentMood = getQuestionMood(question.id, part.id);
    const isAnswerRevealed = revealedAnswers.has(`${question.id}-${part.id}`);

    return (
      <div key={part.id} className="space-y-3">
        <div className="flex items-start gap-3">
          <Badge variant="outline" className="shrink-0 mt-1">
            {part.part}
          </Badge>
          <div className="flex-1 space-y-3">
            <div className="prose prose-sm dark:prose-invert max-w-none">
              {part.question}
            </div>

            {part.hasImage && part.imageUrl && (
              <img
                src={part.imageUrl}
                alt="Question illustration"
                className="max-w-full md:max-w-md rounded-lg border"
              />
            )}

            {part.hasCode && part.code && (
              <div className="code-block">
                <pre className="text-sm overflow-x-auto">
                  <code className={`language-${part.codeLanguage || "text"}`}>
                    {part.code}
                  </code>
                </pre>
              </div>
            )}

            {part.hasLinks && part.links && (
              <div className="flex flex-wrap gap-2">
                {part.links.map((link: any, idx: number) => (
                  <a
                    key={idx}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline text-sm"
                  >
                    {link.text} ↗
                  </a>
                ))}
              </div>
            )}

            <div className="flex items-center gap-2 flex-wrap">
              <Button
                variant="outline"
                size="sm"
                onClick={() => toggleAnswer(question.id, part.id)}
                className="flex items-center gap-2"
              >
                {isAnswerRevealed ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
                {isAnswerRevealed ? "Hide" : "Show"} Answer
              </Button>
            </div>

            {(showAnswer || isAnswerRevealed) && (
              <div className="mt-3 p-4 bg-muted rounded-lg animate-slide-up">
                <div className="flex items-center gap-2 mb-2">
                  <span className="font-medium text-sm text-primary">
                    Answer:
                  </span>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() =>
                        window.open(
                          `/papers/${question.session}-${question.variant}-${question.year}-qp.pdf`,
                          "_blank"
                        )
                      }
                      className="h-6 w-6 p-0"
                      title="View Question Paper"
                    >
                      <FileQuestion className="h-3 w-3" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() =>
                        window.open(
                          `/papers/${question.session}-${question.variant}-${question.year}-ms.pdf`,
                          "_blank"
                        )
                      }
                      className="h-6 w-6 p-0"
                      title="View Mark Scheme"
                    >
                      <BookOpen className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
                <div className="prose prose-sm dark:prose-invert max-w-none whitespace-pre-wrap">
                  {part.answer}
                </div>

                {part.tip && (
                  <div className="mt-3 p-3 bg-yellow-50 dark:bg-yellow-900/20 border-l-4 border-yellow-400 rounded-r-lg">
                    <div className="flex items-start gap-2">
                      <Lightbulb className="h-4 w-4 text-yellow-600 dark:text-yellow-400 mt-0.5 shrink-0" />
                      <div>
                        <span className="text-sm font-medium text-yellow-800 dark:text-yellow-200">
                          Tip:{" "}
                        </span>
                        <span className="text-sm text-yellow-700 dark:text-yellow-300">
                          {part.tip}
                        </span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Mood Selection - Only show after answer is revealed */}
                <div className="flex items-center justify-center gap-1 border rounded-lg p-1 mt-3 w-fit">
                  <Button
                    variant={currentMood === "happy" ? "happy" : "ghost"}
                    size="sm"
                    onClick={() =>
                      setQuestionMood(question.id, part.id, "happy")
                    }
                    className="h-8 w-8 p-0"
                  >
                    <Smile
                      className={`h-4 w-4 ${
                        currentMood === "happy"
                          ? "text-white"
                          : "text-green-500"
                      }`}
                    />
                  </Button>
                  <Button
                    variant={currentMood === "neutral" ? "neutral" : "ghost"}
                    size="sm"
                    onClick={() =>
                      setQuestionMood(question.id, part.id, "neutral")
                    }
                    className="h-8 w-8 p-0"
                  >
                    <Meh
                      className={`h-4 w-4 ${
                        currentMood === "neutral"
                          ? "text-white"
                          : "text-gray-500"
                      }`}
                    />
                  </Button>
                  <Button
                    variant={currentMood === "sad" ? "sad" : "ghost"}
                    size="sm"
                    onClick={() => setQuestionMood(question.id, part.id, "sad")}
                    className="h-8 w-8 p-0"
                  >
                    <Frown
                      className={`h-4 w-4 ${
                        currentMood === "sad" ? "text-white" : "text-red-500"
                      }`}
                    />
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  const renderMCQQuestion = (mcq: MCQQuestion, questionNumber: number) => {
    const selectedAnswer = mcqAnswers[mcq.id];
    const showExplanation = revealedMCQExplanations.has(mcq.id);

    return (
      <Card key={mcq.id} className="quiz-card">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Question {questionNumber}</CardTitle>
            <div className="flex gap-2">
              <Badge
                className={`difficulty-${mcq.difficulty} ${
                  mcq.difficulty === "medium"
                    ? "bg-yellow-500 hover:bg-yellow-600 "
                    : mcq.difficulty === "easy"
                    ? "bg-green-500 hover:bg-green-600 "
                    : mcq.difficulty === "hard"
                    ? "bg-red-500 hover:bg-red-600 "
                    : "bg-primary"
                } `}
              >
                {mcq.difficulty}
              </Badge>
              <Badge variant="outline">
                {mcq.year} {mcq.session} {mcq.variant.toUpperCase()}
              </Badge>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="prose prose-sm dark:prose-invert max-w-none">
            {mcq.question}
          </div>

          <RadioGroup
            value={selectedAnswer}
            onValueChange={(value) => handleMCQAnswer(mcq.id, value)}
            className="space-y-2"
          >
            {mcq.choices.map((choice) => {
              const isSelected = selectedAnswer === choice.id;
              const isCorrect = choice.isCorrect;
              const showResult = selectedAnswer !== undefined;

              return (
                <div key={choice.id} className="flex items-center space-x-2">
                  <RadioGroupItem
                    value={choice.id}
                    id={`${mcq.id}-${choice.id}`}
                    disabled={selectedAnswer !== undefined}
                  />
                  <Label
                    htmlFor={`${mcq.id}-${choice.id}`}
                    className={`flex-1 cursor-pointer p-2 rounded ${
                      showResult
                        ? isSelected
                          ? isCorrect
                            ? "bg-green-100 dark:bg-green-900/20 border border-green-300 dark:border-green-700"
                            : "bg-red-100 dark:bg-red-900/20 border border-red-300 dark:border-red-700"
                          : isCorrect
                          ? "bg-green-50 dark:bg-green-900/10 border border-green-200 dark:border-green-800"
                          : ""
                        : "hover:bg-muted"
                    }`}
                  >
                    <span className="font-medium">
                      {choice.id.toUpperCase()})
                    </span>{" "}
                    {choice.text}
                    {showResult && isCorrect && (
                      <span className="ml-2 text-green-600 dark:text-green-400">
                        ✓
                      </span>
                    )}
                    {showResult && isSelected && !isCorrect && (
                      <span className="ml-2 text-red-600 dark:text-red-400">
                        ✗
                      </span>
                    )}
                  </Label>
                </div>
              );
            })}
          </RadioGroup>

          {selectedAnswer && (
            <div className="space-y-3">
              <Button
                variant="outline"
                size="sm"
                onClick={() => toggleMCQExplanation(mcq.id)}
                className="flex items-center gap-2"
              >
                {showExplanation ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
                {showExplanation ? "Hide" : "Show"} Explanation
              </Button>

              {showExplanation && (
                <div className="p-4 bg-muted rounded-lg">
                  <div className="prose prose-sm dark:prose-invert max-w-none">
                    <strong>Explanation:</strong> {mcq.explanation}
                  </div>

                  {mcq.tip && (
                    <div className="mt-3 p-3 bg-yellow-50 dark:bg-yellow-900/20 border-l-4 border-yellow-400 rounded-r-lg">
                      <div className="flex items-start gap-2">
                        <Lightbulb className="h-4 w-4 text-yellow-600 dark:text-yellow-400 mt-0.5 shrink-0" />
                        <div>
                          <span className="text-sm font-medium text-yellow-800 dark:text-yellow-200">
                            Tip:{" "}
                          </span>
                          <span className="text-sm text-yellow-700 dark:text-yellow-300">
                            {mcq.tip}
                          </span>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Mood Selection for MCQ */}
                  <div className="flex items-center justify-center gap-1 border rounded-lg p-1 mt-3 w-fit">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setQuestionMood(mcq.id, "mcq", "happy")}
                      className="h-8 w-8 p-0"
                    >
                      <Smile className="h-4 w-4 text-green-500" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setQuestionMood(mcq.id, "mcq", "neutral")}
                      className="h-8 w-8 p-0"
                    >
                      <Meh className="h-4 w-4 text-gray-500" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setQuestionMood(mcq.id, "mcq", "sad")}
                      className="h-8 w-8 p-0"
                    >
                      <Frown className="h-4 w-4 text-red-500" />
                    </Button>
                  </div>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    );
  };

  const renderLiveView = () => {
    const currentItem = activeQuestions[currentQuestionIndex];
    const activeTimers = timers.filter((t) => t.isRunning);
    const leastTimer =
      activeTimers.length > 0
        ? activeTimers.reduce((min, timer) =>
            timer.remaining < min.remaining ? timer : min
          )
        : null;
    return (
      <div className="space-y-6">
        {/* Timer Panel for Live Mode */}
        <div className="flex items-center justify-between">
          <div className="text-center flex-1">
            <div className="text-sm text-muted-foreground">
              Question {currentQuestionIndex + 1} of {activeQuestions.length}
            </div>
            <div className="w-full max-w-64 bg-muted rounded-full h-2 mt-1 mx-auto">
              <div
                className="bg-primary h-2 rounded-full transition-all duration-300"
                style={{
                  width: `${
                    ((currentQuestionIndex + 1) / activeQuestions.length) * 100
                  }%`,
                }}
              />
            </div>
          </div>
          <Collapsible open={showTimerPanel} onOpenChange={setShowTimerPanel}>
            <CollapsibleTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className="mt-2 flex items-center gap-2"
              >
                <Clock className="h-4 w-4" />
                {leastTimer
                  ? `${leastTimer.name}: ${formatTime(leastTimer.remaining)}`
                  : "Timer Panel"}
                <ChevronDown className="h-4 w-4" />
              </Button>
            </CollapsibleTrigger>
            <CollapsibleContent className="mt-4">
              <Card className="p-4">
                <div className="space-y-4">
                  <div className="flex flex-col sm:flex-row items-center gap-2 mb-4">
                    <Input
                      placeholder="Timer name"
                      value={customTimerName}
                      onChange={(e) => setCustomTimerName(e.target.value)}
                      className="flex-1"
                    />
                    <Input
                      type="number"
                      placeholder="Minutes"
                      value={customTimerDuration}
                      onChange={(e) => setCustomTimerDuration(e.target.value)}
                      className="w-full sm:w-20"
                    />
                    <Button
                      onClick={addCustomTimer}
                      size="sm"
                      className="w-full sm:w-auto"
                    >
                      Add
                    </Button>
                  </div>

                  <div className="grid gap-2">
                    {timers.map((timer) => (
                      <div
                        key={timer.id}
                        className="flex items-center justify-between p-2 border rounded"
                      >
                        <div className="flex items-center gap-3">
                          <span className="font-medium">{timer.name}</span>
                          <span
                            className={`font-mono ${
                              timer.remaining <= 60 ? "text-red-500" : ""
                            }`}
                          >
                            {formatTime(timer.remaining)}
                          </span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => toggleTimer(timer.id)}
                          >
                            {timer.isRunning ? (
                              <Pause className="h-4 w-4" />
                            ) : (
                              <PlayCircle className="h-4 w-4" />
                            )}
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => resetTimer(timer.id)}
                          >
                            <Reset className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </Card>
            </CollapsibleContent>
          </Collapsible>
        </div>

        {/* Timer Panel */}

        {currentItem && (
          <>
            {/* Regular Question */}
            {"parts" in currentItem && (
              <Card className="quiz-card">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>Question {currentQuestionIndex + 1}</CardTitle>
                    <div className="flex gap-2">
                      <Badge
                        className={`difficulty-${currentItem.difficulty} ${
                          currentItem.difficulty === "medium"
                            ? "bg-yellow-500 hover:bg-yellow-600 "
                            : currentItem.difficulty === "easy"
                            ? "bg-green-500 hover:bg-green-600 "
                            : currentItem.difficulty === "hard"
                            ? "bg-red-500 hover:bg-red-600 "
                            : "bg-primary"
                        } `}
                      >
                        {currentItem.difficulty}
                      </Badge>
                      <Badge variant="outline">
                        {currentItem.year} {currentItem.session}{" "}
                        {currentItem.variant.toUpperCase()}
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {currentItem.parts.map((part) =>
                    renderQuestionPart(currentItem, part)
                  )}
                </CardContent>
              </Card>
            )}

            {/* MCQ Question */}
            {"choices" in currentItem &&
              renderMCQQuestion(currentItem, currentQuestionIndex + 1)}
          </>
        )}

        <div className="flex items-center justify-between">
          <Button
            variant="outline"
            onClick={() =>
              setCurrentQuestionIndex(Math.max(0, currentQuestionIndex - 1))
            }
            disabled={currentQuestionIndex === 0}
            className="flex items-center gap-2"
          >
            <ChevronLeft className="h-4 w-4" />
            Previous
          </Button>

          <span className="text-sm text-muted-foreground">
            {currentQuestionIndex + 1} / {activeQuestions.length}
          </span>

          <Button
            variant="outline"
            onClick={() =>
              setCurrentQuestionIndex(
                Math.min(activeQuestions.length - 1, currentQuestionIndex + 1)
              )
            }
            disabled={currentQuestionIndex === activeQuestions.length - 1}
            className="flex items-center gap-2"
          >
            Next
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    );
  };

  const renderExamView = () => {
    const totalPages = Math.ceil(activeQuestions.length / questionsPerPage);
    const currentItems = activeQuestions.slice(
      currentPage * questionsPerPage,
      (currentPage + 1) * questionsPerPage
    );

    return (
      <div className="space-y-6">
        <div className="text-center">
          <h2 className="text-xl font-bold">Exam Paper</h2>
          <p className="text-sm text-muted-foreground">
            Page {currentPage + 1} of {totalPages}
          </p>
        </div>

        <Card className="quiz-card">
          <CardContent className="p-8 space-y-8">
            {currentItems.map((item, index) => {
              const questionNumber = currentPage * questionsPerPage + index + 1;
              return (
                <div key={item.id}>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold">{questionNumber}.</h3>
                    <div className="flex gap-2">
                      <Badge
                        className={`difficulty-${item.difficulty} ${
                          item.difficulty === "medium"
                            ? "bg-yellow-500 hover:bg-yellow-600 "
                            : item.difficulty === "easy"
                            ? "bg-green-500 hover:bg-green-600 "
                            : item.difficulty === "hard"
                            ? "bg-red-500 hover:bg-red-600 "
                            : "bg-primary"
                        } `}
                      >
                        {item.difficulty}
                      </Badge>
                      <Badge variant="outline">
                        {item.year} {item.session} {item.variant.toUpperCase()}
                      </Badge>
                    </div>
                  </div>

                  <div className="ml-6 space-y-4">
                    {/* Regular Question */}
                    {"parts" in item &&
                      item.parts.map((part) => renderQuestionPart(item, part))}

                    {/* MCQ Question */}
                    {"choices" in item && (
                      <div className="space-y-4">
                        <div className="prose prose-sm dark:prose-invert max-w-none">
                          {item.question}
                        </div>
                        <div className="space-y-2">
                          {item.choices.map((choice) => (
                            <div
                              key={choice.id}
                              className="flex items-center space-x-2"
                            >
                              <span className="font-medium">
                                {choice.id.toUpperCase()})
                              </span>
                              <span>{choice.text}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {index < currentItems.length - 1 && (
                    <Separator className="my-8" />
                  )}
                </div>
              );
            })}
          </CardContent>
        </Card>

        {totalPages > 1 && (
          <div className="flex items-center justify-between">
            <Button
              variant="outline"
              onClick={() => setCurrentPage(Math.max(0, currentPage - 1))}
              disabled={currentPage === 0}
              className="flex items-center gap-2"
            >
              <ChevronLeft className="h-4 w-4" />
              Previous Page
            </Button>

            <span className="text-sm text-muted-foreground">
              Page {currentPage + 1} of {totalPages}
            </span>

            <Button
              variant="outline"
              onClick={() =>
                setCurrentPage(Math.min(totalPages - 1, currentPage + 1))
              }
              disabled={currentPage === totalPages - 1}
              className="flex items-center gap-2"
            >
              Next Page
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-6 animate-fade-in px-2 sm:px-0">
      {/* Header with controls */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <Button
          variant="outline"
          onClick={handleBackToGenerator}
          className="flex items-center gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Generator
        </Button>

        {/* View Mode Icons */}
        <div className="flex items-center gap-2 border rounded-lg p-1">
          <Button
            variant={viewMode === "cards" ? "default" : "ghost"}
            size="sm"
            onClick={() => setViewMode("cards")}
            className="h-8 w-8 p-0"
          >
            <Grid3X3 className="h-4 w-4" />
          </Button>
          <Button
            variant={viewMode === "live" ? "default" : "ghost"}
            size="sm"
            onClick={() => setViewMode("live")}
            className="h-8 w-8 p-0"
          >
            <Play className="h-4 w-4" />
          </Button>
          <Button
            variant={viewMode === "exam" ? "default" : "ghost"}
            size="sm"
            onClick={() => setViewMode("exam")}
            className="h-8 w-8 p-0"
          >
            <FileText className="h-4 w-4" />
          </Button>
        </div>

        {/* Quiz Controls */}
        <div className="flex flex-wrap items-center gap-2">
          <Button
            variant="outline"
            onClick={isShuffled ? resetShuffle : shuffleQuestions}
            size="sm"
            className="flex items-center gap-2"
          >
            <Shuffle className="h-4 w-4" />
            {isShuffled ? "Reset Order" : "Shuffle"}
          </Button>

          <Dialog
            open={showSaveQuizDialog}
            onOpenChange={setShowSaveQuizDialog}
          >
            <DialogTrigger asChild>
              <Button variant="outline" size="sm">
                <Save className="h-4 w-4 mr-2" />
                Save Quiz
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Save Quiz</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <Input
                  placeholder="Quiz name"
                  value={quizName}
                  onChange={(e) => setQuizName(e.target.value)}
                />
                <Select
                  value={selectedFolderId}
                  onValueChange={setSelectedFolderId}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select folder (optional)" />
                  </SelectTrigger>
                  <SelectContent>
                    {folders.map((folder) => (
                      <SelectItem key={folder.id} value={folder.id}>
                        <div className="flex items-center gap-2">
                          <div
                            className="w-3 h-3 rounded"
                            style={{ backgroundColor: folder.color }}
                          />
                          {folder.name}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Button onClick={saveQuizToFolder} className="w-full">
                  Save Quiz
                </Button>
              </div>
            </DialogContent>
          </Dialog>

          <Dialog open={showExportDialog} onOpenChange={setShowExportDialog}>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Export Quiz</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <Input
                  placeholder="Export name"
                  value={quizName}
                  onChange={(e) => setQuizName(e.target.value)}
                />

                <div className="space-y-3">
                  <h4 className="text-sm font-medium">Export Options</h4>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="include-questions"
                      checked={exportOptions.includeQuestions}
                      onCheckedChange={(checked) =>
                        setExportOptions((prev) => ({
                          ...prev,
                          includeQuestions: !!checked,
                        }))
                      }
                    />
                    <Label htmlFor="include-questions">Include Questions</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="include-answers"
                      checked={exportOptions.includeAnswers}
                      onCheckedChange={(checked) =>
                        setExportOptions((prev) => ({
                          ...prev,
                          includeAnswers: !!checked,
                        }))
                      }
                    />
                    <Label htmlFor="include-answers">Include Answers</Label>
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <Button onClick={() => exportQuiz("pdf")} className="w-full">
                    <FileDown className="h-4 w-4 mr-2" />
                    Export as PDF
                  </Button>
                  <Button
                    onClick={() => exportQuiz("image")}
                    variant="outline"
                    className="w-full"
                  >
                    <Image className="h-4 w-4 mr-2" />
                    Export as Image
                  </Button>
                  <Button
                    onClick={() => exportQuiz("txt")}
                    variant="outline"
                    className="w-full"
                  >
                    Export as Text
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>

          <Button variant="outline" onClick={revealAllAnswers} size="sm">
            <Eye className="h-4 w-4 mr-2" />
            Reveal All
          </Button>
          <Button variant="outline" onClick={resetAnswers} size="sm">
            <RotateCcw className="h-4 w-4 mr-2" />
            Reset
          </Button>
        </div>
      </div>

      {/* View Content */}
      {viewMode === "cards" && (
        <div className="grid gap-6">
          {/* All Questions Combined */}
          {activeQuestions.map((question, index) => (
            <Card key={question.id} className="quiz-card">
              <Collapsible
                open={!collapsedQuestions.has(question.id)}
                onOpenChange={() => toggleQuestionCollapse(question.id)}
              >
                <CollapsibleTrigger asChild>
                  <CardHeader className="cursor-pointer hover:bg-muted/50 transition-colors">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">
                        Question {index + 1}
                      </CardTitle>
                      <div className="flex items-center gap-2">
                        <Badge
                          className={`difficulty-${question.difficulty} ${
                            question.difficulty === "medium"
                              ? "bg-yellow-500 hover:bg-yellow-600 "
                              : question.difficulty === "easy"
                              ? "bg-green-500 hover:bg-green-600 "
                              : question.difficulty === "hard"
                              ? "bg-red-500 hover:bg-red-600 "
                              : "bg-primary"
                          } `}
                        >
                          {question.difficulty}
                        </Badge>
                        <Badge variant="outline">
                          {question.year} {question.session}{" "}
                          {question.variant.toUpperCase()}
                        </Badge>
                        {collapsedQuestions.has(question.id) ? (
                          <ChevronDown className="h-4 w-4" />
                        ) : (
                          <ChevronUp className="h-4 w-4" />
                        )}
                      </div>
                    </div>
                  </CardHeader>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <CardContent className="space-y-4">
                    {"parts" in question &&
                      question.parts.map((part) =>
                        renderQuestionPart(question, part)
                      )}
                    {"choices" in question && (
                      <div className="space-y-4">
                        <div className="prose prose-sm dark:prose-invert max-w-none">
                          {question.question}
                        </div>
                        <RadioGroup
                          value={mcqAnswers[question.id]}
                          onValueChange={(value) =>
                            handleMCQAnswer(question.id, value)
                          }
                          className="space-y-2"
                        >
                          {question.choices.map((choice) => {
                            const isSelected =
                              mcqAnswers[question.id] === choice.id;
                            const isCorrect = choice.isCorrect;
                            const showResult =
                              mcqAnswers[question.id] !== undefined;

                            return (
                              <div
                                key={choice.id}
                                className="flex items-center space-x-2"
                              >
                                <RadioGroupItem
                                  value={choice.id}
                                  id={`${question.id}-${choice.id}`}
                                  disabled={
                                    mcqAnswers[question.id] !== undefined
                                  }
                                />
                                <Label
                                  htmlFor={`${question.id}-${choice.id}`}
                                  className={`flex-1 cursor-pointer p-2 rounded ${
                                    showResult
                                      ? isSelected
                                        ? isCorrect
                                          ? "bg-green-100 dark:bg-green-900/20 border border-green-300 dark:border-green-700"
                                          : "bg-red-100 dark:bg-red-900/20 border border-red-300 dark:border-red-700"
                                        : isCorrect
                                        ? "bg-green-50 dark:bg-green-900/10 border border-green-200 dark:border-green-800"
                                        : ""
                                      : "hover:bg-muted"
                                  }`}
                                >
                                  <span className="font-medium">
                                    {choice.id.toUpperCase()})
                                  </span>{" "}
                                  {choice.text}
                                  {showResult && isCorrect && (
                                    <span className="ml-2 text-green-600 dark:text-green-400">
                                      ✓
                                    </span>
                                  )}
                                  {showResult && isSelected && !isCorrect && (
                                    <span className="ml-2 text-red-600 dark:text-red-400">
                                      ✗
                                    </span>
                                  )}
                                </Label>
                              </div>
                            );
                          })}
                        </RadioGroup>

                        {mcqAnswers[question.id] && (
                          <div className="space-y-3">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => toggleMCQExplanation(question.id)}
                              className="flex items-center gap-2"
                            >
                              {revealedMCQExplanations.has(question.id) ? (
                                <EyeOff className="h-4 w-4" />
                              ) : (
                                <Eye className="h-4 w-4" />
                              )}
                              {revealedMCQExplanations.has(question.id)
                                ? "Hide"
                                : "Show"}{" "}
                              Explanation
                            </Button>

                            {revealedMCQExplanations.has(question.id) && (
                              <div className="p-4 bg-muted rounded-lg">
                                <div className="prose prose-sm dark:prose-invert max-w-none">
                                  <strong>Explanation:</strong>{" "}
                                  {question.explanation}
                                </div>

                                {question.tip && (
                                  <div className="mt-3 p-3 bg-yellow-50 dark:bg-yellow-900/20 border-l-4 border-yellow-400 rounded-r-lg">
                                    <div className="flex items-start gap-2">
                                      <Lightbulb className="h-4 w-4 text-yellow-600 dark:text-yellow-400 mt-0.5 shrink-0" />
                                      <div>
                                        <span className="text-sm font-medium text-yellow-800 dark:text-yellow-200">
                                          Tip:{" "}
                                        </span>
                                        <span className="text-sm text-yellow-700 dark:text-yellow-300">
                                          {question.tip}
                                        </span>
                                      </div>
                                    </div>
                                  </div>
                                )}
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    )}
                  </CardContent>
                </CollapsibleContent>
              </Collapsible>
            </Card>
          ))}
        </div>
      )}

      {viewMode === "live" && renderLiveView()}
      {viewMode === "exam" && renderExamView()}
    </div>
  );
};

export default QuizViews;

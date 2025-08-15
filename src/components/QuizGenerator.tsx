import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  ChevronDown,
  ChevronUp,
  Settings,
  Play,
  Plus,
  Minus,
  Atom,
  Beaker,
  Dna,
  Layers,
  DollarSign,
  Save,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  subjects,
  Question,
  sampleQuestions,
  QuizFilters,
} from "@/data/quizData";

interface QuizGeneratorProps {
  onGenerateQuiz: (questions: Question[], filters: QuizFilters) => void;
}

interface SavedQuiz {
  id: string;
  name: string;
  questions: Question[];
  filters: QuizFilters;
  createdAt: string;
  folderId?: string;
}

interface QuizFolder {
  id: string;
  name: string;
  color: string;
  createdAt: string;
}

const QuizGenerator: React.FC<QuizGeneratorProps> = ({ onGenerateQuiz }) => {
  const [isFiltersOpen, setIsFiltersOpen] = useState(true);
  const [openTopics, setOpenTopics] = useState<string[]>([]);
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [quizName, setQuizName] = useState("");
  const [selectedFolder, setSelectedFolder] = useState<string>("");
  const [folders, setFolders] = useState<QuizFolder[]>([]);
  const [lastGeneratedQuiz, setLastGeneratedQuiz] = useState<{
    questions: Question[];
    filters: QuizFilters;
  } | null>(null);

  const [filters, setFilters] = useState<QuizFilters>(() => {
    const saved = localStorage.getItem("quiz-filters");
    return saved
      ? JSON.parse(saved)
      : {
          subject: "",
          topics: [],
          lessons: [],
          difficulty: "mixed",
          yearRange: [2019, 2025],
          sessions: [],
          variants: [],
          papers: [],
          level: "extended",
          tags: [],
          numberOfQuestions: 10,
        };
  });

  useEffect(() => {
    localStorage.setItem("quiz-filters", JSON.stringify(filters));
  }, [filters]);

  useEffect(() => {
    // Load folders from localStorage
    const dashboardData = localStorage.getItem("dashboard-data");
    if (dashboardData) {
      const data = JSON.parse(dashboardData);
      setFolders(data.folders || []);
    }
  }, []);

  const selectedSubject = subjects.find((s) => s.id === filters.subject);
  const availableSessions = ["feb/march", "may/june", "oct/nov"];

  // Updated variant logic
  const getAvailableVariants = (): Array<"v1" | "v2" | "v3"> => {
    if (filters.sessions.length === 1 && filters.sessions[0] === "feb/march") {
      return ["v2"];
    }
    return ["v1", "v2", "v3"];
  };

  const availablePapers = selectedSubject?.isScience
    ? ["paper2", "paper4", "paper6"]
    : selectedSubject?.isComputerScience
    ? ["paper1", "paper2"]
    : [];

  // Get available questions count based on current filters
  const getAvailableQuestionCount = (): number => {
    return sampleQuestions.filter((q) => {
      if (filters.subject && q.subject !== filters.subject) return false;
      if (filters.lessons.length && !filters.lessons.includes(q.lesson))
        return false;
      if (filters.difficulty !== "mixed" && q.difficulty !== filters.difficulty)
        return false;
      if (q.year < filters.yearRange[0] || q.year > filters.yearRange[1])
        return false;
      if (filters.sessions.length && !filters.sessions.includes(q.session))
        return false;
      if (filters.variants.length && !filters.variants.includes(q.variant))
        return false;
      if (
        filters.papers &&
        filters.papers.length &&
        q.paper &&
        !filters.papers.includes(q.paper)
      )
        return false;
      if (filters.level && q.level && q.level !== filters.level) return false;
      return true;
    }).length;
  };

  const availableQuestions = getAvailableQuestionCount();
  const maxQuestions = Math.max(1, availableQuestions);

  // Custom number input handlers
  const incrementQuestions = () => {
    if (filters.numberOfQuestions < maxQuestions) {
      setFilters((prev) => ({
        ...prev,
        numberOfQuestions: prev.numberOfQuestions + 1,
      }));
    }
  };

  const decrementQuestions = () => {
    if (filters.numberOfQuestions > 1) {
      setFilters((prev) => ({
        ...prev,
        numberOfQuestions: prev.numberOfQuestions - 1,
      }));
    }
  };

  const handleNumberChange = (value: string) => {
    const num = parseInt(value) || 1;
    const clampedNum = Math.max(1, Math.min(maxQuestions, num));
    setFilters((prev) => ({ ...prev, numberOfQuestions: clampedNum }));
  };

  // Get icon component
  const getIconComponent = (iconName: string) => {
    const icons = { Atom, Beaker, Dna, Layers, DollarSign };
    return icons[iconName as keyof typeof icons] || Atom;
  };

  const handleTopicToggle = (topicId: string) => {
    const topic = selectedSubject?.topics.find((t) => t.id === topicId);
    if (!topic) return;

    const topicLessons = topic.lessons.map((l) => l.id);
    const isTopicSelected = topicLessons.every((l) =>
      filters.lessons.includes(l)
    );

    if (isTopicSelected) {
      setFilters((prev) => ({
        ...prev,
        lessons: prev.lessons.filter((l) => !topicLessons.includes(l)),
      }));
    } else {
      setFilters((prev) => ({
        ...prev,
        lessons: [...new Set([...prev.lessons, ...topicLessons])],
      }));
    }
  };

  const handleLessonToggle = (lessonId: string) => {
    setFilters((prev) => ({
      ...prev,
      lessons: prev.lessons.includes(lessonId)
        ? prev.lessons.filter((l) => l !== lessonId)
        : [...prev.lessons, lessonId],
    }));
  };

  const generateQuiz = () => {
    // Filter questions based on selected criteria
    let filteredQuestions = sampleQuestions.filter((q) => {
      if (filters.subject && q.subject !== filters.subject) return false;
      if (filters.lessons.length && !filters.lessons.includes(q.lesson))
        return false;
      if (filters.difficulty !== "mixed" && q.difficulty !== filters.difficulty)
        return false;
      if (q.year < filters.yearRange[0] || q.year > filters.yearRange[1])
        return false;
      if (filters.sessions.length && !filters.sessions.includes(q.session))
        return false;
      if (filters.variants.length && !filters.variants.includes(q.variant))
        return false;
      if (
        filters.papers &&
        filters.papers.length &&
        q.paper &&
        !filters.papers.includes(q.paper)
      )
        return false;
      if (filters.level && q.level && q.level !== filters.level) return false;
      if (
        filters.tags.length &&
        !filters.tags.includes("mixed") &&
        !q.tags.some((tag) => filters.tags.includes(tag))
      )
        return false;
      return true;
    });

    // Shuffle and limit questions
    filteredQuestions = filteredQuestions.sort(() => Math.random() - 0.5);
    filteredQuestions = filteredQuestions.slice(0, filters.numberOfQuestions);

    setLastGeneratedQuiz({ questions: filteredQuestions, filters });

    // Auto-save recent quiz
    const recentQuiz = {
      id: Date.now().toString(),
      name: `${
        selectedSubject?.name || "Quiz"
      } - ${new Date().toLocaleDateString()}`,
      questions: filteredQuestions,
      filters,
      createdAt: new Date().toISOString(),
    };

    const dashboardData = JSON.parse(
      localStorage.getItem("dashboard-data") || "{}"
    );
    const existingQuizzes = dashboardData.quizzes || [];
    dashboardData.quizzes = [recentQuiz, ...existingQuizzes].slice(0, 20); // Keep last 20
    localStorage.setItem("dashboard-data", JSON.stringify(dashboardData));

    onGenerateQuiz(filteredQuestions, filters);
  };

  const saveQuiz = () => {
    if (!lastGeneratedQuiz || !quizName.trim()) return;

    const savedQuiz: SavedQuiz = {
      id: Date.now().toString(),
      name: quizName,
      questions: lastGeneratedQuiz.questions,
      filters: lastGeneratedQuiz.filters,
      createdAt: new Date().toISOString(),
      folderId: selectedFolder || undefined,
    };

    const dashboardData = JSON.parse(
      localStorage.getItem("dashboard-data") || "{}"
    );
    const existingQuizzes = dashboardData.quizzes || [];
    dashboardData.quizzes = [savedQuiz, ...existingQuizzes];
    localStorage.setItem("dashboard-data", JSON.stringify(dashboardData));

    setQuizName("");
    setSelectedFolder("");
    setShowSaveDialog(false);
  };

  const toggleTopicOpen = (topicId: string) => {
    setOpenTopics((prev) =>
      prev.includes(topicId)
        ? prev.filter((id) => id !== topicId)
        : [...prev, topicId]
    );
  };

  // Check if generate button should be disabled
  const isGenerateDisabled =
    !filters.subject ||
    filters.lessons.length === 0 ||
    availableQuestions === 0;

  return (
    <div className="space-y-6">
      {/* Subject Selection - Modern Cards */}
      <div className="text-center">
        <h2 className="text-3xl font-bold mb-2">Choose Your Subject</h2>
        <p className="text-muted-foreground mb-8">
          Select a subject to start practicing
        </p>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 max-w-6xl mx-auto">
          {subjects.map((subject) => {
            const IconComponent = getIconComponent(subject.icon);
            return (
              <Card
                key={subject.id}
                className={`cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-lg group relative overflow-hidden ${
                  filters.subject === subject.id
                    ? "ring-2 ring-primary bg-primary/5 shadow-lg scale-105"
                    : "hover:shadow-md"
                }`}
                onClick={() =>
                  setFilters((prev) => ({
                    ...prev,
                    subject: subject.id,
                    topics: [],
                    lessons: [],
                  }))
                }
              >
                <CardContent className="p-6 text-center">
                  <div
                    className={`w-16 h-16 mx-auto mb-4 rounded-2xl flex items-center justify-center transition-colors ${
                      subject.id === "physics"
                        ? "bg-blue-500"
                        : subject.id === "chemistry"
                        ? "bg-green-500"
                        : subject.id === "biology"
                        ? "bg-emerald-500"
                        : subject.id === "combined"
                        ? "bg-purple-500"
                        : "bg-orange-500"
                    }`}
                  >
                    <IconComponent className="h-8 w-8 text-white" />
                  </div>
                  <div className="text-lg font-semibold">{subject.name}</div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Collapsible Advanced Filters */}
      {selectedSubject && (
        <Card className="bg-card/50 backdrop-blur">
          <Collapsible open={isFiltersOpen} onOpenChange={setIsFiltersOpen}>
            <CollapsibleTrigger asChild>
              <CardHeader className="cursor-pointer hover:bg-muted/50 transition-colors">
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Settings className="h-5 w-5" />
                    Quiz Settings & Filters
                    <Badge variant="outline" className="ml-2">
                      {availableQuestions} questions available
                    </Badge>
                  </div>
                  {isFiltersOpen ? (
                    <ChevronUp className="h-5 w-5" />
                  ) : (
                    <ChevronDown className="h-5 w-5" />
                  )}
                </CardTitle>
              </CardHeader>
            </CollapsibleTrigger>

            <CollapsibleContent>
              <CardContent className="space-y-6">
                {/* Topics and Lessons Selection */}
                <div>
                  <label className="text-sm font-medium mb-3 block">
                    Topics & Lessons
                  </label>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="all-topics"
                        checked={selectedSubject.topics.every((topic) =>
                          topic.lessons.every((lesson) =>
                            filters.lessons.includes(lesson.id)
                          )
                        )}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            const allLessons = selectedSubject.topics.flatMap(
                              (t) => t.lessons.map((l) => l.id)
                            );
                            setFilters((prev) => ({
                              ...prev,
                              lessons: allLessons,
                            }));
                          } else {
                            setFilters((prev) => ({ ...prev, lessons: [] }));
                          }
                        }}
                      />
                      <label
                        htmlFor="all-topics"
                        className="text-sm font-medium"
                      >
                        All Topics
                      </label>
                    </div>

                    {selectedSubject.topics.map((topic) => {
                      const topicLessons = topic.lessons.map((l) => l.id);
                      const isTopicSelected = topicLessons.every((l) =>
                        filters.lessons.includes(l)
                      );
                      const isTopicOpen = openTopics.includes(topic.id);

                      return (
                        <div
                          key={topic.id}
                          className="border rounded-lg p-3 bg-card/30"
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                              <Checkbox
                                checked={isTopicSelected}
                                onCheckedChange={() =>
                                  handleTopicToggle(topic.id)
                                }
                              />
                              <span className="font-medium">{topic.name}</span>
                            </div>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => toggleTopicOpen(topic.id)}
                            >
                              {isTopicOpen ? (
                                <ChevronUp className="h-4 w-4" />
                              ) : (
                                <ChevronDown className="h-4 w-4" />
                              )}
                            </Button>
                          </div>

                          <Collapsible open={isTopicOpen}>
                            <CollapsibleContent className="mt-3 ml-6 space-y-2">
                              {topic.lessons.map((lesson) => (
                                <div
                                  key={lesson.id}
                                  className="flex items-center space-x-2"
                                >
                                  <Checkbox
                                    checked={filters.lessons.includes(
                                      lesson.id
                                    )}
                                    onCheckedChange={() =>
                                      handleLessonToggle(lesson.id)
                                    }
                                  />
                                  <span className="text-sm">{lesson.name}</span>
                                </div>
                              ))}
                            </CollapsibleContent>
                          </Collapsible>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Difficulty Selection with Colors */}
                <div>
                  <label className="text-sm font-medium mb-3 block">
                    Difficulty
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {[
                      {
                        key: "easy",
                        label: "Easy",
                        color: "bg-green-500 hover:bg-green-600 text-white",
                      },
                      {
                        key: "medium",
                        label: "Medium",
                        color: "bg-yellow-500 hover:bg-yellow-600 text-white",
                      },
                      {
                        key: "hard",
                        label: "Hard",
                        color: "bg-red-500 hover:bg-red-600 text-white",
                      },
                      {
                        key: "mixed",
                        label: "Mixed",
                        color: "bg-primary text-white",
                      },
                    ].map((diff) => (
                      <Button
                        key={diff.key}
                        variant={
                          filters.difficulty === diff.key
                            ? "default"
                            : "outline"
                        }
                        size="sm"
                        onClick={() =>
                          setFilters((prev) => ({
                            ...prev,
                            difficulty: diff.key as any,
                          }))
                        }
                        className={
                          filters.difficulty === diff.key ? diff.color : ""
                        }
                      >
                        {diff.label}
                      </Button>
                    ))}
                  </div>
                </div>

                {/* Year Range with Limits */}
                <div>
                  <label className="text-sm font-medium mb-3 block">
                    Year Range
                  </label>
                  <div className="flex items-center gap-4">
                    <div>
                      <label className="text-xs text-muted-foreground">
                        From
                      </label>
                      <Input
                        type="number"
                        min={2019}
                        max={2025}
                        value={filters.yearRange[0]}
                        onChange={(e) => {
                          const value = Math.max(
                            2019,
                            Math.min(2025, parseInt(e.target.value) || 2019)
                          );
                          setFilters((prev) => ({
                            ...prev,
                            yearRange: [
                              value,
                              Math.max(value, prev.yearRange[1]),
                            ],
                          }));
                        }}
                        className="w-20"
                      />
                    </div>
                    <span>-</span>
                    <div>
                      <label className="text-xs text-muted-foreground">
                        To
                      </label>
                      <Input
                        type="number"
                        min={2019}
                        max={2025}
                        value={filters.yearRange[1]}
                        onChange={(e) => {
                          const value = Math.max(
                            2019,
                            Math.min(2025, parseInt(e.target.value) || 2025)
                          );
                          setFilters((prev) => ({
                            ...prev,
                            yearRange: [
                              Math.min(value, prev.yearRange[0]),
                              value,
                            ],
                          }));
                        }}
                        className="w-20"
                      />
                    </div>
                  </div>
                </div>

                {/* Sessions */}
                <div>
                  <label className="text-sm font-medium mb-3 block">
                    Sessions
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {availableSessions.map((session) => (
                      <Badge
                        key={session}
                        variant={
                          filters.sessions.includes(session as any)
                            ? "default"
                            : "outline"
                        }
                        className="cursor-pointer px-3 py-1"
                        onClick={() =>
                          setFilters((prev) => {
                            const sessionValue = session as
                              | "feb/march"
                              | "may/june"
                              | "oct/nov";
                            const newSessions = prev.sessions.includes(
                              sessionValue
                            )
                              ? prev.sessions.filter((s) => s !== sessionValue)
                              : [...prev.sessions, sessionValue];

                            const newVariants =
                              newSessions.length === 1 &&
                              newSessions[0] === "feb/march"
                                ? prev.variants.filter((v) => v === "v2")
                                : prev.variants;

                            return {
                              ...prev,
                              sessions: newSessions,
                              variants: newVariants,
                            };
                          })
                        }
                      >
                        {session}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Variants with Session-based Filtering */}
                <div>
                  <label className="text-sm font-medium mb-3 block">
                    Variants
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {getAvailableVariants().map((variant) => (
                      <Badge
                        key={variant}
                        variant={
                          filters.variants.includes(variant)
                            ? "default"
                            : "outline"
                        }
                        className="cursor-pointer px-3 py-1"
                        onClick={() =>
                          setFilters((prev) => ({
                            ...prev,
                            variants: prev.variants.includes(variant)
                              ? prev.variants.filter((v) => v !== variant)
                              : [...prev.variants, variant],
                          }))
                        }
                      >
                        {variant.toUpperCase()}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Papers */}
                {availablePapers.length > 0 && (
                  <div>
                    <label className="text-sm font-medium mb-3 block">
                      Papers
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {availablePapers.map((paper) => (
                        <Badge
                          key={paper}
                          variant={
                            filters.papers?.includes(paper as any)
                              ? "default"
                              : "outline"
                          }
                          className="cursor-pointer px-3 py-1"
                          onClick={() =>
                            setFilters((prev) => ({
                              ...prev,
                              papers: prev.papers?.includes(paper as any)
                                ? prev.papers.filter((p) => p !== paper)
                                : [...(prev.papers || []), paper as any],
                            }))
                          }
                        >
                          {paper.replace("paper", "Paper ").toUpperCase()}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {/* Level */}
                {selectedSubject?.isScience && (
                  <div>
                    <label className="text-sm font-medium mb-3 block">
                      Level
                    </label>
                    <Select
                      value={filters.level || ""}
                      onValueChange={(value) =>
                        setFilters((prev) => ({
                          ...prev,
                          level: value as "core" | "extended",
                        }))
                      }
                    >
                      <SelectTrigger className="w-48">
                        <SelectValue placeholder="Select level" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="core">Core</SelectItem>
                        <SelectItem value="extended">Extended</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                )}

                {/* Custom Number of Questions Input */}
                <div>
                  <label className="text-sm font-medium mb-3 block">
                    Number of Questions
                  </label>
                  <div className="flex items-center gap-2 w-fit">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={decrementQuestions}
                      disabled={filters.numberOfQuestions <= 1}
                      className="h-9 w-9 p-0"
                    >
                      <Minus className="h-4 w-4" />
                    </Button>
                    <Input
                      type="number"
                      min={1}
                      max={maxQuestions}
                      value={filters.numberOfQuestions}
                      onChange={(e) => handleNumberChange(e.target.value)}
                      className="w-20 text-center"
                    />
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={incrementQuestions}
                      disabled={filters.numberOfQuestions >= maxQuestions}
                      className="h-9 w-9 p-0"
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    Max: {maxQuestions} (based on current filters)
                  </p>
                </div>

                {/* Generate Button */}
                <div className="flex gap-2">
                  <Button
                    onClick={generateQuiz}
                    disabled={isGenerateDisabled}
                    className="flex-1 flex items-center gap-2"
                    size="lg"
                  >
                    <Play className="h-5 w-5" />
                    Generate Quiz ({availableQuestions} available)
                  </Button>

                  {lastGeneratedQuiz && (
                    <Dialog
                      open={showSaveDialog}
                      onOpenChange={setShowSaveDialog}
                    >
                      <DialogTrigger asChild>
                        <Button variant="outline" size="lg">
                          <Save className="h-5 w-5" />
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
                            value={selectedFolder}
                            onValueChange={setSelectedFolder}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select folder (optional)" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="">No folder</SelectItem>
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
                          <Button
                            onClick={saveQuiz}
                            className="w-full"
                            disabled={!quizName.trim()}
                          >
                            Save Quiz
                          </Button>
                        </div>
                      </DialogContent>
                    </Dialog>
                  )}
                </div>
              </CardContent>
            </CollapsibleContent>
          </Collapsible>
        </Card>
      )}
    </div>
  );
};

export default QuizGenerator;

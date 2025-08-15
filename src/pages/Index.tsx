import React, { useState } from "react";
import { ThemeProvider } from "@/contexts/ThemeContext";
import ThemeSelector from "@/components/ThemeSelector";
import QuizGenerator from "@/components/QuizGenerator";
import QuizViews from "@/components/QuizViews";
import Dashboard from "@/components/Dashboard";
import { Question, QuizFilters } from "@/data/quizData";
import {
  GraduationCap,
  Home,
  Settings,
  BarChart3,
  ArrowRight,
  TrendingUp,
  Heart,
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface SavedQuiz {
  id: string;
  name: string;
  questions: Question[];
  filters: QuizFilters;
  createdAt: string;
  folderId?: string;
  progress?: "happy" | "neutral" | "sad";
}

const Index = () => {
  const [generatedQuestions, setGeneratedQuestions] = useState<Question[]>([]);
  const [currentFilters, setCurrentFilters] = useState<QuizFilters | null>(
    null
  );
  const [showQuiz, setShowQuiz] = useState(false);
  const [activeTab, setActiveTab] = useState("home");

  const handleGenerateQuiz = (questions: Question[], filters: QuizFilters) => {
    setGeneratedQuestions(questions);
    setCurrentFilters(filters);
    setShowQuiz(true);
    setActiveTab("home");
  };

  const handleLoadQuiz = (quiz: SavedQuiz) => {
    setGeneratedQuestions(quiz.questions);
    setCurrentFilters(quiz.filters);
    setShowQuiz(true);
    setActiveTab("home");
  };

  const handleBackToGenerator = () => {
    setShowQuiz(false);
  };

  const handleNavigateToGenerator = () => {
    setActiveTab("home");
    setShowQuiz(false);
  };

  return (
    <ThemeProvider>
      <div className="min-h-screen bg-background text-foreground">
        {/* Modern Navbar */}
        <nav className="border-b border-border bg-card/50 backdrop-blur supports-[backdrop-filter]:bg-card/60">
          <div className="container mx-auto px-4 py-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 text-primary">
                  <GraduationCap className="h-8 w-8" />
                  <div className="flex flex-col">
                    <span className="text-xl font-bold">IGCSE Quizzer</span>
                    <span className="text-xs text-muted-foreground hidden sm:block">
                      Best Quiz Generator & Practice Platform
                    </span>
                  </div>
                </div>
              </div>
              <ThemeSelector />
            </div>
          </div>
        </nav>

        <div className="container mx-auto px-4 py-8 max-w-7xl">
          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="w-full"
          >
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="home" className="flex items-center gap-2">
                <Home className="h-4 w-4" />
                <span className="hidden sm:inline">Quiz Generator</span>
                <span className="sm:hidden">Generator</span>
              </TabsTrigger>
              <TabsTrigger
                value="dashboard"
                className="flex items-center gap-2"
              >
                <BarChart3 className="h-4 w-4" />
                Dashboard
              </TabsTrigger>
            </TabsList>

            <TabsContent
              value="home"
              className="flr ring-0 outline-none focus:ring-0 active:ring-0 mt-6"
            >
              {!showQuiz ? (
                <>
                  {/* Hero Section */}
                  <div className="text-center mb-12">
                    <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-br from-primary via-primary/80 to-primary/60 bg-clip-text text-transparent mb-4">
                      IGCSE Quizzer
                    </h1>
                    <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">
                      Generate personalized IGCSE quizzes from oldest to latest
                      Cambridge past papers. Track your progress, plan your
                      studies, & more endless features.
                    </p>
                  </div>

                  <div data-generator-section>
                    <QuizGenerator onGenerateQuiz={handleGenerateQuiz} />
                  </div>

                  {/* Dashboard Preview Card */}
                  <Card className="mt-12 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30 border-blue-200 dark:border-blue-800">
                    <CardContent className="p-8 text-center">
                      <div className="flex items-center justify-center mb-4">
                        <TrendingUp className="h-12 w-12 text-blue-600 dark:text-blue-400" />
                      </div>
                      <h3 className="text-2xl font-bold mb-2">
                        Track Your Progress
                      </h3>
                      <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
                        Monitor your learning journey with detailed analytics,
                        XP tracking, and organized folders. Save your favorite
                        questions and review your performance over time.
                      </p>
                      <Button
                        size="lg"
                        onClick={() => setActiveTab("dashboard")}
                        className="bg-blue-600 hover:bg-blue-700 text-white"
                      >
                        View Dashboard
                        <ArrowRight className="h-4 w-4 ml-2" />
                      </Button>

                      {/* Mini preview */}
                      <div className="mt-6 grid grid-cols-3 gap-4 max-w-md mx-auto opacity-60">
                        <div className="bg-white dark:bg-gray-800 rounded-lg p-3 text-center">
                          <div className="text-lg font-bold text-yellow-600">
                            850
                          </div>
                          <div className="text-xs text-muted-foreground">
                            XP
                          </div>
                        </div>
                        <div className="bg-white dark:bg-gray-800 rounded-lg p-3 text-center">
                          <div className="text-lg font-bold text-green-600">
                            12
                          </div>
                          <div className="text-xs text-muted-foreground">
                            Quizzes
                          </div>
                        </div>
                        <div className="bg-white dark:bg-gray-800 rounded-lg p-3 text-center">
                          <div className="text-lg font-bold text-blue-600">
                            Scholar
                          </div>
                          <div className="text-xs text-muted-foreground">
                            Rank
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </>
              ) : (
                <QuizViews
                  questions={generatedQuestions}
                  filters={currentFilters!}
                  onBack={handleBackToGenerator}
                />
              )}
            </TabsContent>

            <TabsContent
              value="dashboard"
              className="flr ring-0 outline-none focus:ring-0 active:ring-0 mt-6"
            >
              <Dashboard
                onLoadQuiz={handleLoadQuiz}
                onNavigateToGenerator={handleNavigateToGenerator}
              />
            </TabsContent>
            <Card
              className="bg-gradient-to-br from-primary/10 via-background to-primary/5 border-primary/20 animate-fade-in mt-4"
              // style={{ animationDelay: "0.8s" }}
            >
              <CardContent className="p-8 text-center">
                <div className="flex items-center justify-center gap-3 mb-4">
                  <Heart className="w-8 h-8 text-primary animate-pulse" />
                  <h3 className="text-2xl font-semibold text-foreground">
                    Support Me
                  </h3>
                </div>
                <p className="text-muted-foreground max-w-2xl mx-auto mb-6 leading-relaxed">
                  Hey! I'm an IGCSE student who built this website from scratch
                  to help others like you and me — completely free and without
                  any ads. I've put in A LOT of time and effort, and donations
                  really help me keep it running, add more features, and
                  continue offering it free to everyone in the future. Good luck
                  studying — and thank you so much for your support!! 🙏
                </p>
                <a
                  href="https://www.paypal.com/donate/?hosted_button_id=7MMM37XLLSTMY"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Button
                    size="lg"
                    className="px-8 py-3 font-semibold bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 transition-all duration-300 hover:scale-110 hover:shadow-lg"
                  >
                    Donate to Support me
                  </Button>
                </a>
              </CardContent>
            </Card>
          </Tabs>
        </div>
      </div>
    </ThemeProvider>
  );
};

export default Index;

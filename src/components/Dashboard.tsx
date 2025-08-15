import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Progress } from "@/components/ui/progress";
import {
  FolderPlus,
  Folder,
  Trophy,
  Clock,
  BookOpen,
  Star,
  Plus,
  MoreVertical,
  Edit,
  Trash2,
  Target,
  Book,
  Heart,
  Home,
  Settings,
  Users,
  FileText,
  Lightbulb,
  Palette,
  Music,
  Camera,
  Gamepad2,
  Code,
  Wrench,
  Zap,
  Smile,
  Frown,
} from "lucide-react";
import { Question, QuizFilters } from "@/data/quizData";

interface SavedQuiz {
  id: string;
  name: string;
  questions: Question[];
  filters: QuizFilters;
  createdAt: string;
  folderId?: string;
  progress?: "happy" | "neutral" | "sad";
}

interface QuizFolder {
  id: string;
  name: string;
  color: string;
  icon?: string;
  createdAt: string;
}

interface UserStats {
  totalQuizzes: number;
  questionsAnswered: number;
  xp: number;
  rank: string;
}

interface DashboardProps {
  onLoadQuiz: (quiz: SavedQuiz) => void;
  onNavigateToGenerator: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({
  onLoadQuiz,
  onNavigateToGenerator,
}) => {
  const [savedQuizzes, setSavedQuizzes] = useState<SavedQuiz[]>([]);
  const [folders, setFolders] = useState<QuizFolder[]>([]);
  const [userStats, setUserStats] = useState<UserStats>({
    totalQuizzes: 0,
    questionsAnswered: 0,
    xp: 0,
    rank: "Beginner",
  });
  const [selectedFolder, setSelectedFolder] = useState<string | null>(null);
  const [showNewFolderDialog, setShowNewFolderDialog] = useState(false);
  const [newFolderName, setNewFolderName] = useState("");
  const [newFolderColor, setNewFolderColor] = useState("#3B82F6");
  const [newFolderIcon, setNewFolderIcon] = useState("book");

  const folderColors = [
    "#3B82F6",
    "#EF4444",
    "#10B981",
    "#F59E0B",
    "#8B5CF6",
    "#F97316",
    "#06B6D4",
    "#84CC16",
  ];

  const folderIcons = [
    { name: "book", icon: Book, label: "Book" },
    { name: "Smile", icon: Smile, label: "smile" },
    { name: "Frown", icon: Frown, label: "frown" },

    { name: "heart", icon: Heart, label: "Heart" },
    { name: "home", icon: Home, label: "Home" },
    { name: "settings", icon: Settings, label: "Settings" },
    { name: "users", icon: Users, label: "Users" },
    { name: "fileText", icon: FileText, label: "Document" },
    { name: "lightbulb", icon: Lightbulb, label: "Idea" },
    { name: "palette", icon: Palette, label: "Art" },
    { name: "music", icon: Music, label: "Music" },
    { name: "camera", icon: Camera, label: "Camera" },
    { name: "gamepad2", icon: Gamepad2, label: "Games" },
    { name: "code", icon: Code, label: "Code" },
    { name: "wrench", icon: Wrench, label: "Tools" },
    { name: "zap", icon: Zap, label: "Energy" },
  ];

  const getIconComponent = (iconName: string = "book") => {
    const iconData = folderIcons.find((icon) => icon.name === iconName);
    return iconData ? iconData.icon : Book;
  };

  const rankThresholds = [
    { rank: "Beginner", minXP: 0, maxXP: 99 },
    { rank: "Student", minXP: 100, maxXP: 499 },
    { rank: "Scholar", minXP: 500, maxXP: 999 },
    { rank: "Expert", minXP: 1000, maxXP: 2499 },
    { rank: "Master", minXP: 2500, maxXP: 4999 },
    { rank: "Grandmaster", minXP: 5000, maxXP: Infinity },
  ];

  const getRankFromXP = (xp: number): string => {
    const rank = rankThresholds.find((r) => xp >= r.minXP && xp <= r.maxXP);
    return rank ? rank.rank : "Beginner";
  };

  const getXPToNextRank = (
    xp: number
  ): { xpToNext: number; nextRank: string; progress: number } => {
    const currentRank = rankThresholds.find(
      (r) => xp >= r.minXP && xp <= r.maxXP
    );
    if (!currentRank || currentRank.rank === "Grandmaster") {
      return { xpToNext: 0, nextRank: "Max Level", progress: 100 };
    }

    const nextRankIndex =
      rankThresholds.findIndex((r) => r.rank === currentRank.rank) + 1;
    const nextRank = rankThresholds[nextRankIndex];

    if (!nextRank) {
      return { xpToNext: 0, nextRank: "Max Level", progress: 100 };
    }

    const xpToNext = nextRank.minXP - xp;
    const progress =
      ((xp - currentRank.minXP) / (nextRank.minXP - currentRank.minXP)) * 100;

    return { xpToNext, nextRank: nextRank.rank, progress };
  };

  useEffect(() => {
    // Load data from localStorage
    const saved = localStorage.getItem("dashboard-data");
    if (saved) {
      const data = JSON.parse(saved);
      setSavedQuizzes(data.quizzes || []);
      setFolders(data.folders || []);

      // Recalculate accurate stats
      const quizzes = data.quizzes || [];
      const questionMoods = data.questionMoods || [];

      const accurateStats = {
        totalQuizzes: quizzes.length, // Attempted quizzes
        questionsAnswered: questionMoods.length, // Questions with mood selection
        xp: data.stats?.xp || 0,
        rank: getRankFromXP(data.stats?.xp || 0),
      };

      setUserStats(accurateStats);

      // Update localStorage with accurate stats
      const updatedData = { ...data, stats: accurateStats };
      localStorage.setItem("dashboard-data", JSON.stringify(updatedData));
    }
  }, []);

  const saveToStorage = (
    quizzes: SavedQuiz[],
    foldersData: QuizFolder[],
    stats: UserStats
  ) => {
    localStorage.setItem(
      "dashboard-data",
      JSON.stringify({
        quizzes,
        folders: foldersData,
        stats: { ...stats, rank: getRankFromXP(stats.xp) },
      })
    );
  };

  const createFolder = () => {
    if (!newFolderName.trim()) return;

    const newFolder: QuizFolder = {
      id: Date.now().toString(),
      name: newFolderName,
      color: newFolderColor,
      icon: newFolderIcon,
      createdAt: new Date().toISOString(),
    };

    const updatedFolders = [...folders, newFolder];
    setFolders(updatedFolders);
    saveToStorage(savedQuizzes, updatedFolders, userStats);
    setNewFolderName("");
    setNewFolderIcon("book");
    setShowNewFolderDialog(false);
  };

  const deleteFolder = (folderId: string) => {
    const updatedFolders = folders.filter((f) => f.id !== folderId);
    const updatedQuizzes = savedQuizzes.map((q) =>
      q.folderId === folderId ? { ...q, folderId: undefined } : q
    );

    setFolders(updatedFolders);
    setSavedQuizzes(updatedQuizzes);
    saveToStorage(updatedQuizzes, updatedFolders, userStats);
    setSelectedFolder(null);
  };

  const deleteQuiz = (quizId: string) => {
    const updatedQuizzes = savedQuizzes.filter((q) => q.id !== quizId);
    setSavedQuizzes(updatedQuizzes);

    // Update accurate stats
    const updatedStats = {
      ...userStats,
      totalQuizzes: updatedQuizzes.length,
    };
    setUserStats(updatedStats);
    saveToStorage(updatedQuizzes, folders, updatedStats);
  };

  const filteredQuizzes = selectedFolder
    ? savedQuizzes.filter((q) => q.folderId === selectedFolder)
    : savedQuizzes.filter((q) => !q.folderId);

  const xpInfo = getXPToNextRank(userStats.xp);

  return (
    <div className="space-y-6 px-2 sm:px-0">
      {/* Stats Overview */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <Trophy className="h-8 w-8 mx-auto mb-2 text-yellow-500" />
            <div className="text-2xl font-bold">{userStats.xp}</div>
            <div className="text-sm text-muted-foreground">XP Points</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 text-center">
            <Star className="h-8 w-8 mx-auto mb-2 text-purple-500" />
            <div className="text-2xl font-bold">{userStats.rank}</div>
            <div className="text-sm text-muted-foreground">
              {xpInfo.xpToNext > 0
                ? `${xpInfo.xpToNext} XP to ${xpInfo.nextRank}`
                : "Max Level"}
            </div>
            {xpInfo.xpToNext > 0 && (
              <Progress value={xpInfo.progress} className="mt-2 h-2" />
            )}
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 text-center">
            <BookOpen className="h-8 w-8 mx-auto mb-2 text-blue-500" />
            <div className="text-2xl font-bold">{userStats.totalQuizzes}</div>
            <div className="text-sm text-muted-foreground">
              Quizzes Attempted
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 text-center">
            <Target className="h-8 w-8 mx-auto mb-2 text-green-500" />
            <div className="text-2xl font-bold">
              {userStats.questionsAnswered}
            </div>
            <div className="text-sm text-muted-foreground">
              Questions Answered
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Folders */}
      <Card>
        <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-2 sm:space-y-0">
          <CardTitle className="flex items-center gap-2">
            <Folder className="h-5 w-5" />
            My Folders
          </CardTitle>
          <Dialog
            open={showNewFolderDialog}
            onOpenChange={setShowNewFolderDialog}
          >
            <DialogTrigger asChild>
              <Button size="sm">
                <Plus className="h-4 w-4 mr-2" />
                New Folder
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Create New Folder</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <Input
                  placeholder="Folder name"
                  value={newFolderName}
                  onChange={(e) => setNewFolderName(e.target.value)}
                />

                <div className="space-y-2">
                  <label className="text-sm font-medium">Choose Icon</label>
                  <div className="grid grid-cols-7 gap-2">
                    {folderIcons.map(({ name, icon: IconComponent }) => (
                      <button
                        key={name}
                        type="button"
                        className={`p-2 rounded border-2 flex items-center justify-center ${
                          newFolderIcon === name
                            ? "border-primary bg-primary/10"
                            : "border-gray-300 hover:border-gray-400"
                        }`}
                        onClick={() => setNewFolderIcon(name)}
                      >
                        <IconComponent className="h-4 w-4" />
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Choose Color</label>
                  <div className="flex flex-wrap gap-2">
                    {folderColors.map((color) => (
                      <div
                        key={color}
                        className={`w-8 h-8 rounded cursor-pointer border-2 ${
                          newFolderColor === color
                            ? "border-gray-900"
                            : "border-gray-300"
                        }`}
                        style={{ backgroundColor: color }}
                        onClick={() => setNewFolderColor(color)}
                      />
                    ))}
                  </div>
                </div>
                <Button onClick={createFolder} className="w-full">
                  Create Folder
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2 mb-4">
            <Button
              variant={selectedFolder === null ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedFolder(null)}
            >
              All Quizzes
            </Button>
            {folders.map((folder) => {
              const IconComponent = getIconComponent(folder.icon);
              return (
                <div key={folder.id} className="flex items-center">
                  <Button
                    variant={
                      selectedFolder === folder.id ? "default" : "outline"
                    }
                    size="sm"
                    onClick={() => setSelectedFolder(folder.id)}
                    className="flex items-center gap-2"
                  >
                    <IconComponent
                      className="w-3 h-3"
                      style={{ color: folder.color }}
                    />
                    {folder.name}
                  </Button>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="ml-1 h-6 w-6 p-0"
                      >
                        <MoreVertical className="h-3 w-3" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuItem onClick={() => deleteFolder(folder.id)}>
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Saved Quizzes */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            {selectedFolder
              ? `${folders.find((f) => f.id === selectedFolder)?.name} Quizzes`
              : "Recent Quizzes"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {filteredQuizzes.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No quizzes found. Generate your first quiz to get started!
            </div>
          ) : (
            <div className="grid gap-4">
              {filteredQuizzes.map((quiz) => (
                <Card
                  key={quiz.id}
                  className="hover:shadow-md transition-shadow"
                >
                  <CardContent className="p-4">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-2 sm:space-y-0">
                      <div className="flex-1">
                        <h4 className="font-medium">{quiz.name}</h4>
                        <div className="flex flex-wrap items-center gap-2 mt-1">
                          <Badge variant="outline">
                            {quiz.questions.length} questions
                          </Badge>
                          <Badge variant="outline">
                            {quiz.filters.subject}
                          </Badge>
                          {quiz.progress && (
                            <Badge
                              variant={
                                quiz.progress === "happy"
                                  ? "default"
                                  : quiz.progress === "neutral"
                                  ? "secondary"
                                  : "destructive"
                              }
                            >
                              {quiz.progress === "happy"
                                ? "😊"
                                : quiz.progress === "neutral"
                                ? "😐"
                                : "😞"}
                            </Badge>
                          )}
                        </div>
                        <div className="text-xs text-muted-foreground mt-1">
                          {new Date(quiz.createdAt).toLocaleDateString()}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button size="sm" onClick={() => onLoadQuiz(quiz)}>
                          Open
                        </Button>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent>
                            <DropdownMenuItem
                              onClick={() => deleteQuiz(quiz.id)}
                            >
                              <Trash2 className="h-4 w-4 mr-2" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Navigation to Generator */}
      <Card className="bg-gradient-to-r from-primary/10 to-primary/5 border-primary/20">
        <CardContent className="p-6 text-center">
          <h3 className="text-lg font-semibold mb-2">
            Ready for a New Challenge?
          </h3>
          <p className="text-muted-foreground mb-4">
            Generate customized quizzes tailored to your learning goals
          </p>
          <Button
            size="lg"
            onClick={onNavigateToGenerator}
            className="w-full sm:w-auto"
          >
            <Plus className="h-4 w-4 mr-2" />
            Generate New Quiz
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;

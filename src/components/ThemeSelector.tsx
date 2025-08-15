import React, { useState } from "react";
import { useTheme } from "@/contexts/ThemeContext";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Sun, Moon, Palette } from "lucide-react";

const ThemeSelector: React.FC = () => {
  const { theme, colorTheme, setTheme, setColorTheme, toggleTheme } =
    useTheme();
  const [isColorOpen, setIsColorOpen] = useState(false);
  const [isThemeOpen, setIsThemeOpen] = useState(false);

  const colorThemes = [
    { name: "purple", color: "bg-purple-500", label: "Purple" },
    { name: "blue", color: "bg-blue-500", label: "Blue" },
    { name: "green", color: "bg-green-500", label: "Green" },
    { name: "red", color: "bg-red-500", label: "Red" },
    { name: "orange", color: "bg-orange-500", label: "Orange" },
    { name: "pink", color: "bg-pink-500", label: "Pink" },
    { name: "yellow", color: "bg-yellow-500", label: "Yellow" },
  ];

  return (
    <div className="flex items-center gap-2">
      {/* Theme Toggle */}
      <Popover open={isThemeOpen} onOpenChange={setIsThemeOpen}>
        <PopoverTrigger asChild>
          <Button variant="ghost" size="sm" className="h-9 w-9 p-0">
            {theme === "light" ? (
              <Sun className="h-4 w-4" />
            ) : (
              <Moon className="h-4 w-4" />
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent align="end" className="w-40">
          <div className="space-y-2">
            <p className="text-sm font-medium">Appearance</p>
            <Button
              variant={theme === "light" ? "default" : "ghost"}
              size="sm"
              onClick={() => setTheme("light")}
              className="w-full justify-start"
            >
              <Sun className="h-4 w-4 mr-2" />
              Light
            </Button>
            <Button
              variant={theme === "dark" ? "default" : "ghost"}
              size="sm"
              onClick={() => setTheme("dark")}
              className="w-full justify-start"
            >
              <Moon className="h-4 w-4 mr-2" />
              Dark
            </Button>
          </div>
        </PopoverContent>
      </Popover>

      {/* Color Theme Selector */}
      <Popover open={isColorOpen} onOpenChange={setIsColorOpen}>
        <PopoverTrigger asChild>
          <Button variant="ghost" size="sm" className="h-9 w-9 p-0">
            <Palette className="h-4 w-4" />
          </Button>
        </PopoverTrigger>
        <PopoverContent align="end" className="w-48">
          <div className="space-y-2">
            <p className="text-sm font-medium">Color Theme</p>
            <div className="grid grid-cols-2 gap-2">
              {colorThemes.map((ct) => (
                <Button
                  key={ct.name}
                  variant={colorTheme === ct.name ? "default" : "outline"}
                  size="sm"
                  onClick={() => setColorTheme(ct.name as any)}
                  className="flex items-center gap-2 p-2"
                >
                  <div className={`w-3 h-3 rounded-full ${ct.color}`} />
                  <span className="text-xs">{ct.label}</span>
                </Button>
              ))}
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default ThemeSelector;

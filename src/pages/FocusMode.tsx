
import { useState, useEffect, useRef } from "react";
import MainLayout from "@/components/Layout/MainLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Play, Pause, SkipForward, Settings } from "lucide-react";
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/components/ui/use-toast";

type TimerType = "pomodoro" | "shortBreak" | "longBreak";
type TimerStatus = "idle" | "running" | "paused" | "completed";

interface TimerSettings {
  pomodoro: number;
  shortBreak: number;
  longBreak: number;
  autoStartBreaks: boolean;
  autoStartPomodoros: boolean;
}

const FocusMode = () => {
  const [timerType, setTimerType] = useState<TimerType>("pomodoro");
  const [timeLeft, setTimeLeft] = useState(25 * 60); // Default 25 minutes in seconds
  const [status, setStatus] = useState<TimerStatus>("idle");
  const [settings, setSettings] = useState<TimerSettings>({
    pomodoro: 25,
    shortBreak: 5,
    longBreak: 15,
    autoStartBreaks: true,
    autoStartPomodoros: true,
  });
  const [isRtl, setIsRtl] = useState(() => document.documentElement.dir === "rtl");
  const [completedPomodoros, setCompletedPomodoros] = useState(0);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const intervalRef = useRef<number | null>(null);
  const { toast } = useToast();

  // Update timer when type changes
  useEffect(() => {
    let newTime: number;
    switch (timerType) {
      case "pomodoro":
        newTime = settings.pomodoro * 60;
        break;
      case "shortBreak":
        newTime = settings.shortBreak * 60;
        break;
      case "longBreak":
        newTime = settings.longBreak * 60;
        break;
      default:
        newTime = settings.pomodoro * 60;
    }
    setTimeLeft(newTime);
    setStatus("idle");
    
    // Clear any existing interval
    if (intervalRef.current) {
      window.clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, [timerType, settings]);

  // Handle timer
  useEffect(() => {
    if (status === "running") {
      intervalRef.current = window.setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            // Timer completed
            clearInterval(intervalRef.current!);
            
            // Handle completion
            handleTimerComplete();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [status]);

  const handleTimerComplete = () => {
    setStatus("completed");
    
    // Show notification
    toast({
      title: isRtl 
        ? timerType === "pomodoro" ? "انتهت فترة التركيز!" : "انتهت فترة الراحة!" 
        : timerType === "pomodoro" ? "Focus session complete!" : "Break time complete!",
      description: isRtl
        ? timerType === "pomodoro" ? "حان وقت الراحة!" : "هل أنت مستعد للعودة للعمل؟"
        : timerType === "pomodoro" ? "Time for a break!" : "Ready to get back to work?",
    });

    // Play sound
    const audio = new Audio('/notification.mp3');
    audio.play().catch(e => console.error("Could not play sound:", e));
    
    // Update pomodoro count
    if (timerType === "pomodoro") {
      setCompletedPomodoros(prev => prev + 1);
      
      // Auto start break
      if (settings.autoStartBreaks) {
        const nextBreakType = completedPomodoros % 4 === 3 ? "longBreak" : "shortBreak";
        setTimeout(() => {
          setTimerType(nextBreakType);
          setStatus("running");
        }, 1500);
      }
    } else if ((timerType === "shortBreak" || timerType === "longBreak") && settings.autoStartPomodoros) {
      // Auto start next pomodoro
      setTimeout(() => {
        setTimerType("pomodoro");
        setStatus("running");
      }, 1500);
    }
  };

  const startTimer = () => {
    setStatus("running");
  };

  const pauseTimer = () => {
    setStatus("paused");
  };

  const skipTimer = () => {
    // Determine next timer type
    let nextType: TimerType;
    
    if (timerType === "pomodoro") {
      nextType = completedPomodoros % 4 === 3 ? "longBreak" : "shortBreak";
    } else {
      nextType = "pomodoro";
    }
    
    setTimerType(nextType);
    setStatus("idle");
  };

  const formatTime = (timeInSeconds: number): string => {
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = timeInSeconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  const calculateProgress = (): number => {
    let totalTime: number;
    switch (timerType) {
      case "pomodoro":
        totalTime = settings.pomodoro * 60;
        break;
      case "shortBreak":
        totalTime = settings.shortBreak * 60;
        break;
      case "longBreak":
        totalTime = settings.longBreak * 60;
        break;
      default:
        totalTime = settings.pomodoro * 60;
    }
    
    return 100 - (timeLeft / totalTime * 100);
  };

  const handleSettingsChange = (key: keyof TimerSettings, value: number | boolean) => {
    setSettings(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const applySettings = () => {
    setIsSettingsOpen(false);
    
    // Reset the current timer with new settings
    let newTime: number;
    switch (timerType) {
      case "pomodoro":
        newTime = settings.pomodoro * 60;
        break;
      case "shortBreak":
        newTime = settings.shortBreak * 60;
        break;
      case "longBreak":
        newTime = settings.longBreak * 60;
        break;
      default:
        newTime = settings.pomodoro * 60;
    }
    setTimeLeft(newTime);
    setStatus("idle");
  };

  return (
    <MainLayout>
      <div className="container mx-auto animate-fade-in max-w-3xl">
        <h1 className="text-3xl font-bold mb-6">
          {isRtl ? "وضع التركيز" : "Focus Mode"}
        </h1>
        
        <Card className="border border-border/50">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>
                {isRtl ? "مؤقت بومودورو" : "Pomodoro Timer"}
              </CardTitle>
              <Dialog open={isSettingsOpen} onOpenChange={setIsSettingsOpen}>
                <DialogTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <Settings className="h-5 w-5" />
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>
                      {isRtl ? "إعدادات المؤقت" : "Timer Settings"}
                    </DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <div className="space-y-2">
                      <Label>{isRtl ? "مدة فترة التركيز (دقائق)" : "Focus Duration (minutes)"}</Label>
                      <div className="flex items-center gap-4">
                        <Slider 
                          min={5} 
                          max={60} 
                          step={5} 
                          value={[settings.pomodoro]} 
                          onValueChange={([value]) => handleSettingsChange("pomodoro", value)}
                        />
                        <span className="w-12 text-center">{settings.pomodoro}</span>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label>{isRtl ? "مدة الاستراحة القصيرة (دقائق)" : "Short Break (minutes)"}</Label>
                      <div className="flex items-center gap-4">
                        <Slider 
                          min={1} 
                          max={15} 
                          step={1} 
                          value={[settings.shortBreak]} 
                          onValueChange={([value]) => handleSettingsChange("shortBreak", value)}
                        />
                        <span className="w-12 text-center">{settings.shortBreak}</span>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label>{isRtl ? "مدة الاستراحة الطويلة (دقائق)" : "Long Break (minutes)"}</Label>
                      <div className="flex items-center gap-4">
                        <Slider 
                          min={5} 
                          max={30} 
                          step={5} 
                          value={[settings.longBreak]} 
                          onValueChange={([value]) => handleSettingsChange("longBreak", value)}
                        />
                        <span className="w-12 text-center">{settings.longBreak}</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <Label>
                        {isRtl ? "بدء الاستراحات تلقائيًا" : "Auto-start breaks"}
                      </Label>
                      <Switch 
                        checked={settings.autoStartBreaks}
                        onCheckedChange={(checked) => handleSettingsChange("autoStartBreaks", checked)}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <Label>
                        {isRtl ? "بدء فترات التركيز تلقائيًا" : "Auto-start pomodoros"}
                      </Label>
                      <Switch 
                        checked={settings.autoStartPomodoros}
                        onCheckedChange={(checked) => handleSettingsChange("autoStartPomodoros", checked)}
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button onClick={applySettings}>
                      {isRtl ? "تطبيق" : "Apply"}
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <Tabs 
              value={timerType} 
              onValueChange={(value) => setTimerType(value as TimerType)}
              className="w-full"
            >
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="pomodoro">
                  {isRtl ? "تركيز" : "Focus"}
                </TabsTrigger>
                <TabsTrigger value="shortBreak">
                  {isRtl ? "استراحة قصيرة" : "Short Break"}
                </TabsTrigger>
                <TabsTrigger value="longBreak">
                  {isRtl ? "استراحة طويلة" : "Long Break"}
                </TabsTrigger>
              </TabsList>
            </Tabs>
            
            <div className="text-center py-10">
              <div className="text-7xl font-mono font-bold mb-6">
                {formatTime(timeLeft)}
              </div>
              <Progress value={calculateProgress()} className="h-2 mb-8" />
              <div className="flex justify-center gap-4">
                {status === "running" ? (
                  <Button onClick={pauseTimer} size="lg" className="w-40 gap-2">
                    <Pause className="h-5 w-5" />
                    <span>{isRtl ? "إيقاف مؤقت" : "Pause"}</span>
                  </Button>
                ) : (
                  <Button onClick={startTimer} size="lg" className="w-40 gap-2">
                    <Play className="h-5 w-5" />
                    <span>{status === "paused" ? (isRtl ? "استمرار" : "Resume") : (isRtl ? "ابدأ" : "Start")}</span>
                  </Button>
                )}
                <Button onClick={skipTimer} variant="outline" size="lg" className="w-40 gap-2">
                  <SkipForward className="h-5 w-5" />
                  <span>{isRtl ? "تخطي" : "Skip"}</span>
                </Button>
              </div>
            </div>
            
            <div className="border-t pt-4 mt-4">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm text-muted-foreground">
                    {isRtl ? "عدد فترات التركيز المكتملة" : "Completed Focus Sessions"}
                  </p>
                  <p className="text-2xl font-semibold">{completedPomodoros}</p>
                </div>
                <div className="flex">
                  {[...Array(4)].map((_, i) => (
                    <div 
                      key={i}
                      className={`w-4 h-4 rounded-full mx-1 ${i < completedPomodoros % 4 ? 'bg-primary' : 'bg-secondary'}`}
                    />
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="mt-6 border border-border/50">
          <CardHeader>
            <CardTitle>
              {isRtl ? "نصائح للتركيز" : "Focus Tips"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 list-disc pl-5">
              <li>
                {isRtl 
                  ? "حدد مهمة واضحة لكل فترة تركيز" 
                  : "Set a clear task for each focus session"}
              </li>
              <li>
                {isRtl 
                  ? "أبعد نفسك عن مصادر التشتيت مثل الهاتف والإشعارات" 
                  : "Remove distractions like phones and notifications"}
              </li>
              <li>
                {isRtl 
                  ? "استخدم الاستراحات القصيرة للتمدد والحركة" 
                  : "Use short breaks to stretch and move around"}
              </li>
              <li>
                {isRtl 
                  ? "بعد كل 4 فترات تركيز، خذ استراحة طويلة" 
                  : "After every 4 focus sessions, take a long break"}
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
};

export default FocusMode;

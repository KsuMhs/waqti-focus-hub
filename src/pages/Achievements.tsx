
import { useState, useEffect } from "react";
import MainLayout from "@/components/Layout/MainLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Trophy, Medal, Star, Award, Crown, Target, Flame } from "lucide-react";
import { toast } from "sonner";

// Define the base API URL depending on environment
const API_URL = window.location.hostname === 'localhost' 
  ? 'http://localhost:8080/api/index.php'
  : '/api/index.php'; // Adjust this path for your production server

type Achievement = {
  id: string;
  title: string;
  description: string;
  icon: keyof typeof icons;
  progress: number;
  maxProgress: number;
  unlocked: boolean;
  category: string;
  points: number;
};

const icons = {
  Trophy: Trophy,
  Medal: Medal,
  Star: Star,
  Award: Award,
  Crown: Crown,
  Target: Target,
  Flame: Flame,
};

const Achievements = () => {
  const [isRtl, setIsRtl] = useState(() => document.documentElement.dir === "rtl");
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAchievements = async () => {
      try {
        setLoading(true);
        console.log('Fetching achievements from:', `${API_URL}?route=achievements`);
        
        const response = await fetch(`${API_URL}?route=achievements`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          }
        });
        
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        
        const data = await response.json();
        console.log('Achievement data received:', data);
        
        if (data.status === 'success') {
          setAchievements(data.data);
        } else {
          throw new Error(data.message || 'Failed to fetch achievements');
        }
      } catch (err) {
        console.error('Error fetching achievements:', err);
        setError('Failed to load achievements. Using fallback data.');
        toast.error('Failed to connect to PHP backend. Using sample data instead.');
        // Use fallback data
        setAchievements([
          {
            id: "1",
            title: isRtl ? "بداية الرحلة" : "Journey Starter",
            description: isRtl ? "أكمل 5 مهام" : "Complete 5 tasks",
            icon: "Trophy",
            progress: 3,
            maxProgress: 5,
            unlocked: false,
            category: "tasks",
            points: 10
          },
          {
            id: "2",
            title: isRtl ? "متتبع العادات" : "Habit Builder",
            description: isRtl ? "تتبع 3 عادات لأسبوع كامل" : "Track 3 habits for a full week",
            icon: "Star",
            progress: 2,
            maxProgress: 3,
            unlocked: false,
            category: "habits",
            points: 20
          },
          {
            id: "3",
            title: isRtl ? "ملك التركيز" : "Focus Master",
            description: isRtl ? "أكمل 10 دورات بومودورو" : "Complete 10 pomodoro sessions",
            icon: "Crown",
            progress: 10,
            maxProgress: 10,
            unlocked: true,
            category: "focus",
            points: 30
          },
          {
            id: "4",
            title: isRtl ? "المنظم المتقدم" : "Advanced Planner",
            description: isRtl ? "استخدم المخطط لمدة 7 أيام متتالية" : "Use planner for 7 consecutive days",
            icon: "Award",
            progress: 5,
            maxProgress: 7,
            unlocked: false,
            category: "consistency",
            points: 25
          },
          {
            id: "5",
            title: isRtl ? "المتسلسل" : "Streak Keeper",
            description: isRtl ? "حافظ على تسلسل لمدة 5 أيام في عادة" : "Maintain a 5-day streak in a habit",
            icon: "Flame",
            progress: 5,
            maxProgress: 5,
            unlocked: true,
            category: "habits",
            points: 15
          },
          {
            id: "6",
            title: isRtl ? "محطم الأهداف" : "Goal Crusher",
            description: isRtl ? "حقق 3 أهداف شهرية" : "Achieve 3 monthly goals",
            icon: "Target",
            progress: 1,
            maxProgress: 3,
            unlocked: false,
            category: "goals",
            points: 40
          },
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchAchievements();
  }, [isRtl]);

  const totalPoints = achievements.filter(a => a.unlocked).reduce((sum, a) => sum + a.points, 0);
  const totalAchievements = achievements.length;
  const unlockedAchievements = achievements.filter(a => a.unlocked).length;

  if (loading) {
    return (
      <MainLayout>
        <div className="container mx-auto animate-fade-in">
          <h1 className="text-3xl font-bold mb-6">
            {isRtl ? "الإنجازات" : "Achievements"}
          </h1>
          <div className="flex justify-center items-center h-64">
            <div className="animate-pulse text-primary">
              {isRtl ? "جاري التحميل..." : "Loading..."}
            </div>
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="container mx-auto animate-fade-in">
        <h1 className="text-3xl font-bold mb-6">
          {isRtl ? "الإنجازات" : "Achievements"}
          {error && <span className="text-sm text-destructive ml-2">({error})</span>}
        </h1>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="border border-border/50">
            <CardContent className="pt-6 text-center">
              <div className="text-4xl font-bold text-waqti-purple mb-2">{achievements.filter(a => a.unlocked).reduce((sum, a) => sum + a.points, 0)}</div>
              <p className="text-muted-foreground">{isRtl ? "إجمالي النقاط" : "Total Points"}</p>
            </CardContent>
          </Card>
          
          <Card className="border border-border/50">
            <CardContent className="pt-6 text-center">
              <div className="text-4xl font-bold text-waqti-green mb-2">
                {achievements.filter(a => a.unlocked).length}/{achievements.length}
              </div>
              <p className="text-muted-foreground">{isRtl ? "الإنجازات المفتوحة" : "Achievements Unlocked"}</p>
            </CardContent>
          </Card>
          
          <Card className="border border-border/50">
            <CardContent className="pt-6 text-center">
              <div className="text-4xl font-bold text-waqti-blue mb-2">
                {achievements.length > 0 ? Math.round((achievements.filter(a => a.unlocked).length / achievements.length) * 100) : 0}%
              </div>
              <p className="text-muted-foreground">{isRtl ? "التقدم الكلي" : "Overall Progress"}</p>
            </CardContent>
          </Card>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {achievements.map((achievement) => {
            const Icon = icons[achievement.icon];
            const progress = Math.round((achievement.progress / achievement.maxProgress) * 100);
            
            return (
              <Card 
                key={achievement.id}
                className={`transition-all duration-300 ${
                  achievement.unlocked 
                    ? "border-waqti-purple shadow-lg" 
                    : "border-border/50"
                }`}
              >
                <CardHeader className="flex flex-row items-center gap-4 pb-2">
                  <div className={`p-2 rounded-lg ${
                    achievement.unlocked 
                      ? "bg-waqti-purple text-white" 
                      : "bg-muted text-muted-foreground"
                    }`}
                  >
                    <Icon className="h-6 w-6" />
                  </div>
                  <div className="flex-1">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                      <CardTitle className="text-lg">{achievement.title}</CardTitle>
                      <Badge variant={achievement.unlocked ? "default" : "outline"}>
                        {achievement.points} {isRtl ? "نقطة" : "pts"}
                      </Badge>
                    </div>
                    <CardDescription>{achievement.description}</CardDescription>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex justify-between items-center text-sm mb-1">
                    <span className="text-muted-foreground">
                      {achievement.progress} / {achievement.maxProgress}
                    </span>
                    <span className={achievement.unlocked ? "text-waqti-purple" : "text-muted-foreground"}>
                      {progress}%
                    </span>
                  </div>
                  <Progress 
                    value={progress}
                    className={`h-2 ${achievement.unlocked ? "bg-primary/20" : "bg-muted"}`} 
                  />
                  
                  {achievement.unlocked && (
                    <div className="mt-3 text-center">
                      <Badge 
                        className="bg-waqti-green/20 text-waqti-green hover:bg-waqti-green/20 border-waqti-green badge-glow"
                      >
                        {isRtl ? "تم فتح الإنجاز" : "Achievement Unlocked"}
                      </Badge>
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </MainLayout>
  );
};

export default Achievements;

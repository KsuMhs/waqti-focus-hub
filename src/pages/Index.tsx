
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import MainLayout from "@/components/Layout/MainLayout";
import { useIsMobile } from "@/hooks/use-mobile";
import { useNavigate } from "react-router-dom";
import { CheckSquare, Clock, Medal, Calendar } from "lucide-react";
import { useState, useEffect } from "react";

const Index = () => {
  const isMobile = useIsMobile();
  const navigate = useNavigate();
  const [isRtl, setIsRtl] = useState(true);
  const [greeting, setGreeting] = useState("");

  useEffect(() => {
    // Check if RTL is set in the document
    setIsRtl(document.documentElement.dir === "rtl");
    
    // Set greeting based on time of day
    const hour = new Date().getHours();
    if (hour < 12) {
      setGreeting(isRtl ? "صباح الخير" : "Good Morning");
    } else if (hour < 18) {
      setGreeting(isRtl ? "مساء الخير" : "Good Afternoon");
    } else {
      setGreeting(isRtl ? "مساء الخير" : "Good Evening");
    }
  }, [isRtl]);

  const features = [
    {
      title: isRtl ? "المخطط اليومي" : "Daily Planner",
      description: isRtl 
        ? "نظم مهامك اليومية واسحب وأفلت لتنظيم أولوياتك" 
        : "Organize your daily tasks with drag-and-drop simplicity",
      icon: CheckSquare,
      color: "bg-waqti-purple",
      path: "/planner"
    },
    {
      title: isRtl ? "تتبع العادات" : "Habit Tracker",
      description: isRtl 
        ? "تتبع عاداتك اليومية وراقب تقدمك مع الوقت" 
        : "Track your daily habits and monitor your progress over time",
      icon: Calendar,
      color: "bg-waqti-blue",
      path: "/habits"
    },
    {
      title: isRtl ? "وضع التركيز" : "Focus Mode",
      description: isRtl 
        ? "استخدم مؤقت بومودورو للتركيز المثالي أثناء العمل" 
        : "Use the Pomodoro timer for optimal focus while working",
      icon: Clock,
      color: "bg-waqti-pink",
      path: "/focus"
    },
    {
      title: isRtl ? "الإنجازات" : "Achievements",
      description: isRtl 
        ? "اكسب النقاط والشارات بينما تحقق أهدافك" 
        : "Earn points and badges as you achieve your goals",
      icon: Medal,
      color: "bg-waqti-green",
      path: "/achievements"
    }
  ];

  return (
    <MainLayout>
      <div className="container mx-auto animate-fade-in">
        <div className="flex flex-col items-center text-center mb-10 mt-4">
          <div className="relative">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-waqti-purple to-waqti-blue bg-clip-text text-transparent">
              {isRtl ? "وقتي" : "Waqti"}
            </h1>
            <span className="absolute -top-2 -right-2 h-2 w-2 rounded-full bg-waqti-green animate-pulse-light"></span>
          </div>
          <p className="text-xl text-muted-foreground mb-6">
            {isRtl ? "منصة ذكية لتنظيم الوقت والعادات" : "Smart platform for time organization and habits"}
          </p>
          <h2 className="text-2xl font-medium mb-2">
            {greeting}
          </h2>
          <p className="text-muted-foreground mb-6">
            {isRtl ? "ماذا تخطط لتنجزه اليوم؟" : "What are you planning to accomplish today?"}
          </p>
          <div className="flex flex-wrap gap-2 justify-center">
            <Button
              variant="default"
              className="gap-2"
              onClick={() => navigate("/planner")}
            >
              <CheckSquare className="h-4 w-4" />
              <span>{isRtl ? "ابدأ المخطط اليومي" : "Start Planning"}</span>
            </Button>
            <Button 
              variant="outline"
              className="gap-2"
              onClick={() => navigate("/focus")}
            >
              <Clock className="h-4 w-4" />
              <span>{isRtl ? "وضع التركيز" : "Focus Mode"}</span>
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
          {features.map((feature, index) => (
            <Card 
              key={index} 
              className="card-hover overflow-hidden border border-border/50"
              onClick={() => navigate(feature.path)}
            >
              <CardContent className="p-6 flex gap-4 cursor-pointer">
                <div className={`${feature.color} rounded-lg p-3 h-14 w-14 flex items-center justify-center text-white flex-shrink-0`}>
                  <feature.icon className="h-6 w-6" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-16 text-center">
          <h2 className="text-2xl font-semibold mb-4">
            {isRtl ? "حان الوقت لتنظيم حياتك!" : "Time to organize your life!"}
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            {isRtl 
              ? "استخدم وقتي لتنظيم مهامك، وتتبع عاداتك، والحفاظ على تركيزك. ابدأ رحلتك نحو إنتاجية أفضل اليوم!" 
              : "Use Waqti to organize your tasks, track your habits, and maintain your focus. Start your journey towards better productivity today!"}
          </p>
        </div>
      </div>
    </MainLayout>
  );
};

export default Index;

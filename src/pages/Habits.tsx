
import { useState, useEffect } from "react";
import MainLayout from "@/components/Layout/MainLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/use-toast";
import { Plus, X, Check, BarChart3, Trash2 } from "lucide-react";
import { Progress } from "@/components/ui/progress";

type Habit = {
  id: string;
  name: string;
  category: string;
  frequency: string;
  streak: number;
  completedDates: string[];
  createdAt: string;
};

type HabitCategory = "health" | "productivity" | "mindfulness" | "learning" | "other";

const categoryColors: Record<string, string> = {
  health: "bg-waqti-green text-white",
  productivity: "bg-waqti-blue text-white",
  mindfulness: "bg-waqti-purple text-white",
  learning: "bg-waqti-pink text-white",
  other: "bg-waqti-orange text-white"
};

const getDaysInWeek = (date: Date) => {
  const day = date.getDay(); // 0 is Sunday, 1 is Monday, etc.
  const startDate = new Date(date);
  startDate.setDate(date.getDate() - day); // Start with Sunday
  
  const days = [];
  for (let i = 0; i < 7; i++) {
    const currentDate = new Date(startDate);
    currentDate.setDate(startDate.getDate() + i);
    days.push(currentDate.toISOString().split('T')[0]);
  }
  
  return days;
};

const Habits = () => {
  const [habits, setHabits] = useState<Habit[]>([]);
  const [newHabit, setNewHabit] = useState({
    name: "",
    category: "productivity",
    frequency: "daily"
  });
  const [isRtl, setIsRtl] = useState(() => document.documentElement.dir === "rtl");
  const [view, setView] = useState<"week" | "month">("week");
  const [currentWeekDates, setCurrentWeekDates] = useState<string[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    // Initialize current week dates
    setCurrentWeekDates(getDaysInWeek(new Date()));
  }, []);

  const addHabit = () => {
    if (!newHabit.name) {
      toast({
        title: isRtl ? "خطأ" : "Error",
        description: isRtl ? "يرجى إدخال اسم العادة" : "Please enter a habit name",
        variant: "destructive",
      });
      return;
    }

    const habit: Habit = {
      id: Date.now().toString(),
      name: newHabit.name,
      category: newHabit.category,
      frequency: newHabit.frequency,
      streak: 0,
      completedDates: [],
      createdAt: new Date().toISOString().split('T')[0],
    };

    setHabits([...habits, habit]);
    setNewHabit({
      name: "",
      category: "productivity",
      frequency: "daily"
    });

    toast({
      title: isRtl ? "تمت الإضافة" : "Habit added",
      description: isRtl ? "تمت إضافة العادة بنجاح" : "Habit has been added successfully",
    });
  };

  const deleteHabit = (id: string) => {
    setHabits(habits.filter(habit => habit.id !== id));
    toast({
      title: isRtl ? "تم الحذف" : "Habit removed",
      description: isRtl ? "تم حذف العادة بنجاح" : "Habit has been removed successfully",
    });
  };

  const toggleHabit = (habitId: string, date: string) => {
    setHabits(habits.map(habit => {
      if (habit.id === habitId) {
        let updatedCompletedDates = [...habit.completedDates];
        
        if (updatedCompletedDates.includes(date)) {
          // Remove the date if already completed
          updatedCompletedDates = updatedCompletedDates.filter(d => d !== date);
        } else {
          // Add the date if not completed
          updatedCompletedDates.push(date);
        }
        
        // Sort dates
        updatedCompletedDates.sort();
        
        // Calculate streak
        let streak = 0;
        const today = new Date().toISOString().split('T')[0];
        let checkDate = new Date(today);
        
        while (true) {
          const dateString = checkDate.toISOString().split('T')[0];
          
          if (updatedCompletedDates.includes(dateString)) {
            streak++;
            checkDate.setDate(checkDate.getDate() - 1);
          } else {
            break;
          }
        }
        
        return {
          ...habit,
          completedDates: updatedCompletedDates,
          streak
        };
      }
      return habit;
    }));
  };

  const calculateWeeklyProgress = (habit: Habit) => {
    const completedCount = currentWeekDates.filter(date => 
      habit.completedDates.includes(date)
    ).length;
    
    return (completedCount / 7) * 100;
  };

  const getFormattedDate = (date: string) => {
    const d = new Date(date);
    return d.getDate();
  };

  const getDayName = (date: string) => {
    const d = new Date(date);
    const days = isRtl 
      ? ['أحد', 'إثنين', 'ثلاثاء', 'أربعاء', 'خميس', 'جمعة', 'سبت']
      : ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    return days[d.getDay()];
  };

  const isToday = (date: string) => {
    const today = new Date().toISOString().split('T')[0];
    return date === today;
  };

  return (
    <MainLayout>
      <div className="container mx-auto animate-fade-in">
        <h1 className="text-3xl font-bold mb-6">
          {isRtl ? "تتبع العادات" : "Habit Tracker"}
        </h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Add new habit form */}
          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle>
                {isRtl ? "إضافة عادة جديدة" : "Add New Habit"}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">
                  {isRtl ? "اسم العادة" : "Habit Name"}
                </label>
                <Input 
                  placeholder={isRtl ? "أدخل اسم العادة" : "Enter habit name"}
                  value={newHabit.name}
                  onChange={(e) => setNewHabit({...newHabit, name: e.target.value})}
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">
                  {isRtl ? "الفئة" : "Category"}
                </label>
                <Select
                  value={newHabit.category}
                  onValueChange={(value) => setNewHabit({...newHabit, category: value})}
                >
                  <SelectTrigger>
                    <SelectValue placeholder={isRtl ? "اختر الفئة" : "Select category"} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="health">{isRtl ? "الصحة" : "Health"}</SelectItem>
                    <SelectItem value="productivity">{isRtl ? "الإنتاجية" : "Productivity"}</SelectItem>
                    <SelectItem value="mindfulness">{isRtl ? "الوعي الذاتي" : "Mindfulness"}</SelectItem>
                    <SelectItem value="learning">{isRtl ? "التعلم" : "Learning"}</SelectItem>
                    <SelectItem value="other">{isRtl ? "أخرى" : "Other"}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">
                  {isRtl ? "التكرار" : "Frequency"}
                </label>
                <Select
                  value={newHabit.frequency}
                  onValueChange={(value) => setNewHabit({...newHabit, frequency: value})}
                >
                  <SelectTrigger>
                    <SelectValue placeholder={isRtl ? "اختر التكرار" : "Select frequency"} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="daily">{isRtl ? "يومي" : "Daily"}</SelectItem>
                    <SelectItem value="weekdays">{isRtl ? "أيام الأسبوع" : "Weekdays"}</SelectItem>
                    <SelectItem value="weekends">{isRtl ? "عطلة نهاية الأسبوع" : "Weekends"}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <Button 
                className="w-full gap-2" 
                onClick={addHabit}
              >
                <Plus className="h-4 w-4" />
                {isRtl ? "إضافة عادة" : "Add Habit"}
              </Button>
            </CardContent>
          </Card>

          {/* Habits tracker */}
          <div className="lg:col-span-2 space-y-6">
            <Tabs defaultValue="tracker" className="w-full">
              <div className="flex items-center justify-between mb-4">
                <TabsList>
                  <TabsTrigger value="tracker">
                    {isRtl ? "المتابعة" : "Tracker"}
                  </TabsTrigger>
                  <TabsTrigger value="stats">
                    {isRtl ? "الإحصائيات" : "Statistics"}
                  </TabsTrigger>
                </TabsList>
                
                <Select
                  value={view}
                  onValueChange={(value) => setView(value as "week" | "month")}
                >
                  <SelectTrigger className="w-[150px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="week">{isRtl ? "أسبوعي" : "Weekly"}</SelectItem>
                    <SelectItem value="month">{isRtl ? "شهري" : "Monthly"}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <Card>
                <CardContent className="p-4 overflow-x-auto">
                  {habits.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                      <p>
                        {isRtl 
                          ? "لا توجد عادات لتتبعها بعد. أضف بعض العادات للبدء!" 
                          : "No habits to track yet. Add some habits to get started!"}
                      </p>
                    </div>
                  ) : (
                    <div className="min-w-[600px]">
                      <div className="grid grid-cols-[200px_repeat(7,_50px)] gap-2 mb-4">
                        <div className="font-semibold">
                          {isRtl ? "العادات" : "Habits"}
                        </div>
                        {currentWeekDates.map((date) => (
                          <div 
                            key={date} 
                            className={`text-center text-xs ${isToday(date) ? 'font-bold text-primary' : ''}`}
                          >
                            <div>{getDayName(date)}</div>
                            <div>{getFormattedDate(date)}</div>
                          </div>
                        ))}
                      </div>
                      
                      <div className="space-y-3">
                        {habits.map((habit) => (
                          <div 
                            key={habit.id} 
                            className="grid grid-cols-[200px_repeat(7,_50px)] gap-2 items-center py-2 border-b border-border/50 task-entry"
                          >
                            <div className="flex items-center gap-2">
                              <Badge className={categoryColors[habit.category]}>
                                {isRtl ? {
                                  "health": "الصحة",
                                  "productivity": "الإنتاجية",
                                  "mindfulness": "الوعي",
                                  "learning": "التعلم",
                                  "other": "أخرى"
                                }[habit.category] : habit.category}
                              </Badge>
                              <div className="flex-1 font-medium truncate">{habit.name}</div>
                              <button 
                                className="text-destructive hover:text-destructive/80 transition-colors"
                                onClick={() => deleteHabit(habit.id)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </div>
                            
                            {currentWeekDates.map((date) => {
                              const isCompleted = habit.completedDates.includes(date);
                              const isPastDate = new Date(date) < new Date(new Date().setHours(0, 0, 0, 0));
                              
                              return (
                                <button
                                  key={date}
                                  onClick={() => toggleHabit(habit.id, date)}
                                  className={`w-10 h-10 rounded-full flex items-center justify-center transition-all
                                    ${isCompleted 
                                      ? 'bg-primary text-primary-foreground'
                                      : isPastDate
                                        ? 'bg-muted border border-muted-foreground/30'
                                        : 'bg-background border border-primary/30 hover:border-primary/60'
                                    }
                                  `}
                                >
                                  {isCompleted && <Check className="h-5 w-5" />}
                                </button>
                              );
                            })}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
              
              <TabsContent value="stats" className="mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle>
                      {isRtl ? "إحصائيات العادات الأسبوعية" : "Weekly Habit Statistics"}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {habits.length === 0 ? (
                      <div className="text-center py-8 text-muted-foreground">
                        <p>
                          {isRtl 
                            ? "لا توجد بيانات لعرضها بعد. أضف بعض العادات للبدء!" 
                            : "No data to display yet. Add some habits to get started!"}
                        </p>
                      </div>
                    ) : (
                      <div className="space-y-6">
                        {habits.map((habit) => {
                          const progress = calculateWeeklyProgress(habit);
                          
                          return (
                            <div key={habit.id} className="space-y-2">
                              <div className="flex items-center justify-between">
                                <div className="font-medium">{habit.name}</div>
                                <div className="flex items-center gap-2">
                                  <Badge variant="outline" className="gap-1 flex items-center">
                                    <BarChart3 className="h-3 w-3" />
                                    <span>{Math.round(progress)}%</span>
                                  </Badge>
                                  {habit.streak > 0 && (
                                    <Badge className="bg-waqti-orange text-white">
                                      {habit.streak} {isRtl ? "يوم متتالي" : "day streak"}
                                    </Badge>
                                  )}
                                </div>
                              </div>
                              <Progress value={progress} className="h-2" />
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default Habits;

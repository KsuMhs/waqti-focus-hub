
import { useState } from "react";
import MainLayout from "@/components/Layout/MainLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Plus, Trash2, Calendar, Clock, CheckCircle2, Circle } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { Textarea } from "@/components/ui/textarea";

type TaskCategory = "work" | "study" | "personal" | "health" | "other";

type Task = {
  id: string;
  title: string;
  description: string;
  category: TaskCategory;
  completed: boolean;
  date: string;
  time?: string;
};

const categoryColors: Record<TaskCategory, string> = {
  work: "bg-waqti-blue text-white",
  study: "bg-waqti-purple text-white",
  personal: "bg-waqti-pink text-white",
  health: "bg-waqti-green text-white",
  other: "bg-waqti-orange text-white"
};

const Planner = () => {
  const [view, setView] = useState<"day" | "week">("day");
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTask, setNewTask] = useState<Partial<Task>>({
    title: "",
    description: "",
    category: "personal",
    completed: false,
    date: new Date().toISOString().split("T")[0],
  });
  const { toast } = useToast();
  const [isRtl, setIsRtl] = useState(() => document.documentElement.dir === "rtl");

  const addTask = () => {
    if (!newTask.title) {
      toast({
        title: isRtl ? "خطأ" : "Error",
        description: isRtl ? "يرجى إدخال عنوان المهمة" : "Please enter a task title",
        variant: "destructive",
      });
      return;
    }

    const task: Task = {
      id: Date.now().toString(),
      title: newTask.title!,
      description: newTask.description || "",
      category: newTask.category as TaskCategory,
      completed: false,
      date: newTask.date!,
      time: newTask.time
    };

    setTasks([...tasks, task]);
    setNewTask({
      title: "",
      description: "",
      category: "personal",
      completed: false,
      date: new Date().toISOString().split("T")[0],
    });

    toast({
      title: isRtl ? "تمت الإضافة" : "Task added",
      description: isRtl ? "تمت إضافة المهمة بنجاح" : "Task has been added successfully",
    });
  };

  const deleteTask = (id: string) => {
    setTasks(tasks.filter(task => task.id !== id));
    toast({
      title: isRtl ? "تم الحذف" : "Task removed",
      description: isRtl ? "تم حذف المهمة بنجاح" : "Task has been removed successfully",
    });
  };

  const toggleComplete = (id: string) => {
    setTasks(
      tasks.map(task =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    );
  };

  const todayTasks = tasks.filter(task => {
    const today = new Date().toISOString().split("T")[0];
    return task.date === today;
  });
  
  const upcomingTasks = tasks.filter(task => {
    const today = new Date().toISOString().split("T")[0];
    return task.date > today;
  });

  return (
    <MainLayout>
      <div className="container mx-auto animate-fade-in">
        <h1 className="text-3xl font-bold mb-6">
          {isRtl ? "المخطط" : "Planner"}
        </h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Task creation section */}
          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle>
                {isRtl ? "إضافة مهمة جديدة" : "Add New Task"}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">
                  {isRtl ? "العنوان" : "Title"}
                </label>
                <Input 
                  placeholder={isRtl ? "أدخل عنوان المهمة" : "Enter task title"}
                  value={newTask.title}
                  onChange={(e) => setNewTask({...newTask, title: e.target.value})}
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">
                  {isRtl ? "الوصف" : "Description"}
                </label>
                <Textarea 
                  placeholder={isRtl ? "أدخل وصفًا للمهمة (اختياري)" : "Enter task description (optional)"}
                  value={newTask.description}
                  onChange={(e) => setNewTask({...newTask, description: e.target.value})}
                  className="min-h-[100px]"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">
                    {isRtl ? "التاريخ" : "Date"}
                  </label>
                  <Input 
                    type="date"
                    value={newTask.date}
                    onChange={(e) => setNewTask({...newTask, date: e.target.value})}
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">
                    {isRtl ? "الوقت" : "Time"}
                  </label>
                  <Input 
                    type="time"
                    value={newTask.time}
                    onChange={(e) => setNewTask({...newTask, time: e.target.value})}
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">
                  {isRtl ? "الفئة" : "Category"}
                </label>
                <Select
                  value={newTask.category}
                  onValueChange={(value) => setNewTask({...newTask, category: value as TaskCategory})}
                >
                  <SelectTrigger>
                    <SelectValue placeholder={isRtl ? "اختر الفئة" : "Select category"} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="work">{isRtl ? "العمل" : "Work"}</SelectItem>
                    <SelectItem value="study">{isRtl ? "الدراسة" : "Study"}</SelectItem>
                    <SelectItem value="personal">{isRtl ? "شخصي" : "Personal"}</SelectItem>
                    <SelectItem value="health">{isRtl ? "الصحة" : "Health"}</SelectItem>
                    <SelectItem value="other">{isRtl ? "أخرى" : "Other"}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <Button 
                className="w-full gap-2" 
                onClick={addTask}
              >
                <Plus className="h-4 w-4" /> 
                {isRtl ? "إضافة مهمة" : "Add Task"}
              </Button>
            </CardContent>
          </Card>

          {/* Tasks list section */}
          <div className="lg:col-span-2 space-y-6">
            <Tabs defaultValue="today" className="w-full">
              <div className="flex items-center justify-between mb-4">
                <TabsList>
                  <TabsTrigger value="today">
                    {isRtl ? "اليوم" : "Today"}
                  </TabsTrigger>
                  <TabsTrigger value="upcoming">
                    {isRtl ? "القادم" : "Upcoming"}
                  </TabsTrigger>
                </TabsList>
                
                <Select
                  value={view}
                  onValueChange={(value) => setView(value as "day" | "week")}
                >
                  <SelectTrigger className="w-[150px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="day">{isRtl ? "عرض يومي" : "Day View"}</SelectItem>
                    <SelectItem value="week">{isRtl ? "عرض أسبوعي" : "Week View"}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle>
                    {isRtl ? "المهام" : "Tasks"}
                    <Badge variant="outline" className="ms-2">
                      {todayTasks.length}
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {todayTasks.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                      <p>
                        {isRtl 
                          ? "لا توجد مهام لليوم. أضف بعض المهام لتبدأ!" 
                          : "No tasks for today. Add some tasks to get started!"}
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {todayTasks.map((task) => (
                        <div 
                          key={task.id}
                          className={`p-3 border rounded-lg flex items-start gap-3 task-entry ${
                            task.completed ? "bg-secondary/50 line-through text-muted-foreground" : ""
                          }`}
                        >
                          <button 
                            onClick={() => toggleComplete(task.id)}
                            className="mt-1 flex-shrink-0"
                          >
                            {task.completed ? (
                              <CheckCircle2 className="h-5 w-5 text-waqti-green" />
                            ) : (
                              <Circle className="h-5 w-5 text-muted-foreground" />
                            )}
                          </button>
                          <div className="flex-1">
                            <div className="flex justify-between">
                              <h3 className="font-medium">{task.title}</h3>
                              <button 
                                className="text-destructive hover:text-destructive/80 transition-colors"
                                onClick={() => deleteTask(task.id)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </div>
                            {task.description && (
                              <p className="text-muted-foreground text-sm mt-1">{task.description}</p>
                            )}
                            <div className="flex gap-2 mt-2">
                              <Badge className={categoryColors[task.category]}>
                                {isRtl ? {
                                  "work": "العمل",
                                  "study": "الدراسة",
                                  "personal": "شخصي",
                                  "health": "الصحة",
                                  "other": "أخرى"
                                }[task.category] : task.category}
                              </Badge>
                              {task.time && (
                                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                  <Clock className="h-3 w-3" />
                                  <span>{task.time}</span>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                  
                  {upcomingTasks.length > 0 && (
                    <div className="mt-6">
                      <h3 className="font-semibold text-sm text-muted-foreground mb-2">
                        {isRtl ? "المهام القادمة" : "Upcoming Tasks"}
                      </h3>
                      <div className="space-y-2">
                        {upcomingTasks.slice(0, 3).map((task) => (
                          <div 
                            key={task.id}
                            className="p-3 border rounded-lg flex items-start gap-3 task-entry"
                          >
                            <div className="flex-shrink-0 mt-1">
                              <Calendar className="h-4 w-4 text-muted-foreground" />
                            </div>
                            <div className="flex-1">
                              <div className="flex justify-between">
                                <h3 className="font-medium">{task.title}</h3>
                                <span className="text-xs text-muted-foreground">{task.date}</span>
                              </div>
                              <Badge className={categoryColors[task.category]} size="sm">
                                {isRtl ? {
                                  "work": "العمل",
                                  "study": "الدراسة",
                                  "personal": "شخصي",
                                  "health": "الصحة",
                                  "other": "أخرى"
                                }[task.category] : task.category}
                              </Badge>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </Tabs>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default Planner;

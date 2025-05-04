
import React from "react";
import { useState, useEffect } from "react";
import MainLayout from "@/components/Layout/MainLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { CheckCircle, AlertCircle, Wifi, WifiOff } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { supabase, checkSupabaseConnection } from "@/integrations/supabase/client";

const registrationSchema = z.object({
  name: z.string().min(2, { message: "الاسم يجب أن يكون على الأقل حرفين" }),
  email: z.string().email({ message: "يرجى إدخال بريد إلكتروني صحيح" }),
  password: z.string().min(6, { message: "كلمة المرور يجب أن تكون 6 أحرف على الأقل" })
});

type RegistrationFormValues = z.infer<typeof registrationSchema>;

const Registration = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [serverResponse, setServerResponse] = useState<{ success: boolean; message: string } | null>(null);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [isSupabaseConnected, setIsSupabaseConnected] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const form = useForm<RegistrationFormValues>({
    resolver: zodResolver(registrationSchema),
    defaultValues: {
      name: "",
      email: "",
      password: ""
    }
  });

  // مراقبة حالة الاتصال بالانترنت وبـ Supabase
  useEffect(() => {
    // تسجيل حالة الاتصال الأولية
    setIsOnline(navigator.onLine);
    
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    // إضافة مستمعي الأحداث للاتصال بالإنترنت
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // التحقق من الاتصال بـ Supabase إذا كان هناك اتصال بالإنترنت
    const checkConnection = async () => {
      if (navigator.onLine) {
        try {
          console.log("جاري التحقق من الاتصال بـ Supabase...");
          const isConnected = await checkSupabaseConnection();
          console.log("حالة الاتصال بـ Supabase:", isConnected);
          setIsSupabaseConnected(isConnected);
          setIsOnline(isConnected); // تعيين حالة الاتصال بناءً على اتصال Supabase الفعلي
        } catch (error) {
          console.error("فشل التحقق من اتصال Supabase:", error);
          setIsSupabaseConnected(false);
        }
      } else {
        setIsSupabaseConnected(false);
      }
    };

    // التحقق من الاتصال عند تحميل الصفحة وإعادة التحقق كل 30 ثانية
    checkConnection();
    const connectionInterval = setInterval(checkConnection, 30000);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      clearInterval(connectionInterval);
    };
  }, []);

  const onSubmit = async (data: RegistrationFormValues) => {
    setIsLoading(true);
    setServerResponse(null);
    
    try {
      console.log("بدء محاولة التسجيل...");
      
      // إذا كان الاتصال غير متاح، استخدم الوضع التجريبي تلقائيا
      if (!isOnline || !isSupabaseConnected) {
        return handleFallbackRegistration(data);
      }
      
      // إعادة التحقق من الاتصال قبل إرسال البيانات
      const connectionCheck = await checkSupabaseConnection();
      if (!connectionCheck) {
        console.log("لا يوجد اتصال بـ Supabase، جاري التحويل إلى الوضع التجريبي");
        return handleFallbackRegistration(data);
      }
      
      // تسجيل المستخدم في سوبابيس
      const { data: authData, error } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
          data: {
            name: data.name,
          },
          emailRedirectTo: window.location.origin + '/planner'
        }
      });
      
      if (error) {
        throw error;
      }
      
      console.log("تم التسجيل بنجاح:", authData);
      
      // Profile سيتم إنشاؤه تلقائيًا بواسطة الـ trigger في قاعدة البيانات
      
      setServerResponse({
        success: true,
        message: "تم التسجيل بنجاح، تم إرسال بريد التحقق إلى بريدك الإلكتروني"
      });
      
      toast({
        title: "تم التسجيل بنجاح",
        description: "تم إنشاء حسابك بنجاح، تم إرسال بريد التحقق",
        variant: "default",
      });
      
      form.reset();
      
      // حفظ معلومات المستخدم محليًا
      localStorage.setItem("waqti_user", JSON.stringify({
        name: data.name,
        email: data.email,
        id: authData.user?.id
      }));
      
      // انتقال إلى صفحة الخطة بعد التسجيل الناجح
      setTimeout(() => navigate("/planner"), 2000);
      
    } catch (error: any) {
      console.error("Registration error:", error);
      
      let errorMessage = "حدث خطأ أثناء التسجيل";
      
      // تحديد نوع الخطأ من سوبابيس
      if (error.message) {
        if (error.message.includes("email") || error.message.includes("already registered")) {
          errorMessage = "البريد الإلكتروني مسجل مسبقاً";
        } else if (error.message.includes("password")) {
          errorMessage = "كلمة المرور غير صالحة";
        } else if (error.message.includes("Network") || error.message.includes("fetch")) {
          errorMessage = "تعذر الاتصال بالخادم. يرجى التحقق من اتصالك بالإنترنت";
          // تلقائيا استخدم الوضع التجريبي عند وجود مشاكل بالشبكة
          return handleFallbackRegistration(data);
        }
      }
      
      setServerResponse({
        success: false,
        message: errorMessage
      });
      
      toast({
        title: "خطأ في التسجيل",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // التسجيل في وضع تجريبي عندما يكون الخادم غير متاح
  const handleFallbackRegistration = (data: RegistrationFormValues) => {
    setIsLoading(true);
    setServerResponse(null);
    
    // محاكاة تأخير الشبكة
    setTimeout(() => {
      setServerResponse({
        success: true,
        message: "تم التسجيل بنجاح في الوضع التجريبي"
      });
      
      toast({
        title: "تم التسجيل بنجاح",
        description: "تم إنشاء حسابك بنجاح في الوضع التجريبي",
        variant: "default",
      });
      
      form.reset();
      
      // حفظ بيانات المستخدم في التخزين المحلي للوضع التجريبي
      localStorage.setItem("waqti_user", JSON.stringify({
        name: data.name || "مستخدم تجريبي",
        email: data.email || "user@example.com",
        isDemo: true
      }));
      
      // الانتقال إلى صفحة المخطط بعد التسجيل التجريبي الناجح
      setTimeout(() => navigate("/planner"), 1500);
      setIsLoading(false);
    }, 1000);
  };

  // تحديد الرسالة المناسبة لحالة الاتصال
  const connectionStatusMessage = () => {
    if (!isOnline) {
      return "أنت غير متصل بالإنترنت. يمكنك استخدام الوضع التجريبي للمتابعة";
    } else if (!isSupabaseConnected) {
      return "لا يمكن الاتصال بالخادم حاليًا. يمكنك استخدام الوضع التجريبي للمتابعة";
    }
    return null;
  };

  return (
    <MainLayout>
      <div className="container mx-auto py-8 animate-fade-in" dir="rtl">
        <div className="max-w-md mx-auto">
          <Card className="border border-border/50 shadow-lg">
            <CardHeader className="text-right">
              <CardTitle className="text-2xl font-bold flex items-center justify-between">
                <span>إنشاء حساب جديد</span>
                <span className="text-sm font-normal">
                  {isOnline && isSupabaseConnected ? (
                    <span className="text-green-600 flex items-center">
                      <Wifi className="h-4 w-4 mr-1" /> متصل
                    </span>
                  ) : (
                    <span className="text-amber-600 flex items-center">
                      <WifiOff className="h-4 w-4 mr-1" /> غير متصل
                    </span>
                  )}
                </span>
              </CardTitle>
              <CardDescription>
                سجل للوصول إلى منصة وقتي
              </CardDescription>
            </CardHeader>
            <CardContent>
              {serverResponse && (
                <Alert className={`mb-4 ${serverResponse.success ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
                  {serverResponse.success ? 
                    <CheckCircle className="h-4 w-4 text-green-500" /> : 
                    <AlertCircle className="h-4 w-4 text-red-500" />
                  }
                  <AlertTitle className={serverResponse.success ? 'text-green-800' : 'text-red-800'}>
                    {serverResponse.success ? 'تم التسجيل بنجاح' : 'خطأ في التسجيل'}
                  </AlertTitle>
                  <AlertDescription className={serverResponse.success ? 'text-green-700' : 'text-red-700'}>
                    {serverResponse.message}
                  </AlertDescription>
                </Alert>
              )}
              
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>الاسم</FormLabel>
                        <FormControl>
                          <Input placeholder="أدخل اسمك" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>البريد الإلكتروني</FormLabel>
                        <FormControl>
                          <Input 
                            type="email" 
                            placeholder="أدخل بريدك الإلكتروني" 
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>كلمة المرور</FormLabel>
                        <FormControl>
                          <Input 
                            type="password" 
                            placeholder="أدخل كلمة المرور" 
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <div className="space-y-3">
                    <Button 
                      type="submit" 
                      className="w-full bg-waqti-purple hover:bg-waqti-purple/90"
                      disabled={isLoading}
                    >
                      {isLoading ? "جارٍ التسجيل..." : "سجل الآن"}
                    </Button>
                    
                    <Button 
                      id="demoModeButton"
                      type="button"
                      variant="outline"
                      className="w-full bg-amber-100 text-amber-800 border-amber-300 hover:bg-amber-200"
                      onClick={() => handleFallbackRegistration(form.getValues())}
                      disabled={isLoading}
                    >
                      استخدم الوضع التجريبي
                    </Button>
                  </div>
                  
                  {connectionStatusMessage() && (
                    <div className="text-center mt-2">
                      <p className="text-sm text-red-600">
                        * {connectionStatusMessage()}
                      </p>
                    </div>
                  )}
                </form>
              </Form>

              <div className="text-center mt-6">
                <p className="text-sm text-muted-foreground">
                  لديك حساب بالفعل؟{" "}
                  <Button 
                    variant="link" 
                    className="p-0 h-auto font-medium text-waqti-purple"
                    onClick={() => {
                      toast({
                        title: "قريباً",
                        description: "صفحة تسجيل الدخول قيد الإنشاء",
                      });
                    }}
                  >
                    تسجيل الدخول
                  </Button>
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </MainLayout>
  );
};

export default Registration;

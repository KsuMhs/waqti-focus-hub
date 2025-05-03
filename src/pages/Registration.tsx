
import React from "react";
import { useState } from "react";
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
import { CheckCircle, AlertCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";

const registrationSchema = z.object({
  name: z.string().min(2, { message: "الاسم يجب أن يكون على الأقل حرفين" }),
  email: z.string().email({ message: "يرجى إدخال بريد إلكتروني صحيح" }),
  password: z.string().min(6, { message: "كلمة المرور يجب أن تكون 6 أحرف على الأقل" })
});

type RegistrationFormValues = z.infer<typeof registrationSchema>;

const Registration = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [serverResponse, setServerResponse] = useState<{ success: boolean; message: string } | null>(null);
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

  const onSubmit = async (data: RegistrationFormValues) => {
    setIsLoading(true);
    setServerResponse(null);
    
    try {
      console.log("بدء محاولة التسجيل...");
      // تغيير البروتوكول إلى HTTPS للتأكد من الاتصال الآمن
      const response = await fetch("https://waqti-focus-hub.kesug.com/register.php", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
          "X-Requested-With": "XMLHttpRequest" // إضافة هذا الرأس قد يساعد مع بعض إعدادات CORS
        },
        mode: 'cors', // التأكد من استخدام وضع cors
        credentials: 'omit', // تجنب إرسال ملفات تعريف الارتباط للتعامل مع بعض مشاكل CORS
        body: JSON.stringify(data)
      });
      
      console.log("تم استلام الرد:", response);
      const result = await response.json();
      
      setServerResponse({
        success: response.ok,
        message: result.message || (response.ok ? "تم التسجيل بنجاح" : "حدث خطأ أثناء التسجيل")
      });
      
      if (response.ok) {
        toast({
          title: "تم التسجيل بنجاح",
          description: result.message || "تم إنشاء حسابك بنجاح",
          variant: "default",
        });
        form.reset();
        
        // انتقال إلى صفحة الخطة بعد التسجيل الناجح
        setTimeout(() => navigate("/planner"), 2000);
      } else {
        toast({
          title: "خطأ في التسجيل",
          description: result.message || "حدث خطأ أثناء التسجيل. يرجى المحاولة مرة أخرى.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Registration error:", error);
      
      setServerResponse({
        success: false,
        message: "لا يمكن الاتصال بالخادم. يرجى التحقق من اتصالك بالإنترنت والمحاولة مرة أخرى."
      });
      
      toast({
        title: "خطأ في الاتصال",
        description: "لا يمكن الاتصال بالخادم. يرجى التحقق من اتصالك بالإنترنت والمحاولة مرة أخرى.",
        variant: "destructive",
      });
      
      // عرض زر الوضع التجريبي تلقائيًا عند الفشل
      setTimeout(() => {
        const demoButton = document.getElementById('demoModeButton');
        if (demoButton) {
          demoButton.focus();
        }
      }, 500);
    } finally {
      setIsLoading(false);
    }
  };

  // التسجيل في وضع تجريبي عندما يكون الخادم غير متاح
  const handleFallbackRegistration = () => {
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
      setIsLoading(false);
      
      // حفظ بيانات المستخدم في التخزين المحلي للوضع التجريبي
      localStorage.setItem("waqti_user", JSON.stringify({
        name: form.getValues().name || "مستخدم تجريبي",
        email: form.getValues().email || "user@example.com",
        isDemo: true
      }));
      
      // الانتقال إلى صفحة المخطط بعد التسجيل التجريبي الناجح
      setTimeout(() => navigate("/planner"), 2000);
    }, 1500);
  };

  return (
    <MainLayout>
      <div className="container mx-auto py-8 animate-fade-in" dir="rtl">
        <div className="max-w-md mx-auto">
          <Card className="border border-border/50 shadow-lg">
            <CardHeader className="text-right">
              <CardTitle className="text-2xl font-bold">
                إنشاء حساب جديد
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
                      className="w-full"
                      onClick={handleFallbackRegistration}
                      disabled={isLoading}
                    >
                      استخدم الوضع التجريبي
                    </Button>
                  </div>
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

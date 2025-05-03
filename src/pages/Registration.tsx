
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
      // Using fetch with mode: 'cors' to handle CORS issues
      const response = await fetch("https://waqti-focus-hub.kesug.com/register.php", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
        mode: 'cors',
        body: JSON.stringify(data)
      });
      
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
    } finally {
      setIsLoading(false);
    }
  };

  // Add fallback registration handler to simulate success when API is unavailable
  const handleFallbackRegistration = () => {
    setIsLoading(true);
    setServerResponse(null);
    
    // Simulate network delay
    setTimeout(() => {
      setServerResponse({
        success: true,
        message: "تم التسجيل بنجاح (وضع تجريبي)"
      });
      
      toast({
        title: "تم التسجيل بنجاح",
        description: "تم إنشاء حسابك بنجاح (وضع تجريبي)",
        variant: "default",
      });
      
      form.reset();
      setIsLoading(false);
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
                    
                    {/* Add fallback button only when real API fails */}
                    {serverResponse?.success === false && (
                      <Button 
                        type="button"
                        variant="outline"
                        className="w-full"
                        onClick={handleFallbackRegistration}
                        disabled={isLoading}
                      >
                        استخدم الوضع التجريبي
                      </Button>
                    )}
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

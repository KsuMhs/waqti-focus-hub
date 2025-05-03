
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

const registrationSchema = z.object({
  name: z.string().min(2, { message: "الاسم يجب أن يكون على الأقل حرفين" }),
  email: z.string().email({ message: "يرجى إدخال بريد إلكتروني صحيح" }),
  password: z.string().min(6, { message: "كلمة المرور يجب أن تكون 6 أحرف على الأقل" })
});

type RegistrationFormValues = z.infer<typeof registrationSchema>;

const Registration = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const [isRtl, setIsRtl] = useState(() => document.documentElement.dir === "rtl");

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
    try {
      const response = await fetch("http://waqti-focus-hub.kesug.com/register.php", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
      });
      
      const result = await response.json();
      
      if (response.ok) {
        toast({
          title: "تم التسجيل بنجاح",
          description: result.message,
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
      toast({
        title: "خطأ في الاتصال",
        description: "لا يمكن الاتصال بالخادم. يرجى التحقق من اتصالك بالإنترنت والمحاولة مرة أخرى.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <MainLayout>
      <div className="container mx-auto py-8 animate-fade-in">
        <div className="max-w-md mx-auto">
          <Card className="border border-border/50">
            <CardHeader>
              <CardTitle className="text-2xl font-bold text-center">
                {isRtl ? "إنشاء حساب جديد" : "Create New Account"}
              </CardTitle>
              <CardDescription className="text-center">
                {isRtl ? "سجل للوصول إلى منصة وقتي" : "Register to access Waqti platform"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{isRtl ? "الاسم" : "Name"}</FormLabel>
                        <FormControl>
                          <Input placeholder={isRtl ? "أدخل اسمك" : "Enter your name"} {...field} />
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
                        <FormLabel>{isRtl ? "البريد الإلكتروني" : "Email"}</FormLabel>
                        <FormControl>
                          <Input 
                            type="email" 
                            placeholder={isRtl ? "أدخل بريدك الإلكتروني" : "Enter your email"} 
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
                        <FormLabel>{isRtl ? "كلمة المرور" : "Password"}</FormLabel>
                        <FormControl>
                          <Input 
                            type="password" 
                            placeholder={isRtl ? "أدخل كلمة المرور" : "Enter your password"} 
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <Button 
                    type="submit" 
                    className="w-full bg-waqti-purple hover:bg-waqti-purple/90"
                    disabled={isLoading}
                  >
                    {isLoading 
                      ? (isRtl ? "جارٍ التسجيل..." : "Registering...") 
                      : (isRtl ? "سجل الآن" : "Register Now")}
                  </Button>
                </form>
              </Form>

              <div className="text-center mt-6">
                <p className="text-sm text-muted-foreground">
                  {isRtl ? "لديك حساب بالفعل؟" : "Already have an account?"}{" "}
                  <Button 
                    variant="link" 
                    className="p-0 h-auto font-medium text-waqti-purple"
                    onClick={() => {
                      // Navigate to login page when it's created
                      toast({
                        title: isRtl ? "قريباً" : "Coming Soon",
                        description: isRtl ? "صفحة تسجيل الدخول قيد الإنشاء" : "Login page is under construction",
                      });
                    }}
                  >
                    {isRtl ? "تسجيل الدخول" : "Login"}
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


import { useState } from "react";
import MainLayout from "@/components/Layout/MainLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";

const Settings = () => {
  const [isRtl, setIsRtl] = useState(() => document.documentElement.dir === "rtl");
  const { toast } = useToast();

  const [settings, setSettings] = useState({
    notifications: true,
    autoStartFocus: true,
    autoStartBreak: true,
    language: isRtl ? "ar" : "en",
    theme: "light",
  });

  const handleSettingChange = (key: string, value: any) => {
    setSettings({ ...settings, [key]: value });
    
    if (key === "language") {
      const shouldBeRtl = value === "ar";
      setIsRtl(shouldBeRtl);
      document.documentElement.dir = shouldBeRtl ? "rtl" : "ltr";
      document.documentElement.lang = shouldBeRtl ? "ar" : "en";
      document.body.className = shouldBeRtl ? "rtl" : "ltr";
    }
  };

  const handleSaveSettings = () => {
    // In a real app, this would save to backend or local storage
    toast({
      title: isRtl ? "تم الحفظ" : "Settings saved",
      description: isRtl ? "تم حفظ الإعدادات بنجاح" : "Your settings have been saved successfully",
    });
  };

  return (
    <MainLayout>
      <div className="container mx-auto max-w-3xl animate-fade-in">
        <h1 className="text-3xl font-bold mb-6">
          {isRtl ? "الإعدادات" : "Settings"}
        </h1>
        
        <div className="space-y-6">
          <Card className="border border-border/50">
            <CardHeader>
              <CardTitle>
                {isRtl ? "تفضيلات المستخدم" : "User Preferences"}
              </CardTitle>
              <CardDescription>
                {isRtl 
                  ? "تخصيص إعدادات التطبيق وتجربة المستخدم" 
                  : "Customize app settings and user experience"}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-base">
                    {isRtl ? "اللغة" : "Language"}
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    {isRtl 
                      ? "اختر لغة الواجهة المفضلة" 
                      : "Choose your preferred interface language"}
                  </p>
                </div>
                <Select
                  value={settings.language}
                  onValueChange={(value) => handleSettingChange("language", value)}
                >
                  <SelectTrigger className="w-[150px]">
                    <SelectValue placeholder="Language" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="en">English</SelectItem>
                    <SelectItem value="ar">العربية</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-base">
                    {isRtl ? "السمة" : "Theme"}
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    {isRtl 
                      ? "اختر مظهر التطبيق المفضل" 
                      : "Choose your preferred app appearance"}
                  </p>
                </div>
                <Select
                  value={settings.theme}
                  onValueChange={(value) => handleSettingChange("theme", value)}
                >
                  <SelectTrigger className="w-[150px]">
                    <SelectValue placeholder="Theme" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="light">{isRtl ? "فاتح" : "Light"}</SelectItem>
                    <SelectItem value="dark">{isRtl ? "داكن" : "Dark"}</SelectItem>
                    <SelectItem value="system">{isRtl ? "نظام" : "System"}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
          
          <Card className="border border-border/50">
            <CardHeader>
              <CardTitle>
                {isRtl ? "الإشعارات" : "Notifications"}
              </CardTitle>
              <CardDescription>
                {isRtl 
                  ? "إدارة كيفية تلقيك للتنبيهات والإشعارات" 
                  : "Manage how you receive alerts and notifications"}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-base">
                    {isRtl ? "الإشعارات" : "Notifications"}
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    {isRtl 
                      ? "تمكين أو تعطيل إشعارات التطبيق" 
                      : "Enable or disable app notifications"}
                  </p>
                </div>
                <Switch
                  checked={settings.notifications}
                  onCheckedChange={(checked) => handleSettingChange("notifications", checked)}
                />
              </div>
            </CardContent>
          </Card>
          
          <Card className="border border-border/50">
            <CardHeader>
              <CardTitle>
                {isRtl ? "إعدادات وضع التركيز" : "Focus Mode Settings"}
              </CardTitle>
              <CardDescription>
                {isRtl 
                  ? "تخصيص كيفية عمل مؤقت بومودورو" 
                  : "Customize how the pomodoro timer works"}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-base">
                    {isRtl ? "بدء الاستراحات تلقائيًا" : "Auto-start breaks"}
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    {isRtl 
                      ? "بدء مؤقتات الاستراحة تلقائيًا بعد انتهاء فترات التركيز" 
                      : "Automatically start break timers after focus sessions end"}
                  </p>
                </div>
                <Switch
                  checked={settings.autoStartBreak}
                  onCheckedChange={(checked) => handleSettingChange("autoStartBreak", checked)}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-base">
                    {isRtl ? "بدء فترات التركيز تلقائيًا" : "Auto-start focus sessions"}
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    {isRtl 
                      ? "بدء فترات التركيز تلقائيًا بعد انتهاء الاستراحات" 
                      : "Automatically start focus sessions after breaks end"}
                  </p>
                </div>
                <Switch
                  checked={settings.autoStartFocus}
                  onCheckedChange={(checked) => handleSettingChange("autoStartFocus", checked)}
                />
              </div>
            </CardContent>
          </Card>
          
          <div className="flex justify-end">
            <Button size="lg" onClick={handleSaveSettings}>
              {isRtl ? "حفظ الإعدادات" : "Save Settings"}
            </Button>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default Settings;

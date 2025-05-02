
import { 
  Calendar, 
  CheckSquare, 
  Clock, 
  Home, 
  Medal, 
  Settings,
  LanguagesIcon
} from "lucide-react";
import { 
  Sidebar, 
  SidebarContent, 
  SidebarFooter,
  SidebarGroup, 
  SidebarGroupContent, 
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu, 
  SidebarMenuButton, 
  SidebarMenuItem,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";

interface AppSidebarProps {
  isRtl: boolean;
  setIsRtl: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function AppSidebar({ isRtl, setIsRtl }: AppSidebarProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const [activePath, setActivePath] = useState("/");

  // Update active path when location changes
  useEffect(() => {
    setActivePath(location.pathname);
  }, [location]);

  const menuItems = [
    {
      title: isRtl ? "الرئيسية" : "Home",
      path: "/",
      icon: Home,
    },
    {
      title: isRtl ? "المخطط اليومي" : "Daily Planner",
      path: "/planner",
      icon: CheckSquare,
    },
    {
      title: isRtl ? "تتبع العادات" : "Habit Tracker",
      path: "/habits",
      icon: Calendar,
    },
    {
      title: isRtl ? "وضع التركيز" : "Focus Mode",
      path: "/focus",
      icon: Clock,
    },
    {
      title: isRtl ? "الإنجازات" : "Achievements",
      path: "/achievements",
      icon: Medal,
    },
    {
      title: isRtl ? "الإعدادات" : "Settings",
      path: "/settings",
      icon: Settings,
    },
  ];

  const handleNavigation = (path: string) => {
    navigate(path);
  };

  const toggleLanguage = () => {
    setIsRtl(!isRtl);
  };

  return (
    <Sidebar>
      <SidebarHeader>
        <div className="flex items-center justify-between p-4">
          <h1 className="text-2xl font-bold text-primary">
            {isRtl ? "وقتي" : "Waqti"}
          </h1>
          <SidebarTrigger />
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>
            {isRtl ? "القائمة الرئيسية" : "Main Menu"}
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.path}>
                  <SidebarMenuButton
                    active={activePath === item.path}
                    onClick={() => handleNavigation(item.path)}
                  >
                    <item.icon className="h-5 w-5" />
                    <span>{item.title}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <div className="px-3 py-2">
          <Button 
            variant="ghost" 
            className="w-full flex items-center justify-center gap-2"
            onClick={toggleLanguage}
          >
            <LanguagesIcon className="h-4 w-4" />
            <span>{isRtl ? "English" : "العربية"}</span>
          </Button>
        </div>
        <p className="text-xs text-center text-muted-foreground py-2">
          {isRtl ? "وقتي - منصة ذكية لتنظيم وقتك" : "Waqti - Smart time organizer"}
        </p>
      </SidebarFooter>
    </Sidebar>
  );
}

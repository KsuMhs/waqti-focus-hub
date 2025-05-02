
import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Home } from "lucide-react";

const NotFound = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const isRtl = document.documentElement.dir === "rtl";

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center">
        <h1 className="text-5xl font-bold mb-4">404</h1>
        <p className="text-xl text-muted-foreground mb-6">
          {isRtl 
            ? "عذراً، الصفحة التي تبحث عنها غير موجودة" 
            : "Sorry, the page you're looking for doesn't exist."}
        </p>
        <Button 
          onClick={() => navigate("/")} 
          className="gap-2"
        >
          <Home className="h-4 w-4" />
          <span>
            {isRtl ? "العودة للرئيسية" : "Return to Home"}
          </span>
        </Button>
      </div>
    </div>
  );
};

export default NotFound;

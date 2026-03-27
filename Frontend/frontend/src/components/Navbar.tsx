import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetTitle,
} from "@/components/ui/sheet";

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-sm border-b border-primary/[0.12]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Wordmark */}
          <Link to="/" className="flex items-center gap-0.5 text-xl font-bold">
            <span className="text-primary">AI</span>
            <span className="text-foreground ml-1">Professor</span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-6">
            {user ? (
              <>
                <Link
                  to="/dashboard"
                  className="text-sm text-foreground/80 hover:text-primary transition-colors duration-200"
                >
                  Dashboard
                </Link>
                <Link
                  to="/syllabus"
                  className="text-sm text-foreground/80 hover:text-primary transition-colors duration-200"
                >
                  Syllabus Mode
                </Link>
                <span className="text-sm text-muted-foreground flex items-center gap-1.5 cursor-default">
                  General Mode
                  <Badge variant="outline" className="text-[10px] border-muted-foreground/30 text-muted-foreground px-1.5 py-0">
                    Soon
                  </Badge>
                </span>
                <div className="flex items-center gap-3 ml-2">
                  <button
                    onClick={() => navigate("/dashboard")}
                    className="h-8 w-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-semibold cursor-pointer hover:bg-accent-hover transition-colors duration-200"
                  >
                    {user.name.charAt(0).toUpperCase()}
                  </button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleLogout}
                    className="text-foreground/70 hover:text-primary"
                  >
                    Logout
                  </Button>
                </div>
              </>
            ) : (
              <>
                <Button
                  variant="ghost"
                  onClick={() => navigate("/login")}
                  className="text-foreground/80 hover:text-primary"
                >
                  Login
                </Button>
                <Button
                  onClick={() => navigate("/signup")}
                  className="bg-primary text-primary-foreground hover:bg-accent-hover font-semibold rounded-xl"
                >
                  Get Started
                </Button>
              </>
            )}
          </div>

          {/* Mobile hamburger */}
          <div className="md:hidden">
            <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="top" className="bg-background border-b border-primary/[0.12]">
                <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
                <div className="flex flex-col gap-4 pt-4">
                  {user ? (
                    <>
                      <Link to="/dashboard" onClick={() => setMobileOpen(false)} className="text-foreground hover:text-primary transition-colors py-2">
                        Dashboard
                      </Link>
                      <Link to="/syllabus" onClick={() => setMobileOpen(false)} className="text-foreground hover:text-primary transition-colors py-2">
                        Syllabus Mode
                      </Link>
                      <span className="text-muted-foreground flex items-center gap-2 py-2">
                        General Mode
                        <Badge variant="outline" className="text-[10px] border-muted-foreground/30 text-muted-foreground">Soon</Badge>
                      </span>
                      <Button variant="ghost" onClick={() => { handleLogout(); setMobileOpen(false); }} className="justify-start text-foreground/70 hover:text-primary">
                        Logout
                      </Button>
                    </>
                  ) : (
                    <>
                      <Button variant="ghost" onClick={() => { navigate("/login"); setMobileOpen(false); }} className="justify-start text-foreground/80">
                        Login
                      </Button>
                      <Button onClick={() => { navigate("/signup"); setMobileOpen(false); }} className="bg-primary text-primary-foreground hover:bg-accent-hover font-semibold rounded-xl">
                        Get Started
                      </Button>
                    </>
                  )}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

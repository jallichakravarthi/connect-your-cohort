import { Button } from "@/components/ui/button";
import { useNavigate, useLocation } from "react-router-dom";
import { GraduationCap, Users, MessageSquare, User, LogOut, Home } from "lucide-react";

interface NavbarProps {
  isAuthenticated: boolean;
  onLogout: () => void;
}

const Navbar = ({ isAuthenticated, onLogout }: NavbarProps) => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    localStorage.removeItem('token');
    onLogout();
    navigate('/');
  };

  const navItems = isAuthenticated ? [
    { path: '/dashboard', label: 'Dashboard', icon: Home },
    { path: '/alumni', label: 'Alumni', icon: Users },
    { path: '/forum', label: 'Forum', icon: MessageSquare },
    { path: '/profile', label: 'Profile', icon: User },
  ] : [];

  return (
    <nav className="bg-card border-b border-border shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <button
              onClick={() => navigate('/')}
              className="flex items-center space-x-2 hover:opacity-80 transition-opacity"
            >
              <GraduationCap className="h-8 w-8 text-primary" />
              <span className="text-xl font-bold text-foreground">CampusConnect</span>
            </button>
          </div>

          <div className="flex items-center space-x-4">
            {isAuthenticated ? (
              <>
                {navItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = location.pathname === item.path;
                  return (
                    <Button
                      key={item.path}
                      variant={isActive ? "default" : "ghost"}
                      onClick={() => navigate(item.path)}
                      className="flex items-center space-x-2"
                    >
                      <Icon className="h-4 w-4" />
                      <span className="hidden md:inline">{item.label}</span>
                    </Button>
                  );
                })}
                <Button variant="outline" onClick={handleLogout}>
                  <LogOut className="h-4 w-4" />
                  <span className="hidden md:inline ml-2">Logout</span>
                </Button>
              </>
            ) : (
              <>
                <Button variant="ghost" onClick={() => navigate('/login')}>
                  Login
                </Button>
                <Button variant="hero" onClick={() => navigate('/register')}>
                  Register
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
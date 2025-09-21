import { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  BarChart3,
  Map,
  AlertTriangle,
  Users,
  Settings,
  LogOut,
  Menu,
  X,
  Waves,
  MessageSquare,
  Bell,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';

interface SidebarProps {
  collapsed: boolean;
  onToggle: () => void;
}

export const Sidebar = ({ collapsed, onToggle }: SidebarProps) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/auth');
  };

  const getNavItems = () => {
    const commonItems = [
      { icon: Map, label: 'Interactive Map', path: '/dashboard', badge: null },
      { icon: AlertTriangle, label: 'My Reports', path: '/reports', badge: null },
      { icon: MessageSquare, label: 'Social Trends', path: '/social', badge: '12' },
    ];

    const officialItems = [
      { icon: BarChart3, label: 'Analytics', path: '/analytics', badge: null },
      { icon: Users, label: 'All Reports', path: '/all-reports', badge: '45' },
      { icon: Bell, label: 'Alerts', path: '/alerts', badge: '3' },
    ];

    if (user?.role === 'official' || user?.role === 'analyst') {
      return [...commonItems, ...officialItems];
    }

    return commonItems;
  };

  const navItems = getNavItems();

  return (
    <div className={`relative bg-card border-r border-border transition-all duration-300 ${
      collapsed ? 'w-16' : 'w-64'
    }`}>
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-border">
        {!collapsed && (
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-gradient-ocean rounded-lg">
              <Waves className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="font-bold text-lg">LEHAR</h2>
              <p className="text-xs text-muted-foreground">Ocean Monitoring</p>
            </div>
          </div>
        )}
        {collapsed && (
          <div className="p-2 bg-gradient-ocean rounded-lg mx-auto">
            <Waves className="w-6 h-6 text-white" />
          </div>
        )}
        <Button
          variant="ghost"
          size="sm"
          onClick={onToggle}
          className="ml-auto"
        >
          {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </Button>
      </div>

      {/* User Profile */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center space-x-3">
          <Avatar className="w-10 h-10 border-2 border-primary/20">
            <AvatarFallback className="bg-gradient-ocean text-white font-semibold">
              {user?.name?.split(' ').map(n => n[0]).join('')}
            </AvatarFallback>
          </Avatar>
          {!collapsed && (
            <div className="flex-1 min-w-0">
              <p className="font-medium truncate">{user?.name}</p>
              <p className="text-xs text-muted-foreground capitalize">{user?.role}</p>
            </div>
          )}
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors group ${
                isActive
                  ? 'bg-primary text-primary-foreground shadow-ocean'
                  : 'hover:bg-secondary text-foreground'
              }`
            }
          >
            <item.icon className="w-5 h-5 flex-shrink-0" />
            {!collapsed && (
              <>
                <span className="flex-1 truncate">{item.label}</span>
                {item.badge && (
                  <Badge variant="secondary" className="text-xs">
                    {item.badge}
                  </Badge>
                )}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Bottom Actions */}
      <div className="p-4 border-t border-border space-y-2">
        <NavLink
          to="/settings"
          className={({ isActive }) =>
            `flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors ${
              isActive
                ? 'bg-primary text-primary-foreground'
                : 'hover:bg-secondary text-foreground'
            }`
          }
        >
          <Settings className="w-5 h-5 flex-shrink-0" />
          {!collapsed && <span>Settings</span>}
        </NavLink>
        
        <Button
          variant="ghost"
          onClick={handleLogout}
          className="w-full justify-start text-destructive hover:text-destructive hover:bg-destructive/10"
        >
          <LogOut className="w-5 h-5 flex-shrink-0" />
          {!collapsed && <span className="ml-3">Logout</span>}
        </Button>
      </div>
    </div>
  );
};
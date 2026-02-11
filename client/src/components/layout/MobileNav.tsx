import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  FileText,
  Briefcase,
  Users,
  Settings,
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import type { UserRole } from '../../types';

interface MobileNavItem {
  to: string;
  icon: React.ReactNode;
  label: string;
}

function getMobileNavItems(role: UserRole): MobileNavItem[] {
  switch (role) {
    case 'entrepreneur':
      return [
        { to: '/my-venture', icon: <Briefcase className="w-5 h-5" />, label: 'Venture' },
        { to: '/apply', icon: <FileText className="w-5 h-5" />, label: 'Apply' },
      ];
    case 'venture_partner':
      return [
        { to: '/vp/dashboard', icon: <LayoutDashboard className="w-5 h-5" />, label: 'Home' },
        { to: '/vp/ventures', icon: <Briefcase className="w-5 h-5" />, label: 'Ventures' },
      ];
    case 'mentor':
      return [
        { to: '/mentor/dashboard', icon: <LayoutDashboard className="w-5 h-5" />, label: 'Home' },
        { to: '/mentor/requests', icon: <Users className="w-5 h-5" />, label: 'Requests' },
      ];
    case 'success_manager':
      return [
        { to: '/csm/dashboard', icon: <LayoutDashboard className="w-5 h-5" />, label: 'Portfolio' },
        { to: '/csm/applications', icon: <FileText className="w-5 h-5" />, label: 'Applications' },
      ];
    case 'super_admin':
      return [
        { to: '/admin/dashboard', icon: <LayoutDashboard className="w-5 h-5" />, label: 'Dashboard' },
        { to: '/admin/users', icon: <Users className="w-5 h-5" />, label: 'Users' },
        { to: '/admin/settings', icon: <Settings className="w-5 h-5" />, label: 'Settings' },
      ];
    default:
      return [
        { to: '/dashboard', icon: <LayoutDashboard className="w-5 h-5" />, label: 'Home' },
      ];
  }
}

export function MobileNav() {
  const { profile } = useAuth();
  const navItems = getMobileNavItems(profile?.role || 'entrepreneur');

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-40">
      <div className="flex items-center justify-around px-2 py-2">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                isActive ? 'text-primary-600' : 'text-gray-500'
              }`
            }
          >
            {item.icon}
            <span>{item.label}</span>
          </NavLink>
        ))}
      </div>
    </nav>
  );
}

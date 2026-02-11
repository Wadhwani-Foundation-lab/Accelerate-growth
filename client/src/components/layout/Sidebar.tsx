import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  FileText,
  Briefcase,
  Users,
  CheckSquare,
  Settings,
  LogOut,
  Rocket,
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import type { UserRole } from '../../types';

interface NavItem {
  to: string;
  icon: React.ReactNode;
  label: string;
}

function getNavItems(role: UserRole): NavItem[] {
  switch (role) {
    case 'entrepreneur':
      return [
        { to: '/my-venture', icon: <Briefcase className="w-5 h-5" />, label: 'My Venture' },
        { to: '/apply', icon: <FileText className="w-5 h-5" />, label: 'Application' },
      ];
    case 'venture_partner':
      return [
        { to: '/vp/dashboard', icon: <LayoutDashboard className="w-5 h-5" />, label: 'Dashboard' },
        { to: '/vp/ventures', icon: <Briefcase className="w-5 h-5" />, label: 'My Ventures' },
      ];
    case 'mentor':
      return [
        { to: '/mentor/dashboard', icon: <LayoutDashboard className="w-5 h-5" />, label: 'Dashboard' },
        { to: '/mentor/requests', icon: <Users className="w-5 h-5" />, label: 'Requests' },
      ];
    case 'success_manager':
      return [
        { to: '/csm/dashboard', icon: <LayoutDashboard className="w-5 h-5" />, label: 'Portfolio' },
        { to: '/csm/applications', icon: <FileText className="w-5 h-5" />, label: 'Applications' },
        { to: '/csm/approvals', icon: <CheckSquare className="w-5 h-5" />, label: 'Approvals' },
      ];
    case 'field_head':
      return [
        { to: '/field/dashboard', icon: <LayoutDashboard className="w-5 h-5" />, label: 'Dashboard' },
        { to: '/field/approvals', icon: <CheckSquare className="w-5 h-5" />, label: 'Approvals' },
      ];
    case 'selection_manager':
      return [
        { to: '/selection/dashboard', icon: <LayoutDashboard className="w-5 h-5" />, label: 'Dashboard' },
        { to: '/selection/applications', icon: <FileText className="w-5 h-5" />, label: 'Applications' },
      ];
    case 'selection_committee':
      return [
        { to: '/committee/dashboard', icon: <LayoutDashboard className="w-5 h-5" />, label: 'Dashboard' },
        { to: '/committee/interviews', icon: <Users className="w-5 h-5" />, label: 'Interviews' },
      ];
    case 'super_admin':
      return [
        { to: '/admin/dashboard', icon: <LayoutDashboard className="w-5 h-5" />, label: 'Dashboard' },
        { to: '/admin/users', icon: <Users className="w-5 h-5" />, label: 'Users' },
        { to: '/admin/ventures', icon: <Briefcase className="w-5 h-5" />, label: 'All Ventures' },
        { to: '/admin/settings', icon: <Settings className="w-5 h-5" />, label: 'Settings' },
      ];
    default:
      return [];
  }
}

export function Sidebar() {
  const { profile, signOut } = useAuth();
  const navItems = getNavItems(profile?.role || 'entrepreneur');

  return (
    <aside className="hidden lg:flex lg:flex-col lg:w-64 bg-white border-r border-gray-200 h-screen sticky top-0">
      {/* Logo */}
      <div className="flex items-center gap-2 px-6 py-5 border-b border-gray-100">
        <div className="w-8 h-8 bg-gradient-to-br from-primary-400 to-primary-600 rounded-lg flex items-center justify-center">
          <Rocket className="w-5 h-5 text-white" />
        </div>
        <span className="text-lg font-bold text-gray-900">Accelerate</span>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-primary-50 text-primary-700'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              }`
            }
          >
            {item.icon}
            {item.label}
          </NavLink>
        ))}
      </nav>

      {/* User section */}
      <div className="border-t border-gray-100 p-4">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center text-primary-700 text-sm font-semibold">
            {profile?.full_name?.charAt(0) || 'U'}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900 truncate">{profile?.full_name}</p>
            <p className="text-xs text-gray-500 truncate capitalize">{profile?.role?.replace('_', ' ')}</p>
          </div>
        </div>
        <button
          onClick={signOut}
          className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700 w-full px-2 py-1.5 rounded-lg hover:bg-gray-50 transition-colors"
        >
          <LogOut className="w-4 h-4" />
          Sign Out
        </button>
      </div>
    </aside>
  );
}

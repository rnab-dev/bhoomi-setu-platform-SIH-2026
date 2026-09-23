import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Map, 
  FolderKanban, 
  FileText, 
  MapPin, 
  IndianRupee, 
  Users, 
  Home,
  HardHat,
  FileBox,
  AlertCircle,
  BarChart3,
  Lightbulb,
  ClipboardList,
  Settings
} from 'lucide-react';
import { cn } from '@/utils';

interface NavItem {
  name: string;
  href: string;
  icon: React.ElementType;
}

interface NavGroup {
  name: string;
  items: NavItem[];
}

const navigation: NavGroup[] = [
  {
    name: 'Overview',
    items: [
      { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    ],
  },
  {
    name: 'Land Acquisition',
    items: [
      { name: 'Projects', href: '/projects', icon: FolderKanban },
      { name: 'Parcels', href: '/parcels', icon: MapPin },
      { name: 'Workflows', href: '/workflows', icon: FileText },
    ],
  },
  {
    name: 'Spatial',
    items: [
      { name: 'GIS / Land Map', href: '/gis', icon: Map },
    ],
  },
  {
    name: 'Financial',
    items: [
      { name: 'Compensation', href: '/compensation', icon: IndianRupee },
    ],
  },
  {
    name: 'Rehabilitation',
    items: [
      { name: 'Affected Families', href: '/affected-families', icon: Users },
      { name: 'R&R Progress', href: '/r-and-r', icon: Home },
    ],
  },
  {
    name: 'Operations',
    items: [
      { name: 'Field Operations', href: '/field-operations', icon: HardHat },
      { name: 'Documents', href: '/documents', icon: FileBox },
      { name: 'Grievances', href: '/grievances', icon: AlertCircle },
    ],
  },
  {
    name: 'Insights',
    items: [
      { name: 'Analytics', href: '/analytics', icon: BarChart3 },
      { name: 'Decision Support', href: '/decision-support', icon: Lightbulb },
    ],
  },
  {
    name: 'Administration',
    items: [
      { name: 'Audit Log', href: '/audit-log', icon: ClipboardList },
      { name: 'Settings', href: '/settings', icon: Settings },
    ],
  },
];

export function Sidebar({ className }: { className?: string }) {
  return (
    <div className={cn("flex h-full w-64 flex-col overflow-y-auto border-r border-line bg-paper px-4 pb-6 pt-4", className)}>
      <div className="mb-8 flex items-center gap-2 px-2">
        <div className="flex h-8 w-8 items-center justify-center rounded-md bg-accent text-white">
          <Map className="h-5 w-5" />
        </div>
        <div>
          <span className="text-lg font-bold tracking-tight text-ink">BhoomiSetu</span>
        </div>
      </div>
      
      <nav className="flex-1 space-y-6">
        {navigation.map((group) => (
          <div key={group.name}>
            <h3 className="mb-2 px-2 text-xs font-semibold uppercase tracking-wider text-text-faint">
              {group.name}
            </h3>
            <div className="space-y-1">
              {group.items.map((item) => (
                <NavLink
                  key={item.name}
                  to={item.href}
                  className={({ isActive }) =>
                    cn(
                      'flex items-center gap-3 rounded-md px-2 py-2 text-sm font-medium transition-colors',
                      isActive
                        ? 'bg-accent/10 text-accent'
                        : 'text-text-mute hover:bg-slate-50 hover:text-ink'
                    )
                  }
                >
                  <item.icon className="h-4 w-4" />
                  {item.name}
                </NavLink>
              ))}
            </div>
          </div>
        ))}
      </nav>
    </div>
  );
}

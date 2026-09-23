import { Bell, Menu, Search, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLocation } from 'react-router-dom';

interface HeaderProps {
  onMenuClick?: () => void;
}

export function Header({ onMenuClick }: HeaderProps) {
  const location = useLocation();
  const path = location.pathname.split('/').filter(Boolean)[0] || 'Dashboard';
  const title = path.charAt(0).toUpperCase() + path.slice(1).replace(/-/g, ' ');

  return (
    <header className="sticky top-0 z-30 flex h-16 shrink-0 items-center gap-4 border-b border-line bg-paper px-4 sm:px-6">
      <Button
        variant="ghost"
        size="icon"
        className="md:hidden"
        onClick={onMenuClick}
      >
        <Menu className="h-5 w-5" />
        <span className="sr-only">Toggle menu</span>
      </Button>

      <div className="flex flex-1 items-center justify-between">
        <div className="flex items-center gap-2">
          <nav className="hidden sm:flex text-sm font-medium text-text-mute">
            <ol className="flex items-center space-x-2">
              <li>Home</li>
              <li><span className="text-line">/</span></li>
              <li className="text-ink" aria-current="page">{title}</li>
            </ol>
          </nav>
          <h1 className="text-lg font-semibold text-ink sm:hidden">{title}</h1>
        </div>

        <div className="flex items-center gap-4">
          <div className="relative hidden md:block">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-text-faint" />
            <input
              type="search"
              placeholder="Search..."
              className="h-9 w-64 rounded-md border border-line bg-slate-50 pl-9 pr-4 text-sm outline-none focus:border-accent focus:ring-1 focus:ring-accent"
            />
          </div>
          
          <Button variant="ghost" size="icon" className="relative text-text-mute hover:text-ink">
            <Bell className="h-5 w-5" />
            <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-brick"></span>
            <span className="sr-only">Notifications</span>
          </Button>

          <Button variant="ghost" size="icon" className="rounded-full bg-slate-100">
            <User className="h-5 w-5 text-text-mute" />
            <span className="sr-only">Profile</span>
          </Button>
        </div>
      </div>
    </header>
  );
}

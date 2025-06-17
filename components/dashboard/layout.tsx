'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  LayoutDashboard,
  Users, 
  Calendar, 
  Settings, 
  Bell,
  Network,
  LogOut,
  Menu,
  X,
  UserPlus,
  Heart
} from 'lucide-react';
import Link from 'next/link';
import { signOut } from '@/lib/supabase';
import { useRouter } from 'next/navigation';

interface DashboardLayoutProps {
  children: React.ReactNode;
  user: any;
  profile: any;
}

export function DashboardLayout({ children, user, profile }: DashboardLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const router = useRouter();

  const handleSignOut = async () => {
    await signOut();
    router.push('/');
  };

  const navigation = [
    { name: 'Overview', href: '/dashboard', icon: LayoutDashboard, current: true },
    { name: 'Matches', href: '/dashboard/matches', icon: Heart, current: false },
    { name: 'Events', href: '/dashboard/events', icon: Calendar, current: false },
    { name: 'Connections', href: '/dashboard/connections', icon: Users, current: false },
    { name: 'Profile', href: '/dashboard/profile', icon: Settings, current: false },
  ];

  const userName = user?.user_metadata?.first_name || profile?.job_title || 'User';
  const userInitials = userName.split(' ').map((n: string) => n[0]).join('').toUpperCase();

  return (
    <div className="min-h-screen bg-background">
      {/* Mobile sidebar */}
      <div className={`fixed inset-0 z-50 lg:hidden ${sidebarOpen ? 'block' : 'hidden'}`}>
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm" onClick={() => setSidebarOpen(false)} />
        <div className="fixed inset-y-0 left-0 w-64 bg-background border-r">
          <div className="flex h-16 items-center justify-between px-6 border-b">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-foreground rounded-lg flex items-center justify-center">
                <Network className="w-4 h-4 text-background" />
              </div>
              <span className="text-xl font-semibold">Valence</span>
            </div>
            <Button variant="ghost" size="icon" onClick={() => setSidebarOpen(false)}>
              <X className="w-5 h-5" />
            </Button>
          </div>
          <nav className="flex-1 p-4">
            <div className="space-y-2">
              {navigation.map((item) => (
                <Link key={item.name} href={item.href}>
                  <Button 
                    variant={item.current ? "default" : "ghost"} 
                    className="w-full justify-start"
                    onClick={() => setSidebarOpen(false)}
                  >
                    <item.icon className="w-4 h-4 mr-3" />
                    {item.name}
                  </Button>
                </Link>
              ))}
            </div>
          </nav>
        </div>
      </div>

      {/* Desktop sidebar */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-64 lg:flex-col">
        <div className="flex flex-col flex-1 min-h-0 bg-background border-r">
          <div className="flex h-16 items-center px-6 border-b">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-foreground rounded-lg flex items-center justify-center">
                <Network className="w-4 h-4 text-background" />
              </div>
              <span className="text-xl font-semibold">Valence</span>
            </div>
          </div>
          <nav className="flex-1 p-4">
            <div className="space-y-2">
              {navigation.map((item) => (
                <Link key={item.name} href={item.href}>
                  <Button 
                    variant={item.current ? "default" : "ghost"} 
                    className="w-full justify-start"
                  >
                    <item.icon className="w-4 h-4 mr-3" />
                    {item.name}
                  </Button>
                </Link>
              ))}
            </div>
          </nav>
          <div className="p-4 border-t">
            <div className="flex items-center space-x-3 mb-4">
              <Avatar className="w-10 h-10">
                <AvatarImage src={profile?.avatar_url} />
                <AvatarFallback>{userInitials}</AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{userName}</p>
                <p className="text-xs text-muted-foreground truncate">
                  {profile?.job_title || 'Professional'}
                </p>
              </div>
            </div>
            <Button 
              variant="outline" 
              size="sm" 
              className="w-full justify-start"
              onClick={handleSignOut}
            >
              <LogOut className="w-4 h-4 mr-2" />
              Sign Out
            </Button>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="lg:pl-64">
        {/* Top bar */}
        <div className="sticky top-0 z-40 h-16 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b">
          <div className="flex h-16 items-center justify-between px-4 lg:px-6">
            <Button 
              variant="ghost" 
              size="icon" 
              className="lg:hidden"
              onClick={() => setSidebarOpen(true)}
            >
              <Menu className="w-5 h-5" />
            </Button>
            
            <div className="flex-1" />
            
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="icon">
                <Bell className="w-5 h-5" />
              </Button>
              
              <div className="lg:hidden">
                <Avatar className="w-8 h-8">
                  <AvatarImage src={profile?.avatar_url} />
                  <AvatarFallback>{userInitials}</AvatarFallback>
                </Avatar>
              </div>
            </div>
          </div>
        </div>

        {/* Page content */}
        <main className="flex-1">
          {children}
        </main>
      </div>
    </div>
  );
} 
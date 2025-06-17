'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  Users, 
  Calendar, 
  Heart, 
  Plus, 
  UserPlus,
  Activity,
  TrendingUp,
  MapPin,
  Clock
} from 'lucide-react';
import Link from 'next/link';

interface DashboardOverviewProps {
  user: any;
  profile: any;
}

export function DashboardOverview({ user, profile }: DashboardOverviewProps) {
  // Mock data - replace with real data from your API
  const stats = {
    potentialConnections: 12,
    activeEvents: 2,
    professionalNetwork: 8
  };

  const recentMatches = [
    { 
      id: 1, 
      name: 'Sarah Johnson', 
      title: 'Product Manager', 
      company: 'Innovation Inc', 
      mutual: true,
      avatar: null
    },
    { 
      id: 2, 
      name: 'Mike Chen', 
      title: 'UX Designer', 
      company: 'Creative Studios', 
      mutual: false,
      avatar: null
    },
    { 
      id: 3, 
      name: 'Emma Wilson', 
      title: 'Data Scientist', 
      company: 'AI Solutions', 
      mutual: true,
      avatar: null
    },
  ];

  const userName = user?.user_metadata?.first_name || profile?.job_title?.split(' ')[0] || 'User';

  return (
    <div className="p-6 space-y-6">
      {/* Welcome Section */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Welcome back, {userName}</h1>
        <p className="text-muted-foreground">Ready to expand your professional network?</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Potential connections</CardTitle>
            <Heart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.potentialConnections}</div>
            <p className="text-xs text-muted-foreground">
              AI-matched professionals
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active networking events</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.activeEvents}</div>
            <p className="text-xs text-muted-foreground">
              Events you've joined
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Professional network</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.professionalNetwork}</div>
            <p className="text-xs text-muted-foreground">
              Connected professionals
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Matches */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              Recent Matches
              <Link href="/dashboard/matches">
                <Button variant="ghost" size="sm">
                  View All
                </Button>
              </Link>
            </CardTitle>
            <CardDescription>
              Professionals matched through AI analysis
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {recentMatches.length > 0 ? (
              recentMatches.map((match) => (
                <div key={match.id} className="flex items-center space-x-3">
                  <Avatar>
                    <AvatarImage src={match.avatar} />
                    <AvatarFallback>
                      {match.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <p className="font-medium">{match.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {match.title} at {match.company}
                    </p>
                  </div>
                  <Badge variant={match.mutual ? "default" : "secondary"}>
                    {match.mutual ? 'Mutual' : 'Pending'}
                  </Badge>
                </div>
              ))
            ) : (
              <div className="text-center py-8">
                <UserPlus className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="font-medium mb-2">No matches yet</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Join an event to start discovering potential connections
                </p>
                <Link href="/dashboard/events">
                  <Button size="sm">Browse Events</Button>
                </Link>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>
              Jump into networking activities
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Link href="/dashboard/events/join">
              <Button className="w-full justify-start">
                <Plus className="w-4 h-4 mr-2" />
                Join New Event
              </Button>
            </Link>
            <Link href="/dashboard/matches">
              <Button variant="outline" className="w-full justify-start">
                <UserPlus className="w-4 h-4 mr-2" />
                Discover Matches
              </Button>
            </Link>
            <Link href="/dashboard/profile">
              <Button variant="outline" className="w-full justify-start">
                <Users className="w-4 h-4 mr-2" />
                Update Profile
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>

      {/* Profile Summary */}
      {profile && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Activity className="w-5 h-5 mr-2" />
              Your Profile Summary
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-start space-x-4">
              <Avatar className="w-16 h-16">
                <AvatarImage src={profile.profile_image_url} />
                <AvatarFallback>
                  {profile.job_title?.split(' ').map((n: string) => n[0]).join('') || 'U'}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <h3 className="font-semibold text-lg">
                  {profile.job_title} at {profile.company}
                </h3>
                <p className="text-muted-foreground mb-2">{profile.industry}</p>
                <p className="text-sm mb-3">{profile.bio}</p>
                <div className="flex flex-wrap gap-1 mb-3">
                  {profile.skills?.slice(0, 5).map((skill: string) => (
                    <Badge key={skill} variant="outline" className="text-xs">
                      {skill}
                    </Badge>
                  ))}
                  {profile.skills?.length > 5 && (
                    <Badge variant="outline" className="text-xs">
                      +{profile.skills.length - 5} more
                    </Badge>
                  )}
                </div>
                <div className="flex items-center text-sm text-muted-foreground">
                  <TrendingUp className="w-4 h-4 mr-1" />
                  {profile.experience_years} years experience
                  {profile.location && (
                    <>
                      <MapPin className="w-4 h-4 ml-3 mr-1" />
                      {profile.location}
                    </>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
} 
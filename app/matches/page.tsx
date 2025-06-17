'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Network, 
  ArrowLeft, 
  Heart, 
  X, 
  Eye, 
  Users, 
  Briefcase,
  MapPin,
  Star,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import Link from 'next/link';

export default function MatchesPage() {
  const [currentMatchIndex, setCurrentMatchIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  const potentialMatches = [
    {
      id: 1,
      name: 'Sarah Johnson',
      title: 'Product Manager',
      company: 'Innovation Inc',
      location: 'San Francisco, CA',
      avatar: '',
      bio: 'Passionate about building products that solve real problems. Looking to connect with fellow product leaders and entrepreneurs in the tech space.',
      skills: ['Product Strategy', 'User Experience', 'Data Analysis', 'Leadership'],
      interests: ['AI/ML', 'Sustainability', 'Fintech'],
      experience: '8 years',
      matchScore: 94
    },
    {
      id: 2,
      name: 'Mike Chen',
      title: 'Senior Software Engineer',
      company: 'Creative Studios',
      location: 'Seattle, WA',
      avatar: '',
      bio: 'Full-stack developer passionate about clean architecture and scalable solutions. Always excited to learn about emerging technologies.',
      skills: ['React', 'Node.js', 'Python', 'AWS'],
      interests: ['Web3', 'Mobile Development', 'Open Source'],
      experience: '6 years',
      matchScore: 87
    },
    {
      id: 3,
      name: 'Emma Wilson',
      title: 'Data Scientist',
      company: 'AI Solutions',
      location: 'New York, NY',
      avatar: '',
      bio: 'Transforming complex data into actionable business insights. Particularly interested in the ethical applications of AI in healthcare.',
      skills: ['Machine Learning', 'Python', 'SQL', 'Statistics'],
      interests: ['Healthcare AI', 'Ethics in AI', 'Research'],
      experience: '5 years',
      matchScore: 91
    }
  ];

  const myMatches = [
    { id: 1, name: 'Alex Rivera', title: 'Startup Founder', company: 'TechStart', mutual: true, event: 'Tech Summit 2025' },
    { id: 2, name: 'Lisa Park', title: 'Marketing Director', company: 'Growth Co', mutual: true, event: 'Marketing Leaders' },
    { id: 3, name: 'David Kim', title: 'Investment Partner', company: 'Venture Capital', mutual: false, event: 'Investor Network' },
  ];

  const currentMatch = potentialMatches[currentMatchIndex];

  const handleBump = async (liked: boolean) => {
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      if (currentMatchIndex < potentialMatches.length - 1) {
        setCurrentMatchIndex(currentMatchIndex + 1);
      } else {
        setCurrentMatchIndex(0);
      }
    }, 500);
  };

  const nextMatch = () => {
    if (currentMatchIndex < potentialMatches.length - 1) {
      setCurrentMatchIndex(currentMatchIndex + 1);
    } else {
      setCurrentMatchIndex(0);
    }
  };

  const prevMatch = () => {
    if (currentMatchIndex > 0) {
      setCurrentMatchIndex(currentMatchIndex - 1);
    } else {
      setCurrentMatchIndex(potentialMatches.length - 1);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Navigation */}
      <nav className="p-6 flex justify-between items-center border-b border-slate-700/50">
        <div className="flex items-center space-x-4">
          <Link href="/dashboard" className="inline-flex items-center text-slate-300 hover:text-white transition-colors">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Link>
        </div>
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
            <Network className="w-5 h-5 text-white" />
          </div>
          <span className="text-2xl font-semibold text-white">Valence</span>
        </div>
      </nav>

      <div className="container mx-auto p-6">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-4">Discover Matches</h1>
          <p className="text-slate-400 text-lg">AI-powered networking based on your profile and interests</p>
        </div>

        <Tabs defaultValue="discover" className="space-y-6">
          <TabsList className="bg-slate-800/50 border-slate-700 mx-auto">
            <TabsTrigger value="discover" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">
              Discover
            </TabsTrigger>
            <TabsTrigger value="matches" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">
              My Matches
            </TabsTrigger>
          </TabsList>

          <TabsContent value="discover" className="space-y-6">
            <div className="max-w-md mx-auto">
              <Card className="glass border-slate-700/50 overflow-hidden">
                <CardHeader className="text-center pb-4">
                  <div className="flex items-center justify-between mb-4">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={prevMatch}
                      className="text-slate-400 hover:text-white hover:bg-slate-800"
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </Button>
                    <Badge className="bg-blue-500/20 text-blue-300 border-blue-500/30">
                      <Star className="w-3 h-3 mr-1" />
                      {currentMatch.matchScore}% Match
                    </Badge>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={nextMatch}
                      className="text-slate-400 hover:text-white hover:bg-slate-800"
                    >
                      <ChevronRight className="w-5 h-5" />
                    </Button>
                  </div>
                  
                  <Avatar className="w-24 h-24 mx-auto mb-4">
                    <AvatarImage src={currentMatch.avatar} />
                    <AvatarFallback className="bg-gradient-to-r from-emerald-500 to-emerald-600 text-white text-2xl">
                      {currentMatch.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  
                  <CardTitle className="text-white text-xl">{currentMatch.name}</CardTitle>
                  <CardDescription className="text-slate-400">
                    <div className="flex items-center justify-center space-x-2 mt-1">
                      <Briefcase className="w-4 h-4" />
                      <span>{currentMatch.title}</span>
                    </div>
                    <div className="flex items-center justify-center space-x-2 mt-1">
                      <Users className="w-4 h-4" />
                      <span>{currentMatch.company}</span>
                    </div>
                    <div className="flex items-center justify-center space-x-2 mt-1">
                      <MapPin className="w-4 h-4" />
                      <span>{currentMatch.location}</span>
                    </div>
                  </CardDescription>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="text-white font-medium mb-2">Bio</h4>
                    <p className="text-slate-300 text-sm leading-relaxed">{currentMatch.bio}</p>
                  </div>
                  
                  <div>
                    <h4 className="text-white font-medium mb-2">Skills</h4>
                    <div className="flex flex-wrap gap-2">
                      {currentMatch.skills.map((skill, index) => (
                        <Badge key={index} variant="secondary" className="bg-blue-500/20 text-blue-300 border-blue-500/30 text-xs">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="text-white font-medium mb-2">Interests</h4>
                    <div className="flex flex-wrap gap-2">
                      {currentMatch.interests.map((interest, index) => (
                        <Badge key={index} variant="secondary" className="bg-emerald-500/20 text-emerald-300 border-emerald-500/30 text-xs">
                          {interest}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  
                  <div className="pt-4 border-t border-slate-700">
                    <div className="flex justify-center space-x-4">
                      <Button
                        onClick={() => handleBump(false)}
                        disabled={isLoading}
                        variant="outline"
                        size="lg"
                        className="border-red-500/30 text-red-400 hover:bg-red-500/10 w-16 h-16 rounded-full"
                      >
                        <X className="w-6 h-6" />
                      </Button>
                      
                      <Button
                        variant="outline"
                        size="lg"
                        className="border-slate-600 text-slate-400 hover:bg-slate-800 hover:text-white w-16 h-16 rounded-full"
                      >
                        <Eye className="w-6 h-6" />
                      </Button>
                      
                      <Button
                        onClick={() => handleBump(true)}
                        disabled={isLoading}
                        size="lg"
                        className="bg-blue-600 hover:bg-blue-700 text-white w-16 h-16 rounded-full"
                      >
                        <Heart className="w-6 h-6" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <div className="text-center mt-4">
                <p className="text-slate-500 text-sm">
                  {currentMatchIndex + 1} of {potentialMatches.length} matches • 
                  <span className="text-blue-400 ml-1">
                    {potentialMatches.length - currentMatchIndex - 1} more to discover
                  </span>
                </p>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="matches" className="space-y-6">
            <Card className="glass border-slate-700/50">
              <CardHeader>
                <CardTitle className="text-white">Your Matches</CardTitle>
                <CardDescription className="text-slate-400">
                  Professionals you've connected with through mutual interest
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {myMatches.map((match) => (
                    <div key={match.id} className="flex items-center justify-between p-4 bg-slate-800/30 rounded-lg border border-slate-700/30">
                      <div className="flex items-center space-x-3">
                        <Avatar>
                          <AvatarFallback className="bg-gradient-to-r from-emerald-500 to-emerald-600 text-white">
                            {match.name.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="text-white font-medium">{match.name}</p>
                          <p className="text-slate-400 text-sm">{match.title} at {match.company}</p>
                          <p className="text-slate-500 text-xs">Matched at {match.event}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge variant={match.mutual ? "default" : "secondary"} className={match.mutual ? "bg-blue-500/20 text-blue-300 border-blue-500/30" : "bg-slate-600/20 text-slate-400 border-slate-600/30"}>
                          {match.mutual ? 'Connected' : 'Pending'}
                        </Badge>
                        <Button size="sm" variant="outline" className="border-slate-600 text-slate-300 hover:bg-slate-800 hover:text-white">
                          Message
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
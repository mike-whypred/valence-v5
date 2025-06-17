'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Network, ArrowLeft, Calendar, MapPin, Users, Clock, Key, Check } from 'lucide-react';
import Link from 'next/link';

export default function JoinEventPage() {
  const [eventCode, setEventCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [eventFound, setEventFound] = useState(false);
  const [eventDetails, setEventDetails] = useState({
    name: '',
    description: '',
    date: '',
    location: '',
    attendees: 0,
    organizer: ''
  });

  const handleCodeSearch = async () => {
    if (!eventCode.trim()) return;
    
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setEventFound(true);
      setEventDetails({
        name: 'Tech Leadership Summit 2025',
        description: 'Connect with industry leaders and innovative minds shaping the future of technology. Network with CTOs, VPs of Engineering, and senior technical leaders.',
        date: 'February 15, 2025 - 6:00 PM',
        location: 'San Francisco Convention Center',
        attendees: 118,
        organizer: 'TechLeaders Network'
      });
      setIsLoading(false);
    }, 1500);
  };

  const handleJoinEvent = async () => {
    setIsLoading(true);
    // Simulate joining event
    setTimeout(() => {
      setIsLoading(false);
      // Redirect to dashboard
      window.location.href = '/dashboard';
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-4">
      {/* Navigation */}
      <nav className="p-6 flex justify-between items-center">
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

      <div className="container mx-auto max-w-2xl">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-4">Join an Event</h1>
          <p className="text-slate-400 text-lg">Enter your event access code to join the networking experience</p>
        </div>

        <Card className="glass border-slate-700/50 mb-6">
          <CardHeader>
            <CardTitle className="text-white flex items-center">
              <Key className="w-5 h-5 mr-2" />
              Event Access Code
            </CardTitle>
            <CardDescription className="text-slate-400">
              Get your unique access code from the event organizer
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex space-x-2">
              <div className="flex-1">
                <Label htmlFor="eventCode" className="text-white sr-only">Event Code</Label>
                <Input
                  id="eventCode"
                  value={eventCode}
                  onChange={(e) => setEventCode(e.target.value.toUpperCase())}
                  placeholder="Enter event code (e.g., TECH2025)"
                  className="bg-slate-800/50 border-slate-600 text-white placeholder:text-slate-500 text-center font-mono text-lg tracking-wider"
                  maxLength={12}
                />
              </div>
              <Button
                onClick={handleCodeSearch}
                disabled={!eventCode.trim() || isLoading}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6"
              >
                {isLoading ? 'Searching...' : 'Find Event'}
              </Button>
            </div>
          </CardContent>
        </Card>

        {eventFound && (
          <Card className="glass border-slate-700/50 animate-in slide-in-from-bottom-4">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-white text-xl">{eventDetails.name}</CardTitle>
                <Badge className="bg-emerald-500/20 text-emerald-300 border-emerald-500/30">
                  <Check className="w-3 h-3 mr-1" />
                  Event Found
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <p className="text-slate-300 leading-relaxed">{eventDetails.description}</p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center space-x-3 p-3 bg-slate-800/30 rounded-lg border border-slate-700/30">
                  <Calendar className="w-5 h-5 text-blue-400" />
                  <div>
                    <p className="text-white font-medium">Date & Time</p>
                    <p className="text-slate-400 text-sm">{eventDetails.date}</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3 p-3 bg-slate-800/30 rounded-lg border border-slate-700/30">
                  <MapPin className="w-5 h-5 text-emerald-400" />
                  <div>
                    <p className="text-white font-medium">Location</p>
                    <p className="text-slate-400 text-sm">{eventDetails.location}</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3 p-3 bg-slate-800/30 rounded-lg border border-slate-700/30">
                  <Users className="w-5 h-5 text-violet-400" />
                  <div>
                    <p className="text-white font-medium">Attendees</p>
                    <p className="text-slate-400 text-sm">{eventDetails.attendees} registered</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3 p-3 bg-slate-800/30 rounded-lg border border-slate-700/30">
                  <Network className="w-5 h-5 text-blue-400" />
                  <div>
                    <p className="text-white font-medium">Organizer</p>
                    <p className="text-slate-400 text-sm">{eventDetails.organizer}</p>
                  </div>
                </div>
              </div>
              
              <div className="pt-4 border-t border-slate-700">
                <Button
                  onClick={handleJoinEvent}
                  disabled={isLoading}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 text-lg"
                >
                  {isLoading ? 'Joining Event...' : 'Join This Event'}
                </Button>
                <p className="text-slate-500 text-sm text-center mt-2">
                  You'll be able to discover and connect with other attendees once you join
                </p>
              </div>
            </CardContent>
          </Card>
        )}

        {!eventFound && (
          <Card className="glass border-slate-700/50">
            <CardContent className="text-center py-12">
              <Key className="w-16 h-16 text-slate-500 mx-auto mb-4" />
              <h3 className="text-white text-lg font-medium mb-2">Enter your event code above</h3>
              <p className="text-slate-500">
                Don't have a code? Contact your event organizer or check your invitation email.
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
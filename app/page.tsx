'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Users, Zap, Calendar, Network, ArrowRight, Sparkles, Brain, Shield, UserX, Mail, MessageCircle, Bot, Search, DollarSign, Heart, VolumeX, Clock, TrendingUp, Settings } from 'lucide-react';
import Link from 'next/link';

export default function LandingPage() {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-6 h-16 flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-foreground rounded-lg flex items-center justify-center">
              <Network className="w-4 h-4 text-background" />
            </div>
            <span className="text-xl font-semibold">Valence</span>
          </div>
          <div className="flex items-center space-x-3">
            <Link href="/auth/login">
              <Button variant="ghost" size="sm">
                Sign In
              </Button>
            </Link>
            <Link href="/auth/signup">
              <Button size="sm">
                Get Started
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="hero-gradient relative">
        <div className="container mx-auto px-6 py-24 text-center">

        
        <h1 className="text-4xl md:text-6xl font-bold mb-6 tracking-tight text-balance">
          Connect with
          <span className="block mt-2 text-purple">Intelligence</span>
        </h1>
        
        <p className="text-lg text-muted-foreground mb-12 max-w-2xl mx-auto leading-relaxed text-balance">
          Transform how you network at professional events. Our AI analyzes compatibility and interests 
          to create meaningful connections that advance your career.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-3 justify-center items-center mb-20">
          <Link href="/auth/signup">
            <Button 
              size="lg" 
              className="px-8"
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
            >
              Start Networking
              <ArrowRight className={`ml-2 w-4 h-4 transition-transform ${isHovered ? 'translate-x-1' : ''}`} />
            </Button>
          </Link>
          <Button size="lg" variant="outline" className="px-8">
            Learn More
          </Button>
        </div>

        {/* Scrolling Banner */}
        <div className="scroll-banner py-12 mb-12 bg-muted/20">
          <div className="scroll-text text-muted-foreground text-lg font-medium items-center">
            <span className="mr-6">"Too many irrelevant connections"</span>
            <UserX className="w-4 h-4 mx-6 text-muted-foreground/50" />
            <span className="mr-6">"Endless spam messages"</span>
            <Mail className="w-4 h-4 mx-6 text-muted-foreground/50" />
            <span className="mr-6">"Superficial interactions"</span>
            <MessageCircle className="w-4 h-4 mx-6 text-muted-foreground/50" />
            <span className="mr-6">"Algorithm-driven feeds miss real opportunities"</span>
            <Bot className="w-4 h-4 mx-6 text-muted-foreground/50" />
            <span className="mr-6">"Hard to find quality people in your field"</span>
            <Search className="w-4 h-4 mx-6 text-muted-foreground/50" />
            <span className="mr-6">"Networking feels forced and transactional"</span>
            <DollarSign className="w-4 h-4 mx-6 text-muted-foreground/50" />
            <span className="mr-6">"Difficult to build meaningful relationships"</span>
            <Heart className="w-4 h-4 mx-6 text-muted-foreground/50" />
            <span className="mr-6">"Too much noise, not enough signal"</span>
            <VolumeX className="w-4 h-4 mx-6 text-muted-foreground/50" />
            <span className="mr-6">"Generic connection requests waste time"</span>
            <Clock className="w-4 h-4 mx-6 text-muted-foreground/50" />
            <span className="mr-6">"Platform prioritizes engagement over value"</span>
            <TrendingUp className="w-4 h-4 mx-6 text-muted-foreground/50" />
            <span className="mr-6">"Real conversations get lost in the crowd"</span>
            <Users className="w-4 h-4 mx-6 text-muted-foreground/50" />
            <span className="mr-6">"One-size-fits-all approach doesn't work"</span>
            <Settings className="w-4 h-4 mx-6 text-muted-foreground/50" />
            
            {/* Duplicate content for seamless loop */}
            <span className="mr-6">"Too many irrelevant connections"</span>
            <UserX className="w-4 h-4 mx-6 text-muted-foreground/50" />
            <span className="mr-6">"Endless spam messages"</span>
            <Mail className="w-4 h-4 mx-6 text-muted-foreground/50" />
            <span className="mr-6">"Superficial interactions"</span>
            <MessageCircle className="w-4 h-4 mx-6 text-muted-foreground/50" />
            <span className="mr-6">"Algorithm-driven feeds miss real opportunities"</span>
            <Bot className="w-4 h-4 mx-6 text-muted-foreground/50" />
            <span className="mr-6">"Hard to find quality people in your field"</span>
            <Search className="w-4 h-4 mx-6 text-muted-foreground/50" />
            <span className="mr-6">"Networking feels forced and transactional"</span>
            <DollarSign className="w-4 h-4 mx-6 text-muted-foreground/50" />
            <span className="mr-6">"Difficult to build meaningful relationships"</span>
            <Heart className="w-4 h-4 mx-6 text-muted-foreground/50" />
            <span className="mr-6">"Too much noise, not enough signal"</span>
            <VolumeX className="w-4 h-4 mx-6 text-muted-foreground/50" />
            <span className="mr-6">"Generic connection requests waste time"</span>
            <Clock className="w-4 h-4 mx-6 text-muted-foreground/50" />
            <span className="mr-6">"Platform prioritizes engagement over value"</span>
            <TrendingUp className="w-4 h-4 mx-6 text-muted-foreground/50" />
            <span className="mr-6">"Real conversations get lost in the crowd"</span>
            <Users className="w-4 h-4 mx-6 text-muted-foreground/50" />
            <span className="mr-6">"One-size-fits-all approach doesn't work"</span>
            <Settings className="w-4 h-4 mx-6 text-muted-foreground/50" />
          </div>
        </div>

        {/* Feature Cards */}
        <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          <Card className="hover-lift text-left">
            <CardHeader className="pb-4">
              <div className="feature-icon-purple mb-4">
                <Brain className="w-5 h-5" />
              </div>
              <CardTitle className="text-lg">Intelligent Matching</CardTitle>
              <CardDescription className="text-sm leading-relaxed">
                Advanced AI algorithms analyze professional profiles, interests, and goals to identify the most valuable connections for your career growth.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="hover-lift text-left">
            <CardHeader className="pb-4">
              <div className="feature-icon-blue mb-4">
                <Calendar className="w-5 h-5" />
              </div>
              <CardTitle className="text-lg">Exclusive Events</CardTitle>
              <CardDescription className="text-sm leading-relaxed">
                Join curated networking events with secure access codes. Connect with industry leaders and like-minded professionals in your field.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="hover-lift text-left">
            <CardHeader className="pb-4">
              <div className="feature-icon mb-4">
                <Shield className="w-5 h-5" />
              </div>
              <CardTitle className="text-lg">Quality Connections</CardTitle>
              <CardDescription className="text-sm leading-relaxed">
                Our mutual interest system ensures every connection is meaningful. Build relationships with professionals who share your vision and goals.
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="border-t section-gradient dots-pattern relative">
        <div className="container mx-auto px-6 py-24">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">How it works</h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Three simple steps to transform your professional networking experience
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-12 max-w-4xl mx-auto">
            <div className="text-center">
              <div className="step-number-purple mx-auto mb-6">1</div>
              <h3 className="text-lg font-semibold mb-3">Create Your Profile</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Build a comprehensive professional profile highlighting your expertise, goals, and interests. Our AI creates an intelligent summary for optimal matching.
              </p>
            </div>

            <div className="text-center">
              <div className="step-number-blue mx-auto mb-6">2</div>
              <h3 className="text-lg font-semibold mb-3">Join Events</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Enter exclusive networking events using secure access codes. Connect with carefully curated groups of professionals in your industry.
              </p>
            </div>

            <div className="text-center">
              <div className="step-number mx-auto mb-6">3</div>
              <h3 className="text-lg font-semibold mb-3">Make Connections</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Discover AI-matched professionals and express mutual interest. Build meaningful relationships that advance your career and expand your network.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t">
        <div className="container mx-auto px-6 py-12">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-3 mb-4 md:mb-0">
              <div className="w-6 h-6 bg-foreground rounded flex items-center justify-center">
                <Network className="w-3 h-3 text-background" />
              </div>
              <span className="font-semibold">Valence</span>
            </div>
            <p className="text-sm text-muted-foreground">
              &copy; 2025 Valence. Intelligent networking for professionals.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
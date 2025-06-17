'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { User, Upload, Plus, X, AlertCircle } from 'lucide-react';
import { getCurrentUser, createProfile, generateAvatar } from '@/lib/supabase';
import { useRouter } from 'next/navigation';

export default function ProfileSetup() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [user, setUser] = useState<any>(null);
  const [profileImage, setProfileImage] = useState('');
  const [skills, setSkills] = useState<string[]>([]);
  const [currentSkill, setCurrentSkill] = useState('');
  const [formData, setFormData] = useState({
    jobTitle: '',
    company: '',
    industry: '',
    experienceYears: '',
    bio: '',
    networkingGoals: '',
    location: ''
  });
  const router = useRouter();

  useEffect(() => {
    checkUser();
  }, []);

  const checkUser = async () => {
    const { user, error } = await getCurrentUser();
    if (error || !user) {
      router.push('/auth/login');
      return;
    }
    setUser(user);
    
    // Generate avatar if no profile image
    if (!profileImage) {
      const avatarUrl = generateAvatar(`${user.user_metadata?.first_name || 'user'}-${user.id}`);
      setProfileImage(avatarUrl);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const addSkill = () => {
    if (currentSkill.trim() && !skills.includes(currentSkill.trim())) {
      setSkills([...skills, currentSkill.trim()]);
      setCurrentSkill('');
    }
  };

  const removeSkill = (skillToRemove: string) => {
    setSkills(skills.filter(skill => skill !== skillToRemove));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    if (!user) {
      setError('User not authenticated');
      setIsLoading(false);
      return;
    }

    try {
      const profileData = {
        user_id: user.id,
        job_title: formData.jobTitle,
        company: formData.company,
        industry: formData.industry,
        experience_years: parseInt(formData.experienceYears),
        bio: formData.bio,
        skills: skills,
        networking_goals: formData.networkingGoals,
        profile_image_url: profileImage,
        location: formData.location,
        avatar_style: 'avataaars' // Default avatar style
      };

      const { data, error } = await createProfile(profileData);
      
      if (error) {
        setError(error.message);
        setIsLoading(false);
        return;
      }

      // Generate AI summary for the profile (will be implemented next)
      await generateProfileSummary(data.id, profileData);
      
      router.push('/dashboard');
    } catch (err) {
      setError('An unexpected error occurred');
      setIsLoading(false);
    }
  };

  const generateProfileSummary = async (profileId: string, profileData: any) => {
    try {
      await fetch('/api/generate-profile-summary', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          profileId,
          profileData
        }),
      });
    } catch (error) {
      console.error('Failed to generate profile summary:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-4">
      <div className="container mx-auto max-w-2xl py-8">
        <Card className="glass border-slate-700/50">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl text-white">Complete Your Profile</CardTitle>
            <CardDescription className="text-slate-400">
              Build your professional profile for intelligent networking matches
            </CardDescription>
          </CardHeader>
          <CardContent>
            {error && (
              <Alert className="border-red-500/20 bg-red-500/10 mb-6">
                <AlertCircle className="h-4 w-4 text-red-500" />
                <AlertDescription className="text-red-500">{error}</AlertDescription>
              </Alert>
            )}
            
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Profile Picture Section */}
              <div className="space-y-4">
                <Label className="text-white">Profile Picture</Label>
                <div className="flex items-center space-x-4">
                  <Avatar className="w-20 h-20">
                    <AvatarImage src={profileImage} />
                    <AvatarFallback className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
                      <User className="w-8 h-8" />
                    </AvatarFallback>
                  </Avatar>
                  <Button
                    type="button"
                    variant="outline"
                    className="border-slate-600 text-slate-300 hover:bg-slate-800 hover:text-white"
                  >
                    <Upload className="w-4 h-4 mr-2" />
                    Upload Photo
                  </Button>
                </div>
                <p className="text-sm text-slate-500">
                  Upload a professional photo or we'll generate a unique avatar for you
                </p>
              </div>

              {/* Basic Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="jobTitle" className="text-white">Job Title</Label>
                  <Input
                    id="jobTitle"
                    placeholder="e.g., Software Engineer"
                    value={formData.jobTitle}
                    onChange={(e) => handleInputChange('jobTitle', e.target.value)}
                    className="bg-slate-800/50 border-slate-600 text-white placeholder:text-slate-500"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="company" className="text-white">Company</Label>
                  <Input
                    id="company"
                    placeholder="e.g., Tech Corp"
                    value={formData.company}
                    onChange={(e) => handleInputChange('company', e.target.value)}
                    className="bg-slate-800/50 border-slate-600 text-white placeholder:text-slate-500"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="industry" className="text-white">Industry</Label>
                  <Input
                    id="industry"
                    placeholder="e.g., Technology"
                    value={formData.industry}
                    onChange={(e) => handleInputChange('industry', e.target.value)}
                    className="bg-slate-800/50 border-slate-600 text-white placeholder:text-slate-500"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="experience" className="text-white">Years of Experience</Label>
                  <Input
                    id="experience"
                    type="number"
                    placeholder="e.g., 5"
                    value={formData.experienceYears}
                    onChange={(e) => handleInputChange('experienceYears', e.target.value)}
                    className="bg-slate-800/50 border-slate-600 text-white placeholder:text-slate-500"
                    required
                  />
                </div>
              </div>

              {/* Bio */}
              <div className="space-y-2">
                <Label htmlFor="bio" className="text-white">Professional Bio</Label>
                <Textarea
                  id="bio"
                  placeholder="Tell us about your professional background, interests, and what you're looking to achieve through networking..."
                  value={formData.bio}
                  onChange={(e) => handleInputChange('bio', e.target.value)}
                  className="bg-slate-800/50 border-slate-600 text-white placeholder:text-slate-500 min-h-[120px]"
                  required
                />
              </div>

              {/* Skills */}
              <div className="space-y-4">
                <Label className="text-white">Skills & Expertise</Label>
                <div className="flex space-x-2">
                  <Input
                    value={currentSkill}
                    onChange={(e) => setCurrentSkill(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addSkill())}
                    placeholder="Add a skill..."
                    className="bg-slate-800/50 border-slate-600 text-white placeholder:text-slate-500"
                  />
                  <Button
                    type="button"
                    onClick={addSkill}
                    variant="outline"
                    className="border-slate-600 text-slate-300 hover:bg-slate-800 hover:text-white"
                  >
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {skills.map((skill, index) => (
                    <Badge
                      key={index}
                      variant="secondary"
                      className="bg-blue-500/20 text-blue-300 border-blue-500/30 pr-1"
                    >
                      {skill}
                      <button
                        type="button"
                        onClick={() => removeSkill(skill)}
                        className="ml-1 hover:bg-blue-500/30 rounded-full p-0.5"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Networking Goals */}
              <div className="space-y-2">
                <Label htmlFor="goals" className="text-white">Networking Goals</Label>
                <Textarea
                  id="goals"
                  placeholder="What are you hoping to achieve through networking? (e.g., finding mentors, business partnerships, career opportunities...)"
                  value={formData.networkingGoals}
                  onChange={(e) => handleInputChange('networkingGoals', e.target.value)}
                  className="bg-slate-800/50 border-slate-600 text-white placeholder:text-slate-500"
                />
              </div>

              <Button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                disabled={isLoading}
              >
                {isLoading ? 'Creating Profile...' : 'Complete Profile'}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
'use client';

import { useState, KeyboardEvent, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Network, User, Briefcase, Target, FileText, Code, Calendar, X, Plus, Upload, Camera, Linkedin, Shuffle, Sparkles } from 'lucide-react';
import { createProfile, generateAvatar } from '@/lib/supabase';
import { createProfileSimple } from '@/lib/supabase-simple';
import { useRouter } from 'next/navigation';

interface ProfileSetupFormProps {
  user: any;
  onComplete: (profile: any) => void;
}

export function ProfileSetupForm({ user, onComplete }: ProfileSetupFormProps) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const [formData, setFormData] = useState({
    fullName: `${user?.user_metadata?.first_name || ''} ${user?.user_metadata?.last_name || ''}`.trim(),
    jobTitle: '',
    company: '',
    networkingGoal: '',
    bio: '',
    interests: [] as string[],
    experienceYears: 0,
    industry: '',
    location: ''
  });

  const [currentInterest, setCurrentInterest] = useState('');
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string>('');
  const [avatarSeed, setAvatarSeed] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const networkingGoals = [
    'Networking',
    'Job Seeking', 
    'Looking for Mentor',
    'Want to Mentor',
    'Business Opportunities'
  ];

  const industries = [
    'Aerospace & Defense',
    'Agriculture & Food Production',
    'Automotive',
    'Banking & Financial Services',
    'Biotechnology & Life Sciences',
    'Chemical & Materials',
    'Construction & Real Estate',
    'Consumer Goods & Retail',
    'Education & Training',
    'Energy & Utilities',
    'Entertainment & Media',
    'Fashion & Apparel',
    'Government & Public Sector',
    'Healthcare & Medical Devices',
    'Hospitality & Tourism',
    'Information Technology',
    'Insurance',
    'Legal Services',
    'Logistics & Transportation',
    'Management Consulting',
    'Manufacturing & Industrial',
    'Mining & Natural Resources',
    'Non-profit & NGO',
    'Pharmaceuticals',
    'Professional Services',
    'Renewable Energy',
    'Sports & Recreation',
    'Telecommunications',
    'Travel & Aviation',
    'Venture Capital & Private Equity'
  ];

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const addInterest = () => {
    if (currentInterest.trim() && !formData.interests.includes(currentInterest.trim())) {
      setFormData(prev => ({
        ...prev,
        interests: [...prev.interests, currentInterest.trim()]
      }));
      setCurrentInterest('');
    }
  };

  const removeInterest = (interest: string) => {
    setFormData(prev => ({
      ...prev,
      interests: prev.interests.filter(i => i !== interest)
    }));
  };

  const handleInterestKeyPress = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addInterest();
    }
  };

  const handleAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setAvatarFile(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setAvatarPreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const triggerFileUpload = () => {
    fileInputRef.current?.click();
  };

  const removeAvatar = () => {
    setAvatarFile(null);
    setAvatarPreview('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const generateRandomAvatar = () => {
    // Generate random seed for variety
    const randomSeed = Math.random().toString(36).substring(7);
    
    // Clear any uploaded file and set the new avatar seed
    setAvatarFile(null);
    setAvatarPreview('');
    setAvatarSeed(randomSeed);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      let avatarUrl = '';
      
      // If user uploaded a custom avatar, we'll use that
      // For now, we'll just use the preview (in production, you'd upload to Supabase Storage)
      if (avatarPreview) {
        avatarUrl = avatarPreview;
      } else {
        // Generate dicebear avatar as fallback
        avatarUrl = generateAvatar(formData.fullName || user.email);
      }
      
      // Create profile
      const profileData = {
        user_id: user.id,
        job_title: formData.jobTitle,
        company: formData.company,
        industry: formData.industry,
        experience_years: formData.experienceYears,
        bio: formData.bio,
        skills: formData.interests,
        networking_goals: formData.networkingGoal,
        profile_image_url: avatarUrl,
        location: formData.location
      };

      // Use simplified version for debugging
      const { data, error } = await createProfileSimple(profileData);
      
      if (error) {
        console.error('Error creating profile:', error);
        return;
      }

      // Call the completion callback
      onComplete(data);
      
      // Small delay to allow state updates, then redirect to dashboard
      setTimeout(() => {
        router.push('/dashboard');
      }, 100);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-foreground rounded-xl flex items-center justify-center mx-auto mb-4">
            <Network className="w-8 h-8 text-background" />
          </div>
          <h1 className="text-3xl font-bold mb-2">Complete Your Profile</h1>
          <p className="text-muted-foreground">
            Help us create the perfect networking experience for you
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <User className="w-5 h-5 mr-2" />
              Professional Information
            </CardTitle>
            <CardDescription>
              Tell us about your professional background and goals
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Avatar Section */}
              <div className="flex flex-col items-center space-y-6 pb-8 border-b border-border/50">
                <div className="text-center space-y-2">
                  <h3 className="text-lg font-semibold flex items-center justify-center gap-2">
                    <Camera className="w-5 h-5" />
                    Profile Avatar
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Choose a professional photo or generate an avatar
                  </p>
                </div>
                
                <div className="relative group">
                  <Avatar className="w-32 h-32 border-4 border-border/20 shadow-lg transition-all duration-200 group-hover:shadow-xl">
                    <AvatarImage 
                      src={avatarPreview || generateAvatar(avatarSeed || formData.fullName || user?.email || 'user')} 
                      className="object-cover"
                    />
                    <AvatarFallback className="text-2xl font-semibold bg-gradient-to-br from-blue-500 to-purple-600 text-white">
                      {formData.fullName?.split(' ').map(n => n[0]).join('') || 'U'}
                    </AvatarFallback>
                  </Avatar>
                  {avatarPreview && (
                    <button
                      type="button"
                      onClick={removeAvatar}
                      className="absolute -top-2 -right-2 w-8 h-8 bg-destructive rounded-full flex items-center justify-center text-destructive-foreground hover:bg-destructive/80 shadow-lg transition-all duration-200 hover:scale-110"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>
                
                <div className="flex flex-wrap gap-3 justify-center">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={triggerFileUpload}
                    className="hover:bg-blue-50 hover:border-blue-200 transition-colors"
                  >
                    <Upload className="w-4 h-4 mr-2" />
                    Upload Photo
                  </Button>
                  
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={generateRandomAvatar}
                    className="hover:bg-purple-50 hover:border-purple-200 transition-colors"
                  >
                    <Shuffle className="w-4 h-4 mr-2" />
                    New Avatar
                  </Button>
                </div>
                
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleAvatarUpload}
                  className="hidden"
                />
              </div>
              {/* Basic Information */}
              <div className="space-y-6">
                <div className="space-y-3">
                  <h3 className="text-lg font-semibold flex items-center gap-2">
                    <User className="w-5 h-5" />
                    Basic Information
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="fullName" className="text-sm font-medium">Full Name *</Label>
                      <Input
                        id="fullName"
                        value={formData.fullName}
                        onChange={(e) => handleInputChange('fullName', e.target.value)}
                        placeholder="John Doe"
                        className="h-11"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="jobTitle" className="text-sm font-medium">Professional Title *</Label>
                      <Input
                        id="jobTitle"
                        value={formData.jobTitle}
                        onChange={(e) => handleInputChange('jobTitle', e.target.value)}
                        placeholder="Software Engineer"
                        className="h-11"
                        required
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Professional Details */}
              <div className="space-y-6 pt-6 border-t border-border/50">
                <div className="space-y-3">
                  <h3 className="text-lg font-semibold flex items-center gap-2">
                    <Briefcase className="w-5 h-5" />
                    Professional Details
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="company" className="text-sm font-medium">Company *</Label>
                      <Input
                        id="company"
                        value={formData.company}
                        onChange={(e) => handleInputChange('company', e.target.value)}
                        placeholder="Tech Corp"
                        className="h-11"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="industry" className="text-sm font-medium">Industry *</Label>
                      <Select onValueChange={(value) => handleInputChange('industry', value)}>
                        <SelectTrigger className="h-11">
                          <SelectValue placeholder="Select industry" />
                        </SelectTrigger>
                        <SelectContent>
                          {industries.map((industry) => (
                            <SelectItem key={industry} value={industry}>
                              {industry}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="location" className="text-sm font-medium">Location</Label>
                    <Input
                      id="location"
                      value={formData.location}
                      onChange={(e) => handleInputChange('location', e.target.value)}
                      placeholder="Sydney, NSW"
                      className="h-11"
                    />
                  </div>
                </div>
              </div>

              {/* Networking Goals & Bio */}
              <div className="space-y-6 pt-6 border-t border-border/50">
                <div className="space-y-3">
                  <h3 className="text-lg font-semibold flex items-center gap-2">
                    <Target className="w-5 h-5" />
                    Networking Goals & Bio
                  </h3>
                  
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label className="text-sm font-medium">What brings you to networking events? *</Label>
                      <Select onValueChange={(value) => handleInputChange('networkingGoal', value)}>
                        <SelectTrigger className="h-11">
                          <SelectValue placeholder="Select your primary goal" />
                        </SelectTrigger>
                        <SelectContent>
                          {networkingGoals.map((goal) => (
                            <SelectItem key={goal} value={goal}>
                              {goal}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="bio" className="text-sm font-medium">Professional Bio *</Label>
                      <Textarea
                        id="bio"
                        value={formData.bio}
                        onChange={(e) => handleInputChange('bio', e.target.value)}
                        placeholder="Write about your professional background, achievements, and goals..."
                        className="min-h-[120px] resize-none"
                        required
                      />
                      <p className="text-xs text-muted-foreground flex items-center gap-1">
                        <Sparkles className="w-3 h-3" />
                        This will help our AI match you with relevant professionals
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Professional Interests & Skills */}
              <div className="space-y-6 pt-6 border-t border-border/50">
                <div className="space-y-3">
                  <h3 className="text-lg font-semibold flex items-center gap-2">
                    <Code className="w-5 h-5" />
                    Professional Interests & Skills
                  </h3>
                  
                  <div className="space-y-4">
                    <div className="flex gap-2">
                      <Input
                        value={currentInterest}
                        onChange={(e) => setCurrentInterest(e.target.value)}
                        onKeyPress={handleInterestKeyPress}
                        placeholder="Add a skill or interest (e.g., Machine Learning, Product Strategy)"
                        className="flex-1 h-11"
                      />
                      <Button 
                        type="button" 
                        onClick={addInterest}
                        size="sm"
                        disabled={!currentInterest.trim()}
                        className="h-11 px-4"
                      >
                        <Plus className="w-4 h-4" />
                      </Button>
                    </div>
                    
                    {formData.interests.length > 0 && (
                      <div className="min-h-[80px] p-4 bg-muted/20 rounded-lg border border-border/50">
                        <div className="flex flex-wrap gap-2">
                          {formData.interests.map((interest, index) => (
                            <Badge
                              key={index}
                              variant="secondary"
                              className="cursor-pointer hover:bg-destructive/80 transition-colors px-3 py-1 text-sm"
                              onClick={() => removeInterest(interest)}
                            >
                              {interest}
                              <X className="w-3 h-3 ml-2" />
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    <p className="text-xs text-muted-foreground flex items-center gap-1">
                      <Target className="w-3 h-3" />
                      Add your areas of expertise, skills, and professional interests. Press Enter or click + to add each one.
                    </p>
                  </div>
                </div>
              </div>

              {/* Experience */}
              <div className="space-y-6 pt-6 border-t border-border/50">
                <div className="space-y-3">
                  <h3 className="text-lg font-semibold flex items-center gap-2">
                    <Calendar className="w-5 h-5" />
                    Professional Experience
                  </h3>
                  
                  <div className="space-y-4">
                    <Label className="text-sm font-medium">Years of Professional Experience</Label>
                    <div className="px-4 py-4 bg-muted/20 rounded-lg border border-border/50">
                      <Slider
                        value={[formData.experienceYears]}
                        onValueChange={(value) => handleInputChange('experienceYears', value[0])}
                        max={40}
                        step={1}
                        className="w-full"
                      />
                      <div className="flex justify-between text-sm text-muted-foreground mt-3">
                        <span>0 years</span>
                        <span className="font-semibold text-lg text-foreground">{formData.experienceYears} years</span>
                        <span>40+ years</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* LinkedIn Import */}
              <div className="pt-6 border-t border-border/50">
                <div className="flex items-center justify-center">
                  <Button
                    type="button"
                    variant="outline"
                    disabled
                    className="opacity-50 cursor-not-allowed"
                  >
                    <Linkedin className="w-4 h-4 mr-2" />
                    Import Profile from LinkedIn
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground text-center mt-2">
                  LinkedIn integration coming soon
                </p>
              </div>

              <Button
                type="submit"
                className="w-full h-12 text-base font-semibold"
                disabled={loading || !formData.jobTitle || !formData.company || !formData.bio || !formData.networkingGoal || !formData.industry}
              >
                {loading ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-background border-t-transparent rounded-full animate-spin"></div>
                    Creating Profile...
                  </div>
                ) : (
                  'Complete Profile'
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 
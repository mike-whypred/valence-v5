'use client';

import { useState, useEffect } from 'react';
import { getCurrentUser, getProfile } from '@/lib/supabase';
import { DashboardLayout } from '@/components/dashboard/layout';
import { ProfileSetupForm } from '@/components/dashboard/profile-setup';
import { DashboardOverview } from '@/components/dashboard/overview';

export default function Dashboard() {
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [needsProfileSetup, setNeedsProfileSetup] = useState(false);

  useEffect(() => {
    const checkUserAndProfile = async () => {
      try {
        const { user: currentUser } = await getCurrentUser();
        if (currentUser) {
          setUser(currentUser);
          
          // Check if user has completed profile setup
          const { data: profileData } = await getProfile(currentUser.id);
          if (profileData) {
            setProfile(profileData);
            setNeedsProfileSetup(false);
          } else {
            setNeedsProfileSetup(true);
          }
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      } finally {
        setLoading(false);
      }
    };

    checkUserAndProfile();
  }, []);

  const handleProfileComplete = (profileData: any) => {
    setProfile(profileData);
    setNeedsProfileSetup(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-foreground border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Access Denied</h1>
          <p className="text-muted-foreground mb-4">Please sign in to access the dashboard.</p>
          <a href="/auth/login" className="text-foreground hover:underline">
            Sign In
          </a>
        </div>
      </div>
    );
  }

  if (needsProfileSetup) {
    return (
      <div className="min-h-screen bg-background">
        <ProfileSetupForm user={user} onComplete={handleProfileComplete} />
      </div>
    );
  }

  return (
    <DashboardLayout user={user} profile={profile}>
      <DashboardOverview user={user} profile={profile} />
    </DashboardLayout>
  );
}
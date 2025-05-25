
import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { toast } from '@/components/ui/use-toast';
import { Header } from '@/components/layout/Header';
import { BottomNav } from '@/components/layout/BottomNav';

export const ProfilePage = () => {
  const { user, profile, updateProfile } = useAuth();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    full_name: '',
    bio: '',
    location: '',
    website: '',
    primary_role: '',
    hourly_rate: '',
    skills: '',
    interests: ''
  });

  useEffect(() => {
    if (profile) {
      setFormData({
        full_name: profile.full_name || '',
        bio: profile.bio || '',
        location: profile.location || '',
        website: profile.website || '',
        primary_role: profile.primary_role || '',
        hourly_rate: profile.hourly_rate?.toString() || '',
        skills: profile.skills || '',
        interests: profile.interests || ''
      });
    }
  }, [profile]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const skillsArray = formData.skills ? formData.skills.split(',').map(s => s.trim()) : [];
      const interestsArray = formData.interests ? formData.interests.split(',').map(s => s.trim()) : [];

      await updateProfile({
        full_name: formData.full_name,
        bio: formData.bio,
        location: formData.location,
        website: formData.website,
        primary_role: formData.primary_role as 'freelancer' | 'client' | 'project_owner' | 'backer',
        hourly_rate: formData.hourly_rate ? Number(formData.hourly_rate) : null,
        skills: skillsArray.length > 0 ? skillsArray.join(',') : null,
        interests: interestsArray.length > 0 ? interestsArray.join(',') : null
      });

      toast({
        title: "Profile Updated",
        description: "Your profile has been successfully updated.",
      });
    } catch (error) {
      console.error('Error updating profile:', error);
      toast({
        title: "Error",
        description: "Failed to update profile. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="container mx-auto px-4 py-6 pb-20">
        <Card>
          <CardHeader>
            <CardTitle>Profile Settings</CardTitle>
            <CardDescription>
              Update your personal information and preferences
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="full_name">Full Name</Label>
                <Input
                  id="full_name"
                  value={formData.full_name}
                  onChange={(e) => setFormData(prev => ({ ...prev, full_name: e.target.value }))}
                  placeholder="Your full name"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="bio">Bio</Label>
                <Textarea
                  id="bio"
                  value={formData.bio}
                  onChange={(e) => setFormData(prev => ({ ...prev, bio: e.target.value }))}
                  placeholder="Tell us about yourself..."
                  rows={4}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="location">Location</Label>
                  <Input
                    id="location"
                    value={formData.location}
                    onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                    placeholder="City, Country"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="website">Website</Label>
                  <Input
                    id="website"
                    value={formData.website}
                    onChange={(e) => setFormData(prev => ({ ...prev, website: e.target.value }))}
                    placeholder="https://yourwebsite.com"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="primary_role">Primary Role</Label>
                  <Select value={formData.primary_role} onValueChange={(value) => setFormData(prev => ({ ...prev, primary_role: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select your primary role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="freelancer">Freelancer</SelectItem>
                      <SelectItem value="client">Client</SelectItem>
                      <SelectItem value="project_owner">Project Owner</SelectItem>
                      <SelectItem value="backer">Backer</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="hourly_rate">Hourly Rate ($)</Label>
                  <Input
                    id="hourly_rate"
                    type="number"
                    value={formData.hourly_rate}
                    onChange={(e) => setFormData(prev => ({ ...prev, hourly_rate: e.target.value }))}
                    placeholder="50"
                    min="0"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="skills">Skills (comma separated)</Label>
                <Input
                  id="skills"
                  value={formData.skills}
                  onChange={(e) => setFormData(prev => ({ ...prev, skills: e.target.value }))}
                  placeholder="React, Node.js, Python, Design..."
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="interests">Interests (comma separated)</Label>
                <Input
                  id="interests"
                  value={formData.interests}
                  onChange={(e) => setFormData(prev => ({ ...prev, interests: e.target.value }))}
                  placeholder="Web Development, AI, Startups..."
                />
              </div>

              <Button 
                type="submit" 
                className="w-full bg-[#00B894] hover:bg-[#00a085]"
                disabled={loading}
              >
                {loading ? 'Updating...' : 'Update Profile'}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>

      <BottomNav />
    </div>
  );
};


import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Edit, MapPin, Globe, Star, DollarSign, Award, X } from 'lucide-react';
import { Header } from '@/components/layout/Header';
import { BottomNav } from '@/components/layout/BottomNav';
import { useForm } from 'react-hook-form';
import { toast } from '@/components/ui/use-toast';

interface ProfileFormData {
  full_name: string;
  bio: string;
  location: string;
  website: string;
  primary_role: string;
  hourly_rate: number;
}

export const ProfilePage = () => {
  const { user, profile, updateProfile } = useAuth();
  const [editing, setEditing] = useState(false);
  const [skills, setSkills] = useState<string[]>(profile?.skills || []);
  const [interests, setInterests] = useState<string[]>(profile?.interests || []);
  const [skillInput, setSkillInput] = useState('');
  const [interestInput, setInterestInput] = useState('');
  const [loading, setLoading] = useState(false);

  const form = useForm<ProfileFormData>({
    defaultValues: {
      full_name: profile?.full_name || '',
      bio: profile?.bio || '',
      location: profile?.location || '',
      website: profile?.website || '',
      primary_role: profile?.primary_role || 'freelancer',
      hourly_rate: profile?.hourly_rate || 0,
    }
  });

  useEffect(() => {
    if (profile) {
      form.reset({
        full_name: profile.full_name || '',
        bio: profile.bio || '',
        location: profile.location || '',
        website: profile.website || '',
        primary_role: profile.primary_role || 'freelancer',
        hourly_rate: profile.hourly_rate || 0,
      });
      setSkills(profile.skills || []);
      setInterests(profile.interests || []);
    }
  }, [profile, form]);

  const addSkill = () => {
    if (skillInput.trim() && !skills.includes(skillInput.trim())) {
      setSkills([...skills, skillInput.trim()]);
      setSkillInput('');
    }
  };

  const removeSkill = (skillToRemove: string) => {
    setSkills(skills.filter(skill => skill !== skillToRemove));
  };

  const addInterest = () => {
    if (interestInput.trim() && !interests.includes(interestInput.trim())) {
      setInterests([...interests, interestInput.trim()]);
      setInterestInput('');
    }
  };

  const removeInterest = (interestToRemove: string) => {
    setInterests(interests.filter(interest => interest !== interestToRemove));
  };

  const onSubmit = async (data: ProfileFormData) => {
    setLoading(true);
    try {
      await updateProfile({
        ...data,
        skills,
        interests,
      });

      toast({
        title: "Success",
        description: "Profile updated successfully!",
      });
      
      setEditing(false);
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

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const formatRole = (role: string) => {
    return role.split('_').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="pt-16 pb-20 px-4">
        <div className="max-w-md mx-auto">
          {/* Profile Header */}
          <Card className="mb-6">
            <CardHeader className="text-center">
              <div className="flex items-center justify-between mb-4">
                <div className="flex-1"></div>
                <Avatar className="h-20 w-20">
                  <AvatarImage src={profile?.avatar_url || ''} />
                  <AvatarFallback className="bg-[#00B894] text-white text-2xl">
                    {profile?.full_name?.charAt(0) || user?.email?.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <Dialog open={editing} onOpenChange={setEditing}>
                  <DialogTrigger asChild>
                    <Button variant="ghost" size="sm" className="p-2">
                      <Edit className="h-4 w-4" />
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="w-[95vw] max-w-md max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                      <DialogTitle>Edit Profile</DialogTitle>
                    </DialogHeader>
                    
                    <Form {...form}>
                      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <FormField
                          control={form.control}
                          name="full_name"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Full Name</FormLabel>
                              <FormControl>
                                <Input {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="bio"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Bio</FormLabel>
                              <FormControl>
                                <Textarea rows={3} {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="location"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Location</FormLabel>
                              <FormControl>
                                <Input placeholder="e.g. San Francisco, CA" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="website"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Website</FormLabel>
                              <FormControl>
                                <Input placeholder="https://yourwebsite.com" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="primary_role"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Primary Role</FormLabel>
                              <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  <SelectItem value="freelancer">Freelancer</SelectItem>
                                  <SelectItem value="client">Client</SelectItem>
                                  <SelectItem value="project_owner">Project Owner</SelectItem>
                                  <SelectItem value="backer">Backer</SelectItem>
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        {form.watch('primary_role') === 'freelancer' && (
                          <FormField
                            control={form.control}
                            name="hourly_rate"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Hourly Rate ($)</FormLabel>
                                <FormControl>
                                  <Input 
                                    type="number" 
                                    {...field}
                                    onChange={(e) => field.onChange(Number(e.target.value))}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        )}

                        {/* Skills */}
                        <div>
                          <FormLabel>Skills</FormLabel>
                          <div className="flex gap-2 mt-1">
                            <Input
                              placeholder="Add a skill"
                              value={skillInput}
                              onChange={(e) => setSkillInput(e.target.value)}
                              onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addSkill())}
                            />
                            <Button type="button" onClick={addSkill} variant="outline">
                              Add
                            </Button>
                          </div>
                          {skills.length > 0 && (
                            <div className="flex flex-wrap gap-2 mt-2">
                              {skills.map((skill) => (
                                <Badge key={skill} variant="secondary" className="flex items-center gap-1">
                                  {skill}
                                  <X 
                                    className="h-3 w-3 cursor-pointer" 
                                    onClick={() => removeSkill(skill)}
                                  />
                                </Badge>
                              ))}
                            </div>
                          )}
                        </div>

                        {/* Interests */}
                        <div>
                          <FormLabel>Interests</FormLabel>
                          <div className="flex gap-2 mt-1">
                            <Input
                              placeholder="Add an interest"
                              value={interestInput}
                              onChange={(e) => setInterestInput(e.target.value)}
                              onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addInterest())}
                            />
                            <Button type="button" onClick={addInterest} variant="outline">
                              Add
                            </Button>
                          </div>
                          {interests.length > 0 && (
                            <div className="flex flex-wrap gap-2 mt-2">
                              {interests.map((interest) => (
                                <Badge key={interest} variant="outline" className="flex items-center gap-1">
                                  {interest}
                                  <X 
                                    className="h-3 w-3 cursor-pointer" 
                                    onClick={() => removeInterest(interest)}
                                  />
                                </Badge>
                              ))}
                            </div>
                          )}
                        </div>

                        <Button 
                          type="submit" 
                          className="w-full bg-[#00B894] hover:bg-[#00A085]"
                          disabled={loading}
                        >
                          {loading ? 'Saving...' : 'Save Changes'}
                        </Button>
                      </form>
                    </Form>
                  </DialogContent>
                </Dialog>
              </div>
              
              <CardTitle className="text-xl mb-1">
                {profile?.full_name || 'User'}
              </CardTitle>
              <CardDescription className="text-sm">
                <Badge variant="secondary" className="mb-2">
                  {formatRole(profile?.primary_role || 'freelancer')}
                </Badge>
              </CardDescription>
              
              {profile?.bio && (
                <p className="text-sm text-gray-600 mt-2">{profile.bio}</p>
              )}
            </CardHeader>
            
            <CardContent>
              <div className="space-y-3">
                {profile?.location && (
                  <div className="flex items-center text-sm text-gray-600">
                    <MapPin className="h-4 w-4 mr-2" />
                    {profile.location}
                  </div>
                )}
                
                {profile?.website && (
                  <div className="flex items-center text-sm text-gray-600">
                    <Globe className="h-4 w-4 mr-2" />
                    <a 
                      href={profile.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#00B894] hover:underline"
                    >
                      {profile.website}
                    </a>
                  </div>
                )}

                {profile?.primary_role === 'freelancer' && profile?.hourly_rate && (
                  <div className="flex items-center text-sm text-gray-600">
                    <DollarSign className="h-4 w-4 mr-2" />
                    ${profile.hourly_rate}/hour
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Stats */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="text-lg">Stats</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <div className="flex items-center justify-center mb-1">
                    <Star className="h-4 w-4 text-yellow-500 mr-1" />
                    <span className="font-semibold">
                      {profile?.rating?.toFixed(1) || '0.0'}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500">Rating</p>
                </div>
                <div>
                  <div className="font-semibold">{profile?.reviews_count || 0}</div>
                  <p className="text-xs text-gray-500">Reviews</p>
                </div>
                <div>
                  <div className="font-semibold">
                    ${profile?.total_earned?.toFixed(0) || '0'}
                  </div>
                  <p className="text-xs text-gray-500">Earned</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Skills */}
          {skills.length > 0 && (
            <Card className="mb-6">
              <CardHeader>
                <CardTitle className="text-lg">Skills</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {skills.map((skill) => (
                    <Badge key={skill} variant="secondary">
                      {skill}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Interests */}
          {interests.length > 0 && (
            <Card className="mb-6">
              <CardHeader>
                <CardTitle className="text-lg">Interests</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {interests.map((interest) => (
                    <Badge key={interest} variant="outline">
                      {interest}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Actions */}
          <Card>
            <CardContent className="pt-6">
              <Button 
                onClick={signOut}
                variant="outline" 
                className="w-full"
              >
                Sign Out
              </Button>
            </CardContent>
          </Card>
        </div>
      </main>

      <BottomNav />
    </div>
  );
};

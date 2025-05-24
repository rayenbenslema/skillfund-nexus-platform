
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Plus, Search, MapPin, Clock, DollarSign } from 'lucide-react';
import { Header } from '@/components/layout/Header';
import { BottomNav } from '@/components/layout/BottomNav';
import { JobPostForm } from '@/components/jobs/JobPostForm';
import { ProposalForm } from '@/components/jobs/ProposalForm';

interface Job {
  id: string;
  title: string;
  description: string;
  category: string;
  budget_min: number;
  budget_max: number;
  deadline: string;
  skills_required: string[];
  proposals_count: number;
  created_at: string;
  client: {
    full_name: string;
    location: string;
    rating: number;
  };
}

export const JobsPage = () => {
  const { user, profile } = useAuth();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showPostJob, setShowPostJob] = useState(false);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);

  const categories = [
    'Web Development',
    'Mobile Development',
    'Design',
    'Writing',
    'Marketing',
    'Data Science',
    'Other'
  ];

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      const { data, error } = await supabase
        .from('jobs')
        .select(`
          *,
          client:profiles!jobs_client_id_fkey(full_name, location, rating)
        `)
        .eq('status', 'open')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setJobs(data || []);
    } catch (error) {
      console.error('Error fetching jobs:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredJobs = jobs.filter(job => {
    const matchesSearch = job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         job.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || job.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const formatBudget = (min: number, max: number) => {
    if (min && max) return `$${min} - $${max}`;
    if (min) return `$${min}+`;
    if (max) return `Up to $${max}`;
    return 'Budget not specified';
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="pt-16 pb-20 flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#00B894]"></div>
        </div>
        <BottomNav />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="pt-16 pb-20 px-4">
        <div className="max-w-md mx-auto">
          {/* Header with post job button */}
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold text-gray-900">Find Work</h1>
            {profile?.primary_role === 'client' && (
              <Dialog open={showPostJob} onOpenChange={setShowPostJob}>
                <DialogTrigger asChild>
                  <Button size="sm" className="bg-[#00B894] hover:bg-[#00A085]">
                    <Plus className="h-4 w-4 mr-2" />
                    Post Job
                  </Button>
                </DialogTrigger>
                <DialogContent className="w-[95vw] max-w-md max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>Post a New Job</DialogTitle>
                  </DialogHeader>
                  <JobPostForm 
                    onSuccess={() => {
                      setShowPostJob(false);
                      fetchJobs();
                    }} 
                  />
                </DialogContent>
              </Dialog>
            )}
          </div>

          {/* Search and filters */}
          <div className="space-y-4 mb-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search jobs..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger>
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {categories.map(category => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Job listings */}
          <div className="space-y-4">
            {filteredJobs.length === 0 ? (
              <Card>
                <CardContent className="text-center py-8">
                  <p className="text-gray-500">No jobs found matching your criteria.</p>
                </CardContent>
              </Card>
            ) : (
              filteredJobs.map((job) => (
                <Card key={job.id} className="cursor-pointer hover:shadow-md transition-shadow">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-lg mb-1">{job.title}</CardTitle>
                        <CardDescription className="text-sm">
                          {job.client?.full_name} • {job.client?.location}
                        </CardDescription>
                      </div>
                      <Badge variant="secondary" className="ml-2">
                        {job.category}
                      </Badge>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="pt-0">
                    <p className="text-gray-600 text-sm mb-3 line-clamp-3">
                      {job.description}
                    </p>
                    
                    {job.skills_required && job.skills_required.length > 0 && (
                      <div className="flex flex-wrap gap-1 mb-3">
                        {job.skills_required.slice(0, 3).map((skill, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {skill}
                          </Badge>
                        ))}
                        {job.skills_required.length > 3 && (
                          <Badge variant="outline" className="text-xs">
                            +{job.skills_required.length - 3} more
                          </Badge>
                        )}
                      </div>
                    )}
                    
                    <div className="flex items-center justify-between text-sm text-gray-500">
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center">
                          <DollarSign className="h-4 w-4 mr-1" />
                          {formatBudget(job.budget_min, job.budget_max)}
                        </div>
                        {job.deadline && (
                          <div className="flex items-center">
                            <Clock className="h-4 w-4 mr-1" />
                            {formatDate(job.deadline)}
                          </div>
                        )}
                      </div>
                      <span>{job.proposals_count} proposals</span>
                    </div>
                    
                    {profile?.primary_role === 'freelancer' && (
                      <div className="mt-3">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button 
                              size="sm" 
                              className="w-full bg-[#00B894] hover:bg-[#00A085]"
                              onClick={() => setSelectedJob(job)}
                            >
                              Submit Proposal
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="w-[95vw] max-w-md max-h-[90vh] overflow-y-auto">
                            <DialogHeader>
                              <DialogTitle>Submit Proposal</DialogTitle>
                            </DialogHeader>
                            {selectedJob && (
                              <ProposalForm 
                                job={selectedJob}
                                onSuccess={() => fetchJobs()}
                              />
                            )}
                          </DialogContent>
                        </Dialog>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </div>
      </main>

      <BottomNav />
    </div>
  );
};

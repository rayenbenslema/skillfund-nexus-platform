
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Plus, Search, Calendar, Target, Users } from 'lucide-react';
import { Header } from '@/components/layout/Header';
import { BottomNav } from '@/components/layout/BottomNav';
import { CampaignForm } from '@/components/campaigns/CampaignForm';
import { BackCampaignForm } from '@/components/campaigns/BackCampaignForm';

interface Campaign {
  id: string;
  title: string;
  description: string;
  category: string;
  goal_amount: number;
  current_amount: number;
  backers_count: number;
  deadline: string;
  image_url: string;
  created_at: string;
  creator: {
    full_name: string;
    avatar_url: string;
  };
}

export const CampaignsPage = () => {
  const { user, profile } = useAuth();
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showCreateCampaign, setShowCreateCampaign] = useState(false);
  const [selectedCampaign, setSelectedCampaign] = useState<Campaign | null>(null);

  useEffect(() => {
    fetchCampaigns();
  }, []);

  const fetchCampaigns = async () => {
    try {
      const { data, error } = await supabase
        .from('campaigns')
        .select(`
          *,
          creator:profiles!campaigns_creator_id_fkey(full_name, avatar_url)
        `)
        .eq('status', 'active')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setCampaigns(data || []);
    } catch (error) {
      console.error('Error fetching campaigns:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredCampaigns = campaigns.filter(campaign =>
    campaign.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    campaign.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const calculateProgress = (current: number, goal: number) => {
    return Math.min((current / goal) * 100, 100);
  };

  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const today = new Date();
    const diffTime = date.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) return 'Ended';
    if (diffDays === 0) return 'Last day';
    if (diffDays === 1) return '1 day left';
    return `${diffDays} days left`;
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
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold text-gray-900">Projects</h1>
            {profile?.primary_role === 'project_owner' && (
              <Dialog open={showCreateCampaign} onOpenChange={setShowCreateCampaign}>
                <DialogTrigger asChild>
                  <Button size="sm" className="bg-[#00B894] hover:bg-[#00A085]">
                    <Plus className="h-4 w-4 mr-2" />
                    Create
                  </Button>
                </DialogTrigger>
                <DialogContent className="w-[95vw] max-w-md max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>Create New Campaign</DialogTitle>
                  </DialogHeader>
                  <CampaignForm 
                    onSuccess={() => {
                      setShowCreateCampaign(false);
                      fetchCampaigns();
                    }} 
                  />
                </DialogContent>
              </Dialog>
            )}
          </div>

          {/* Search */}
          <div className="relative mb-6">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search campaigns..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Campaign listings */}
          <div className="space-y-4">
            {filteredCampaigns.length === 0 ? (
              <Card>
                <CardContent className="text-center py-8">
                  <p className="text-gray-500">No campaigns found.</p>
                </CardContent>
              </Card>
            ) : (
              filteredCampaigns.map((campaign) => (
                <Card key={campaign.id} className="overflow-hidden">
                  {campaign.image_url && (
                    <div className="aspect-video bg-gray-200">
                      <img 
                        src={campaign.image_url} 
                        alt={campaign.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                  
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-lg mb-1">{campaign.title}</CardTitle>
                        <CardDescription className="text-sm">
                          by {campaign.creator?.full_name}
                        </CardDescription>
                      </div>
                      <Badge variant="secondary" className="ml-2">
                        {campaign.category}
                      </Badge>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="pt-0">
                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                      {campaign.description}
                    </p>
                    
                    {/* Progress bar */}
                    <div className="mb-3">
                      <Progress 
                        value={calculateProgress(campaign.current_amount, campaign.goal_amount)} 
                        className="h-2"
                      />
                    </div>
                    
                    {/* Stats */}
                    <div className="grid grid-cols-3 gap-2 text-sm mb-4">
                      <div>
                        <div className="font-semibold text-[#00B894]">
                          {formatAmount(campaign.current_amount)}
                        </div>
                        <div className="text-gray-500 text-xs">raised</div>
                      </div>
                      <div>
                        <div className="font-semibold">
                          {campaign.backers_count}
                        </div>
                        <div className="text-gray-500 text-xs">backers</div>
                      </div>
                      <div>
                        <div className="font-semibold">
                          {formatDate(campaign.deadline)}
                        </div>
                        <div className="text-gray-500 text-xs">to go</div>
                      </div>
                    </div>
                    
                    <div className="text-xs text-gray-500 mb-3">
                      Goal: {formatAmount(campaign.goal_amount)}
                    </div>
                    
                    {profile?.primary_role === 'backer' && (
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button 
                            size="sm" 
                            className="w-full bg-[#00B894] hover:bg-[#00A085]"
                            onClick={() => setSelectedCampaign(campaign)}
                          >
                            Back This Project
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="w-[95vw] max-w-md max-h-[90vh] overflow-y-auto">
                          <DialogHeader>
                            <DialogTitle>Back This Project</DialogTitle>
                          </DialogHeader>
                          {selectedCampaign && (
                            <BackCampaignForm 
                              campaign={selectedCampaign}
                              onSuccess={() => fetchCampaigns()}
                            />
                          )}
                        </DialogContent>
                      </Dialog>
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

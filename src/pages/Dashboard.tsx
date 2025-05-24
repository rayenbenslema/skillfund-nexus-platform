
import { useAuth } from '@/hooks/useAuth';
import { Header } from '@/components/layout/Header';
import { BottomNav } from '@/components/layout/BottomNav';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { DollarSign, Users, Briefcase, Heart, TrendingUp, Clock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const Dashboard = () => {
  const { profile } = useAuth();
  const navigate = useNavigate();

  const getRoleSpecificContent = () => {
    switch (profile?.primary_role) {
      case 'freelancer':
        return {
          title: 'Find Your Next Opportunity',
          description: 'Browse jobs that match your skills',
          stats: [
            { icon: Briefcase, label: 'Active Applications', value: '3' },
            { icon: DollarSign, label: 'Total Earned', value: `$${profile?.total_earned || 0}` },
            { icon: TrendingUp, label: 'Success Rate', value: '95%' },
          ],
          quickActions: [
            { label: 'Browse Jobs', action: () => navigate('/jobs'), primary: true },
            { label: 'View Proposals', action: () => navigate('/proposals') },
          ]
        };
      case 'client':
        return {
          title: 'Hire Top Talent',
          description: 'Find skilled freelancers for your projects',
          stats: [
            { icon: Users, label: 'Active Jobs', value: '2' },
            { icon: Clock, label: 'Pending Proposals', value: '8' },
            { icon: DollarSign, label: 'Total Spent', value: '$2,450' },
          ],
          quickActions: [
            { label: 'Post New Job', action: () => navigate('/post-job'), primary: true },
            { label: 'Manage Jobs', action: () => navigate('/my-jobs') },
          ]
        };
      case 'project_owner':
        return {
          title: 'Launch Your Campaign',
          description: 'Turn your ideas into reality with crowdfunding',
          stats: [
            { icon: Heart, label: 'Active Campaigns', value: '1' },
            { icon: Users, label: 'Total Backers', value: '24' },
            { icon: DollarSign, label: 'Funds Raised', value: '$1,200' },
          ],
          quickActions: [
            { label: 'Create Campaign', action: () => navigate('/create-campaign'), primary: true },
            { label: 'My Campaigns', action: () => navigate('/my-campaigns') },
          ]
        };
      case 'backer':
        return {
          title: 'Support Innovation',
          description: 'Discover and back amazing projects',
          stats: [
            { icon: Heart, label: 'Projects Backed', value: '12' },
            { icon: DollarSign, label: 'Total Contributed', value: '$850' },
            { icon: TrendingUp, label: 'Successful Projects', value: '8/12' },
          ],
          quickActions: [
            { label: 'Explore Projects', action: () => navigate('/campaigns'), primary: true },
            { label: 'My Contributions', action: () => navigate('/my-contributions') },
          ]
        };
      default:
        return {
          title: 'Welcome to SkillFund',
          description: 'Your gateway to freelancing and crowdfunding',
          stats: [],
          quickActions: []
        };
    }
  };

  const content = getRoleSpecificContent();

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <Header />
      
      <main className="max-w-md mx-auto p-4 space-y-6">
        {/* Welcome Section */}
        <div className="text-center py-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Welcome back, {profile?.full_name?.split(' ')[0] || 'User'}!
          </h2>
          <p className="text-gray-600">{content.description}</p>
        </div>

        {/* Stats Grid */}
        {content.stats.length > 0 && (
          <div className="grid grid-cols-1 gap-4">
            {content.stats.map((stat, index) => (
              <Card key={index}>
                <CardContent className="flex items-center p-4">
                  <div className="flex items-center justify-center w-12 h-12 bg-[#00B894]/10 rounded-lg mr-4">
                    <stat.icon className="h-6 w-6 text-[#00B894]" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                    <p className="text-sm text-gray-600">{stat.label}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>{content.title}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {content.quickActions.map((action, index) => (
              <Button
                key={index}
                onClick={action.action}
                className={`w-full ${action.primary ? 'bg-[#00B894] hover:bg-[#00a085]' : ''}`}
                variant={action.primary ? 'default' : 'outline'}
              >
                {action.label}
              </Button>
            ))}
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Stay updated with your latest interactions</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                <div className="w-2 h-2 bg-[#00B894] rounded-full"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium">New message received</p>
                  <p className="text-xs text-gray-500">2 hours ago</p>
                </div>
              </div>
              <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium">Profile updated successfully</p>
                  <p className="text-xs text-gray-500">1 day ago</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>

      <BottomNav />
    </div>
  );
};

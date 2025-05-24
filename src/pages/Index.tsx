
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';
import { Briefcase, Users, DollarSign, Heart } from 'lucide-react';

const Index = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: Briefcase,
      title: 'Freelance Marketplace',
      description: 'Find talented freelancers or discover your next opportunity'
    },
    {
      icon: Heart,
      title: 'Crowdfunding Platform',
      description: 'Launch campaigns or back innovative projects'
    },
    {
      icon: Users,
      title: 'Global Community',
      description: 'Connect with creators and professionals worldwide'
    },
    {
      icon: DollarSign,
      title: 'Secure Payments',
      description: 'Safe and reliable payment processing'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#00B894]/10 to-blue-50">
      {/* Hero Section */}
      <div className="text-center py-16 px-4">
        <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
          Welcome to <span className="text-[#00B894]">SkillFund</span>
        </h1>
        <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
          The hybrid platform combining freelancing opportunities with crowdfunding innovation. 
          Build your career, launch your projects, and fund the future.
        </p>
        <div className="space-y-4 max-w-md mx-auto">
          <Button 
            onClick={() => navigate('/auth')}
            className="w-full bg-[#00B894] hover:bg-[#00a085] text-lg py-6"
          >
            Get Started Today
          </Button>
          <p className="text-sm text-gray-500">
            Join thousands of freelancers, clients, and innovators
          </p>
        </div>
      </div>

      {/* Features Grid */}
      <div className="max-w-4xl mx-auto px-4 pb-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {features.map((feature, index) => (
            <Card key={index} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-center space-x-3">
                  <div className="flex items-center justify-center w-12 h-12 bg-[#00B894]/10 rounded-lg">
                    <feature.icon className="h-6 w-6 text-[#00B894]" />
                  </div>
                  <CardTitle className="text-xl">{feature.title}</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base">
                  {feature.description}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Call to Action */}
      <div className="bg-[#00B894] text-white py-16 px-4">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Start Your Journey?</h2>
          <p className="text-lg mb-8 opacity-90">
            Whether you're looking to hire, work, create, or invest - SkillFund has everything you need.
          </p>
          <Button 
            onClick={() => navigate('/auth')}
            variant="secondary"
            className="bg-white text-[#00B894] hover:bg-gray-100 text-lg py-6 px-8"
          >
            Join SkillFund Now
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Index;

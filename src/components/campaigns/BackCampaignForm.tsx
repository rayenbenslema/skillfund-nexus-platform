
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { toast } from '@/components/ui/use-toast';

interface BackCampaignFormProps {
  campaign: {
    id: string;
    title: string;
    description: string;
  };
  onSuccess: () => void;
}

interface BackFormData {
  amount: number;
}

export const BackCampaignForm = ({ campaign, onSuccess }: BackCampaignFormProps) => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);

  const form = useForm<BackFormData>();

  const onSubmit = async (data: BackFormData) => {
    setLoading(true);
    try {
      // Create contribution
      const { error } = await supabase
        .from('contributions')
        .insert({
          campaign_id: campaign.id,
          backer_id: user?.id,
          amount: data.amount,
          payment_status: 'completed' // Simplified for demo
        });

      if (error) throw error;

      // Update campaign amounts using a direct update query instead of RPC
      const { data: campaignData, error: fetchError } = await supabase
        .from('campaigns')
        .select('current_amount, backers_count')
        .eq('id', campaign.id)
        .single();

      if (fetchError) {
        console.error('Error fetching campaign data:', fetchError);
      } else {
        const { error: updateError } = await supabase
          .from('campaigns')
          .update({
            current_amount: (campaignData.current_amount || 0) + data.amount,
            backers_count: (campaignData.backers_count || 0) + 1
          })
          .eq('id', campaign.id);

        if (updateError) {
          console.error('Error updating campaign totals:', updateError);
        }
      }

      toast({
        title: "Success",
        description: `Thank you for backing this project with $${data.amount}!`,
      });
      
      onSuccess();
    } catch (error) {
      console.error('Error backing campaign:', error);
      toast({
        title: "Error",
        description: "Failed to process backing. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="bg-gray-50 p-3 rounded-lg">
        <h3 className="font-medium text-sm mb-1">{campaign.title}</h3>
        <p className="text-xs text-gray-600 line-clamp-2">{campaign.description}</p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="amount"
            rules={{ required: "Amount is required", min: { value: 1, message: "Minimum $1" } }}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Contribution Amount ($)</FormLabel>
                <FormControl>
                  <Input 
                    type="number" 
                    placeholder="25"
                    min="1"
                    {...field}
                    onChange={(e) => field.onChange(Number(e.target.value))}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button 
            type="submit" 
            className="w-full bg-[#00B894] hover:bg-[#00A085]"
            disabled={loading}
          >
            {loading ? 'Processing...' : 'Back This Project'}
          </Button>
        </form>
      </Form>
    </div>
  );
};


import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { toast } from '@/components/ui/use-toast';

interface ProposalFormProps {
  job: {
    id: string;
    title: string;
    description: string;
  };
  onSuccess: () => void;
}

interface ProposalFormData {
  cover_letter: string;
  proposed_rate: number;
  estimated_duration: string;
}

export const ProposalForm = ({ job, onSuccess }: ProposalFormProps) => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);

  const form = useForm<ProposalFormData>();

  const onSubmit = async (data: ProposalFormData) => {
    setLoading(true);
    try {
      const { error } = await supabase
        .from('proposals')
        .insert({
          job_id: job.id,
          freelancer_id: user?.id,
          cover_letter: data.cover_letter,
          proposed_rate: data.proposed_rate,
          estimated_duration: data.estimated_duration,
        });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Proposal submitted successfully!",
      });
      
      onSuccess();
    } catch (error) {
      console.error('Error submitting proposal:', error);
      toast({
        title: "Error",
        description: "Failed to submit proposal. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="bg-gray-50 p-3 rounded-lg">
        <h3 className="font-medium text-sm mb-1">{job.title}</h3>
        <p className="text-xs text-gray-600 line-clamp-2">{job.description}</p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="cover_letter"
            rules={{ required: "Cover letter is required" }}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Cover Letter</FormLabel>
                <FormControl>
                  <Textarea 
                    placeholder="Explain why you're the best fit for this project..."
                    rows={4}
                    {...field} 
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="proposed_rate"
            rules={{ required: "Rate is required" }}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Your Rate ($)</FormLabel>
                <FormControl>
                  <Input 
                    type="number" 
                    placeholder="1500"
                    {...field}
                    onChange={(e) => field.onChange(Number(e.target.value))}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="estimated_duration"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Estimated Duration</FormLabel>
                <FormControl>
                  <Input 
                    placeholder="e.g. 2-3 weeks"
                    {...field}
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
            {loading ? 'Submitting...' : 'Submit Proposal'}
          </Button>
        </form>
      </Form>
    </div>
  );
};

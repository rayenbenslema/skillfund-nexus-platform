
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { toast } from '@/components/ui/use-toast';

interface CampaignFormProps {
  onSuccess: () => void;
}

interface CampaignFormData {
  title: string;
  description: string;
  story: string;
  category: string;
  goal_amount: number;
  deadline: string;
  image_url: string;
}

export const CampaignForm = ({ onSuccess }: CampaignFormProps) => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);

  const form = useForm<CampaignFormData>();

  const categories = [
    'Technology',
    'Creative',
    'Community',
    'Business',
    'Education',
    'Health',
    'Environment',
    'Other'
  ];

  const onSubmit = async (data: CampaignFormData) => {
    setLoading(true);
    try {
      const { error } = await supabase
        .from('campaigns')
        .insert({
          creator_id: user?.id,
          title: data.title,
          description: data.description,
          story: data.story,
          category: data.category,
          goal_amount: data.goal_amount,
          deadline: data.deadline,
          image_url: data.image_url || null,
          status: 'active'
        });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Campaign created successfully!",
      });
      
      onSuccess();
    } catch (error) {
      console.error('Error creating campaign:', error);
      toast({
        title: "Error",
        description: "Failed to create campaign. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="title"
          rules={{ required: "Title is required" }}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Campaign Title</FormLabel>
              <FormControl>
                <Input placeholder="e.g. Revolutionary Solar Panel Design" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          rules={{ required: "Description is required" }}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Short Description</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Brief overview of your project..."
                  rows={3}
                  {...field} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="story"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Project Story</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Tell the full story of your project..."
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
          name="category"
          rules={{ required: "Category is required" }}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Category</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {categories.map(category => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="goal_amount"
          rules={{ required: "Goal amount is required" }}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Funding Goal ($)</FormLabel>
              <FormControl>
                <Input 
                  type="number" 
                  placeholder="10000"
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
          name="deadline"
          rules={{ required: "Deadline is required" }}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Campaign Deadline</FormLabel>
              <FormControl>
                <Input type="date" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="image_url"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Project Image URL (Optional)</FormLabel>
              <FormControl>
                <Input 
                  placeholder="https://example.com/image.jpg"
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
          {loading ? 'Creating...' : 'Create Campaign'}
        </Button>
      </form>
    </Form>
  );
};

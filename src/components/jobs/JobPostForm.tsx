
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Badge } from '@/components/ui/badge';
import { X } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';

interface JobPostFormProps {
  onSuccess: () => void;
}

interface JobFormData {
  title: string;
  description: string;
  category: string;
  budget_min: number;
  budget_max: number;
  deadline: string;
}

export const JobPostForm = ({ onSuccess }: JobPostFormProps) => {
  const { user } = useAuth();
  const [skills, setSkills] = useState<string[]>([]);
  const [skillInput, setSkillInput] = useState('');
  const [loading, setLoading] = useState(false);

  const form = useForm<JobFormData>();

  const categories = [
    'Web Development',
    'Mobile Development',
    'Design',
    'Writing',
    'Marketing',
    'Data Science',
    'Other'
  ];

  const addSkill = () => {
    if (skillInput.trim() && !skills.includes(skillInput.trim())) {
      setSkills([...skills, skillInput.trim()]);
      setSkillInput('');
    }
  };

  const removeSkill = (skillToRemove: string) => {
    setSkills(skills.filter(skill => skill !== skillToRemove));
  };

  const onSubmit = async (data: JobFormData) => {
    setLoading(true);
    try {
      const { error } = await supabase
        .from('jobs')
        .insert({
          client_id: user?.id,
          title: data.title,
          description: data.description,
          category: data.category,
          budget_min: data.budget_min || null,
          budget_max: data.budget_max || null,
          deadline: data.deadline || null,
          skills_required: skills.length > 0 ? skills : null,
        });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Job posted successfully!",
      });
      
      onSuccess();
    } catch (error) {
      console.error('Error posting job:', error);
      toast({
        title: "Error",
        description: "Failed to post job. Please try again.",
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
              <FormLabel>Job Title</FormLabel>
              <FormControl>
                <Input placeholder="e.g. Build a React Native App" {...field} />
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
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Describe your project requirements..."
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

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="budget_min"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Min Budget ($)</FormLabel>
                <FormControl>
                  <Input 
                    type="number" 
                    placeholder="500"
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
            name="budget_max"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Max Budget ($)</FormLabel>
                <FormControl>
                  <Input 
                    type="number" 
                    placeholder="2000"
                    {...field}
                    onChange={(e) => field.onChange(Number(e.target.value))}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="deadline"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Deadline (Optional)</FormLabel>
              <FormControl>
                <Input type="date" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div>
          <FormLabel>Required Skills</FormLabel>
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

        <Button 
          type="submit" 
          className="w-full bg-[#00B894] hover:bg-[#00A085]"
          disabled={loading}
        >
          {loading ? 'Posting...' : 'Post Job'}
        </Button>
      </form>
    </Form>
  );
};

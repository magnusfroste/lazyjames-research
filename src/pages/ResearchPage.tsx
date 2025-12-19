import { ResearchInitiator } from "@/components/lab/ResearchInitiator";
import { useNavigate } from "react-router-dom";
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { useStartResearch } from '@/hooks/useStartResearch';

const ResearchPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();
  const { startResearch, isLoading } = useStartResearch();

  const handleStartResearch = async (data: any) => {
    if (!user) {
      toast({
        title: "Error",
        description: "You must be logged in to start research",
        variant: "destructive"
      });
      return;
    }

    const result = await startResearch(data);

    if (result.success) {
      toast({
        title: "Research Started!",
        description: `Research started for ${data.company_name}. 1 credit used.`,
        duration: 5000
      });
      navigate('/');
    } else if (result.error === 'insufficient_credits') {
      toast({
        title: "Insufficient Credits",
        description: "You need at least 1 credit to start research.",
        variant: "destructive",
        action: (
          <button
            onClick={() => navigate('/user-profile')}
            className="px-3 py-2 text-sm font-medium rounded-md bg-primary text-primary-foreground hover:bg-primary/90"
          >
            Buy Credits
          </button>
        ),
      });
    } else {
      toast({
        title: "Error starting research",
        description: result.message || "Please try again.",
        variant: "destructive"
      });
    }
  };

  return (
    <ResearchInitiator
      onSubmit={handleStartResearch}
      onCancel={() => navigate('/')}
    />
  );
};

export default ResearchPage;

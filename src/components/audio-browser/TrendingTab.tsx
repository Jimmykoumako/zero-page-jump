
import { TrendingUp } from 'lucide-react';
import EmptyStateCard from './EmptyStateCard';

const TrendingTab = () => {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Trending Now</h2>
      <EmptyStateCard
        icon={TrendingUp}
        title="Trending feature coming soon"
        description="We're working on analytics to show you what's popular in the community."
        actionText="Get Notified"
      />
    </div>
  );
};

export default TrendingTab;

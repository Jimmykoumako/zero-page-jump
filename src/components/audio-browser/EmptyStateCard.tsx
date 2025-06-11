
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { LucideIcon } from 'lucide-react';

interface EmptyStateCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  actionText?: string;
  onAction?: () => void;
}

const EmptyStateCard = ({ icon: Icon, title, description, actionText, onAction }: EmptyStateCardProps) => {
  return (
    <Card className="border-dashed">
      <CardContent className="p-12 text-center">
        <Icon className="w-16 h-16 mx-auto mb-6 text-muted-foreground" />
        <h3 className="text-xl font-semibold mb-2">{title}</h3>
        <p className="text-muted-foreground mb-6">{description}</p>
        {actionText && onAction && (
          <Button onClick={onAction} className="bg-gradient-to-r from-primary to-accent text-white">
            {actionText}
          </Button>
        )}
      </CardContent>
    </Card>
  );
};

export default EmptyStateCard;

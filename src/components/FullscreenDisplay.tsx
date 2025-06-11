
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Monitor } from "lucide-react";

const FullscreenDisplay = () => {
  return (
    <div className="min-h-screen bg-background p-4">
      <Card className="max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Monitor className="w-6 h-6" />
            Fullscreen Display
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            This component will provide fullscreen presentation capabilities for hymns and worship content.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default FullscreenDisplay;

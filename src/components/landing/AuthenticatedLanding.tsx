
import { Button } from "@/components/ui/button";
import { Library, Users, Monitor, Music, User, Calendar } from "lucide-react";

interface AuthenticatedLandingProps {
  user: any;
  onModeSelect: (mode: 'browse' | 'lyrics' | 'group' | 'hymnal' | 'display' | 'remote') => void;
}

const AuthenticatedLanding = ({ user, onModeSelect }: AuthenticatedLandingProps) => {
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
  };

  const userName = user?.email?.split('@')[0] || 'Friend';

  const quickActions = [
    {
      id: 'browse',
      icon: Library,
      title: 'Continue Browsing',
      description: 'Pick up where you left off',
      color: 'bg-blue-500 hover:bg-blue-600',
      priority: 'high'
    },
    {
      id: 'group',
      icon: Users,
      title: 'Join Session',
      description: 'Connect with others in worship',
      color: 'bg-emerald-500 hover:bg-emerald-600',
      priority: 'high'
    },
    {
      id: 'display',
      icon: Monitor,
      title: 'Start Presenting',
      description: 'Lead congregation worship',
      color: 'bg-purple-500 hover:bg-purple-600',
      priority: 'medium'
    },
    {
      id: 'lyrics',
      icon: Music,
      title: 'Study Hymns',
      description: 'Explore lyrics and meanings',
      color: 'bg-indigo-500 hover:bg-indigo-600',
      priority: 'medium'
    }
  ];

  const highPriorityActions = quickActions.filter(action => action.priority === 'high');
  const mediumPriorityActions = quickActions.filter(action => action.priority === 'medium');

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Welcome Header */}
      <section className="py-12 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-white/20 mb-8">
            <div className="flex items-center gap-6 mb-6">
              <div className="bg-gradient-to-br from-blue-500 to-purple-600 rounded-full p-4">
                <User className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-4xl font-bold text-foreground mb-2">
                  {getGreeting()}, {userName}!
                </h1>
                <p className="text-xl text-muted-foreground">
                  Ready to worship? Choose how you'd like to begin today.
                </p>
              </div>
            </div>
            
            {/* Today's Date */}
            <div className="flex items-center gap-2 text-muted-foreground">
              <Calendar className="w-4 h-4" />
              <span>{new Date().toLocaleDateString('en-US', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}</span>
            </div>
          </div>

          {/* Quick Actions - Primary */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-foreground mb-6">Quick Start</h2>
            <div className="grid md:grid-cols-2 gap-6">
              {highPriorityActions.map((action) => {
                const IconComponent = action.icon;
                return (
                  <div 
                    key={action.id}
                    onClick={() => onModeSelect(action.id as any)}
                    className={`${action.color} text-white rounded-xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer group transform hover:scale-105`}
                  >
                    <div className="flex items-center gap-4">
                      <IconComponent className="w-12 h-12 group-hover:scale-110 transition-transform" />
                      <div>
                        <h3 className="text-2xl font-bold mb-2">{action.title}</h3>
                        <p className="text-white/90">{action.description}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Additional Options */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-foreground mb-4">More Options</h2>
            <div className="grid md:grid-cols-2 gap-4">
              {mediumPriorityActions.map((action) => {
                const IconComponent = action.icon;
                return (
                  <div 
                    key={action.id}
                    onClick={() => onModeSelect(action.id as any)}
                    className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-md hover:shadow-lg transition-all duration-300 cursor-pointer border border-white/20 group"
                  >
                    <div className="flex items-center gap-4">
                      <div className={`${action.color} rounded-lg p-3`}>
                        <IconComponent className="w-6 h-6 text-white group-hover:scale-110 transition-transform" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-foreground mb-1">{action.title}</h3>
                        <p className="text-sm text-muted-foreground">{action.description}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Recent Activity Placeholder */}
          <div className="bg-white/60 backdrop-blur-sm rounded-xl p-6 border border-white/20">
            <h3 className="text-lg font-semibold text-foreground mb-4">Recent Activity</h3>
            <p className="text-muted-foreground text-center py-8">
              Your recent hymns and sessions will appear here as you use the app.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AuthenticatedLanding;

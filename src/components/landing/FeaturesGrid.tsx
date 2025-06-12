
import { Book, Smartphone, Monitor, Users, Library, FileText, Music, Settings, Zap, Shield } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface FeaturesGridProps {
  onModeSelect: (mode: 'browse' | 'lyrics' | 'group' | 'hymnal' | 'display' | 'remote' | 'music' | 'sync') => void;
}

const FeaturesGrid = ({ onModeSelect }: FeaturesGridProps) => {
  const features = [
    {
      id: 'browse',
      icon: Library,
      title: 'Browse Hymnbooks',
      description: 'Explore our vast collection of traditional and contemporary hymnbooks with advanced search',
      color: 'from-blue-500 to-blue-600',
      badge: 'Popular'
    },
    {
      id: 'music',
      icon: Music,
      title: 'Audio Library',
      description: 'Listen to professionally recorded hymns with high-quality audio and multiple arrangements',
      color: 'from-green-500 to-green-600',
      badge: 'New'
    },
    {
      id: 'group',
      icon: Users,
      title: 'Group Worship',
      description: 'Create or join synchronized sessions for unified singing across multiple devices',
      color: 'from-emerald-500 to-emerald-600',
      badge: null
    },
    {
      id: 'display',
      icon: Monitor,
      title: 'Presentation Mode',
      description: 'Display hymns beautifully for congregation viewing with customizable fonts and themes',
      color: 'from-purple-500 to-purple-600',
      badge: null
    },
    {
      id: 'remote',
      icon: Smartphone,
      title: 'Remote Control',
      description: 'Control presentations wirelessly from your mobile device with gesture support',
      color: 'from-orange-500 to-orange-600',
      badge: null
    },
    {
      id: 'sync',
      icon: Settings,
      title: 'Sync Studio',
      description: 'Advanced tools for synchronizing lyrics with audio tracks for perfect timing',
      color: 'from-red-500 to-red-600',
      badge: 'Pro'
    },
    {
      id: 'lyrics',
      icon: FileText,
      title: 'Study Lyrics',
      description: 'Dive deep into hymn lyrics with detailed syllable breakdowns and theological notes',
      color: 'from-indigo-500 to-indigo-600',
      badge: null
    },
    {
      id: 'hymnal',
      icon: Book,
      title: 'Personal Practice',
      description: 'Practice hymns at your own pace with guided assistance and progress tracking',
      color: 'from-teal-500 to-teal-600',
      badge: null
    }
  ];

  const additionalFeatures = [
    {
      icon: Zap,
      title: 'Lightning Fast',
      description: 'Optimized for speed with instant search and seamless navigation'
    },
    {
      icon: Shield,
      title: 'Secure & Private',
      description: 'Your data is protected with enterprise-grade security'
    },
    {
      icon: Smartphone,
      title: 'Mobile First',
      description: 'Designed to work perfectly on all devices and screen sizes'
    }
  ];

  return (
    <section className="py-16 px-4">
      <div className="container mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Everything You Need
            </span>
            <br />
            <span className="text-3xl md:text-4xl text-muted-foreground">
              for Modern Worship
            </span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Whether you're leading worship, practicing at home, or joining group singing, 
            we have the perfect tools for every moment of praise and worship.
          </p>
        </div>

        {/* Main Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto mb-16">
          {features.map((feature) => {
            const IconComponent = feature.icon;
            return (
              <Card 
                key={feature.id}
                onClick={() => onModeSelect(feature.id as any)}
                className="relative overflow-hidden cursor-pointer border-2 border-transparent hover:border-primary/20 transition-all duration-300 group hover:shadow-xl hover:-translate-y-1"
              >
                <CardContent className="p-6 text-center">
                  {feature.badge && (
                    <div className="absolute top-3 right-3">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                        feature.badge === 'New' ? 'bg-green-100 text-green-700' :
                        feature.badge === 'Pro' ? 'bg-purple-100 text-purple-700' :
                        'bg-blue-100 text-blue-700'
                      }`}>
                        {feature.badge}
                      </span>
                    </div>
                  )}
                  
                  <div className={`w-16 h-16 bg-gradient-to-br ${feature.color} rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform shadow-lg`}>
                    <IconComponent className="w-8 h-8 text-white" />
                  </div>
                  
                  <h3 className="text-xl font-semibold text-foreground mb-3">{feature.title}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Additional Features */}
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-3xl p-8 md:p-12">
          <h3 className="text-2xl md:text-3xl font-bold text-center text-foreground mb-8">
            Built for Excellence
          </h3>
          <div className="grid md:grid-cols-3 gap-8">
            {additionalFeatures.map((feature, index) => {
              const IconComponent = feature.icon;
              return (
                <div key={index} className="text-center">
                  <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center mx-auto mb-4 shadow-md">
                    <IconComponent className="w-6 h-6 text-primary" />
                  </div>
                  <h4 className="text-lg font-semibold text-foreground mb-2">{feature.title}</h4>
                  <p className="text-muted-foreground text-sm">{feature.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeaturesGrid;

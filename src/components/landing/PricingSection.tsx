
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, Star, Zap, Crown } from "lucide-react";

interface PricingSectionProps {
  onSelectPlan?: (plan: string) => void;
}

const PricingSection = ({ onSelectPlan }: PricingSectionProps) => {
  const plans = [
    {
      name: "Community",
      price: "Free",
      description: "Perfect for small churches and personal use",
      icon: Star,
      color: "from-green-500 to-green-600",
      features: [
        "Access to 10,000+ hymns",
        "Basic presentation mode",
        "Up to 25 participants",
        "Mobile app access",
        "Community support"
      ],
      limitations: [
        "Limited to 5 group sessions/month",
        "Basic themes only"
      ],
      popular: false
    },
    {
      name: "Church",
      price: "$19",
      period: "/month",
      description: "Ideal for growing congregations",
      icon: Zap,
      color: "from-blue-500 to-blue-600",
      features: [
        "Everything in Community",
        "Unlimited group sessions",
        "Advanced presentation themes",
        "Remote control features",
        "Up to 200 participants",
        "Priority support",
        "Custom branding"
      ],
      limitations: [],
      popular: true
    },
    {
      name: "Enterprise",
      price: "Custom",
      description: "For large churches and organizations",
      icon: Crown,
      color: "from-purple-500 to-purple-600",
      features: [
        "Everything in Church",
        "Unlimited participants",
        "Sync Studio access",
        "Advanced analytics",
        "Multi-campus support",
        "Dedicated support",
        "Custom integrations",
        "White-label options"
      ],
      limitations: [],
      popular: false
    }
  ];

  return (
    <section className="py-16 px-4">
      <div className="container mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Choose Your Plan
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Start free and scale as your congregation grows. All plans include our core features with no hidden fees.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {plans.map((plan, index) => {
            const IconComponent = plan.icon;
            return (
              <Card 
                key={index} 
                className={`relative ${
                  plan.popular 
                    ? 'border-primary shadow-lg scale-105 bg-gradient-to-b from-primary/5 to-white' 
                    : 'border-border hover:shadow-md'
                } transition-all duration-300 hover:-translate-y-1`}
              >
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <Badge className="bg-primary text-primary-foreground px-4 py-1">
                      Most Popular
                    </Badge>
                  </div>
                )}
                
                <CardHeader className="text-center pb-4">
                  <div className={`w-16 h-16 bg-gradient-to-br ${plan.color} rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg`}>
                    <IconComponent className="w-8 h-8 text-white" />
                  </div>
                  
                  <CardTitle className="text-2xl font-bold">{plan.name}</CardTitle>
                  <div className="mb-2">
                    <span className="text-4xl font-bold text-primary">{plan.price}</span>
                    {plan.period && <span className="text-muted-foreground">{plan.period}</span>}
                  </div>
                  <p className="text-muted-foreground text-sm">{plan.description}</p>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  <ul className="space-y-3">
                    {plan.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-start gap-3">
                        <div className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                          <Check className="w-3 h-3 text-green-600" />
                        </div>
                        <span className="text-sm text-muted-foreground">{feature}</span>
                      </li>
                    ))}
                    {plan.limitations.map((limitation, limitIndex) => (
                      <li key={limitIndex} className="flex items-start gap-3 opacity-60">
                        <div className="w-5 h-5 bg-gray-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                          <span className="w-2 h-2 bg-gray-400 rounded-full"></span>
                        </div>
                        <span className="text-sm text-muted-foreground">{limitation}</span>
                      </li>
                    ))}
                  </ul>
                  
                  <Button 
                    className={`w-full mt-6 ${
                      plan.popular 
                        ? 'bg-primary hover:bg-primary/90' 
                        : 'variant-outline'
                    }`}
                    variant={plan.popular ? 'default' : 'outline'}
                    onClick={() => onSelectPlan?.(plan.name.toLowerCase())}
                  >
                    {plan.price === 'Free' ? 'Get Started' : 
                     plan.price === 'Custom' ? 'Contact Sales' : 
                     'Start Free Trial'}
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* FAQ Note */}
        <div className="text-center mt-12">
          <p className="text-muted-foreground">
            All plans include a 30-day free trial. No credit card required. 
            <br />
            <span className="font-medium">Need help choosing? </span>
            <Button variant="link" className="p-0 h-auto text-primary">
              Contact our team
            </Button>
          </p>
        </div>
      </div>
    </section>
  );
};

export default PricingSection;

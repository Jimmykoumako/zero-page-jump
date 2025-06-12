
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Star, Quote } from "lucide-react";

const TestimonialsSection = () => {
  const testimonials = [
    {
      name: "Pastor Michael Johnson",
      role: "Senior Pastor",
      church: "Grace Community Church",
      content: "This digital hymnal has transformed our worship services. The synchronization features allow our entire congregation to follow along seamlessly, and the audio quality is exceptional.",
      rating: 5,
      avatar: "MJ"
    },
    {
      name: "Sarah Williams",
      role: "Worship Leader",
      church: "Hillside Baptist Church",
      content: "The remote control feature is a game-changer! I can lead worship while moving around the sanctuary, and the presentation mode looks beautiful on our screens.",
      rating: 5,
      avatar: "SW"
    },
    {
      name: "David Chen",
      role: "Music Director",
      church: "Trinity Methodist Church",
      content: "Our choir loves the sync studio for learning new arrangements. The ability to practice with synchronized lyrics and audio has improved our preparation time significantly.",
      rating: 5,
      avatar: "DC"
    },
    {
      name: "Emily Rodriguez",
      role: "Youth Pastor",
      church: "New Life Church",
      content: "The mobile-first design is perfect for our youth services. Everyone can follow along on their phones, and the group sessions create such a unified worship experience.",
      rating: 5,
      avatar: "ER"
    }
  ];

  return (
    <section className="py-16 px-4 bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="container mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Trusted by Churches Worldwide
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            See what worship leaders and pastors are saying about their experience with our digital hymnal platform.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {testimonials.map((testimonial, index) => (
            <Card key={index} className="relative bg-white/80 backdrop-blur-sm border-white/40 hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="absolute top-4 right-4">
                  <Quote className="w-8 h-8 text-primary/20" />
                </div>
                
                <div className="flex mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                
                <p className="text-muted-foreground mb-6 leading-relaxed italic">
                  "{testimonial.content}"
                </p>
                
                <div className="flex items-center gap-3">
                  <Avatar className="w-12 h-12">
                    <AvatarFallback className="bg-primary text-primary-foreground font-semibold">
                      {testimonial.avatar}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h4 className="font-semibold text-foreground">{testimonial.name}</h4>
                    <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                    <p className="text-sm text-primary font-medium">{testimonial.church}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Stats */}
        <div className="mt-16 bg-white/60 backdrop-blur-sm rounded-2xl p-8 border border-white/40">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-3xl md:text-4xl font-bold text-primary mb-2">1,000+</div>
              <div className="text-muted-foreground">Churches</div>
            </div>
            <div>
              <div className="text-3xl md:text-4xl font-bold text-primary mb-2">50K+</div>
              <div className="text-muted-foreground">Hymns</div>
            </div>
            <div>
              <div className="text-3xl md:text-4xl font-bold text-primary mb-2">100K+</div>
              <div className="text-muted-foreground">Users</div>
            </div>
            <div>
              <div className="text-3xl md:text-4xl font-bold text-primary mb-2">99.9%</div>
              <div className="text-muted-foreground">Uptime</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;

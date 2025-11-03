import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import DashboardHeader from "@/components/DashboardHeader";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Search, BookOpen, Video, Newspaper, Heart } from "lucide-react";

const Resources = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [news, setNews] = useState([
    {
      title: "New Study: Exercise Reduces PCOS Symptoms by 40%",
      source: "Women's Health Journal",
      date: "2 days ago",
    },
    {
      title: "Government Launches Free Menstrual Health Program",
      source: "Ministry of Health",
      date: "1 week ago",
    },
    {
      title: "Breakthrough in Menopause Treatment Research",
      source: "Medical News Today",
      date: "3 days ago",
    },
  ]);
  const [loading, setLoading] = useState(false);

  const articles = [
    {
      title: "Understanding PCOS: A Complete Guide",
      category: "PCOS",
      excerpt: "Learn about symptoms, diagnosis, and management of Polycystic Ovary Syndrome",
      readTime: "8 min read",
      image: "📊",
    },
    {
      title: "Menstrual Health: What's Normal?",
      category: "Menstruation",
      excerpt: "Discover what to expect during your menstrual cycle and when to seek help",
      readTime: "6 min read",
      image: "🩸",
    },
    {
      title: "Navigating Menopause with Confidence",
      category: "Menopause",
      excerpt: "Essential information about menopause symptoms and treatment options",
      readTime: "10 min read",
      image: "🌸",
    },
    {
      title: "Nutrition for Women's Health",
      category: "Wellness",
      excerpt: "Evidence-based dietary recommendations for optimal health",
      readTime: "7 min read",
      image: "🥗",
    },
  ];

  const videos = [
    {
      title: "Hygiene Tips During Menstruation",
      duration: "5:30",
      views: "12K views",
      thumbnail: "🎥",
    },
    {
      title: "Yoga for Menstrual Cramps Relief",
      duration: "8:45",
      views: "25K views",
      thumbnail: "🧘‍♀️",
    },
    {
      title: "Understanding Your Fertility Window",
      duration: "6:20",
      views: "18K views",
      thumbnail: "📅",
    },
  ];

  useEffect(() => {
    // Fetch latest health news from News API
    const fetchNews = async () => {
      if (!import.meta.env.VITE_NEWS_API_KEY) {
        return; // Use mock data if no API key
      }

      try {
        setLoading(true);
        const response = await fetch(
          `https://newsapi.org/v2/everything?q=women+health+OR+menstrual+OR+PCOS+OR+menopause&sortBy=publishedAt&language=en&pageSize=10&apiKey=${import.meta.env.VITE_NEWS_API_KEY}`
        );
        
        const data = await response.json();
        
        if (data.articles) {
          const formattedNews = data.articles.map((article: any) => ({
            title: article.title,
            source: article.source.name,
            date: new Date(article.publishedAt).toLocaleDateString(),
          }));
          
          setNews(formattedNews);
        }
        setLoading(false);
      } catch (error) {
        setLoading(false);
        console.error("Error fetching news:", error);
      }
    };

    fetchNews();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-pink-50">
      <DashboardHeader />
      <main className="container mx-auto px-4 py-8 space-y-6">
        <Button variant="ghost" onClick={() => navigate("/dashboard")}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Dashboard
        </Button>

        <Card className="glass-card p-8 animate-fade-in">
          <div className="mb-6">
            <h1 className="text-3xl font-bold gradient-text mb-2">Health Resources</h1>
            <p className="text-muted-foreground">Curated content for your wellbeing</p>
          </div>

          <div className="relative mb-6">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search articles, videos, and more..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-white/50"
            />
          </div>

          <Tabs defaultValue="articles" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="articles">
                <BookOpen className="mr-2 h-4 w-4" />
                Articles
              </TabsTrigger>
              <TabsTrigger value="videos">
                <Video className="mr-2 h-4 w-4" />
                Videos
              </TabsTrigger>
              <TabsTrigger value="news">
                <Newspaper className="mr-2 h-4 w-4" />
                News
              </TabsTrigger>
            </TabsList>

            <TabsContent value="articles" className="mt-6">
              <div className="grid md:grid-cols-2 gap-6">
                {articles.map((article, index) => (
                  <Card key={index} className="p-6 hover-lift cursor-pointer group">
                    <div className="text-5xl mb-4">{article.image}</div>
                    <Badge className="mb-2">{article.category}</Badge>
                    <h3 className="text-xl font-semibold mb-2 group-hover:text-primary transition-colors">
                      {article.title}
                    </h3>
                    <p className="text-sm text-muted-foreground mb-4">{article.excerpt}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-muted-foreground">{article.readTime}</span>
                      <Button variant="ghost" size="sm" className="text-primary">
                        Read More →
                      </Button>
                    </div>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="videos" className="mt-6">
              <div className="grid md:grid-cols-3 gap-6">
                {videos.map((video, index) => (
                  <Card key={index} className="p-6 hover-lift cursor-pointer group">
                    <div className="text-6xl mb-4 text-center">{video.thumbnail}</div>
                    <h3 className="font-semibold mb-2 group-hover:text-primary transition-colors">
                      {video.title}
                    </h3>
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span>{video.duration}</span>
                      <span>{video.views}</span>
                    </div>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="news" className="mt-6">
              <div className="space-y-4">
                {news.map((item, index) => (
                  <Card key={index} className="p-6 hover-lift cursor-pointer group">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold mb-2 group-hover:text-primary transition-colors">
                          {item.title}
                        </h3>
                        <div className="flex items-center gap-3 text-sm text-muted-foreground">
                          <span>{item.source}</span>
                          <span>•</span>
                          <span>{item.date}</span>
                        </div>
                      </div>
                      <Newspaper className="h-8 w-8 text-primary ml-4" />
                    </div>
                  </Card>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </Card>

        <Card className="glass-card p-6 bg-gradient-to-r from-primary/10 to-secondary/10 border-primary">
          <div className="flex items-start gap-4">
            <Heart className="h-12 w-12 text-primary flex-shrink-0" />
            <div>
              <h3 className="text-xl font-semibold mb-2">Need More Help?</h3>
              <p className="text-muted-foreground mb-4">
                Can't find what you're looking for? Our AI assistant is here to answer your questions 24/7.
              </p>
              <Button onClick={() => navigate("/chat")} className="gradient-primary">
                Chat with AI Assistant
              </Button>
            </div>
          </div>
        </Card>
      </main>
    </div>
  );
};

export default Resources;

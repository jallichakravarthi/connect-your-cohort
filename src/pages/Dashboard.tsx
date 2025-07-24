import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Users, MessageSquare, UserPlus, TrendingUp } from "lucide-react";
import { connections, forum, alumni } from "@/services/api";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalAlumni: 0,
    totalPosts: 0,
    pendingRequests: 0,
  });
  const [recentPosts, setRecentPosts] = useState([]);
  const [connectionRequests, setConnectionRequests] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        const [alumniData, forumData, requestsData] = await Promise.all([
          alumni.getAll(),
          forum.getAllPosts(),
          connections.getReceived(),
        ]);

        setStats({
          totalAlumni: alumniData.length || 0,
          totalPosts: forumData.length || 0,
          pendingRequests: requestsData.length || 0,
        });

        setRecentPosts(forumData.slice(0, 3) || []);
        setConnectionRequests(requestsData.slice(0, 3) || []);
      } catch (error) {
        console.error('Failed to load dashboard data:', error);
      }
    };

    loadDashboardData();
  }, []);

  const statCards = [
    {
      title: "Alumni Network",
      value: stats.totalAlumni,
      description: "Connected professionals",
      icon: Users,
      action: () => navigate('/alumni'),
    },
    {
      title: "Forum Posts",
      value: stats.totalPosts,
      description: "Active discussions",
      icon: MessageSquare,
      action: () => navigate('/forum'),
    },
    {
      title: "Connection Requests",
      value: stats.pendingRequests,
      description: "Pending requests",
      icon: UserPlus,
      action: () => navigate('/connections'),
    },
  ];

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">Welcome to CampusConnect</h1>
        <p className="text-muted-foreground">Your hub for alumni networking and professional growth</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {statCards.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index} className="hover:shadow-elegant transition-all duration-200 cursor-pointer" onClick={stat.action}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                <Icon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-primary">{stat.value}</div>
                <p className="text-xs text-muted-foreground">{stat.description}</p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Forum Posts */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="h-5 w-5" />
                Recent Discussions
              </CardTitle>
              <Button variant="outline" size="sm" onClick={() => navigate('/forum')}>
                View All
              </Button>
            </div>
            <CardDescription>Latest forum activity</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentPosts.length > 0 ? (
                recentPosts.map((post: any, index) => (
                  <div key={index} className="border-l-4 border-primary/20 pl-4 py-2">
                    <h4 className="font-medium text-sm">{post.title}</h4>
                    <p className="text-xs text-muted-foreground mt-1">{post.content?.substring(0, 100)}...</p>
                    <div className="flex items-center gap-2 mt-2">
                      <Badge variant="secondary" className="text-xs">
                        {post.user?.name || 'Anonymous'}
                      </Badge>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-sm text-muted-foreground">No recent posts available</p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Connection Requests */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <UserPlus className="h-5 w-5" />
                Connection Requests
              </CardTitle>
              <Button variant="outline" size="sm" onClick={() => navigate('/connections')}>
                Manage
              </Button>
            </div>
            <CardDescription>Pending connection requests</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {connectionRequests.length > 0 ? (
                connectionRequests.map((request: any, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border border-border rounded-lg">
                    <div>
                      <h4 className="font-medium text-sm">{request.sender?.name}</h4>
                      <p className="text-xs text-muted-foreground">{request.sender?.email}</p>
                    </div>
                    <Badge variant="outline">{request.status}</Badge>
                  </div>
                ))
              ) : (
                <p className="text-sm text-muted-foreground">No pending requests</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Quick Actions
          </CardTitle>
          <CardDescription>Common tasks to get you started</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Button variant="outline" onClick={() => navigate('/alumni')} className="h-20 flex flex-col">
              <Users className="h-6 w-6 mb-2" />
              Browse Alumni
            </Button>
            <Button variant="outline" onClick={() => navigate('/forum')} className="h-20 flex flex-col">
              <MessageSquare className="h-6 w-6 mb-2" />
              Join Discussion
            </Button>
            <Button variant="outline" onClick={() => navigate('/profile')} className="h-20 flex flex-col">
              <UserPlus className="h-6 w-6 mb-2" />
              Update Profile
            </Button>
            <Button variant="hero" onClick={() => navigate('/chatbot')} className="h-20 flex flex-col">
              <MessageSquare className="h-6 w-6 mb-2" />
              Ask Chatbot
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;
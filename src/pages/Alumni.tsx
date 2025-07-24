import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, MapPin, Building, Mail, UserPlus } from "lucide-react";
import { alumni, connections } from "@/services/api";
import { useToast } from "@/hooks/use-toast";

const Alumni = () => {
  const [alumniList, setAlumniList] = useState([]);
  const [filteredAlumni, setFilteredAlumni] = useState([]);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [searchCompany, setSearchCompany] = useState("");
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    loadAlumni();
  }, []);

  const loadAlumni = async () => {
    try {
      const data = await alumni.getAll();
      setAlumniList(data || []);
      setFilteredAlumni(data || []);
    } catch (error) {
      console.error('Failed to load alumni:', error);
      toast({
        title: "Error",
        description: "Failed to load alumni data",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    if (!searchKeyword && !searchCompany) {
      setFilteredAlumni(alumniList);
      return;
    }

    try {
      const data = await alumni.search(searchKeyword, searchCompany);
      setFilteredAlumni(data || []);
    } catch (error) {
      console.error('Search failed:', error);
      toast({
        title: "Search failed",
        description: "Unable to search alumni",
        variant: "destructive",
      });
    }
  };

  const handleConnect = async (alumniId: number) => {
    try {
      await connections.send(alumniId);
      toast({
        title: "Connection request sent!",
        description: "Your request has been sent to the alumni",
      });
    } catch (error) {
      console.error('Failed to send connection request:', error);
      toast({
        title: "Failed to connect",
        description: "Unable to send connection request",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <div className="p-6 max-w-7xl mx-auto">
        <div className="text-center py-12">
          <p className="text-muted-foreground">Loading alumni...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">Alumni Network</h1>
        <p className="text-muted-foreground">Connect with professionals from your institution</p>
      </div>

      {/* Search Section */}
      <Card className="shadow-elegant">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="h-5 w-5" />
            Search Alumni
          </CardTitle>
          <CardDescription>Find alumni by expertise or company</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <Input
                placeholder="Search by expertise, skills, or field"
                value={searchKeyword}
                onChange={(e) => setSearchKeyword(e.target.value)}
              />
            </div>
            <div className="flex-1">
              <Input
                placeholder="Search by company name"
                value={searchCompany}
                onChange={(e) => setSearchCompany(e.target.value)}
              />
            </div>
            <Button onClick={handleSearch} variant="hero">
              <Search className="h-4 w-4 mr-2" />
              Search
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Alumni Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredAlumni.length > 0 ? (
          filteredAlumni.map((person: any, index) => (
            <Card key={index} className="hover:shadow-elegant transition-all duration-200">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-lg">{person.name || 'Alumni Member'}</CardTitle>
                    <CardDescription className="flex items-center gap-1 mt-1">
                      <Mail className="h-3 w-3" />
                      {person.email || person.user?.email}
                    </CardDescription>
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleConnect(person.id || person.user?.id)}
                  >
                    <UserPlus className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                {person.company && (
                  <div className="flex items-center gap-2 text-sm">
                    <Building className="h-4 w-4 text-muted-foreground" />
                    <span>{person.company}</span>
                  </div>
                )}
                
                {person.location && (
                  <div className="flex items-center gap-2 text-sm">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <span>{person.location}</span>
                  </div>
                )}

                {person.expertise && (
                  <div>
                    <p className="text-sm font-medium mb-2">Expertise:</p>
                    <div className="flex flex-wrap gap-1">
                      {person.expertise.split(',').map((skill: string, skillIndex: number) => (
                        <Badge key={skillIndex} variant="secondary" className="text-xs">
                          {skill.trim()}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {person.bio && (
                  <div>
                    <p className="text-sm font-medium mb-1">Bio:</p>
                    <p className="text-sm text-muted-foreground">{person.bio}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          ))
        ) : (
          <div className="col-span-full text-center py-12">
            <p className="text-muted-foreground">No alumni found matching your search criteria</p>
            <Button variant="outline" onClick={() => {
              setSearchKeyword("");
              setSearchCompany("");
              setFilteredAlumni(alumniList);
            }} className="mt-4">
              Clear Search
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Alumni;
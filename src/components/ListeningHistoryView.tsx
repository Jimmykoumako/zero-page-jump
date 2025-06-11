
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Clock, TrendingUp, Trash2, Play, BarChart3, Calendar } from 'lucide-react';
import { useListeningHistory } from '@/hooks/useListeningHistory';
import { format, isToday, isYesterday } from 'date-fns';

const ListeningHistoryView = () => {
  const {
    history,
    isLoading,
    getRecentlyPlayed,
    getMostPlayedHymns,
    clearHistory
  } = useListeningHistory();

  const [groupedHistory, setGroupedHistory] = useState<Record<string, any[]>>({});

  useEffect(() => {
    // Group history by date
    const grouped = history.reduce((acc, entry) => {
      const date = new Date(entry.played_at);
      let dateKey = '';
      
      if (isToday(date)) {
        dateKey = 'Today';
      } else if (isYesterday(date)) {
        dateKey = 'Yesterday';
      } else {
        dateKey = format(date, 'MMMM d, yyyy');
      }
      
      if (!acc[dateKey]) {
        acc[dateKey] = [];
      }
      acc[dateKey].push(entry);
      return acc;
    }, {} as Record<string, any[]>);

    setGroupedHistory(grouped);
  }, [history]);

  const recentlyPlayed = getRecentlyPlayed();
  const mostPlayed = getMostPlayedHymns();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Listening History</h1>
          <p className="text-muted-foreground">
            Track your hymn listening activity and discover patterns
          </p>
        </div>
        {history.length > 0 && (
          <Button variant="outline" size="sm" onClick={clearHistory}>
            <Trash2 className="w-4 h-4 mr-2" />
            Clear History
          </Button>
        )}
      </div>

      {history.length === 0 ? (
        <Card>
          <CardContent className="p-8 text-center">
            <Clock className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-lg font-semibold mb-2">No listening history yet</h3>
            <p className="text-muted-foreground">
              Start playing hymns and your listening activity will appear here.
            </p>
          </CardContent>
        </Card>
      ) : (
        <Tabs defaultValue="recent" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="recent" className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              Recent
            </TabsTrigger>
            <TabsTrigger value="top" className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4" />
              Most Played
            </TabsTrigger>
            <TabsTrigger value="timeline" className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              Timeline
            </TabsTrigger>
          </TabsList>

          <TabsContent value="recent" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="w-5 h-5" />
                  Recently Played
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {recentlyPlayed.map((entry) => (
                    <div
                      key={entry.id}
                      className="flex items-center justify-between p-3 rounded-lg border hover:bg-muted/50 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div className="bg-primary/10 rounded-lg p-2">
                          <Play className="w-4 h-4 text-primary" />
                        </div>
                        <div>
                          <h4 className="font-medium">{entry.hymn_title}</h4>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <span>{entry.artist_name}</span>
                            {entry.hymn_number && (
                              <>
                                <span>•</span>
                                <Badge variant="secondary" className="text-xs">
                                  #{entry.hymn_number}
                                </Badge>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-muted-foreground">
                          {format(new Date(entry.played_at), 'h:mm a')}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {format(new Date(entry.played_at), 'MMM d')}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="top" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="w-5 h-5" />
                  Most Played Hymns
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {mostPlayed.map((hymn, index) => (
                    <div
                      key={hymn.hymnId}
                      className="flex items-center justify-between p-3 rounded-lg border"
                    >
                      <div className="flex items-center gap-3">
                        <div className="bg-primary/10 rounded-lg p-2 min-w-[2rem] text-center">
                          <span className="text-sm font-bold text-primary">
                            #{index + 1}
                          </span>
                        </div>
                        <div>
                          <h4 className="font-medium">{hymn.hymnTitle}</h4>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <span>Played {hymn.count} times</span>
                            {hymn.hymnNumber && (
                              <>
                                <span>•</span>
                                <Badge variant="secondary" className="text-xs">
                                  #{hymn.hymnNumber}
                                </Badge>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                      {hymn.lastPlayed && (
                        <div className="text-right">
                          <p className="text-sm text-muted-foreground">
                            Last played
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {format(new Date(hymn.lastPlayed), 'MMM d, h:mm a')}
                          </p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="timeline" className="space-y-4">
            {Object.entries(groupedHistory).map(([dateKey, entries]) => (
              <Card key={dateKey}>
                <CardHeader>
                  <CardTitle className="text-lg">{dateKey}</CardTitle>
                  <p className="text-sm text-muted-foreground">
                    {entries.length} songs played
                  </p>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {entries.map((entry) => (
                      <div
                        key={entry.id}
                        className="flex items-center justify-between p-2 rounded border-l-4 border-l-primary/20 bg-muted/30"
                      >
                        <div className="flex items-center gap-3">
                          <span className="text-xs text-muted-foreground min-w-[3rem]">
                            {format(new Date(entry.played_at), 'h:mm a')}
                          </span>
                          <div>
                            <p className="font-medium text-sm">{entry.hymn_title}</p>
                            <p className="text-xs text-muted-foreground">
                              {entry.artist_name}
                            </p>
                          </div>
                        </div>
                        {entry.hymn_number && (
                          <Badge variant="outline" className="text-xs">
                            #{entry.hymn_number}
                          </Badge>
                        )}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
};

export default ListeningHistoryView;

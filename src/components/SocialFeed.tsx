import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Badge } from "./ui/badge";

const activities = [
  {
    user: "Alex",
    avatar: "A",
    action: "added to watchlist",
    media: "Dune: Part Two",
    time: "2m ago",
  },
  {
    user: "Sam",
    avatar: "S",
    action: "rated 5/5",
    media: "Elden Ring",
    time: "15m ago",
  },
  {
    user: "Jordan",
    avatar: "J",
    action: "completed",
    media: "The Bear S3",
    time: "1h ago",
  },
  {
    user: "Taylor",
    avatar: "T",
    action: "started watching",
    media: "Shogun",
    time: "2h ago",
  },
];

export const SocialFeed = () => {
  return (
    <div className="p-6 space-y-6">
      <div>
        <h2 className="text-xl font-heading font-bold mb-1">Friend Activity</h2>
        <p className="text-sm text-muted-foreground">See what others are watching</p>
      </div>

      <div className="space-y-4">
        {activities.map((activity, index) => (
          <div
            key={index}
            className="flex items-start gap-3 p-3 rounded-sm hover:bg-accent/30 transition-colors animate-slide-in"
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            <Avatar className="h-10 w-10 border-2 border-primary">
              <AvatarFallback className="bg-primary text-primary-foreground font-bold">
                {activity.avatar}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 space-y-1">
              <p className="text-sm">
                <span className="font-semibold">{activity.user}</span>{" "}
                <span className="text-muted-foreground">{activity.action}</span>
              </p>
              <p className="text-sm font-medium">{activity.media}</p>
              <p className="text-xs mono text-muted-foreground">{activity.time}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="pt-4 border-t-2 border-border">
        <h3 className="text-sm font-semibold mb-3">Trending Now</h3>
        <div className="flex flex-wrap gap-2">
          <Badge variant="secondary" className="brutal-shadow">🔥 Dune 2</Badge>
          <Badge variant="secondary" className="brutal-shadow">⚔️ Elden Ring</Badge>
          <Badge variant="secondary" className="brutal-shadow">🎭 The Bear</Badge>
        </div>
      </div>
    </div>
  );
};

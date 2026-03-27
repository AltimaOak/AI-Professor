import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  BarChart3,
  BookOpen,
  Brain,
  Upload,
  FileUp,
  ArrowRight,
  Clock,
  Send,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import StatCard from "@/components/StatCard";
import FileCard from "@/components/FileCard";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { queryGeneral, fetchFiles, UploadedFileDto } from "@/lib/api";

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [quickAsk, setQuickAsk] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFileDto[]>([]);
  const [recentQuestions, setRecentQuestions] = useState<{ q: string; time: string }[]>([]);

  useEffect(() => {
    if (user) {
      fetchFiles().then(setUploadedFiles).catch(console.error);
    }
  }, [user]);

  const handleQuickAsk = async () => {
    if (!quickAsk.trim()) return;
    setIsLoading(true);
    try {
      const res = await queryGeneral(quickAsk);
      toast.success("AI Professor Answered", {
        description: res.answer,
        duration: 10000,
      });
      setRecentQuestions((prev) =>
        [{ q: quickAsk, time: "Just now" }, ...prev].slice(0, 5)
      );
      setQuickAsk("");
    } catch {
      toast.error("Failed to get answer");
    } finally {
      setIsLoading(false);
    }
  };

  const hour = new Date().getHours();
  const greeting =
    hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening";

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-20 pb-12 px-4 max-w-7xl mx-auto">

        {/* Greeting */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground">
            {greeting}, {user?.name} 👋
          </h1>
          <p className="text-text-secondary mt-1">
            Ready to study? Here's where you left off.
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
          <StatCard label="Sessions" value="-" icon={Clock} />
          <StatCard label="Topics Covered" value="-" icon={BookOpen} />
          <StatCard label="Quiz Score Avg" value="-" icon={BarChart3} />
          <StatCard label="Files Uploaded" value={uploadedFiles.length} icon={FileUp} />
        </div>

        <div className="grid lg:grid-cols-3 gap-8">

          {/* Left — files */}
          <div className="lg:col-span-2 space-y-4">
            <h2 className="text-xl font-bold text-foreground">
              Your Uploaded Syllabi
            </h2>
            {uploadedFiles.length > 0 ? (
              <div className="space-y-3">
                {uploadedFiles.map((f) => (
                  <FileCard
                    key={f.name}
                    name={f.name}
                    type={f.type}
                    date="Uploaded recently"
                    onAsk={() => navigate("/syllabus")}
                    onDelete={() =>
                      setUploadedFiles((prev) =>
                        prev.filter((file) => file.name !== f.name)
                      )
                    }
                  />
                ))}
              </div>
            ) : (
              <div className="border-2 border-dashed border-primary/30 rounded-2xl p-12 text-center">
                <Upload className="h-10 w-10 text-primary/40 mx-auto mb-3" />
                <p className="text-text-secondary">
                  No files uploaded yet. Upload your first syllabus.
                </p>
              </div>
            )}
            <Button
              variant="outline"
              className="w-full border-primary/30 text-primary hover:bg-accent-soft rounded-xl h-11 font-medium"
            >
              <Upload className="h-4 w-4 mr-2" />
              Upload New File
            </Button>
          </div>

          {/* Right — quick ask + recent */}
          <div className="space-y-6">
            <div className="bg-card rounded-2xl border border-primary/[0.15] p-5">
              <h3 className="font-bold text-foreground mb-3">Quick Ask</h3>
              <div className="flex gap-2">
                <Input
                  value={quickAsk}
                  onChange={(e) => setQuickAsk(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleQuickAsk()}
                  placeholder="Ask your professor anything..."
                  className="bg-bg-tertiary border-primary/20 text-foreground flex-1"
                />
                <Button
                  size="icon"
                  onClick={handleQuickAsk}
                  disabled={!quickAsk.trim() || isLoading}
                  className="bg-primary text-primary-foreground hover:bg-accent-hover rounded-xl shrink-0"
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div className="bg-card rounded-2xl border border-primary/[0.15] p-5">
              <h3 className="font-bold text-foreground mb-3">Recent Activity</h3>
              {recentQuestions.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                  No recent questions yet.
                </p>
              ) : (
                <div className="space-y-3">
                  {recentQuestions.map((rq, idx) => (
                    <div
                      key={idx}
                      className="flex justify-between items-start gap-2"
                    >
                      <p className="text-sm text-foreground/80 leading-snug">
                        {rq.q}
                      </p>
                      <span className="text-xs text-muted-foreground whitespace-nowrap">
                        {rq.time}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Jump back in */}
        <div className="mt-12">
          <h2 className="text-xl font-bold text-foreground mb-4">
            Jump Back In
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-card rounded-2xl border border-primary/[0.15] p-6 hover:border-primary/30 transition-all duration-200">
              <Badge className="bg-primary text-primary-foreground text-xs mb-3">
                Active
              </Badge>
              <h3 className="text-lg font-bold text-foreground mb-2">
                Syllabus Mode
              </h3>
              <p className="text-sm text-text-secondary mb-4">
                Continue studying from your uploaded material.
              </p>
              <Button
                asChild
                className="bg-primary text-primary-foreground hover:bg-accent-hover rounded-xl font-semibold"
              >
                <Link to="/syllabus">
                  Open <ArrowRight className="h-4 w-4 ml-1" />
                </Link>
              </Button>
            </div>
            <div className="bg-card rounded-2xl border border-muted-foreground/20 p-6 opacity-70">
              <Badge
                variant="outline"
                className="border-muted-foreground/30 text-muted-foreground text-xs mb-3"
              >
                Coming Soon
              </Badge>
              <h3 className="text-lg font-bold text-foreground mb-2">
                General Mode
              </h3>
              <p className="text-sm text-text-secondary mb-4">
                Ask about any topic — unrestricted knowledge.
              </p>
              <Button disabled className="rounded-xl opacity-50">
                Coming Soon
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
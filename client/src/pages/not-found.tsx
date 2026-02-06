import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { AlertCircle } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-slate-50">
      <Card className="w-full max-w-md mx-4 p-8 text-center bg-white shadow-xl">
        <div className="flex justify-center mb-6">
          <AlertCircle className="h-16 w-16 text-orange-500" />
        </div>
        <h1 className="text-3xl font-bold text-slate-900 mb-4 font-display">404 Page Not Found</h1>
        <p className="text-slate-500 mb-8">
          The page you are looking for does not exist or has been moved.
        </p>
        <Link href="/">
          <Button className="w-full bg-primary hover:bg-primary/90">
            Return to Home
          </Button>
        </Link>
      </Card>
    </div>
  );
}

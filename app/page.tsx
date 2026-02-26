import { Loader2 } from "lucide-react";

export default function Home(){
    return (
        <div className="min-h-screen bg-linear-to-br from-background via-muted/30 to-primary/5 flex items-center justify-center p-4">
            <div className="text-center space-y-4">
                <Loader2 className="w-8 h-8 animate-spin mx-auto" />
                <p className="text-muted-foreground">Loading...</p>
            </div>
        </div>
    )
}
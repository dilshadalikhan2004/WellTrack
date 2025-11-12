
import { AiInsightsGenerator } from "@/components/insights/ai-insights-generator";
import { AiStressPredictor } from "@/components/insights/ai-stress-predictor";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BrainCircuit, Clock } from "lucide-react";

export default function InsightsPage() {
    return (
        <div className="flex flex-col min-h-screen">
            <header className="sticky top-0 z-10 hidden h-16 px-4 border-b shrink-0 bg-background/80 backdrop-blur-sm md:px-6 md:flex md:items-center">
                <h1 className="text-xl font-semibold">AI-Powered Insights</h1>
            </header>
            <div className="flex-1 p-4 space-y-6 bg-muted/40 md:p-8">
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                           <BrainCircuit className="w-6 h-6 text-primary"/> Your Personal Wellness Engine
                        </CardTitle>
                        <CardDescription>
                            Leverage the power of AI to understand your habits, mood, and overall well-being. Generate a report below to discover correlations and receive personalized recommendations.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <AiInsightsGenerator />
                    </CardContent>
                </Card>
                 <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                           <Clock className="w-6 h-6 text-primary"/> AI Stress Forecaster
                        </CardTitle>
                        <CardDescription>
                            Based on your upcoming schedule and past mood patterns, the AI can predict potential high-stress periods, helping you prepare and manage them proactively.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <AiStressPredictor />
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}

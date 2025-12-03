
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Phone, MessageSquare } from "lucide-react";

const crisisResources = [
    {
        name: "Crisis Text Line",
        description: "Text HOME to 741741 from anywhere in the US, anytime, about any type of crisis.",
        action: "Text HOME to 741741",
        icon: MessageSquare,
        href: "sms:741741&body=HOME"
    },
    {
        name: "988 Suicide & Crisis Lifeline",
        description: "Call or text 988 anytime in the US to be connected to a trained counselor.",
        action: "Call 988",
        icon: Phone,
        href: "tel:988"
    }
]

export function ImmediateHelp() {
    return (
        <Card className="border-destructive/50 bg-destructive/5 hover">
            <CardHeader>
                <CardTitle className="flex items-center gap-2 text-destructive">
                    <Phone className="w-6 h-6" /> Immediate Help
                </CardTitle>
                <CardDescription className="text-destructive/80">
                    If you are in a crisis or any other person may be in danger, use these resources immediately.
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                {crisisResources.map(resource => (
                    <div key={resource.name} className="flex items-start gap-4 p-4 border-l-4 rounded-md bg-background border-destructive">
                        <resource.icon className="w-8 h-8 mt-1 text-destructive shrink-0" />
                        <div>
                            <h4 className="font-semibold">{resource.name}</h4>
                            <p className="text-sm text-muted-foreground">{resource.description}</p>
                             <Button variant="destructive" size="sm" className="mt-2" asChild>
                                <a href={resource.href}>{resource.action}</a>
                            </Button>
                        </div>
                    </div>
                ))}
            </CardContent>
        </Card>
    );
}

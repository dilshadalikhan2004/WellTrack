
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ShieldAlert, Phone, HeartHandshake } from 'lucide-react';
import { ImmediateHelp } from '@/components/safety/immediate-help';
import { EmergencyContacts } from '@/components/safety/emergency-contacts';
import { CopingStrategies } from '@/components/safety/coping-strategies';

export default function SafetyPage() {
    return (
        <div className="flex flex-col min-h-screen">
            <header className="sticky top-0 z-10 hidden h-16 px-4 border-b shrink-0 bg-background/80 backdrop-blur-sm md:px-6 md:flex md:items-center">
                <h1 className="flex items-center gap-2 text-xl font-semibold">
                    <ShieldAlert className="w-6 h-6" />
                    Safety Plan
                </h1>
            </header>
            <main className="flex-1 p-4 space-y-6 bg-muted/40 md:p-8">
                <Card>
                    <CardHeader>
                        <CardTitle>Your Safety & Support Hub</CardTitle>
                        <CardDescription>
                            This is your space for crisis management and emergency preparedness. Use these resources when you need immediate support.
                        </CardDescription>
                    </CardHeader>
                </Card>

                <div className="grid gap-6 lg:grid-cols-2">
                    <ImmediateHelp />
                    <EmergencyContacts />
                </div>
                
                <CopingStrategies />

            </main>
        </div>
    );
}

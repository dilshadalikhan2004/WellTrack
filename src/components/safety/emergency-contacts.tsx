
'use client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { User, PhoneCall, PlusCircle } from "lucide-react";
import { mockSafetyPlan } from "@/lib/data";

export function EmergencyContacts() {
    // In a real app, this would use state and connect to a database
    const contacts = mockSafetyPlan.emergencyContacts;

    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between">
                <div>
                    <CardTitle className="flex items-center gap-2">
                        <User className="w-6 h-6" /> Personal Contacts
                    </CardTitle>
                    <CardDescription>
                        Your trusted friends, family, or professionals.
                    </CardDescription>
                </div>
                <Button size="sm" variant="outline">
                    <PlusCircle className="w-4 h-4 mr-2" /> Add Contact
                </Button>
            </CardHeader>
            <CardContent className="space-y-4">
                 {contacts.map(contact => (
                    <div key={contact.id} className="flex items-center justify-between p-4 rounded-lg bg-muted/50">
                        <div>
                            <p className="font-semibold">{contact.name}</p>
                            <p className="text-sm text-muted-foreground">{contact.relationship}</p>
                        </div>
                        <Button asChild>
                            <a href={`tel:${contact.phone}`}>
                                <PhoneCall className="w-4 h-4 mr-2"/>
                                Call
                            </a>
                        </Button>
                    </div>
                 ))}
            </CardContent>
        </Card>
    );
}

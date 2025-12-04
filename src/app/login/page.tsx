
'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/firebase';
import { useToast } from '@/hooks/use-toast';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
  type AuthError,
} from 'firebase/auth';
import { useRouter } from 'next/navigation';
import { useState, useEffect, type FormEvent } from 'react';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [resetLoading, setResetLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('login');
  const auth = useAuth();
  const router = useRouter();
  const { toast } = useToast();

  const handleAuthError = (error: AuthError) => {
    console.error(error);
    let message = 'An unknown error occurred.';
    switch (error.code) {
      case 'auth/user-not-found':
      case 'auth/wrong-password':
        message = 'Invalid email or password.';
        break;
      case 'auth/email-already-in-use':
        message = 'An account with this email already exists.';
        break;
      case 'auth/weak-password':
        message = 'The password is too weak.';
        break;
      default:
        message = error.message;
        break;
    }
    toast({
      variant: 'destructive',
      title: 'Authentication Failed',
      description: message,
    });
  };


  const handleLogin = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      router.push('/');
    } catch (error) {
      handleAuthError(error as AuthError);
    } finally {
      setLoading(false);
    }
  };

  const handleSignup = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      router.push('/');
    } catch (error) {
        handleAuthError(error as AuthError);
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    if (!email) {
      toast({
        variant: 'destructive',
        title: 'Email Required',
        description: 'Please enter your email address first.',
      });
      return;
    }
    
    setResetLoading(true);
    try {
      await sendPasswordResetEmail(auth, email);
      toast({
        title: 'Reset Email Sent',
        description: 'Check your email for password reset instructions.',
      });
    } catch (error) {
      handleAuthError(error as AuthError);
    } finally {
      setResetLoading(false);
    }
  };

  const handleTabChange = (value: string) => {
    setActiveTab(value);
    setEmail('');
    setPassword('');
  };

  useEffect(() => {
    // Clear form when component mounts
    setEmail('');
    setPassword('');
  }, []);

  useEffect(() => {
    setActiveTab('login');
  }, []);

  return (
    <div className="flex items-center justify-center min-h-screen bg-muted/40">
      <Tabs value={activeTab} onValueChange={handleTabChange} className="w-[400px]">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="login">Login</TabsTrigger>
          <TabsTrigger value="signup">Sign Up</TabsTrigger>
        </TabsList>
        <TabsContent value="login">
          <form onSubmit={handleLogin} autoComplete="off">
            <Card>
              <CardHeader>
                <CardTitle>Login</CardTitle>
                <CardDescription>Welcome back! Please enter your details.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="login-email">Email</Label>
                  <Input id="login-email" type="email" placeholder="m@example.com" required value={email} onChange={e => setEmail(e.target.value)} autoComplete="nope" name="email-new" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="login-password">Password</Label>
                  <Input id="login-password" type="password" required value={password} onChange={e => setPassword(e.target.value)} autoComplete="new-password" name="password-new" />
                </div>
              </CardContent>
              <CardFooter className="flex flex-col space-y-2">
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? 'Logging in...' : 'Login'}
                </Button>
                <Button type="button" variant="ghost" className="w-full" onClick={handleForgotPassword} disabled={resetLoading}>
                  {resetLoading ? 'Sending...' : 'Forgot Password?'}
                </Button>
              </CardFooter>
            </Card>
          </form>
        </TabsContent>
        <TabsContent value="signup">
          <form onSubmit={handleSignup}>
            <Card>
              <CardHeader>
                <CardTitle>Sign Up</CardTitle>
                <CardDescription>Create a new account to get started.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="signup-email">Email</Label>
                  <Input id="signup-email" type="email" placeholder="m@example.com" required value={email} onChange={e => setEmail(e.target.value)} autoComplete="off" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signup-password">Password</Label>
                  <Input id="signup-password" type="password" required value={password} onChange={e => setPassword(e.target.value)} autoComplete="new-password" />
                </div>
              </CardContent>
              <CardFooter>
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? 'Creating account...' : 'Sign Up'}
                </Button>
              </CardFooter>
            </Card>
          </form>
        </TabsContent>
      </Tabs>
    </div>
  );
}

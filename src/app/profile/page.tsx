
'use client';

import { useState, type FormEvent, type ChangeEvent, useEffect } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth, useUser, useFirestore, useDoc, useMemoFirebase } from '@/firebase';
import { useToast } from '@/hooks/use-toast';
import { updateProfile } from 'firebase/auth';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { Loader2, User as UserIcon, LogOut, Upload } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { signOut } from 'firebase/auth';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { compressImage } from '@/lib/image-utils';

export default function ProfilePage() {
  const { user, isUserLoading } = useUser();
  const auth = useAuth();
  const firestore = useFirestore();
  const router = useRouter();
  const { toast } = useToast();

  const userProfileRef = useMemoFirebase(() => {
    if (!firestore || !user) return null;
    return doc(firestore, `users/${user.uid}/user_profile`, user.uid);
  }, [firestore, user]);

  const { data: userProfile, isLoading: isProfileLoading } = useDoc(userProfileRef);

  const [displayName, setDisplayName] = useState('');
  const [photoURL, setPhotoURL] = useState('');
  const [age, setAge] = useState<number | ''>('');
  const [sex, setSex] = useState('');
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    if (user) {
      setDisplayName(user.displayName || '');
      setPhotoURL(user.photoURL || '');
    }
    if (userProfile) {
      setAge(userProfile.age || '');
      setSex(userProfile.sex || '');
    }
  }, [user, userProfile]);

  const handleAvatarChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setAvatarFile(file);
      setAvatarPreview(URL.createObjectURL(file));
    }
  };

  const handleUpdateProfile = async (e: FormEvent) => {
    e.preventDefault();
    if (!user || !firestore) return;

    setIsUpdating(true);
    let newPhotoURL = user.photoURL;

    try {
      if (avatarFile) {
        setIsUploading(true);
        const storage = getStorage();
        // Use original name but ensure it's unique or overwritten correctly. 
        // Compressing might change extension? No, usually keeps it.
        const storageRef = ref(storage, `avatars/${user.uid}/${avatarFile.name}`);

        try {
          console.log('Starting image compression...');
          // Compress the image
          const compressedFile = await compressImage(avatarFile, 0.7, 800);
          console.log('Image compressed, starting upload...', compressedFile);

          const snapshot = await uploadBytes(storageRef, compressedFile);
          console.log('Upload complete, getting URL...');
          newPhotoURL = await getDownloadURL(snapshot.ref);
          console.log('New photo URL:', newPhotoURL);
          setPhotoURL(newPhotoURL || '');
        } catch (error) {
          console.error('Error uploading avatar:', error);
          toast({
            variant: 'destructive',
            title: 'Upload Failed',
            description: 'Could not upload your new avatar. Check console for details.',
          });
          // Stop the profile update if image was the main intent? 
          // Or just continue? Continuing is safer for text fields. 
          // But let's unset the "uploading" state visually.
        } finally {
          setIsUploading(false);
        }
      }

      await updateProfile(user, {
        displayName: displayName,
        photoURL: newPhotoURL,
      });

      if (userProfileRef) {
        await setDoc(userProfileRef, {
          username: displayName,
          email: user.email,
          profilePictureUrl: newPhotoURL,
          age: age,
          sex: sex,
        }, { merge: true });
      }

      toast({
        title: 'Profile Updated',
        description: 'Your profile has been successfully updated.',
      });
      setAvatarFile(null);
      setAvatarPreview(null);
    } catch (error) {
      console.error(error);
      toast({
        variant: 'destructive',
        title: 'Update Failed',
        description: 'Could not update your profile. Please try again.',
      });
    } finally {
      setIsUpdating(false);
      setIsUploading(false);
    }
  };

  const handleLogout = async () => {
    await signOut(auth);
    router.push('/login');
  };

  const isLoading = isUserLoading || isProfileLoading;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  if (!user) {
    return null; // Or a message encouraging them to log in
  }

  return (
    <div className="flex flex-col min-h-screen">
      <header className="sticky top-0 z-10 hidden h-16 px-4 border-b shrink-0 bg-background/80 backdrop-blur-sm md:px-6 md:flex md:items-center">
        <h1 className="text-xl font-semibold">Profile & Settings</h1>
      </header>
      <main className="flex-1 p-4 bg-muted/40 md:p-8">
        <div className="max-w-2xl mx-auto space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Profile</CardTitle>
              <CardDescription>
                This is how others will see you on the site.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleUpdateProfile} className="space-y-6">
                <div className="flex items-center gap-4">
                  <Avatar className="w-20 h-20 border">
                    <AvatarImage src={avatarPreview || photoURL} alt="User Avatar" />
                    <AvatarFallback>
                      <UserIcon className="w-8 h-8" />
                    </AvatarFallback>
                  </Avatar>
                  <Button asChild variant="outline">
                    <label htmlFor="avatar-upload" className="cursor-pointer">
                      <Upload className="w-4 h-4 mr-2" />
                      Upload Photo
                      <input id="avatar-upload" type="file" className="sr-only" onChange={handleAvatarChange} accept="image/*" />
                    </label>
                  </Button>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" value={user.email || ''} disabled />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="displayName">Display Name</Label>
                  <Input
                    id="displayName"
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    placeholder="Your Name"
                  />
                </div>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="age">Age</Label>
                    <Input
                      id="age"
                      type="number"
                      value={age}
                      onChange={(e) => setAge(e.target.value === '' ? '' : parseInt(e.target.value, 10))}
                      placeholder="Your Age"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="sex">Sex</Label>
                    <Select value={sex} onValueChange={setSex}>
                      <SelectTrigger id="sex">
                        <SelectValue placeholder="Select..." />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Male">Male</SelectItem>
                        <SelectItem value="Female">Female</SelectItem>
                        <SelectItem value="Other">Other</SelectItem>
                        <SelectItem value="Prefer not to say">Prefer not to say</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="flex justify-end">
                  <Button type="submit" disabled={isUpdating}>
                    {(isUpdating || isUploading) && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                    {isUploading ? 'Uploading...' : isUpdating ? 'Saving...' : 'Update Profile'}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Account</CardTitle>
              <CardDescription>Manage your account settings.</CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="destructive" onClick={handleLogout}>
                <LogOut className="w-4 h-4 mr-2" />
                Log Out
              </Button>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}


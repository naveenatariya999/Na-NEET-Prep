'use client';
import * as React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MoreHorizontal, PlusCircle } from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useCollection, useFirestore, useUser, useMemoFirebase } from '@/firebase';
import { addDocumentNonBlocking, deleteDocumentNonBlocking, updateDocumentNonBlocking } from '@/firebase/non-blocking-updates';
import { collection, query, where, doc, serverTimestamp } from 'firebase/firestore';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { subjects } from '@/lib/data';

type Video = {
  id: string;
  title: string;
  subject: string;
  createdAt: { toDate: () => Date };
  visible: boolean;
  url: string;
  adminId: string;
  contentType: string;
};

function AddVideoDialog({ onVideoAdded }: { onVideoAdded: () => void }) {
  const [open, setOpen] = React.useState(false);
  const [title, setTitle] = React.useState('');
  const [subject, setSubject] = React.useState('');
  const [url, setUrl] = React.useState('');
  const firestore = useFirestore();
  const { user } = useUser();
  const { toast } = useToast();

  const handleSubmit = async () => {
    if (!title || !subject || !url || !user) {
      toast({
        variant: 'destructive',
        title: 'Missing fields',
        description: 'Please fill out all fields.',
      });
      return;
    }

    const newVideo = {
      title,
      subject,
      url,
      contentType: 'video',
      visible: true,
      adminId: user.uid,
      createdAt: serverTimestamp(),
    };

    addDocumentNonBlocking(collection(firestore, 'study_materials'), newVideo);
    
    toast({
      title: 'Video Added',
      description: `${title} has been added successfully.`,
    });

    onVideoAdded();
    setOpen(false);
    setTitle('');
    setSubject('');
    setUrl('');
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" className="h-8 gap-1">
          <PlusCircle className="h-3.5 w-3.5" />
          <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
            Add Video
          </span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add New Video</DialogTitle>
          <DialogDescription>
            Fill in the details for the new video. Click save when you're done.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="title" className="text-right">
              Title
            </Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="subject" className="text-right">
              Subject
            </Label>
             <Select onValueChange={setSubject} value={subject}>
                <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Select a subject" />
                </SelectTrigger>
                <SelectContent>
                    {subjects.map(s => (
                        <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>
                    ))}
                </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="url" className="text-right">
              URL
            </Label>
            <Input
              id="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              className="col-span-3"
              placeholder="e.g., YouTube video link"
            />
          </div>
        </div>
        <DialogFooter>
          <Button onClick={handleSubmit}>Save Video</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}


export default function AdminVideosPage() {
  const firestore = useFirestore();
  const { toast } = useToast();

  const videosQuery = useMemoFirebase(() => {
    return query(collection(firestore, 'study_materials'), where('contentType', '==', 'video'));
  }, [firestore]);

  const { data: videos, isLoading, error } = useCollection<Video>(videosQuery);

  const handleVisibilityChange = (videoId: string, newVisibility: boolean) => {
    const videoRef = doc(firestore, 'study_materials', videoId);
    updateDocumentNonBlocking(videoRef, { visible: newVisibility });
  };

  const handleDelete = (videoId: string) => {
    const videoRef = doc(firestore, 'study_materials', videoId);
    deleteDocumentNonBlocking(videoRef);
    toast({
      title: 'Video Deleted',
      description: 'The video has been successfully deleted.',
    });
  };

  return (
    <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
       <div className="flex items-center">
          <h1 className="text-lg font-semibold md:text-2xl font-headline">Videos</h1>
          <div className="ml-auto flex items-center gap-2">
            <AddVideoDialog onVideoAdded={() => {}} />
          </div>
        </div>
      <Card>
        <CardHeader>
          <CardTitle>Content Management</CardTitle>
          <CardDescription>
            Manage your videos. You can toggle visibility, edit, or delete them.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Subject</TableHead>
                <TableHead>Created At</TableHead>
                <TableHead>Visibility</TableHead>
                <TableHead>
                  <span className="sr-only">Actions</span>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading && <TableRow><TableCell colSpan={5} className="text-center">Loading videos...</TableCell></TableRow>}
              {error && <TableRow><TableCell colSpan={5} className="text-center text-destructive">Error: {error.message}</TableCell></TableRow>}
              {!isLoading && videos?.length === 0 && <TableRow><TableCell colSpan={5} className="text-center">No videos found.</TableCell></TableRow>}
              {videos?.map((video) => (
                <TableRow key={video.id}>
                  <TableCell className="font-medium">{video.title}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{video.subject}</Badge>
                  </TableCell>
                  <TableCell>{video.createdAt ? video.createdAt.toDate().toLocaleDateString() : 'N/A'}</TableCell>
                  <TableCell>
                    <Switch
                      checked={video.visible}
                      onCheckedChange={(checked) => handleVisibilityChange(video.id, checked)}
                      aria-label="Toggle video visibility"
                    />
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button aria-haspopup="true" size="icon" variant="ghost">
                          <MoreHorizontal className="h-4 w-4" />
                          <span className="sr-only">Toggle menu</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem onSelect={() => window.open(video.url, '_blank')}>View</DropdownMenuItem>
                        <DropdownMenuItem disabled>Edit</DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                            onSelect={() => handleDelete(video.id)}
                            className="text-destructive"
                        >
                            Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </main>
  );
}

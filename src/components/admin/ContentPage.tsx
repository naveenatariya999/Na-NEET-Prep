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
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { useCollection, useFirestore, useUser, useMemoFirebase } from '@/firebase';
import { addDocumentNonBlocking, deleteDocumentNonBlocking, updateDocumentNonBlocking } from '@/firebase/non-blocking-updates';
import { collection, query, where, doc, serverTimestamp } from 'firebase/firestore';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { subjects } from '@/lib/data';
import type { StudyMaterial } from '@/lib/types';

// Capitalize first letter helper
const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

function AddContentDialog({ contentType, onContentAdded }: { contentType: StudyMaterial['contentType'], onContentAdded: () => void }) {
  const [open, setOpen] = React.useState(false);
  const [title, setTitle] = React.useState('');
  const [subject, setSubject] = React.useState('');
  const [url, setUrl] = React.useState('');
  const firestore = useFirestore();
  const { user } = useUser();
  const { toast } = useToast();

  const contentTypeName = contentType === 'pyq' ? 'PYQ' : capitalize(contentType);

  const handleSubmit = async () => {
    if (!title || !subject || !url || !user) {
      toast({
        variant: 'destructive',
        title: 'Missing fields',
        description: 'Please fill out all fields.',
      });
      return;
    }

    const newContent = {
      title,
      subject,
      url,
      contentType,
      visible: true,
      adminId: user.uid,
      createdAt: serverTimestamp(),
    };

    addDocumentNonBlocking(collection(firestore, 'study_materials'), newContent);
    
    toast({
      title: `${contentTypeName} Added`,
      description: `${title} has been added successfully.`,
    });

    onContentAdded();
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
            Add {contentTypeName}
          </span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add New {contentTypeName}</DialogTitle>
          <DialogDescription>
            Fill in the details for the new {contentType}. Click save when you're done.
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
            <div className="col-span-3">
              <Input
                id="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="e.g., Google Drive/YouTube link"
              />
               <p className="text-xs text-muted-foreground mt-1">
                  For Google Drive, share with "Anyone with the link".
              </p>
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button onClick={handleSubmit}>Save {contentTypeName}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

interface ContentPageProps {
  contentType: StudyMaterial['contentType'];
  pageTitle: string;
}

export default function ContentPage({ contentType, pageTitle }: ContentPageProps) {
  const firestore = useFirestore();
  const { toast } = useToast();

  const contentQuery = useMemoFirebase(() => {
    return query(collection(firestore, 'study_materials'), where('contentType', '==', contentType));
  }, [firestore, contentType]);

  const { data: content, isLoading, error } = useCollection<StudyMaterial>(contentQuery);

  const handleVisibilityChange = (contentId: string, newVisibility: boolean) => {
    const contentRef = doc(firestore, 'study_materials', contentId);
    updateDocumentNonBlocking(contentRef, { visible: newVisibility });
  };

  const handleDelete = (contentId: string) => {
    const contentRef = doc(firestore, 'study_materials', contentId);
    deleteDocumentNonBlocking(contentRef);
    toast({
      title: `${capitalize(contentType)} Deleted`,
      description: `The ${contentType} has been successfully deleted.`,
    });
  };

  return (
    <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
       <div className="flex items-center">
          <h1 className="text-lg font-semibold md:text-2xl font-headline">{pageTitle}</h1>
          <div className="ml-auto flex items-center gap-2">
            <AddContentDialog contentType={contentType} onContentAdded={() => {}} />
          </div>
        </div>
      <Card>
        <CardHeader>
          <CardTitle>Content Management</CardTitle>
          <CardDescription>
            Manage your {pageTitle}. You can toggle visibility or delete them.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* Desktop View */}
          <div className="hidden md:block">
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
                {isLoading && <TableRow><TableCell colSpan={5} className="text-center">Loading {pageTitle}...</TableCell></TableRow>}
                {error && <TableRow><TableCell colSpan={5} className="text-center text-destructive">Error: {error.message}</TableCell></TableRow>}
                {!isLoading && content?.length === 0 && <TableRow><TableCell colSpan={5} className="text-center">No {pageTitle} found.</TableCell></TableRow>}
                {content?.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell className="font-medium">{item.title}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{item.subject}</Badge>
                    </TableCell>
                    <TableCell>{item.createdAt ? item.createdAt.toDate().toLocaleDateString() : 'N/A'}</TableCell>
                    <TableCell>
                      <Switch
                        checked={item.visible}
                        onCheckedChange={(checked) => handleVisibilityChange(item.id, checked)}
                        aria-label={`Toggle ${item.title} visibility`}
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
                          <DropdownMenuItem onSelect={() => window.open(item.url, '_blank')}>View</DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                              onSelect={() => handleDelete(item.id)}
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
          </div>
          {/* Mobile View */}
          <div className="grid gap-4 md:hidden">
              {isLoading && <p className="text-center">Loading {pageTitle}...</p>}
              {error && <p className="text-center text-destructive">Error: {error.message}</p>}
              {!isLoading && content?.length === 0 && <p className="text-center">No {pageTitle} found.</p>}
              {content?.map((item) => (
                <Card key={item.id} className="w-full">
                  <CardHeader className="flex flex-row items-start justify-between gap-4 pb-2">
                      <div>
                        <CardTitle className="text-lg leading-tight">{item.title}</CardTitle>
                        <p className="text-sm text-muted-foreground pt-1">{item.createdAt ? item.createdAt.toDate().toLocaleDateString() : 'N/A'}</p>
                      </div>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button aria-haspopup="true" size="icon" variant="ghost">
                            <MoreHorizontal className="h-4 w-4" />
                            <span className="sr-only">Toggle menu</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                           <DropdownMenuItem onSelect={() => window.open(item.url, '_blank')}>View</DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem onSelect={() => handleDelete(item.id)} className="text-destructive">
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                  </CardHeader>
                  <CardContent>
                      <Badge variant="outline">{item.subject}</Badge>
                  </CardContent>
                  <CardFooter className="flex items-center justify-between">
                      <Label htmlFor={`visible-${item.id}`} className="text-sm text-muted-foreground">Visible</Label>
                      <Switch
                        id={`visible-${item.id}`}
                        checked={item.visible}
                        onCheckedChange={(checked) => handleVisibilityChange(item.id, checked)}
                        aria-label={`Toggle ${item.title} visibility`}
                      />
                  </CardFooter>
                </Card>
              ))}
            </div>
        </CardContent>
      </Card>
    </main>
  );
}

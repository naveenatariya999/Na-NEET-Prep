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

type Note = {
  id: string;
  title: string;
  subject: string;
  createdAt: { toDate: () => Date };
  visible: boolean;
  url: string;
  adminId: string;
  contentType: string;
};

function AddNoteDialog({ onNoteAdded }: { onNoteAdded: () => void }) {
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

    const newNote = {
      title,
      subject,
      url,
      contentType: 'notes',
      visible: true,
      adminId: user.uid,
      createdAt: serverTimestamp(),
    };

    addDocumentNonBlocking(collection(firestore, 'study_materials'), newNote);
    
    toast({
      title: 'Note Added',
      description: `${title} has been added successfully.`,
    });

    onNoteAdded();
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
            Add Note
          </span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add New Note</DialogTitle>
          <DialogDescription>
            Fill in the details for the new study note. Click save when you're done.
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
                placeholder="e.g., Google Drive link"
              />
              <p className="text-xs text-muted-foreground mt-1">
                  For Google Drive, share with "Anyone with the link".
              </p>
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button onClick={handleSubmit}>Save Note</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}


export default function AdminNotesPage() {
  const firestore = useFirestore();
  const { toast } = useToast();

  const notesQuery = useMemoFirebase(() => {
    return query(collection(firestore, 'study_materials'), where('contentType', '==', 'notes'));
  }, [firestore]);

  const { data: notes, isLoading, error } = useCollection<Note>(notesQuery);

  const handleVisibilityChange = (noteId: string, newVisibility: boolean) => {
    const noteRef = doc(firestore, 'study_materials', noteId);
    updateDocumentNonBlocking(noteRef, { visible: newVisibility });
  };

  const handleDelete = (noteId: string) => {
    const noteRef = doc(firestore, 'study_materials', noteId);
    deleteDocumentNonBlocking(noteRef);
    toast({
      title: 'Note Deleted',
      description: 'The note has been successfully deleted.',
    });
  };

  return (
    <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
       <div className="flex items-center">
          <h1 className="text-lg font-semibold md:text-2xl font-headline">Notes</h1>
          <div className="ml-auto flex items-center gap-2">
            <AddNoteDialog onNoteAdded={() => {}} />
          </div>
        </div>
      <Card>
        <CardHeader>
          <CardTitle>Content Management</CardTitle>
          <CardDescription>
            Manage your study notes. You can toggle visibility, edit, or delete them.
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
                {isLoading && <TableRow><TableCell colSpan={5} className="text-center">Loading notes...</TableCell></TableRow>}
                {error && <TableRow><TableCell colSpan={5} className="text-center text-destructive">Error: {error.message}</TableCell></TableRow>}
                {!isLoading && notes?.length === 0 && <TableRow><TableCell colSpan={5} className="text-center">No notes found.</TableCell></TableRow>}
                {notes?.map((note) => (
                  <TableRow key={note.id}>
                    <TableCell className="font-medium">{note.title}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{note.subject}</Badge>
                    </TableCell>
                    <TableCell>{note.createdAt ? note.createdAt.toDate().toLocaleDateString() : 'N/A'}</TableCell>
                    <TableCell>
                      <Switch
                        checked={note.visible}
                        onCheckedChange={(checked) => handleVisibilityChange(note.id, checked)}
                        aria-label="Toggle note visibility"
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
                          <DropdownMenuItem onSelect={() => window.open(note.url, '_blank')}>View</DropdownMenuItem>
                          <DropdownMenuItem disabled>Edit</DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                              onSelect={() => handleDelete(note.id)}
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
              {isLoading && <p className="text-center">Loading notes...</p>}
              {error && <p className="text-center text-destructive">Error: {error.message}</p>}
              {!isLoading && notes?.length === 0 && <p className="text-center">No notes found.</p>}
              {notes?.map((note) => (
                <Card key={note.id} className="w-full">
                  <CardHeader className="flex flex-row items-start justify-between gap-4 pb-2">
                      <div>
                        <CardTitle className="text-lg leading-tight">{note.title}</CardTitle>
                        <p className="text-sm text-muted-foreground pt-1">{note.createdAt ? note.createdAt.toDate().toLocaleDateString() : 'N/A'}</p>
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
                           <DropdownMenuItem onSelect={() => window.open(note.url, '_blank')}>View</DropdownMenuItem>
                           <DropdownMenuItem disabled>Edit</DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem onSelect={() => handleDelete(note.id)} className="text-destructive">
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                  </CardHeader>
                  <CardContent>
                      <Badge variant="outline">{note.subject}</Badge>
                  </CardContent>
                  <CardFooter className="flex items-center justify-between">
                      <Label htmlFor={`visible-${note.id}`} className="text-sm text-muted-foreground">Visible</Label>
                      <Switch
                        id={`visible-${note.id}`}
                        checked={note.visible}
                        onCheckedChange={(checked) => handleVisibilityChange(note.id, checked)}
                        aria-label="Toggle note visibility"
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

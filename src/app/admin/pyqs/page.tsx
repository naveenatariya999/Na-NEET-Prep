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

type Pyq = {
  id: string;
  title: string;
  subject: string;
  createdAt: { toDate: () => Date };
  visible: boolean;
  url: string;
  adminId: string;
  contentType: string;
};

function AddPyqDialog({ onPyqAdded }: { onPyqAdded: () => void }) {
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

    const newPyq = {
      title,
      subject,
      url,
      contentType: 'pyq',
      visible: true,
      adminId: user.uid,
      createdAt: serverTimestamp(),
    };

    addDocumentNonBlocking(collection(firestore, 'study_materials'), newPyq);
    
    toast({
      title: 'PYQ Added',
      description: `${title} has been added successfully.`,
    });

    onPyqAdded();
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
            Add PYQ
          </span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add New PYQ</DialogTitle>
          <DialogDescription>
            Fill in the details for the new Previous Year Questions set. Click save when you're done.
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
              placeholder="e.g., NEET 2023 Physics"
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
              placeholder="e.g., Link to questions PDF"
            />
          </div>
        </div>
        <DialogFooter>
          <Button onClick={handleSubmit}>Save PYQ</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}


export default function AdminPyqsPage() {
  const firestore = useFirestore();
  const { toast } = useToast();

  const pyqsQuery = useMemoFirebase(() => {
    return query(collection(firestore, 'study_materials'), where('contentType', '==', 'pyq'));
  }, [firestore]);

  const { data: pyqs, isLoading, error } = useCollection<Pyq>(pyqsQuery);

  const handleVisibilityChange = (pyqId: string, newVisibility: boolean) => {
    const pyqRef = doc(firestore, 'study_materials', pyqId);
    updateDocumentNonBlocking(pyqRef, { visible: newVisibility });
  };

  const handleDelete = (pyqId: string) => {
    const pyqRef = doc(firestore, 'study_materials', pyqId);
    deleteDocumentNonBlocking(pyqRef);
    toast({
      title: 'PYQ Deleted',
      description: 'The PYQ set has been successfully deleted.',
    });
  };

  return (
    <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
       <div className="flex items-center">
          <h1 className="text-lg font-semibold md:text-2xl font-headline">PYQs</h1>
          <div className="ml-auto flex items-center gap-2">
            <AddPyqDialog onPyqAdded={() => {}} />
          </div>
        </div>
      <Card>
        <CardHeader>
          <CardTitle>Content Management</CardTitle>
          <CardDescription>
            Manage your Previous Year Questions. You can toggle visibility, edit, or delete them.
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
              {isLoading && <TableRow><TableCell colSpan={5} className="text-center">Loading PYQs...</TableCell></TableRow>}
              {error && <TableRow><TableCell colSpan={5} className="text-center text-destructive">Error: {error.message}</TableCell></TableRow>}
              {!isLoading && pyqs?.length === 0 && <TableRow><TableCell colSpan={5} className="text-center">No PYQs found.</TableCell></TableRow>}
              {pyqs?.map((pyq) => (
                <TableRow key={pyq.id}>
                  <TableCell className="font-medium">{pyq.title}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{pyq.subject}</Badge>
                  </TableCell>
                  <TableCell>{pyq.createdAt ? pyq.createdAt.toDate().toLocaleDateString() : 'N/A'}</TableCell>
                  <TableCell>
                    <Switch
                      checked={pyq.visible}
                      onCheckedChange={(checked) => handleVisibilityChange(pyq.id, checked)}
                      aria-label="Toggle PYQ visibility"
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
                        <DropdownMenuItem onSelect={() => window.open(pyq.url, '_blank')}>View</DropdownMenuItem>
                        <DropdownMenuItem disabled>Edit</DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                            onSelect={() => handleDelete(pyq.id)}
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

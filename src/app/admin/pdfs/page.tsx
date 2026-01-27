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
import { useCollection, useFirestore, useUser, useMemoFirebase, useFirebaseApp } from '@/firebase';
import { addDocumentNonBlocking, deleteDocumentNonBlocking, updateDocumentNonBlocking } from '@/firebase/non-blocking-updates';
import { collection, query, where, doc, serverTimestamp } from 'firebase/firestore';
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { subjects } from '@/lib/data';
import { Progress } from '@/components/ui/progress';

type Pdf = {
  id: string;
  title: string;
  subject: string;
  createdAt: { toDate: () => Date };
  visible: boolean;
  url: string;
  adminId: string;
  contentType: string;
};

function AddPdfDialog({ onPdfAdded }: { onPdfAdded: () => void }) {
  const [open, setOpen] = React.useState(false);
  const [title, setTitle] = React.useState('');
  const [subject, setSubject] = React.useState('');
  const [file, setFile] = React.useState<File | null>(null);
  const [isUploading, setIsUploading] = React.useState(false);
  const [uploadProgress, setUploadProgress] = React.useState(0);
  
  const firestore = useFirestore();
  const app = useFirebaseApp();
  const { user } = useUser();
  const { toast } = useToast();

  const handleSubmit = () => {
    if (!title || !subject || !file || !user) {
      toast({
        variant: 'destructive',
        title: 'Missing fields',
        description: 'Please fill out title, subject, and select a file.',
      });
      return;
    }

    setIsUploading(true);
    setUploadProgress(0);

    const storage = getStorage(app);
    const storageRef = ref(storage, `pdfs/${user.uid}/${Date.now()}-${file.name}`);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
      'state_changed',
      (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setUploadProgress(progress);
      },
      (error) => {
        console.error("Upload failed:", error);
        toast({
          variant: "destructive",
          title: "Upload Failed",
          description: "Could not upload the PDF. Please try again.",
        });
        setIsUploading(false);
      },
      async () => {
        try {
          const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
          const newPdf = {
            title,
            subject,
            url: downloadURL,
            contentType: 'pdf',
            visible: true,
            adminId: user.uid,
            createdAt: serverTimestamp(),
            fileName: file.name,
          };

          addDocumentNonBlocking(collection(firestore, 'study_materials'), newPdf);
          
          toast({
            title: 'PDF Uploaded',
            description: `${title} has been uploaded successfully.`,
          });

          onPdfAdded();
          setOpen(false);
          setTitle('');
          setSubject('');
          setFile(null);
        } catch (error) {
           console.error("Failed to process upload:", error);
           toast({
             variant: "destructive",
             title: "Error",
             description: "An error occurred after upload. Please try again.",
           });
        } finally {
            setIsUploading(false);
        }
      }
    );
  };

  return (
    <Dialog open={open} onOpenChange={(isOpen) => {
      if (isUploading) return; // Prevent closing while uploading
      setOpen(isOpen);
    }}>
      <DialogTrigger asChild>
        <Button size="sm" className="h-8 gap-1">
          <PlusCircle className="h-3.5 w-3.5" />
          <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
            Add PDF
          </span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add New PDF</DialogTitle>
          <DialogDescription>
            Fill in the details and upload the PDF file. Click save when you're done.
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
              disabled={isUploading}
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="subject" className="text-right">
              Subject
            </Label>
             <Select onValueChange={setSubject} value={subject} disabled={isUploading}>
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
            <Label htmlFor="file" className="text-right">
              File
            </Label>
            <Input
              id="file"
              type="file"
              onChange={(e) => setFile(e.target.files?.[0] || null)}
              className="col-span-3"
              accept=".pdf"
              disabled={isUploading}
            />
          </div>
          {isUploading && (
             <div className="col-span-4 px-1">
                <Progress value={uploadProgress} className="w-full" />
                <p className="text-sm text-center mt-2 text-muted-foreground">Uploading... {Math.round(uploadProgress)}%</p>
             </div>
          )}
        </div>
        <DialogFooter>
          <Button onClick={handleSubmit} disabled={isUploading}>
            {isUploading ? 'Uploading...' : 'Save PDF'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}


export default function AdminPdfsPage() {
  const firestore = useFirestore();
  const { toast } = useToast();

  const pdfsQuery = useMemoFirebase(() => {
    return query(collection(firestore, 'study_materials'), where('contentType', '==', 'pdf'));
  }, [firestore]);

  const { data: pdfs, isLoading, error, forceRefresh } = useCollection<Pdf>(pdfsQuery);

  const handleVisibilityChange = (pdfId: string, newVisibility: boolean) => {
    const pdfRef = doc(firestore, 'study_materials', pdfId);
    updateDocumentNonBlocking(pdfRef, { visible: newVisibility });
  };

  const handleDelete = (pdfId: string) => {
    const pdfRef = doc(firestore, 'study_materials', pdfId);
    // TODO: Also delete file from storage
    deleteDocumentNonBlocking(pdfRef);
    toast({
      title: 'PDF Deleted',
      description: 'The PDF has been successfully deleted.',
    });
  };

  return (
    <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
       <div className="flex items-center">
          <h1 className="text-lg font-semibold md:text-2xl font-headline">PDFs</h1>
          <div className="ml-auto flex items-center gap-2">
            <AddPdfDialog onPdfAdded={() => { if (forceRefresh) forceRefresh() }} />
          </div>
        </div>
      <Card>
        <CardHeader>
          <CardTitle>Content Management</CardTitle>
          <CardDescription>
            Manage your PDF documents. You can upload, toggle visibility, or delete them.
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
              {isLoading && <TableRow><TableCell colSpan={5} className="text-center">Loading PDFs...</TableCell></TableRow>}
              {error && <TableRow><TableCell colSpan={5} className="text-center text-destructive">Error: {error.message}</TableCell></TableRow>}
              {!isLoading && pdfs?.length === 0 && <TableRow><TableCell colSpan={5} className="text-center">No PDFs found.</TableCell></TableRow>}
              {pdfs?.map((pdf) => (
                <TableRow key={pdf.id}>
                  <TableCell className="font-medium">{pdf.title}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{pdf.subject}</Badge>
                  </TableCell>
                  <TableCell>{pdf.createdAt ? pdf.createdAt.toDate().toLocaleDateString() : 'N/A'}</TableCell>
                  <TableCell>
                    <Switch
                      checked={pdf.visible}
                      onCheckedChange={(checked) => handleVisibilityChange(pdf.id, checked)}
                      aria-label="Toggle PDF visibility"
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
                        <DropdownMenuItem onSelect={() => window.open(pdf.url, '_blank')}>View</DropdownMenuItem>
                        <DropdownMenuItem disabled>Edit</DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                            onSelect={() => handleDelete(pdf.id)}
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

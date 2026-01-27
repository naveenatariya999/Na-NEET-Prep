import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { pyqs } from '@/lib/data';
import { CheckCircle2, XCircle } from 'lucide-react';

export default function PYQsPage() {
  return (
    <div className="container mx-auto py-12 px-4 md:px-6">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold tracking-tight font-headline sm:text-5xl">
          Previous Year Questions (PYQs)
        </h1>
        <p className="mt-4 max-w-2xl mx-auto text-lg text-muted-foreground">
          Practice with NEET PYQs organized year-wise and chapter-wise with original explanations.
        </p>
      </div>

      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">Year</TableHead>
              <TableHead>Subject</TableHead>
              <TableHead>No. of Questions</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {pyqs.map((pyq, index) => (
              <TableRow key={index}>
                <TableCell className="font-medium">{pyq.year}</TableCell>
                <TableCell>{pyq.subject}</TableCell>
                <TableCell>
                  <Badge variant="secondary">{pyq.questions}</Badge>
                </TableCell>
                <TableCell>
                  {pyq.available ? (
                    <span className="flex items-center text-green-600">
                      <CheckCircle2 className="mr-2 h-4 w-4" />
                      Available
                    </span>
                  ) : (
                    <span className="flex items-center text-red-600">
                      <XCircle className="mr-2 h-4 w-4" />
                      Unavailable
                    </span>
                  )}
                </TableCell>
                <TableCell className="text-right">
                  <Button variant="outline" size="sm" disabled={!pyq.available}>
                    View Questions
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

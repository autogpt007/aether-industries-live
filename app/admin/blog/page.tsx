
'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { PlusCircle, Edit, Trash2, ArrowLeft, Newspaper } from 'lucide-react';
import { useEffect } from 'react';

// Mock blog data for display
const mockAdminBlogPosts = [
  { id: 'blog1', title: 'Choosing the Right Freon™ Refrigerant', category: 'Refrigerant Guides', date: '2024-07-20', status: 'Published' },
  { id: 'blog2', title: 'EPA 608 Certification: What Technicians Need to Know', category: 'Regulations', date: '2024-07-05', status: 'Published' },
  { id: 'blog3', title: 'Upcoming: Lower GWP Alternatives', category: 'Industry News', date: '2024-08-01', status: 'Draft' },
];

export default function AdminBlogPage() {
  useEffect(() => {
    document.title = 'Manage Blog Articles | Aether Industries Admin';
  }, []);

  return (
    <div className="py-8 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="font-headline text-3xl md:text-4xl font-bold flex items-center">
          <Newspaper className="mr-3 h-8 w-8 text-primary" /> Manage Blog Articles
        </h1>
        <Button variant="outline" size="sm" asChild>
          <Link href="/dashboard">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Dashboard
          </Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <CardTitle className="font-headline text-xl">Article List</CardTitle>
              <CardDescription>
                Create, edit, and publish blog articles.
                (Currently, article data is managed in code at <code>src/app/blog/...</code> files).
              </CardDescription>
            </div>
            <Button className="bg-accent text-accent-foreground hover:bg-accent/90">
              <PlusCircle className="mr-2 h-4 w-4" /> Create New Article
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockAdminBlogPosts.map((post) => (
                <TableRow key={post.id}>
                  <TableCell className="font-medium">{post.title}</TableCell>
                  <TableCell>{post.category}</TableCell>
                  <TableCell>{post.date}</TableCell>
                  <TableCell>
                    <span className={`px-2 py-1 text-xs rounded-full ${post.status === 'Published' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                      {post.status}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="icon" className="hover:text-primary">
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="hover:text-destructive">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
               {mockAdminBlogPosts.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} className="text-center text-muted-foreground">
                    No articles found. Start by creating a new one.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
        <CardFooter>
          <p className="text-xs text-muted-foreground">
            This is a placeholder admin page. Full CMS functionality requires further development.
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}

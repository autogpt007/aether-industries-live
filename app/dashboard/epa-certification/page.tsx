
'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, ShieldCheck, UploadCloud, FileText, CheckCircle, Info } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

export default function EpaCertificationPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  
  const [certificationNumber, setCertificationNumber] = useState('');
  const [certificationFile, setCertificationFile] = useState<File | null>(null);
  const [currentStatus, setCurrentStatus] = useState<'Not Submitted' | 'Pending Review' | 'Verified' | 'Rejected'>('Not Submitted');
  const [rejectionReason, setRejectionReason] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    document.title = 'EPA Certification | Aether Industries Dashboard';
    // In a real app, fetch current EPA certification status and details for the user
    // For example:
    // const fetchUserEpaStatus = async () => {
    //   // const statusData = await getUserEpaStatus(user.uid);
    //   // setCurrentStatus(statusData.status);
    //   // setCertificationNumber(statusData.number || '');
    //   // setRejectionReason(statusData.reason || null);
    // };
    // if (user) fetchUserEpaStatus();
    
    // Mocking current status
    if (user?.email?.includes('verified')) {
        setCurrentStatus('Verified');
        setCertificationNumber('EPA123456789');
    } else if (user?.email?.includes('pending')) {
        setCurrentStatus('Pending Review');
        setCertificationNumber('EPA987654321');
    }

  }, [user]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        toast({ title: "File too large", description: "Please upload a file smaller than 5MB.", variant: "destructive"});
        setCertificationFile(null);
        event.target.value = ""; // Clear the input
        return;
      }
      if (!['image/jpeg', 'image/png', 'application/pdf'].includes(file.type)) {
        toast({ title: "Invalid File Type", description: "Please upload a JPG, PNG, or PDF file.", variant: "destructive"});
        setCertificationFile(null);
        event.target.value = ""; // Clear the input
        return;
      }
      setCertificationFile(file);
    }
  };

  const handleSubmitCertification = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!certificationNumber.trim()) {
      toast({ title: "Missing Information", description: "Please enter your EPA certification number.", variant: "destructive" });
      return;
    }
    if (!certificationFile && currentStatus !== 'Verified' && currentStatus !== 'Pending Review') {
        toast({ title: "Missing File", description: "Please upload a copy of your certification card.", variant: "destructive" });
        return;
    }

    setIsLoading(true);
    // TODO: Implement actual submission logic
    // This would involve:
    // 1. Uploading the file to Firebase Storage (if a new file is provided)
    //    let fileURL = null;
    //    if (certificationFile) { /* ... upload logic ... */ fileURL = uploadedUrl; }
    // 2. Saving/updating the certification number and file URL in Firestore for the user.
    //    await updateUserEpaData(user.uid, { number: certificationNumber, fileUrl: fileURL, status: 'Pending Review' });
    
    console.log("Certification submitted:", { certificationNumber, fileName: certificationFile?.name });
    
    await new Promise(resolve => setTimeout(resolve, 2000)); // Simulate API call

    setCurrentStatus('Pending Review');
    setRejectionReason(null);
    toast({
      title: "Submission Received",
      description: "Your EPA certification information has been submitted for review. We will notify you once it's processed.",
    });
    setIsLoading(false);
  };

  return (
    <div className="py-8 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="font-headline text-3xl md:text-4xl font-bold">EPA Section 608 Certification</h1>
        <Button variant="outline" size="sm" asChild>
          <Link href="/dashboard">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Dashboard
          </Link>
        </Button>
      </div>

      <Card className="border-blue-500 bg-blue-50 dark:bg-blue-900/30">
        <CardHeader>
            <CardTitle className="font-headline text-lg flex items-center text-blue-700 dark:text-blue-300">
                <Info className="mr-3 h-6 w-6" /> Important Information
            </CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-blue-600 dark:text-blue-400 space-y-2">
            <p>
              Technicians who maintain, service, repair, or dispose of equipment containing regulated refrigerants must be EPA Section 608 certified. 
              Aether Industries requires this certification for the purchase of most refrigerants.
            </p>
            <p>
              Please submit your certification details below. If you need to obtain certification, visit the 
              <a href="https://www.epa.gov/section608" target="_blank" rel="noopener noreferrer" className="font-semibold underline hover:opacity-80 ml-1">official EPA website</a> for resources.
            </p>
            <p>
              For more details on our policy, see the <Link href="/disclaimers/refrigerant-certification" className="font-semibold underline hover:opacity-80">Refrigerant Certification Policy page</Link>.
            </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="font-headline text-xl flex items-center">
            <ShieldCheck className="mr-2 h-5 w-5 text-primary"/> Your Certification Status
          </CardTitle>
          <CardDescription>
            Current Status: 
            {currentStatus === 'Verified' && <span className="font-semibold text-green-600 ml-1 flex items-center"><CheckCircle className="mr-1 h-4 w-4"/>Verified</span>}
            {currentStatus === 'Pending Review' && <span className="font-semibold text-yellow-600 ml-1">Pending Review</span>}
            {currentStatus === 'Not Submitted' && <span className="font-semibold text-red-600 ml-1">Not Submitted</span>}
            {currentStatus === 'Rejected' && <span className="font-semibold text-red-600 ml-1">Rejected</span>}
          </CardDescription>
          {currentStatus === 'Rejected' && rejectionReason && (
            <p className="text-sm text-destructive mt-1">Reason: {rejectionReason}</p>
          )}
        </CardHeader>
        <form onSubmit={handleSubmitCertification}>
          <CardContent className="space-y-6">
            <div>
              <Label htmlFor="certificationNumber">EPA Certification Number</Label>
              <Input 
                id="certificationNumber" 
                value={certificationNumber} 
                onChange={(e) => setCertificationNumber(e.target.value.toUpperCase())} 
                placeholder="e.g., EPA123456789" 
                required
                disabled={isLoading || currentStatus === 'Pending Review'}
              />
            </div>
            
            <div>
              <Label htmlFor="certificationFile">
                {currentStatus === 'Verified' || currentStatus === 'Pending Review' ? 'Upload New Certification Card (Optional)' : 'Upload Certification Card (JPG, PNG, or PDF - Max 5MB)'}
              </Label>
              <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-dashed rounded-md hover:border-primary transition-colors">
                <div className="space-y-1 text-center">
                  <UploadCloud className="mx-auto h-12 w-12 text-muted-foreground" />
                  <div className="flex text-sm text-muted-foreground">
                    <label
                      htmlFor="certificationFile"
                      className="relative cursor-pointer rounded-md font-medium text-primary hover:text-primary/80 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-ring"
                    >
                      <span>Upload a file</span>
                      <Input id="certificationFile" name="certificationFile" type="file" className="sr-only" onChange={handleFileChange} accept=".jpg,.jpeg,.png,.pdf"  disabled={isLoading || currentStatus === 'Pending Review'}/>
                    </label>
                    <p className="pl-1">or drag and drop</p>
                  </div>
                  <p className="text-xs text-muted-foreground">{certificationFile ? certificationFile.name : 'No file chosen'}</p>
                </div>
              </div>
            </div>
            {(currentStatus === 'Verified' || currentStatus === 'Pending Review') && (
                <p className="text-sm text-muted-foreground">
                    You only need to upload a new file if your certification card has changed or if requested by our team.
                </p>
            )}
          </CardContent>
          <CardFooter className="border-t pt-6">
            <Button type="submit" disabled={isLoading || currentStatus === 'Pending Review'}>
              {isLoading ? <><FileText className="mr-2 h-4 w-4 animate-pulse"/> Submitting...</> : 
               currentStatus === 'Verified' || currentStatus === 'Pending Review' ? 'Update Certification' : 'Submit Certification'}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}

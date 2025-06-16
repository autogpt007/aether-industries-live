// app/admin/products/ProductForm.tsx
'use client';

import { useState, useMemo, useEffect, useCallback } from 'react';
import { useForm, useFieldArray, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import Image from 'next/image'; // For displaying images
import { getStorage, ref, uploadBytesResumable, getDownloadURL, deleteObject } from 'firebase/storage';
import { auth as firebaseAuth } from '@/lib/firebase'; // Use the central Firebase auth instance

import type { Product, ProductFormData } from '@/types/product';
import { productFormSchema } from '@/types/product';
import { addProductAction, updateProductAction } from './actions';

// UI Components
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { X, PlusCircle, UploadCloud, Loader2, ImagePlus, FileUp, Trash2, AlertTriangle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Progress } from '@/components/ui/progress';

// Reusable FileUploader Component (Defined Outside ProductForm)
interface FileUploaderProps {
  onUploadSuccess: (url: string, fileName?: string) => void;
  currentFileUrl?: string | null;
  onRemoveExisting?: () => void; // Callback to remove the file from form state & potentially storage
  uploadPath: 'product-images' | 'product-documents';
  acceptedFileTypes: string; // e.g., "image/png, image/jpeg" or "application/pdf"
  buttonTitle: string;
  fieldId: string; // Unique ID for the input element
}

const FileUploader: React.FC<FileUploaderProps> = ({
  onUploadSuccess,
  currentFileUrl,
  onRemoveExisting,
  uploadPath,
  acceptedFileTypes,
  buttonTitle,
  fieldId,
}) => {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const { toast } = useToast();

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) {
      console.log('[FileUploader] No file selected.');
      return;
    }

    console.log('[FileUploader] File selected:', { name: file.name, size: file.size, type: file.type });
    setIsUploading(true);
    setUploadProgress(0);

    try {
      const storage = getStorage(firebaseAuth.app); 
      console.log('[FileUploader] Firebase Storage instance obtained. Bucket:', storage.app.options.storageBucket);

      const sanitizedFileName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_');
      const fullStoragePath = `${uploadPath}/${Date.now()}_${sanitizedFileName}`;
      console.log(`[FileUploader] Attempting to upload to Firebase Storage path: ${fullStoragePath}`);
      
      const storageRef = ref(storage, fullStoragePath);
      console.log('[FileUploader] Storage reference created:', storageRef.toString());

      const uploadTask = uploadBytesResumable(storageRef, file);
      console.log('[FileUploader] Upload task created. Setting up event listeners.');

      uploadTask.on(
        'state_changed',
        (snapshot) => {
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log('[FileUploader] Upload progress:', Math.round(progress) + '%');
          setUploadProgress(Math.round(progress));
        },
        (error) => {
          setIsUploading(false);
          console.error("[FileUploader] Upload Error Code:", error.code);
          console.error("[FileUploader] Upload Error Message:", error.message);
          console.error("[FileUploader] Full Upload Error Object:", JSON.stringify(error, null, 2));
          
          let detailedDescription = `Error: ${error.message} (Code: ${error.code}).`;
          if (error.code === 'storage/unauthorized') {
            detailedDescription += ' This often means Firebase Storage rules are denying access. Check rules for path: ' + fullStoragePath;
          } else if (error.code === 'storage/canceled') {
            detailedDescription += ' Upload was canceled. This can be due to CORS issues. Check browser Network tab for pre-flight (OPTIONS) request failures and ensure your bucket CORS configuration is correct and propagated.';
          } else {
            detailedDescription += ' Please check browser console (Console & Network tabs) for more details. Verify Storage rules and CORS settings.';
          }
          
          toast({ 
              title: 'Upload Failed', 
              description: detailedDescription, 
              variant: 'destructive',
              duration: 15000, 
          });
        },
        async () => {
          try {
            const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
            console.log('[FileUploader] Upload complete. Download URL:', downloadURL);
            onUploadSuccess(downloadURL, file.name);
            setIsUploading(false);
            toast({ title: 'Upload Complete!', description: `${file.name} uploaded successfully.` });
          } catch (getUrlError: any) {
            setIsUploading(false);
            console.error("[FileUploader] Error getting download URL:", getUrlError);
            toast({ 
              title: 'Upload Succeeded, but URL Failed', 
              description: `Could not get download URL: ${getUrlError.message}. Check console.`, 
              variant: 'destructive' 
            });
          }
        }
      );
    } catch (setupError: any) {
      setIsUploading(false);
      console.error("[FileUploader] Error setting up upload:", setupError);
      toast({ 
        title: 'Upload Setup Failed', 
        description: `Could not start upload: ${setupError.message}. Check console.`, 
        variant: 'destructive' 
      });
    }
    event.target.value = ""; 
  };

  if (currentFileUrl && currentFileUrl.trim() !== '') {
    return (
      <div className="p-2 border rounded-md flex items-center justify-between text-sm">
        <a href={currentFileUrl} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline truncate flex-1 mr-2">
          View Current File
        </a>
        {onRemoveExisting && (
          <Button type="button" variant="ghost" size="icon" onClick={onRemoveExisting} className="h-7 w-7 text-destructive">
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>
    );
  }

  return (
    <>
      <Label htmlFor={fieldId} className={`flex flex-col items-center justify-center w-full min-h-[6rem] border-2 border-dashed rounded-lg cursor-pointer ${isUploading ? 'bg-muted/50 cursor-not-allowed' : 'bg-card hover:border-primary'}`}>
        <div className="flex flex-col items-center justify-center py-3 px-2 text-center">
          <UploadCloud className={`w-7 h-7 mb-1 ${isUploading ? 'text-muted-foreground/50' : 'text-muted-foreground'}`} />
          <p className={`text-xs ${isUploading ? 'text-muted-foreground/70' : 'text-muted-foreground'}`}>
            <span className="font-semibold">{buttonTitle}</span>
          </p>
          <p className={`text-xs ${isUploading ? 'text-muted-foreground/70' : 'text-muted-foreground/80'}`}>{acceptedFileTypes}</p>
        </div>
        <Input id={fieldId} type="file" className="hidden" accept={acceptedFileTypes} disabled={isUploading} onChange={handleFileChange} />
      </Label>
      {isUploading && (
        <div className="w-full mt-1">
            <Progress value={uploadProgress} className="h-1.5" />
            <p className="text-xs text-muted-foreground text-center mt-0.5">{uploadProgress}%</p>
        </div>
      )}
    </>
  );
};


export default function ProductForm({ initialData }: { initialData?: Product }) {
  const router = useRouter();
  const { toast } = useToast();
  const [isSubmittingForm, setIsSubmittingForm] = useState(false);

  // Map existing Product data to form data, handling new image structure
  const mapProductToFormData = useCallback((product?: Product): ProductFormData => {
    if (!product) {
      // Default for new product form
      return {
        name: '', slug: '', category: '', shortDescription: '', longDescription: '',
        primaryImageUrl: '', otherImageUrls: [], 
        technicalSpecs: [], 
        safetyInformation: { precautions: [] },
        isPurchasable: true, requiresCertification: false, availability: 'In Stock',
        price: null, sku: '',
        sdsFileUrl: '', technicalDocumentUrl: '', 
      };
    }
    // For existing product
    return {
      name: product.name,
      slug: product.slug || '', 
      category: product.category,
      refrigerantType: product.refrigerantType,
      application: product.application,
      primaryImageUrl: product.primaryImageUrl || (Array.isArray(product.images) && product.images[0]?.url) || '', 
      otherImageUrls: product.otherImageUrls || (Array.isArray(product.images) ? product.images.slice(1).map(img => img.url) : []), 
      shortDescription: product.shortDescription,
      longDescription: product.longDescription,
      applicationNotes: product.applicationNotes,
      technicalSpecs: product.technicalSpecs ? Object.entries(product.technicalSpecs).map(([key, value]) => ({ key, value: String(value) })) : [],
      safetyInformation: {
        sdsFileUrl: product.safetyInformation?.sdsFileUrl || '',
        precautions: product.safetyInformation?.precautions?.map(p => ({ text: p })) || [],
        epaCertification: product.safetyInformation?.epaCertification || '',
      },
      technicalDocumentUrl: product.technicalDocumentUrl || '',
      price: product.price,
      isPurchasable: product.isPurchasable,
      requiresCertification: product.requiresCertification, 
      availability: product.availability,
      sku: product.sku,
    };
  }, []);

  const defaultValues = useMemo(() => mapProductToFormData(initialData), [initialData, mapProductToFormData]);

  const form = useForm<ProductFormData>({
    resolver: zodResolver(productFormSchema),
    defaultValues,
  });

  const { fields: techSpecFields, append: appendTechSpec, remove: removeTechSpec } = useFieldArray({
    control: form.control, name: "technicalSpecs",
  });
  const { fields: precautionFields, append: appendPrecaution, remove: removePrecaution } = useFieldArray({
    control: form.control, name: "safetyInformation.precautions",
  });
  const { fields: otherImageFields, append: appendOtherImage, remove: removeOtherImage } = useFieldArray({
    control: form.control, name: "otherImageUrls" 
  });


  // Reset form when initialData changes
  useEffect(() => {
    form.reset(defaultValues);
  }, [defaultValues, form]);

  const autoGenerateSlug = () => {
    const nameValue = form.getValues("name");
    if (nameValue && !form.getValues("slug")) { 
      const slugValue = nameValue.toLowerCase().replace(/\s+/g, '-').replace(/[™®©&]/g, '').replace(/[^\w-]+/g, '');
      form.setValue("slug", slugValue, { shouldValidate: true });
    }
  };

  const removeFileFromStorage = async (fileUrl?: string | null) => {
    if (fileUrl && fileUrl.startsWith('https://firebasestorage.googleapis.com')) {
      try {
        const storage = getStorage(firebaseAuth.app);
        const fileRef = ref(storage, fileUrl);
        await deleteObject(fileRef);
        toast({ title: "File Removed", description: "Previous file deleted from storage." });
      } catch (error: any) {
        console.error("Error deleting file from storage:", error);
        toast({ title: "Storage Error", description: "Could not delete previous file from storage: " + error.message, variant: "destructive" });
      }
    }
  };


  const onSubmitHandler = async (data: ProductFormData) => {
    setIsSubmittingForm(true);
    if (!data.slug && data.name) {
      const slugValue = data.name.toLowerCase().replace(/\s+/g, '-').replace(/[™®©&]/g, '').replace(/[^\w-]+/g, '');
      data.slug = slugValue;
    }
    
    try {
      let result;
      if (initialData?.id) {
        result = await updateProductAction(initialData.id, data);
      } else {
        result = await addProductAction(data);
      }

      if (result.success) {
        toast({ title: `Product ${initialData ? 'updated' : 'added'} successfully!` });
        router.push('/admin/products');
        router.refresh(); 
      } else {
        const errorMessage = typeof result.error === 'string' ? result.error : JSON.stringify(result.error);
        throw new Error(errorMessage || "An unknown error occurred");
      }
    } catch (error: any) {
      console.error("Form submission error:", error);
      toast({ title: 'Submission Error', description: error.message, variant: 'destructive' });
    } finally {
      setIsSubmittingForm(false);
    }
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmitHandler)} className="space-y-8">
      {/* Product Images Card */}
      <Card>
        <CardHeader>
            <CardTitle className="flex items-center"><ImagePlus className="mr-2 h-5 w-5 text-primary"/>Product Images</CardTitle>
            <CardDescription>Upload a primary image and up to 4 other images. Accepted: PNG, JPG, WEBP (Max 5MB each).</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Primary Image Uploader */}
          <div>
            <Label htmlFor="primaryImageUrl" className="font-medium">Primary Image *</Label>
            <FileUploader
              fieldId="primary-image-upload"
              onUploadSuccess={(url) => form.setValue('primaryImageUrl', url, { shouldValidate: true })}
              currentFileUrl={form.watch('primaryImageUrl')}
              onRemoveExisting={async () => {
                await removeFileFromStorage(form.getValues('primaryImageUrl'));
                form.setValue('primaryImageUrl', '', { shouldValidate: true });
              }}
              uploadPath="product-images"
              acceptedFileTypes="image/png, image/jpeg, image/webp"
              buttonTitle="Upload Primary Image"
            />
            {form.formState.errors.primaryImageUrl && <p className="text-sm text-destructive mt-1">{form.formState.errors.primaryImageUrl.message}</p>}
          </div>

          {/* Other Images Uploader */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <Label className="font-medium">Other Images (Up to 4)</Label>
              {otherImageFields.length < 4 && (
                <Button type="button" variant="outline" size="sm" onClick={() => appendOtherImage('')}>
                  <PlusCircle className="mr-2 h-4 w-4" /> Add Other Image Slot
                </Button>
              )}
            </div>
            {otherImageFields.length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {otherImageFields.map((field, index) => (
                  <div key={field.id} className="p-3 border rounded-md space-y-2 bg-muted/30">
                    <Label htmlFor={`otherImageUrl-${index}`} className="text-xs">Other Image {index + 1}</Label>
                    <FileUploader
                      fieldId={`other-image-upload-${index}`}
                      onUploadSuccess={(url) => {
                        const currentUrls = form.getValues('otherImageUrls') || [];
                        currentUrls[index] = url;
                        form.setValue('otherImageUrls', currentUrls, { shouldValidate: true });
                      }}
                      currentFileUrl={form.watch(`otherImageUrls.${index}`)}
                      onRemoveExisting={async () => {
                        const currentUrls = form.getValues('otherImageUrls') || [];
                        await removeFileFromStorage(currentUrls[index]);
                        removeOtherImage(index); 
                      }}
                      uploadPath="product-images"
                      acceptedFileTypes="image/png, image/jpeg, image/webp"
                      buttonTitle={`Upload Other Image ${index + 1}`}
                    />
                     <Button type="button" variant="ghost" size="sm" className="w-full text-destructive hover:bg-destructive/10 mt-1" onClick={() => removeOtherImage(index)}>
                        <Trash2 className="mr-1 h-3.5 w-3.5"/> Remove Slot {index + 1}
                    </Button>
                    {form.formState.errors.otherImageUrls?.[index] && <p className="text-sm text-destructive mt-1">{form.formState.errors.otherImageUrls?.[index]?.message || form.formState.errors.otherImageUrls?.[index]?.root?.message}</p>}
                  </div>
                ))}
              </div>
            )}
             {form.formState.errors.otherImageUrls && typeof form.formState.errors.otherImageUrls.message === 'string' && <p className="text-sm text-destructive mt-1">{form.formState.errors.otherImageUrls.message}</p>}
          </div>
        </CardContent>
      </Card>

      {/* Basic Information Card */}
      <Card>
        <CardHeader><CardTitle>Basic Information</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div><Label htmlFor="name">Product Name *</Label><Input id="name" {...form.register("name")} onBlur={autoGenerateSlug} />{form.formState.errors.name && <p className="text-sm text-destructive mt-1">{form.formState.errors.name.message}</p>}</div>
            <div>
              <Label htmlFor="slug">Product Slug (Optional - auto-generated if blank)</Label>
              <Input id="slug" {...form.register("slug")} />
              {form.formState.errors.slug && <p className="text-sm text-destructive mt-1">{form.formState.errors.slug.message}</p>}
            </div>
          </div>
          <div className="grid md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="category">Category *</Label>
              <Controller name="category" control={form.control} render={({ field }) => (
                  <Select onValueChange={field.onChange} value={field.value} defaultValue={initialData?.category}>
                    <SelectTrigger id="category"><SelectValue placeholder="Select category" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Refrigerants">Refrigerants</SelectItem>
                      <SelectItem value="Manifold Gauges">Manifold Gauges</SelectItem>
                      <SelectItem value="Recovery Equipment">Recovery Equipment</SelectItem>
                      <SelectItem value="Vacuum Pumps">Vacuum Pumps</SelectItem>
                      <SelectItem value="Leak Detectors">Leak Detectors</SelectItem>
                      <SelectItem value="Hoses & Fittings">Hoses & Fittings</SelectItem>
                      <SelectItem value="Tools & Gauges">Tools & Gauges</SelectItem>
                      <SelectItem value="Accessories">Accessories</SelectItem>
                        <SelectItem value="Gases">Industrial Gases</SelectItem>
                        <SelectItem value="Welding Supplies">Welding Supplies</SelectItem>
                        <SelectItem value="Safety Equipment">Safety Equipment</SelectItem>
                        <SelectItem value="HVAC Components">HVAC Components</SelectItem>
                    </SelectContent>
                  </Select>
              )}/>
              {form.formState.errors.category && <p className="text-sm text-destructive mt-1">{form.formState.errors.category.message}</p>}
            </div>
            <div><Label htmlFor="price">Price</Label><Input id="price" type="number" step="0.01" {...form.register("price")} placeholder="e.g., 120.00"/>{form.formState.errors.price && <p className="text-sm text-destructive mt-1">{form.formState.errors.price.message}</p>}</div>
            <div><Label htmlFor="sku">SKU *</Label><Input id="sku" {...form.register("sku")} placeholder="e.g., AET-R410A-25LB"/>{form.formState.errors.sku && <p className="text-sm text-destructive mt-1">{form.formState.errors.sku.message}</p>}</div>
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            <div><Label htmlFor="refrigerantType">Refrigerant Type (If applicable)</Label><Input id="refrigerantType" {...form.register("refrigerantType")} placeholder="e.g., HFC, HFO"/>{form.formState.errors.refrigerantType && <p className="text-sm text-destructive mt-1">{form.formState.errors.refrigerantType.message}</p>}</div>
            <div><Label htmlFor="application">Primary Application (If applicable)</Label><Input id="application" {...form.register("application")} placeholder="e.g., Residential AC, HVAC Tools"/>{form.formState.errors.application && <p className="text-sm text-destructive mt-1">{form.formState.errors.application.message}</p>}</div>
          </div>
          <div className="grid md:grid-cols-3 gap-4 items-center pt-2">
             <div>
                <Label htmlFor="availability">Availability *</Label>
                <Controller name="availability" control={form.control} render={({ field }) => (
                    <Select onValueChange={field.onChange} value={field.value} defaultValue={initialData?.availability || 'In Stock'}>
                        <SelectTrigger id="availability"><SelectValue /></SelectTrigger>
                        <SelectContent> <SelectItem value="In Stock">In Stock</SelectItem> <SelectItem value="Out of Stock">Out of Stock</SelectItem> <SelectItem value="Pre-Order">Pre-Order</SelectItem> </SelectContent>
                    </Select>
                )}/>
                {form.formState.errors.availability && <p className="text-sm text-destructive mt-1">{form.formState.errors.availability.message}</p>}
              </div>
            <div className="flex items-center space-x-2 pt-6">
                <Controller name="isPurchasable" control={form.control} render={({ field }) => (<Checkbox id="isPurchasable" checked={field.value} onCheckedChange={field.onChange} />)}/>
                <Label htmlFor="isPurchasable" className="font-normal">Purchasable (Direct Buy)</Label>
            </div>
            <div className="flex items-center space-x-2 pt-6">
                <Controller name="requiresCertification" control={form.control} render={({ field }) => (<Checkbox id="requiresCertification" checked={field.value} onCheckedChange={field.onChange} />)}/>
                <Label htmlFor="requiresCertification" className="font-normal">Requires EPA Certification</Label>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Descriptions Card */}
      <Card>
        <CardHeader><CardTitle>Descriptions</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div><Label htmlFor="shortDescription">Short Description * (Max 200 chars)</Label><Textarea id="shortDescription" {...form.register("shortDescription")} placeholder="Brief overview of the product."/>{form.formState.errors.shortDescription && <p className="text-sm text-destructive mt-1">{form.formState.errors.shortDescription.message}</p>}</div>
          <div><Label htmlFor="longDescription">Long Description * (Basic HTML allowed)</Label><Textarea id="longDescription" {...form.register("longDescription")} rows={6} placeholder="Detailed product description."/>{form.formState.errors.longDescription && <p className="text-sm text-destructive mt-1">{form.formState.errors.longDescription.message}</p>}</div>
          <div><Label htmlFor="applicationNotes">Application Notes (Optional, Basic HTML allowed)</Label><Textarea id="applicationNotes" {...form.register("applicationNotes")} rows={4} placeholder="Notes on product application, compatibility, etc."/>{form.formState.errors.applicationNotes && <p className="text-sm text-destructive mt-1">{form.formState.errors.applicationNotes.message}</p>}</div>
        </CardContent>
      </Card>

      {/* Technical Specifications Card */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Technical Specifications</CardTitle>
          <Button type="button" variant="outline" size="sm" onClick={() => appendTechSpec({ key: '', value: '' })}> <PlusCircle className="mr-2 h-4 w-4" /> Add Spec </Button>
        </CardHeader>
        <CardContent className="space-y-3">
          {techSpecFields.map((field, index) => (
            <div key={field.id} className="flex items-center gap-2 p-2 border rounded-md bg-muted/30">
              <Input placeholder="Spec Name (e.g., Purity)" {...form.register(`technicalSpecs.${index}.key`)} className="bg-background"/>
              <Input placeholder="Spec Value (e.g., 99.9%)" {...form.register(`technicalSpecs.${index}.value`)} className="bg-background"/>
              <Button type="button" variant="ghost" size="icon" onClick={() => removeTechSpec(index)} className="text-destructive hover:bg-destructive/10"> <Trash2 className="h-4 w-4" /> </Button>
            </div>
          ))}
          {form.formState.errors.technicalSpecs && <p className="text-sm text-destructive mt-1">Please ensure all spec names and values are filled.</p>}
        </CardContent>
      </Card>
      
      {/* Safety & Technical Documents Card */}
      <Card>
        <CardHeader><CardTitle>Safety & Technical Documents</CardTitle></CardHeader>
        <CardContent className="space-y-6">
            <div>
                <Label htmlFor="sdsFileUrl" className="font-medium flex items-center mb-1"><FileUp className="mr-2 h-4 w-4 text-primary"/>Safety Data Sheet (SDS - PDF/Image)</Label>
                <FileUploader
                    fieldId="sds-file-upload"
                    onUploadSuccess={(url) => form.setValue('safetyInformation.sdsFileUrl', url, { shouldValidate: true })}
                    currentFileUrl={form.watch('safetyInformation.sdsFileUrl')}
                    onRemoveExisting={async () => {
                        await removeFileFromStorage(form.getValues('safetyInformation.sdsFileUrl'));
                        form.setValue('safetyInformation.sdsFileUrl', '', { shouldValidate: true });
                    }}
                    uploadPath="product-documents"
                    acceptedFileTypes="application/pdf,image/png,image/jpeg,image/webp"
                    buttonTitle="Upload SDS Document"
                />
                {form.formState.errors.safetyInformation?.sdsFileUrl && <p className="text-sm text-destructive mt-1">{form.formState.errors.safetyInformation.sdsFileUrl.message}</p>}
            </div>
            <div>
                <Label htmlFor="technicalDocumentUrl" className="font-medium flex items-center mb-1"><FileUp className="mr-2 h-4 w-4 text-primary"/>Additional Technical Document (Optional)</Label>
                 <FileUploader
                    fieldId="tech-doc-upload"
                    onUploadSuccess={(url) => form.setValue('technicalDocumentUrl', url, { shouldValidate: true })}
                    currentFileUrl={form.watch('technicalDocumentUrl')}
                     onRemoveExisting={async () => {
                        await removeFileFromStorage(form.getValues('technicalDocumentUrl'));
                        form.setValue('technicalDocumentUrl', '', { shouldValidate: true });
                    }}
                    uploadPath="product-documents"
                    acceptedFileTypes="application/pdf,image/png,image/jpeg,image/webp"
                    buttonTitle="Upload Technical Document"
                />
                {form.formState.errors.technicalDocumentUrl && <p className="text-sm text-destructive mt-1">{form.formState.errors.technicalDocumentUrl.message}</p>}
            </div>
            <div>
                <div className="flex items-center justify-between mb-2">
                    <Label>Handling Precautions</Label>
                    <Button type="button" variant="outline" size="sm" onClick={() => appendPrecaution({ text: '' })}> <PlusCircle className="mr-2 h-4 w-4" /> Add Precaution </Button>
                </div>
                <div className="space-y-2">
                {precautionFields.map((field, index) => (
                    <div key={field.id} className="flex items-center gap-2 p-2 border rounded-md bg-muted/30">
                        <Input placeholder="e.g., Wear PPE" {...form.register(`safetyInformation.precautions.${index}.text`)} className="bg-background"/>
                        <Button type="button" variant="ghost" size="icon" onClick={() => removePrecaution(index)} className="text-destructive hover:bg-destructive/10"> <Trash2 className="h-4 w-4" /> </Button>
                    </div>
                ))}
                </div>
                {form.formState.errors.safetyInformation?.precautions && <p className="text-sm text-destructive mt-1">Ensure all precautions are filled, or remove empty ones.</p>}
            </div>
            <div>
                <Label htmlFor="safetyInformation.epaCertification">EPA Certification Info (Optional)</Label>
                <Textarea id="safetyInformation.epaCertification" {...form.register('safetyInformation.epaCertification')} rows={3} placeholder="e.g., EPA Section 608 certification required for purchase and handling."/>
                {form.formState.errors.safetyInformation?.epaCertification && <p className="text-sm text-destructive mt-1">{form.formState.errors.safetyInformation.epaCertification.message}</p>}
            </div>
        </CardContent>
      </Card>

      <Button type="submit" size="lg" className="w-full sm:w-auto bg-accent text-accent-foreground hover:bg-accent/90" disabled={isSubmittingForm}>
        {isSubmittingForm ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : null}
        {initialData ? 'Update Product' : 'Add Product'}
      </Button>
    </form>
  );
}

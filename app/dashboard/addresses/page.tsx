
'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { ArrowLeft, Home, PlusCircle, Edit2, Trash2, MapPin } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext'; // Assuming you have this
import { useToast } from '@/hooks/use-toast';

interface Address {
  id: string;
  type: 'Shipping' | 'Billing';
  fullName: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  isDefault?: boolean;
}

// Mock address data
const mockAddresses: Address[] = [
  { id: 'addr1', type: 'Shipping', fullName: 'John Doe', addressLine1: '123 Main St', city: 'Anytown', state: 'CA', zipCode: '90210', country: 'USA', isDefault: true },
  { id: 'addr2', type: 'Billing', fullName: 'John Doe', addressLine1: '456 Oak Ave, Apt B', city: 'Otherville', state: 'NY', zipCode: '10001', country: 'USA' },
  { id: 'addr3', type: 'Shipping', fullName: 'John Doe Work', addressLine1: '789 Industrial Pkwy', city: 'Tech City', state: 'TX', zipCode: '75001', country: 'USA' },
];

export default function AddressesPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [addresses, setAddresses] = useState<Address[]>(mockAddresses); // Replace with actual data fetching
  const [isEditing, setIsEditing] = useState<Address | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);

  useEffect(() => {
    document.title = 'Manage Addresses | Aether Industries Dashboard';
    // In a real app, fetch addresses for the logged-in user
  }, [user]);

  const handleEdit = (address: Address) => {
    setIsEditing(address);
    setShowAddForm(true);
  };

  const handleDelete = (addressId: string) => {
    // TODO: Implement delete logic
    setAddresses(prev => prev.filter(addr => addr.id !== addressId));
    toast({ title: "Address Deleted", description: "The address has been removed." });
  };
  
  const handleSaveAddress = (address: Address) => {
    if (isEditing) {
      // Update existing address
      setAddresses(prev => prev.map(addr => addr.id === address.id ? address : addr));
      toast({ title: "Address Updated", description: "Your address has been successfully updated."});
    } else {
      // Add new address
      setAddresses(prev => [...prev, { ...address, id: `addr${Date.now()}` }]);
      toast({ title: "Address Added", description: "New address has been successfully added."});
    }
    setIsEditing(null);
    setShowAddForm(false);
  };

  const AddressForm = ({ addressToEdit, onSave, onCancel }: { addressToEdit: Address | null, onSave: (address: Address) => void, onCancel: () => void }) => {
    const [formData, setFormData] = useState<Partial<Address>>(
      addressToEdit || { type: 'Shipping', country: 'USA', isDefault: false }
    );

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setFormData({ ...formData, [e.target.id]: e.target.value });
    };
    
    const handleSelectChange = (id: keyof Address, value: string) => {
       setFormData({ ...formData, [id]: value });
    };

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      // Basic validation, can be expanded with Zod
      if (!formData.fullName || !formData.addressLine1 || !formData.city || !formData.state || !formData.zipCode || !formData.country) {
        toast({ title: "Missing Fields", description: "Please fill in all required address fields.", variant: "destructive"});
        return;
      }
      onSave(formData as Address); // Assuming all fields are filled for simplicity
    };

    return (
       <Card className="mt-6 mb-6">
        <CardHeader>
          <CardTitle className="font-headline text-xl">{addressToEdit ? 'Edit Address' : 'Add New Address'}</CardTitle>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="type">Address Type</Label>
                <Select value={formData.type} onValueChange={(val) => handleSelectChange('type', val)} required>
                  <SelectTrigger id="type"><SelectValue placeholder="Select type" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Shipping">Shipping</SelectItem>
                    <SelectItem value="Billing">Billing</SelectItem>
                  </SelectContent>
                </Select>
              </div>
               <div>
                <Label htmlFor="fullName">Full Name</Label>
                <Input id="fullName" value={formData.fullName || ''} onChange={handleChange} placeholder="John M. Doe" required/>
              </div>
            </div>
            <div>
              <Label htmlFor="addressLine1">Address Line 1</Label>
              <Input id="addressLine1" value={formData.addressLine1 || ''} onChange={handleChange} placeholder="1234 Main St" required/>
            </div>
            <div>
              <Label htmlFor="addressLine2">Address Line 2 (Optional)</Label>
              <Input id="addressLine2" value={formData.addressLine2 || ''} onChange={handleChange} placeholder="Apt, Suite, Unit, etc."/>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="city">City</Label>
                <Input id="city" value={formData.city || ''} onChange={handleChange} placeholder="Anytown" required/>
              </div>
              <div>
                <Label htmlFor="state">State / Province</Label>
                <Input id="state" value={formData.state || ''} onChange={handleChange} placeholder="CA" required/>
              </div>
              <div>
                <Label htmlFor="zipCode">ZIP / Postal Code</Label>
                <Input id="zipCode" value={formData.zipCode || ''} onChange={handleChange} placeholder="90210" required/>
              </div>
            </div>
             <div>
                <Label htmlFor="country">Country</Label>
                 <Select value={formData.country} onValueChange={(val) => handleSelectChange('country', val)} required>
                    <SelectTrigger id="country"><SelectValue placeholder="Select country" /></SelectTrigger>
                    <SelectContent>
                        <SelectItem value="USA">United States</SelectItem>
                        <SelectItem value="Canada">Canada</SelectItem>
                    </SelectContent>
                </Select>
              </div>
            <div className="flex items-center space-x-2">
              <Checkbox id="isDefault" checked={formData.isDefault} onCheckedChange={(checked) => handleSelectChange('isDefault', String(checked))} />
              <Label htmlFor="isDefault" className="font-normal">Set as default {formData.type?.toLowerCase()} address</Label>
            </div>
          </CardContent>
          <CardFooter className="gap-2">
            <Button type="submit">{addressToEdit ? 'Save Changes' : 'Add Address'}</Button>
            <Button type="button" variant="outline" onClick={onCancel}>Cancel</Button>
          </CardFooter>
        </form>
      </Card>
    );
  };


  return (
    <div className="py-8 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="font-headline text-3xl md:text-4xl font-bold">Manage Addresses</h1>
        <Button variant="outline" size="sm" asChild>
          <Link href="/dashboard">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Dashboard
          </Link>
        </Button>
      </div>

      {!showAddForm && (
        <Button onClick={() => { setIsEditing(null); setShowAddForm(true); }} className="mb-6">
          <PlusCircle className="mr-2 h-4 w-4" /> Add New Address
        </Button>
      )}

      {showAddForm && <AddressForm addressToEdit={isEditing} onSave={handleSaveAddress} onCancel={() => { setShowAddForm(false); setIsEditing(null); }} />}

      <div className="grid md:grid-cols-2 gap-6">
        {addresses.map((address) => (
          <Card key={address.id} className={`relative ${address.isDefault ? 'border-primary' : ''}`}>
            {address.isDefault && <div className="absolute top-2 right-2 bg-primary text-primary-foreground text-xs px-2 py-0.5 rounded-full flex items-center"><Home className="h-3 w-3 mr-1"/> Default</div>}
            <CardHeader>
              <CardTitle className="font-headline text-lg flex items-center">
                <MapPin className="mr-2 h-5 w-5 text-primary"/> {address.type} Address
              </CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground space-y-1">
              <p className="font-medium text-foreground">{address.fullName}</p>
              <p>{address.addressLine1}</p>
              {address.addressLine2 && <p>{address.addressLine2}</p>}
              <p>{address.city}, {address.state} {address.zipCode}</p>
              <p>{address.country}</p>
            </CardContent>
            <CardFooter className="gap-2">
              <Button variant="outline" size="sm" onClick={() => handleEdit(address)}>
                <Edit2 className="mr-1 h-3 w-3" /> Edit
              </Button>
              <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive" onClick={() => handleDelete(address.id)} disabled={address.isDefault}>
                <Trash2 className="mr-1 h-3 w-3" /> Delete
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
      {addresses.length === 0 && !showAddForm && (
        <p className="text-muted-foreground text-center py-8">You haven't added any addresses yet.</p>
      )}
    </div>
  );
}

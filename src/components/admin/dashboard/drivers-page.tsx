'use client';

import { useState, useMemo, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Search, Plus, FileText, AlertTriangle, AlertCircle, CheckCircle, RefreshCw, Sparkles, Copy, Loader2, Trash2 } from 'lucide-react';
import { format, isBefore, addDays } from 'date-fns';
import { Driver } from './loads-page';
import { useToast } from '@/hooks/use-toast';
import { driverService } from '@/services/drivers';
import { extractResumeData } from '@/ai/flows/extract-resume-flow';

export function DriversPage() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  // -- INVITE FLOW STATE --
  const [isInviteOpen, setIsInviteOpen] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [inviteStep, setInviteStep] = useState<'upload' | 'review' | 'link'>('upload');
  const [generatedLink, setGeneratedLink] = useState('');
  const [newApplicant, setNewApplicant] = useState<Partial<Driver>>({
    firstName: '', lastName: '', email: '', phone: ''
  });

  // Delete confirmation state
  const [deleteConfirm, setDeleteConfirm] = useState<{ open: boolean; driverId: string; driverName: string }>({
    open: false,
    driverId: '',
    driverName: ''
  });

  // Fetch Drivers
  useEffect(() => {
    loadDrivers();
  }, []);

  const loadDrivers = async () => {
    try {
      setLoading(true);
      const data = await driverService.getAllDrivers();
      setDrivers(data);
    } catch (error) {
      console.error(error);
      toast({ variant: 'destructive', title: "Error", description: "Failed to load drivers." });
    } finally {
      setLoading(false);
    }
  };

  // Helper to check for expiration
  const getExpirationStatus = (dateStr?: string) => {
    if (!dateStr) return 'unknown'; // or missing
    try {
      const date = new Date(dateStr);
      if (isNaN(date.getTime())) return 'unknown';

      const today = new Date();
      const warningDate = addDays(today, 30); // Warn if expiring within 30 days

      if (isBefore(date, today)) return 'expired';
      if (isBefore(date, warningDate)) return 'warning';
      return 'valid';
    } catch (e) {
      return 'unknown';
    }
  };

  const getComplianceStatus = (driver: Driver) => {
    if (driver.status === 'Applicant') return 'applicant';

    // Check main docs
    const checks = [
      getExpirationStatus(driver.licenseExpiration),
      getExpirationStatus(driver.medicalCardExpiration),
      getExpirationStatus(driver.mvrAnnualDueDate)
    ];

    if (checks.includes('expired')) return 'critical';
    if (checks.includes('warning')) return 'warning';
    return 'compliant';
  };

  const filteredDrivers = useMemo(() => {
    return drivers.filter(driver =>
      driver.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      driver.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      driver.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      driver.lastName.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [drivers, searchTerm]);

  // -- INVITE FLOW HANDLERS --
  const handleResumeUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsAnalyzing(true);
    const reader = new FileReader();
    reader.onload = async (event) => {
      try {
        const dataUri = event.target?.result as string;
        // Extract basic info only for the invite
        const result = await extractResumeData({ fileDataUri: dataUri });

        setNewApplicant(prev => ({
          ...prev,
          firstName: result.firstName || '',
          lastName: result.lastName || '',
          email: result.email || '',
          phone: result.phone || '',
          // Store other fields to save later? For now just basics to create the invite.
          // We could store the raw resume data if we wanted to pass it to the wizard, 
          // but simplest is to just create the record.
          yearsExperience: result.yearsExperience || undefined,
          equipmentExperience: result.equipmentExperience,
          previousEmployment: result.previousEmployment.map(job => ({
            ...job,
            startDate: job.startDate || '',
            endDate: job.endDate || '',
            reasonForLeaving: job.reasonForLeaving || undefined,
            responsibilities: job.responsibilities || undefined
          }))
        }));

        setInviteStep('review');
        toast({ title: "Resume Parsed", description: "Please review contact info before creating invite." });
      } catch (error) {
        console.error(error);
        toast({ variant: 'destructive', title: "Analysis Failed", description: "Could not read resume. Please enter details manually." });
        setInviteStep('review'); // Fallback to manual entry
      } finally {
        setIsAnalyzing(false);
      }
    };
    reader.readAsDataURL(file);
  };

  const createInvite = async () => {
    if (!newApplicant.firstName || !newApplicant.lastName) {
      toast({ variant: 'destructive', title: "Missing Name", description: "First and Last Name are required." });
      return;
    }

    const id = `driver-${Date.now()}`; // Or DB auto ID
    const driverToCreate: Driver = {
      id,
      firstName: newApplicant.firstName,
      lastName: newApplicant.lastName,
      name: `${newApplicant.firstName} ${newApplicant.lastName}`,
      email: newApplicant.email,
      phone: newApplicant.phone,
      status: 'Applicant',
      // Persist the parsed data so the wizard is pre-filled
      yearsExperience: newApplicant.yearsExperience,
      equipmentExperience: newApplicant.equipmentExperience,
      previousEmployment: newApplicant.previousEmployment,

      // Defaults
      address: '',
      dob: '',
      licenseNumber: '',
      licenseState: '',
      cdl: false,
      samsara: false,
      drugAlcoholClearinghouse: false,
      // Init flags
      hasApplication: false,
      hasDriversLicenseCopy: false,
      hasMedicalDeclaration: false,
      hasRoadTest: false,
      hasHandbook: false,
      hasI9: false,
      hasPev: false,
      hasPreEmploymentDrugTest: false,
      hasDrugAlcoholDocs: false,
      isEntryLevel: false,
      isMultiEmployer: false,
      files: {}
    };

    try {
      await driverService.saveDriver(driverToCreate);
      setDrivers(prev => [...prev, driverToCreate]);

      const link = `${window.location.origin}/apply/${id}`;
      setGeneratedLink(link);
      setInviteStep('link');
    } catch (e: any) {
      console.error('Error creating applicant:', e);
      toast({
        variant: 'destructive',
        title: "Error",
        description: `Could not create applicant: ${e.message || 'Unknown error'}`
      });
    }
  };

  const resetInvite = () => {
    setIsInviteOpen(false);
    setInviteStep('upload');
    setNewApplicant({ firstName: '', lastName: '', email: '', phone: '' });
    setGeneratedLink('');
  };

  const copyLink = () => {
    navigator.clipboard.writeText(generatedLink);
    toast({ title: "Link Copied", description: "Send this URL to the applicant." });
  };

  const handleDeleteClick = (e: React.MouseEvent, driver: Driver) => {
    e.stopPropagation(); // Prevent row click navigation
    setDeleteConfirm({
      open: true,
      driverId: driver.id,
      driverName: driver.name
    });
  };

  const confirmDelete = async () => {
    try {
      await driverService.deleteDriver(deleteConfirm.driverId);
      setDrivers(prev => prev.filter(d => d.id !== deleteConfirm.driverId));
      toast({ title: "Driver Deleted", description: `${deleteConfirm.driverName} has been removed from the system.` });
      setDeleteConfirm({ open: false, driverId: '', driverName: '' });
    } catch (error) {
      console.error('Error deleting driver:', error);
      toast({ variant: 'destructive', title: "Delete Failed", description: "Could not delete driver. Please try again." });
    }
  };


  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Driver Management</h2>
        <Button onClick={() => setIsInviteOpen(true)}>
          <Plus className="mr-2 h-4 w-4" /> Invite Applicant
        </Button>
      </div>

      {/* Main Drivers List */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>All Drivers</CardTitle>
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search drivers..."
                  className="pl-8 w-[250px]"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <Button variant="outline" size="icon" onClick={loadDrivers}>
                <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
              </Button>
            </div>
          </div>
          <CardDescription>
            Manage personnel, track expirations, and ensure FMCSA compliance.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Driver Name</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>License Exp</TableHead>
                <TableHead>Med Card Exp</TableHead>
                <TableHead>MVR Due</TableHead>
                <TableHead>Compliance</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredDrivers.map((driver) => {
                const status = getComplianceStatus(driver);
                return (
                  <TableRow key={driver.id} className="cursor-pointer hover:bg-muted/50" onClick={() => router.push(`/admin/drivers/${driver.id}`)}>
                    <TableCell className="font-medium">
                      <div>{driver.name}</div>
                      <div className="text-xs text-muted-foreground">{driver.email || driver.phone}</div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={driver.status === 'Active' ? 'default' : driver.status === 'Applicant' ? 'outline' : 'secondary'}>
                        {driver.status}
                      </Badge>
                    </TableCell>

                    {/* Dates with Conditional Formatting */}
                    <TableCell>
                      <ExpirationBadge dateStr={driver.licenseExpiration} />
                    </TableCell>
                    <TableCell>
                      <ExpirationBadge dateStr={driver.medicalCardExpiration} />
                    </TableCell>
                    <TableCell>
                      <ExpirationBadge dateStr={driver.mvrAnnualDueDate} />
                    </TableCell>

                    <TableCell>
                      {status === 'applicant' && <Badge variant="secondary" className="bg-blue-50 text-blue-700 border-blue-200 gap-1"><Loader2 className="h-3 w-3" /> Application Pending</Badge>}
                      {status === 'critical' && <Badge variant="destructive" className="gap-1"><AlertCircle className="h-3 w-3" /> Action Required</Badge>}
                      {status === 'warning' && <Badge variant="secondary" className="bg-amber-100 text-amber-800 hover:bg-amber-200 gap-1"><AlertTriangle className="h-3 w-3" /> Expiring Soon</Badge>}
                      {status === 'compliant' && <Badge variant="outline" className="text-green-600 border-green-200 bg-green-50 gap-1"><CheckCircle className="h-3 w-3" /> Compliant</Badge>}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="ghost" size="sm" onClick={(e) => { e.stopPropagation(); router.push(`/admin/drivers/${driver.id}`); }}>Edit</Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => handleDeleteClick(e, driver)}
                          className="text-destructive hover:text-destructive hover:bg-destructive/10"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* INVITE APPLICANT DIALOG */}
      <Dialog open={isInviteOpen} onOpenChange={resetInvite}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Invite New Driver</DialogTitle>
            <DialogDescription>
              Upload a resume to auto-fill details, then generate a link for the applicant to complete their profile.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6 py-4">

            {/* Visual Steps */}
            <div className="flex items-center justify-center gap-2 mb-4">
              <div className={`h-2.5 w-2.5 rounded-full ${inviteStep === 'upload' ? 'bg-primary' : 'bg-muted'}`} />
              <div className={`h-1 w-8 ${inviteStep !== 'upload' ? 'bg-primary' : 'bg-muted'}`} />
              <div className={`h-2.5 w-2.5 rounded-full ${inviteStep === 'review' ? 'bg-primary' : 'bg-muted'}`} />
              <div className={`h-1 w-8 ${inviteStep === 'link' ? 'bg-primary' : 'bg-muted'}`} />
              <div className={`h-2.5 w-2.5 rounded-full ${inviteStep === 'link' ? 'bg-primary' : 'bg-muted'}`} />
            </div>

            {/* STEP 1: UPLOAD */}
            {inviteStep === 'upload' && (
              <div className="border-2 border-dashed rounded-lg p-8 flex flex-col items-center justify-center text-center bg-muted/20">
                {isAnalyzing ? (
                  <div className="flex flex-col items-center animate-pulse">
                    <Sparkles className="h-8 w-8 text-blue-500 mb-2" />
                    <p className="text-sm font-medium">Analyzing Resume...</p>
                    <p className="text-xs text-muted-foreground">Extracting contact info & history</p>
                  </div>
                ) : (
                  <>
                    <FileText className="h-10 w-10 text-muted-foreground mb-4" />
                    <h3 className="text-lg font-medium mb-1">Upload Resume</h3>
                    <p className="text-sm text-muted-foreground mb-4 max-w-[200px]">
                      Upload PDF or Image from Indeed to auto-fill contact info.
                    </p>
                    <Button className="relative" disabled={isAnalyzing}>
                      Choose File
                      <input type="file" className="absolute inset-0 opacity-0 cursor-pointer" accept=".pdf,image/*" onChange={handleResumeUpload} />
                    </Button>
                    <div className="mt-4 pt-4 border-t w-full">
                      <Button variant="ghost" size="sm" onClick={() => setInviteStep('review')}>Skip to Manual Enty</Button>
                    </div>
                  </>
                )}
              </div>
            )}

            {/* STEP 2: REVIEW */}
            {inviteStep === 'review' && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>First Name <span className="text-red-500">*</span></Label>
                    <Input value={newApplicant.firstName} onChange={e => setNewApplicant({ ...newApplicant, firstName: e.target.value })} placeholder="First Name" />
                  </div>
                  <div className="space-y-2">
                    <Label>Last Name <span className="text-red-500">*</span></Label>
                    <Input value={newApplicant.lastName} onChange={e => setNewApplicant({ ...newApplicant, lastName: e.target.value })} placeholder="Last Name" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Email</Label>
                  <Input value={newApplicant.email} onChange={e => setNewApplicant({ ...newApplicant, email: e.target.value })} placeholder="applicant@example.com" />
                </div>
                <div className="space-y-2">
                  <Label>Phone Number</Label>
                  <Input value={newApplicant.phone} onChange={e => setNewApplicant({ ...newApplicant, phone: e.target.value })} placeholder="(555) 555-5555" />
                </div>
                <Button className="w-full mt-4" onClick={createInvite}>Create & Generate Link</Button>
              </div>
            )}

            {/* STEP 3: LINK */}
            {inviteStep === 'link' && (
              <div className="space-y-4 text-center">
                <div className="mx-auto bg-green-100 h-12 w-12 rounded-full flex items-center justify-center mb-2">
                  <CheckCircle className="h-6 w-6 text-green-600" />
                </div>
                <h3 className="font-semibold text-lg">Applicant Created!</h3>
                <p className="text-sm text-muted-foreground">
                  Send this link to the driver to complete their application.
                </p>

                <div className="flex items-center gap-2 mt-4">
                  <Input value={generatedLink} readOnly className="bg-muted font-mono text-xs" />
                  <Button size="icon" variant="outline" onClick={copyLink}>
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>

                <div className="pt-4">
                  <Button variant="outline" className="w-full" onClick={resetInvite}>Done</Button>
                </div>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* DELETE CONFIRMATION DIALOG */}
      <Dialog open={deleteConfirm.open} onOpenChange={(open) => setDeleteConfirm({ ...deleteConfirm, open })}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Delete Driver?</DialogTitle>
            <DialogDescription>
              Are you sure you want to permanently delete <strong>{deleteConfirm.driverName}</strong>? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end gap-3 mt-4">
            <Button variant="outline" onClick={() => setDeleteConfirm({ open: false, driverId: '', driverName: '' })}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={confirmDelete}>
              <Trash2 className="mr-2 h-4 w-4" />
              Delete Driver
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function ExpirationBadge({ dateStr }: { dateStr?: string }) {
  if (!dateStr) return <span className="text-muted-foreground text-xs">--</span>;

  try {
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) return <span className="text-muted-foreground text-xs">--</span>;

    const today = new Date();
    const warningDate = addDays(today, 30);
    let variant: "default" | "secondary" | "destructive" | "outline" = "outline";
    let className = "";

    if (isBefore(date, today)) {
      variant = "destructive";
      className = "bg-red-100 text-red-700 border-red-200";
    } else if (isBefore(date, warningDate)) {
      variant = "secondary";
      className = "bg-amber-100 text-amber-800 border-amber-200";
    }

    return <Badge variant={variant} className={className}>{format(date, 'MM/dd/yyyy')}</Badge>;
  } catch {
    return <span className="text-muted-foreground text-xs">Invalid</span>;
  }
}

"use client"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { User, Bell, Shield, Building, CreditCard, Key, Database } from "lucide-react"
import { useState, useEffect } from "react"
import { toast } from "sonner"
import { api } from "@/lib/api"

export default function SettingsPage() {
  const [geminiKey, setGeminiKey] = useState("")
  const [openAIKey, setOpenAIKey] = useState("")
  const [anthropicKey, setAnthropicKey] = useState("")
  
  const [isDeleting, setIsDeleting] = useState(false)
  const [isSeeding, setIsSeeding] = useState(false)
  
  useEffect(() => {
    setGeminiKey(localStorage.getItem("gemini_api_key") || "")
    setOpenAIKey(localStorage.getItem("openai_api_key") || "")
    setAnthropicKey(localStorage.getItem("anthropic_api_key") || "")
  }, [])
  
  const saveKeys = () => {
    localStorage.setItem("gemini_api_key", geminiKey)
    localStorage.setItem("openai_api_key", openAIKey)
    localStorage.setItem("anthropic_api_key", anthropicKey)
    toast.success("API Keys saved successfully", {
      description: "Your keys are stored locally in your browser."
    })
  }

  const handleDeleteAllData = async () => {
    if (!confirm("Are you absolutely sure you want to delete all your transactions? This cannot be undone.")) return;
    
    setIsDeleting(true);
    try {
      await api.deleteAllTransactions();
      toast.success("All data deleted successfully", {
        description: "Your workspace is now completely empty."
      });
      // Optional: if there's a global context to refresh or you want to redirect
    } catch (err: any) {
      toast.error("Failed to delete data", {
        description: err.message
      });
    } finally {
      setIsDeleting(false);
    }
  }

  const handleSeedData = async () => {
    setIsSeeding(true);
    try {
      await api.seedTransactions();
      toast.success("Showcase Data Generated", {
        description: "Your workspace has been populated with sample transactions."
      });
      // Force a full page reload so that server components fetch the new data
      window.location.reload();
    } catch (err: any) {
      toast.error("Failed to generate data", {
        description: err.message
      });
    } finally {
      setIsSeeding(false);
    }
  }

  return (
    <div className="flex flex-col gap-8 max-w-5xl mx-auto w-full p-2">
      <div>
        <h1 className="text-3xl font-semibold tracking-tight">Settings</h1>
        <p className="text-muted-foreground mt-2">Manage your account settings and preferences.</p>
      </div>

      <Tabs defaultValue="profile" className="w-full">
        <TabsList className="grid w-full max-w-3xl grid-cols-5 bg-secondary/50 border border-border/50">
          <TabsTrigger value="profile" className="data-[state=active]:bg-primary/20 data-[state=active]:text-primary">Profile</TabsTrigger>
          <TabsTrigger value="apikeys" className="data-[state=active]:bg-primary/20 data-[state=active]:text-primary">API Keys</TabsTrigger>
          <TabsTrigger value="data" className="data-[state=active]:bg-primary/20 data-[state=active]:text-primary">Data</TabsTrigger>
          <TabsTrigger value="notifications" className="data-[state=active]:bg-primary/20 data-[state=active]:text-primary">Notifications</TabsTrigger>
          <TabsTrigger value="billing" className="data-[state=active]:bg-primary/20 data-[state=active]:text-primary">Billing</TabsTrigger>
        </TabsList>
        
        <TabsContent value="profile" className="mt-6 space-y-6">
          <Card className="bg-card/50 border-border/50 backdrop-blur-sm shadow-xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><User className="w-5 h-5 text-primary" /> Personal Information</CardTitle>
              <CardDescription>Update your personal details and how we can reach you.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">First name</Label>
                  <Input id="firstName" defaultValue="Sarah" className="bg-background/50 border-border/50 focus:border-primary/50" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Last name</Label>
                  <Input id="lastName" defaultValue="Chen" className="bg-background/50 border-border/50 focus:border-primary/50" />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email address</Label>
                <Input id="email" type="email" defaultValue="sarah.chen@meridianlabs.com" className="bg-background/50 border-border/50 focus:border-primary/50" />
              </div>
              <Button className="mt-4 bg-primary text-primary-foreground hover:bg-primary/90">Save Changes</Button>
            </CardContent>
          </Card>

          <Card className="bg-card/50 border-border/50 backdrop-blur-sm shadow-xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><Building className="w-5 h-5 text-primary" /> Company Details</CardTitle>
              <CardDescription>Manage your company information.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="companyName">Company Name</Label>
                <Input id="companyName" defaultValue="Meridian Labs" className="bg-background/50 border-border/50 focus:border-primary/50" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="taxId">Tax ID</Label>
                <Input id="taxId" defaultValue="XX-XXXXXXX" className="bg-background/50 border-border/50 focus:border-primary/50" />
              </div>
              <Button className="mt-4 bg-primary text-primary-foreground hover:bg-primary/90">Update Company</Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="apikeys" className="mt-6 space-y-6">
          <Card className="bg-card/50 border-border/50 backdrop-blur-sm shadow-xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><Key className="w-5 h-5 text-primary" /> Bring Your Own Key (BYOK)</CardTitle>
              <CardDescription>
                Securely store your API keys locally in your browser. These keys are never stored on our servers and are only sent directly to the AI providers when you use the AI Assistant.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="gemini">Google Gemini API Key</Label>
                <Input id="gemini" type="password" value={geminiKey} onChange={(e) => setGeminiKey(e.target.value)} placeholder="AIzaSy..." className="bg-background/50 border-border/50 focus:border-primary/50" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="openai">OpenAI API Key</Label>
                <Input id="openai" type="password" value={openAIKey} onChange={(e) => setOpenAIKey(e.target.value)} placeholder="sk-..." className="bg-background/50 border-border/50 focus:border-primary/50" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="anthropic">Anthropic API Key</Label>
                <Input id="anthropic" type="password" value={anthropicKey} onChange={(e) => setAnthropicKey(e.target.value)} placeholder="sk-ant-..." className="bg-background/50 border-border/50 focus:border-primary/50" />
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={saveKeys} className="bg-primary text-primary-foreground hover:bg-primary/90">Save API Keys</Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="data" className="mt-6 space-y-6">
          <Card className="bg-card/50 border-border/50 backdrop-blur-sm shadow-xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-primary"><Database className="w-5 h-5" /> Data Management</CardTitle>
              <CardDescription>Manage your workspace data.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-4 border border-border/50 rounded-xl bg-background/30">
                <div>
                  <p className="font-medium text-foreground">Generate Showcase Data</p>
                  <p className="text-sm text-muted-foreground mt-1">Populate your workspace with dummy transactions and graphs so you can preview the system capabilities.</p>
                </div>
                <Button 
                  variant="outline" 
                  onClick={handleSeedData}
                  disabled={isSeeding || isDeleting}
                  className="ml-4 whitespace-nowrap bg-primary text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground"
                >
                  {isSeeding ? "Generating..." : "Generate Data"}
                </Button>
              </div>

              <div className="flex items-center justify-between p-4 border border-destructive/30 rounded-xl bg-destructive/5 mt-4">
                <div>
                  <p className="font-medium text-foreground">Delete All Data</p>
                  <p className="text-sm text-muted-foreground mt-1">Permanently remove all transactions and receipts from your workspace. This allows you to start fresh without any dummy data.</p>
                </div>
                <Button 
                  variant="destructive" 
                  onClick={handleDeleteAllData}
                  disabled={isDeleting || isSeeding}
                  className="ml-4 whitespace-nowrap"
                >
                  {isDeleting ? "Deleting..." : "Delete All Data"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="mt-6 space-y-6">
          <Card className="bg-card/50 border-border/50 backdrop-blur-sm shadow-xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><Bell className="w-5 h-5 text-primary" /> Notification Preferences</CardTitle>
              <CardDescription>Choose what updates you want to receive.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-base">Expense Approvals</Label>
                  <p className="text-sm text-muted-foreground">Receive an email when an expense needs approval.</p>
                </div>
                <Switch defaultChecked className="data-[state=checked]:bg-primary" />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-base">Weekly Summary</Label>
                  <p className="text-sm text-muted-foreground">Get a weekly breakdown of company spending.</p>
                </div>
                <Switch defaultChecked className="data-[state=checked]:bg-primary" />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-base">Anomalies & Alerts</Label>
                  <p className="text-sm text-muted-foreground">Immediate alerts for duplicate or suspicious transactions.</p>
                </div>
                <Switch defaultChecked className="data-[state=checked]:bg-primary" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card/50 border-border/50 backdrop-blur-sm shadow-xl border-destructive/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-destructive"><Shield className="w-5 h-5" /> Security Alerts</CardTitle>
              <CardDescription>Important security-related notifications.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-base">New Device Logins</Label>
                  <p className="text-sm text-muted-foreground">Alert when someone signs in from a new device.</p>
                </div>
                <Switch defaultChecked disabled className="opacity-50 data-[state=checked]:bg-destructive" />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="billing" className="mt-6 space-y-6">
          <Card className="bg-card/50 border-border/50 backdrop-blur-sm shadow-xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><CreditCard className="w-5 h-5 text-primary" /> Payment Methods</CardTitle>
              <CardDescription>Manage your active payment methods and billing history.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between p-4 border border-border/50 rounded-xl bg-background/30">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-8 bg-secondary rounded flex items-center justify-center border border-border">
                    <span className="font-bold text-xs text-foreground">VISA</span>
                  </div>
                  <div>
                    <p className="font-medium text-foreground">Visa ending in 4242</p>
                    <p className="text-sm text-muted-foreground">Expires 12/2028</p>
                  </div>
                </div>
                <Button variant="outline" size="sm">Edit</Button>
              </div>
              <Button className="mt-6 bg-secondary text-foreground hover:bg-secondary/80 w-full">Add Payment Method</Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Download, Filter, Search, Upload } from "lucide-react"
import { getTransactionsServer } from "@/lib/api-server"

export default async function ReceiptsPage() {
  const transactions = await getTransactionsServer();

  return (
    <div className="flex flex-col gap-8 max-w-7xl mx-auto w-full p-2">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">Receipts</h1>
          <p className="text-muted-foreground mt-2">Manage and review all uploaded company receipts.</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" className="bg-background/50 border-border/50"><Download className="w-4 h-4 mr-2" /> Export</Button>
          <Button className="bg-primary text-primary-foreground hover:bg-primary/90"><Upload className="w-4 h-4 mr-2" /> Upload Receipt</Button>
        </div>
      </div>

      <Card className="bg-card/50 border-border/50 backdrop-blur-sm shadow-xl">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Recent Receipts</CardTitle>
              <CardDescription>A list of recent receipts uploaded by employees.</CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input type="search" placeholder="Search merchants..." className="pl-9 w-[250px] bg-background/50 border-border/50 focus:border-primary/50" />
              </div>
              <Button variant="outline" size="icon" className="bg-background/50 border-border/50"><Filter className="w-4 h-4" /></Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border border-border/50 bg-background/30 overflow-hidden">
            <Table>
              <TableHeader className="bg-background/50">
                <TableRow className="border-border/50 hover:bg-transparent">
                  <TableHead className="w-[120px]">Receipt ID</TableHead>
                  <TableHead>Merchant</TableHead>
                  <TableHead className="w-[150px]">Date</TableHead>
                  <TableHead className="w-[150px]">Category</TableHead>
                  <TableHead className="w-[120px]">Status</TableHead>
                  <TableHead className="text-right w-[120px]">Amount</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {transactions.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                      No receipts found.
                    </TableCell>
                  </TableRow>
                ) : (
                  transactions.map((tx) => (
                    <TableRow key={tx.id} className="border-border/50 hover:bg-white/5 cursor-pointer">
                      <TableCell className="font-mono text-xs text-muted-foreground">{tx.id.substring(0, 8)}</TableCell>
                      <TableCell className="font-medium">{tx.merchant}</TableCell>
                      <TableCell className="text-muted-foreground">{tx.date}</TableCell>
                      <TableCell>{tx.category}</TableCell>
                      <TableCell>
                        <Badge 
                          variant={tx.isFlagged ? "destructive" : "default"}
                          className={!tx.isFlagged ? "bg-primary/20 text-primary border-primary/20" : ""}
                        >
                          {tx.isFlagged ? "Flagged" : "Approved"}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right font-medium">${tx.amount.toFixed(2)}</TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

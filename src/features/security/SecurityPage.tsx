import { useWorkflows } from "@/services/supabaseApi"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Shield, Plus } from "lucide-react"

export function SecurityPage() {
  const { data: workflows = [], isLoading } = useWorkflows()

  return (
    <div className="p-8 space-y-8 bg-surface min-h-full">
      
      {/* Page Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Shield className="w-6 h-6 text-blue-500" />
            Security Workflows
          </h1>
          <p className="text-muted-foreground mt-1">
            Manage and monitor automation pipelines
          </p>
        </div>

        <Button>
          <Plus className="w-4 h-4 mr-2" />
          New Workflow
        </Button>
      </div>

      {/* Loading State */}
      {isLoading && (
        <p className="text-muted-foreground">Loading workflows...</p>
      )}

      {/* Stats Row */}
<div className="grid grid-cols-2 md:grid-cols-4 gap-4">
  <div className="border-t border-border pt-6"></div>
  <Card className="bg-panel border-border hover:border-blue-500 hover:shadow-xl hover:-translate-y-1 transition-all duration-200 cursor-pointer">
    <CardContent className="p-4">
      <p className="text-xs text-muted-foreground">Total</p>
      <p className="text-2xl font-bold">{workflows.length}</p>
    </CardContent>
  </Card>

  <Card className="bg-panel border-border hover:border-blue-500 hover:shadow-xl hover:-translate-y-1 transition-all duration-200 cursor-pointer">
    <CardContent className="p-4">
      <p className="text-xs text-muted-foreground">Active</p>
      <p className="text-2xl font-bold">
        {workflows.filter(w => w.status === "active").length}
      </p>
    </CardContent>
  </Card>

  <Card className="bg-panel border-border hover:border-blue-500 hover:shadow-xl hover:-translate-y-1 transition-all duration-200 cursor-pointer">
    <CardContent className="p-4">
      <p className="text-xs text-muted-foreground">Paused</p>
      <p className="text-2xl font-bold">
        {workflows.filter(w => w.status === "paused").length}
      </p>
    </CardContent>
  </Card>

  <Card className="bg-panel border-border hover:border-blue-500 hover:shadow-xl hover:-translate-y-1 transition-all duration-200 cursor-pointer">
    <CardContent className="p-4">
      <p className="text-xs text-muted-foreground">Failed</p>
      <p className="text-2xl font-bold">
        {workflows.filter(w => w.status === "failed").length}
      </p>
    </CardContent>
  </Card>
</div>

      {/* Workflow Cards */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {workflows.map((workflow: any) => (
          <Card
            key={workflow.id}
            className="bg-panel border-border hover:border-blue-500 hover:shadow-lg transition cursor-pointer"
          >
            <CardHeader>
              <CardTitle>{workflow.name}</CardTitle>
            </CardHeader>
            <CardContent className="flex justify-between items-center">
              <div className="flex flex-col text-sm text-muted-foreground">
                <span>Created recently</span>
                 <span className="text-xs opacity-60">
                   Last run: 2h ago
                </span>
             </div>
              <Badge
                variant="secondary"
                 className={
                   workflow.status === "active"
                    ? "bg-green-600/20 text-green-400 border-green-500"
                    : workflow.status === "failed"
                    ? "bg-red-600/20 text-red-400 border-red-500"
                    : "bg-yellow-600/20 text-yellow-400 border-yellow-500"
               }
              >
                  {workflow.status || "active"}
                  </Badge>
            </CardContent>
          </Card>
        ))}
      </div>

    </div>
  )
}
import { useWorkflows, useCreateWorkflow } from '@/services/supabaseApi'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Shield, Plus } from "lucide-react"

export default function Security({ workflows }) {
  return (
    <div className="p-8 space-y-6">
      
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

      {/* Workflow Cards */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {workflows.map((workflow) => (
          <Card key={workflow.id} className="hover:shadow-lg transition">
            <CardHeader>
              <CardTitle>{workflow.name}</CardTitle>
            </CardHeader>
            <CardContent className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">
                Created recently
              </span>
              <Badge variant="secondary">
                {workflow.status || "active"}
              </Badge>
            </CardContent>
          </Card>
        ))}
      </div>

    </div>
  )
}

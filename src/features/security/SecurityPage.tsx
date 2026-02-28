import { useWorkflows, useCreateWorkflow } from '@/services/supabaseApi'

export function SecurityPage() {
  const workflowsQuery = useWorkflows()
  const createMutation = useCreateWorkflow()

  if (workflowsQuery.isLoading) {
    return <div>Loading workflows...</div>
  }

  if (workflowsQuery.error) {
    return <div>Error loading workflows</div>
  }

  return (
    <div>
      <h2>Workflow Test (Supabase)</h2>

      <button
        onClick={() =>
          createMutation.mutate({
            name: 'New Workflow',
            status: 'active'
          })
        }
        disabled={createMutation.isPending}
      >
        {createMutation.isPending ? 'Creating...' : 'New Workflow'}
      </button>

      <ul>
        {workflowsQuery.data?.map((wf: any) => (
          <li key={wf.id}>
            {wf.name} - {wf.status}
          </li>
        ))}
      </ul>
    </div>
  )
}

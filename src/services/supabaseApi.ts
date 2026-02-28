// src/services/supabaseApi.ts
import { supabase } from '../lib/supabase'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query' // npm i @tanstack/react-query

// Get workflows (replace your mock getWorkflows)
export function useWorkflows() {
  return useQuery({
    queryKey: ['workflows'],
    queryFn: async () => {
      const { data, error } = await supabase.from('workflows').select('*').order('updated_at', { ascending: false })
      if (error) throw error
      return data
    }
  })
}

// Create workflow (for "New Workflow" button)
export function useCreateWorkflow() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (newWorkflow: { name: string; status: string }) => 
      supabase.from('workflows').insert(newWorkflow).select(),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['workflows'] })
  })
}

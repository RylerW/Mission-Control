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

// Create workflow (FIXED VERSION)
export function useCreateWorkflow() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (newWorkflow: { name: string; status: string }) => {
      const { data, error } = await supabase
        .from('workflows')
        .insert(newWorkflow)
        .select()

      if (error) throw error
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['workflows'] })
    }
  })
}

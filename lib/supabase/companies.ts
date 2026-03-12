import { supabase } from '@/lib/supabase'
import type { Company } from '@/types'

export async function fetchCompanies(): Promise<Company[]> {
  const { data, error } = await supabase
    .from('companies')
    .select('id, name, logo, slug')
    .order('name', { ascending: true })

  if (error) {
    console.error('Error fetching companies:', error)
    throw new Error(`Failed to fetch companies: ${error.message}`)
  }

  return data || []
}

export async function fetchCompanyById(id: number): Promise<Company | null> {
  const { data, error } = await supabase
    .from('companies')
    .select('id, name, logo, slug')
    .eq('id', id)
    .single()

  if (error) {
    if (error.code === 'PGRST116') {
      return null
    }
    console.error('Error fetching company:', error)
    throw new Error(`Failed to fetch company: ${error.message}`)
  }

  return data
}

export async function fetchCompaniesByIds(ids: number[]): Promise<Company[]> {
  if (ids.length === 0) return []

  const { data, error } = await supabase
    .from('companies')
    .select('id, name, logo, slug')
    .in('id', ids)
    .order('name', { ascending: true })

  if (error) {
    console.error('Error fetching companies:', error)
    throw new Error(`Failed to fetch companies: ${error.message}`)
  }

  return data || []
}

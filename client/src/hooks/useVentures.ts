import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import type {
  Venture,
  VentureStream,
  StreamDeliverable,
  ApplicationReview,
  ApprovalChainItem,
  Agreement,
  Session,
  MentorRequest,
  EngagementLog,
  RAGStatus,
  TriageOutcome,
  ApplicationSource,
  StreamSelfStatus,
  SupportType,
  Profile,
} from '../types';

// ===== Ventures =====

export function useVentures() {
  const { profile } = useAuth();

  return useQuery({
    queryKey: ['ventures', profile?.role],
    queryFn: async () => {
      let query = supabase
        .from('ventures')
        .select(`
          *,
          entrepreneur:profiles!ventures_entrepreneur_id_fkey(id, full_name, email, organization),
          venture_partner:profiles!ventures_venture_partner_id_fkey(id, full_name),
          success_manager:profiles!ventures_success_manager_id_fkey(id, full_name)
        `)
        .order('created_at', { ascending: false });

      // For entrepreneurs, only show their ventures
      if (profile?.role === 'entrepreneur') {
        query = query.eq('entrepreneur_id', profile.id);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data as (Venture & {
        entrepreneur: Profile;
        venture_partner: Profile | null;
        success_manager: Profile | null;
      })[];
    },
    enabled: !!profile,
  });
}

export function useVenture(ventureId: string | undefined) {
  return useQuery({
    queryKey: ['venture', ventureId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('ventures')
        .select(`
          *,
          entrepreneur:profiles!ventures_entrepreneur_id_fkey(id, full_name, email, organization, phone),
          venture_partner:profiles!ventures_venture_partner_id_fkey(id, full_name, designation),
          success_manager:profiles!ventures_success_manager_id_fkey(id, full_name, designation)
        `)
        .eq('id', ventureId!)
        .single();
      if (error) throw error;
      return data as Venture & {
        entrepreneur: Profile;
        venture_partner: Profile | null;
        success_manager: Profile | null;
      };
    },
    enabled: !!ventureId,
  });
}

export function useMyVenture() {
  const { profile } = useAuth();

  return useQuery({
    queryKey: ['my-venture', profile?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('ventures')
        .select(`
          *,
          venture_partner:profiles!ventures_venture_partner_id_fkey(id, full_name, designation),
          success_manager:profiles!ventures_success_manager_id_fkey(id, full_name, designation)
        `)
        .eq('entrepreneur_id', profile!.id)
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();
      if (error) throw error;
      return data as (Venture & {
        venture_partner: Profile | null;
        success_manager: Profile | null;
      }) | null;
    },
    enabled: !!profile && profile.role === 'entrepreneur',
  });
}

interface CreateVentureInput {
  // Step 1
  current_product: string;
  current_segment: string;
  current_geography: string;
  current_business_model: string;
  venture_product: string;
  venture_segment: string;
  venture_geography: string;
  venture_business_model: string;
  venture_description: string;
  expected_revenue_range: string;
  // Step 2
  progress_so_far: string;
  investment_willingness: string;
  resource_allocation: string;
  // Step 3
  source: ApplicationSource;
  streams: {
    stream_number: number;
    stream_name: string;
    self_status: StreamSelfStatus | '';
    support_type: SupportType | '';
    support_type_other: string;
  }[];
}

export function useCreateVenture() {
  const queryClient = useQueryClient();
  const { profile } = useAuth();

  return useMutation({
    mutationFn: async (input: CreateVentureInput) => {
      // Create venture
      const { data: venture, error: ventureError } = await supabase
        .from('ventures')
        .insert({
          entrepreneur_id: profile!.id,
          status: 'submitted',
          current_product: input.current_product,
          current_segment: input.current_segment,
          current_geography: input.current_geography,
          current_business_model: input.current_business_model,
          venture_product: input.venture_product || null,
          venture_segment: input.venture_segment || null,
          venture_geography: input.venture_geography || null,
          venture_business_model: input.venture_business_model || null,
          venture_description: input.venture_description || null,
          expected_revenue_range: input.expected_revenue_range || null,
          progress_so_far: input.progress_so_far || null,
          investment_willingness: input.investment_willingness || null,
          resource_allocation: input.resource_allocation || null,
          source: input.source || null,
        })
        .select()
        .single();

      if (ventureError) throw ventureError;

      // Create streams
      const streamInserts = input.streams
        .filter((s) => s.self_status)
        .map((s) => ({
          venture_id: venture.id,
          stream_number: s.stream_number,
          stream_name: s.stream_name,
          self_status: s.self_status || null,
          support_type: s.support_type || null,
          support_type_other: s.support_type_other || null,
        }));

      if (streamInserts.length > 0) {
        const { error: streamError } = await supabase
          .from('venture_streams')
          .insert(streamInserts);
        if (streamError) throw streamError;
      }

      return venture;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ventures'] });
      queryClient.invalidateQueries({ queryKey: ['my-venture'] });
    },
  });
}

export function useUpdateVenture() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, ...updates }: Partial<Venture> & { id: string }) => {
      const { data, error } = await supabase
        .from('ventures')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['venture', data.id] });
      queryClient.invalidateQueries({ queryKey: ['ventures'] });
    },
  });
}

// ===== Venture Streams =====

export function useVentureStreams(ventureId: string | undefined) {
  return useQuery({
    queryKey: ['venture-streams', ventureId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('venture_streams')
        .select(`
          *,
          deliverables:stream_deliverables(*)
        `)
        .eq('venture_id', ventureId!)
        .order('stream_number');
      if (error) throw error;

      // Sort deliverables by sequence_number
      return (data as (VentureStream & { deliverables: StreamDeliverable[] })[]).map((s) => ({
        ...s,
        deliverables: s.deliverables?.sort(
          (a: StreamDeliverable, b: StreamDeliverable) => a.sequence_number - b.sequence_number
        ),
      }));
    },
    enabled: !!ventureId,
  });
}

export function useUpdateStream() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, ...updates }: Partial<VentureStream> & { id: string }) => {
      const { data, error } = await supabase
        .from('venture_streams')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['venture-streams', data.venture_id] });
    },
  });
}

export function useUpdateDeliverable() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, ...updates }: Partial<StreamDeliverable> & { id: string }) => {
      const { data, error } = await supabase
        .from('stream_deliverables')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['venture-streams'] });
    },
  });
}

// ===== Application Reviews =====

export function useApplicationReview(ventureId: string | undefined) {
  return useQuery({
    queryKey: ['review', ventureId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('application_reviews')
        .select('*')
        .eq('venture_id', ventureId!)
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();
      if (error) throw error;
      return data as ApplicationReview | null;
    },
    enabled: !!ventureId,
  });
}

export function useCreateReview() {
  const queryClient = useQueryClient();
  const { profile } = useAuth();

  return useMutation({
    mutationFn: async (input: {
      venture_id: string;
      triage_outcome: TriageOutcome;
      decision_notes: string;
    }) => {
      // Create the review
      const { data, error } = await supabase
        .from('application_reviews')
        .insert({
          venture_id: input.venture_id,
          reviewer_id: profile!.id,
          reviewer_role: profile!.role,
          decision: 'approved',
          triage_outcome: input.triage_outcome,
          decision_notes: input.decision_notes,
          // Mock AI assessment data
          ai_tier_recommendation: input.triage_outcome,
          ai_failure_reasons: [
            'Market entry barriers may be higher than expected',
            'Limited track record in target geography',
            'Working capital requirements could strain cash flow',
            'Competition from established players',
            'Regulatory complexity in target market',
          ],
          ai_opportunity_reasons: [
            'Strong domestic foundation to build upon',
            'Growing market demand in target segment',
            'Government incentives available',
            'Unique value proposition in the market',
            'Scalable business model',
          ],
          ai_probing_questions: [
            'What specific distribution channels have you identified?',
            'How will you handle quality compliance in the new market?',
            'What is your customer acquisition cost estimate?',
            'Do you have any pilot customers or LOIs?',
            'What is your contingency plan if initial targets are not met?',
          ],
          ai_market_size: 'Target market estimated at significant opportunity',
          ai_jobs_impact: { creative: 20, destructive: 0, net: 20, description: 'New venture operations expected to create jobs' },
        })
        .select()
        .single();
      if (error) throw error;

      // Update venture status and tier
      const tier = input.triage_outcome === 'self_serve' ? null : input.triage_outcome;
      const status = input.triage_outcome === 'self_serve' ? 'self_serve' : 'under_review';

      await supabase
        .from('ventures')
        .update({ status, tier })
        .eq('id', input.venture_id);

      // Create approval chain based on tier
      if (tier) {
        await createApprovalChain(input.venture_id, tier, profile!.id);
      }

      return data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['review', variables.venture_id] });
      queryClient.invalidateQueries({ queryKey: ['venture', variables.venture_id] });
      queryClient.invalidateQueries({ queryKey: ['ventures'] });
      queryClient.invalidateQueries({ queryKey: ['approval-chain'] });
    },
  });
}

async function createApprovalChain(ventureId: string, tier: string, csmId: string) {
  const chain: { venture_id: string; approver_id: string; approver_role: string; sequence_number: number; status: string }[] = [];

  // CSM is the first approver (auto-approved since they triaged it)
  chain.push({
    venture_id: ventureId,
    approver_id: csmId,
    approver_role: 'success_manager',
    sequence_number: 1,
    status: 'approved',
  });

  // Field Head is second
  const { data: fieldHeads } = await supabase
    .from('profiles')
    .select('id')
    .eq('role', 'field_head')
    .limit(1);

  if (fieldHeads && fieldHeads.length > 0) {
    chain.push({
      venture_id: ventureId,
      approver_id: fieldHeads[0].id,
      approver_role: 'field_head',
      sequence_number: 2,
      status: 'pending',
    });
  }

  // Core and Select need Selection Manager
  if (tier === 'core' || tier === 'select') {
    const { data: selMgrs } = await supabase
      .from('profiles')
      .select('id')
      .eq('role', 'selection_manager')
      .limit(1);

    if (selMgrs && selMgrs.length > 0) {
      chain.push({
        venture_id: ventureId,
        approver_id: selMgrs[0].id,
        approver_role: 'selection_manager',
        sequence_number: 3,
        status: 'pending',
      });
    }
  }

  // Select also needs Committee
  if (tier === 'select') {
    const { data: committee } = await supabase
      .from('profiles')
      .select('id')
      .eq('role', 'selection_committee')
      .limit(1);

    if (committee && committee.length > 0) {
      chain.push({
        venture_id: ventureId,
        approver_id: committee[0].id,
        approver_role: 'selection_committee',
        sequence_number: 4,
        status: 'pending',
      });
    }
  }

  if (chain.length > 0) {
    await supabase.from('approval_chain').insert(chain);
  }
}

// ===== Approval Chain =====

export function useApprovalChain(ventureId: string | undefined) {
  return useQuery({
    queryKey: ['approval-chain', ventureId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('approval_chain')
        .select(`
          *,
          approver:profiles!approval_chain_approver_id_fkey(id, full_name, role, designation)
        `)
        .eq('venture_id', ventureId!)
        .order('sequence_number');
      if (error) throw error;
      return data as (ApprovalChainItem & { approver: Profile })[];
    },
    enabled: !!ventureId,
  });
}

export function useApproveVenture() {
  const queryClient = useQueryClient();
  const { profile } = useAuth();

  return useMutation({
    mutationFn: async (input: {
      venture_id: string;
      approval_id: string;
      status: 'approved' | 'rejected';
      notes?: string;
    }) => {
      // Update the approval chain item
      const { error } = await supabase
        .from('approval_chain')
        .update({
          status: input.status,
          notes: input.notes || null,
          decided_at: new Date().toISOString(),
        })
        .eq('id', input.approval_id);
      if (error) throw error;

      // If rejected, update venture status
      if (input.status === 'rejected') {
        await supabase
          .from('ventures')
          .update({ status: 'rejected' })
          .eq('id', input.venture_id);
        return;
      }

      // If approved, check if all approvals are complete
      const { data: chain } = await supabase
        .from('approval_chain')
        .select('*')
        .eq('venture_id', input.venture_id)
        .order('sequence_number');

      const allApproved = chain?.every((c) => c.status === 'approved');

      if (allApproved) {
        // All approved - move to approved status and create agreement
        await supabase
          .from('ventures')
          .update({ status: 'approved' })
          .eq('id', input.venture_id);

        // Create agreement
        const { data: streams } = await supabase
          .from('venture_streams')
          .select('*')
          .eq('venture_id', input.venture_id);

        const totalHours = streams?.reduce((sum, s) => {
          if (s.self_status === 'need_help') {
            return sum + (s.support_type === 'do' ? 30 : s.support_type === 'connect' ? 20 : 15);
          }
          return sum;
        }, 0) || 0;

        await supabase.from('agreements').insert({
          venture_id: input.venture_id,
          total_support_hours: totalHours,
          plan_details: { streams: streams || [] },
          terms: 'Standard Accelerate program terms apply. If support hours are exceeded, the beneficiary will fund additional engagement at prevailing rates.',
          status: 'pending',
        });

        // Assign VP and CSM if not already assigned
        if (profile) {
          const { data: venture } = await supabase
            .from('ventures')
            .select('venture_partner_id, success_manager_id')
            .eq('id', input.venture_id)
            .single();

          if (!venture?.venture_partner_id || !venture?.success_manager_id) {
            const updates: Record<string, string> = {};
            if (!venture?.success_manager_id) updates.success_manager_id = profile.id;
            if (Object.keys(updates).length > 0) {
              await supabase.from('ventures').update(updates).eq('id', input.venture_id);
            }
          }
        }
      }
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['approval-chain', variables.venture_id] });
      queryClient.invalidateQueries({ queryKey: ['venture', variables.venture_id] });
      queryClient.invalidateQueries({ queryKey: ['ventures'] });
      queryClient.invalidateQueries({ queryKey: ['agreement'] });
    },
  });
}

// Pending approvals for the current user
export function usePendingApprovals() {
  const { profile } = useAuth();

  return useQuery({
    queryKey: ['pending-approvals', profile?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('approval_chain')
        .select(`
          *,
          venture:ventures(
            id, status, tier,
            current_product, venture_product, venture_geography, venture_description,
            expected_revenue_range,
            entrepreneur:profiles!ventures_entrepreneur_id_fkey(id, full_name, organization)
          )
        `)
        .eq('approver_id', profile!.id)
        .eq('status', 'pending')
        .order('created_at');
      if (error) throw error;
      return data;
    },
    enabled: !!profile,
  });
}

// ===== Agreements =====

export function useAgreement(ventureId: string | undefined) {
  return useQuery({
    queryKey: ['agreement', ventureId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('agreements')
        .select('*')
        .eq('venture_id', ventureId!)
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();
      if (error) throw error;
      return data as Agreement | null;
    },
    enabled: !!ventureId,
  });
}

export function useUpdateAgreement() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: { id: string; status: 'accepted' | 'declined'; venture_id: string }) => {
      const updates: Record<string, unknown> = { status: input.status };
      if (input.status === 'accepted') {
        updates.accepted_at = new Date().toISOString();
      }

      const { error } = await supabase
        .from('agreements')
        .update(updates)
        .eq('id', input.id);
      if (error) throw error;

      // Update venture status
      if (input.status === 'accepted') {
        await supabase
          .from('ventures')
          .update({ status: 'active' })
          .eq('id', input.venture_id);

        // Create default deliverables for each stream
        const { data: streams } = await supabase
          .from('venture_streams')
          .select('*')
          .eq('venture_id', input.venture_id);

        if (streams) {
          const deliverables = streams.flatMap((stream) =>
            [1, 2, 3, 4, 5].map((seq) => ({
              stream_id: stream.id,
              sequence_number: seq,
              title: `${stream.stream_name} - Checkpoint ${seq}`,
              status: 'pending' as const,
              is_current: seq === 1,
            }))
          );
          await supabase.from('stream_deliverables').insert(deliverables);
        }
      }

      if (input.status === 'declined') {
        await supabase
          .from('ventures')
          .update({ status: 'dropped' })
          .eq('id', input.venture_id);
      }
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['agreement', variables.venture_id] });
      queryClient.invalidateQueries({ queryKey: ['venture', variables.venture_id] });
      queryClient.invalidateQueries({ queryKey: ['ventures'] });
      queryClient.invalidateQueries({ queryKey: ['my-venture'] });
    },
  });
}

// ===== Sessions =====

export function useSessions(ventureId: string | undefined) {
  return useQuery({
    queryKey: ['sessions', ventureId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('sessions')
        .select(`
          *,
          conductor:profiles!sessions_conducted_by_fkey(id, full_name, role)
        `)
        .eq('venture_id', ventureId!)
        .order('session_date', { ascending: false });
      if (error) throw error;
      return data as (Session & { conductor: Profile })[];
    },
    enabled: !!ventureId,
  });
}

// ===== Mentor Requests =====

export function useMentorRequests() {
  const { profile } = useAuth();

  return useQuery({
    queryKey: ['mentor-requests', profile?.id],
    queryFn: async () => {
      let query = supabase
        .from('mentor_requests')
        .select(`
          *,
          venture:ventures(id, venture_description,
            entrepreneur:profiles!ventures_entrepreneur_id_fkey(id, full_name, organization)
          ),
          stream:venture_streams(id, stream_name)
        `)
        .order('created_at', { ascending: false });

      if (profile?.role === 'mentor') {
        query = query.eq('mentor_id', profile.id);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data as MentorRequest[];
    },
    enabled: !!profile,
  });
}

export function useUpdateMentorRequest() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: { id: string; status: 'accepted' | 'declined' | 'completed' }) => {
      const { error } = await supabase
        .from('mentor_requests')
        .update({ status: input.status })
        .eq('id', input.id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['mentor-requests'] });
    },
  });
}

// ===== Engagement Logs =====

export function useEngagementLogs(ventureId: string | undefined) {
  return useQuery({
    queryKey: ['engagement-logs', ventureId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('engagement_logs')
        .select('*')
        .eq('venture_id', ventureId!)
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data as EngagementLog[];
    },
    enabled: !!ventureId,
  });
}

// ===== Dashboard Helpers =====

export function useVenturesWithStreams() {
  return useQuery({
    queryKey: ['ventures-with-streams'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('ventures')
        .select(`
          *,
          entrepreneur:profiles!ventures_entrepreneur_id_fkey(id, full_name, organization),
          venture_streams(stream_number, stream_name, rag_status)
        `)
        .in('status', ['active', 'approved'])
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data as (Venture & {
        entrepreneur: Profile;
        venture_streams: { stream_number: number; stream_name: string; rag_status: RAGStatus }[];
      })[];
    },
  });
}

export function useAllProfiles() {
  return useQuery({
    queryKey: ['all-profiles'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data as Profile[];
    },
  });
}

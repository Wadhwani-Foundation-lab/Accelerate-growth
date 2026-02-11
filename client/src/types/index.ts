// ===== User & Auth Types =====
export type UserRole =
  | 'entrepreneur'
  | 'venture_partner'
  | 'mentor'
  | 'success_manager'
  | 'field_head'
  | 'selection_manager'
  | 'selection_committee'
  | 'super_admin';

export interface Profile {
  id: string;
  full_name: string;
  email: string;
  phone?: string;
  avatar_url?: string;
  role: UserRole;
  organization?: string;
  designation?: string;
  geography?: string;
  created_at: string;
  updated_at: string;
}

// ===== Venture Types =====
export type VentureStatus =
  | 'draft'
  | 'submitted'
  | 'under_review'
  | 'approved'
  | 'rejected'
  | 'self_serve'
  | 'active'
  | 'completed'
  | 'dropped';

export type VentureTier = 'prime' | 'core' | 'select';

export type ApplicationSource =
  | 'self_initiated'
  | 'platform_nudge'
  | 'csm_referral'
  | 'ecosystem_referral';

export type RAGStatus = 'red' | 'yellow' | 'green' | 'complete';

export interface Venture {
  id: string;
  entrepreneur_id: string;
  status: VentureStatus;
  tier?: VentureTier;

  // Venture Definition
  current_product: string;
  current_segment: string;
  current_geography: string;
  current_business_model: string;
  venture_product?: string;
  venture_segment?: string;
  venture_geography?: string;
  venture_business_model?: string;
  venture_description?: string;
  expected_revenue_range?: string;

  // Commitment
  progress_so_far?: string;
  investment_willingness?: string;
  resource_allocation?: string;

  // Source
  source?: ApplicationSource;
  referrer_id?: string;

  // Assignments
  venture_partner_id?: string;
  success_manager_id?: string;

  // Status
  overall_rag?: RAGStatus;

  // Relations
  entrepreneur?: Profile;
  venture_partner?: Profile;
  success_manager?: Profile;

  created_at: string;
  updated_at: string;
}

// ===== Stream Types =====
export type StreamSelfStatus = 'done' | 'on_it' | 'need_help';
export type SupportType = 'learn' | 'connect' | 'do' | 'other';

export const STREAM_DEFINITIONS = [
  {
    number: 1,
    name: 'Capital & Funding',
    description: 'Secured funding or investment needed for the venture',
    icon: 'Banknote',
  },
  {
    number: 2,
    name: 'Product / Service',
    description: 'Customer-validated, paid-for product or service',
    icon: 'Package',
  },
  {
    number: 3,
    name: 'People & Talent',
    description: 'Right team assembled and operational',
    icon: 'Users',
  },
  {
    number: 4,
    name: 'Operations & Supply Chain',
    description: 'End-to-end operations running at required capacity',
    icon: 'Settings',
  },
  {
    number: 5,
    name: 'Go-to-Market (GTM)',
    description: 'Active sales pipeline with paying customers',
    icon: 'TrendingUp',
  },
  {
    number: 6,
    name: 'Procurement & Infrastructure',
    description: 'All required infrastructure and procurement in place',
    icon: 'Building',
  },
] as const;

export interface VentureStream {
  id: string;
  venture_id: string;
  stream_number: number;
  stream_name: string;
  end_deliverable?: string;
  self_status?: StreamSelfStatus;
  support_type?: SupportType;
  support_type_other?: string;
  owner_name?: string;
  target_quarter?: string;
  rag_status?: RAGStatus;
  created_at: string;
  updated_at: string;
  deliverables?: StreamDeliverable[];
}

export interface StreamDeliverable {
  id: string;
  stream_id: string;
  sequence_number: number;
  title: string;
  description?: string;
  target_date?: string;
  status: 'pending' | 'in_progress' | 'completed';
  is_current: boolean;
  created_at: string;
  updated_at: string;
}

// ===== Review & Approval Types =====
export type ReviewDecision = 'pending' | 'approved' | 'rejected' | 'needs_interview';
export type TriageOutcome = 'self_serve' | 'prime' | 'core' | 'select';

export interface ApplicationReview {
  id: string;
  venture_id: string;
  reviewer_id: string;
  reviewer_role: string;
  ai_tier_recommendation?: string;
  ai_failure_reasons?: string[];
  ai_opportunity_reasons?: string[];
  ai_probing_questions?: string[];
  ai_market_size?: string;
  ai_jobs_impact?: Record<string, unknown>;
  decision: ReviewDecision;
  decision_notes?: string;
  triage_outcome?: TriageOutcome;
  created_at: string;
  updated_at: string;
}

export type ApprovalStatus = 'pending' | 'approved' | 'rejected';

export interface ApprovalChainItem {
  id: string;
  venture_id: string;
  approver_id: string;
  approver_role: string;
  sequence_number: number;
  status: ApprovalStatus;
  notes?: string;
  decided_at?: string;
  created_at: string;
  approver?: Profile;
}

// ===== Agreement Types =====
export type AgreementStatus = 'pending' | 'accepted' | 'declined';

export interface Agreement {
  id: string;
  venture_id: string;
  total_support_hours: number;
  plan_details: Record<string, unknown>;
  terms?: string;
  status: AgreementStatus;
  accepted_at?: string;
  created_at: string;
  updated_at: string;
}

// ===== Session Types =====
export type SessionType = 'venture_partner_checkin' | 'mentor_session' | 'interview';

export interface Session {
  id: string;
  venture_id: string;
  session_type: SessionType;
  conducted_by: string;
  recording_url?: string;
  transcript?: string;
  ai_summary?: {
    challenges: string[];
    action_items_beneficiary: string[];
    action_items_foundation: string[];
  };
  session_date: string;
  duration_minutes?: number;
  created_at: string;
  conductor?: Profile;
}

// ===== Mentor Request Types =====
export type MentorRequestStatus = 'pending' | 'accepted' | 'declined' | 'completed';

export interface MentorRequest {
  id: string;
  venture_id: string;
  stream_id: string;
  mentor_id: string;
  request_details?: string;
  ai_briefing?: string;
  ai_starting_notes?: string;
  status: MentorRequestStatus;
  created_at: string;
  updated_at: string;
  mentor?: Profile;
  venture?: Venture;
  stream?: VentureStream;
}

// ===== Engagement Types =====
export type EngagementAction = 'learn' | 'connect' | 'do';

export interface EngagementLog {
  id: string;
  venture_id: string;
  stream_id: string;
  action_type: EngagementAction;
  details?: Record<string, unknown>;
  hours_consumed: number;
  created_at: string;
}

// ===== Revenue Range Options =====
export const REVENUE_RANGES = [
  { value: '1cr', label: '₹1 Crore' },
  { value: '5cr', label: '₹5 Crore' },
  { value: '10cr', label: '₹10 Crore' },
  { value: '50cr', label: '₹50 Crore' },
  { value: '100cr_plus', label: '₹100 Crore+' },
] as const;

export const INVESTMENT_RANGES = [
  { value: '10l', label: '₹10 Lakh' },
  { value: '50l', label: '₹50 Lakh' },
  { value: '1cr', label: '₹1 Crore' },
  { value: '5cr', label: '₹5 Crore' },
  { value: '10cr_plus', label: '₹10 Crore+' },
] as const;

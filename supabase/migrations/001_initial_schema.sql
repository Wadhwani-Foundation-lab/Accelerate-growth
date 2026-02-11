-- =============================================
-- Accelerate Growth Platform - Initial Schema
-- =============================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =============================================
-- ENUM TYPES
-- =============================================

CREATE TYPE user_role AS ENUM (
  'entrepreneur', 'venture_partner', 'mentor', 'success_manager',
  'field_head', 'selection_manager', 'selection_committee', 'super_admin'
);

CREATE TYPE venture_status AS ENUM (
  'draft', 'submitted', 'under_review', 'approved', 'rejected',
  'self_serve', 'active', 'completed', 'dropped'
);

CREATE TYPE venture_tier AS ENUM ('prime', 'core', 'select');

CREATE TYPE application_source AS ENUM (
  'self_initiated', 'platform_nudge', 'csm_referral', 'ecosystem_referral'
);

CREATE TYPE rag_status AS ENUM ('red', 'yellow', 'green', 'complete');

CREATE TYPE stream_self_status AS ENUM ('done', 'on_it', 'need_help');

CREATE TYPE support_type AS ENUM ('learn', 'connect', 'do', 'other');

CREATE TYPE review_decision AS ENUM ('pending', 'approved', 'rejected', 'needs_interview');

CREATE TYPE triage_outcome AS ENUM ('self_serve', 'prime', 'core', 'select');

CREATE TYPE approval_status AS ENUM ('pending', 'approved', 'rejected');

CREATE TYPE agreement_status AS ENUM ('pending', 'accepted', 'declined');

CREATE TYPE session_type AS ENUM ('venture_partner_checkin', 'mentor_session', 'interview');

CREATE TYPE mentor_request_status AS ENUM ('pending', 'accepted', 'declined', 'completed');

CREATE TYPE engagement_action AS ENUM ('learn', 'connect', 'do');

CREATE TYPE deliverable_status AS ENUM ('pending', 'in_progress', 'completed');

-- =============================================
-- PROFILES
-- =============================================

CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  avatar_url TEXT,
  role user_role NOT NULL DEFAULT 'entrepreneur',
  organization TEXT,
  designation TEXT,
  geography TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- =============================================
-- VENTURES
-- =============================================

CREATE TABLE ventures (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  entrepreneur_id UUID NOT NULL REFERENCES profiles(id),
  status venture_status NOT NULL DEFAULT 'draft',
  tier venture_tier,

  -- Venture Definition (Screen 1)
  current_product TEXT,
  current_segment TEXT,
  current_geography TEXT,
  current_business_model TEXT,
  venture_product TEXT,
  venture_segment TEXT,
  venture_geography TEXT,
  venture_business_model TEXT,
  venture_description TEXT,
  expected_revenue_range TEXT,

  -- Commitment (Screen 2)
  progress_so_far TEXT,
  investment_willingness TEXT,
  resource_allocation TEXT,

  -- Application Source
  source application_source,
  referrer_id UUID REFERENCES profiles(id),

  -- Assignments
  venture_partner_id UUID REFERENCES profiles(id),
  success_manager_id UUID REFERENCES profiles(id),

  -- Overall Status
  overall_rag rag_status DEFAULT 'green',

  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- =============================================
-- VENTURE STREAMS (6 per venture)
-- =============================================

CREATE TABLE venture_streams (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  venture_id UUID NOT NULL REFERENCES ventures(id) ON DELETE CASCADE,
  stream_number INT NOT NULL CHECK (stream_number BETWEEN 1 AND 6),
  stream_name TEXT NOT NULL,
  end_deliverable TEXT,

  -- Applicant Self-Assessment
  self_status stream_self_status,
  support_type support_type,
  support_type_other TEXT,

  -- Execution Phase
  owner_name TEXT,
  target_quarter TEXT,
  rag_status rag_status DEFAULT 'green',

  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  UNIQUE(venture_id, stream_number)
);

-- =============================================
-- STREAM DELIVERABLES (5 per stream = 30 total)
-- =============================================

CREATE TABLE stream_deliverables (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  stream_id UUID NOT NULL REFERENCES venture_streams(id) ON DELETE CASCADE,
  sequence_number INT NOT NULL CHECK (sequence_number BETWEEN 1 AND 5),
  title TEXT NOT NULL,
  description TEXT,
  target_date DATE,
  status deliverable_status NOT NULL DEFAULT 'pending',
  is_current BOOLEAN NOT NULL DEFAULT false,

  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  UNIQUE(stream_id, sequence_number)
);

-- =============================================
-- APPLICATION REVIEWS
-- =============================================

CREATE TABLE application_reviews (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  venture_id UUID NOT NULL REFERENCES ventures(id) ON DELETE CASCADE,
  reviewer_id UUID NOT NULL REFERENCES profiles(id),
  reviewer_role TEXT,

  -- AI Assessment
  ai_tier_recommendation TEXT,
  ai_failure_reasons JSONB,
  ai_opportunity_reasons JSONB,
  ai_probing_questions JSONB,
  ai_market_size TEXT,
  ai_jobs_impact JSONB,

  -- Human Decision
  decision review_decision NOT NULL DEFAULT 'pending',
  decision_notes TEXT,
  triage_outcome triage_outcome,

  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- =============================================
-- APPROVAL CHAIN
-- =============================================

CREATE TABLE approval_chain (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  venture_id UUID NOT NULL REFERENCES ventures(id) ON DELETE CASCADE,
  approver_id UUID NOT NULL REFERENCES profiles(id),
  approver_role TEXT NOT NULL,
  sequence_number INT NOT NULL,
  status approval_status NOT NULL DEFAULT 'pending',
  notes TEXT,
  decided_at TIMESTAMPTZ,

  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  UNIQUE(venture_id, sequence_number)
);

-- =============================================
-- AGREEMENTS
-- =============================================

CREATE TABLE agreements (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  venture_id UUID NOT NULL REFERENCES ventures(id) ON DELETE CASCADE,
  total_support_hours INT NOT NULL DEFAULT 0,
  plan_details JSONB,
  terms TEXT,
  status agreement_status NOT NULL DEFAULT 'pending',
  accepted_at TIMESTAMPTZ,

  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- =============================================
-- SESSIONS
-- =============================================

CREATE TABLE sessions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  venture_id UUID NOT NULL REFERENCES ventures(id) ON DELETE CASCADE,
  session_type session_type NOT NULL,
  conducted_by UUID NOT NULL REFERENCES profiles(id),

  recording_url TEXT,
  transcript TEXT,
  ai_summary JSONB,

  session_date TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  duration_minutes INT,

  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- =============================================
-- MENTOR REQUESTS
-- =============================================

CREATE TABLE mentor_requests (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  venture_id UUID NOT NULL REFERENCES ventures(id) ON DELETE CASCADE,
  stream_id UUID NOT NULL REFERENCES venture_streams(id),
  mentor_id UUID NOT NULL REFERENCES profiles(id),
  request_details TEXT,
  ai_briefing TEXT,
  ai_starting_notes TEXT,
  status mentor_request_status NOT NULL DEFAULT 'pending',

  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- =============================================
-- ENGAGEMENT LOGS
-- =============================================

CREATE TABLE engagement_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  venture_id UUID NOT NULL REFERENCES ventures(id) ON DELETE CASCADE,
  stream_id UUID NOT NULL REFERENCES venture_streams(id),
  action_type engagement_action NOT NULL,
  details JSONB,
  hours_consumed DECIMAL(10,2) NOT NULL DEFAULT 0,

  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- =============================================
-- INDEXES
-- =============================================

CREATE INDEX idx_ventures_entrepreneur ON ventures(entrepreneur_id);
CREATE INDEX idx_ventures_status ON ventures(status);
CREATE INDEX idx_ventures_vp ON ventures(venture_partner_id);
CREATE INDEX idx_ventures_csm ON ventures(success_manager_id);
CREATE INDEX idx_venture_streams_venture ON venture_streams(venture_id);
CREATE INDEX idx_stream_deliverables_stream ON stream_deliverables(stream_id);
CREATE INDEX idx_reviews_venture ON application_reviews(venture_id);
CREATE INDEX idx_approval_chain_venture ON approval_chain(venture_id);
CREATE INDEX idx_sessions_venture ON sessions(venture_id);
CREATE INDEX idx_mentor_requests_mentor ON mentor_requests(mentor_id);
CREATE INDEX idx_engagement_logs_venture ON engagement_logs(venture_id);

-- =============================================
-- ROW LEVEL SECURITY
-- =============================================

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE ventures ENABLE ROW LEVEL SECURITY;
ALTER TABLE venture_streams ENABLE ROW LEVEL SECURITY;
ALTER TABLE stream_deliverables ENABLE ROW LEVEL SECURITY;
ALTER TABLE application_reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE approval_chain ENABLE ROW LEVEL SECURITY;
ALTER TABLE agreements ENABLE ROW LEVEL SECURITY;
ALTER TABLE sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE mentor_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE engagement_logs ENABLE ROW LEVEL SECURITY;

-- Profiles: users can read all profiles, update own
CREATE POLICY "Profiles are viewable by authenticated users" ON profiles
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE TO authenticated USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON profiles
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = id);

-- Ventures: entrepreneurs see own, staff see assigned/all
CREATE POLICY "Entrepreneurs see own ventures" ON ventures
  FOR SELECT TO authenticated
  USING (
    entrepreneur_id = auth.uid()
    OR venture_partner_id = auth.uid()
    OR success_manager_id = auth.uid()
    OR EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('super_admin', 'field_head', 'selection_manager', 'selection_committee'))
  );

CREATE POLICY "Entrepreneurs can create ventures" ON ventures
  FOR INSERT TO authenticated
  WITH CHECK (entrepreneur_id = auth.uid());

CREATE POLICY "Authorized users can update ventures" ON ventures
  FOR UPDATE TO authenticated
  USING (
    entrepreneur_id = auth.uid()
    OR venture_partner_id = auth.uid()
    OR success_manager_id = auth.uid()
    OR EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('super_admin'))
  );

-- Streams, Deliverables: follow venture access
CREATE POLICY "Stream access follows venture access" ON venture_streams
  FOR ALL TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM ventures v WHERE v.id = venture_id
      AND (v.entrepreneur_id = auth.uid() OR v.venture_partner_id = auth.uid() OR v.success_manager_id = auth.uid()
           OR EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('super_admin', 'mentor', 'field_head')))
    )
  );

CREATE POLICY "Deliverable access follows stream access" ON stream_deliverables
  FOR ALL TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM venture_streams vs
      JOIN ventures v ON v.id = vs.venture_id
      WHERE vs.id = stream_id
      AND (v.entrepreneur_id = auth.uid() OR v.venture_partner_id = auth.uid() OR v.success_manager_id = auth.uid()
           OR EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('super_admin', 'mentor')))
    )
  );

-- Reviews, Approvals, Agreements, Sessions: accessible based on role
CREATE POLICY "Reviews accessible to reviewers and admins" ON application_reviews
  FOR ALL TO authenticated
  USING (
    reviewer_id = auth.uid()
    OR EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('super_admin', 'success_manager', 'selection_manager', 'selection_committee', 'field_head'))
  );

CREATE POLICY "Approvals accessible to approvers" ON approval_chain
  FOR ALL TO authenticated
  USING (
    approver_id = auth.uid()
    OR EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('super_admin'))
  );

CREATE POLICY "Agreements accessible to venture stakeholders" ON agreements
  FOR ALL TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM ventures v WHERE v.id = venture_id
      AND (v.entrepreneur_id = auth.uid() OR v.venture_partner_id = auth.uid() OR v.success_manager_id = auth.uid()
           OR EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('super_admin')))
    )
  );

CREATE POLICY "Sessions accessible to participants" ON sessions
  FOR ALL TO authenticated
  USING (
    conducted_by = auth.uid()
    OR EXISTS (
      SELECT 1 FROM ventures v WHERE v.id = venture_id
      AND (v.entrepreneur_id = auth.uid() OR v.venture_partner_id = auth.uid() OR v.success_manager_id = auth.uid()
           OR EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('super_admin', 'mentor')))
    )
  );

CREATE POLICY "Mentor requests accessible to mentors and stakeholders" ON mentor_requests
  FOR ALL TO authenticated
  USING (
    mentor_id = auth.uid()
    OR EXISTS (
      SELECT 1 FROM ventures v WHERE v.id = venture_id
      AND (v.entrepreneur_id = auth.uid() OR v.venture_partner_id = auth.uid() OR v.success_manager_id = auth.uid()
           OR EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('super_admin')))
    )
  );

CREATE POLICY "Engagement logs accessible to venture stakeholders" ON engagement_logs
  FOR ALL TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM ventures v WHERE v.id = venture_id
      AND (v.entrepreneur_id = auth.uid() OR v.venture_partner_id = auth.uid() OR v.success_manager_id = auth.uid()
           OR EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('super_admin')))
    )
  );

-- =============================================
-- TRIGGERS: Auto-update updated_at
-- =============================================

CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER update_ventures_updated_at BEFORE UPDATE ON ventures FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER update_venture_streams_updated_at BEFORE UPDATE ON venture_streams FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER update_stream_deliverables_updated_at BEFORE UPDATE ON stream_deliverables FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER update_application_reviews_updated_at BEFORE UPDATE ON application_reviews FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER update_agreements_updated_at BEFORE UPDATE ON agreements FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER update_mentor_requests_updated_at BEFORE UPDATE ON mentor_requests FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- =============================================
-- AUTO-CREATE PROFILE ON SIGNUP
-- =============================================

CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, email, role, organization, phone)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
    COALESCE(NEW.email, ''),
    COALESCE((NEW.raw_user_meta_data->>'role')::user_role, 'entrepreneur'),
    COALESCE(NEW.raw_user_meta_data->>'organization', ''),
    COALESCE(NEW.raw_user_meta_data->>'phone', '')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

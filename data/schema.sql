-- OpenPrep Database Schema for Supabase
-- Run this SQL in Supabase SQL Editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- USERS & AUTH
-- ============================================

-- Profiles table (extends Supabase auth.users)
CREATE TABLE profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    username TEXT UNIQUE NOT NULL,
    avatar_url TEXT,
    github_url TEXT,
    bio TEXT,
    is_onboarded BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- SUBMISSIONS
-- ============================================

CREATE TABLE submissions (
    id SERIAL PRIMARY KEY,
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
    problem_id INTEGER NOT NULL,
    language TEXT NOT NULL,
    code TEXT NOT NULL,
    status TEXT CHECK (status IN ('Accepted', 'Wrong Answer', 'Time Limit Exceeded', 'Runtime Error', 'Compile Error')) NOT NULL,
    runtime_ms INTEGER,
    memory_kb INTEGER,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for submissions
CREATE INDEX idx_submissions_user ON submissions(user_id);
CREATE INDEX idx_submissions_problem ON submissions(problem_id);
CREATE INDEX idx_submissions_status ON submissions(status);
CREATE INDEX idx_submissions_created ON submissions(created_at DESC);

-- ============================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================

-- Enable RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE submissions ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Public profiles are viewable by everyone"
    ON profiles FOR SELECT USING (true);

CREATE POLICY "Users can update own profile"
    ON profiles FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
    ON profiles FOR INSERT WITH CHECK (auth.uid() = id);

-- Submissions policies
CREATE POLICY "Users can view own submissions"
    ON submissions FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own submissions"
    ON submissions FOR INSERT WITH CHECK (auth.uid() = user_id);

-- ============================================
-- AUTH TRIGGER (Auto-create profile on signup)
-- ============================================

CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO profiles (id, username, avatar_url)
    VALUES (
        NEW.id,
        COALESCE(NEW.raw_user_meta_data->>'username', 'user_' || LEFT(NEW.id::TEXT, 8)),
        NEW.raw_user_meta_data->>'avatar_url'
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- ============================================
-- AUTO-LOGOUT TRIGGER (Track last active)
-- ============================================

-- Table to track user activity
CREATE TABLE user_activity (
    user_id UUID PRIMARY KEY REFERENCES profiles(id) ON DELETE CASCADE,
    last_active TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Function to update last active
CREATE OR REPLACE FUNCTION update_user_activity()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO user_activity (user_id, last_active)
    VALUES (NEW.id, NOW())
    ON CONFLICT (user_id) 
    DO UPDATE SET last_active = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to update activity on profile creation
CREATE TRIGGER on_profile_created
    AFTER INSERT ON profiles
    FOR EACH ROW EXECUTE FUNCTION update_user_activity();

-- RLS for user_activity
ALTER TABLE user_activity ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own activity"
    ON user_activity FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update own activity"
    ON user_activity FOR UPDATE USING (auth.uid() = user_id);

-- ============================================
-- METRICS VIEW (for dashboard)
-- Note: difficulty breakdown requires problems table (Phase 2)
-- This basic view works without problems table
-- ============================================

CREATE OR REPLACE VIEW user_stats AS
SELECT 
    p.id as user_id,
    p.username,
    COUNT(s.id) FILTER (WHERE s.status = 'Accepted') as total_solved,
    0 as easy_solved,
    0 as medium_solved,
    0 as hard_solved,
    COUNT(s.id) as total_submissions,
    ROUND(
        COUNT(s.id) FILTER (WHERE s.status = 'Accepted')::numeric / 
        NULLIF(COUNT(s.id), 0)::numeric * 100, 1
    ) as acceptance_rate
FROM profiles p
LEFT JOIN submissions s ON p.id = s.user_id
GROUP BY p.id, p.username;

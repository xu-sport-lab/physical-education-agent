-- ====================================================
-- 上门体育智能体 - Supabase 数据库 Schema
-- 在 Supabase SQL Editor 中执行此文件
-- ====================================================

-- 0. 启用需要的扩展
CREATE EXTENSION IF NOT EXISTS "pgcrypto";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";

-- ====================================================
-- 1. 教练档案表 (coach_profiles)
--    关联 Supabase auth.users，存储教练的个人信息
-- ====================================================
CREATE TABLE coach_profiles (
  id            UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name          TEXT NOT NULL DEFAULT '',
  phone         TEXT DEFAULT '',
  avatar_url    TEXT DEFAULT '',
  bio           TEXT DEFAULT '',                     -- 个人简介
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 新用户注册时自动创建 coach_profiles
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.coach_profiles (id, name)
  VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'name', ''));
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- ====================================================
-- 2. 学生表 (students)
-- ====================================================
CREATE TABLE students (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  coach_id          UUID NOT NULL REFERENCES coach_profiles(id) ON DELETE CASCADE,
  
  -- 基本信息
  name              TEXT NOT NULL,
  gender            TEXT NOT NULL CHECK (gender IN ('男', '女')),
  birthday          DATE,
  grade             INTEGER NOT NULL CHECK (grade BETWEEN 1 AND 12),
  school            TEXT DEFAULT '',
  class_name        TEXT DEFAULT '',
  
  -- 家长信息
  parent_name       TEXT DEFAULT '',
  parent_phone      TEXT DEFAULT '',
  emergency_contact TEXT DEFAULT '',
  emergency_phone   TEXT DEFAULT '',
  
  -- 备注
  note              TEXT DEFAULT '',
  
  -- 课时信息
  total_hours       NUMERIC(6,1) NOT NULL DEFAULT 0,
  consumed_hours    NUMERIC(6,1) NOT NULL DEFAULT 0,
  
  -- 软删除
  is_deleted        BOOLEAN NOT NULL DEFAULT FALSE,
  
  created_at        TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at        TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 索引
CREATE INDEX idx_students_coach ON students(coach_id) WHERE is_deleted = FALSE;
CREATE INDEX idx_students_grade ON students(grade) WHERE is_deleted = FALSE;
CREATE INDEX idx_students_name  ON students USING gin(name gin_trgm_ops);

-- 触发 updated_at 自动更新
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER students_updated_at
  BEFORE UPDATE ON students
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ====================================================
-- 3. 体测记录表 (physical_tests)
-- ====================================================
CREATE TABLE physical_tests (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id    UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  coach_id      UUID NOT NULL REFERENCES coach_profiles(id) ON DELETE CASCADE,
  
  -- 测试数据
  test_date     DATE NOT NULL,
  items         JSONB NOT NULL DEFAULT '{}',        -- { "run_50m": 8.5, "sit_and_reach": 15, ... }
  item_scores   JSONB NOT NULL DEFAULT '{}',        -- { "run_50m": 85, "sit_and_reach": 90, ... }
  bmi           NUMERIC(5,2),
  bmi_bonus     NUMERIC(5,2) DEFAULT 0,
  total_score   NUMERIC(6,2),
  grade_level   TEXT,                               -- 'excellent' | 'good' | 'pass' | 'fail'
  
  -- 健康声明
  health_declaration JSONB NOT NULL DEFAULT '{}',
  
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_tests_student ON physical_tests(student_id, test_date DESC);
CREATE INDEX idx_tests_coach   ON physical_tests(coach_id);

-- ====================================================
-- 4. 训练方案表 (training_plans)
-- ====================================================
CREATE TABLE training_plans (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id      UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  coach_id        UUID NOT NULL REFERENCES coach_profiles(id) ON DELETE CASCADE,
  
  goal            TEXT NOT NULL DEFAULT 'general',  -- 'general'|'weight_loss'|'height_growth'|'exam_prep'
  goal_label      TEXT DEFAULT '常规体能提升',
  target_qualities JSONB DEFAULT '[]',              -- ["心肺耐力","下肢爆发力",...]
  
  plan            JSONB NOT NULL DEFAULT '{}',      -- 完整训练方案 JSON
  exam_city       TEXT DEFAULT '',                  -- 中考城市（如 exam_prep 时有值）
  
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_plans_student ON training_plans(student_id, created_at DESC);
CREATE INDEX idx_plans_coach   ON training_plans(coach_id);

-- ====================================================
-- 5. 课程表 (schedules)
-- ====================================================
CREATE TABLE schedules (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id    UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  coach_id      UUID NOT NULL REFERENCES coach_profiles(id) ON DELETE CASCADE,
  
  type          TEXT NOT NULL CHECK (type IN ('体能训练','体测强化','中考专项','一对一私教','体验课')),
  schedule_date DATE NOT NULL,
  schedule_time TIME NOT NULL,
  duration      INTEGER NOT NULL DEFAULT 60,         -- 分钟
  coach_name    TEXT DEFAULT '',
  location      TEXT DEFAULT '',
  cost_hours    NUMERIC(4,1) NOT NULL DEFAULT 1,
  note          TEXT DEFAULT '',
  
  status        TEXT NOT NULL DEFAULT 'scheduled' CHECK (status IN ('scheduled','completed','cancelled')),
  signed_in_at  TIMESTAMPTZ,
  cancelled_at  TIMESTAMPTZ,
  
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_schedules_date   ON schedules(schedule_date);
CREATE INDEX idx_schedules_student ON schedules(student_id, schedule_date);
CREATE INDEX idx_schedules_coach   ON schedules(coach_id, schedule_date);

CREATE TRIGGER schedules_updated_at
  BEFORE UPDATE ON schedules
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ====================================================
-- 6. 课时交易流水表 (hours_transactions)
-- ====================================================
CREATE TABLE hours_transactions (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id    UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  coach_id      UUID NOT NULL REFERENCES coach_profiles(id) ON DELETE CASCADE,
  
  type          TEXT NOT NULL CHECK (type IN ('recharge','consume','refund')),
  hours         NUMERIC(4,1) NOT NULL,
  note          TEXT DEFAULT '',
  
  source_type   TEXT DEFAULT 'manual',               -- 'manual'|'schedule'
  source_id     UUID,                                 -- 关联 schedules.id
  
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_hours_student ON hours_transactions(student_id, created_at DESC);
CREATE INDEX idx_hours_coach   ON hours_transactions(coach_id);

-- ====================================================
-- 7. 数据同步日志表 (sync_log) — 用于追踪变更
-- ====================================================
CREATE TABLE sync_log (
  id            BIGSERIAL PRIMARY KEY,
  table_name    TEXT NOT NULL,
  record_id     UUID NOT NULL,
  action        TEXT NOT NULL CHECK (action IN ('INSERT','UPDATE','DELETE')),
  coach_id      UUID NOT NULL,
  changed_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_sync_log_coach ON sync_log(coach_id, changed_at DESC);

-- 同步日志触发器函数
CREATE OR REPLACE FUNCTION log_sync_event()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO sync_log (table_name, record_id, action, coach_id)
  VALUES (TG_TABLE_NAME, NEW.id,
    CASE TG_OP WHEN 'INSERT' THEN 'INSERT' WHEN 'UPDATE' THEN 'UPDATE' WHEN 'DELETE' THEN 'DELETE' END,
    NEW.coach_id);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 为各表挂载同步触发器
CREATE TRIGGER sync_students AFTER INSERT OR UPDATE ON students
  FOR EACH ROW EXECUTE FUNCTION log_sync_event();

CREATE TRIGGER sync_tests AFTER INSERT OR UPDATE ON physical_tests
  FOR EACH ROW EXECUTE FUNCTION log_sync_event();

CREATE TRIGGER sync_schedules AFTER INSERT OR UPDATE OR DELETE ON schedules
  FOR EACH ROW EXECUTE FUNCTION log_sync_event();

CREATE TRIGGER sync_hours AFTER INSERT ON hours_transactions
  FOR EACH ROW EXECUTE FUNCTION log_sync_event();

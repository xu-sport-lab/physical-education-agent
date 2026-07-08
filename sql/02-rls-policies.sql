-- ====================================================
-- 上门体育智能体 - RLS 行级安全策略
-- 在 Supabase SQL Editor 中执行此文件（在 schema 之后）
-- ====================================================

-- ===== coach_profiles =====
ALTER TABLE coach_profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "coach_profile_self" ON coach_profiles
  FOR ALL USING (id = auth.uid());

-- ===== students =====
ALTER TABLE students ENABLE ROW LEVEL SECURITY;
CREATE POLICY "students_coach_isolation" ON students
  FOR ALL USING (coach_id = auth.uid())
  WITH CHECK (coach_id = auth.uid());

-- ===== physical_tests =====
ALTER TABLE physical_tests ENABLE ROW LEVEL SECURITY;
CREATE POLICY "tests_coach_isolation" ON physical_tests
  FOR ALL USING (coach_id = auth.uid())
  WITH CHECK (coach_id = auth.uid());

-- ===== training_plans =====
ALTER TABLE training_plans ENABLE ROW LEVEL SECURITY;
CREATE POLICY "plans_coach_isolation" ON training_plans
  FOR ALL USING (coach_id = auth.uid())
  WITH CHECK (coach_id = auth.uid());

-- ===== schedules =====
ALTER TABLE schedules ENABLE ROW LEVEL SECURITY;
CREATE POLICY "schedules_coach_isolation" ON schedules
  FOR ALL USING (coach_id = auth.uid())
  WITH CHECK (coach_id = auth.uid());

-- ===== hours_transactions =====
ALTER TABLE hours_transactions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "hours_coach_isolation" ON hours_transactions
  FOR ALL USING (coach_id = auth.uid())
  WITH CHECK (coach_id = auth.uid());

-- ===== sync_log =====
ALTER TABLE sync_log ENABLE ROW LEVEL SECURITY;
CREATE POLICY "sync_coach_isolation" ON sync_log
  FOR SELECT USING (coach_id = auth.uid());

-- ===== 启用 Realtime（在 Dashboard > Database > Replication 中勾选各表）=====
-- 或者在 SQL 中：
ALTER PUBLICATION supabase_realtime ADD TABLE schedules;
ALTER PUBLICATION supabase_realtime ADD TABLE students;
ALTER PUBLICATION supabase_realtime ADD TABLE physical_tests;
ALTER PUBLICATION supabase_realtime ADD TABLE hours_transactions;

-- ===== 为测试创建数据快照（可选种子数据）=====
-- 中高考评分标准存储在客户端 SDK 的 STANDARDS 对象中，无需入库。
-- 四川中考城市数据存储在前端 data/sichuan-zhongkao.json，无需入库。

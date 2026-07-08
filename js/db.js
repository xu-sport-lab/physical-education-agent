// ====================================================
// 数据访问层 — 替代 localStorage，全部走 Supabase
// ====================================================

// ===== Student — 学生管理 =====
const studentDB = {

    /**
     * 获取所有学生（含搜索和年级筛选）
     */
    async getAll(search = '', grade = '') {
        let q = getSupabase().from('students')
            .select('*')
            .eq('is_deleted', false)
            .order('created_at', { ascending: false });

        if (grade) q = q.eq('grade', parseInt(grade));
        if (search) q = q.ilike('name', `%${search}%`);

        const { data, error } = await q;
        if (error) { console.error('getAll students:', error); return []; }
        return data || [];
    },

    /**
     * 获取单个学生
     */
    async getById(id) {
        const { data, error } = await getSupabase().from('students')
            .select('*')
            .eq('id', id)
            .eq('is_deleted', false)
            .single();
        if (error) { console.error('getById student:', error); return null; }
        return data;
    },

    /**
     * 新增学生
     * @returns 新增的学生对象
     */
    async create(studentData) {
        const coachId = getCoachId();
        const { data, error } = await getSupabase().from('students')
            .insert({
                coach_id: coachId,
                name: studentData.name,
                gender: studentData.gender,
                birthday: studentData.birthday || null,
                grade: parseInt(studentData.grade),
                school: studentData.school || '',
                class_name: studentData.class || studentData.class_name || '',
                parent_name: studentData.parentName || '',
                parent_phone: studentData.parentPhone || '',
                emergency_contact: studentData.emergencyContact || '',
                emergency_phone: studentData.emergencyPhone || '',
                note: studentData.note || '',
                total_hours: 0,
                consumed_hours: 0
            })
            .select()
            .single();
        if (error) throw error;
        return data;
    },

    /**
     * 更新学生信息
     * @returns 更新后的学生对象
     */
    async update(id, studentData) {
        const { data, error } = await getSupabase().from('students')
            .update({
                name: studentData.name,
                gender: studentData.gender,
                birthday: studentData.birthday || null,
                grade: parseInt(studentData.grade),
                school: studentData.school || '',
                class_name: studentData.class || studentData.class_name || '',
                parent_name: studentData.parentName || '',
                parent_phone: studentData.parentPhone || '',
                emergency_contact: studentData.emergencyContact || '',
                emergency_phone: studentData.emergencyPhone || '',
                note: studentData.note || ''
            })
            .eq('id', id)
            .select()
            .single();
        if (error) throw error;
        return data;
    },

    /**
     * 软删除学生
     */
    async remove(id) {
        const { error } = await getSupabase().from('students')
            .update({ is_deleted: true })
            .eq('id', id);
        if (error) throw error;
    }
};

// ===== PhysicalTest — 体测记录 =====
const testDB = {

    /**
     * 获取某个学生的所有体测记录
     */
    async getByStudent(studentId) {
        const { data, error } = await getSupabase().from('physical_tests')
            .select('*')
            .eq('student_id', studentId)
            .order('test_date', { ascending: false });
        if (error) { console.error('getByStudent tests:', error); return []; }
        return (data || []).map(t => ({
            ...t,
            id: t.id,
            studentId: t.student_id,
            date: t.test_date,
            testDate: t.test_date,
            items: t.items || {},
            itemScores: t.item_scores || {},
            totalScore: t.total_score,
            bmiBonus: t.bmi_bonus,
            gradeLevel: t.grade_level,
            healthDeclaration: t.health_declaration,
            // 向后兼容旧字段名
            student_id: t.student_id
        }));
    },

    /**
     * 录入体测
     */
    async create(studentId, testData) {
        const coachId = getCoachId();
        const { data, error } = await getSupabase().from('physical_tests')
            .insert({
                student_id: studentId,
                coach_id: coachId,
                test_date: testData.testDate || testData.date || new Date().toISOString().split('T')[0],
                items: testData.items || {},
                item_scores: testData.itemScores || testData.item_scores || {},
                bmi: testData.bmi || null,
                bmi_bonus: testData.bmiBonus || 0,
                total_score: testData.totalScore || null,
                grade_level: testData.gradeLevel || null,
                health_declaration: testData.healthDeclaration || {}
            })
            .select()
            .single();
        if (error) throw error;
        return {
            ...data,
            studentId: data.student_id,
            testDate: data.test_date,
            items: data.items,
            itemScores: data.item_scores,
            totalScore: data.total_score,
            bmiBonus: data.bmi_bonus,
            gradeLevel: data.grade_level,
            healthDeclaration: data.health_declaration,
            student_id: data.student_id
        };
    },

    /**
     * 删除体测记录
     */
    async remove(testId) {
        const { error } = await getSupabase().from('physical_tests')
            .delete()
            .eq('id', testId);
        if (error) throw error;
    }
};

// ===== TrainingPlan — 训练方案 =====
const planDB = {

    /**
     * 获取某个学生的所有训练方案
     */
    async getByStudent(studentId) {
        const { data, error } = await getSupabase().from('training_plans')
            .select('*')
            .eq('student_id', studentId)
            .order('created_at', { ascending: false });
        if (error) { console.error('getByStudent plans:', error); return []; }
        return (data || []).map(p => ({
            id: p.id,
            studentId: p.student_id,
            goal: p.goal,
            goalLabel: p.goal_label,
            targetQualities: p.target_qualities,
            plan: p.plan,
            examCity: p.exam_city,
            date: p.created_at,
            student_id: p.student_id
        }));
    },

    /**
     * 保存训练方案
     */
    async create(studentId, planData) {
        const coachId = getCoachId();
        const { data, error } = await getSupabase().from('training_plans')
            .insert({
                student_id: studentId,
                coach_id: coachId,
                goal: planData.goal || 'general',
                goal_label: planData.goalLabel || '常规体能提升',
                target_qualities: planData.targetQualities || [],
                plan: planData.plan || {},
                exam_city: planData.examCity || ''
            })
            .select()
            .single();
        if (error) throw error;
        return {
            ...data,
            studentId: data.student_id,
            goalLabel: data.goal_label,
            targetQualities: data.target_qualities,
            examCity: data.exam_city,
            date: data.created_at,
            student_id: data.student_id
        };
    },

    /**
     * 删除训练方案
     */
    async remove(planId) {
        const { error } = await getSupabase().from('training_plans')
            .delete()
            .eq('id', planId);
        if (error) throw error;
    }
};

// ===== Schedule — 课程管理 =====
const scheduleDB = {

    /**
     * 按月份获取课程（含 student name）
     */
    async getByMonth(year, month) {
        const startDate = `${year}-${String(month).padStart(2,'0')}-01`;
        const endDate = `${year}-${String(month).padStart(2,'0')}-31`;
        const { data, error } = await getSupabase().from('schedules')
            .select('*, students!inner(name)')
            .gte('schedule_date', startDate)
            .lte('schedule_date', endDate)
            .order('schedule_time', { ascending: true });
        if (error) { console.error('getByMonth schedules:', error); return []; }
        return (data || []).map(s => ({
            id: s.id,
            studentId: s.student_id,
            coachId: s.coach_id,
            type: s.type,
            date: s.schedule_date,
            time: s.schedule_time,
            duration: s.duration,
            coach: s.coach_name,
            location: s.location,
            cost: s.cost_hours,
            note: s.note,
            status: s.status,
            completedAt: s.signed_in_at,
            createdAt: s.created_at,
            updatedAt: s.updated_at,
            studentName: s.students?.name || ''
        }));
    },

    /**
     * 创建课程（同时扣减课时）
     */
    async create(scheduleData) {
        const coachId = getCoachId();
        const { data, error } = await getSupabase().from('schedules')
            .insert({
                student_id: scheduleData.studentId,
                coach_id: coachId,
                type: scheduleData.type,
                schedule_date: scheduleData.date,
                schedule_time: scheduleData.time,
                duration: scheduleData.duration || 60,
                coach_name: scheduleData.coach || '',
                location: scheduleData.location || '',
                cost_hours: scheduleData.cost || 1,
                note: scheduleData.note || '',
                status: 'scheduled'
            })
            .select()
            .single();
        if (error) throw error;
        return {
            ...data,
            studentId: data.student_id,
            studentName: scheduleData.studentName || ''
        };
    },

    /**
     * 更新课程
     */
    async update(id, scheduleData) {
        const { data, error } = await getSupabase().from('schedules')
            .update({
                type: scheduleData.type,
                schedule_date: scheduleData.date,
                schedule_time: scheduleData.time,
                duration: scheduleData.duration || 60,
                coach_name: scheduleData.coach || '',
                location: scheduleData.location || '',
                cost_hours: scheduleData.cost || 1,
                note: scheduleData.note || '',
                status: scheduleData.status || 'scheduled'
            })
            .eq('id', id)
            .select()
            .single();
        if (error) throw error;
        return data;
    },

    /**
     * 删除课程（同时退课时）
     */
    async remove(id) {
        const { error } = await getSupabase().from('schedules')
            .delete()
            .eq('id', id);
        if (error) throw error;
    },

    /**
     * 签到
     */
    async checkIn(id) {
        const now = new Date().toISOString();
        // 1. 获取课程信息
        const { data: sc } = await getSupabase().from('schedules')
            .select('*')
            .eq('id', id)
            .single();

        if (!sc) throw new Error('课程不存在');
        if (sc.status === 'completed') throw new Error('已签到，无需重复操作');

        // 2. 更新课程状态
        const { error } = await getSupabase().from('schedules')
            .update({ status: 'completed', signed_in_at: now })
            .eq('id', id);
        if (error) throw error;

        // 3. 扣减学生课时 + 记流水
        await hoursDB.consume(sc.student_id, sc.cost_hours, `上课签到 ${sc.schedule_date} ${sc.schedule_time}`, sc.id);

        return true;
    },

    /**
     * 取消签到
     */
    async cancelCheckIn(id) {
        // 1. 获取课程信息
        const { data: sc } = await getSupabase().from('schedules')
            .select('*')
            .eq('id', id)
            .single();
        if (!sc || sc.status !== 'completed') throw new Error('课程未签到');

        // 2. 恢复为 scheduled
        const { error } = await getSupabase().from('schedules')
            .update({ status: 'scheduled', signed_in_at: null })
            .eq('id', id);
        if (error) throw error;

        // 3. 退课时
        await hoursDB.refund(sc.student_id, sc.cost_hours, `取消签到 ${sc.schedule_date} ${sc.schedule_time}`, sc.id);
    }
};

// ===== Hours — 课时管理 =====
const hoursDB = {

    /**
     * 充值课时
     */
    async recharge(studentId, hours, note = '充值') {
        const coachId = getCoachId();

        // 1. 更新学生 total_hours
        const { data: student } = await getSupabase().from('students')
            .select('total_hours')
            .eq('id', studentId)
            .single();
        if (!student) throw new Error('学生不存在');

        await getSupabase().from('students')
            .update({ total_hours: Number(student.total_hours) + Number(hours) })
            .eq('id', studentId);

        // 2. 记流水
        await getSupabase().from('hours_transactions')
            .insert({
                student_id: studentId,
                coach_id: coachId,
                type: 'recharge',
                hours: Number(hours),
                note,
                source_type: 'manual'
            });
    },

    /**
     * 消耗课时（签到扣减）
     */
    async consume(studentId, hours, note = '上课消耗', scheduleId = null) {
        const coachId = getCoachId();

        // 1. 更新 consumed_hours
        const { data: student } = await getSupabase().from('students')
            .select('consumed_hours')
            .eq('id', studentId)
            .single();
        if (!student) throw new Error('学生不存在');

        await getSupabase().from('students')
            .update({ consumed_hours: Number(student.consumed_hours) + Number(hours) })
            .eq('id', studentId);

        // 2. 记流水
        await getSupabase().from('hours_transactions')
            .insert({
                student_id: studentId,
                coach_id: coachId,
                type: 'consume',
                hours: Number(hours),
                note,
                source_type: scheduleId ? 'schedule' : 'manual',
                source_id: scheduleId
            });
    },

    /**
     * 退课时
     */
    async refund(studentId, hours, note = '返还', scheduleId = null) {
        const coachId = getCoachId();

        const { data: student } = await getSupabase().from('students')
            .select('consumed_hours')
            .eq('id', studentId)
            .single();

        if (student) {
            const newConsumed = Math.max(0, Number(student.consumed_hours) - Number(hours));
            await getSupabase().from('students')
                .update({ consumed_hours: newConsumed })
                .eq('id', studentId);
        }

        await getSupabase().from('hours_transactions')
            .insert({
                student_id: studentId,
                coach_id: coachId,
                type: 'refund',
                hours: Number(hours),
                note,
                source_type: scheduleId ? 'schedule' : 'manual',
                source_id: scheduleId
            });
    },

    /**
     * 获取学生课时余额与流水
     */
    async getByStudent(studentId) {
        const { data: student } = await getSupabase().from('students')
            .select('total_hours, consumed_hours')
            .eq('id', studentId)
            .single();

        const { data: txns } = await getSupabase().from('hours_transactions')
            .select('*')
            .eq('student_id', studentId)
            .order('created_at', { ascending: false })
            .limit(50);

        return {
            totalHours: student?.total_hours || 0,
            consumedHours: student?.consumed_hours || 0,
            remaining: Math.max(0, (student?.total_hours || 0) - (student?.consumed_hours || 0)),
            history: (txns || []).map(t => ({
                type: t.type,
                hours: t.hours,
                note: t.note,
                timestamp: t.created_at
            }))
        };
    }
};

// ===== 向后兼容层 =====
// 为了让 app.js 改动最小，保留全局 students 数组和 schedule 数组
// 但在后台走 Supabase

window.studentCache = {
    students: [],
    schedules: [],

    async refreshStudents() {
        this.students = await studentDB.getAll();
        return this.students;
    },

    async refreshSchedules() {
        const now = new Date();
        this.schedules = await scheduleDB.getByMonth(now.getFullYear(), now.getMonth() + 1);
        return this.schedules;
    }
};

// ===== 数据导入/导出（替代原 localStorage 备份恢复）=====
const dataMigration = {

    /**
     * 从旧的 localStorage JSON 导出文件导入数据
     * @param {Object} data - { students: [], schedules: [] }
     */
    async importFromLocalStorage(data) {
        const coachId = getCoachId();
        let count = { students: 0, tests: 0, plans: 0, schedules: 0 };

        for (const s of data.students || []) {
            // 导入学生
            const { data: newStudent } = await getSupabase().from('students')
                .insert({
                    id: s.id, // 保留原 ID
                    coach_id: coachId,
                    name: s.name,
                    gender: s.gender,
                    birthday: s.birthday || null,
                    grade: parseInt(s.grade),
                    school: s.school || '',
                    class_name: s.class || '',
                    parent_name: s.parentName || '',
                    parent_phone: s.parentPhone || '',
                    emergency_contact: s.emergencyContact || '',
                    emergency_phone: s.emergencyPhone || '',
                    note: s.note || '',
                    total_hours: s.totalHours || 0,
                    consumed_hours: s.consumedHours || 0
                })
                .select()
                .single();
            if (newStudent) count.students++;

            // 导入课时流水
            for (const h of s.hoursHistory || []) {
                await getSupabase().from('hours_transactions').insert({
                    student_id: s.id,
                    coach_id: coachId,
                    type: h.type,
                    hours: h.hours,
                    note: h.note || '',
                    source_type: 'manual'
                });
            }

            // 导入体测记录
            for (const t of s.tests || []) {
                await getSupabase().from('physical_tests').insert({
                    id: t.id,
                    student_id: s.id,
                    coach_id: coachId,
                    test_date: t.date || t.testDate || new Date().toISOString().split('T')[0],
                    items: t.items || {},
                    item_scores: t.itemScores || {},
                    bmi: t.bmi || null,
                    bmi_bonus: t.bmiBonus || 0,
                    total_score: t.totalScore || null,
                    grade_level: t.gradeLevel || null,
                    health_declaration: t.healthDeclaration || {}
                });
                count.tests++;
            }

            // 导入训练方案
            for (const p of s.trainingPlans || []) {
                await getSupabase().from('training_plans').insert({
                    student_id: s.id,
                    coach_id: coachId,
                    goal: p.goal || 'general',
                    goal_label: p.goalLabel || '常规体能提升',
                    target_qualities: p.targetQualities || [],
                    plan: p.plan || {},
                    exam_city: p.examCity || ''
                });
                count.plans++;
            }
        }

        // 导入课程
        for (const sc of data.schedules || []) {
            await getSupabase().from('schedules').insert({
                id: sc.id,
                student_id: sc.studentId,
                coach_id: coachId,
                type: sc.type,
                schedule_date: sc.date,
                schedule_time: sc.time,
                duration: sc.duration || 60,
                coach_name: sc.coach || '',
                location: sc.location || '',
                cost_hours: sc.cost || 1,
                note: sc.note || '',
                status: sc.status || 'scheduled',
                signed_in_at: sc.completedAt || null
            });
            count.schedules++;
        }

        return count;
    }
};

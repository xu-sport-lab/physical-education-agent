// ==================== 全局变量 ====================
let students = [];
let currentStudent = null;
let currentTest = {};

// 课程管理全局状态
let schedules = [];           // 所有排课记录
let scheduleCurrentDate = new Date();  // 当前查看的日期
let scheduleView = 'month';   // 'month' | 'week'
let scheduleSelectedDate = null;       // 当前选中的日期
let scheduleEditingId = null;          // 正在编辑的课程 ID
let scheduleDetailId = null;           // 详情弹窗中显示的课程 ID

// ==================== 内嵌评分标准数据 ====================
const STANDARDS = {
  "description": "《国家学生体质健康标准（2014年修订）》评分表",
  "units": {
    "height": "cm", "weight": "kg", "bmi": "-",
    "run_50m": "秒", "sit_and_reach": "cm", "jump_rope_1min": "次",
    "sit_up_1min": "次", "pull_up": "次", "incline_pull_up": "次",
    "solid_ball": "米", "run_50m_8": "分'秒",
    "run_800m": "分'秒", "run_1000m": "分'秒",
    "standing_long_jump": "cm", "balance_stand": "秒", "t_test": "秒",
    "football_dribble": "秒", "basketball_dribble": "秒", "basketball_layup": "秒",
    "volleyball_bump": "次"
  },
  "grades": {
    "excellent": {"name": "非常棒", "min": 90, "color": "#22c55e"},
    "good": {"name": "还不错", "min": 80, "color": "#3b82f6"},
    "pass": {"name": "刚达标", "min": 60, "color": "#f59e0b"},
    "fail": {"name": "待提升", "min": 0, "color": "#ef4444"}
  },
  "scoring": {
    "小学_男生": {
      "1年级": {"height":{"low":106.1,"high":129.9},"weight":{"low":15.9,"high":30.1},"run_50m":{"low":12.4,"high":18.0,"step":0.3,"reverse":true},"sit_and_reach":{"low":4.0,"high":16.0,"step":2.0},"jump_rope_1min":{"low":40,"high":120,"step":5},"standing_long_jump":{"low":105,"high":147,"step":5},"balance_stand":{"low":5,"high":25,"step":1},"t_test":{"low":12,"high":16,"step":0.1,"reverse":true}},
      "2年级": {"height":{"low":111.1,"high":135.9},"weight":{"low":17.7,"high":34.3},"run_50m":{"low":11.3,"high":16.7,"step":0.3,"reverse":true},"sit_and_reach":{"low":4.0,"high":16.0,"step":2.0},"jump_rope_1min":{"low":45,"high":130,"step":5},"standing_long_jump":{"low":115,"high":157,"step":5},"balance_stand":{"low":5,"high":25,"step":1},"t_test":{"low":12,"high":16,"step":0.1,"reverse":true}},
      "3年级": {"height":{"low":116.1,"high":141.9},"weight":{"low":19.5,"high":38.9},"run_50m":{"low":10.2,"high":15.7,"step":0.3,"reverse":true},"sit_and_reach":{"low":5.0,"high":17.0,"step":2.0},"jump_rope_1min":{"low":55,"high":140,"step":5},"sit_up_1min":{"low":15,"high":42,"step":3},"standing_long_jump":{"low":125,"high":167,"step":5},"balance_stand":{"low":5,"high":25,"step":1},"t_test":{"low":12,"high":16,"step":0.1,"reverse":true}},
      "4年级": {"height":{"low":121.1,"high":147.9},"weight":{"low":21.5,"high":43.7},"run_50m":{"low":9.5,"high":14.7,"step":0.3,"reverse":true},"sit_and_reach":{"low":5.0,"high":17.0,"step":2.0},"jump_rope_1min":{"low":60,"high":150,"step":5},"sit_up_1min":{"low":18,"high":45,"step":3},"standing_long_jump":{"low":135,"high":177,"step":5},"balance_stand":{"low":8,"high":35,"step":1},"t_test":{"low":10,"high":14,"step":0.1,"reverse":true}},
      "5年级": {"height":{"low":125.8,"high":153.9},"weight":{"low":23.7,"high":48.7},"run_50m":{"low":9.1,"high":13.7,"step":0.3,"reverse":true},"sit_and_reach":{"low":6.0,"high":18.0,"step":2.0},"jump_rope_1min":{"low":70,"high":160,"step":5},"sit_up_1min":{"low":20,"high":46,"step":3},"run_50m_8":{"low":"1'20\"","high":"2'20\"","reverse":true},"standing_long_jump":{"low":145,"high":188,"step":5},"balance_stand":{"low":8,"high":35,"step":1},"t_test":{"low":10,"high":14,"step":0.1,"reverse":true}},
      "6年级": {"height":{"low":130.0,"high":159.9},"weight":{"low":25.9,"high":54.0},"run_50m":{"low":8.7,"high":12.7,"step":0.3,"reverse":true},"sit_and_reach":{"low":6.0,"high":18.0,"step":2.0},"jump_rope_1min":{"low":80,"high":170,"step":5},"sit_up_1min":{"low":22,"high":48,"step":3},"run_50m_8":{"low":"1'15\"","high":"2'10\"","reverse":true},"standing_long_jump":{"low":155,"high":199,"step":5},"balance_stand":{"low":8,"high":35,"step":1},"t_test":{"low":10,"high":14,"step":0.1,"reverse":true}}
    },
    "小学_女生": {
      "1年级": {"height":{"low":105.1,"high":129.9},"weight":{"low":15.4,"high":28.9},"run_50m":{"low":13.0,"high":18.7,"step":0.3,"reverse":true},"sit_and_reach":{"low":6.0,"high":19.0,"step":2.0},"jump_rope_1min":{"low":40,"high":115,"step":5},"standing_long_jump":{"low":100,"high":137,"step":5},"balance_stand":{"low":5,"high":25,"step":1},"t_test":{"low":12,"high":16,"step":0.1,"reverse":true}},
      "2年级": {"height":{"low":110.1,"high":135.9},"weight":{"low":17.2,"high":33.1},"run_50m":{"low":11.9,"high":17.4,"step":0.3,"reverse":true},"sit_and_reach":{"low":6.0,"high":19.0,"step":2.0},"jump_rope_1min":{"low":45,"high":125,"step":5},"standing_long_jump":{"low":110,"high":147,"step":5},"balance_stand":{"low":5,"high":25,"step":1},"t_test":{"low":12,"high":16,"step":0.1,"reverse":true}},
      "3年级": {"height":{"low":115.1,"high":141.9},"weight":{"low":18.8,"high":37.5},"run_50m":{"low":10.8,"high":16.4,"step":0.3,"reverse":true},"sit_and_reach":{"low":7.0,"high":20.0,"step":2.0},"jump_rope_1min":{"low":55,"high":135,"step":5},"sit_up_1min":{"low":15,"high":42,"step":3},"standing_long_jump":{"low":120,"high":157,"step":5},"balance_stand":{"low":5,"high":25,"step":1},"t_test":{"low":12,"high":16,"step":0.1,"reverse":true}},
      "4年级": {"height":{"low":120.1,"high":147.9},"weight":{"low":20.8,"high":42.5},"run_50m":{"low":10.0,"high":15.2,"step":0.3,"reverse":true},"sit_and_reach":{"low":7.0,"high":20.0,"step":2.0},"jump_rope_1min":{"low":60,"high":145,"step":5},"sit_up_1min":{"low":18,"high":45,"step":3},"standing_long_jump":{"low":130,"high":167,"step":5},"balance_stand":{"low":8,"high":35,"step":1},"t_test":{"low":10,"high":14,"step":0.1,"reverse":true}},
      "5年级": {"height":{"low":125.0,"high":153.9},"weight":{"low":23.0,"high":47.3},"run_50m":{"low":9.5,"high":14.1,"step":0.3,"reverse":true},"sit_and_reach":{"low":8.0,"high":21.0,"step":2.0},"jump_rope_1min":{"low":70,"high":155,"step":5},"sit_up_1min":{"low":20,"high":46,"step":3},"run_50m_8":{"low":"1'25\"","high":"2'25\"","reverse":true},"standing_long_jump":{"low":140,"high":178,"step":5},"balance_stand":{"low":8,"high":35,"step":1},"t_test":{"low":10,"high":14,"step":0.1,"reverse":true}},
      "6年级": {"height":{"low":128.8,"high":159.9},"weight":{"low":25.3,"high":52.0},"run_50m":{"low":9.1,"high":13.2,"step":0.3,"reverse":true},"sit_and_reach":{"low":8.0,"high":21.5,"step":2.0},"jump_rope_1min":{"low":80,"high":165,"step":5},"sit_up_1min":{"low":22,"high":48,"step":3},"run_50m_8":{"low":"1'20\"","high":"2'15\"","reverse":true},"standing_long_jump":{"low":150,"high":189,"step":5},"balance_stand":{"low":8,"high":35,"step":1},"t_test":{"low":10,"high":14,"step":0.1,"reverse":true}}
    },
    "初中_男生": {
      "7年级": {"height":{"low":142.0,"high":170.9},"weight":{"low":33.5,"high":60.0},"run_50m":{"low":7.5,"high":10.0,"step":0.3,"reverse":true},"sit_and_reach":{"low":8.0,"high":22.0,"step":2.0},"pull_up":{"low":3,"high":12,"step":1},"solid_ball":{"low":7.7,"high":12.4,"step":0.8},"run_1000m":{"low":"3'50\"","high":"5'10\"","reverse":true},"standing_long_jump":{"low":175,"high":225,"step":5},"balance_stand":{"low":10,"high":45,"step":1},"t_test":{"low":9,"high":12,"step":0.1,"reverse":true},"football_dribble":{"low":7.5,"high":10.5,"step":0.5,"reverse":true},"basketball_dribble":{"low":20,"high":28,"step":1.3,"reverse":true},"basketball_layup":{"low":20,"high":28,"step":1.3,"reverse":true},"volleyball_bump":{"low":20,"high":40,"step":3}},
      "8年级": {"height":{"low":148.0,"high":175.9},"weight":{"low":37.0,"high":65.0},"run_50m":{"low":7.2,"high":9.8,"step":0.3,"reverse":true},"sit_and_reach":{"low":9.0,"high":23.5,"step":2.0},"pull_up":{"low":4,"high":13,"step":1},"solid_ball":{"low":7.7,"high":12.4,"step":0.8},"run_1000m":{"low":"3'45\"","high":"5'00\"","reverse":true},"standing_long_jump":{"low":180,"high":235,"step":5},"balance_stand":{"low":10,"high":45,"step":1},"t_test":{"low":9,"high":12,"step":0.1,"reverse":true},"football_dribble":{"low":7.5,"high":10.5,"step":0.5,"reverse":true},"basketball_dribble":{"low":20,"high":28,"step":1.3,"reverse":true},"basketball_layup":{"low":20,"high":28,"step":1.3,"reverse":true},"volleyball_bump":{"low":20,"high":40,"step":3}},
      "9年级": {"height":{"low":153.0,"high":179.9},"weight":{"low":40.5,"high":70.0},"run_50m":{"low":7.0,"high":9.5,"step":0.3,"reverse":true},"sit_and_reach":{"low":10.0,"high":25.0,"step":2.0},"pull_up":{"low":5,"high":15,"step":1},"solid_ball":{"low":7.7,"high":12.4,"step":0.8},"run_1000m":{"low":"3'40\"","high":"4'55\"","reverse":true},"standing_long_jump":{"low":185,"high":250,"step":5},"balance_stand":{"low":10,"high":45,"step":1},"t_test":{"low":9,"high":12,"step":0.1,"reverse":true},"football_dribble":{"low":7.5,"high":10.5,"step":0.5,"reverse":true},"basketball_dribble":{"low":20,"high":28,"step":1.3,"reverse":true},"basketball_layup":{"low":20,"high":28,"step":1.3,"reverse":true},"volleyball_bump":{"low":20,"high":40,"step":3}}
    },
    "初中_女生": {
      "7年级": {"height":{"low":142.0,"high":166.9},"weight":{"low":32.0,"high":57.0},"run_50m":{"low":8.2,"high":10.8,"step":0.3,"reverse":true},"sit_and_reach":{"low":11.0,"high":23.0,"step":2.0},"sit_up_1min":{"low":18,"high":45,"step":3},"incline_pull_up":{"low":20,"high":45,"step":4},"solid_ball":{"low":5.9,"high":7.8,"step":0.3},"run_800m":{"low":"3'35\"","high":"5'10\"","reverse":true},"standing_long_jump":{"low":140,"high":185,"step":5},"balance_stand":{"low":10,"high":45,"step":1},"t_test":{"low":9,"high":12,"step":0.1,"reverse":true},"football_dribble":{"low":8.1,"high":12.0,"step":0.6,"reverse":true},"basketball_dribble":{"low":26,"high":34,"step":1.3,"reverse":true},"basketball_layup":{"low":26,"high":34,"step":1.3,"reverse":true},"volleyball_bump":{"low":20,"high":40,"step":3}},
      "8年级": {"height":{"low":146.0,"high":169.9},"weight":{"low":35.0,"high":60.0},"run_50m":{"low":8.0,"high":10.6,"step":0.3,"reverse":true},"sit_and_reach":{"low":11.5,"high":24.0,"step":2.0},"sit_up_1min":{"low":21,"high":48,"step":3},"incline_pull_up":{"low":20,"high":45,"step":4},"solid_ball":{"low":5.9,"high":7.8,"step":0.3},"run_800m":{"low":"3'30\"","high":"5'00\"","reverse":true},"standing_long_jump":{"low":143,"high":193,"step":5},"balance_stand":{"low":10,"high":45,"step":1},"t_test":{"low":9,"high":12,"step":0.1,"reverse":true},"football_dribble":{"low":8.1,"high":12.0,"step":0.6,"reverse":true},"basketball_dribble":{"low":26,"high":34,"step":1.3,"reverse":true},"basketball_layup":{"low":26,"high":34,"step":1.3,"reverse":true},"volleyball_bump":{"low":20,"high":40,"step":3}},
      "9年级": {"height":{"low":148.0,"high":172.9},"weight":{"low":38.0,"high":62.0},"run_50m":{"low":7.8,"high":10.5,"step":0.3,"reverse":true},"sit_and_reach":{"low":12.0,"high":25.0,"step":2.0},"sit_up_1min":{"low":24,"high":52,"step":3},"incline_pull_up":{"low":20,"high":45,"step":4},"solid_ball":{"low":5.9,"high":7.8,"step":0.3},"run_800m":{"low":"3'25\"","high":"4'45\"","reverse":true},"standing_long_jump":{"low":146,"high":202,"step":5},"balance_stand":{"low":10,"high":45,"step":1},"t_test":{"low":9,"high":12,"step":0.1,"reverse":true},"football_dribble":{"low":8.1,"high":12.0,"step":0.6,"reverse":true},"basketball_dribble":{"low":26,"high":34,"step":1.3,"reverse":true},"basketball_layup":{"low":26,"high":34,"step":1.3,"reverse":true},"volleyball_bump":{"low":20,"high":40,"step":3}}
    },
    "高中_男生": {
      "10年级": {"height":{"low":158.0,"high":180.9},"weight":{"low":44.0,"high":75.0},"run_50m":{"low":6.9,"high":9.5,"step":0.2,"reverse":true},"sit_and_reach":{"low":10.0,"high":23.0,"step":2.0},"pull_up":{"low":4,"high":12,"step":1},"solid_ball":{"low":7.7,"high":12.4,"step":0.8},"run_1000m":{"low":"3'35\"","high":"4'50\"","reverse":true},"standing_long_jump":{"low":200,"high":250,"step":5},"balance_stand":{"low":12,"high":60,"step":1},"t_test":{"low":6,"high":10,"step":0.1,"reverse":true},"football_dribble":{"low":7.5,"high":10.5,"step":0.5,"reverse":true},"basketball_dribble":{"low":20,"high":28,"step":1.3,"reverse":true},"basketball_layup":{"low":20,"high":28,"step":1.3,"reverse":true},"volleyball_bump":{"low":20,"high":40,"step":3}},
      "11年级": {"height":{"low":160.0,"high":182.9},"weight":{"low":46.0,"high":78.0},"run_50m":{"low":6.8,"high":9.3,"step":0.2,"reverse":true},"sit_and_reach":{"low":10.5,"high":24.0,"step":2.0},"pull_up":{"low":5,"high":13,"step":1},"solid_ball":{"low":7.7,"high":12.4,"step":0.8},"run_1000m":{"low":"3'30\"","high":"4'45\"","reverse":true},"standing_long_jump":{"low":205,"high":255,"step":5},"balance_stand":{"low":12,"high":60,"step":1},"t_test":{"low":6,"high":10,"step":0.1,"reverse":true},"football_dribble":{"low":7.5,"high":10.5,"step":0.5,"reverse":true},"basketball_dribble":{"low":20,"high":28,"step":1.3,"reverse":true},"basketball_layup":{"low":20,"high":28,"step":1.3,"reverse":true},"volleyball_bump":{"low":20,"high":40,"step":3}},
      "12年级": {"height":{"low":161.0,"high":183.9},"weight":{"low":47.0,"high":80.0},"run_50m":{"low":6.7,"high":9.2,"step":0.2,"reverse":true},"sit_and_reach":{"low":11.0,"high":25.0,"step":2.0},"pull_up":{"low":5,"high":14,"step":1},"solid_ball":{"low":7.7,"high":12.4,"step":0.8},"run_1000m":{"low":"3'25\"","high":"4'40\"","reverse":true},"standing_long_jump":{"low":210,"high":260,"step":5},"balance_stand":{"low":12,"high":60,"step":1},"t_test":{"low":6,"high":10,"step":0.1,"reverse":true},"football_dribble":{"low":7.5,"high":10.5,"step":0.5,"reverse":true},"basketball_dribble":{"low":20,"high":28,"step":1.3,"reverse":true},"basketball_layup":{"low":20,"high":28,"step":1.3,"reverse":true},"volleyball_bump":{"low":20,"high":40,"step":3}}
    },
    "高中_女生": {
      "10年级": {"height":{"low":152.0,"high":174.9},"weight":{"low":41.0,"high":65.0},"run_50m":{"low":8.1,"high":10.5,"step":0.2,"reverse":true},"sit_and_reach":{"low":13.0,"high":26.0,"step":2.0},"sit_up_1min":{"low":24,"high":50,"step":3},"incline_pull_up":{"low":20,"high":45,"step":4},"solid_ball":{"low":5.9,"high":7.8,"step":0.3},"run_800m":{"low":"3'20\"","high":"4'50\"","reverse":true},"standing_long_jump":{"low":148,"high":195,"step":5},"balance_stand":{"low":12,"high":60,"step":1},"t_test":{"low":6,"high":10,"step":0.1,"reverse":true},"football_dribble":{"low":8.1,"high":12.0,"step":0.6,"reverse":true},"basketball_dribble":{"low":26,"high":34,"step":1.3,"reverse":true},"basketball_layup":{"low":26,"high":34,"step":1.3,"reverse":true},"volleyball_bump":{"low":20,"high":40,"step":3}},
      "11年级": {"height":{"low":153.0,"high":175.9},"weight":{"low":42.0,"high":66.0},"run_50m":{"low":8.0,"high":10.4,"step":0.2,"reverse":true},"sit_and_reach":{"low":13.5,"high":27.0,"step":2.0},"sit_up_1min":{"low":25,"high":51,"step":3},"incline_pull_up":{"low":20,"high":45,"step":4},"solid_ball":{"low":5.9,"high":7.8,"step":0.3},"run_800m":{"low":"3'15\"","high":"4'45\"","reverse":true},"standing_long_jump":{"low":150,"high":200,"step":5},"balance_stand":{"low":12,"high":60,"step":1},"t_test":{"low":6,"high":10,"step":0.1,"reverse":true},"football_dribble":{"low":8.1,"high":12.0,"step":0.6,"reverse":true},"basketball_dribble":{"low":26,"high":34,"step":1.3,"reverse":true},"basketball_layup":{"low":26,"high":34,"step":1.3,"reverse":true},"volleyball_bump":{"low":20,"high":40,"step":3}},
      "12年级": {"height":{"low":153.5,"high":176.9},"weight":{"low":43.0,"high":67.0},"run_50m":{"low":7.9,"high":10.3,"step":0.2,"reverse":true},"sit_and_reach":{"low":14.0,"high":28.0,"step":2.0},"sit_up_1min":{"low":26,"high":52,"step":3},"incline_pull_up":{"low":20,"high":45,"step":4},"solid_ball":{"low":5.9,"high":7.8,"step":0.3},"run_800m":{"low":"3'10\"","high":"4'40\"","reverse":true},"standing_long_jump":{"low":152,"high":205,"step":5},"balance_stand":{"low":12,"high":60,"step":1},"t_test":{"low":6,"high":10,"step":0.1,"reverse":true},"football_dribble":{"low":8.1,"high":12.0,"step":0.6,"reverse":true},"basketball_dribble":{"low":26,"high":34,"step":1.3,"reverse":true},"basketball_layup":{"low":26,"high":34,"step":1.3,"reverse":true},"volleyball_bump":{"low":20,"high":40,"step":3}}
    }
  }
};

// ==================== 初始化 ====================
document.addEventListener('DOMContentLoaded', async () => {
    // 1. 先初始化 UI — 无论 auth 状态如何，导航和主题都能用
    initNavigation();
    initTheme();
    // 加载教练自建动作
    loadCustomExercises();
    // 初始化上传页省/市选择器（TRAINING_DB 已在同一文件中定义，此时可用）
    initUploadProvinceSelector();
    initReportProvinceSelector();

    // 2. Auth 检查 — 用 try/catch + 超时保护，防止网络问题挂死
    try {
        const sb = getSupabase();
        if (!sb) {
            // SDK 未加载 — 检查是否 CDN 被墙
            const sdkLoaded = typeof window.supabase !== 'undefined' && window.supabase && window.supabase.createClient;
            showAuthOverlay(
                'Supabase 客户端未初始化。' +
                (sdkLoaded ? '' : '原因：Supabase SDK 未加载（CDN 可能被屏蔽）。'),
                '请尝试：1. 刷新页面  2. 使用科学上网  3. 清除浏览器缓存'
            );
            return;
        }

        // 超时保护：getSession 可能因网络问题挂起
        const sessionResult = await Promise.race([
            sb.auth.getSession(),
            new Promise((_, reject) => setTimeout(() => reject(new Error('请求超时（15秒），可能是网络连接 Supabase 服务器缓慢')), 15000))
        ]);
        const session = sessionResult?.data?.session;

        if (!session) {
            // 未登录 — 检查 localStorage 中是否有 session 数据
            const sbKey = Object.keys(window.localStorage).find(k => k.startsWith('sb-') && k.includes('auth-token'));
            if (sbKey) {
                // localStorage 有 session 但 getSession 返回 null — 可能 token 过期
                console.warn('Found stale session in localStorage, clearing...');
                try { await sb.auth.signOut(); } catch(e) {}
            }
            window.location.replace('./login.html');
            return;
        }
        currentSession = session;
    } catch (e) {
        console.error('Auth check failed:', e);
        const errMsg = e?.message || String(e);
        showAuthOverlay(
            '登录状态检查失败',
            '错误详情：' + errMsg + '\n\n请尝试：1. 刷新页面  2. 清除浏览器缓存后重新登录'
        );
        return;
    }

    // 3. 已登录 — 加载数据并渲染
    try {
        await loadStudents();
        await loadSchedules();
        renderStudentList();
        renderHoursOverview();
        updateSelectOptions();
    } catch (e) {
        console.error('Data load failed:', e);
        showToast('数据加载失败，请刷新重试', 'error');
    }
});

// 显示 auth 遮罩层 — 显示标题 + 详细信息
function showAuthOverlay(title, detail) {
    const overlay = document.createElement('div');
    overlay.id = 'authOverlay';
    overlay.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,0.88);z-index:9999;display:flex;align-items:center;justify-content:center;color:white;font-size:16px;text-align:center;padding:40px;flex-direction:column;gap:16px;';
    const detailHTML = detail ? `<div style="font-size:13px;color:#ffab40;white-space:pre-line;max-width:500px;line-height:1.6;">${detail}</div>` : '';
    overlay.innerHTML = `
        <div style="font-size:48px;">🔑</div>
        <div style="font-size:18px;font-weight:600;">${title}</div>
        ${detailHTML}
        <div style="display:flex;gap:12px;margin-top:8px;">
            <button onclick="window.location.replace('./login.html')" style="padding:12px 32px;border:none;border-radius:8px;background:#2e7d32;color:white;font-size:15px;cursor:pointer;">前往登录</button>
            <button onclick="location.reload()" style="padding:12px 32px;border:1px solid rgba(255,255,255,0.3);border-radius:8px;background:transparent;color:white;font-size:15px;cursor:pointer;">刷新页面</button>
        </div>
    `;
    document.body.appendChild(overlay);
}

// ==================== 数据加载（Supabase）====================
// students / schedules 作为内存缓存，数据来源于 Supabase

// snake_case → camelCase 映射
function mapStudent(s) {
    if (!s) return null;
    return {
        id: s.id,
        name: s.name,
        gender: s.gender,
        birthday: s.birthday || '',
        grade: String(s.grade),
        school: s.school || '',
        class: s.class_name || '',
        parentName: s.parent_name || '',
        parentPhone: s.parent_phone || '',
        emergencyContact: s.emergency_contact || '',
        emergencyPhone: s.emergency_phone || '',
        note: s.note || '',
        totalHours: s.total_hours || 0,
        consumedHours: s.consumed_hours || 0,
        hoursHistory: [], // 按需加载
        tests: [],        // 按需加载
        trainingPlans: [],// 按需加载
        createdAt: s.created_at,
        updatedAt: s.updated_at
    };
}

function mapSchedule(s) {
    if (!s) return null;
    return {
        id: s.id,
        studentId: s.student_id,
        type: s.type,
        date: s.schedule_date,
        time: s.schedule_time,
        duration: s.duration || 60,
        coach: s.coach_name || '',
        location: s.location || '',
        cost: s.cost_hours || 1,
        note: s.note || '',
        status: s.status,
        completedAt: s.signed_in_at,
        createdAt: s.created_at,
        studentName: s.students?.name || ''
    };
}

async function loadStudents() {
    try {
        const data = await studentDB.getAll();
        students = data.map(mapStudent);
    } catch (e) {
        console.error('loadStudents:', e);
        students = [];
    }
}

// saveStudents 不再需要 — 每个写操作直接走 Supabase
async function saveStudents() {}

async function loadSchedules() {
    try {
        const now = new Date();
        const data = await scheduleDB.getByMonth(now.getFullYear(), now.getMonth() + 1);
        schedules = data.map(mapSchedule);
    } catch (e) {
        console.error('loadSchedules:', e);
        schedules = [];
    }
}

// saveSchedules 不再需要 — 每个写操作直接走 Supabase
async function saveSchedules() {}

// ==================== 学生课时管理 ====================
// 每个学生在 students 数组中存课时信息：totalHours（总课时）、consumedHours（已消耗）、hoursHistory（充值/消耗流水）
function getStudentHours(studentId) {
    const s = students.find(x => x.id === studentId);
    if (!s) return { totalHours: 0, consumedHours: 0, history: [] };
    return {
        totalHours: s.totalHours || 0,
        consumedHours: s.consumedHours || 0,
        history: s.hoursHistory || []
    };
}

function getStudentRemaining(studentId) {
    const h = getStudentHours(studentId);
    return Math.max(0, (h.totalHours || 0) - (h.consumedHours || 0));
}

async function rechargeHours(studentId, hours, note = '充值') {
    const s = students.find(x => x.id === studentId);
    if (!s) return false;
    try {
        await hoursDB.recharge(studentId, hours, note);
        s.totalHours = (s.totalHours || 0) + Number(hours);
        s.hoursHistory = s.hoursHistory || [];
        s.hoursHistory.push({ type: 'recharge', hours: Number(hours), note, timestamp: new Date().toISOString() });
        return true;
    } catch (e) {
        console.error('rechargeHours:', e);
        showToast('充值失败: ' + e.message, 'error');
        return false;
    }
}

async function consumeHours(studentId, hours, note = '上课消耗') {
    const s = students.find(x => x.id === studentId);
    if (!s) return false;
    try {
        await hoursDB.consume(studentId, hours, note);
        s.consumedHours = (s.consumedHours || 0) + Number(hours);
        s.hoursHistory = s.hoursHistory || [];
        s.hoursHistory.push({ type: 'consume', hours: Number(hours), note, timestamp: new Date().toISOString() });
        return true;
    } catch (e) {
        console.error('consumeHours:', e);
        return false;
    }
}

async function refundHours(studentId, hours, note = '返还') {
    const s = students.find(x => x.id === studentId);
    if (!s) return false;
    try {
        await hoursDB.refund(studentId, hours, note);
        s.consumedHours = Math.max(0, (s.consumedHours || 0) - Number(hours));
        s.hoursHistory = s.hoursHistory || [];
        s.hoursHistory.push({ type: 'refund', hours: Number(hours), note, timestamp: new Date().toISOString() });
        return true;
    } catch (e) {
        console.error('refundHours:', e);
        return false;
    }
}

// ==================== 导航 ====================
function initNavigation() {
    const navItems = document.querySelectorAll('.nav-item');
    navItems.forEach(item => {
        item.addEventListener('click', () => {
            const page = item.dataset.page;
            switchPage(page);
            navItems.forEach(i => i.classList.remove('active'));
            item.classList.add('active');
            document.getElementById('sidebar').classList.remove('open');
        });
    });
}

function switchPage(pageName) {
    const pages = document.querySelectorAll('.page');
    pages.forEach(page => page.classList.remove('active'));
    const targetPage = document.getElementById(`page-${pageName}`);
    if (targetPage) targetPage.classList.add('active');
    const titles = {
        'students': '学生档案', 'test': '体测录入', 'report': '报告管理',
        'training': '训练方案', 'history': '历史记录', 'schedule': '课程管理'
    };
    document.getElementById('pageTitle').textContent = titles[pageName] || '';

    // 切换页面时自动加载对应数据
    if (pageName === 'students') {
        renderStudentList();
        renderHoursOverview();
    } else if (pageName === 'history') {
        loadHistory();
    } else if (pageName === 'test') {
        updateSelectOptions();
    } else if (pageName === 'report') {
        updateSelectOptions();
        loadReportData();
    } else if (pageName === 'training') {
        updateSelectOptions();
        loadSichuanZhongkaoData();
        onTrainingStudentChange();
    } else if (pageName === 'schedule') {
        renderSchedule();
    }
}

function toggleSidebar() {
    const sidebar = document.getElementById('sidebar');
    const overlay = document.getElementById('sidebarOverlay');
    sidebar.classList.toggle('open');
    if (overlay) overlay.classList.toggle('show');
}

function closeSidebar() {
    const sidebar = document.getElementById('sidebar');
    const overlay = document.getElementById('sidebarOverlay');
    sidebar.classList.remove('open');
    if (overlay) overlay.classList.remove('show');
}

// ==================== 移动端侧边栏手势 ====================
(function() {
    let touchStartX = 0, touchStartY = 0;
    document.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
        touchStartY = e.changedTouches[0].screenY;
    }, { passive: true });
    document.addEventListener('touchend', (e) => {
        const endX = e.changedTouches[0].screenX;
        const endY = e.changedTouches[0].screenY;
        const diffX = endX - touchStartX;
        const diffY = endY - touchStartY;
        if (Math.abs(diffX) < Math.abs(diffY)) return;
        if (Math.abs(diffX) < 60) return;
        if (window.innerWidth > 768) return;
        const sidebar = document.getElementById('sidebar');
        const overlay = document.getElementById('sidebarOverlay');
        if (touchStartX < 50 && diffX > 60) {
            sidebar.classList.add('open');
            if (overlay) overlay.classList.add('show');
        } else if (diffX < -60 && sidebar.classList.contains('open')) {
            closeSidebar();
        }
    }, { passive: true });
    document.addEventListener('DOMContentLoaded', () => {
        const overlay = document.getElementById('sidebarOverlay');
        if (overlay) overlay.addEventListener('click', closeSidebar);
    });
})();

// ==================== 学生管理 ====================
function renderStudentList() {
    const container = document.getElementById('studentList');
    const searchTerm = document.getElementById('studentSearch').value.toLowerCase();
    const gradeFilter = document.getElementById('gradeFilter').value;
    let filtered = students.filter(s => {
        const matchSearch = !searchTerm || s.name.toLowerCase().includes(searchTerm) || (s.school && s.school.toLowerCase().includes(searchTerm));
        const matchGrade = !gradeFilter || s.grade === gradeFilter;
        return matchSearch && matchGrade;
    });
    if (filtered.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <div class="icon">👋</div>
                <h3>还没有学生档案</h3>
                <p>点击右上角「新增学生」开始录入第一位学生</p>
                <button class="btn-primary btn-sm" onclick="openStudentModal()" style="margin-top:12px;">+ 新增学生</button>
            </div>
        `;
        return;
    }
    container.innerHTML = filtered.map(student => {
        const gradeText = getGradeText(student.grade);
        const genderClass = student.gender === '男' ? 'badge-male' : 'badge-female';
        const lastTest = getLastTest(student.id);
        return `
            <div class="student-card" onclick="viewStudent('${student.id}')">
                <div class="student-card-header">
                    <span class="student-name">${student.name}</span>
                    <span class="student-badge ${genderClass}">${student.gender}</span>
                </div>
                <div class="student-info">
                    <span>📚 ${gradeText}</span>
                    <span>🏫 ${student.school || '-'}</span>
                    <span>📅 ${student.birthday || '-'}</span>
                    <span>📱 ${student.parentPhone || '-'}</span>
                </div>
                ${lastTest ? `<div class="student-info" style="margin-top:8px"><span>📊 上次体测: ${lastTest.date}</span><span>🏆 总分: ${lastTest.totalScore || '-'}</span></div>` : ''}
                <div class="student-card-actions">
                    <button class="btn-primary btn-sm" onclick="event.stopPropagation(); startTest('${student.id}')">体测</button>
                    <button class="btn-secondary btn-sm" onclick="event.stopPropagation(); openStudentModal('${student.id}')">编辑</button>
                </div>
            </div>`;
    }).join('');
}

function filterStudents() { renderStudentList(); }

function getGradeText(grade) {
    const grades = {
        '1': '小学一年级', '2': '小学二年级', '3': '小学三年级',
        '4': '小学四年级', '5': '小学五年级', '6': '小学六年级',
        '7': '初一', '8': '初二', '9': '初三',
        '10': '高一', '11': '高二', '12': '高三'
    };
    return grades[grade] || grade;
}

function getStudentLevel(grade) {
    const g = parseInt(grade);
    if (g <= 6) return '小学';
    if (g <= 9) return '初中';
    return '高中';
}

function getStudentKey(grade, gender) {
    const level = getStudentLevel(grade);
    return `${level}_${gender}生`;
}

function getGradeKey(grade) {
    return grade + '年级';
}

// ==================== 学生弹窗 ====================
function openStudentModal(studentId = null) {
    const modal = document.getElementById('studentModal');
    const form = document.getElementById('studentForm');
    form.reset();
    document.getElementById('studentId').value = '';
    if (studentId) {
        const student = students.find(s => s.id === studentId);
        if (student) {
            document.getElementById('modalTitle').textContent = '编辑学生';
            document.getElementById('studentId').value = student.id;
            document.getElementById('studentName').value = student.name;
            document.getElementById('studentGender').value = student.gender;
            document.getElementById('studentBirthday').value = student.birthday || '';
            document.getElementById('studentGrade').value = student.grade;
            document.getElementById('studentSchool').value = student.school || '';
            document.getElementById('studentClass').value = student.class || '';
            document.getElementById('parentName').value = student.parentName || '';
            document.getElementById('parentPhone').value = student.parentPhone || '';
            document.getElementById('emergencyContact').value = student.emergencyContact || '';
            document.getElementById('emergencyPhone').value = student.emergencyPhone || '';
            document.getElementById('studentNote').value = student.note || '';
        }
    } else {
        document.getElementById('modalTitle').textContent = '新增学生';
    }
    modal.classList.add('show');
}

function closeStudentModal() {
    document.getElementById('studentModal').classList.remove('show');
}

async function saveStudent() {
    const form = document.getElementById('studentForm');
    if (!form.checkValidity()) { form.reportValidity(); return; }
    const studentId = document.getElementById('studentId').value;
    const studentData = {
        name: document.getElementById('studentName').value.trim(),
        gender: document.getElementById('studentGender').value,
        birthday: document.getElementById('studentBirthday').value,
        grade: document.getElementById('studentGrade').value,
        school: document.getElementById('studentSchool').value.trim(),
        class: document.getElementById('studentClass').value.trim(),
        parentName: document.getElementById('parentName').value.trim(),
        parentPhone: document.getElementById('parentPhone').value.trim(),
        emergencyContact: document.getElementById('emergencyContact').value.trim(),
        emergencyPhone: document.getElementById('emergencyPhone').value.trim(),
        note: document.getElementById('studentNote').value.trim()
    };
    try {
        if (studentId) {
            const updated = await studentDB.update(studentId, studentData);
            const index = students.findIndex(s => s.id === studentId);
            if (index !== -1) {
                students[index] = { ...students[index], ...mapStudent(updated) };
            }
            showToast('学生信息已更新', 'success');
        } else {
            const created = await studentDB.create(studentData);
            const newStudent = mapStudent(created);
            students.unshift(newStudent);
            showToast('学生添加成功', 'success');
        }
        renderStudentList();
        renderHoursOverview();
        updateSelectOptions();
        closeStudentModal();
    } catch (e) {
        console.error('saveStudent:', e);
        showToast('保存失败: ' + e.message, 'error');
    }
}

function viewStudent(studentId) {
    currentStudent = students.find(s => s.id === studentId);
    startTest(studentId);
}

function startTest(studentId) {
    switchPage('test');
    document.querySelectorAll('.nav-item').forEach(i => i.classList.remove('active'));
    document.querySelector('[data-page="test"]').classList.add('active');
    document.getElementById('testStudentSelect').value = studentId;
    loadStudentInfo();
}

async function deleteStudent(studentId) {
    if (confirm('确定要删除该学生吗？删除后不可恢复。')) {
        try {
            await studentDB.remove(studentId);
            students = students.filter(s => s.id !== studentId);
            renderStudentList();
            renderHoursOverview();
            updateSelectOptions();
            showToast('学生已删除', 'success');
        } catch (e) {
            console.error('deleteStudent:', e);
            showToast('删除失败: ' + e.message, 'error');
        }
    }
}

// ==================== 体测 ====================
function loadStudentInfo() {
    const studentId = document.getElementById('testStudentSelect').value;
    if (!studentId) {
        document.getElementById('basicInfoSection').style.display = 'none';
        return;
    }
    const student = students.find(s => s.id === studentId);
    if (!student) return;
    currentStudent = student;
    document.getElementById('basicInfoSection').style.display = 'block';
    document.getElementById('infoName').textContent = student.name;
    document.getElementById('infoGender').textContent = student.gender;
    document.getElementById('infoGrade').textContent = getGradeText(student.grade);
    document.getElementById('infoSchool').textContent = student.school || '-';
    renderTestItems(student.grade, student.gender);
}

function renderTestItems(grade, gender) {
    const container = document.getElementById('testItems');
    const level = getStudentLevel(grade);
    const studentKey = getStudentKey(grade, gender);
    const gradeKey = getGradeKey(grade);
    const standard = STANDARDS.scoring[studentKey]?.[gradeKey];

    if (!standard) {
        container.innerHTML = `<p style="color:var(--text-light);padding:20px">暂无该年级「${studentKey}」的评分标准（gradeKey=${gradeKey}），请检查年级是否在1-12范围内</p>`;
        return;
    }

    // 根据年级获取适用项目
    const applicableKeys = getApplicableTestKeys(grade, gender);

    // 所有项目定义（含分类）
    const allItems = [
        {key: 'height', name: '身高', unit: 'cm', category: '身体形态'},
        {key: 'weight', name: '体重', unit: 'kg', category: '身体形态'},
        {key: 'run_50m', name: '50米跑', unit: '秒', category: '速度素质'},
        {key: 'sit_and_reach', name: '坐位体前屈', unit: 'cm', category: '柔韧素质'},
        {key: 'jump_rope_1min', name: '1分钟跳绳', unit: '次', category: '力量素质'},
        {key: 'sit_up_1min', name: '1分钟仰卧起坐', unit: '次', category: '力量素质'},
        {key: 'pull_up', name: '引体向上', unit: '次', category: '力量素质'},
        {key: 'incline_pull_up', name: '斜身引体', unit: '次', category: '力量素质'},
        {key: 'solid_ball', name: '实心球', unit: '米', category: '力量素质'},
        {key: 'run_50m_8', name: '50米×8往返跑', unit: "分'秒", category: '耐力素质'},
        {key: 'run_800m', name: '800米跑', unit: "分'秒", category: '耐力素质'},
        {key: 'run_1000m', name: '1000米跑', unit: "分'秒", category: '耐力素质'},
        {key: 'standing_long_jump', name: '立定跳远', unit: 'cm', category: '爆发力'},
        {key: 'balance_stand', name: '闭眼单腿站立', unit: '秒', category: '平衡性'},
        {key: 't_test', name: 'T型跑', unit: '秒', category: '灵敏性'},
        {key: 'football_dribble', name: '足球运球绕杆', unit: '秒', category: '球类技能'},
        {key: 'basketball_dribble', name: '篮球绕杆运球', unit: '秒', category: '球类技能'},
        {key: 'basketball_layup', name: '篮球运球上篮', unit: '秒', category: '球类技能'},
        {key: 'volleyball_bump', name: '排球垫球', unit: '次', category: '球类技能'}
    ];

    // 过滤：只保留适用项目
    const items = allItems.filter(item => applicableKeys.includes(item.key));

    // 按分类排序
    const categoryOrder = ['身体形态', '身体机能', '速度素质', '柔韧素质', '力量素质', '耐力素质', '爆发力', '协调性', '球类技能'];
    items.sort((a, b) => categoryOrder.indexOf(a.category) - categoryOrder.indexOf(b.category));

    // 在身体形态分类下追加一个 BMI 评分行
    const itemsWithBmi = [...items];
    const lastBodyShapeIdx = itemsWithBmi.map(i => i.category).lastIndexOf('身体形态');
    if (lastBodyShapeIdx >= 0) {
        itemsWithBmi.splice(lastBodyShapeIdx + 1, 0, { key: 'bmi', name: 'BMI 评分', unit: '分', category: '身体形态' });
    }

    container.innerHTML = itemsWithBmi.map(item => {
        if (item.key === 'bmi') {
            // BMI 是只读展示行
            return `
        <div class="test-item" data-key="bmi">
            <div class="test-item-header">
                <span class="test-item-name">${item.name}</span>
                <span class="test-item-unit">自动计算</span>
            </div>
            <div style="padding:10px 14px;border:1px solid var(--border);border-radius:8px;background:var(--bg-secondary);color:var(--text-secondary);font-size:13px;">
                由 身高 + 体重 自动得出
            </div>
            <div class="test-item-score" id="score_bmi">
                <span class="score">-</span><span class="grade">未计算</span>
            </div>
        </div>`;
        }
        return `
        <div class="test-item" data-key="${item.key}">
            <div class="test-item-header">
                <span class="test-item-name">${item.name}</span>
                <span class="test-item-unit">${item.unit}</span>
            </div>
            <input type="${isTimeItem(item.key) ? 'text' : 'number'}" id="test_${item.key}" placeholder="${isTimeItem(item.key) ? "如 3'25\"" : '输入成绩'}" step="${getStep(item.key)}" oninput="calculateScore('${item.key}')">
            <div class="test-item-score" id="score_${item.key}">
                <span class="score">- 分</span><span class="grade">-</span>
            </div>
        </div>`;
    }).join('');
}

function getStep(key) {
    const steps = {'height':0.1,'weight':0.1,'run_50m':0.1,'sit_and_reach':0.5,'jump_rope_1min':1,'sit_up_1min':1,'pull_up':1,'incline_pull_up':1,'solid_ball':0.1,'standing_long_jump':1,'balance_stand':1,'t_test':0.1,'run_50m_8':1,'run_800m':1,'run_1000m':1,'football_dribble':0.1,'basketball_dribble':0.1,'basketball_layup':0.1,'volleyball_bump':1};
    return steps[key] || 1;
}

// 将时间字符串解析为秒数，用于比较
// 支持格式：3'25" / 3'25 / 3:25 / 3分25秒 / 4分10秒 / 250秒
function parseTimeToSeconds(timeStr) {
    if (typeof timeStr !== 'string') return null;
    // 匹配 分'秒 格式：3'25" / 3′25″ / 3:25 / 3分25秒 / 3：25
    const m = timeStr.match(/(\d+)\s*['\u2019\u2032:\uff1a\u5206]\s*(\d{1,2})\s*["\u201d\u2033\u79d2]?/);
    if (m) return parseInt(m[1]) * 60 + parseInt(m[2]);
    // 匹配纯秒数：250秒 / 250
    const secMatch = timeStr.match(/(\d+\.?\d*)\s*\u79d2/);
    if (secMatch) return parseFloat(secMatch[1]);
    const num = parseFloat(timeStr);
    return isNaN(num) ? null : num;
}

// 判断一个项目是否是时间类型（分'秒）
function isTimeItem(key) {
    return key === 'run_1000m' || key === 'run_800m' || key === 'run_50m_8';
}

function calculateScore(key) {
    // 身高、体重不参与评分，只用来计算 BMI
    if (key === 'height' || key === 'weight') {
        const el = document.getElementById(`score_${key}`);
        if (el) el.innerHTML = '<span class="score">-</span><span class="grade">参考</span>';
        // 实时刷新 BMI 行（如有）
        if (currentStudent) {
            const hEl = document.getElementById('test_height');
            const wEl = document.getElementById('test_weight');
            if (hEl && wEl) {
                const h = parseFloat(hEl.value), w = parseFloat(wEl.value);
                const bmiEl = document.getElementById('score_bmi');
                if (bmiEl && !isNaN(h) && !isNaN(w) && h > 0 && w > 0) {
                    const bmi = computeBMI(h, w);
                    const status = getBMIStatus(bmi, parseInt(currentStudent.grade), currentStudent.gender);
                    const score = getBMIScore(status);
                    const gradeClass = {'非常棒':'grade-excellent','还不错':'grade-good','刚达标':'grade-pass','待提升':'grade-fail'};
                    const level = score === null ? '-' : getGradeLabel(score);
                    bmiEl.innerHTML = `<span class="score">${score === null ? '-' : score} 分</span><span class="grade ${gradeClass[level] || ''}">${level}</span> <small style="color:${status.color};font-weight:500;">${status.label}</small>`;
                }
            }
        }
        return;
    }
    const rawValue = document.getElementById(`test_${key}`).value.trim();
    if (!rawValue || !currentStudent) {
        document.getElementById(`score_${key}`).innerHTML = '<span class="score">- 分</span><span class="grade">-</span>';
        return;
    }
    const grade = currentStudent.grade;
    const gender = currentStudent.gender;
    const studentKey = getStudentKey(grade, gender);
    const gradeKey = getGradeKey(grade);
    const standard = STANDARDS.scoring[studentKey]?.[gradeKey]?.[key];
    if (!standard) {
        document.getElementById(`score_${key}`).innerHTML = '<span class="score">- 分</span><span class="grade">-</span>';
        return;
    }
    const { score, grade: level } = getScoreFromValue(rawValue, standard, key);
    const gradeClass = {'非常棒':'grade-excellent','还不错':'grade-good','刚达标':'grade-pass','待提升':'grade-fail'};
    document.getElementById(`score_${key}`).innerHTML = `<span class="score">${score} 分</span><span class="grade ${gradeClass[level]}">${level}</span>`;
}

function getScoreFromValue(value, standard, key) {
    let score = 0, gradeLevel = '待提升';
    const { low, high, step = 1, reverse } = standard;

    // 时间类型项目（run_1000m, run_800m, run_50m_8）：将分'秒格式转为秒数再比较
    if (isTimeItem(key)) {
        const valSec = parseTimeToSeconds(String(value));
        const lowSec = parseTimeToSeconds(String(low));
        const highSec = parseTimeToSeconds(String(high));
        if (valSec === null || lowSec === null || highSec === null) {
            return { score: 0, grade: '待提升' };
        }
        // 时间类项目：reverse=true 表示越短越好
        if (reverse) {
            if (valSec <= lowSec) { score = 100; gradeLevel = '非常棒'; }
            else if (valSec <= lowSec + 15) { score = 90; gradeLevel = '还不错'; }
            else if (valSec <= lowSec + 35) { score = 80; gradeLevel = '还不错'; }
            else if (valSec <= highSec) { score = 60; gradeLevel = '刚达标'; }
            else { score = 40; gradeLevel = '待提升'; }
        } else {
            if (valSec >= highSec) { score = 100; gradeLevel = '非常棒'; }
            else if (valSec >= highSec - 15) { score = 90; gradeLevel = '还不错'; }
            else if (valSec >= highSec - 35) { score = 80; gradeLevel = '还不错'; }
            else if (valSec >= lowSec) { score = 60; gradeLevel = '刚达标'; }
            else { score = 40; gradeLevel = '待提升'; }
        }
        return { score, grade: gradeLevel };
    }

    // 普通数值项目
    const numValue = typeof value === 'number' ? value : parseFloat(value);
    if (isNaN(numValue)) return { score: 0, grade: '待提升' };

    if (reverse) {
        if (numValue <= low) { score = 100; gradeLevel = '非常棒'; }
        else if (numValue <= low + step * 2) { score = 90; gradeLevel = '还不错'; }
        else if (numValue <= low + step * 4) { score = 80; gradeLevel = '还不错'; }
        else if (numValue <= low + step * 6) { score = 60; gradeLevel = '刚达标'; }
        else { score = 40; gradeLevel = '待提升'; }
    } else {
        if (numValue >= high) { score = 100; gradeLevel = '非常棒'; }
        else if (numValue >= high - step * 2) { score = 90; gradeLevel = '还不错'; }
        else if (numValue >= high - step * 4) { score = 80; gradeLevel = '还不错'; }
        else if (numValue >= high - step * 6) { score = 60; gradeLevel = '刚达标'; }
        else { score = 40; gradeLevel = '待提升'; }
    }
    return { score, grade: gradeLevel };
}

function toggleHealthDeclaration() {
    const checked = document.getElementById('healthNoIssue').checked;
    document.getElementById('healthDetails').style.display = checked ? 'none' : 'grid';
}

async function submitTest() {
    if (!currentStudent) { showToast('请先选择学生', 'error'); return; }
    const testData = {
        date: new Date().toISOString().split('T')[0],
        healthDeclaration: document.getElementById('healthNoIssue').checked ? '无异常' : '有异常',
        items: {}, itemScores: {}
    };

    const testInputs = document.querySelectorAll('.test-item input');
    testInputs.forEach(input => {
        const key = input.id.replace('test_', '');
        const rawVal = input.value.trim();
        if (!rawVal) return;
        // 时间类型项目（run_1000m, run_800m, run_50m_8）保存原始字符串
        if (isTimeItem(key)) {
            testData.items[key] = rawVal;
        } else {
            const value = parseFloat(rawVal);
            if (!isNaN(value)) testData.items[key] = value;
        }
    });

    const testItemKeys = Object.keys(testData.items);
    let totalScore = 0, count = 0;
    testItemKeys.forEach(key => {
        const scoreEl = document.querySelector(`#score_${key} .score`);
        if (scoreEl) {
            const scoreText = scoreEl.textContent;
            const score = parseInt(scoreText);
            if (!isNaN(score)) { totalScore += score; count++; testData.itemScores[key] = score; }
        }
    });

    if (testData.items.height && testData.items.weight) {
        const bmi = computeBMI(testData.items.height, testData.items.weight);
        const bmiStatus = getBMIStatus(bmi, parseInt(currentStudent.grade), currentStudent.gender);
        const bmiScore = getBMIScore(bmiStatus);
        if (bmiScore !== null) {
            totalScore += bmiScore;
            count++;
            testData.itemScores['bmi'] = bmiScore;
        }
    }

    testData.totalScore = count > 0 ? Math.round(totalScore / count) : 0;
    testData.gradeLevel = testData.totalScore >= 90 ? 'excellent' : testData.totalScore >= 80 ? 'good' : testData.totalScore >= 60 ? 'pass' : 'fail';

    try {
        const created = await testDB.create(currentStudent.id, testData);
        // 更新内存缓存
        if (!currentStudent.tests) currentStudent.tests = [];
        currentStudent.tests.push({
            id: created.id,
            studentId: currentStudent.id,
            date: created.test_date,
            items: created.items,
            itemScores: created.item_scores,
            totalScore: created.total_score,
            bmiBonus: created.bmi_bonus,
            gradeLevel: created.grade_level,
            healthDeclaration: created.health_declaration
        });
        showToast('体测数据已保存', 'success');
        clearTest();
    } catch (e) {
        console.error('submitTest:', e);
        showToast('保存失败: ' + e.message, 'error');
    }
}

function clearTest() {
    document.querySelectorAll('.test-item input').forEach(input => input.value = '');
    document.querySelectorAll('.test-item-score').forEach(el => el.innerHTML = '<span class="score">- 分</span><span class="grade">-</span>');
    document.getElementById('healthNoIssue').checked = false;
    toggleHealthDeclaration();
}

function getLastTest(studentId) {
    const student = students.find(s => s.id === studentId);
    if (!student || !student.tests || student.tests.length === 0) return null;
    return student.tests[student.tests.length - 1];
}

// 获取报告页选中的体测记录（未选则返回最新一次）
function getSelectedTest(studentId) {
    const select = document.getElementById('reportTestSelect');
    const testId = select ? select.value : '';
    if (testId) {
        const student = students.find(s => s.id === studentId);
        if (student && student.tests) {
            const found = student.tests.find(t => t.id === testId);
            if (found) return found;
        }
    }
    return getLastTest(studentId);
}

// 更新体测记录选择器
function updateTestRecordSelector(studentId) {
    const student = students.find(s => s.id === studentId);
    const section = document.getElementById('testRecordSection');
    const select = document.getElementById('reportTestSelect');
    if (!student || !student.tests || student.tests.length === 0) {
        section.style.display = 'none';
        return;
    }
    section.style.display = 'block';
    // 按日期降序排列（最新在前）
    const sorted = [...student.tests].sort((a, b) => new Date(b.date) - new Date(a.date));
    select.innerHTML = '<option value="">-- 最新一次 --</option>';
    sorted.forEach(test => {
        const opt = new Option(`${test.date} (${test.totalScore || '-'}分)`, test.id);
        select.add(opt);
    });
    // 默认选最新一次（即空值，走 getLastTest 逻辑）
    select.value = '';
}

// 从 Supabase 获取学生最近一次体测（用于报告页）
async function fetchLastTest(studentId) {
    const tests = await fetchStudentTests(studentId);
    return tests.length > 0 ? tests[tests.length - 1] : null;
}

// 获取该学生所有体测记录（按需从 Supabase 加载并缓存）
async function fetchStudentTests(studentId) {
    const student = students.find(s => s.id === studentId);
    if (!student) return [];
    // 已缓存则直接返回
    if (student.tests && student.tests.length > 0) return student.tests;
    // 从 Supabase 加载
    try {
        const data = await testDB.getByStudent(studentId);
        student.tests = data;
        return data;
    } catch (e) {
        console.error('fetchStudentTests:', e);
        return [];
    }
}

// ==================== 报告管理 ====================
function updateSelectOptions() {
    ['testStudentSelect', 'reportStudentSelect', 'trainingStudentSelect'].forEach(selectId => {
        const select = document.getElementById(selectId);
        if (!select) return;
        const currentValue = select.value;
        select.innerHTML = '<option value="">-- 请选择学生 --</option>';
        students.forEach(student => {
            const option = document.createElement('option');
            option.value = student.id;
            option.textContent = `${student.name} (${getGradeText(student.grade)})`;
            select.appendChild(option);
        });
        if (currentValue && students.find(s => s.id === currentValue)) select.value = currentValue;
    });
    // 初始化报告页省份选择器
    initReportProvinceSelector();
    // 初始化上传页省份选择器（确保 TRAINING_DB 已就绪后再次尝试）
    initUploadProvinceSelector();
}

function loadReportData() {
    const studentId = document.getElementById('reportStudentSelect').value;
    const preview = document.getElementById('reportPreview');
    const compareSection = document.getElementById('compareSection');
    const testRecordSection = document.getElementById('testRecordSection');
    if (!studentId) { 
        preview.innerHTML = `
            <div class="empty-state">
                <div class="icon">📊</div>
                <h3>查看体质报告</h3>
                <p>选择上方学生后，系统将自动生成体质健康分析报告</p>
            </div>
        `; 
        compareSection.style.display = 'none';
        testRecordSection.style.display = 'none';
        return; 
    }
    const student = students.find(s => s.id === studentId);
    if (!student) return;
    
    // 更新体测记录选择器
    updateTestRecordSelector(studentId);
    
    // 更新对比模式的测试记录下拉列表
    updateCompareSelectors(studentId);
    
    // 获取选中的体测记录（默认为最新一次）
    const lastTest = getSelectedTest(studentId);
    if (!lastTest) { 
        preview.innerHTML = `
            <div class="empty-state">
                <div class="icon">📋</div>
                <h3>该学生暂无体测记录</h3>
                <p>前往「体测录入」添加一条记录，即可查看报告</p>
                <button class="btn-primary btn-sm" onclick="switchPage('test')" style="margin-top:12px;">去录入体测</button>
            </div>
        `; 
        return; 
    }
    
    // 计算优势/提升方向（确保不重复）
    const { strongItems, weakItems } = getStrengthWeakItems(lastTest);
    
    preview.innerHTML = `
        <div class="report-header">
            <h2>🏃 体质测试反馈表</h2>
            <p>依据：《国家学生体质健康标准（2014年修订）》</p>
        </div>
        <div class="report-section">
            <h4>📋 基本信息</h4>
            <table class="report-table">
                <tr><th>姓名</th><td>${student.name}</td><th>性别</th><td>${student.gender}</td></tr>
                <tr><th>年级</th><td>${getGradeText(student.grade)}</td><th>学校</th><td>${student.school || '-'}</td></tr>
                <tr><th>测试日期</th><td>${lastTest.date}</td><th>主测教练</th><td>-</td></tr>
            </table>
        </div>
        <div class="report-section">
            <h4>📊 体测成绩</h4>
            <table class="report-table">
                <thead><tr><th>测试项目</th><th>成绩</th><th>得分</th><th>等级</th></tr></thead>
                <tbody>${(function() {
                    if (Object.keys(lastTest.items || {}).length === 0) {
                        return '<tr><td colspan="4" style="text-align:center;color:var(--text-light);padding:20px">暂无体测成绩数据，请先录入体测成绩</td></tr>';
                    }
                    const rows = Object.entries(lastTest.items).map(([key, value]) => {
                        // 身高、体重不参与评分，仅作参考
                        if (key === 'height' || key === 'weight') {
                            return { key, html: `<tr><td>${getItemName(key)}</td><td>${isTimeItem(key) ? value : value + getItemUnit(key)}</td><td>-</td><td><span class="grade" style="color:#94a3b8">参考</span></td></tr>` };
                        }
                        const score = lastTest.itemScores?.[key] || '-';
                        const gradeLevel = score === '-' ? '-' : getGradeLabel(score);
                        const gradeClass = score === '-' ? '' : getGradeClass(score);
                        return { key, html: `<tr><td>${getItemName(key)}</td><td>${isTimeItem(key) ? value : value + getItemUnit(key)}</td><td>${score}</td><td><span class="grade ${gradeClass}">${gradeLevel}</span></td></tr>` };
                    });
                    // 计算并插入 BMI 行（体重之后），BMI 参与评分
                    if (lastTest.items.height && lastTest.items.weight) {
                        const bmi = computeBMI(lastTest.items.height, lastTest.items.weight);
                        const bmiStatus = getBMIStatus(bmi, parseInt(student.grade), student.gender);
                        const bmiScore = getBMIScore(bmiStatus);
                        const bmiGrade = bmiScore === null ? '-' : getGradeLabel(bmiScore);
                        const bmiClass = bmiScore === null ? '' : getGradeClass(bmiScore);
                        const weightIdx = rows.findIndex(r => r.key === 'weight');
                        const insertIdx = weightIdx >= 0 ? weightIdx + 1 : rows.length;
                        rows.splice(insertIdx, 0, {
                            key: 'bmi',
                            html: `<tr><td>BMI指数</td><td>${bmi} kg/m²</td><td>${bmiScore === null ? '-' : bmiScore}</td><td><span class="grade ${bmiClass}">${bmiGrade}</span></td></tr>`
                        });
                    }
                    return rows.map(r => r.html).join('');
                })()}</tbody>
            </table>
            <div class="report-summary">
                <div class="summary-item"><div class="value">${lastTest.totalScore || '-'}</div><div class="label">学年总分</div></div>
                <div class="summary-item"><div class="value">${getGradeLabel(lastTest.totalScore)}</div><div class="label">评定等级</div></div>
                <div class="summary-item"><div class="value" style="font-size:16px">${strongItems.join('、') || '-'}</div><div class="label">优势项目</div></div>
                <div class="summary-item"><div class="value" style="font-size:16px">${weakItems.join('、') || '-'}</div><div class="label">提升方向</div></div>
            </div>
        </div>
        <div class="report-section">
            <h4>🔬 项目解读</h4>
            <div style="display:flex;flex-direction:column;gap:6px;">
                ${generateItemInterpretationsPreview(lastTest, student)}
            </div>
        </div>
        <div class="report-section">
            <h4>📝 测试总结</h4>
            <div style="padding:10px 14px;border-radius:6px;background:#f0f7ff;border:1px solid #bfdbfe;font-size:13px;line-height:1.7;color:#1e3a5f;">
                ${generateTestSummary(lastTest, student)}
            </div>
        </div>
    </div>`;
}

// 生成预览版项目解读 HTML（适配预览页样式）
function generateItemInterpretationsPreview(lastTest, student) {
    if (!lastTest.items || Object.keys(lastTest.items).length === 0) {
        return '<div style="font-size:12px;color:var(--text-light);padding:8px;">暂无体测数据，无法生成项目解读</div>';
    }

    const levelStyles = {
        excellent: { border: '#22c55e', bg: '#f0fdf4', label: '优秀' },
        good: { border: '#3b82f6', bg: '#eff6ff', label: '良好' },
        pass: { border: '#f59e0b', bg: '#fffbeb', label: '达标' },
        needsWork: { border: '#ef4444', bg: '#fef2f2', label: '待提升' }
    };

    const rows = [];
    for (const [key, value] of Object.entries(lastTest.items)) {
        if (key === 'height' || key === 'weight') continue;
        const interp = ITEM_INTERPRETATIONS[key];
        if (!interp) continue;

        const score = lastTest.itemScores?.[key];
        if (score === undefined || score === null) continue;

        const level = getInterpretationLevel(score);
        const analysis = interp.levels[level] || interp.levels.needsWork;
        const style = levelStyles[level];
        const unitSuffix = isTimeItem(key) ? '' : getItemUnit(key);
        const displayValue = isTimeItem(key) ? value : `${value}${unitSuffix}`;

        rows.push(`
            <div style="padding:8px 12px;border-radius:6px;border-left:3px solid ${style.border};background:${style.bg};line-height:1.6;">
                <div style="display:flex;align-items:baseline;gap:8px;margin-bottom:4px;">
                    <span style="font-weight:700;font-size:13px;color:var(--text-primary);">${getItemName(key)}</span>
                    <span style="font-size:12px;color:var(--text-secondary);">${displayValue}</span>
                    <span style="font-size:13px;font-weight:700;margin-left:auto;color:${style.border};">${score}分 · ${style.label}</span>
                </div>
                <div style="font-size:11px;color:var(--text-secondary);margin-bottom:4px;">测试目的：${interp.purpose}</div>
                <div style="font-size:12px;color:var(--text-primary);">${analysis}</div>
            </div>`);
    }

    // BMI 解读
    if (lastTest.items.height && lastTest.items.weight) {
        const bmi = computeBMI(lastTest.items.height, lastTest.items.weight);
        const bmiStatus = getBMIStatus(bmi, parseInt(student.grade), student.gender);
        const bmiScore = getBMIScore(bmiStatus);
        const bmiInterp = ITEM_INTERPRETATIONS['bmi'];
        if (bmiInterp && bmiScore !== null) {
            const level = getInterpretationLevel(bmiScore);
            const analysis = bmiInterp.levels[level] || bmiInterp.levels.needsWork;
            const style = levelStyles[level];
            rows.push(`
            <div style="padding:8px 12px;border-radius:6px;border-left:3px solid ${style.border};background:${style.bg};line-height:1.6;">
                <div style="display:flex;align-items:baseline;gap:8px;margin-bottom:4px;">
                    <span style="font-weight:700;font-size:13px;color:var(--text-primary);">BMI指数</span>
                    <span style="font-size:12px;color:var(--text-secondary);">${bmi} kg/m²</span>
                    <span style="font-size:13px;font-weight:700;margin-left:auto;color:${style.border};">${bmiScore}分 · ${style.label}</span>
                </div>
                <div style="font-size:11px;color:var(--text-secondary);margin-bottom:4px;">测试目的：${bmiInterp.purpose}</div>
                <div style="font-size:12px;color:var(--text-primary);">${analysis}</div>
            </div>`);
        }
    }

    if (rows.length === 0) {
        return '<div style="font-size:12px;color:var(--text-light);padding:8px;">暂无评分数据，无法生成项目解读</div>';
    }

    return rows.join('');
}

// 更新对比模式的测试记录选择器
function updateCompareSelectors(studentId) {
    const student = students.find(s => s.id === studentId);
    if (!student || !student.tests || student.tests.length === 0) return;
    
    const select1 = document.getElementById('compareTest1');
    const select2 = document.getElementById('compareTest2');
    
    select1.innerHTML = '<option value="">-- 请选择 --</option>';
    select2.innerHTML = '<option value="">-- 请选择 --</option>';
    
    student.tests.sort((a, b) => new Date(a.date) - new Date(b.date)).forEach(test => {
        const option1 = new Option(`${test.date} (${test.totalScore}分)`, test.id);
        const option2 = new Option(`${test.date} (${test.totalScore}分)`, test.id);
        select1.add(option1);
        select2.add(option2);
    });
}

// 切换对比模式
function toggleCompareMode() {
    const compareSection = document.getElementById('compareSection');
    const trendSection = document.getElementById('trendSection');
    const btn = document.getElementById('compareModeBtn');
    
    if (compareSection.style.display === 'none') {
        compareSection.style.display = 'block';
        trendSection.style.display = 'block';
        btn.textContent = '❌ 退出对比';
        btn.classList.add('btn-danger');
        btn.classList.remove('btn-secondary');
    } else {
        compareSection.style.display = 'none';
        trendSection.style.display = 'none';
        btn.textContent = '📊 对比模式';
        btn.classList.remove('btn-danger');
        btn.classList.add('btn-secondary');
        // 重新加载普通报告
        loadReportData();
    }
}

// 显示趋势图
function showTrendChart() {
    const studentId = document.getElementById('reportStudentSelect').value;
    if (!studentId) {
        showToast('请先选择学生', 'error');
        return;
    }

    const student = students.find(s => s.id === studentId);
    if (!student || !student.tests || student.tests.length < 2) {
        const wrap = document.getElementById('trendChartWrap');
        const empty = document.getElementById('trendEmpty');
        if (wrap) wrap.style.display = 'none';
        if (empty) empty.style.display = 'block';
        return;
    }

    const wrap = document.getElementById('trendChartWrap');
    const empty = document.getElementById('trendEmpty');
    if (wrap) wrap.style.display = 'block';
    if (empty) empty.style.display = 'none';

    const canvas = document.getElementById('trendChart');
    canvas.style.display = 'block';

    // 准备数据
    const tests = student.tests.sort((a, b) => new Date(a.date) - new Date(b.date));
    const dates = tests.map(t => t.date);
    const totalScores = tests.map(t => t.totalScore || 0);

    // 获取所有测试项目
    const allKeys = new Set();
    tests.forEach(test => {
        if (test.itemScores) {
            Object.keys(test.itemScores).forEach(key => allKeys.add(key));
        }
    });

    // 为每个项目准备数据
    const datasets = [];
    const colors = ['#3b82f6', '#22c55e', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];
    let colorIndex = 0;

    // 先添加总分线
    datasets.push({
        label: '总分',
        data: totalScores,
        borderColor: '#1a1a1a',
        backgroundColor: 'rgba(26, 26, 26, 0.1)',
        borderWidth: 3,
        fill: false,
        tension: 0.4
    });

    // 添加各项目得分线（只显示有评分的项目）
    allKeys.forEach(key => {
        const scores = tests.map(t => t.itemScores?.[key] || null);
        if (scores.some(s => s !== null)) {
            datasets.push({
                label: getItemName(key),
                data: scores,
                borderColor: colors[colorIndex % colors.length],
                backgroundColor: 'rgba(0, 0, 0, 0)',
                borderWidth: 2,
                fill: false,
                tension: 0.4,
                hidden: true // 默认隐藏，避免图表太乱
            });
            colorIndex++;
        }
    });

    // 创建或更新图表
    if (window.trendChartInstance) {
        window.trendChartInstance.destroy();
    }

    if (typeof Chart === 'undefined') {
        showToast('图表库加载失败，请检查网络', 'error');
        return;
    }

    const ctx = canvas.getContext('2d');
    window.trendChartInstance = new Chart(ctx, {
        type: 'line',
        data: {
            labels: dates,
            datasets: datasets
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                title: {
                    display: true,
                    text: `${student.name} 体测成绩趋势图`
                },
                legend: {
                    display: true,
                    position: 'bottom'
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    max: 100,
                    title: {
                        display: true,
                        text: '得分'
                    }
                },
                x: {
                    title: {
                        display: true,
                        text: '测试日期'
                    }
                }
            }
        }
    });
}

// 隐藏趋势图
function hideTrendChart() {
    const canvas = document.getElementById('trendChart');
    canvas.style.display = 'none';
    if (window.trendChartInstance) {
        window.trendChartInstance.destroy();
        window.trendChartInstance = null;
    }
}

// 加载对比数据
function loadCompareData() {
    const studentId = document.getElementById('reportStudentSelect').value;
    const testId1 = document.getElementById('compareTest1').value;
    const testId2 = document.getElementById('compareTest2').value;
    const preview = document.getElementById('reportPreview');
    
    if (!testId1 || !testId2) {
        preview.innerHTML = '<div class="empty-state"><p>请选择两次测试记录进行对比</p></div>';
        return;
    }
    
    const student = students.find(s => s.id === studentId);
    if (!student || !student.tests) return;
    
    const test1 = student.tests.find(t => t.id === testId1);
    const test2 = student.tests.find(t => t.id === testId2);
    
    if (!test1 || !test2) return;
    
    // 生成对比报告
    preview.innerHTML = generateCompareReport(student, test1, test2);
}

// 生成对比报告
function generateCompareReport(student, test1, test2) {
    const items1 = test1.items || {};
    const items2 = test2.items || {};
    const scores1 = test1.itemScores || {};
    const scores2 = test2.itemScores || {};

    // 获取所有项目
    const allKeys = new Set([...Object.keys(items1), ...Object.keys(items2)]);

    // 身高、体重优先排在最前
    const priorityKeys = ['height', 'weight'];
    const orderedKeys = [
        ...priorityKeys.filter(k => allKeys.has(k)),
        ...[...allKeys].filter(k => !priorityKeys.includes(k))
    ];

    let rows = [];
    orderedKeys.forEach(key => {
        const name = getItemName(key);
        const unit = getItemUnit(key);
        const value1 = items1[key] !== undefined ? `${items1[key]}${unit}` : '-';
        const value2 = items2[key] !== undefined ? `${items2[key]}${unit}` : '-';

        const isHW = key === 'height' || key === 'weight';
        const score1 = isHW ? '-' : (scores1[key] || '-');
        const score2 = isHW ? '-' : (scores2[key] || '-');

        // 计算变化：身高/体重对比绝对差值；其他对比得分差值
        let change = '-';
        let changeClass = 'no-change';
        if (isHW) {
            // 身高体重：值越大表示长高/增重（家长可能希望长高也可能希望减重，这里只给中性显示）
            if (items1[key] !== undefined && items2[key] !== undefined) {
                const diff = Number(items2[key]) - Number(items1[key]);
                const fixed = Math.round(diff * 10) / 10;
                if (fixed > 0) { change = `↑ +${fixed}${unit}`; changeClass = 'improvement'; }
                else if (fixed < 0) { change = `↓ ${fixed}${unit}`; changeClass = 'decline'; }
                else { change = '→ 0'; changeClass = 'no-change'; }
            }
        } else {
            if (scores1[key] !== undefined && scores2[key] !== undefined) {
                const diff = scores2[key] - scores1[key];
                if (diff > 0) { change = `↑ +${diff}`; changeClass = 'improvement'; }
                else if (diff < 0) { change = `↓ ${diff}`; changeClass = 'decline'; }
                else { change = '→ 0'; changeClass = 'no-change'; }
            }
        }

        const refBadge = isHW ? ' <span style="font-size:10px;color:#94a3b8;font-weight:500;">参考</span>' : '';

        rows.push(`<tr>
            <td>${name}${refBadge}</td>
            <td>${value1}</td>
            <td>${score1}</td>
            <td>${value2}</td>
            <td>${score2}</td>
            <td class="${changeClass}">${change}</td>
        </tr>`);
    });

    // 添加BMI对比
    if (items1.height && items1.weight && items2.height && items2.weight) {
        const bmi1 = computeBMI(items1.height, items1.weight);
        const bmi2 = computeBMI(items2.height, items2.weight);
        const bmiStatus1 = getBMIStatus(bmi1, parseInt(student.grade), student.gender);
        const bmiStatus2 = getBMIStatus(bmi2, parseInt(student.grade), student.gender);
        const bmiDiff = Math.round((bmi2 - bmi1) * 10) / 10;
        const bmiArrow = bmi2 > bmi1 ? '↑' : bmi2 < bmi1 ? '↓' : '→';
        rows.push(`<tr>
            <td>BMI指数 <span style="font-size:10px;color:#94a3b8;font-weight:500;">参考</span></td>
            <td>${bmi1} kg/m²</td>
            <td>${bmiStatus1.label}</td>
            <td>${bmi2} kg/m²</td>
            <td>${bmiStatus2.label}</td>
            <td class="${bmiDiff > 0 ? 'decline' : bmiDiff < 0 ? 'improvement' : 'no-change'}">${bmiArrow} ${bmiDiff > 0 ? '+' : ''}${bmiDiff}</td>
        </tr>`);
    }
    
    const totalDiff = (test2.totalScore || 0) - (test1.totalScore || 0);
    const totalChange = totalDiff > 0 ? `↑ +${totalDiff}` : totalDiff < 0 ? `↓ ${totalDiff}` : '→ 0';
    
    return `
        <div class="report-header">
            <h2>📊 体测数据对比报告</h2>
            <p>${student.name} (${getGradeText(student.grade)})</p>
        </div>
        <div class="report-section">
            <h4>📅 对比信息</h4>
            <table class="report-table">
                <tr><th>第一次测试</th><td>${test1.date}</td><th>总分</th><td>${test1.totalScore}分 (${getGradeLabel(test1.totalScore)})</td></tr>
                <tr><th>第二次测试</th><td>${test2.date}</td><th>总分</th><td>${test2.totalScore}分 (${getGradeLabel(test2.totalScore)})</td></tr>
                <tr><th>总分变化</th><td colspan="3" style="font-size:18px;font-weight:700;color:${totalDiff > 0 ? '#22c55e' : totalDiff < 0 ? '#ef4444' : '#888'}">${totalChange}</td></tr>
            </table>
        </div>
        <div class="report-section">
            <h4>📊 详细对比</h4>
            <table class="report-table">
                <thead>
                    <tr>
                        <th>项目</th>
                        <th>${test1.date}<br>成绩 (得分)</th>
                        <th>${test2.date}<br>成绩 (得分)</th>
                        <th>变化</th>
                    </tr>
                </thead>
                <tbody>${rows.join('')}</tbody>
            </table>
        </div>
        <div class="report-section">
            <h4>📈 提升分析</h4>
            ${generateImprovementAnalysis(test1, test2, student)}
        </div>`;
}

// 生成提升分析
function generateImprovementAnalysis(test1, test2, student) {
    const scores1 = test1.itemScores || {};
    const scores2 = test2.itemScores || {};
    const items1 = test1.items || {};
    const items2 = test2.items || {};

    const improvements = [];
    const declines = [];
    const bodyChanges = [];   // 身高体重变化

    Object.keys(scores1).forEach(key => {
        // 身高/体重不参与评分变化
        if (key === 'height' || key === 'weight') return;
        if (scores2[key] !== undefined) {
            const diff = scores2[key] - scores1[key];
            if (diff > 0) {
                improvements.push(`${getItemName(key)}: +${diff}分`);
            } else if (diff < 0) {
                declines.push(`${getItemName(key)}: ${diff}分`);
            }
        }
    });

    // 身高体重变化（参考指标）
    ['height', 'weight'].forEach(key => {
        if (items1[key] !== undefined && items2[key] !== undefined) {
            const diff = Math.round((Number(items2[key]) - Number(items1[key])) * 10) / 10;
            if (diff !== 0) {
                const sign = diff > 0 ? '+' : '';
                bodyChanges.push(`${getItemName(key)}: ${sign}${diff}${getItemUnit(key)}`);
            }
        }
    });

    // BMI 变化
    if (items1.height && items1.weight && items2.height && items2.weight) {
        const bmi1 = computeBMI(items1.height, items1.weight);
        const bmi2 = computeBMI(items2.height, items2.weight);
        const bmiDiff = Math.round((bmi2 - bmi1) * 10) / 10;
        if (bmiDiff !== 0) {
            const grade = student ? parseInt(student.grade) : parseInt(test1.studentGrade);
            const gender = student ? student.gender : test1.studentGender;
            const s1 = getBMIStatus(bmi1, grade, gender);
            const s2 = getBMIStatus(bmi2, grade, gender);
            bodyChanges.push(`BMI: ${bmiDiff > 0 ? '+' : ''}${bmiDiff}（${s1.label} → ${s2.label}）`);
        }
    }

    let html = '<div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;">';
    if (improvements.length > 0) {
        html += `<div><h5 style="color:#22c55e;">✅ 提升项目</h5><p>${improvements.join('、')}</p></div>`;
    }
    if (declines.length > 0) {
        html += `<div><h5 style="color:#ef4444;">⚠️ 下降项目</h5><p>${declines.join('、')}</p></div>`;
    }
    if (bodyChanges.length > 0) {
        html += `<div style="grid-column:1/-1;"><h5 style="color:#3b82f6;">📏 身体形态变化</h5><p>${bodyChanges.join('、')}</p></div>`;
    }
    html += '</div>';

    if (improvements.length === 0 && declines.length === 0 && bodyChanges.length === 0) {
        html = '<p>两次测试成绩相同，无变化。</p>';
    }

    return html;
}

function getGradeLabel(score) {
    if (score === undefined || score === '' || score === '-' || score === null) return '-';
    if (score >= 90) return '非常棒'; if (score >= 80) return '还不错'; if (score >= 60) return '刚达标'; return '待提升';
}

function getGradeClass(score) {
    if (score === undefined || score === '' || score === '-' || score === null) return '';
    if (score >= 90) return 'grade-excellent'; if (score >= 80) return 'grade-good'; if (score >= 60) return 'grade-pass'; return 'grade-fail';
}

// ==================== PDF 导出核心函数（iframe + html2canvas + jsPDF，智能分页保留彩色） ====================
async function exportPDFFromHTML(html, filename) {
    // 使用隐藏 iframe 渲染完整 HTML 文档，确保所有 CSS 选择器正确匹配
    var iframe = document.createElement('iframe');
    iframe.style.cssText = 'position:fixed;left:-10000px;top:0;width:794px;height:auto;border:none;';
    document.body.appendChild(iframe);
    var iframeDoc = iframe.contentWindow.document;
    iframeDoc.open();
    iframeDoc.write(html);
    iframeDoc.close();
    // 等待 iframe 加载完成
    await new Promise(function(resolve) {
        if (iframe.contentWindow.document.readyState === 'complete') { setTimeout(resolve, 600); }
        else { iframe.onload = function() { setTimeout(resolve, 600); }; }
    });
    try {
        var iframeBody = iframe.contentWindow.document.body;

        // 动态测量内容实际高度，确保 html2canvas 截取全部内容
        var contentHeight = Math.max(
            iframeBody.scrollHeight,
            iframe.contentWindow.document.documentElement.scrollHeight,
            iframeBody.offsetHeight
        );
        // 将 iframe 高度设为内容实际高度，避免截断
        iframe.style.height = contentHeight + 'px';

        // 1. 收集"可分页断点"——所有 section 级元素的底部 y 坐标
        var breakPoints = [];
        var pageContainer = iframeDoc.querySelector('.page') || iframeBody;
        var sectionEls = pageContainer.children;
        for (var si = 0; si < sectionEls.length; si++) {
            var rect = sectionEls[si].getBoundingClientRect();
            var bottomY = Math.round(rect.bottom);
            if (bottomY > 0) breakPoints.push(bottomY);
        }
        // 也收集表格内每行的底部（防止长表格被从中间截断）
        var tableRows = iframeDoc.querySelectorAll('tr');
        for (var ri = 0; ri < tableRows.length; ri++) {
            var rowRect = tableRows[ri].getBoundingClientRect();
            var rowBottom = Math.round(rowRect.bottom);
            if (rowBottom > 0) breakPoints.push(rowBottom);
        }
        // 去重并排序
        breakPoints = Array.from(new Set(breakPoints)).sort(function(a, b) { return a - b; });

        // 2. 渲染完整 canvas（保留彩色）
        var canvas = await html2canvas(iframeBody, {
            scale: 2, useCORS: true, backgroundColor: '#ffffff', width: 794, height: contentHeight, windowWidth: 794,
            onclone: function(clonedDoc) {
                var allEls = clonedDoc.querySelectorAll('*');
                allEls.forEach(function(el) {
                    var computed = clonedDoc.defaultView.getComputedStyle(el);
                    if (computed.backgroundColor && computed.backgroundColor !== 'rgba(0, 0, 0, 0)' && computed.backgroundColor !== 'transparent') { el.style.backgroundColor = computed.backgroundColor; }
                    if (computed.background && computed.background !== 'rgba(0, 0, 0, 0)') { el.style.background = computed.background; }
                    if (computed.color) { el.style.color = computed.color; }
                });
            }
        });

        // 3. 动态单页输出：根据内容实际高度设置 PDF 页面尺寸，全部放一页
        var a4WidthMM = 210; // A4 宽度 mm
        var canvasWidthPx = canvas.width;
        var canvasHeightPx = canvas.height;
        // 将 canvas 像素高度转换为 mm（保持与宽度同比例）
        var contentHeightMM = Math.ceil((canvasHeightPx * a4WidthMM) / canvasWidthPx);

        // 创建自定义页面尺寸的 PDF（宽度=A4，高度=内容实际高度）
        var pdf = new jspdf.jsPDF({
            orientation: 'p',
            unit: 'mm',
            format: [a4WidthMM, contentHeightMM]
        });

        // 整个 canvas 作为单页输出
        pdf.addImage(canvas.toDataURL('image/png'), 'PNG', 0, 0, a4WidthMM, contentHeightMM);
        pdf.save(filename);
        showToast('PDF 已导出', 'success');
    } catch (err) {
        console.error('PDF generation error:', err);
        showToast('PDF 导出失败，尝试打印方式...', 'error');
        var printWindow = window.open('', '_blank', 'width=900,height=700');
        if (printWindow) {
            printWindow.document.write(html);
            printWindow.document.close();
            printWindow.onload = function() { setTimeout(function() { printWindow.print(); }, 200); };
        }
    } finally {
        document.body.removeChild(iframe);
    }
}

async function generatePDF() {
    const studentId = document.getElementById('reportStudentSelect').value;
    if (!studentId) { showToast('请先选择学生', 'error'); return; }
    const student = students.find(s => s.id === studentId);
    if (!student) { showToast('请先选择学生', 'error'); return; }

    // 判断是否处于对比模式（compareSection 显示中 + 已选两次测试）
    const compareSection = document.getElementById('compareSection');
    const testId1 = document.getElementById('compareTest1')?.value;
    const testId2 = document.getElementById('compareTest2')?.value;
    const isCompareMode = compareSection && compareSection.style.display !== 'none' && testId1 && testId2;

    if (isCompareMode) {
        const test1 = student.tests.find(t => t.id === testId1);
        const test2 = student.tests.find(t => t.id === testId2);
        if (test1 && test2) {
            await renderComparePDF(student, test1, test2);
            return;
        }
    }

    // 单次报告路径
    const lastTest = getSelectedTest(studentId);
    if (!lastTest) { showToast('该学生暂无体测记录', 'error'); return; }

    // 计算优势/提升方向（确保不重复）
    const { strongItems, weakItems } = getStrengthWeakItems(lastTest);

    const totalScore = lastTest.totalScore || '-';
    const totalGrade = getGradeLabel(totalScore);

    // 构建成绩表格行
    const scoreRows = (function() {
        if (Object.keys(lastTest.items || {}).length === 0) {
            return '<tr><td colspan="4" style="text-align:center;color:#888;padding:20px 0">暂无体测成绩数据</td></tr>';
        }
        const rows = Object.entries(lastTest.items).map(([key, value]) => {
            // 身高、体重不参与评分
            if (key === 'height' || key === 'weight') {
                return { key, html: `<tr>
                    <td>${getItemName(key)}</td>
                    <td>${value}<span class="unit">${getItemUnit(key)}</span></td>
                    <td class="score">-</td>
                    <td><span class="badge" style="background:#f1f5f9;color:#64748b">参考</span></td>
                </tr>` };
            }
            const score = lastTest.itemScores?.[key] || '-';
            const grade = score === '-' ? '-' : getGradeLabel(score);
            const gradeColor = getGradeColor(score);
            // 时间类型项目的值已包含格式（如 3'25"），不需要再追加单位
            const unitSuffix = isTimeItem(key) ? '' : `<span class="unit">${getItemUnit(key)}</span>`;
            return { key, html: `<tr>
                <td>${getItemName(key)}</td>
                <td>${value}${unitSuffix}</td>
                <td class="score">${score}</td>
                <td><span class="badge" style="background:${gradeColor.bg};color:${gradeColor.text}">${grade}</span></td>
            </tr>` };
        });
        // 计算并插入 BMI 行（体重之后），BMI 参与评分
        if (lastTest.items.height && lastTest.items.weight) {
            const bmi = computeBMI(lastTest.items.height, lastTest.items.weight);
            const bmiStatus = getBMIStatus(bmi, parseInt(student.grade), student.gender);
            const bmiScore = getBMIScore(bmiStatus);
            const bmiGrade = bmiScore === null ? '-' : getGradeLabel(bmiScore);
            const bmiColor = bmiScore === null ? { bg: '#f1f5f9', text: '#64748b' } : getGradeColor(bmiScore);
            const weightIdx = rows.findIndex(r => r.key === 'weight');
            const insertIdx = weightIdx >= 0 ? weightIdx + 1 : rows.length;
            rows.splice(insertIdx, 0, {
                key: 'bmi',
                html: `<tr>
                    <td>BMI指数</td>
                    <td>${bmi}<span class="unit">kg/m²</span></td>
                    <td class="score">${bmiScore === null ? '-' : bmiScore}</td>
                    <td><span class="badge" style="background:${bmiColor.bg};color:${bmiColor.text}">${bmiGrade}</span></td>
                </tr>`
            });
        }
        return rows.map(r => r.html).join('');
    })();

    // 构建评分维度条
    const breakdown = buildScoreBreakdownHTML(lastTest);

    // 构建中考评分标准表格（如果选择了省份和城市）
    const examStandardsHTML = buildExamStandardsHTML(student);

    const html = `<!DOCTYPE html>
<html lang="zh-CN">
<head>
<meta charset="UTF-8">
<title>体质测试反馈表 — ${student.name}</title>
<style>
  @page { size: A4; margin: 0; }
  * { margin: 0; padding: 0; box-sizing: border-box; }
  html, body {
    font-family: "PingFang SC", "Microsoft YaHei", "Noto Sans SC", -apple-system, sans-serif;
    color: #1a1a1a; font-size: 11px; line-height: 1.5; background: #fff;
    padding: 10mm 14mm;
    -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; color-adjust: exact !important;
  }
  .page { max-width: 182mm; margin: 0 auto; }

  /* 品牌条 */
  .brand-bar {
    height: 3px; background: linear-gradient(90deg, #10b981 0%, #3b82f6 50%, #f59e0b 100%);
    margin-bottom: 8px; border-radius: 0 0 2px 2px;
    -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; color-adjust: exact !important;
  }

  /* 标题区 */
  .header { margin-bottom: 10px; display: flex; justify-content: space-between; align-items: baseline; }
  .header h1 { font-size: 18px; font-weight: 700; letter-spacing: -0.3px; color: #111; }
  .header .subtitle { font-size: 10px; color: #888; letter-spacing: 0.5px; }

  /* 信息网格 — 3列紧凑 */
  .info-grid {
    display: grid; grid-template-columns: repeat(3, 1fr); gap: 4px; margin-bottom: 10px;
  }
  .info-item {
    display: flex; justify-content: space-between; padding: 4px 8px;
    background: #f8f9fa; border-radius: 4px;
    -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; color-adjust: exact !important;
  }
  .info-item .label { color: #999; font-size: 10px; }
  .info-item .val { font-weight: 600; font-size: 11px; color: #111; }

  /* 章节标题 */
  .section-title {
    font-size: 12px; font-weight: 700; color: #111; margin-bottom: 6px; letter-spacing: -0.2px;
    padding-left: 8px; border-left: 3px solid #3b82f6;
    -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; color-adjust: exact !important;
  }

  /* 成绩表格 */
  .score-table { width: 100%; border-collapse: collapse; margin-bottom: 8px; }
  .score-table th {
    text-align: left; font-size: 9px; font-weight: 600; color: #888;
    letter-spacing: 0.5px; padding: 0 0 4px 0; border-bottom: 1.5px solid #e0e0e0;
  }
  .score-table td { padding: 3px 0; border-bottom: 1px solid #f2f2f2; font-size: 11px; }
  .score-table td.score { font-weight: 700; font-size: 12px; }
  .score-table .unit { font-size: 9px; color: #aaa; margin-left: 1px; }

  /* 徽标 */
  .badge {
    display: inline-block; padding: 2px 8px; border-radius: 4px; font-size: 9px; font-weight: 700;
    -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; color-adjust: exact !important;
  }

  /* 总分卡片 */
  .summary-cards { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; margin-bottom: 8px; }
  .summary-card {
    background: #f8f9fa; padding: 7px 14px; border-radius: 6px; text-align: center;
    -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; color-adjust: exact !important;
  }
  .summary-card .big-number { font-size: 22px; font-weight: 800; letter-spacing: -0.5px; line-height: 1.1; }
  .summary-card .big-label { font-size: 9px; color: #888; margin-top: 2px; letter-spacing: 0.3px; }

  /* 得分进度条 — 双列紧凑 */
  .bar-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 0 10px; }
  .bar-row { display: flex; align-items: center; padding: 2px 0; }
  .bar-label { width: 60px; font-size: 9px; flex-shrink: 0; color: #555; }
  .bar-track { flex: 1; height: 5px; background: #eee; border-radius: 2.5px; overflow: hidden; margin: 0 6px; -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; color-adjust: exact !important; }
  .bar-fill { height: 100%; border-radius: 2.5px; -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; color-adjust: exact !important; }
  .bar-score { font-size: 9px; font-weight: 700; width: 24px; text-align: right; flex-shrink: 0; }

  /* 优势/薄弱 */
  .strength-weak { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; margin-bottom: 8px; }
  .sw-card { padding: 6px 10px; border-radius: 6px; -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; color-adjust: exact !important; }
  .sw-card.sw-strong { background: #d1fae5; border: 1px solid #6ee7b7; }
  .sw-card.sw-weak { background: #fef3c7; border: 1px solid #fcd34d; }
  .sw-card h4 { font-size: 10px; font-weight: 700; margin-bottom: 3px; }
  .sw-card.sw-strong h4 { color: #059669; }
  .sw-card.sw-weak h4 { color: #d97706; }
  .sw-card p { font-size: 10px; color: #555; }

  /* 项目解读 */
  .interpretation { margin-bottom: 8px; }
  .interp-row {
    padding: 5px 8px; margin-bottom: 4px; border-radius: 5px; border-left: 3px solid #3b82f6;
    background: #f8fafc; line-height: 1.6;
    -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; color-adjust: exact !important;
  }
  .interp-row[data-level="excellent"] { border-left-color: #22c55e; background: #f0fdf4; }
  .interp-row[data-level="good"] { border-left-color: #3b82f6; background: #eff6ff; }
  .interp-row[data-level="pass"] { border-left-color: #f59e0b; background: #fffbeb; }
  .interp-row[data-level="needsWork"] { border-left-color: #ef4444; background: #fef2f2; }
  .interp-head { display: flex; align-items: baseline; gap: 6px; margin-bottom: 2px; }
  .interp-name { font-size: 11px; font-weight: 700; color: #111; }
  .interp-val { font-size: 10px; color: #666; }
  .interp-score { font-size: 11px; font-weight: 700; margin-left: auto; }
  .interp-purpose { font-size: 9px; color: #6b7280; margin-bottom: 2px; }
  .interp-analysis { font-size: 10px; color: #374151; }

  /* 测试总结 */
  .test-summary {
    margin-bottom: 8px; padding: 8px 12px; border-radius: 6px;
    background: #f0f7ff; border: 1px solid #bfdbfe;
    font-size: 10px; line-height: 1.7; color: #1e3a5f;
    -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; color-adjust: exact !important;
  }
  .test-summary .summary-label { font-weight: 700; color: #1e40af; margin-right: 4px; }

  /* 建议区 */
  .suggestions { margin-bottom: 8px; }
  .sug-item {
    padding: 4px 8px; background: #eff6ff; border-radius: 4px; margin-bottom: 2px;
    font-size: 10px; border-left: 3px solid #3b82f6; line-height: 1.5;
    -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; color-adjust: exact !important;
  }
  .sug-item .tag { font-weight: 700; margin-right: 4px; font-size: 10px; }

  /* 页脚 */
  .footer {
    margin-top: 8px; padding-top: 6px; border-top: 1px solid #e8e8e8;
    display: flex; justify-content: space-between; font-size: 9px; color: #aaa;
  }
  .footer .coach-line { border-top: 1px solid #ccc; width: 80px; display: inline-block; margin: 0 4px; }
  .footer-note { margin-top: 4px; font-size: 9px; color: #888; line-height: 1.5; }

  @media print {
    html, body, * { -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; color-adjust: exact !important; }
  }
</style>
</head>
<body>
<div class="page">
  <div class="brand-bar"></div>

  <div class="header">
    <h1>体质测试反馈表</h1>
    <div class="subtitle">${getGradeText(student.grade)} &middot; ${lastTest.date || '-'}</div>
  </div>

  <div class="info-grid">
    <div class="info-item"><span class="label">姓名</span><span class="val">${student.name}</span></div>
    <div class="info-item"><span class="label">性别</span><span class="val">${student.gender}</span></div>
    <div class="info-item"><span class="label">年级</span><span class="val">${getGradeText(student.grade)}</span></div>
  </div>

  <div class="section-title">体测成绩</div>
  <table class="score-table">
    <thead><tr><th>项目</th><th>成绩</th><th>得分</th><th>等级</th></tr></thead>
    <tbody>${scoreRows}</tbody>
  </table>

  <div class="summary-cards">
    <div class="summary-card">
      <div class="big-number" style="color:${getGradeColor(totalScore).text}">${totalScore}</div>
      <div class="big-label">学年总分</div>
    </div>
    <div class="summary-card">
      <div class="big-number" style="color:${getGradeColor(totalScore).text}">${totalGrade}</div>
      <div class="big-label">综合评定</div>
    </div>
  </div>

  <div class="breakdown">
    <div class="section-title">各项目得分</div>
    ${breakdown}
  </div>

  <div class="strength-weak">
    <div class="sw-card sw-strong">
      <h4>&#x25B2; 优势项目</h4>
      <p>${strongItems.length ? strongItems.join(' &middot; ') : '暂无数据'}</p>
    </div>
    <div class="sw-card sw-weak">
      <h4>&#x25BC; 提升方向</h4>
      <p>${weakItems.length ? weakItems.join(' &middot; ') : '暂无数据'}</p>
    </div>
  </div>

  <div class="interpretation">
    <div class="section-title">项目解读</div>
    ${generateItemInterpretations(lastTest, student)}
  </div>

  <div class="suggestions">
    <div class="section-title">训练建议</div>
    ${generateSuggestions(lastTest, student.grade)}
  </div>

  <div class="test-summary">
    <span class="summary-label">测试总结</span>${generateTestSummary(lastTest, student)}
  </div>

  <div class="footer">
    <span>上门体育 · 体质测试报告</span>
    <span>教练签字: <span class="coach-line"></span></span>
  </div>
  <div class="footer-note">
    <p>* 身高体重为参考指标不参与评分 | 评分依据：《国家学生体质健康标准（2014年修订）》</p>
  </div>
</div>
<script>window.onload=function(){setTimeout(function(){window.print();},200);};</script>
</body>
</html>`;

    await exportPDFFromHTML(html, `体质测试报告_${student.name}_${lastTest.date || ''}.pdf`);
}

// ==================== 报告页省份/城市选择器 ====================
function onReportProvinceChange() {
    const province = document.getElementById('reportProvinceSelect').value;
    const citySelect = document.getElementById('reportCitySelect');
    if (province) {
        const provInfo = TRAINING_DB.nationalProvinces[province];
        if (provInfo) {
            citySelect.innerHTML = '<option value="">-- 选择城市 --</option>' +
                provInfo.cities.map(c => `<option value="${c}">${c}</option>`).join('');
        }
        loadZhongkaoData(province);
    } else {
        citySelect.innerHTML = '<option value="">-- 选择城市 --</option>';
    }
}

function onReportCityChange() {
    // 选择城市后无需做其他操作，导出 PDF 时读取
}

// 初始化报告页省份选择器（填充省份选项）
function initReportProvinceSelector() {
    const provSelect = document.getElementById('reportProvinceSelect');
    if (!provSelect || provSelect.options.length > 1) return;
    const provinces = Object.keys(TRAINING_DB.nationalProvinces);
    const ordered = ['四川'].concat(provinces.filter(p => p !== '四川'));
    provSelect.innerHTML = '<option value="">-- 选择省份 --</option>' +
        ordered.map(p => `<option value="${p}">${p}</option>`).join('');
}

// ==================== 上传页省份/城市选择器 ====================
// 上传页省份选择器初始化（填充省份选项）
function initUploadProvinceSelector() {
    const provSelect = document.getElementById('uploadProvinceSelect');
    if (!provSelect || provSelect.options.length > 1) return;
    // 安全检查：TRAINING_DB 可能在数据文件加载前被调用
    if (typeof TRAINING_DB === 'undefined' || !TRAINING_DB.nationalProvinces) return;
    const provinces = Object.keys(TRAINING_DB.nationalProvinces);
    const ordered = ['四川'].concat(provinces.filter(p => p !== '四川'));
    provSelect.innerHTML = '<option value="">-- 选择省份 --</option>' +
        ordered.map(p => `<option value="${p}">${p}</option>`).join('');
}

// 上传页省份变化时，填充城市列表
function onUploadProvinceChange() {
    const province = document.getElementById('uploadProvinceSelect').value;
    const citySelect = document.getElementById('uploadCitySelect');
    if (!citySelect) return;
    if (province) {
        const provInfo = TRAINING_DB.nationalProvinces[province];
        if (provInfo) {
            citySelect.innerHTML = '<option value="">-- 选择城市 --</option>' +
                provInfo.cities.map(c => `<option value="${c}">${c}</option>`).join('');
        }
    } else {
        citySelect.innerHTML = '<option value="">-- 选择城市 --</option>';
    }
}

// 上传页城市变化时，显示该地区中考信息
function onUploadCityChange() {
    const province = document.getElementById('uploadProvinceSelect').value;
    const city = document.getElementById('uploadCitySelect').value;
    const infoDiv = document.getElementById('uploadExamInfo');
    if (!infoDiv) return;
    if (!province || !city) {
        infoDiv.innerHTML = '';
        return;
    }
    // 异步加载并显示该地区中考体育信息
    loadZhongkaoData(province).then(data => {
        if (!data || !data.cities || !data.cities[city]) {
            infoDiv.innerHTML = `<div style="font-size:12px;color:var(--text-light);padding:6px 0;">暂无${province}${city}的详细中考体育标准</div>`;
            return;
        }
        const cityData = data.cities[city];
        const commonProjects = data.commonProjects || {};
        let projectNames = [];
        if (cityData.projects) {
            cityData.projects.forEach(p => {
                if (p.items) projectNames.push(...p.items.map(id => commonProjects[id]?.name || id));
                if (p.items_male) projectNames.push(...p.items_male.map(id => commonProjects[id]?.name || id));
                if (p.items_female) projectNames.push(...p.items_female.map(id => commonProjects[id]?.name || id));
            });
        }
        infoDiv.innerHTML = `<div style="font-size:12px;color:var(--text-secondary);padding:6px 10px;background:var(--bg-secondary);border-radius:6px;">
            📋 ${province} · ${city}中考体育（总分${cityData.totalScore || ''}分）${projectNames.length ? ' · 含：' + [...new Set(projectNames)].join('、') : ''}
        </div>`;
    });
}

// 构建中考评分标准 HTML（用于 PDF 报告）
function buildExamStandardsHTML(student) {
    const province = document.getElementById('reportProvinceSelect')?.value || currentExamProvince || '';
    const city = document.getElementById('reportCitySelect')?.value || currentExamCity || '';
    if (!province || !city) return '';
    const data = zhongkaoDataCache[province];
    if (!data || !data.cities || !data.cities[city]) return '';
    const cityData = data.cities[city];
    const commonProjects = data.commonProjects || {};
    const isMale = student.gender !== '女';
    const fullScore = isMale ? (cityData.fullScore_male || {}) : (cityData.fullScore_female || {});
    const passScore = isMale ? (cityData.passScore_male || {}) : (cityData.passScore_female || {});
    const allKeys = [...new Set([...Object.keys(fullScore), ...Object.keys(passScore)])];
    if (allKeys.length === 0) return '';
    const genderLabel = isMale ? '男' : '女';
    let rows = allKeys.map(key => {
        const name = commonProjects[key]?.name || key;
        const fs = fullScore[key] || '—';
        const ps = passScore[key] || '—';
        return `<tr><td>${name}</td><td class="es-full">${fs}</td><td class="es-pass">${ps}</td></tr>`;
    }).join('');
    return `<div class="exam-standards-box">
        <h4>🎯 ${province} · ${city}中考体育评分标准（${genderLabel}生）</h4>
        <div class="es-sub">总分${cityData.totalScore}分 · ${cityData.structure || ''}</div>
        <table class="es-table">
            <thead><tr><th>项目</th><th>满分标准</th><th>及格标准</th></tr></thead>
            <tbody>${rows}</tbody>
        </table>
    </div>`;
}

// ==================== 对比报告 PDF 渲染 ====================
async function renderComparePDF(student, test1, test2) {
    const items1 = test1.items || {};
    const items2 = test2.items || {};
    const scores1 = test1.itemScores || {};
    const scores2 = test2.itemScores || {};

    const allKeys = new Set([...Object.keys(items1), ...Object.keys(items2)]);
    const priorityKeys = ['height', 'weight'];
    const orderedKeys = [
        ...priorityKeys.filter(k => allKeys.has(k)),
        ...[...allKeys].filter(k => !priorityKeys.includes(k))
    ];

    // 构建对比表行
    const tableRows = orderedKeys.map(key => {
        const name = getItemName(key);
        const unit = getItemUnit(key);
        const isTime = isTimeItem(key);
        // 时间类型项目的值已包含格式（如 3'25"），不需要再追加单位
        const value1 = items1[key] !== undefined ? (isTime ? `${items1[key]}` : `${items1[key]}${unit}`) : '-';
        const value2 = items2[key] !== undefined ? (isTime ? `${items2[key]}` : `${items2[key]}${unit}`) : '-';
        const isHW = key === 'height' || key === 'weight';
        const score1 = isHW ? '-' : (scores1[key] || '-');
        const score2 = isHW ? '-' : (scores2[key] || '-');

        let arrow = '-', change = '-', changeColor = '#888';
        if (isHW) {
            if (items1[key] !== undefined && items2[key] !== undefined) {
                const diff = Math.round((Number(items2[key]) - Number(items1[key])) * 10) / 10;
                if (diff > 0) { arrow = '↑'; change = `+${diff}${unit}`; changeColor = '#3b82f6'; }
                else if (diff < 0) { arrow = '↓'; change = `${diff}${unit}`; changeColor = '#3b82f6'; }
                else { arrow = '→'; change = '0'; changeColor = '#94a3b8'; }
            }
        } else {
            if (scores1[key] !== undefined && scores2[key] !== undefined) {
                const diff = scores2[key] - scores1[key];
                if (diff > 0) { arrow = '↑'; change = `+${diff}`; changeColor = '#16a34a'; }
                else if (diff < 0) { arrow = '↓'; change = `${diff}`; changeColor = '#ef4444'; }
                else { arrow = '→'; change = '0'; changeColor = '#94a3b8'; }
            }
        }

        return `<tr>
            <td>${name}${isHW ? ' <span style="font-size:9px;color:#94a3b8;">(参考)</span>' : ''}</td>
            <td>${value1}</td>
            <td>${score1}</td>
            <td>${value2}</td>
            <td>${score2}</td>
            <td style="color:${changeColor};font-weight:700;">${arrow} ${change}</td>
        </tr>`;
    }).join('');

    // BMI 对比行
    let bmiRow = '';
    if (items1.height && items1.weight && items2.height && items2.weight) {
        const bmi1 = computeBMI(items1.height, items1.weight);
        const bmi2 = computeBMI(items2.height, items2.weight);
        const s1 = getBMIStatus(bmi1, parseInt(student.grade), student.gender);
        const s2 = getBMIStatus(bmi2, parseInt(student.grade), student.gender);
        const bmiDiff = Math.round((bmi2 - bmi1) * 10) / 10;
        const arrow = bmi2 > bmi1 ? '↑' : bmi2 < bmi1 ? '↓' : '→';
        const color = bmiDiff > 0 ? '#ef4444' : bmiDiff < 0 ? '#16a34a' : '#94a3b8';
        bmiRow = `<tr>
            <td>BMI指数 <span style="font-size:9px;color:#94a3b8;">(参考)</span></td>
            <td>${bmi1} kg/m²</td>
            <td>${s1.label}</td>
            <td>${bmi2} kg/m²</td>
            <td>${s2.label}</td>
            <td style="color:${color};font-weight:700;">${arrow} ${bmiDiff > 0 ? '+' : ''}${bmiDiff}</td>
        </tr>`;
    }

    // 总分变化
    const totalDiff = (test2.totalScore || 0) - (test1.totalScore || 0);
    const totalArrow = totalDiff > 0 ? '↑' : totalDiff < 0 ? '↓' : '→';
    const totalColor = totalDiff > 0 ? '#16a34a' : totalDiff < 0 ? '#ef4444' : '#94a3b8';
    const totalChange = totalDiff > 0 ? `+${totalDiff}` : `${totalDiff}`;

    // 提升分析
    const improvementHTML = generateImprovementAnalysis(test1, test2, student);

    const html = `<!DOCTYPE html>
<html lang="zh-CN">
<head>
<meta charset="UTF-8">
<title>体测对比报告 — ${student.name}</title>
<style>
  @page { size: A4; margin: 12mm 14mm; }
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body {
    font-family: "PingFang SC", "Microsoft YaHei", "Noto Sans SC", -apple-system, sans-serif;
    color: #1a1a1a; font-size: 11px; line-height: 1.5; background: #fff;
    -webkit-print-color-adjust: exact; print-color-adjust: exact;
  }
  .page { max-width: 182mm; margin: 0 auto; }
  .brand-bar {
    height: 3px; background: linear-gradient(90deg, #10b981 0%, #3b82f6 50%, #f59e0b 100%);
    margin-bottom: 8px; border-radius: 0 0 2px 2px;
  }
  .header { margin-bottom: 10px; display: flex; justify-content: space-between; align-items: baseline; }
  .header h1 { font-size: 18px; font-weight: 700; letter-spacing: -0.3px; color: #111; }
  .header .subtitle { font-size: 10px; color: #888; letter-spacing: 0.5px; }

  .info-grid {
    display: grid; grid-template-columns: repeat(3, 1fr); gap: 4px; margin-bottom: 10px;
  }
  .info-item {
    display: flex; justify-content: space-between; padding: 4px 8px;
    background: #f8f9fa; border-radius: 4px;
  }
  .info-item .label { color: #999; font-size: 10px; }
  .info-item .val { font-weight: 600; font-size: 11px; color: #111; }

  .section-title {
    font-size: 12px; font-weight: 700; color: #111; margin-bottom: 6px; letter-spacing: -0.2px;
    padding-left: 8px; border-left: 3px solid #3b82f6;
  }

  .summary-cards { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 8px; margin-bottom: 14px; }
  .summary-card {
    background: #f8f9fa; padding: 10px 14px; border-radius: 6px; text-align: center;
    -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important;
  }
  .summary-card .big-number { font-size: 22px; font-weight: 800; letter-spacing: -0.5px; line-height: 1.1; }
  .summary-card .big-label { font-size: 9px; color: #888; margin-top: 2px; letter-spacing: 0.3px; }

  .compare-table { width: 100%; border-collapse: collapse; margin-bottom: 12px; }
  .compare-table th {
    text-align: left; font-size: 9px; font-weight: 600; color: #888;
    letter-spacing: 0.5px; padding: 0 0 4px 0; border-bottom: 1.5px solid #e0e0e0;
  }
  .compare-table td { padding: 4px 0; border-bottom: 1px solid #f2f2f2; font-size: 11px; }
  .compare-table th.col-mid, .compare-table td.col-mid {
    text-align: center; border-left: 1px dashed #e5e7eb; border-right: 1px dashed #e5e7eb;
  }

  .analysis-block { margin-top: 8px; }
  .analysis-row { display: flex; gap: 12px; flex-wrap: wrap; }
  .analysis-card {
    flex: 1; min-width: 0; padding: 8px 10px; border-radius: 6px; font-size: 10px;
    -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important;
  }
  .analysis-card h5 { font-size: 11px; font-weight: 700; margin-bottom: 4px; }
  .analysis-card p { color: #555; line-height: 1.6; }
  .ac-up { background: #d1fae5; border: 1px solid #6ee7b7; }
  .ac-up h5 { color: #059669; }
  .ac-down { background: #fee2e2; border: 1px solid #fca5a5; }
  .ac-down h5 { color: #dc2626; }
  .ac-body { background: #dbeafe; border: 1px solid #93c5fd; flex-basis: 100%; }
  .ac-body h5 { color: #2563eb; }

  .footer {
    margin-top: 12px; padding-top: 6px; border-top: 1px solid #e8e8e8;
    display: flex; justify-content: space-between; font-size: 9px; color: #aaa;
  }
  .footer .coach-line { border-top: 1px solid #ccc; width: 80px; display: inline-block; margin: 0 4px; }
  .footer-note { margin-top: 4px; font-size: 9px; color: #888; line-height: 1.5; }
  @media print {
    * { -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
    body { -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
  }
</style>
</head>
<body>
<div class="page">
  <div class="brand-bar"></div>

  <div class="header">
    <h1>体测数据对比报告</h1>
    <div class="subtitle">${getGradeText(student.grade)} &middot; ${test1.date} → ${test2.date}</div>
  </div>

  <div class="info-grid">
    <div class="info-item"><span class="label">姓名</span><span class="val">${student.name}</span></div>
    <div class="info-item"><span class="label">性别</span><span class="val">${student.gender}</span></div>
    <div class="info-item"><span class="label">年级</span><span class="val">${getGradeText(student.grade)}</span></div>
  </div>

  <div class="summary-cards">
    <div class="summary-card">
      <div class="big-number" style="color:${getGradeColor(test1.totalScore).text}">${test1.totalScore || '-'}</div>
      <div class="big-label">${test1.date} 总分</div>
    </div>
    <div class="summary-card">
      <div class="big-number" style="color:${getGradeColor(test2.totalScore).text}">${test2.totalScore || '-'}</div>
      <div class="big-label">${test2.date} 总分</div>
    </div>
    <div class="summary-card">
      <div class="big-number" style="color:${totalColor}">${totalArrow} ${totalChange}</div>
      <div class="big-label">总分变化</div>
    </div>
  </div>

  <div class="section-title">详细对比</div>
  <table class="compare-table">
    <thead>
      <tr>
        <th style="width:24%;">项目</th>
        <th style="width:18%;">${test1.date}<br><span style="font-size:8px;color:#aaa;">成绩(得分)</span></th>
        <th style="width:18%;" class="col-mid">${test2.date}<br><span style="font-size:8px;color:#aaa;">成绩(得分)</span></th>
        <th style="width:18%;">变化</th>
        <th style="width:22%;">分析</th>
      </tr>
    </thead>
    <tbody>${tableRows}${bmiRow}</tbody>
  </table>

  <div class="section-title">提升分析</div>
  <div class="analysis-block">
    ${improvementHTML
      .replace('grid-template-columns:1fr 1fr;gap:12px;', '')
      .replace(/^<div[^>]*>/, '<div class="analysis-row">')
      .replace(/<h5 style="color:#22c55e;">/g, '<h5>')
      .replace(/<h5 style="color:#ef4444;">/g, '<h5>')
      .replace(/<h5 style="color:#3b82f6;">/g, '<h5>')
      .replace(/<p>两次测试成绩相同，无变化。<\/p>/, '<div class="analysis-card ac-up"><p>两次测试成绩相同，无变化。</p></div>')
    }
  </div>

  <div class="footer">
    <span>上门体育 · 体测对比报告</span>
    <span>教练签字: <span class="coach-line"></span></span>
  </div>
  <div class="footer-note">
    <p>* 身高体重为参考指标不参与评分 | 评分依据：《国家学生体质健康标准（2014年修订）》</p>
  </div>
</div>
<script>window.onload=function(){setTimeout(function(){window.print();},200);};</script>
</body>
</html>`;

    await exportPDFFromHTML(html, `体测对比报告_${student.name}.pdf`);
}

// 获取等级对应的颜色（用于报告文字配色）— 使用高饱和度确保打印可见
function getGradeColor(score) {
    if (score >= 90) return { bg: '#d1fae5', text: '#059669', bar: '#10b981' };       // 非常棒 - 绿
    if (score >= 80) return { bg: '#dbeafe', text: '#2563eb', bar: '#3b82f6' };       // 还不错 - 蓝
    if (score >= 60) return { bg: '#fef3c7', text: '#d97706', bar: '#f59e0b' };       // 刚达标 - 琥珀
    if (typeof score === 'number') return { bg: '#fee2e2', text: '#dc2626', bar: '#ef4444' }; // 待提升 - 红
    return { bg: '#f1f5f9', text: '#64748b', bar: '#94a3b8' };                        // 无数据
}

// 构建得分维度进度条
function buildScoreBreakdownHTML(lastTest) {
    if (!lastTest.itemScores) return '';
    const entries = Object.entries(lastTest.itemScores).filter(([,s]) => s > 0);
    if (entries.length === 0) return '';
    const rows = entries.map(([key, score]) => {
        const pct = Math.min(100, score);
        const gc = getGradeColor(score);
        return `<div class="bar-row">
            <span class="bar-label">${getItemName(key)}</span>
            <div class="bar-track"><div class="bar-fill" style="width:${pct}%;background:${gc.bar || gc.text}"></div></div>
            <span class="bar-score" style="color:${gc.text}">${score}</span>
        </div>`;
    }).join('');
    return `<div class="bar-grid">${rows}</div>`;
}

// ==================== 素质-知识映射 ====================
const ITEM_QUALITY_MAP = {
    'run_50m': { quality: '速度素质', sub: '爆发力' },
    'sit_and_reach': { quality: '柔韧性' },
    'jump_rope_1min': { quality: '协调性', sub: '心肺耐力' },
    'sit_up_1min': { quality: '核心力量', sub: '肌肉耐力' },
    'pull_up': { quality: '上肢力量', sub: '核心力量' },
    'run_50m_8': { quality: '速度耐力' },
    'run_800m': { quality: '心肺耐力' },
    'run_1000m': { quality: '心肺耐力' },
    'standing_long_jump': { quality: '下肢爆发力' },
    'balance_stand': { quality: '平衡能力', sub: '本体感觉' },
    't_test': { quality: '灵敏素质', sub: '协调性' }
};

const QUALITY_TIPS = {
    '速度素质': {
        primary: '6-12岁是速度素质发展的敏感期，神经系统可塑性最强。此阶段以游戏化、趣味性的短距离跑为主，避免枯燥重复，让孩子在快乐中发展爆发力。',
        middle: '青春期是速度素质发展的第二个高峰期，神经肌肉协调性快速提升。可加入反应速度训练，如听信号起跑、变向跑、追逐游戏等。',
        high: '接近成人水平，速度素质提升空间相对有限。重点在于技术优化和爆发力结合，通过专项训练维持和提升起跑与冲刺能力。'
    },
    '爆发力': {
        primary: '儿童骨骼尚未完全钙化，应避免大负荷负重训练。以自重跳跃、跳绳等游戏化方式发展下肢爆发力，重点在于建立正确的动作模式。',
        middle: '青春期生长激素分泌旺盛，是爆发力发展的黄金窗口期。可逐步引入轻负荷抗阻训练，如壶铃摆荡、药球抛掷、跳箱等。',
        high: '肌肉力量和体积接近成人，可进行系统化的爆发力周期训练。注意动作质量控制，避免过度训练导致关节损伤。'
    },
    '柔韧性': {
        primary: '儿童关节灵活性天然较好，但若不主动维持会随年龄增长而下降。每天10分钟动态拉伸即可，重点在于培养运动前后拉伸的习惯。',
        middle: '青春期生长突增期，肌肉和骨骼生长速度不匹配，易出现柔韧性暂时下降。需增加拉伸频率和时长，配合瑜伽或普拉提练习。',
        high: '身体发育趋于成熟，柔韧性维持为主。训练前后充分拉伸，静态拉伸每次保持15-30秒，动态拉伸作为热身标配。'
    },
    '核心力量': {
        primary: '核心是身体稳定的枢纽，对儿童运动表现和姿态矫正至关重要。以平板支撑、仰卧起坐等自重训练为主，注意动作规范而非追求时长。',
        middle: '青春期是核心力量发展的关键期，可逐步增加训练强度。引入不稳定面训练（如瑜伽球、平衡垫）提升深层核心肌群激活。',
        high: '核心训练应结合专项需求，发展抗旋转和抗伸展能力。可加入悬垂举腿、土耳其起立等功能性动作，构建运动链传导效率。'
    },
    '肌肉耐力': {
        primary: '儿童肌肉耐力有限，训练以短时、多次、轻负荷为原则。通过游戏形式（如蹲跳接力、动物爬行）培养基础耐力，避免力竭训练。',
        middle: '肌肉耐力显著提升期，可进行中长时间的连续训练。注意训练与休息的比例（建议1:1或1:2），避免过度疲劳影响发育。',
        high: '可进行系统化的肌肉耐力周期训练。结合有氧和无氧耐力训练，提升乳酸耐受能力，为专项运动打下体能基础。'
    },
    '心肺耐力': {
        primary: '儿童心肺功能仍在发育中，有氧运动以中低强度、趣味性为主。如追逐游戏、跳绳、游泳等，避免长时间高强度持续跑。',
        middle: '心肺耐力发展的敏感期，最大摄氧量（VO₂max）可通过科学训练显著提升。可采用间歇跑、法特莱克跑等多样化方法。',
        high: '接近成人水平，可进行系统化的耐力周期训练。结合心率监控（建议靶心率在最大心率的65%-80%），科学安排训练负荷和恢复。'
    },
    '平衡能力': {
        primary: '儿童平衡能力处于快速发展期，前庭系统可塑性强。通过单脚站立、走平衡木、模仿小动物等游戏化方式训练，从睁眼到闭眼循序渐进。',
        middle: '青春期身高快速增长，重心变化大，平衡能力可能出现暂时性下降。需加强本体感觉训练，配合核心稳定性练习重建平衡控制。',
        high: '身体形态趋于稳定，平衡能力训练应与专项需求结合。如球类运动中的变向稳定性、跳跃落地缓冲、对抗中的重心控制等。'
    },
    '本体感觉': {
        primary: '本体感觉是运动技能学习的基础，儿童期发展迅速。闭眼单脚站立是最简单的测试和训练方式，可从睁眼到闭眼、硬地到软垫循序渐进。',
        middle: '青春期身体快速变化，本体感觉需要重新校准。加入不稳定面训练（如平衡垫、波速球）和动态平衡练习，重建神经肌肉控制。',
        high: '本体感觉训练应与运动损伤预防结合。在疲劳状态下进行平衡训练，模拟比赛末段的身体控制能力，降低踝关节和膝关节损伤风险。'
    },
    '协调性': {
        primary: '儿童期是协调性发展的关键窗口期，多样化运动体验是最佳途径。跳绳、球类、舞蹈、体操等均有助于全面发展协调性，避免过早专项化。',
        middle: '青春期神经肌肉系统快速成熟，协调性可大幅提升。可加入复杂动作组合训练，如手脚配合的敏捷梯、多方向移动和反应球训练。',
        high: '协调性趋于稳定，重点在于专项技术的精细化。通过录像分析和反复练习优化动作效率，减少多余动作带来的能量损耗。'
    },
    '上肢力量': {
        primary: '儿童上肢力量发展明显慢于下肢，不宜过早进行专项力量训练。以悬垂、攀爬、俯卧撑（可屈膝）等自重活动培养基础力量，注重兴趣引导。',
        middle: '青春期是上肢力量发展的加速期，男生尤为明显。可引入标准引体向上、俯卧撑、哑铃划船等训练，采用渐进式负荷原则。',
        high: '接近成人水平，可进行系统化的上肢力量训练。注意左右对称发展和肩袖肌群的保护，预防过度使用导致的肩峰撞击等问题。'
    },
    '下肢爆发力': {
        primary: '儿童下肢爆发力发展迅速，以跳跃类游戏为主。注意落地缓冲技术的教授（屈膝屈髋、前脚掌着地），预防膝关节和踝关节损伤。',
        middle: '青春期是下肢爆发力发展的黄金期，深蹲跳、箱式跳等训练效果显著。注意动作质量和渐进负荷，避免膝盖内扣等错误姿态。',
        high: '可进行高强度爆发力训练，结合负重和速度。如高翻、跳深等高级训练方法，但需在专业教练指导下进行，确保技术安全。'
    },
    '速度耐力': {
        primary: '小学高年级开始出现速度耐力测试要求。以短间歇跑为主（如50米×4组），注意控制总训练量，避免过早进行大强度乳酸耐受训练。',
        middle: '速度耐力是初中体能测试的重要指标。可采用200-400米间歇跑，逐步提升乳酸耐受能力和快速恢复能力，组间休息逐渐缩短。',
        high: '速度耐力训练应与专项需求结合。如足球运动员的多组冲刺、篮球运动员的折返跑、田径运动员的专项节奏跑等。'
    },
    '灵敏素质': {
        primary: '7-12岁是灵敏素质发展的敏感期，神经系统可塑性最强。通过T型跑、绕标志物、听信号变向等游戏化方式训练，重点培养快速反应和方向变换能力。',
        middle: '青春期灵敏素质仍有较大提升空间，可结合复杂的多方向移动训练，如敏捷梯、Z字跑、镜像追逐等，提升神经肌肉协调和反应速度。',
        high: '灵敏素质趋于稳定，重点在于专项场景的应用。如篮球的防守滑步、足球的变向突破、羽毛球的启动步等，通过模拟实战场景优化灵敏表现。'
    }
};

// 根据年级返回年龄段 key
function getAgeGroup(grade) {
    const g = parseInt(grade);
    if (g <= 6) return 'primary';
    if (g <= 9) return 'middle';
    return 'high';
}

// 素质方向 → 精简训练建议（单行）
const QUALITY_SHORT_TIPS = {
    '速度素质': '短距冲刺+反应起跑训练，提升步频与爆发力',
    '爆发力': '跳跃与药球抛掷，发展快速发力能力',
    '柔韧性': '每日动态拉伸10分钟，运动前后重点牵拉',
    '核心力量': '平板支撑+卷腹，注重动作质量而非时长',
    '肌肉耐力': '中多次数自重训练，提升持续抗疲劳能力',
    '心肺耐力': '间歇跑+跳绳，循序渐进提升有氧能力',
    '平衡能力': '单脚站立+平衡垫，强化本体感觉',
    '本体感觉': '闭眼单脚站立+不稳定面训练',
    '协调性': '跳绳+敏捷梯，提升手脚配合节奏感',
    '上肢力量': '引体向上+俯卧撑，逐步增加负荷',
    '下肢爆发力': '跳箱+立定跳远，注重落地缓冲技术',
    '速度耐力': '200-400米间歇跑，控制组间休息',
    '灵敏素质': 'T字跑+变向追逐，提升快速变向能力'
};

// ==================== 优势/提升方向计算（确保不重复）====================
function getStrengthWeakItems(lastTest) {
    const scoredItems = Object.entries(lastTest.itemScores || {}).filter(([,s]) => s > 0);
    scoredItems.sort((a, b) => b[1] - a[1]); // 降序：分数高的在前

    const n = scoredItems.length;
    let strongCount, weakCount;
    if (n <= 1) {
        strongCount = n; weakCount = 0;
    } else if (n <= 4) {
        strongCount = Math.ceil(n / 2);
        weakCount = n - strongCount;
    } else {
        strongCount = 3;
        weakCount = Math.min(3, n - strongCount);
    }
    const strongItems = scoredItems.slice(0, strongCount).map(([k]) => getItemName(k));
    const weakItems = scoredItems.slice(strongCount, strongCount + weakCount).reverse().map(([k]) => getItemName(k));
    return { strongItems, weakItems };
}

// ==================== 测试项目解读数据 ====================
const ITEM_INTERPRETATIONS = {
    'vital_capacity': {
        purpose: '反映肺部最大通气能力，是评估呼吸系统功能和心肺耐力基础的重要指标',
        levels: {
            excellent: '肺活量表现优异，说明呼吸系统发育良好，心肺功能基础扎实，建议保持规律的有氧运动习惯',
            good: '肺活量处于较好水平，呼吸系统功能有一定基础，通过持续的有氧训练仍有提升空间',
            pass: '肺活量达到基本标准，呼吸系统功能基本正常，建议适当增加有氧运动来进一步提升肺通气能力',
            needsWork: '肺活量有较大提升空间，可能与呼吸肌力量不足或平时有氧运动较少有关，建议增加有氧运动和深呼吸训练'
        }
    },
    'run_50m': {
        purpose: '测试速度素质和下肢爆发力，反映神经肌肉的快速反应和短距离加速能力',
        levels: {
            excellent: '50米跑成绩优异，速度素质和下肢爆发力表现突出，起跑反应和步频协调性良好',
            good: '50米跑成绩较好，速度素质有一定基础，起跑反应和步频仍有进一步提升的空间',
            pass: '50米跑达到基本标准，速度素质基本正常，建议通过短距离冲刺和反应训练来提升爆发力和步频',
            needsWork: '50米跑成绩有提升空间，可能与下肢爆发力、步频或起跑反应有关，建议加强短距离冲刺、反应训练和下肢力量练习'
        }
    },
    'sit_and_reach': {
        purpose: '测试躯干和下肢的柔韧性，反映关节活动度和肌肉韧带的伸展能力',
        levels: {
            excellent: '坐位体前屈成绩优异，身体柔韧性良好，关节活动度充足，运动损伤风险较低',
            good: '坐位体前屈成绩较好，柔韧性有一定基础，建议保持规律拉伸以维持和提升当前水平',
            pass: '坐位体前屈达到基本标准，柔韧性基本正常，建议增加日常拉伸练习以进一步改善关节活动度',
            needsWork: '坐位体前屈有提升空间，柔韧性偏弱可能与平时拉伸不足或运动后放松不够有关，建议每天进行动态和静态拉伸练习'
        }
    },
    'jump_rope_1min': {
        purpose: '测试协调性和心肺耐力，反映手脚配合能力和持续性运动表现',
        levels: {
            excellent: '跳绳成绩优异，协调性和心肺耐力表现突出，手脚配合节奏感强，体能充沛',
            good: '跳绳成绩较好，协调性和耐力有一定基础，建议通过变化跳法（如双摇、交叉跳）进一步提升',
            pass: '跳绳达到基本标准，协调性基本正常，建议通过每日跳绳练习提升手脚配合和持续运动能力',
            needsWork: '跳绳成绩有提升空间，可能与手脚协调性、腕力或耐力有关，建议从慢速开始练习跳绳节奏，循序渐进提升速度和持续时间'
        }
    },
    'sit_up_1min': {
        purpose: '测试核心肌群的力量和耐力，反映腹部肌肉的持续收缩能力',
        levels: {
            excellent: '仰卧起坐成绩优异，核心力量和耐力表现突出，腹部肌肉持续收缩能力强',
            good: '仰卧起坐成绩较好，核心力量有一定基础，建议通过增加训练难度（如负重卷腹）进一步提升',
            pass: '仰卧起坐达到基本标准，核心力量基本正常，建议通过平板支撑和卷腹练习来强化核心稳定性',
            needsWork: '仰卧起坐成绩有提升空间，核心力量可能需要加强，建议从基础核心训练（如平板支撑、死虫式）开始，逐步提升腹部力量和耐力'
        }
    },
    'pull_up': {
        purpose: '测试上肢和背部力量，反映肩背肌群的拉力和握力水平',
        levels: {
            excellent: '引体向上成绩优异，上肢和背部力量突出，肩背肌群拉力和握力均表现良好',
            good: '引体向上成绩较好，上肢力量有一定基础，建议通过增加训练量来进一步提升拉力耐力',
            pass: '引体向上达到基本标准，上肢力量基本正常，建议通过悬垂、屈臂悬垂等辅助练习来逐步提升',
            needsWork: '引体向上有较大提升空间，上肢和背部力量可能需要重点加强，建议从悬垂、弹力带辅助引体等循序渐进，逐步过渡到标准动作'
        }
    },
    'run_50m_8': {
        purpose: '测试速度耐力和方向变换能力，反映多次冲刺间的恢复能力',
        levels: {
            excellent: '50米×8往返跑成绩优异，速度耐力和方向变换能力突出，多次冲刺后恢复能力强',
            good: '往返跑成绩较好，速度耐力有一定基础，建议通过间歇跑训练进一步提升乳酸耐受能力',
            pass: '往返跑达到基本标准，速度耐力基本正常，建议通过短间歇跑（如50米×4组）来提升反复冲刺能力',
            needsWork: '往返跑成绩有提升空间，速度耐力可能需要加强，可能与有氧基础不足或反复冲刺恢复较慢有关，建议逐步增加间歇跑训练量'
        }
    },
    'run_800m': {
        purpose: '测试心肺耐力和有氧运动能力，反映中长时间运动的持续供能水平',
        levels: {
            excellent: '800米跑成绩优异，心肺耐力和有氧能力突出，中长距离供能效率高',
            good: '800米跑成绩较好，心肺功能有一定基础，建议通过间歇跑和变速跑来进一步提升有氧能力',
            pass: '800米跑达到基本标准，心肺耐力基本正常，建议通过持续慢跑和间歇跑来逐步提升有氧能力',
            needsWork: '800米跑成绩有提升空间，心肺耐力可能需要加强，建议从慢跑开始逐步建立有氧基础，循序渐进增加跑步距离和强度'
        }
    },
    'run_1000m': {
        purpose: '测试心肺耐力和有氧运动能力，反映中长时间运动的持续供能水平',
        levels: {
            excellent: '1000米跑成绩优异，心肺耐力和有氧能力突出，中长距离供能效率高',
            good: '1000米跑成绩较好，心肺功能有一定基础，建议通过间歇跑和变速跑来进一步提升有氧能力',
            pass: '1000米跑达到基本标准，心肺耐力基本正常，建议通过持续慢跑和间歇跑来逐步提升有氧能力',
            needsWork: '1000米跑成绩有提升空间，心肺耐力可能需要加强，建议从慢跑开始逐步建立有氧基础，循序渐进增加跑步距离和强度'
        }
    },
    'standing_long_jump': {
        purpose: '测试下肢爆发力和身体协调性，反映腿部肌肉的瞬时发力能力',
        levels: {
            excellent: '立定跳远成绩优异，下肢爆发力和身体协调性表现突出，腿部瞬时发力能力强',
            good: '立定跳远成绩较好，下肢爆发力有一定基础，建议通过跳箱和深蹲跳来进一步提升爆发力',
            pass: '立定跳远达到基本标准，下肢爆发力基本正常，建议通过跳跃类练习来提升腿部力量和协调发力能力',
            needsWork: '立定跳远有提升空间，可能与下肢爆发力不足或发力技巧不熟练有关，建议从基础跳跃练习开始，注重落地缓冲和全身协调发力'
        }
    },
    'balance_stand': {
        purpose: '测试平衡能力和本体感觉，反映前庭系统和神经肌肉的协调控制水平',
        levels: {
            excellent: '闭眼单脚站立成绩优异，平衡能力和本体感觉突出，神经肌肉控制精准',
            good: '闭眼单脚站立成绩较好，平衡能力有一定基础，建议通过平衡垫等不稳定面训练进一步强化',
            pass: '闭眼单脚站立达到基本标准，平衡能力基本正常，建议通过单脚站立练习来提升本体感觉',
            needsWork: '闭眼单脚站立有提升空间，平衡能力可能需要加强，建议从睁眼单脚站立开始练习，逐步过渡到闭眼，并配合平衡垫训练'
        }
    },
    't_test': {
        purpose: '测试灵敏素质和方向变换能力，反映多方向快速移动和身体控制水平',
        levels: {
            excellent: 'T型跑成绩优异，灵敏素质和方向变换能力突出，多方向移动快速且控制精准',
            good: 'T型跑成绩较好，灵敏素质有一定基础，建议通过敏捷梯和变向跑训练进一步提升',
            pass: 'T型跑达到基本标准，灵敏素质基本正常，建议通过绕标志物和听信号变向练习来提升灵敏度',
            needsWork: 'T型跑成绩有提升空间，灵敏素质可能需要加强，可能与下肢灵活性、方向变换速度或协调性有关，建议通过敏捷梯、绕标志物变向等练习循序渐进提升'
        }
    },
    'bmi': {
        purpose: '反映身体成分和体型发育状况，是评估营养状况和健康风险的重要参考',
        levels: {
            excellent: 'BMI处于正常范围，身体成分比例合理，营养状况良好',
            good: 'BMI处于正常范围，身体成分比例较好，建议保持规律运动和均衡饮食',
            pass: 'BMI略偏离正常范围，建议关注饮食结构和运动量，保持健康体重',
            needsWork: 'BMI偏离正常范围较多，可能与饮食结构或运动量不足有关，建议调整饮食、增加运动，逐步将体重控制在健康范围内'
        }
    }
};

// 根据分数返回解读等级 key
function getInterpretationLevel(score) {
    if (score >= 90) return 'excellent';
    if (score >= 80) return 'good';
    if (score >= 60) return 'pass';
    return 'needsWork';
}

const INTERPRETATION_LEVEL_LABELS = {
    excellent: '优秀',
    good: '良好',
    pass: '达标',
    needsWork: '待提升'
};

// 生成测试项目解读 HTML（用于 PDF 报告）
function generateItemInterpretations(lastTest, student) {
    if (!lastTest.items || Object.keys(lastTest.items).length === 0) {
        return '<div style="font-size:10px;color:#888;padding:8px;">暂无体测数据，无法生成项目解读</div>';
    }

    const rows = [];
    // 遍历所有测试项目（排除身高体重）
    for (const [key, value] of Object.entries(lastTest.items)) {
        if (key === 'height' || key === 'weight') continue;
        const interp = ITEM_INTERPRETATIONS[key];
        if (!interp) continue;

        const score = lastTest.itemScores?.[key];
        if (score === undefined || score === null) continue;

        const level = getInterpretationLevel(score);
        const analysis = interp.levels[level] || interp.levels.needsWork;
        const levelLabel = INTERPRETATION_LEVEL_LABELS[level];
        const unitSuffix = isTimeItem(key) ? '' : getItemUnit(key);
        const displayValue = isTimeItem(key) ? value : `${value}${unitSuffix}`;

        rows.push(`
            <div class="interp-row" data-level="${level}">
                <div class="interp-head">
                    <span class="interp-name">${getItemName(key)}</span>
                    <span class="interp-val">${displayValue}</span>
                    <span class="interp-score">${score}分</span>
                </div>
                <div class="interp-purpose">测试目的：${interp.purpose}</div>
                <div class="interp-analysis">${analysis}</div>
            </div>`);
    }

    // BMI 解读
    if (lastTest.items.height && lastTest.items.weight) {
        const bmi = computeBMI(lastTest.items.height, lastTest.items.weight);
        const bmiStatus = getBMIStatus(bmi, parseInt(student.grade), student.gender);
        const bmiScore = getBMIScore(bmiStatus);
        const bmiInterp = ITEM_INTERPRETATIONS['bmi'];
        if (bmiInterp && bmiScore !== null) {
            const level = getInterpretationLevel(bmiScore);
            const analysis = bmiInterp.levels[level] || bmiInterp.levels.needsWork;
            rows.push(`
            <div class="interp-row" data-level="${level}">
                <div class="interp-head">
                    <span class="interp-name">BMI指数</span>
                    <span class="interp-val">${bmi} kg/m²</span>
                    <span class="interp-score">${bmiScore}分</span>
                </div>
                <div class="interp-purpose">测试目的：${bmiInterp.purpose}</div>
                <div class="interp-analysis">${analysis}</div>
            </div>`);
        }
    }

    if (rows.length === 0) {
        return '<div style="font-size:10px;color:#888;padding:8px;">暂无评分数据，无法生成项目解读</div>';
    }

    return rows.join('');
}

// 生成测试项目解读文本数组（用于 Excel 导出）
function generateItemInterpretationsExcel(lastTest, student) {
    const result = [];
    if (!lastTest.items) return result;

    for (const [key, value] of Object.entries(lastTest.items)) {
        if (key === 'height' || key === 'weight') continue;
        const interp = ITEM_INTERPRETATIONS[key];
        if (!interp) continue;

        const score = lastTest.itemScores?.[key];
        if (score === undefined || score === null) continue;

        const level = getInterpretationLevel(score);
        const analysis = interp.levels[level] || interp.levels.needsWork;
        const unitSuffix = isTimeItem(key) ? '' : getItemUnit(key);
        const displayValue = isTimeItem(key) ? value : `${value}${unitSuffix}`;

        result.push([getItemName(key), displayValue, `${score}分`, interp.purpose, analysis]);
    }

    if (lastTest.items.height && lastTest.items.weight) {
        const bmi = computeBMI(lastTest.items.height, lastTest.items.weight);
        const bmiStatus = getBMIStatus(bmi, parseInt(student.grade), student.gender);
        const bmiScore = getBMIScore(bmiStatus);
        const bmiInterp = ITEM_INTERPRETATIONS['bmi'];
        if (bmiInterp && bmiScore !== null) {
            const level = getInterpretationLevel(bmiScore);
            const analysis = bmiInterp.levels[level] || bmiInterp.levels.needsWork;
            result.push(['BMI指数', `${bmi} kg/m²`, `${bmiScore}分`, bmiInterp.purpose, analysis]);
        }
    }

    return result;
}

// ==================== 测试总结生成 ====================
function generateTestSummary(lastTest, student) {
    const totalScore = lastTest.totalScore || 0;
    const { strongItems, weakItems } = getStrengthWeakItems(lastTest);

    let overall = '';
    if (totalScore >= 90) overall = '表现优异';
    else if (totalScore >= 80) overall = '表现良好';
    else if (totalScore >= 60) overall = '基本达标';
    else overall = '有较大提升空间';

    let summary = `${student.name}同学本次体测总分${totalScore}分，${overall}。`;

    if (strongItems.length > 0) {
        summary += `优势项目为${strongItems.join('、')}，`;
    }
    if (weakItems.length > 0) {
        summary += `${weakItems.join('、')}仍有提升空间。`;
    } else {
        summary += '各项发展较为均衡。';
    }

    // 根据年级给出展望
    const gradeNum = parseInt(student.grade);
    if (gradeNum <= 6) {
        summary += '建议保持运动兴趣，在游戏中全面发展体能。';
    } else if (gradeNum <= 9) {
        summary += '建议结合中考项目要求，针对性强化薄弱环节。';
    } else {
        summary += '建议结合专项需求，系统化提升综合素质。';
    }

    return summary;
}

// 根据薄弱项生成训练建议（精简单行版）
function generateSuggestions(lastTest, grade) {
    if (!lastTest.itemScores) return '<div class="sug-item">暂无训练数据</div>';
    const weak = Object.entries(lastTest.itemScores)
        .filter(([,s]) => s > 0 && s < 80)
        .sort((a, b) => a[1] - b[1]);
    if (weak.length === 0) {
        return '<div class="sug-item" style="border-left-color:#22c55e; background:#f0fdf4;"><span class="tag" style="color:#166534;">非常棒</span>各项成绩均衡，继续保持当前训练节奏。</div>';
    }
    // 收集薄弱项对应的素质方向（去重，按严重程度排序）
    const qualitySet = new Map();
    weak.forEach(([key]) => {
        const mapping = ITEM_QUALITY_MAP[key];
        if (!mapping) return;
        if (!qualitySet.has(mapping.quality)) {
            qualitySet.set(mapping.quality, getItemName(key));
        }
        if (mapping.sub && !qualitySet.has(mapping.sub)) {
            qualitySet.set(mapping.sub, getItemName(key));
        }
    });
    const qualities = Array.from(qualitySet.entries()).slice(0, 3);
    return qualities.map(([quality, fromItem]) => {
        const shortTip = QUALITY_SHORT_TIPS[quality] || '针对性强化训练';
        return `<div class="sug-item" style="border-left-color:#2563eb;">
            <span class="tag" style="color:#1e40af;">${quality}</span>
            <span style="color:#94a3b8;margin-left:4px;">${fromItem}</span>
            <span style="color:#374151;margin-left:6px;">${shortTip}</span>
        </div>`;
    }).join('');
}

function generateExcel() {
    const studentId = document.getElementById('reportStudentSelect').value;
    if (!studentId) { showToast('请先选择学生', 'error'); return; }
    const student = students.find(s => s.id === studentId);
    if (!student) return;

    // 对比模式分支
    const compareSection = document.getElementById('compareSection');
    const testId1 = document.getElementById('compareTest1')?.value;
    const testId2 = document.getElementById('compareTest2')?.value;
    const isCompareMode = compareSection && compareSection.style.display !== 'none' && testId1 && testId2;
    if (isCompareMode) {
        const test1 = student.tests.find(t => t.id === testId1);
        const test2 = student.tests.find(t => t.id === testId2);
        if (test1 && test2) { renderCompareExcel(student, test1, test2); return; }
    }

    const lastTest = getSelectedTest(studentId);
    if (!lastTest) { showToast('该学生暂无体测记录', 'error'); return; }

    showToast('正在生成 Excel...', 'info');

    const wb = XLSX.utils.book_new();
    const wsData = [];

    // 标题
    wsData.push(['体质测试反馈表']);
    wsData.push([`依据：《国家学生体质健康标准（2014年修订）》`]);
    wsData.push([]);

    // 基本信息
    wsData.push(['一、基本信息']);
    wsData.push(['姓名', student.name, '性别', student.gender]);
    wsData.push(['年级', getGradeText(student.grade), '学校', student.school || '-']);
    wsData.push(['测试日期', lastTest.date, '主测教练', '-']);
    wsData.push([]);

    // 体测成绩
    wsData.push(['二、体测成绩']);
    wsData.push(['测试项目', '成绩', '得分', '等级']);
    Object.entries(lastTest.items).forEach(([key, value]) => {
        // 身高、体重不参与评分
        if (key === 'height' || key === 'weight') {
            wsData.push([getItemName(key), isTimeItem(key) ? value : value + getItemUnit(key), '-', '参考']);
        } else {
            const score = lastTest.itemScores?.[key] || '-';
            const grade = score === '-' ? '-' : getGradeLabel(score);
            wsData.push([getItemName(key), isTimeItem(key) ? value : value + getItemUnit(key), score, grade]);
        }
    });
    // BMI 也参与评分
    if (lastTest.items.height && lastTest.items.weight) {
        const bmi = computeBMI(lastTest.items.height, lastTest.items.weight);
        const bmiStatus = getBMIStatus(bmi, parseInt(student.grade), student.gender);
        const bmiScore = getBMIScore(bmiStatus);
        wsData.push(['BMI指数', bmi + ' kg/m²', bmiScore === null ? '-' : bmiScore, bmiScore === null ? bmiStatus.label : getGradeLabel(bmiScore)]);
    }
    wsData.push([]);

    // 综合评价
    wsData.push(['三、综合评价']);
    const { strongItems, weakItems } = getStrengthWeakItems(lastTest);
    wsData.push(['学年总分', lastTest.totalScore || '-']);
    wsData.push(['评定等级', getGradeLabel(lastTest.totalScore) || '-']);
    wsData.push(['优势项目', strongItems.join('、') || '-']);
    wsData.push(['提升方向', weakItems.join('、') || '-']);
    wsData.push([]);

    // 项目解读
    wsData.push(['四、项目解读']);
    wsData.push(['项目名称', '成绩', '得分', '测试目的', '个体化解读']);
    const interpRows = generateItemInterpretationsExcel(lastTest, student);
    interpRows.forEach(row => wsData.push(row));
    wsData.push([]);

    // 测试总结
    wsData.push(['五、测试总结']);
    wsData.push([generateTestSummary(lastTest, student)]);
    wsData.push([]);

    const ws = XLSX.utils.aoa_to_sheet(wsData);

    // 设置列宽
    ws['!cols'] = [{wch: 14}, {wch: 14}, {wch: 10}, {wch: 10}, {wch: 40}, {wch: 50}];

    XLSX.utils.book_append_sheet(wb, ws, '体质测试反馈');
    XLSX.writeFile(wb, `${student.name}_体质测试反馈表.xlsx`);
    showToast('Excel 导出成功', 'success');
}

// ==================== 对比报告 Excel 渲染 ====================
function renderCompareExcel(student, test1, test2) {
    showToast('正在生成对比 Excel...', 'info');

    const items1 = test1.items || {};
    const items2 = test2.items || {};
    const scores1 = test1.itemScores || {};
    const scores2 = test2.itemScores || {};

    const allKeys = new Set([...Object.keys(items1), ...Object.keys(items2)]);
    const priorityKeys = ['height', 'weight'];
    const orderedKeys = [
        ...priorityKeys.filter(k => allKeys.has(k)),
        ...[...allKeys].filter(k => !priorityKeys.includes(k))
    ];

    const wb = XLSX.utils.book_new();
    const wsData = [];

    // 标题
    wsData.push(['体测数据对比报告']);
    wsData.push([`依据：《国家学生体质健康标准（2014年修订）》`]);
    wsData.push([]);

    // 基本信息
    wsData.push(['一、基本信息']);
    wsData.push(['姓名', student.name, '性别', student.gender]);
    wsData.push(['年级', getGradeText(student.grade), '学校', student.school || '-']);
    wsData.push(['第一次测试', test1.date, '第二次测试', test2.date]);
    wsData.push([]);

    // 对比明细
    wsData.push(['二、详细对比']);
    wsData.push(['项目', `${test1.date} 成绩`, `${test1.date} 得分`, `${test2.date} 成绩`, `${test2.date} 得分`, '变化']);

    orderedKeys.forEach(key => {
        const isHW = key === 'height' || key === 'weight';
        const unit = getItemUnit(key);
        const isTime = isTimeItem(key);
        // 时间类型项目的值已包含格式（如 3'25"），不需要再追加单位
        const value1 = items1[key] !== undefined ? (isTime ? `${items1[key]}` : `${items1[key]}${unit}`) : '-';
        const value2 = items2[key] !== undefined ? (isTime ? `${items2[key]}` : `${items2[key]}${unit}`) : '-';
        const score1 = isHW ? '-' : (scores1[key] || '-');
        const score2 = isHW ? '-' : (scores2[key] || '-');
        let change = '-';
        if (isHW && items1[key] !== undefined && items2[key] !== undefined) {
            const diff = Math.round((Number(items2[key]) - Number(items1[key])) * 10) / 10;
            change = diff > 0 ? `+${diff}${unit}` : `${diff}${unit}`;
        } else if (scores1[key] !== undefined && scores2[key] !== undefined) {
            const diff = scores2[key] - scores1[key];
            change = diff > 0 ? `+${diff}` : `${diff}`;
        }
        wsData.push([isHW ? `${getItemName(key)} (参考)` : getItemName(key), value1, score1, value2, score2, change]);
    });

    // BMI
    if (items1.height && items1.weight && items2.height && items2.weight) {
        const bmi1 = computeBMI(items1.height, items1.weight);
        const bmi2 = computeBMI(items2.height, items2.weight);
        const s1 = getBMIStatus(bmi1, parseInt(student.grade), student.gender);
        const s2 = getBMIStatus(bmi2, parseInt(student.grade), student.gender);
        const bmiDiff = Math.round((bmi2 - bmi1) * 10) / 10;
        wsData.push(['BMI指数 (参考)', `${bmi1} kg/m²`, s1.label, `${bmi2} kg/m²`, s2.label, bmiDiff > 0 ? `+${bmiDiff}` : `${bmiDiff}`]);
    }
    wsData.push([]);

    // 总分
    const totalDiff = (test2.totalScore || 0) - (test1.totalScore || 0);
    wsData.push(['三、总分变化']);
    wsData.push([`${test1.date} 总分`, test1.totalScore || '-']);
    wsData.push([`${test2.date} 总分`, test2.totalScore || '-']);
    wsData.push(['总分变化', totalDiff > 0 ? `↑ +${totalDiff}` : totalDiff < 0 ? `↓ ${totalDiff}` : '→ 0']);
    wsData.push([]);

    // 提升分析
    const scoredEntries1 = Object.entries(scores1).filter(([k, s]) => s > 0 && k !== 'height' && k !== 'weight');
    const scoredEntries2 = Object.entries(scores2).filter(([k, s]) => s > 0 && k !== 'height' && k !== 'weight');
    const improvements = [];
    const declines = [];
    scoredEntries1.forEach(([k, s]) => {
        if (scores2[k] !== undefined) {
            const diff = scores2[k] - s;
            if (diff > 0) improvements.push(`${getItemName(k)}: +${diff}分`);
            else if (diff < 0) declines.push(`${getItemName(k)}: ${diff}分`);
        }
    });
    const bodyChanges = [];
    ['height', 'weight'].forEach(k => {
        if (items1[k] !== undefined && items2[k] !== undefined) {
            const diff = Math.round((Number(items2[k]) - Number(items1[k])) * 10) / 10;
            if (diff !== 0) bodyChanges.push(`${getItemName(k)}: ${diff > 0 ? '+' : ''}${diff}${getItemUnit(k)}`);
        }
    });

    wsData.push(['四、提升分析']);
    if (improvements.length) wsData.push(['提升项目', improvements.join('、')]);
    if (declines.length) wsData.push(['下降项目', declines.join('、')]);
    if (bodyChanges.length) wsData.push(['身体形态变化', bodyChanges.join('、')]);
    if (!improvements.length && !declines.length && !bodyChanges.length) wsData.push(['无变化']);

    const ws = XLSX.utils.aoa_to_sheet(wsData);
    ws['!cols'] = [{wch: 22}, {wch: 16}, {wch: 10}, {wch: 16}, {wch: 10}, {wch: 14}];
    XLSX.utils.book_append_sheet(wb, ws, '体测对比');
    XLSX.writeFile(wb, `${student.name}_体测对比报告_${test1.date}_vs_${test2.date}.xlsx`);
    showToast('对比 Excel 导出成功', 'success');
}

// ==================== 报告上传功能 ====================
function handleReportUpload(event) {
    const file = event.target.files[0];
    if (!file) return;
    const studentId = document.getElementById('reportStudentSelect').value;
    if (!studentId) { showToast('请先选择学生', 'error'); return; }
    const student = students.find(s => s.id === studentId);
    if (!student) return;

    const reader = new FileReader();
    reader.onload = (e) => {
        try {
            const data = JSON.parse(e.target.result);
            // 兼容格式：{students: [...]} 或 [student1, student2]
            const importedStudents = Array.isArray(data) ? data : (data.students || [data]);
            let importedCount = 0;
            importedStudents.forEach(s => {
                if (!s.id) s.id = generateId();
                const existIdx = students.findIndex(x => x.id === s.id);
                if (existIdx >= 0) {
                    // 合并测试记录
                    if (s.tests && s.tests.length > 0) {
                        if (!students[existIdx].tests) students[existIdx].tests = [];
                        s.tests.forEach(t => {
                            if (!students[existIdx].tests.find(x => x.id === t.id)) {
                                students[existIdx].tests.push(t);
                            }
                        });
                    }
                } else {
                    students.push(s);
                    importedCount++;
                }
            });
            saveStudents();
            renderStudentList();
            updateSelectOptions();
            showToast(`成功导入 ${importedCount} 名学生数据`, 'success');
        } catch (err) {
            showToast('文件格式错误，请上传有效的JSON数据', 'error');
        }
    };
    reader.readAsText(file);
    event.target.value = '';
}

function downloadTemplate() {
    const template = {
        version: "1.0",
        description: "上门体育体测数据导入模板",
        format: {
            students: [{
                id: "可选，留空则自动生成",
                name: "学生姓名（必填）",
                gender: "男/女（必填）",
                grade: "1-12（必填，1=小学一年级）",
                birthday: "YYYY-MM-DD",
                school: "学校名称",
                class: "班级",
                parentName: "家长姓名",
                parentPhone: "联系电话",
                tests: [{
                    id: "可选",
                    date: "YYYY-MM-DD",
                    healthDeclaration: "无异常/有异常",
                    items: {
                        height: 120,
                        weight: 25,
                        run_50m: 10.5,
                        sit_and_reach: 10,
                        jump_rope_1min: 80,
                        standing_long_jump: 150,
                        balance_stand: 30
                    },
                    totalScore: 85
                }]
            }]
        }
    };
    const blob = new Blob([JSON.stringify(template, null, 2)], {type: 'application/json'});
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = '体测数据导入模板.json'; a.click();
    URL.revokeObjectURL(url);
    showToast('模板已下载', 'success');
}

function backupData() {
    const data = {
        students: students,
        schedules: schedules,
        exportDate: new Date().toISOString(),
        version: '1.1'
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], {type: 'application/json'});
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = `上门体育数据_${new Date().toISOString().split('T')[0]}.json`; a.click();
    URL.revokeObjectURL(url);
    showToast('数据已备份', 'success');
}

async function restoreData(event) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (e) => {
        try {
            const data = JSON.parse(e.target.result);
            if (!data || !Array.isArray(data.students)) {
                showToast('备份文件格式不正确', 'error');
                return;
            }
            const scCount = Array.isArray(data.schedules) ? data.schedules.length : 0;
            if (confirm(`确定要导入备份吗？\n文件日期：${data.exportDate || '未知'}\n学生数量：${data.students.length} 人\n排课数量：${scCount} 节\n\n注意：导入会将备份数据写入云端数据库。`)) {
                showToast('正在导入数据...', 'info');
                const result = await dataMigration.importFromLocalStorage(data);
                await loadStudents();
                await loadSchedules();
                renderStudentList();
                renderHoursOverview();
                updateSelectOptions();
                if (document.getElementById('page-schedule').classList.contains('active')) {
                    renderSchedule();
                }
                showToast(`导入成功：${result.students} 名学生，${result.tests} 条体测，${result.schedules} 节课程`, 'success');
            }
        } catch (err) {
            console.error('restoreData error:', err);
            showToast('导入失败: ' + err.message, 'error');
        }
    };
    reader.readAsText(file);
    event.target.value = '';
}

// ==================== 训练方案 ====================

// ---- 训练动作数据库（v3: 基于实际器材 + 多训练目标） ----
// 器材标签：none=无需器材, ladder=绳梯, cone=标志桶, disc=标志盘, band=弹力带,
//           tennis=网球, tape=皮尺, jump_mat=跳远垫, yoga_mat=瑜伽垫,
//           low_hurdle=低栏架, high_hurdle=高栏架
//           jump_rope=跳绳(额外), solid_ball=实心球(额外), ball=球类(额外)
const AVAILABLE_EQUIPMENT = ["none","ladder","cone","disc","band","tennis","tape","jump_mat","yoga_mat","low_hurdle","high_hurdle"];

const TRAINING_DB = {
    exercises: {
        warmup: [
            { id:"wu_001", name:"慢跑热身", targetQualities:["心肺耐力"], ageRange:[6,18], difficulty:1, equipment:["none"], duration:5, sets:"1组", reps:"5分钟", description:"以舒适配速慢跑，使心率逐渐上升至120-140次/分，身体微微出汗", coachingPoints:"保持自然呼吸，手臂自然摆动，脚掌着地轻盈", safetyNotes:"如有哮喘等呼吸系统疾病，热身时长加倍，强度减半" },
            { id:"wu_002", name:"动态拉伸组合", targetQualities:["柔韧性"], ageRange:[6,18], difficulty:1, equipment:["none"], duration:5, sets:"1组", reps:"每个动作8-10次", description:"臂环绕、髋部环绕、腿摆动、弓步走、侧弓步走、高抬腿走等动态拉伸，每个8-10次", coachingPoints:"幅度由小到大循序渐进；注重关节活动度而非拉伸强度", safetyNotes:"避免弹震式拉伸；感觉疼痛立即减小幅度" },
            { id:"wu_003", name:"关节激活操", targetQualities:["柔韧性","协调性"], ageRange:[6,18], difficulty:1, equipment:["none"], duration:3, sets:"1组", reps:"每个关节8次", description:"从头到脚依次活动各关节：颈→肩→肘腕→髋→膝→踝，每个关节顺逆时针各8圈", coachingPoints:"动作缓慢有控制；低龄儿童配合儿歌增加趣味性", safetyNotes:"颈部活动幅度不宜过大，避免快速旋转" },
            { id:"wu_004", name:"游戏化热身-红绿灯", targetQualities:["速度","灵敏素质","协调性"], ageRange:[6,12], difficulty:1, equipment:["cone"], duration:5, sets:"1组", reps:"5-6轮", description:"用标志桶划定区域，教练喊'绿灯'跑动、'红灯'停止、'黄灯'慢走。可加入'倒车'、'转弯'口令", coachingPoints:"口令变化要突然，训练反应速度和制动能力", safetyNotes:"确保场地无障碍物，制动时注意屈膝缓冲" },
            { id:"wu_005", name:"动物爬行热身", targetQualities:["协调性","核心力量","上肢力量"], ageRange:[6,12], difficulty:1, equipment:["none"], duration:5, sets:"1组", reps:"每种爬行10米×2", description:"熊爬、螃蟹爬、毛毛虫爬、鳄鱼爬等模仿动物爬行", coachingPoints:"保持核心收紧；注重协调性和趣味性", safetyNotes:"手腕有伤者改为其他热身方式" },
            { id:"wu_006", name:"栏架热身跳", targetQualities:["协调性","心肺耐力","下肢爆发力"], ageRange:[7,18], difficulty:1, equipment:["low_hurdle"], duration:5, sets:"1组", reps:"每种跳法2趟", description:"用低栏架进行热身跳跃：双脚连续跳过栏架→侧向跳过栏架→单脚跳过栏架，每种2趟(6-8个栏架)", coachingPoints:"前脚掌着地，膝盖微屈缓冲；注重节奏感；栏架高度调低", safetyNotes:"栏架高度根据年龄调整(6-9岁15cm,10-12岁20cm)" },
            { id:"wu_007", name:"神经激活反应练习", targetQualities:["速度","灵敏素质"], ageRange:[10,18], difficulty:2, equipment:["cone","disc"], duration:4, sets:"1组", reps:"6-8次反应", description:"用不同颜色标志盘/标志桶作为信号，学生根据信号快速做出反应动作（红=下蹲、蓝=起跳、绿=冲刺5米）", coachingPoints:"信号要突然且多变；反应动作要求快速准确", safetyNotes:"确保反应方向无障碍物" }
        ],
        speed: [
            { id:"sp_001", name:"30米加速跑", targetQualities:["速度"], ageRange:[7,14], difficulty:1, equipment:["cone"], duration:8, sets:"4-6组", reps:"30米", restBetween:"60-90秒", description:"用标志桶标记起点和30米终点，站立式起跑全力加速跑30米", coachingPoints:"起跑重心前倾，前3步小而快；手臂前后有力摆动", safetyNotes:"跑道平整无障碍；7-11岁以频率为主",
              levels:{ regression:{ name:"15米起跑加速", sets:"4组", reps:"15米", restBetween:"90秒", coachingPoints:"先掌握起跑预备姿势，前3步小步高频，不追求步幅" }, progression:{ name:"40米全力冲刺", sets:"6组", reps:"40米", restBetween:"60秒", coachingPoints:"加速后段保持步幅不减速，手臂摆动充分，注重途中跑最高速度维持" } } },
            { id:"sp_002", name:"反应起跑", targetQualities:["速度","灵敏素质"], ageRange:[9,14], difficulty:2, equipment:["cone"], duration:8, sets:"6-8组", reps:"15-20米", restBetween:"45-60秒", description:"用标志桶标记终点线，背对跑动方向站立或蹲下，听到信号后快速转身起跑15-20米", coachingPoints:"听到信号第一时间反应，转身流畅；快速进入加速状态", safetyNotes:"9-12岁是反应速度敏感期，重点训练",
              levels:{ regression:{ name:"正面听信号起跑", sets:"5组", reps:"10米", restBetween:"60秒", coachingPoints:"先从正面起跑练起，重点缩短反应时间，听到信号即刻蹬地" }, progression:{ name:"蹲踞式反应起跑", sets:"8组", reps:"20米", restBetween:"45秒", coachingPoints:"从蹲下姿势起跑，增加难度，注重腿部爆发力和反应速度的结合" } } },
            { id:"sp_003", name:"追逐游戏-抓尾巴", targetQualities:["速度","灵敏素质","协调性"], ageRange:[6,12], difficulty:1, equipment:["tape"], duration:10, sets:"4-5轮", reps:"每轮2分钟", restBetween:"60秒", description:"用皮尺或布条塞腰后当'尾巴'，在标志桶划定区域内互相追逐抢夺，同时保护自己", coachingPoints:"鼓励多变向移动和急停急起；注重观察和预判", safetyNotes:"场地需有足够缓冲空间",
              levels:{ regression:{ name:"单人抓尾练习", sets:"3轮", reps:"每轮90秒", restBetween:"60秒", coachingPoints:"教练慢速移动，学生专注于快速抢夺和变向" }, progression:{ name:"双人互追+障碍", sets:"5轮", reps:"每轮2分钟", restBetween:"45秒", coachingPoints:"加入标志桶障碍物，增加变向难度，提升复杂环境下的速度和灵敏" } } },
            { id:"sp_004", name:"接力跑", targetQualities:["速度","协调性","心肺耐力"], ageRange:[7,14], difficulty:1, equipment:["cone"], duration:10, sets:"3-4轮", reps:"4×30米接力", restBetween:"90秒", description:"用标志桶标记折返点，4人一组30米折返接力跑，注重交接技术和团队配合", coachingPoints:"交接时两人同向跑动；培养团队协作意识", safetyNotes:"交接区域需留足空间",
              levels:{ regression:{ name:"2人短距接力", sets:"3轮", reps:"2×15米", restBetween:"90秒", coachingPoints:"缩短距离，先掌握交接节奏和手型" }, progression:{ name:"4×50米接力", sets:"4轮", reps:"4×50米", restBetween:"60秒", coachingPoints:"增加距离和速度，注重高速交接中的稳定性和默契" } } },
            { id:"sp_005", name:"标志桶短冲", targetQualities:["速度","灵敏素质"], ageRange:[12,18], difficulty:2, equipment:["cone"], duration:10, sets:"6组", reps:"40-60米", restBetween:"90-120秒", description:"设3个标志桶(间隔10米)，冲刺→急停→变向→冲刺→急停→冲刺终点", coachingPoints:"急停降低重心，外侧脚制动；变向内侧脚蹬地", safetyNotes:"12岁以上结合力量发展速度",
              levels:{ regression:{ name:"直线冲刺+急停", sets:"4组", reps:"20米×2", restBetween:"90秒", coachingPoints:"先掌握急停技术，降低重心，外侧脚制动缓冲" }, progression:{ name:"S型连续变向冲刺", sets:"6组", reps:"60米", restBetween:"120秒", coachingPoints:"连续变向不减速，注重每次变向的爆发力和身体重心的快速转移" } } },
            { id:"sp_006", name:"弹力带阻力冲刺跑", targetQualities:["速度","下肢爆发力"], ageRange:[13,18], difficulty:3, equipment:["band"], duration:10, sets:"5组", reps:"20-30米", restBetween:"120秒", description:"弹力带系腰部，同伴后方提供阻力，全力冲刺20-30米后释放阻力自由冲刺10米", coachingPoints:"阻力适中不影响技术；释放瞬间加速感明显", safetyNotes:"仅限13岁以上有力量基础者；弹力带质量需检查",
              levels:{ regression:{ name:"上坡冲刺跑", sets:"4组", reps:"20米", restBetween:"90秒", coachingPoints:"利用自然坡度增加阻力，无需器材，注重蹬地充分和身体前倾" }, progression:{ name:"弹力带+负重背心冲刺", sets:"5组", reps:"30米", restBetween:"120秒", coachingPoints:"双重阻力训练，释放后自由冲刺，模拟比赛末段冲刺能力" } } },
            { id:"sp_007", name:"50米冲刺技术训练", targetQualities:["速度"], ageRange:[12,18], difficulty:2, equipment:["cone","tape"], duration:10, sets:"5-6组", reps:"50米", restBetween:"90秒", description:"用皮尺精确测量50米距离，标志桶标记起终点和30米处。练习起跑→加速→途中跑→冲刺四阶段技术", coachingPoints:"起跑阶段(0-10m)重心低、步频快；加速阶段(10-30m)逐步抬体、加大步幅；途中跑(30-45m)保持最高速度；冲刺(45-50m)保持技术不减速", safetyNotes:"中考50米跑专项训练；充分热身后进行",
              levels:{ regression:{ name:"分段技术练习", sets:"4组", reps:"10-15米分段", restBetween:"90秒", coachingPoints:"分阶段练习起跑(10m)和加速(15m)，不跑全程，先纠正各阶段技术" }, progression:{ name:"50米模拟测试", sets:"6组", reps:"50米全程", restBetween:"120秒", coachingPoints:"模拟考试流程，从预备到冲刺全程计时，注重技术稳定性" } } },
            { id:"sp_008", name:"高抬腿加速跑", targetQualities:["速度","协调性","核心力量"], ageRange:[7,14], difficulty:1, equipment:["cone"], duration:8, sets:"5组", reps:"20米", restBetween:"60秒", description:"原地高抬腿5秒后迅速前冲20米，训练步频到步幅的转换能力", coachingPoints:"高抬腿阶段大腿抬至水平，前冲时重心前倾逐步加大步幅", safetyNotes:"注意大腿后侧肌肉预先激活",
              levels:{ regression:{ name:"原地高抬腿+走步", sets:"4组", reps:"高抬腿10次+走15米", restBetween:"60秒", coachingPoints:"先掌握高抬腿动作标准，再过渡到走步前冲" }, progression:{ name:"高抬腿+30米冲刺", sets:"6组", reps:"高抬腿5秒+30米", restBetween:"45秒", coachingPoints:"延长冲刺距离，提升步频到最高速度的转换效率" } } },
            { id:"sp_009", name:"后退跑转冲刺", targetQualities:["速度","灵敏素质"], ageRange:[8,14], difficulty:1, equipment:["cone"], duration:8, sets:"5组", reps:"后退10米+冲刺15米", restBetween:"60秒", description:"背对终点方向慢跑10米，听到信号后快速转身冲刺15米，训练后退跑转前冲的加速能力", coachingPoints:"转身时降低重心，外侧脚蹬地转体，快速进入加速状态", safetyNotes:"确保后退方向无障碍物",
              levels:{ regression:{ name:"侧向滑步转冲刺", sets:"4组", reps:"侧滑10米+冲刺15米", restBetween:"60秒", coachingPoints:"先从侧向滑步练习转身，降低难度，注重转身后的加速" }, progression:{ name:"后退跑+变向冲刺", sets:"6组", reps:"后退10米+变向冲刺20米", restBetween:"45秒", coachingPoints:"增加变向动作，提升转身后复杂路线的加速能力" } } },
            { id:"sp_010", name:"绳梯速度步法", targetQualities:["速度","协调性"], ageRange:[7,14], difficulty:1, equipment:["ladder"], duration:8, sets:"4种步法×3组", reps:"每种步法1趟", restBetween:"45秒", description:"绳梯上快速步法：高抬腿入格→单脚快速入格→双脚快速入格→侧向快速入格，注重步频", coachingPoints:"前脚掌着地，脚步轻快；由慢到快，注重步频而非步幅", safetyNotes:"绳梯需平铺固定",
              levels:{ regression:{ name:"基础步法慢速", sets:"3种×2组", reps:"每种1趟", restBetween:"60秒", coachingPoints:"先掌握基本步法，不追求速度，注重准确性" }, progression:{ name:"绳梯+5米冲刺", sets:"4种×3组", reps:"每种1趟+冲刺", restBetween:"30秒", coachingPoints:"出绳梯后立即冲刺5米，训练步频到步幅的快速转换" } } }
        ],
        agility: [
            { id:"ag_001", name:"绳梯基础步法", targetQualities:["灵敏素质","协调性","速度"], ageRange:[6,14], difficulty:1, equipment:["ladder"], duration:10, sets:"4-5种步法×3组", reps:"每种步法1趟", restBetween:"30-45秒", description:"绳梯上多种步法：单脚依次入格→双脚同时入格→横向滑步→进进出出→交叉步", coachingPoints:"前脚掌着地脚步轻快；由慢到快；眼睛平视前方", safetyNotes:"6-9岁步法以简单为主" ,
              levels:{ regression:{name:'单步入格慢速',sets:'3种×2组',reps:'每种1趟',restBetween:'60秒',coaching:'先掌握单脚依次入格，不追求速度'} , progression:{name:'绳梯双步+冲刺',sets:'5种×3组',reps:'每种1趟+5米冲刺',restBetween:'30秒',coaching:'步法完成后立即冲刺，提升步频到速度的转换'} } },
            { id:"ag_002", name:"T型灵敏测试训练", targetQualities:["灵敏素质","速度"], ageRange:[10,18], difficulty:2, equipment:["cone"], duration:10, sets:"6-8组", reps:"1趟T型路线", restBetween:"45-60秒", description:"用标志桶摆T型路线：向前冲刺10米→左侧滑步5米→右侧滑步10米→左侧滑步5米→倒退跑10米回起点", coachingPoints:"滑步双脚不交叉；倒退重心略后倾；全程低重心", safetyNotes:"10-12岁是灵敏素质敏感期" ,
              levels:{ regression:{name:'简化T型路线',sets:'4组',reps:'5米×3',restBetween:'60秒',coaching:'缩短距离，先掌握滑步技术'} , progression:{name:'T型+转身冲刺',sets:'8组',reps:'1趟+10米冲刺',restBetween:'45秒',coaching:'完成T型路线后立即加速冲刺10米'} } },
            { id:"ag_003", name:"听信号变向跑", targetQualities:["灵敏素质","速度","协调性"], ageRange:[8,14], difficulty:2, equipment:["cone"], duration:8, sets:"6组", reps:"每组15-20秒", restBetween:"45秒", description:"用标志桶围5×5米区域，教练随机指向四方向，学生快速变向跑向该方向", coachingPoints:"变向外侧脚蹬地；保持低重心和视野开阔", safetyNotes:"场地需平整防滑" ,
              levels:{ regression:{name:'双方向变向跑',sets:'4组',reps:'15秒',restBetween:'45秒',coaching:'先从两个方向练起，降低难度'} , progression:{name:'四方向+地标记向',sets:'6组',reps:'20秒',restBetween:'30秒',coaching:'增加地面标志物，提升视觉反应和方向变换速度'} } },
            { id:"ag_004", name:"Z字变向跑", targetQualities:["灵敏素质","速度","下肢爆发力"], ageRange:[10,18], difficulty:2, equipment:["cone"], duration:8, sets:"5-6组", reps:"1趟Z字路线", restBetween:"60秒", description:"用标志桶摆Z字型(间距3-4米)，最快速度绕过每个标志桶", coachingPoints:"接近标志桶减速，绕过后加速；身体重心向内侧倾斜", safetyNotes:"绕桶时膝盖不要内扣" ,
              levels:{ regression:{name:'大间距Z字跑',sets:'4组',reps:'间距5米',restBetween:'60秒',coaching:'加大间距降低变向难度，注重减速控制'} , progression:{name:'小间距Z字+冲刺',sets:'6组',reps:'间距2米+10米冲刺',restBetween:'45秒',coaching:'小间距快频变向后立即冲刺，训练灵敏到速度的转换'} } },
            { id:"ag_005", name:"镜像追拍游戏", targetQualities:["灵敏素质","协调性","反应速度"], ageRange:[8,14], difficulty:1, equipment:["none"], duration:8, sets:"4-5轮", reps:"每轮30-45秒", restBetween:"30秒", description:"两人面对面，一人做领队各种移动，另一人做镜子跟随模仿，每轮交换角色", coachingPoints:"领队动作多变突然；跟随者低重心快速反应", safetyNotes:"确保两人间有足够空间" ,
              levels:{ regression:{name:'慢速镜像跟拍',sets:'3轮',reps:'30秒',restBetween:'30秒',coaching:'领队慢速移动，跟随者专注于模仿动作'} , progression:{name:'高速镜像+变向',sets:'5轮',reps:'45秒',restBetween:'20秒',coaching:'领队高速多变向，跟随者低重心快速反应'} } },
            { id:"ag_006", name:"多方向跳跃落地", targetQualities:["灵敏素质","下肢爆发力","平衡能力"], ageRange:[10,18], difficulty:2, equipment:["disc","tape"], duration:8, sets:"4组", reps:"每组8次跳跃", restBetween:"60秒", description:"用标志盘和皮尺画十字标记，双脚起跳向前/后/左/右跳跃，落地稳定1秒再跳下一方向", coachingPoints:"落地屈膝屈髋缓冲，膝盖对准脚尖；稳定后再起跳", safetyNotes:"落地技术差者降低跳跃距离" ,
              levels:{ regression:{name:'双向跳跃落地',sets:'3组',reps:'前后左右各4次',restBetween:'60秒',coaching:'先从前后跳跃练起，缩短距离注重落地稳定'} , progression:{name:'多方向连续跳+转体',sets:'5组',reps:'8次含转体',restBetween:'45秒',coaching:'加入转体跳跃，提升空中控制和落地稳定性'} } },
            { id:"ag_007", name:"绳梯高级灵敏组合", targetQualities:["灵敏素质","协调性","速度"], ageRange:[10,18], difficulty:2, equipment:["ladder","cone"], duration:10, sets:"5种组合×3组", reps:"每种组合1趟", restBetween:"45秒", description:"绳梯+标志桶组合：绳梯快速步法→出绳梯后5米冲刺绕标志桶→返回。包含高抬腿入格+变向冲刺、侧向滑步+急停转身等", coachingPoints:"绳梯内注重节奏和准确性，出绳梯后立即加速；标志桶变向降低重心", safetyNotes:"10岁以上适合；绳梯需平铺固定" ,
              levels:{ regression:{name:'绳梯单步+冲刺',sets:'3种×2组',reps:'1趟+3米冲刺',restBetween:'45秒',coaching:'先掌握基本步法加短距离冲刺'} , progression:{name:'绳梯组合+标志桶变向',sets:'5种×3组',reps:'1趟+变向冲刺',restBetween:'30秒',coaching:'出绳梯后绕标志桶变向冲刺，提升复杂路线灵敏度'} } },
            { id:"ag_008", name:"信号灯反应冲刺", targetQualities:["灵敏素质","速度","反应速度"], ageRange:[8,14], difficulty:1, equipment:["cone","disc"], duration:8, sets:"5组", reps:"每组5次", restBetween:"45秒", description:"用红/绿标志盘模拟信号灯，红=原地不动、绿=5米冲刺。教练随机举色盘，学生快速反应", coachingPoints:"注意力集中，反应要快；冲刺时全力加速", safetyNotes:"确保冲刺方向无障碍物",
              levels:{ regression:{name:'单色冲刺',sets:'4组',reps:'5米',restBetween:'60秒',coaching:'只用绿色信号，简化反应'} , progression:{name:'三色+变向',sets:'6组',reps:'5米+变向',restBetween:'30秒',coaching:'三色信号，加入变向动作提升复杂度'} } },
            { id:"ag_009", name:"绳梯侧向灵敏", targetQualities:["灵敏素质","协调性","下肢爆发力"], ageRange:[8,14], difficulty:2, equipment:["ladder"], duration:8, sets:"4种×3组", reps:"每种1趟", restBetween:"45秒", description:"绳横向放置，侧向移动完成各种步法：侧向入格→交叉步→侧向进进出出→快速侧向", coachingPoints:"侧向移动注重左右均衡；前脚掌着地快速蹬地", safetyNotes:"绳梯需平铺固定；注意两侧空间",
              levels:{ regression:{name:'侧向慢速入格',sets:'2种×2组',reps:'1趟',restBetween:'60秒',coaching:'先掌握侧向入格基本步法'} , progression:{name:'侧向+冲刺变向',sets:'5种×3组',reps:'1趟+5米冲刺',restBetween:'30秒',coaching:'侧向步法完成后立即冲刺变向'} } }
        ],
        strength: [
            { id:"st_001", name:"动物步行力量循环", targetQualities:["核心力量","上肢力量","协调性"], ageRange:[6,10], difficulty:1, equipment:["none"], duration:10, sets:"3组循环", reps:"每个动作10米", restBetween:"60秒", description:"循环：熊爬→螃蟹爬→毛毛虫爬→青蛙跳→鸭子走，每个10米", coachingPoints:"保持核心收紧，动作标准比速度重要", safetyNotes:"6-9岁以全身各部位肌肉力量训练为主，避免负重" ,
              levels:{ regression:{name:'单一动物步行',sets:'2组',reps:'每个动作5米',restBetween:'60秒',coaching:'先掌握单个动作，缩短距离'} , progression:{name:'动物步行+负重',sets:'3组',reps:'每个动作15米',restBetween:'45秒',coaching:'增加距离，可穿轻量负重背心提升负荷'} } },
            { id:"st_002", name:"自重力量循环", targetQualities:["核心力量","上肢力量","肌肉耐力"], ageRange:[10,15], difficulty:2, equipment:["yoga_mat"], duration:12, sets:"3-4组循环", reps:"每个动作30秒", restBetween:"60秒", description:"瑜伽垫上：俯卧撑(可屈膝)→平板支撑→仰卧起坐→臀桥→侧平板(每侧)，各30秒", coachingPoints:"注重动作质量而非数量；身体成一条直线", safetyNotes:"12-15岁以徒手力量为主，强度不宜过大；避免憋气" ,
              levels:{ regression:{name:'屈膝俯卧撑+短时平板',sets:'3组',reps:'每个15秒',restBetween:'60秒',coaching:'降低难度，屈膝俯卧撑，平板支撑时间减半'} , progression:{name:'标准俯卧撑+加长平板',sets:'4组',reps:'每个45秒',restBetween:'45秒',coaching:'标准俯卧撑，延长支撑时间提升耐力'} } },
            { id:"st_003", name:"网球投掷力量训练", targetQualities:["上肢力量","核心力量","下肢爆发力"], ageRange:[10,18], difficulty:2, equipment:["tennis","cone"], duration:10, sets:"4组", reps:"每组8-10次", restBetween:"60秒", description:"用网球进行：过头抛球→转体抛球→下蹲推球→侧抛球，各8-10次。标志桶标记投掷目标", coachingPoints:"发力从下肢开始经核心传递到上肢；全身协调发力；注重出手速度", safetyNotes:"网球较轻，注重动作模式训练而非绝对力量" ,
              levels:{ regression:{name:'近距离投掷',sets:'3组',reps:'6次',restBetween:'60秒',coaching:'缩短投掷距离，注重基本发力模式'} , progression:{name:'远距离+目标投掷',sets:'5组',reps:'10次',restBetween:'45秒',coaching:'增加距离和目标精度，提升爆发力和控制力'} } },
            { id:"st_004", name:"弹力带力量训练", targetQualities:["上肢力量","核心力量","下肢爆发力"], ageRange:[12,18], difficulty:2, equipment:["band"], duration:12, sets:"3组", reps:"每个动作12-15次", restBetween:"45秒", description:"弹力带：深蹲划船→站姿推举→站姿划船→侧向行走→胸前推，各12-15次", coachingPoints:"动作匀速有控制，注重离心阶段；核心始终收紧", safetyNotes:"12-15岁着重发展快速力量；弹力带需检查无破损" ,
              levels:{ regression:{name:'轻阻力弹力带',sets:'2组',reps:'10次',restBetween:'60秒',coaching:'使用轻阻力弹力带，注重动作标准'} , progression:{name:'重阻力+复合动作',sets:'4组',reps:'15次',restBetween:'45秒',coaching:'增加阻力，结合多关节复合动作提升训练效率'} } },
            { id:"st_005", name:"栏架跳跃力量组合", targetQualities:["下肢爆发力","速度力量"], ageRange:[10,18], difficulty:2, equipment:["low_hurdle","high_hurdle","jump_mat"], duration:10, sets:"4组", reps:"每个动作6-8次", restBetween:"60-90秒", description:"连续跳过低栏架6次→跳远垫上立定跳远6次→连续跳过高栏架8次→单腿跳(每侧5次)→侧向跳跃栏架8次", coachingPoints:"每次全力爆发；落地屈膝屈髋缓冲；注重落地稳定性", safetyNotes:"10-13岁以低栏架为主；膝盖不要内扣" ,
              levels:{ regression:{name:'低栏架跳跃',sets:'3组',reps:'4次',restBetween:'90秒',coaching:'仅用低栏架，减少次数注重落地技术'} , progression:{name:'高栏架+组合跳',sets:'5组',reps:'8次',restBetween:'60秒',coaching:'加入高栏架和组合跳跃，提升爆发力和协调性'} } },
            { id:"st_006", name:"核心稳定性训练", targetQualities:["核心力量","平衡能力"], ageRange:[10,18], difficulty:2, equipment:["yoga_mat"], duration:10, sets:"3组", reps:"每个动作30-45秒", restBetween:"30秒", description:"瑜伽垫上：平板支撑→侧平板(每侧)→臀桥→死虫式→鸟狗式→登山者，各30-45秒", coachingPoints:"核心始终收紧，骨盆中立位；呼吸均匀不憋气", safetyNotes:"腰部不适者降低时长或改为膝支撑" ,
              levels:{ regression:{name:'短时核心支撑',sets:'2组',reps:'每个20秒',restBetween:'30秒',coaching:'缩短支撑时间，注重骨盆中立位'} , progression:{name:'长时+动态核心',sets:'4组',reps:'每个60秒',restBetween:'20秒',coaching:'延长支撑时间并加入动态动作，提升核心耐力'} } },
            { id:"st_007", name:"弹力带进阶力量训练", targetQualities:["上肢力量","核心力量","下肢爆发力"], ageRange:[15,18], difficulty:3, equipment:["band"], duration:15, sets:"3-4组", reps:"每个动作10-12次", restBetween:"60-90秒", description:"弹力带：高脚杯深蹲→弹力带推举→弹力带划船→弓步蹲→罗马尼亚硬拉，各10-12次", coachingPoints:"深蹲膝盖对准脚尖，背部平直；注重离心阶段控制", safetyNotes:"仅限15岁以上；弹力带阻力从轻开始逐步增加" ,
              levels:{ regression:{name:'轻阻力基础动作',sets:'2组',reps:'8次',restBetween:'90秒',coaching:'使用轻弹力带，注重深蹲和推举的基本动作模式'} , progression:{name:'重阻力+单侧训练',sets:'4组',reps:'12次',restBetween:'60秒',coaching:'增加阻力，加入单侧训练提升核心抗旋转能力'} } },
            { id:"st_008", name:"引体向上进阶训练", targetQualities:["上肢力量","核心力量"], ageRange:[12,18], difficulty:2, equipment:["band"], duration:12, sets:"4组", reps:"每组力竭", restBetween:"90秒", description:"弹力带辅助引体向上：用弹力带绕于单杠辅助，完成引体向上。从厚带(辅助大)逐步过渡到薄带(辅助小)，最终过渡到自重引体", coachingPoints:"发力时肩胛骨下回旋，胸部触杠；下放时缓慢控制(2-3秒)；核心始终收紧", safetyNotes:"中考引体向上专项训练；需有单杠设施；弹力带辅助量根据能力调整" ,
              levels:{ regression:{name:'厚弹力带辅助',sets:'3组',reps:'5次',restBetween:'90秒',coaching:'使用厚弹力带提供较大辅助，先掌握动作模式'} , progression:{name:'自重引体+负重',sets:'5组',reps:'力竭',restBetween:'120秒',coaching:'过渡到自重引体，可穿轻量负重背心提升负荷'} } }
        ],
        endurance: [
            { id:"en_001", name:"趣味接力耐力跑", targetQualities:["心肺耐力","速度"], ageRange:[8,12], difficulty:1, equipment:["cone"], duration:12, sets:"3-4轮", reps:"每轮200-400米", restBetween:"90秒", description:"用标志桶标记接力路线，分组200-400米接力跑，每人跑50-100米后交接", coachingPoints:"中等强度心率150-170次/分；注重团队配合和节奏感", safetyNotes:"8岁以上可进行有氧耐力练习；负荷不宜过大" ,
              levels:{ regression:{name:'短距接力跑',sets:'2轮',reps:'100米',restBetween:'120秒',coaching:'缩短距离，注重基本跑姿和呼吸节奏'} , progression:{name:'长距接力+计时',sets:'4轮',reps:'400米',restBetween:'60秒',coaching:'增加距离并计时，提升有氧耐力和配速控制'} } },
            { id:"en_002", name:"间歇跑训练", targetQualities:["心肺耐力","速度耐力"], ageRange:[11,15], difficulty:2, equipment:["cone"], duration:12, sets:"6-8组", reps:"200米", restBetween:"60-90秒慢走", description:"用标志桶标记200米距离，中高强度跑(心率170-185次/分)，间歇60-90秒慢走恢复", coachingPoints:"11-12岁以有氧为主心率160-175次/分；注重呼吸节奏", safetyNotes:"11-12岁主要为有氧训练；有心律问题者需医生评估" ,
              levels:{ regression:{name:'长间歇慢速跑',sets:'4组',reps:'200米',restBetween:'120秒',coaching:'降低配速，延长间歇，先建立有氧基础'} , progression:{name:'短间歇高速跑',sets:'8组',reps:'200米',restBetween:'45秒',coaching:'提升配速缩短间歇，增加无氧训练比例'} } },
            { id:"en_003", name:"法特莱克跑", targetQualities:["心肺耐力","速度"], ageRange:[10,18], difficulty:2, equipment:["none"], duration:15, sets:"1组", reps:"15分钟", restBetween:"无固定休息", description:"变速跑：快跑30秒→慢跑1分钟→快跑1分钟→慢走2分钟交替进行15分钟", coachingPoints:"快跑心率达170-180，慢跑/走降至130-140；自主调控节奏", safetyNotes:"选择平整安全路线；10-12岁快跑比例不超过30%" ,
              levels:{ regression:{name:'短时法特莱克',sets:'1组',reps:'10分钟',restBetween:'无',coaching:'缩短总时间，快跑比例降低'} , progression:{name:'长时+高比例快跑',sets:'1组',reps:'20分钟',restBetween:'无',coaching:'延长时间，增加快跑比例，提升有氧无氧混合能力'} } },
            { id:"en_004", name:"游戏化耐力-追逐跑", targetQualities:["心肺耐力","灵敏素质","协调性"], ageRange:[8,12], difficulty:1, equipment:["cone"], duration:12, sets:"3轮", reps:"每轮3-4分钟", restBetween:"60秒", description:"标志桶划定区域内1-2人当'追捕者'追逐其他人，被追到者原地5个开合跳后成为追捕者", coachingPoints:"持续移动不静止；注重变向和加速结合", safetyNotes:"场地有足够空间和缓冲" ,
              levels:{ regression:{name:'小场地追逐',sets:'2轮',reps:'2分钟',restBetween:'60秒',coaching:'缩小场地降低强度，注重持续移动'} , progression:{name:'大场地+多人追逐',sets:'4轮',reps:'4分钟',restBetween:'45秒',coaching:'扩大场地增加人数，提升持续高强度移动能力'} } },
            { id:"en_005", name:"栏架连续跳耐力", targetQualities:["心肺耐力","协调性","肌肉耐力"], ageRange:[8,18], difficulty:2, equipment:["low_hurdle"], duration:10, sets:"5组", reps:"每组2分钟", restBetween:"45秒", description:"连续跳跃低栏架2分钟×5组(8-10个栏架循环跳)，组间休息45秒，可变换跳法保持节奏", coachingPoints:"匀速心率150-170次/分；前脚掌着地膝盖微屈", safetyNotes:"选择平整地面；手腕和膝盖有伤者降低强度" ,
              levels:{ regression:{name:'低栏架慢跳',sets:'3组',reps:'1分钟',restBetween:'60秒',coaching:'降低栏架高度和跳跃速度，注重节奏'} , progression:{name:'变跳法+加速跳',sets:'6组',reps:'2分钟',restBetween:'30秒',coaching:'变换跳法并加速，提升协调性和心肺负荷'} } },
            { id:"en_006", name:"400米间歇跑", targetQualities:["速度耐力","心肺耐力"], ageRange:[13,18], difficulty:3, equipment:["cone"], duration:15, sets:"4-5组", reps:"400米", restBetween:"2-3分钟", description:"用标志桶标记400米距离，中高强度跑(目标配速比全力慢10-15%)，间歇2-3分钟慢走", coachingPoints:"13-14岁逐步增加无氧耐力；注重配速控制和呼吸", safetyNotes:"仅限13岁以上；充分热身后进行" ,
              levels:{ regression:{name:'300米间歇',sets:'3组',reps:'300米',restBetween:'3分钟',coaching:'缩短距离，注重配速控制'} , progression:{name:'500米间歇+短间歇',sets:'5组',reps:'400米',restBetween:'90秒',coaching:'增加距离缩短间歇，提升乳酸耐受能力'} } },
            { id:"en_007", name:"1000米/800米配速训练", targetQualities:["心肺耐力","速度耐力"], ageRange:[13,18], difficulty:2, equipment:["cone","tape"], duration:15, sets:"3-4组", reps:"400米", restBetween:"2分钟", description:"用皮尺和标志桶精确标记400米圈道。按目标配速跑400米(男生1000米目标配速÷2.5，女生800米目标配速÷2)，间歇2分钟。培养配速感", coachingPoints:"前200米控制节奏不可过快；中间200米保持稳定；呼吸两步一呼两步一吸；最后100米可适当加速", safetyNotes:"中考1000米/800米专项训练；有心律问题者需医生评估" ,
              levels:{ regression:{name:'400米慢配速',sets:'2组',reps:'400米',restBetween:'3分钟',coaching:'以慢于目标配速10秒的速度跑，建立配速感'} , progression:{name:'600米+目标配速',sets:'4组',reps:'400米',restBetween:'90秒',coaching:'以目标配速或更快的速度跑，提升比赛配速能力'} } }
        ],
        flexibility: [
            { id:"fl_001", name:"全身静态拉伸", targetQualities:["柔韧性"], ageRange:[6,18], difficulty:1, equipment:["yoga_mat"], duration:8, sets:"1组", reps:"每个动作15-30秒", description:"瑜伽垫上主要肌群静态拉伸：股四头肌→腘绳肌→小腿→髋屈肌→臀大肌→背阔肌→胸大肌→肩部", coachingPoints:"拉伸到紧绷无痛感位置；深呼吸放松；不弹震", safetyNotes:"柔韧性敏感期应重点训练；13-16岁快速生长期幅度宜小" ,
              levels:{ regression:{name:'短时轻柔拉伸',sets:'1组',reps:'每个10-15秒',restBetween:'无',coaching:'缩短拉伸时间，幅度宜小，注重放松'} , progression:{name:'长时深度拉伸',sets:'2组',reps:'每个30-45秒',restBetween:'无',coaching:'延长拉伸时间加深幅度，配合PNF收缩放松技巧'} } },
            { id:"fl_002", name:"PNF拉伸", targetQualities:["柔韧性"], ageRange:[12,18], difficulty:2, equipment:["yoga_mat","band"], duration:8, sets:"1组", reps:"每个肌群2轮", description:"瑜伽垫上同伴辅助或弹力带辅助PNF：被动拉伸至紧绷位→主动收缩6秒→放松→加深拉伸", coachingPoints:"收缩时对抗阻力约70%；放松阶段呼气加深", safetyNotes:"仅限12岁以上；感觉疼痛立即停止" ,
              levels:{ regression:{name:'弹力带轻辅助',sets:'1组',reps:'每肌群1轮',restBetween:'无',coaching:'使用轻阻力弹力带，注重基本拉伸感'} , progression:{name:'同伴辅助+深位PNF',sets:'2组',reps:'每肌群3轮',restBetween:'无',coaching:'同伴辅助加深拉伸幅度，增加PNF轮次提升效果'} } },
            { id:"fl_003", name:"瑜伽流动放松", targetQualities:["柔韧性","平衡能力","协调性"], ageRange:[8,18], difficulty:1, equipment:["yoga_mat"], duration:8, sets:"1组", reps:"每个体式3-5次呼吸", description:"瑜伽垫上：猫牛式→下犬式→婴儿式→鸽子式→坐姿前屈→快乐婴儿式，每个3-5次呼吸", coachingPoints:"配合呼吸节奏流动；不追求体式深度，注重身体感受", safetyNotes:"膝盖不适者垫毛巾" ,
              levels:{ regression:{name:'简化体式流动',sets:'1组',reps:'4个体式',restBetween:'无',coaching:'选择简单体式，注重呼吸和放松'} , progression:{name:'完整体式+平衡挑战',sets:'2组',reps:'8个体式',restBetween:'无',coaching:'增加体式数量和难度，加入平衡挑战体式'} } },
            { id:"fl_004", name:"坐位体前屈专项训练", targetQualities:["柔韧性"], ageRange:[10,18], difficulty:1, equipment:["yoga_mat"], duration:8, sets:"1组", reps:"每个动作20-30秒×3轮", description:"瑜伽垫上坐姿体前屈专项：直腿坐体前屈(保持20秒)→分腿体前屈(每侧20秒)→单腿体前屈(每侧20秒)→同伴辅助加深(20秒)，循环3轮", coachingPoints:"从髋部折叠而非弯腰；膝盖伸直但不锁死；呼气时加深幅度；中考坐位体前屈专项训练", safetyNotes:"不要弹震式拉伸；拉伸感为紧绷而非疼痛" ,
              levels:{ regression:{name:'微屈膝前屈',sets:'1组',reps:'每个15秒×2轮',restBetween:'无',coaching:'膝盖微屈降低难度，先建立基本拉伸感'} , progression:{name:'直腿+负重前屈',sets:'1组',reps:'每个30秒×4轮',restBetween:'无',coaching:'膝盖完全伸直，可手持轻重量加深幅度'} } }
        ],
        coordination: [
            { id:"co_001", name:"网球抛接协调训练", targetQualities:["协调性","反应速度"], ageRange:[6,12], difficulty:1, equipment:["tennis"], duration:8, sets:"4-5种练习×3组", reps:"每组10-15次", restBetween:"30秒", description:"用网球进行：自抛自接→双手交替抛接→对墙抛接→双人互抛→抛球击掌后接球", coachingPoints:"眼睛盯球，手部提前准备；注重节奏感", safetyNotes:"6-9岁发展一般协调能力，以多样化体验为主" ,
              levels:{ regression:{name:'双手自抛自接',sets:'2种×2组',reps:'8次',restBetween:'45秒',coaching:'先从双手自抛自接练起，注重手眼协调'} , progression:{name:'多球+非对称抛接',sets:'5种×3组',reps:'15次',restBetween:'20秒',coaching:'增加练习种类和次数，加入非对称动作提升挑战'} } },
            { id:"co_002", name:"绳梯手脚协调组合", targetQualities:["协调性","灵敏素质"], ageRange:[8,14], difficulty:2, equipment:["ladder"], duration:10, sets:"4-5种组合×3组", reps:"每种组合1趟", restBetween:"30秒", description:"绳梯上：高抬腿入格→开合跳入格→单双脚交替跳→手脚不对称动作", coachingPoints:"先慢速掌握动作模式再加快；注重左右协调", safetyNotes:"9-13岁发展专门协调能力，可结合专项技术" ,
              levels:{ regression:{name:'单步法慢速',sets:'2种×2组',reps:'1趟',restBetween:'45秒',coaching:'先掌握单一步法，慢速注重准确性'} , progression:{name:'组合步法+变向',sets:'5种×3组',reps:'1趟',restBetween:'20秒',coaching:'组合多种步法并加入变向，提升复杂协调能力'} } },
            { id:"co_003", name:"节奏拍打游戏", targetQualities:["协调性","反应速度"], ageRange:[6,10], difficulty:1, equipment:["none"], duration:8, sets:"3-4轮", reps:"每轮2分钟", restBetween:"30秒", description:"教练拍手打节奏(快/慢/停/变)，学生根据节奏做相应动作(快跑/慢走/定住/变方向)", coachingPoints:"6-12岁是节奏感发展敏感期；从简单到复杂循序渐进", safetyNotes:"场地平整无障碍物" ,
              levels:{ regression:{name:'慢速节奏',sets:'2轮',reps:'90秒',restBetween:'30秒',coaching:'教练慢速拍手，学生慢速跟随'} , progression:{name:'变速+停顿节奏',sets:'4轮',reps:'2分钟',restBetween:'15秒',coaching:'教练变速拍手并加入停顿，学生快速反应调整动作'} } },
            { id:"co_004", name:"网球平衡协调挑战", targetQualities:["协调性","平衡能力"], ageRange:[8,14], difficulty:2, equipment:["tennis","low_hurdle"], duration:8, sets:"4个动作×3组", reps:"每个动作30秒", restBetween:"30秒", description:"低栏架上行走+网球抛接→单脚站立+网球抛接→闭眼单脚站立→栏架上侧向行走，各30秒", coachingPoints:"核心收紧目光平视固定点；从简单到难循序渐进", safetyNotes:"9-13岁是平衡能力发展敏感期；栏架旁需有保护者" ,
              levels:{ regression:{name:'单脚站立抛接',sets:'2动作×2组',reps:'20秒',restBetween:'30秒',coaching:'先从单脚站立+抛接练起，降低栏架难度'} , progression:{name:'闭眼+栏架行走进阶',sets:'4动作×3组',reps:'45秒',restBetween:'20秒',coaching:'增加闭眼和栏架行走难度，全面提升协调和平衡'} } }
        ],
        balance: [
            { id:"ba_001", name:"单脚平衡挑战", targetQualities:["平衡能力","本体感觉","核心力量"], ageRange:[6,12], difficulty:1, equipment:["none"], duration:6, sets:"3组", reps:"每侧30秒", restBetween:"30秒", description:"单脚站立计时挑战，逐步增加难度：睁眼→闭眼→不稳面→闭眼+不稳面", coachingPoints:"支撑腿微屈核心收紧；目光平视固定点", safetyNotes:"闭眼练习时旁需有保护者" ,
              levels:{ regression:{name:'睁眼双脚交替',sets:'2组',reps:'每侧15秒',restBetween:'30秒',coaching:'先从睁眼双脚交替站练起，缩短时间'} , progression:{name:'闭眼+不稳定面',sets:'4组',reps:'每侧45秒',restBetween:'15秒',coaching:'闭眼并站在平衡垫上，全面提升本体感觉和核心控制'} } },
            { id:"ba_002", name:"栏架动态平衡行走", targetQualities:["平衡能力","协调性","核心力量"], ageRange:[8,14], difficulty:2, equipment:["low_hurdle","cone"], duration:8, sets:"3组", reps:"每种走法2趟(5米)", restBetween:"30秒", description:"将低栏架排列成5米行走路线：正常走→侧向走→倒退走→头顶网球走→闭眼走", coachingPoints:"脚跟到脚尖依次着地；手臂张开维持平衡", safetyNotes:"9-13岁是平衡敏感期；栏架高度不超过30cm" ,
              levels:{ regression:{name:'正常走+侧向走',sets:'2组',reps:'各1趟',restBetween:'30秒',coaching:'先掌握正常走和侧向走，降低栏架高度'} , progression:{name:'闭眼走+头顶球',sets:'4组',reps:'各2趟',restBetween:'15秒',coaching:'增加闭眼行走和头顶网球，提升动态平衡和专注力'} } }
        ],
        cooldown: [
            { id:"cd_001", name:"慢跑+步行放松", targetQualities:["心肺耐力"], ageRange:[6,18], difficulty:1, equipment:["none"], duration:4, sets:"1组", reps:"4分钟", description:"慢跑1分钟→快走1分钟→慢走2分钟，使心率逐步降至100次/分以下", coachingPoints:"呼吸逐渐放缓；保持身体直立放松", safetyNotes:"不要训练后立即坐下或躺下" },
            { id:"cd_002", name:"弹力带辅助拉伸放松", targetQualities:["柔韧性","肌肉耐力"], ageRange:[10,18], difficulty:1, equipment:["band","yoga_mat"], duration:6, sets:"1组", reps:"每个部位30-60秒", description:"瑜伽垫上用弹力带辅助拉伸：小腿后侧→大腿后侧→大腿前侧→臀部→肩部，每部位30-60秒", coachingPoints:"弹力带提供适度牵拉力，缓慢加深；避免直接牵拉关节", safetyNotes:"10岁以上适合；弹力带力度适中" },
            { id:"cd_003", name:"呼吸放松+冥想", targetQualities:["柔韧性"], ageRange:[6,18], difficulty:1, equipment:["yoga_mat"], duration:5, sets:"1组", reps:"5分钟", description:"瑜伽垫上仰卧闭眼，腹式呼吸：吸气4秒→屏息4秒→呼气6秒→停顿2秒。配合身体扫描", coachingPoints:"呼吸深长缓慢腹部起伏；环境安静；低龄儿童简化为'吹气球'", safetyNotes:"不强迫闭眼，尊重学生感受" },
            { id:"cd_004", name:"双人互拉伸展", targetQualities:["柔韧性"], ageRange:[10,18], difficulty:1, equipment:["yoga_mat"], duration:6, sets:"1组", reps:"每个动作15-20秒", description:"瑜伽垫上两人互助拉伸：背靠背坐姿体前屈→仰卧腿后侧拉伸→肩部拉伸→体侧拉伸", coachingPoints:"搭档间保持沟通；动作缓慢温和；配合呼吸加深幅度", safetyNotes:"10岁以上适合；同伴需听从指令不过度用力" }
        ],
        weight_loss: [
            { id:"wl_001", name:"HIIT燃脂循环", targetQualities:["心肺耐力","下肢爆发力","核心力量"], ageRange:[10,18], difficulty:2, equipment:["cone","ladder"], duration:15, sets:"4-5轮循环", reps:"每个动作30秒", restBetween:"轮间60秒", description:"标志桶标记站点+绳梯，循环：绳梯快速步法30秒→标志桶折返冲刺30秒→开合跳30秒→波比跳30秒→高抬腿30秒。每轮间休息60秒", coachingPoints:"每个动作全力输出，保持高心率(170-185次/分)；注重动作质量；可根据体能调整工作和休息比例", safetyNotes:"BMI超过28的学生降低跳跃高度和频率；运动前充分热身" ,
              levels:{ regression:{name:'低强度循环',sets:'3轮',reps:'每个20秒',restBetween:'90秒',coaching:'降低每个动作时间，延长休息，注重动作质量'} , progression:{name:'高强度+加时',sets:'5轮',reps:'每个40秒',restBetween:'45秒',coaching:'增加每轮时间和轮数，提升心率和燃脂效率'} } },
            { id:"wl_002", name:"栏架Tabata燃脂", targetQualities:["心肺耐力","下肢爆发力","肌肉耐力"], ageRange:[10,18], difficulty:2, equipment:["low_hurdle","high_hurdle"], duration:12, sets:"8组Tabata", reps:"20秒运动/10秒休息", restBetween:"组间10秒", description:"Tabata模式(20秒全力/10秒休息×8组)：栏架连续跳→休息→高栏架跳跃→休息→交替进行8轮", coachingPoints:"20秒内全力输出；心率保持在最大心率的80-90%；注重呼吸节奏", safetyNotes:"BMI超过28的学生仅用低栏架；膝盖不适者改为无跳跃版本" ,
              levels:{ regression:{name:'低栏架Tabata',sets:'6组',reps:'20秒/15秒休息',restBetween:'15秒',coaching:'仅用低栏架，减少组数，增加休息'} , progression:{name:'高低栏交替Tabata',sets:'10组',reps:'20秒/5秒休息',restBetween:'5秒',coaching:'高低栏交替跳跃，增加组数缩短休息，提升强度'} } },
            { id:"wl_003", name:"抢占领地有氧游戏", targetQualities:["心肺耐力","灵敏素质","协调性"], ageRange:[8,14], difficulty:1, equipment:["cone","disc"], duration:12, sets:"4轮", reps:"每轮3分钟", restBetween:"60秒", description:"用标志桶和标志盘在场地上设置多个'领地'(小方格)，学生需在3分钟内尽可能多地跑动占领领地(放标志盘)。每轮统计占领数量", coachingPoints:"持续高速移动；注重变向和冲刺结合；保持高心率", safetyNotes:"场地需有足够空间；避免多人同时冲向同一领地" ,
              levels:{ regression:{name:'小场地慢速占领',sets:'3轮',reps:'2分钟',restBetween:'90秒',coaching:'缩小场地降低强度，注重持续移动'} , progression:{name:'大场地+计时占领',sets:'5轮',reps:'3分钟',restBetween:'45秒',coaching:'扩大场地并计时，提升持续高强度移动能力'} } },
            { id:"wl_004", name:"弹力带燃脂循环", targetQualities:["心肺耐力","上肢力量","核心力量"], ageRange:[12,18], difficulty:2, equipment:["band"], duration:12, sets:"4轮循环", reps:"每个动作40秒", restBetween:"轮间45秒", description:"弹力带循环：深蹲推举40秒→弹力带划船40秒→弹力带深蹲跳40秒→俯卧撑40秒→登山者40秒。每轮间休息45秒", coachingPoints:"每个动作保持中等以上强度；心率维持在160-180次/分；注重动作连贯性", safetyNotes:"12岁以上适合；弹力带阻力适中" ,
              levels:{ regression:{name:'轻阻力+短时',sets:'3轮',reps:'每个30秒',restBetween:'60秒',coaching:'使用轻弹力带，缩短每个动作时间'} , progression:{name:'重阻力+加时',sets:'5轮',reps:'每个50秒',restBetween:'30秒',coaching:'增加阻力和时间，提升肌肉耐力和燃脂效果'} } }
        ],
        height_growth: [
            { id:"hg_001", name:"脊柱伸展拉伸", targetQualities:["柔韧性"], ageRange:[6,16], difficulty:1, equipment:["yoga_mat"], duration:8, sets:"1组", reps:"每个动作20-30秒×2轮", description:"瑜伽垫上脊柱伸展：猫牛式伸展(20秒)→眼镜蛇式(20秒)→婴儿式(20秒)→站立前屈(20秒)→靠墙脊柱伸展(20秒)，循环2轮", coachingPoints:"注重脊柱的纵向伸展感；每个动作配合深呼吸；不追求幅度，注重伸展感", safetyNotes:"追高训练重点：通过脊柱伸展和纵向刺激促进生长板活跃" ,
              levels:{ regression:{name:'短时脊柱伸展',sets:'1组',reps:'每个15秒×1轮',restBetween:'无',coaching:'缩短每个动作时间，注重基本伸展感'} , progression:{name:'长时+深度伸展',sets:'2组',reps:'每个30秒×3轮',restBetween:'无',coaching:'延长伸展时间并加深幅度，配合深呼吸促进生长板活跃'} } },
            { id:"hg_002", name:"纵向跳跃组合", targetQualities:["下肢爆发力","心肺耐力"], ageRange:[8,16], difficulty:2, equipment:["low_hurdle","high_hurdle","jump_mat"], duration:10, sets:"4组", reps:"每个动作8-10次", restBetween:"60秒", description:"全力纵跳摸高10次→连续跳过低栏架8次→跳远垫上全力立定跳远6次→跳过高栏架8次。注重向上方向的跳跃", coachingPoints:"每次跳跃全力向上；落地屈膝缓冲；注重跳跃高度而非距离", safetyNotes:"追高训练重点：纵向跳跃刺激下肢生长板；骨骺未闭合前效果最佳(男16/女14岁前)" ,
              levels:{ regression:{name:'低栏架跳跃',sets:'3组',reps:'6次',restBetween:'90秒',coaching:'仅用低栏架，减少次数注重跳跃质量'} , progression:{name:'高栏架+摸高组合',sets:'5组',reps:'10次',restBetween:'45秒',coaching:'增加栏架高度和跳跃次数，加入摸高提升纵向爆发力'} } },
            { id:"hg_003", name:"悬垂伸展训练", targetQualities:["柔韧性","上肢力量"], ageRange:[8,16], difficulty:1, equipment:["band"], duration:8, sets:"4组", reps:"每组30秒", restBetween:"45秒", description:"弹力带辅助悬垂：将弹力带系于高处单杠，辅助身体悬垂30秒。悬垂时全身放松伸展，感受脊柱和四肢的纵向拉伸", coachingPoints:"悬垂时全身放松，让重力自然拉伸脊柱；手臂伸直；呼吸深长均匀", safetyNotes:"追高训练重点：悬垂利用重力拉伸脊柱间隙；需有单杠设施；弹力带承重需检查" ,
              levels:{ regression:{name:'弹力带辅助悬垂',sets:'3组',reps:'20秒',restBetween:'60秒',coaching:'使用弹力带辅助，缩短悬垂时间'} , progression:{name:'自重悬垂+摆动',sets:'5组',reps:'45秒',restBetween:'30秒',coaching:'过渡到自重悬垂，加入轻摆动增加脊柱拉伸效果'} } },
            { id:"hg_004", name:"全身伸展放松", targetQualities:["柔韧性","平衡能力"], ageRange:[6,16], difficulty:1, equipment:["yoga_mat"], duration:10, sets:"1组", reps:"每个动作30秒×2轮", description:"瑜伽垫上全身伸展：仰卧脊柱扭转(每侧30秒)→仰卧腿后侧拉伸(每侧30秒)→猫牛式(30秒)→下犬式(30秒)→站立体侧屈(每侧30秒)→靠墙腿伸展(30秒)，循环2轮", coachingPoints:"每个动作缓慢进入，配合呼吸加深；注重全身各部位的纵向伸展感", safetyNotes:"追高训练重点：训练后充分拉伸促进生长激素分泌和肌肉恢复" ,
              levels:{ regression:{name:'短时放松伸展',sets:'1组',reps:'每个15秒×1轮',restBetween:'无',coaching:'缩短伸展时间，注重放松感'} , progression:{name:'长时+全身深度放松',sets:'2组',reps:'每个45秒×3轮',restBetween:'无',coaching:'延长伸展时间，加深幅度，促进生长激素分泌和肌肉恢复'} } }
        ],
        exam_prep: [
            { id:"ex_001", name:"1000米/800米配速训练", targetQualities:["心肺耐力","速度耐力"], ageRange:[13,15], difficulty:2, equipment:["cone","tape"], duration:15, sets:"3-4组", reps:"400米", restBetween:"2分钟", description:"皮尺标记400米圈道。按目标配速跑400米(男生1000米目标÷2.5，女生800米目标÷2)，间歇2分钟。培养配速感", coachingPoints:"前200米控制节奏不可过快；中间200米保持稳定；呼吸两步一呼两步一吸；最后100米可适当加速", safetyNotes:"中考中长跑专项；有心律问题者需医生评估" ,
              levels:{ regression:{name:'慢配速400米',sets:'2组',reps:'400米',restBetween:'3分钟',coaching:'以慢于目标配速10秒的速度跑，建立配速感'} , progression:{name:'目标配速+600米',sets:'4组',reps:'400米',restBetween:'90秒',coaching:'以目标配速跑，缩短间歇，提升比赛能力'} } },
            { id:"ex_002", name:"50米冲刺技术训练", targetQualities:["速度"], ageRange:[12,15], difficulty:2, equipment:["cone","tape"], duration:10, sets:"5-6组", reps:"50米", restBetween:"90秒", description:"皮尺精确测量50米，标志桶标记起终点和30米处。练习起跑→加速→途中跑→冲刺四阶段技术", coachingPoints:"起跑(0-10m)重心低步频快；加速(10-30m)逐步抬体加大步幅；途中跑(30-45m)保持最高速度；冲刺(45-50m)不减速", safetyNotes:"中考50米跑专项；充分热身后进行" ,
              levels:{ regression:{name:'分段技术练习',sets:'4组',reps:'10-15米分段',restBetween:'90秒',coaching:'分阶段练习不跑全程，先纠正技术'} , progression:{name:'50米模拟测试',sets:'6组',reps:'50米全程',restBetween:'120秒',coaching:'模拟考试全程计时，注重技术稳定性'} } },
            { id:"ex_003", name:"立定跳远技术训练", targetQualities:["下肢爆发力"], ageRange:[12,15], difficulty:2, equipment:["jump_mat","tape","cone"], duration:12, sets:"5组", reps:"每组3-5次", restBetween:"90秒", description:"跳远垫上练习立定跳远：预摆技术(3次)→起跳技术(3次)→腾空技术(3次)→落地技术(3次)→完整技术(5次)。用皮尺测量距离", coachingPoints:"预摆时手臂上摆同时屈膝；起跳时蹬地充分展体；腾空时收腹举腿；落地时屈膝前扑。中考立定跳远专项", safetyNotes:"落地区域需有缓冲；膝盖不要内扣" ,
              levels:{ regression:{name:'分解技术练习',sets:'3组',reps:'每阶段3次',restBetween:'90秒',coaching:'分阶段练习预摆、起跳、腾空、落地，不跳完整'} , progression:{name:'完整技术+测距',sets:'6组',reps:'5次完整',restBetween:'60秒',coaching:'完整跳远并测量距离，模拟比赛流程'} } },
            { id:"ex_004", name:"引体向上进阶训练", targetQualities:["上肢力量","核心力量"], ageRange:[12,15], difficulty:2, equipment:["band"], duration:12, sets:"4组", reps:"每组力竭", restBetween:"90秒", description:"弹力带辅助引体向上：从厚带(辅助大)逐步过渡到薄带(辅助小)，最终过渡到自重引体。每组做到力竭", coachingPoints:"发力时肩胛骨下回旋，胸部触杠；下放时缓慢控制(2-3秒)；核心始终收紧。中考引体向上(男)专项", safetyNotes:"需有单杠设施；弹力带辅助量根据能力调整" ,
              levels:{ regression:{name:'厚弹力带辅助',sets:'3组',reps:'3次',restBetween:'90秒',coaching:'使用厚弹力带较大辅助，先掌握动作模式'} , progression:{name:'自重引体+负重',sets:'5组',reps:'力竭',restBetween:'120秒',coaching:'过渡到自重引体，可穿轻量负重背心'} } },
            { id:"ex_005", name:"仰卧起坐技术训练", targetQualities:["核心力量","肌肉耐力"], ageRange:[12,15], difficulty:2, equipment:["yoga_mat"], duration:10, sets:"4组", reps:"每组1分钟", restBetween:"60秒", description:"瑜伽垫上1分钟仰卧起坐：先做标准技术练习(10个慢速)→1分钟计时测试×4组。注重动作规范性和节奏感", coachingPoints:"双手交叉贴脑后；起身时肘触膝；下落时肩胛骨触垫；保持匀速节奏不借力。中考仰卧起坐(女)专项", safetyNotes:"腰部不适者降低组数；避免抱头借力" ,
              levels:{ regression:{name:'技术练习+短时',sets:'3组',reps:'30秒',restBetween:'60秒',coaching:'先做标准技术练习10个慢速，再30秒短时'} , progression:{name:'1分钟模拟测试',sets:'5组',reps:'1分钟',restBetween:'45秒',coaching:'模拟考试1分钟计时，注重动作规范性和速度维持'} } },
            { id:"ex_006", name:"跳绳专项训练", targetQualities:["协调性","心肺耐力","肌肉耐力"], ageRange:[12,15], difficulty:2, equipment:["jump_rope"], duration:12, sets:"5组", reps:"1分钟", restBetween:"45秒", description:"1分钟跳绳计时训练×5组：先做技术练习(单脚交替跳)→1分钟计时测试。注重手腕摇绳和脚步节奏", coachingPoints:"前脚掌着地，膝盖微屈；手腕小幅度摇绳；保持匀速节奏。中考跳绳专项", safetyNotes:"需要跳绳器材（当前器材清单中未包含，需额外准备）" ,
              levels:{ regression:{name:'慢速技术练习',sets:'3组',reps:'30秒',restBetween:'60秒',coaching:'先做慢速技术练习注重手脚配合'} , progression:{name:'1分钟模拟测试',sets:'6组',reps:'1分钟',restBetween:'30秒',coaching:'模拟考试1分钟计时，注重速度和耐力维持'} } },
            { id:"ex_007", name:"实心球投掷技术训练", targetQualities:["上肢力量","核心力量","下肢爆发力"], ageRange:[12,15], difficulty:2, equipment:["solid_ball","cone","tape"], duration:12, sets:"5组", reps:"每组5-8次", restBetween:"90秒", description:"用实心球练习原地双手正面投掷：站立姿势→持球→引球→蹬地→腰腹发力→出手。用皮尺测量距离，标志桶标记目标", coachingPoints:"双脚与肩同宽，微屈膝；引球时身体后仰重心在后；蹬地→腰腹→手臂依次发力；出手角度约38-42度。中考实心球专项", safetyNotes:"需要实心球器材（当前器材清单中未包含，需额外准备）" ,
              levels:{ regression:{name:'短距投掷',sets:'3组',reps:'3次',restBetween:'90秒',coaching:'缩短投掷距离，注重基本发力模式'} , progression:{name:'远距+目标投掷',sets:'6组',reps:'8次',restBetween:'60秒',coaching:'增加距离和目标精度，提升爆发力和技术稳定性'} } },
            { id:"ex_008", name:"坐位体前屈专项训练", targetQualities:["柔韧性"], ageRange:[12,15], difficulty:1, equipment:["yoga_mat"], duration:8, sets:"1组", reps:"每个动作20-30秒×3轮", description:"瑜伽垫上坐位体前屈专项：直腿坐体前屈(保持20秒)→分腿体前屈(每侧20秒)→单腿体前屈(每侧20秒)→同伴辅助加深(20秒)，循环3轮", coachingPoints:"从髋部折叠而非弯腰；膝盖伸直但不锁死；呼气时加深幅度。中考坐位体前屈专项", safetyNotes:"不要弹震式拉伸；拉伸感为紧绷而非疼痛" ,
              levels:{ regression:{name:'微屈膝前屈',sets:'1组',reps:'每个15秒×2轮',restBetween:'无',coaching:'膝盖微屈降低难度，先建立拉伸感'} , progression:{name:'直腿+负重前屈',sets:'1组',reps:'每个30秒×4轮',restBetween:'无',coaching:'膝盖伸直，可手持轻重量加深幅度'} } },
            { id:"ex_009", name:"球类绕杆运球训练", targetQualities:["协调性","灵敏素质","速度"], ageRange:[12,15], difficulty:2, equipment:["ball","cone","tape"], duration:12, sets:"5组", reps:"每组2次", restBetween:"60秒", description:"用标志桶按考试标准间距设置绕杆路线(标志桶间距3米，共5-6个)。练习运球绕杆技术，注重球控制和变向速度", coachingPoints:"运球高度不过腰；绕杆时外侧脚蹬地变向，球控制在身体外侧；保持低重心。中考足球/篮球绕杆专项", safetyNotes:"需要足球或篮球器材（当前器材清单中未包含，需额外准备）" ,
              levels:{ regression:{name:'大间距慢速绕杆',sets:'3组',reps:'1次',restBetween:'60秒',coaching:'加大标志桶间距，慢速注重球控制'} , progression:{name:'标准间距+计时绕杆',sets:'6组',reps:'2次',restBetween:'30秒',coaching:'标准间距计时，模拟考试流程提升速度和稳定性'} } }
        ],
        // ==================== NSCA 专业力量与体能训练库 ====================
        // 数据源：NSCA (National Strength and Conditioning Association) Essentials of Strength Training and Conditioning
        // 筛选原则：仅使用上门体育教练可携带器材（弹力带、瑜伽垫、标志桶、栏架等）
        // 适配原则：按 NSCA 长期运动员发展模型 (LTAD) 调整年龄范围和负荷参数
        nsca_pro: [
            { id:"nsca_001", name:"弹力带高脚杯深蹲", targetQualities:["下肢爆发力","核心力量"], ageRange:[10,18], difficulty:2, equipment:["band"], duration:10, sets:"4组", reps:"10-12次", restBetween:"60秒", description:"NSCA推荐下肢力量基础动作。弹力带踩于双脚下方，双手抓握弹力带两端于胸前（高脚杯姿势），下蹲至大腿与地面平行后站起", coachingPoints:"下蹲时膝盖对准脚尖方向，臀部后坐；核心收紧背部保持中立位；站起时臀部和大腿同时发力", safetyNotes:"NSCA标准：膝关节不超过脚尖过多；下蹲深度根据柔韧性调整；弹力带阻力从轻开始",
              levels:{ regression:{name:"徒手深蹲",sets:"3组",reps:"8次",restBetween:"90秒",coaching:"先掌握徒手深蹲动作模式，注重下蹲深度和膝盖对齐"} , progression:{name:"弹力带深蹲跳",sets:"4组",reps:"8次",restBetween:"90秒",coaching:"站起后加入爆发跳跃，提升下肢爆发力，注重落地缓冲"} } },
            { id:"nsca_002", name:"弹力带罗马尼亚硬拉", targetQualities:["核心力量","下肢爆发力"], ageRange:[12,18], difficulty:2, equipment:["band"], duration:10, sets:"4组", reps:"10-12次", restBetween:"60秒", description:"NSCA推荐后链力量动作。弹力带踩于脚下，双手握住两端，髋关节铰链折叠身体向前，感受臀部和大腿后侧拉伸后回到起始位", coachingPoints:"背部始终保持平直，从髋部折叠而非弯腰；膝盖微屈不锁定；下放时感受腘绳肌拉伸", safetyNotes:"NSCA标准：脊柱中立位；下放幅度根据柔韧性决定；腰部不适者立即停止",
              levels:{ regression:{name:"单腿臀桥",sets:"3组",reps:"每侧8次",restBetween:"60秒",coaching:"先掌握臀桥激活后链，再过渡到硬拉模式"} , progression:{name:"单腿弹力带硬拉",sets:"4组",reps:"每侧8次",restBetween:"90秒",coaching:"单腿站立做硬拉，增加平衡挑战，提升单侧后链力量"} } },
            { id:"nsca_003", name:"弹力带站姿推举", targetQualities:["上肢力量","核心力量"], ageRange:[12,18], difficulty:2, equipment:["band"], duration:8, sets:"4组", reps:"10-12次", restBetween:"60秒", description:"NSCA推荐上肢推力动作。弹力带踩于脚下，双手握住两端于肩部，向上推举至头顶，再缓慢回到肩部", coachingPoints:"推举时核心收紧防止腰椎过伸；肩胛骨下沉；下放时离心控制2-3秒", safetyNotes:"NSCA标准：肩关节活动度不足者减小推举幅度；弹力带阻力适中",
              levels:{ regression:{name:"跪姿弹力带推举",sets:"3组",reps:"8次",restBetween:"60秒",coaching:"跪姿降低核心稳定要求，专注于上肢推力"} , progression:{name:"弹力带推举+深蹲",sets:"4组",reps:"10次",restBetween:"90秒",coaching:"深蹲站起后立即推举，全身协调发力，提升训练效率"} } },
            { id:"nsca_004", name:"弹力带站姿划船", targetQualities:["上肢力量","核心力量"], ageRange:[10,18], difficulty:2, equipment:["band"], duration:8, sets:"4组", reps:"12-15次", restBetween:"45秒", description:"NSCA推荐上肢拉力动作。弹力带固定于前方（或踩于脚下），双手握住两端向后划船，肩胛骨后缩", coachingPoints:"划船时肩胛骨先内收再后缩；肘部贴近身体；核心收紧不晃动", safetyNotes:"NSCA标准：肩胛骨稳定是重点；避免腰部借力代偿",
              levels:{ regression:{name:"弹力带坐姿划船",sets:"3组",reps:"10次",restBetween:"60秒",coaching:"坐姿降低核心稳定要求，专注于肩胛骨后缩"} , progression:{name:"弹力带划船+单腿",sets:"4组",reps:"12次",restBetween:"45秒",coaching:"单腿站立做划船，增加平衡和核心抗旋转挑战"} } },
            { id:"nsca_005", name:"分腿蹲（弓步蹲）", targetQualities:["下肢爆发力","核心力量","平衡能力"], ageRange:[10,18], difficulty:2, equipment:["none"], duration:10, sets:"4组", reps:"每侧10次", restBetween:"60秒", description:"NSCA推荐单侧力量训练。前后脚分开呈弓步姿势，后脚下沉至膝盖接近地面后站起，每侧10次", coachingPoints:"前膝对准脚尖；后腿髋部伸展；重心垂直上下而非前后移动；核心收紧", safetyNotes:"NSCA标准：前膝不超过脚尖过多；膝盖不适者减小下蹲幅度",
              levels:{ regression:{name:"后脚垫高分腿蹲",sets:"3组",reps:"每侧8次",restBetween:"60秒",coaching:"后脚放在瑜伽垫或台阶上，降低难度，注重前腿发力"} , progression:{name:"弹力带负重分腿蹲",sets:"4组",reps:"每侧10次",restBetween:"90秒",coaching:"双手持弹力带增加阻力，提升单侧力量训练效果"} } },
            { id:"nsca_006", name:"俯卧撑进阶系统", targetQualities:["上肢力量","核心力量"], ageRange:[10,18], difficulty:2, equipment:["yoga_mat"], duration:10, sets:"4组", reps:"8-12次", restBetween:"60秒", description:"NSCA上肢推力进阶系统：跪姿俯卧撑→标准俯卧撑→宽距俯卧撑→钻石俯卧撑，根据能力选择级别", coachingPoints:"身体成一条直线；核心收紧不塌腰；下放时胸部接近地面；推起时手臂完全伸展", safetyNotes:"NSCA标准：手腕在肩正下方；手腕不适者用拳面支撑",
              levels:{ regression:{name:"跪姿俯卧撑",sets:"3组",reps:"8次",restBetween:"60秒",coaching:"跪姿降低负荷，先掌握标准动作模式"} , progression:{name:"击掌俯卧撑",sets:"4组",reps:"6次",restBetween:"90秒",coaching:"推起后击掌再落地，提升上肢爆发力"} } },
            { id:"nsca_007", name:"核心抗旋转平板", targetQualities:["核心力量","平衡能力"], ageRange:[10,18], difficulty:2, equipment:["band","yoga_mat"], duration:8, sets:"3组", reps:"每侧8次", restBetween:"45秒", description:"NSCA核心抗旋转训练。弹力带固定于侧面，瑜伽垫上平板支撑姿势，单手拉弹力带至胸前再缓慢放回，对抗弹力带的旋转力", coachingPoints:"身体保持一条直线不旋转；拉绳时呼气；放回时离心控制2秒；核心始终收紧", safetyNotes:"NSCA标准：核心稳定性是力量训练的基础；腰部疼痛立即停止",
              levels:{ regression:{name:"跪姿抗旋转平板",sets:"3组",reps:"每侧6次",restBetween:"45秒",coaching:"跪姿降低核心负荷，专注于抗旋转意识"} , progression:{name:"弹力带平板交替拉",sets:"4组",reps:"每侧10次",restBetween:"30秒",coaching:"左右交替拉弹力带，提升核心动态稳定能力"} } },
            { id:"nsca_008", name:"增强式连续跳跃", targetQualities:["下肢爆发力","心肺耐力"], ageRange:[12,18], difficulty:3, equipment:["low_hurdle","high_hurdle","jump_mat"], duration:10, sets:"5组", reps:"每组8-10次", restBetween:"90秒", description:"NSCA增强式训练（Plyometric）。连续跳过低栏架8次→跳远垫上全力跳远6次→跳过高栏架8次，注重触地时间短和爆发力", coachingPoints:"触地时间越短越好；落地时屈膝屈髋缓冲；每次跳跃全力爆发向上；手臂配合摆动", safetyNotes:"NSCA标准：增强式训练前需有力量基础（深蹲1RM≥自重）；仅限12岁以上；落地技术是安全前提",
              levels:{ regression:{name:"低栏架连续跳",sets:"4组",reps:"6次",restBetween:"90秒",coaching:"仅用低栏架，减少次数，注重落地缓冲技术"} , progression:{name:"栏架深度跳跃",sets:"5组",reps:"6次",restBetween:"120秒",coaching:"从高台阶跳下后立即跳过栏架，利用牵张反射提升爆发力"} } },
            { id:"nsca_009", name:"弹力带侧向行走", targetQualities:["核心力量","下肢爆发力"], ageRange:[10,18], difficulty:1, equipment:["band"], duration:6, sets:"3组", reps:"每侧10步", restBetween:"45秒", description:"NSCA髋外展力量训练。弹力带套于双脚脚踝上方，半蹲姿势向侧方行走10步后返回，左右交替", coachingPoints:"保持半蹲姿势；膝盖对准脚尖不内扣；感受臀部外侧发力；步幅适中", safetyNotes:"NSCA标准：臀中肌力量是膝关节稳定的基础；弹力带阻力从轻开始",
              levels:{ regression:{name:"徒手侧向行走",sets:"3组",reps:"每侧10步",restBetween:"45秒",coaching:"先掌握半蹲侧向行走的动作模式"} , progression:{name:"弹力带侧向行走+深蹲跳",sets:"4组",reps:"每侧10步+5次跳",restBetween:"60秒",coaching:"侧向行走后加入爆发深蹲跳，提升髋部爆发力"} } },
            { id:"nsca_010", name:"弹力带复合力量循环", targetQualities:["上肢力量","核心力量","下肢爆发力"], ageRange:[13,18], difficulty:3, equipment:["band"], duration:15, sets:"4组循环", reps:"每个动作10次", restBetween:"轮间60秒", description:"NSCA复合训练法。弹力带循环：深蹲推举10次→划船10次→硬拉10次→分腿蹲(每侧5次)→侧向行走(每侧5步)，每轮间休息60秒", coachingPoints:"每个动作注重质量；全身协调发力；心率维持在150-170次/分；根据体能调整阻力", safetyNotes:"NSCA标准：复合训练适合有一定基础者；仅限13岁以上；弹力带需检查无破损",
              levels:{ regression:{name:"简化力量循环",sets:"3组",reps:"每个8次",restBetween:"90秒",coaching:"减少动作种类和次数，延长休息，注重动作质量"} , progression:{name:"弹力带Tabata力量",sets:"5组",reps:"每个20秒/10秒休息",restBetween:"轮间45秒",coaching:"采用Tabata时间模式，提升力量耐力和心肺负荷"} } }
        ],
        // ==================== ACE 专业功能性训练库 ====================
        // 数据源：ACE (American Council on Exercise) Integrated Training Model
        // 筛选原则：仅使用上门体育教练可携带器材；强调功能性和运动表现提升
        // 适配原则：按 ACE IFT 模型分阶段进阶，适配青少年体能发展特点
        ace_pro: [
            { id:"ace_001", name:"功能性动态热身流", targetQualities:["柔韧性","协调性","心肺耐力"], ageRange:[6,18], difficulty:1, equipment:["none"], duration:8, sets:"1组", reps:"每个动作8-10次", description:"ACE IFT模型第一阶段。站立动态拉伸：世界最伟大拉伸→虫爬→弓步走+转体→侧弓步走→高抬腿走→踢臀跑→侧向滑步→交叉步，每个8-10次", coachingPoints:"动作流畅衔接；注重关节全范围活动；配合呼吸节奏；由慢到快逐步增加幅度", safetyNotes:"ACE标准：动态热身应在正式训练前完成；幅度由小到大循序渐进",
              levels:{ regression:{name:"简化动态热身",sets:"1组",reps:"每个5次",restBetween:"无",coaching:"减少动作种类和次数，注重基本活动度"} , progression:{name:"动态热身+加速跑",sets:"1组",reps:"每个10次+10米冲刺",restBetween:"无",coaching:"每个动作后加入10米加速跑，提升神经激活效果"} } },
            { id:"ace_002", name:"平衡稳定性进阶", targetQualities:["平衡能力","核心力量","本体感觉"], ageRange:[8,18], difficulty:2, equipment:["yoga_mat","band"], duration:8, sets:"3组", reps:"每个动作30秒", restBetween:"30秒", description:"ACE功能性平衡训练。瑜伽垫上：单脚站立30秒→闭眼单脚站30秒→单脚站+弹力带对侧拉30秒→不稳定面单脚站30秒，逐步增加难度", coachingPoints:"核心收紧维持稳定；目光平视固定点；支撑腿微屈；从简单到难循序渐进", safetyNotes:"ACE标准：平衡训练是功能性和运动表现的基础；闭眼练习需有保护",
              levels:{ regression:{name:"双脚平衡+视线转移",sets:"2组",reps:"30秒",restBetween:"30秒",coaching:"先从双脚站立配合头部转动练起，降低难度"} , progression:{name:"平衡垫+抛接球",sets:"4组",reps:"45秒",restBetween:"15秒",coaching:"在平衡垫上加入抛接网球，全面提升动态稳定和协调"} } },
            { id:"ace_003", name:"核心稳定性循环", targetQualities:["核心力量","平衡能力"], ageRange:[10,18], difficulty:2, equipment:["yoga_mat"], duration:10, sets:"3组循环", reps:"每个动作30秒", restBetween:"30秒", description:"ACE核心训练系统。瑜伽垫上循环：前平板30秒→侧平板(每侧)30秒→臀桥30秒→鸟狗式(每侧)30秒→死虫式30秒→登山者30秒", coachingPoints:"核心始终收紧；骨盆保持中立位；呼吸均匀不憋气；每个动作注重质量", safetyNotes:"ACE标准：核心训练注重稳定性而非力量；腰部不适者降低时长",
              levels:{ regression:{name:"短时核心循环",sets:"2组",reps:"每个15秒",restBetween:"45秒",coaching:"缩短时间，注重骨盆中立位和呼吸"} , progression:{name:"核心循环+弹力带",sets:"4组",reps:"每个45秒",restBetween:"20秒",coaching:"加入弹力带增加阻力，提升核心稳定性和力量耐力"} } },
            { id:"ace_004", name:"功能性力量循环", targetQualities:["上肢力量","核心力量","下肢爆发力"], ageRange:[12,18], difficulty:2, equipment:["band","yoga_mat","low_hurdle"], duration:12, sets:"4组循环", reps:"每个动作40秒", restBetween:"轮间45秒", description:"ACE功能性力量训练。循环：弹力带深蹲推举40秒→俯卧撑40秒→栏架跳跃40秒→弹力带划船40秒→平板支撑40秒→弹力带硬拉40秒，每轮间休息45秒", coachingPoints:"每个动作保持中等以上强度；注重动作质量；心率维持在160-180次/分；全身协调发力", safetyNotes:"ACE标准：功能性训练注重动作模式而非负荷；12岁以上适合",
              levels:{ regression:{name:"低强度功能循环",sets:"3组",reps:"每个30秒",restBetween:"60秒",coaching:"降低每个动作时间，延长休息，注重动作质量"} , progression:{name:"功能力量+冲刺",sets:"5组",reps:"每个40秒+5米冲刺",restBetween:"30秒",coaching:"每个动作后加入5米冲刺，提升神经激活和爆发力转换"} } },
            { id:"ace_005", name:"ACE HIIT间歇协议", targetQualities:["心肺耐力","下肢爆发力","核心力量"], ageRange:[12,18], difficulty:2, equipment:["cone","ladder","low_hurdle"], duration:15, sets:"5轮循环", reps:"每个动作30秒", restBetween:"轮间45秒", description:"ACE推荐HIIT协议。标志桶标记站点：绳梯快速步法30秒→标志桶折返冲刺30秒→栏架连续跳30秒→波比跳30秒→开合跳30秒。5轮，每轮间休息45秒", coachingPoints:"30秒全力输出保持高心率；动作间快速切换；呼吸节奏稳定；根据体能调整强度", safetyNotes:"ACE标准：HIIT前需5分钟热身；心率不超过最大心率(220-年龄)的90%；12岁以上适合",
              levels:{ regression:{name:"低强度间歇",sets:"4轮",reps:"每个20秒",restBetween:"60秒",coaching:"降低时间和强度，延长休息，注重完成率"} , progression:{name:"Tabata模式间歇",sets:"8轮",reps:"20秒运动/10秒休息",restBetween:"轮间30秒",coaching:"采用Tabata时间协议，提升强度和无氧能力"} } },
            { id:"ace_006", name:"筋膜放松与恢复流", targetQualities:["柔韧性","平衡能力"], ageRange:[8,18], difficulty:1, equipment:["yoga_mat"], duration:10, sets:"1组", reps:"每个部位30-45秒", description:"ACE恢复训练。瑜伽垫上全身放松：猫牛式脊柱流动→婴儿式放松→鸽子式臀髋放松→仰卧脊柱扭转→下犬式全身拉伸→泡沫轴替代（用网球滚动放松肌筋膜），每个30-45秒", coachingPoints:"配合深呼吸放松；不追求幅度注重感受；每个部位停留足够时间；用网球可对重点紧张部位滚动放松", safetyNotes:"ACE标准：恢复训练是功能提升的重要组成；避免在急性炎症期进行",
              levels:{ regression:{name:"简化放松流",sets:"1组",reps:"每个20秒",restBetween:"无",coaching:"选择4个基本体式，缩短时间，注重放松感"} , progression:{name:"深度放松+PNF",sets:"2组",reps:"每个60秒×2轮",restBetween:"无",coaching:"延长每个体式时间，配合PNF收缩放松技巧，深化放松效果"} } },
            { id:"ace_007", name:"单侧力量训练组", targetQualities:["下肢爆发力","核心力量","平衡能力"], ageRange:[12,18], difficulty:3, equipment:["band","yoga_mat"], duration:12, sets:"4组", reps:"每侧8-10次", restBetween:"60秒", description:"ACE单侧训练系统。每侧完成：单腿深蹲（扶墙）8次→单腿硬拉（弹力带）8次→单腿臀桥10次→侧向弹力带行走10步→单腿站立抛接球30秒，左右交替", coachingPoints:"单侧训练纠正力量不对称；核心始终收紧维持稳定；支撑腿膝盖对准脚尖；注重离心控制", safetyNotes:"ACE标准：单侧训练是功能性提升的关键；12岁以上有力量基础者适合",
              levels:{ regression:{name:"辅助单侧训练",sets:"3组",reps:"每侧6次",restBetween:"60秒",coaching:"扶墙辅助降低难度，注重单侧发力感"} , progression:{name:"单侧+负重",sets:"5组",reps:"每侧10次",restBetween:"90秒",coaching:"穿轻量负重背心增加负荷，提升单侧力量训练效果"} } },
            { id:"ace_008", name:"运动表现整合训练", targetQualities:["速度","灵敏素质","协调性","核心力量"], ageRange:[10,18], difficulty:2, equipment:["cone","ladder","band"], duration:15, sets:"4组循环", reps:"每个动作30秒", restBetween:"轮间45秒", description:"ACE整合训练模型。循环：绳梯快速步法30秒→标志桶变向冲刺30秒→弹力带抗旋转平板30秒→标志桶Z字变向30秒→弹力带划船30秒→10米加速跑30秒", coachingPoints:"动作间快速切换；注重动作质量；心率维持在160-180次/分；模拟运动中多素质整合需求", safetyNotes:"ACE标准：整合训练是功能性的高级阶段；10岁以上适合；需充分热身",
              levels:{ regression:{name:"简化整合循环",sets:"3组",reps:"每个20秒",restBetween:"60秒",coaching:"减少动作种类和时间，注重动作质量"} , progression:{name:"整合+爆发跳跃",sets:"5组",reps:"每个30秒+5次跳跃",restBetween:"30秒",coaching:"每个动作后加入爆发跳跃，提升整合训练的爆发力要求"} } }
        ]
    },
    qualityMap: {
        "速度": ["sp_001","sp_002","sp_003","sp_004","sp_005","sp_006","sp_007","sp_008","sp_009","sp_010","ace_008"],
        "速度素质": ["sp_001","sp_002","sp_003","sp_004","sp_005","sp_006","sp_007","sp_008","sp_009","sp_010","ace_008"],
        "反应速度": ["sp_002","sp_009","wu_007","ag_008"],
        "灵敏素质": ["ag_001","ag_002","ag_003","ag_004","ag_005","ag_006","ag_007","ag_008","ag_009","ace_008"],
        "协调性": ["co_001","co_002","co_003","co_004","sp_008","sp_010","ace_001","ace_008"],
        "核心力量": ["st_001","st_002","st_004","st_006","st_008","sp_008","nsca_001","nsca_002","nsca_003","nsca_004","nsca_005","nsca_006","nsca_007","nsca_009","nsca_010","ace_002","ace_003","ace_004","ace_007"],
        "上肢力量": ["st_001","st_002","st_003","st_004","st_007","st_008","nsca_003","nsca_004","nsca_006","nsca_010","ace_004"],
        "下肢爆发力": ["st_005","sp_006","ag_006","hg_002","ex_003","ag_009","nsca_001","nsca_002","nsca_005","nsca_008","nsca_009","nsca_010","ace_004","ace_005","ace_007"],
        "速度力量": ["st_005","st_004","nsca_008"],
        "肌肉耐力": ["st_002","en_005","ace_003"],
        "心肺耐力": ["en_001","en_002","en_003","en_004","en_005","en_006","en_007","wl_001","wl_002","wl_003","wl_004","ace_001","ace_004","ace_005","ace_008","nsca_008","nsca_010"],
        "速度耐力": ["en_002","en_006","en_007","ace_005"],
        "柔韧性": ["fl_001","fl_002","fl_003","fl_004","hg_001","hg_004","ace_001","ace_006"],
        "平衡能力": ["ba_001","ba_002","co_004","nsca_005","nsca_007","nsca_009","ace_002","ace_003","ace_007"],
        "本体感觉": ["ba_001","ba_002","ace_002"]
    },
    weaknessOptions: [
        { label:"速度不足（短跑成绩差）", quality:"速度" },
        { label:"爆发力不足（立定跳远差）", quality:"下肢爆发力" },
        { label:"灵敏性差（变向反应慢）", quality:"灵敏素质" },
        { label:"协调性差（动作不流畅）", quality:"协调性" },
        { label:"核心力量弱（仰卧起坐差）", quality:"核心力量" },
        { label:"上肢力量弱（引体向上差）", quality:"上肢力量" },
        { label:"耐力不足（中长跑成绩差）", quality:"心肺耐力" },
        { label:"柔韧性差（坐位体前屈差）", quality:"柔韧性" },
        { label:"平衡能力弱（闭眼单脚站差）", quality:"平衡能力" }
    ],
    trainingGoals: [
        { value:"general", label:"常规体能提升", description:"根据体测薄弱项和年龄敏感期综合提升体能" },
        { value:"weight_loss", label:"减重控脂", description:"以有氧燃脂为主，结合力量训练提升基础代谢" },
        { value:"height_growth", label:"追高助长", description:"通过纵向跳跃、脊柱伸展等促进生长板活跃（骨骺未闭合前效果最佳）" },
        { value:"exam_prep", label:"中考体育专项", description:"针对四川各市州中考体育考试项目进行专项训练" }
    ],
    equipmentNames: {
        none:"无需器材", ladder:"绳梯", cone:"标志桶", disc:"标志盘", band:"弹力带",
        tennis:"网球", tape:"皮尺", jump_mat:"跳远垫", yoga_mat:"瑜伽垫",
        low_hurdle:"低栏架", high_hurdle:"高栏架",
        jump_rope:"跳绳(需额外准备)", solid_ball:"实心球(需额外准备)", ball:"球类(需额外准备)"
    },
    sensitivePeriods: {
        early_childhood: { name:"学龄前期", ageRange:"3-6岁", focus:["柔韧性","协调性","基本动作技能"], principle:"游戏化活动为主，发展基本动作技能，避免专项化" },
        lower_primary: { name:"小学低段", ageRange:"6-9岁", focus:["柔韧性","协调性","速度(动作频率)","灵敏素质"], principle:"多样化运动体验，重点发展一般协调能力和动作频率", sensitive:["柔韧性第一敏感期","速度第一敏感期","协调性敏感期"] },
        upper_primary: { name:"小学高段", ageRange:"9-12岁", focus:["速度","灵敏素质","协调性(专项)","柔韧性","有氧耐力(入门)"], principle:"速度训练短距离高频次；灵敏训练多变方向；有氧耐力入门", sensitive:["速度敏感期","灵敏素质敏感期","反应速度敏感期","平衡与准确能力敏感期"] },
        junior_high: { name:"初中阶段", ageRange:"12-15岁", focus:["力量(一般力量)","速度(第二敏感期)","有氧耐力","柔韧性(第二敏感期)"], principle:"力量以徒手和轻负荷为主；有氧耐力为主要方向；注意柔韧性维持", sensitive:["一般力量敏感期","速度第二敏感期","柔韧性第二敏感期","有氧耐力敏感期"], note:"青春期生长突增期，易出现柔韧性下降和协调性暂时紊乱" },
        senior_high: { name:"高中阶段", ageRange:"15-18岁", focus:["专项力量","无氧耐力","速度力量/爆发力","速度耐力"], principle:"系统化力量训练；无氧耐力比例增加；结合心率监控科学安排负荷", sensitive:["专项力量敏感期","无氧耐力敏感期","爆发力敏感期"], note:"可承受接近成人训练负荷，但骨骺未完全闭合" }
    },
    sichuanCities: ["成都","绵阳","自贡","攀枝花","泸州","德阳","广元","遂宁","内江","乐山","资阳","宜宾","南充","达州","雅安","广安","巴中","眉山","阿坝","甘孜","凉山"],
    // 全国省份 -> 城市 映射（中考体育数据文件按省份命名 data/zhongkao-{province}.json）
    nationalProvinces: {
        "四川": { cities: ["成都","绵阳","自贡","攀枝花","泸州","德阳","广元","遂宁","内江","乐山","资阳","宜宾","南充","达州","雅安","广安","巴中","眉山","阿坝","甘孜","凉山"], dataFile: "data/sichuan-zhongkao.json" },
        "北京": { cities: ["北京"], dataFile: "data/zhongkao-beijing.json" },
        "上海": { cities: ["上海"], dataFile: "data/zhongkao-shanghai.json" },
        "重庆": { cities: ["重庆"], dataFile: "data/zhongkao-chongqing.json" },
        "广东": { cities: ["广州","深圳","佛山","东莞","珠海","中山","惠州","汕头","湛江"], dataFile: "data/zhongkao-guangdong.json" },
        "江苏": { cities: ["南京","苏州","无锡","常州","南通","徐州","扬州","泰州","盐城","淮安","连云港","宿迁","镇江"], dataFile: "data/zhongkao-jiangsu.json" },
        "浙江": { cities: ["杭州","宁波","温州","绍兴","嘉兴","金华","台州","湖州","丽水","衢州","舟山"], dataFile: "data/zhongkao-zhejiang.json" },
        "山东": { cities: ["济南","青岛","烟台","潍坊","淄博","威海","日照","临沂","德州","聊城","滨州","菏泽","泰安","枣庄","济宁","东营"], dataFile: "data/zhongkao-shandong.json" },
        "河南": { cities: ["郑州","洛阳","开封","新乡","安阳","许昌","平顶山","焦作","商丘","信阳","周口","驻马店","南阳","濮阳","三门峡","漯河","鹤壁"], dataFile: "data/zhongkao-henan.json" },
        "湖北": { cities: ["武汉","襄阳","宜昌","荆州","黄冈","十堰","孝感","荆门","鄂州","黄石","咸宁","随州","恩施"], dataFile: "data/zhongkao-hubei.json" },
        "湖南": { cities: ["长沙","株洲","湘潭","衡阳","岳阳","常德","郴州","邵阳","益阳","永州","怀化","娄底","湘西"], dataFile: "data/zhongkao-hunan.json" },
        "福建": { cities: ["福州","厦门","泉州","漳州","莆田","龙岩","三明","南平","宁德"], dataFile: "data/zhongkao-fujian.json" },
        "安徽": { cities: ["合肥","芜湖","蚌埠","淮南","马鞍山","淮北","铜陵","安庆","黄山","滁州","阜阳","宿州","六安","亳州","池州","宣城"], dataFile: "data/zhongkao-anhui.json" },
        "江西": { cities: ["南昌","赣州","九江","上饶","抚州","宜春","吉安","景德镇","萍乡","新余","鹰潭"], dataFile: "data/zhongkao-jiangxi.json" },
        "河北": { cities: ["石家庄","唐山","保定","邯郸","张家口","承德","廊坊","沧州","衡水","邢台","秦皇岛","定州","辛集"], dataFile: "data/zhongkao-hebei.json" },
        "山西": { cities: ["太原","大同","阳泉","长治","晋城","朔州","晋中","运城","忻州","临汾","吕梁"], dataFile: "data/zhongkao-shanxi.json" },
        "陕西": { cities: ["西安","宝鸡","咸阳","渭南","延安","汉中","榆林","安康","商洛","铜川"], dataFile: "data/zhongkao-shaanxi.json" },
        "云南": { cities: ["昆明","曲靖","玉溪","保山","昭通","丽江","普洱","临沧","楚雄","红河","文山","西双版纳","大理","德宏","怒江","迪庆"], dataFile: "data/zhongkao-yunnan.json" },
        "贵州": { cities: ["贵阳","遵义","六盘水","安顺","毕节","铜仁","黔东南","黔南","黔西南"], dataFile: "data/zhongkao-guizhou.json" },
        "广西": { cities: ["南宁","柳州","桂林","梧州","北海","防城港","钦州","贵港","玉林","百色","贺州","河池","来宾","崇左"], dataFile: "data/zhongkao-guangxi.json" },
        "辽宁": { cities: ["沈阳","大连","鞍山","抚顺","本溪","丹东","锦州","营口","阜新","辽阳","盘锦","铁岭","朝阳","葫芦岛"], dataFile: "data/zhongkao-liaoning.json" },
        "吉林": { cities: ["长春","吉林","四平","辽源","通化","白山","松原","白城","延边"], dataFile: "data/zhongkao-jilin.json" },
        "黑龙江": { cities: ["哈尔滨","齐齐哈尔","鸡西","鹤岗","双鸭山","大庆","伊春","佳木斯","七台河","牡丹江","黑河","绥化","大兴安岭"], dataFile: "data/zhongkao-heilongjiang.json" },
        "天津": { cities: ["天津"], dataFile: "data/zhongkao-tianjin.json" },
        "海南": { cities: ["海口","三亚","三沙","儋州"], dataFile: "data/zhongkao-hainan.json" },
        "甘肃": { cities: ["兰州","嘉峪关","金昌","白银","天水","武威","张掖","平凉","酒泉","庆阳","定西","陇南","临夏","甘南"], dataFile: "data/zhongkao-gansu.json" },
        "青海": { cities: ["西宁","海东","海北","黄南","海南州","果洛","玉树","海西"], dataFile: "data/zhongkao-qinghai.json" },
        "宁夏": { cities: ["银川","石嘴山","吴忠","固原","中卫"], dataFile: "data/zhongkao-ningxia.json" },
        "新疆": { cities: ["乌鲁木齐","克拉玛依","吐鲁番","哈密","昌吉","博尔塔拉","巴音郭楞","阿克苏","克孜勒苏","喀什","和田","伊犁","塔城","阿勒泰"], dataFile: "data/zhongkao-xinjiang.json" },
        "内蒙古": { cities: ["呼和浩特","包头","乌海","赤峰","通辽","鄂尔多斯","呼伦贝尔","巴彦淖尔","乌兰察布","兴安","锡林郭勒","阿拉善"], dataFile: "data/zhongkao-neimenggu.json" },
        "西藏": { cities: ["拉萨","日喀则","昌都","林芝","山南","那曲","阿里"], dataFile: "data/zhongkao-xizang.json" }
    }
};

// ---- 训练模式与目标 ----
let currentTrainingMode = 'auto';
let currentTrainingGoal = 'general';
let currentExamProvince = '';
let currentExamCity = '';
let zhongkaoDataCache = {}; // { province: data }

// 加载指定省份的中考体育数据
async function loadZhongkaoData(province) {
    if (zhongkaoDataCache[province]) return zhongkaoDataCache[province];
    const provInfo = TRAINING_DB.nationalProvinces[province];
    if (!provInfo) return null;
    try {
        const resp = await fetch(provInfo.dataFile);
        if (!resp.ok) { console.warn(`数据文件 ${provInfo.dataFile} 不存在`); return null; }
        const data = await resp.json();
        zhongkaoDataCache[province] = data;
        return data;
    } catch(e) {
        console.warn('Failed to load zhongkao data for', province, e);
        return null;
    }
}

// 兼容旧引用
async function loadSichuanZhongkaoData() {
    return loadZhongkaoData('四川');
}

function onTrainingStudentChange() {
    const studentId = document.getElementById('trainingStudentSelect').value;
    const modeSection = document.getElementById('trainingModeSection');
    const actions = document.getElementById('trainingActions');
    const content = document.getElementById('trainingContent');

    if (studentId) {
        modeSection.style.display = 'block';
        renderWeaknessCheckboxes();
        renderCitySelector();
        generateTrainingPlan();
    } else {
        modeSection.style.display = 'none';
        actions.style.display = 'none';
        content.innerHTML = `
            <div class="empty-state">
                <div class="icon">💪</div>
                <h3>生成个性化训练方案</h3>
                <p>选择上方学生后，系统将基于体测数据自动生成科学训练计划</p>
            </div>
        `;
    }
}

function switchTrainingMode(mode) {
    currentTrainingMode = mode;
    document.getElementById('modeTabAuto').classList.toggle('active', mode === 'auto');
    document.getElementById('modeTabManual').classList.toggle('active', mode === 'manual');
    const customTab = document.getElementById('modeTabCustom');
    if (customTab) customTab.classList.toggle('active', mode === 'custom');
    document.getElementById('autoModePanel').style.display = mode === 'auto' ? 'block' : 'none';
    document.getElementById('manualModePanel').style.display = mode === 'manual' ? 'block' : 'none';
    const customPanel = document.getElementById('customModePanel');
    if (customPanel) customPanel.style.display = mode === 'custom' ? 'block' : 'none';
    if (mode === 'auto') {
        generateTrainingPlan();
    } else if (mode === 'custom') {
        renderCustomCategoryTabs();
        renderCustomExerciseList();
        updateCustomSummary();
        document.getElementById('trainingContent').innerHTML = '<div class="empty-state"><p>请在上方勾选训练动作后点击「生成自选方案」</p></div>';
        document.getElementById('trainingActions').style.display = 'none';
    } else {
        document.getElementById('trainingContent').innerHTML = '<div class="empty-state"><p>请勾选上方薄弱项后点击「生成训练方案」</p></div>';
        document.getElementById('trainingActions').style.display = 'none';
    }
}

// ==================== 教练自选训练模式 ====================
let customSelectedExercises = [];
let customCurrentCategory = 'all';

const CUSTOM_CATEGORY_LABELS = {
    warmup: '热身', speed: '速度', agility: '灵敏', strength: '力量',
    endurance: '耐力', flexibility: '柔韧', coordination: '协调', balance: '平衡',
    cooldown: '放松', weight_loss: '减重', height_growth: '追高', exam_prep: '中考专项',
    nsca_pro: 'NSCA专业', ace_pro: 'ACE专业'
};

function renderCustomCategoryTabs() {
    const container = document.getElementById('customCategoryTabs');
    if (!container) return;
    const cats = [{ key: 'all', label: '全部' }];
    Object.keys(TRAINING_DB.exercises).forEach(k => {
        cats.push({ key: k, label: CUSTOM_CATEGORY_LABELS[k] || k });
    });
    container.innerHTML = cats.map(c => `
        <button class="mode-tab ${c.key === customCurrentCategory ? 'active' : ''}"
                style="padding:4px 12px;font-size:12px;border-radius:999px;"
                onclick="customCurrentCategory='${c.key}';renderCustomCategoryTabs();renderCustomExerciseList();">${c.label}</button>
    `).join('');
}

function renderCustomExerciseList() {
    const container = document.getElementById('customExerciseList');
    if (!container) return;
    let exercises = [];
    if (customCurrentCategory === 'all') {
        Object.values(TRAINING_DB.exercises).forEach(arr => exercises.push(...arr));
    } else {
        exercises = TRAINING_DB.exercises[customCurrentCategory] || [];
    }
    // Filter by age if student is selected
    const studentId = document.getElementById('trainingStudentSelect')?.value;
    const student = studentId ? students.find(s => s.id === studentId) : null;
    const grade = student ? parseInt(student.grade) : 0;
    const ageOK = ex => grade >= 1 ? isAgeAppropriate(ex, grade) : true;
    exercises = exercises.filter(ageOK);

    container.innerHTML = exercises.map(ex => {
        const isSelected = customSelectedExercises.includes(ex.id);
        const phase = ex.id.startsWith('wu_') ? '热身' : ex.id.startsWith('cd_') ? '放松' : '主体';
        const phaseColor = phase === '热身' ? '#10b981' : phase === '放松' ? '#3b82f6' : '#f59e0b';
        const eqOK = isEquipmentAvailable(ex);
        return `
            <div style="display:flex;align-items:flex-start;gap:8px;padding:8px;border-radius:6px;margin-bottom:4px;${isSelected ? 'background:#eff6ff;' : ''}">
                <input type="checkbox" ${isSelected ? 'checked' : ''} onchange="toggleCustomExercise('${ex.id}')" style="margin-top:4px;cursor:pointer;">
                <div style="flex:1;">
                    <div style="display:flex;align-items:center;gap:6px;flex-wrap:wrap;">
                        <span style="font-weight:600;font-size:13px;">${ex.name}</span>
                        <span style="font-size:10px;padding:1px 6px;border-radius:3px;background:${phaseColor}20;color:${phaseColor};">${phase}</span>
                        <span style="font-size:10px;color:var(--text-light);">${ex.duration}min</span>
                        <span style="font-size:10px;color:var(--text-light);">${ex.sets || ''}</span>
                        ${!eqOK ? '<span style="font-size:10px;color:#ef4444;">需额外器材</span>' : ''}
                    </div>
                    <p style="font-size:11px;color:var(--text-secondary);margin:2px 0 0;line-height:1.5;">${ex.description || ''}</p>
                </div>
            </div>`;
    }).join('');
    if (exercises.length === 0) {
        container.innerHTML = '<p style="text-align:center;color:var(--text-light);padding:20px;">该分类无可用动作</p>';
    }
}

function toggleCustomExercise(id) {
    const idx = customSelectedExercises.indexOf(id);
    if (idx >= 0) {
        customSelectedExercises.splice(idx, 1);
    } else {
        customSelectedExercises.push(id);
    }
    updateCustomSummary();
    // Re-render list to update checkbox state without full re-render
    const checkboxes = document.querySelectorAll('#customExerciseList input[type="checkbox"]');
    checkboxes.forEach(cb => {
        const exId = cb.getAttribute('onchange').match(/'([^']+)'/)[1];
        cb.checked = customSelectedExercises.includes(exId);
    });
}

function updateCustomSummary() {
    const container = document.getElementById('customSelectedSummary');
    if (!container) return;
    if (customSelectedExercises.length === 0) {
        container.innerHTML = '<p style="font-size:13px;color:var(--text-light);text-align:center;">请在上方动作列表中勾选训练动作</p>';
        return;
    }
    const allExercises = [];
    Object.values(TRAINING_DB.exercises).forEach(arr => allExercises.push(...arr));
    const selected = customSelectedExercises.map(id => allExercises.find(e => e.id === id)).filter(Boolean);

    const warmups = selected.filter(e => e.id.startsWith('wu_'));
    const mains = selected.filter(e => !e.id.startsWith('wu_') && !e.id.startsWith('cd_'));
    const cooldowns = selected.filter(e => e.id.startsWith('cd_'));

    const wTime = warmups.reduce((s, e) => s + e.duration, 0);
    const mTime = mains.reduce((s, e) => s + e.duration, 0);
    const cTime = cooldowns.reduce((s, e) => s + e.duration, 0);
    const total = wTime + mTime + cTime;

    container.innerHTML = `
        <div style="display:flex;gap:12px;margin-bottom:8px;">
            <div style="flex:1;text-align:center;padding:6px;background:#10b98110;border-radius:6px;">
                <div style="font-size:11px;color:#065f46;">热身</div>
                <div style="font-size:18px;font-weight:700;color:#065f46;">${warmups.length}个</div>
                <div style="font-size:10px;color:#065f46;">${wTime}min</div>
            </div>
            <div style="flex:1;text-align:center;padding:6px;background:#f59e0b10;border-radius:6px;">
                <div style="font-size:11px;color:#92400e;">主体</div>
                <div style="font-size:18px;font-weight:700;color:#92400e;">${mains.length}个</div>
                <div style="font-size:10px;color:#92400e;">${mTime}min</div>
            </div>
            <div style="flex:1;text-align:center;padding:6px;background:#3b82f610;border-radius:6px;">
                <div style="font-size:11px;color:#1e40af;">放松</div>
                <div style="font-size:18px;font-weight:700;color:#1e40af;">${cooldowns.length}个</div>
                <div style="font-size:10px;color:#1e40af;">${cTime}min</div>
            </div>
            <div style="flex:1;text-align:center;padding:6px;background:#6366f110;border-radius:6px;">
                <div style="font-size:11px;color:#4c1d95;">总计</div>
                <div style="font-size:18px;font-weight:700;color:#4c1d95;">${selected.length}个</div>
                <div style="font-size:10px;color:#4c1d95;">${total}min</div>
            </div>
        </div>
        <div style="font-size:11px;color:var(--text-light);">已选动作：${selected.map(e => e.name).join('、')}</div>
    `;
}

function clearCustomSelections() {
    customSelectedExercises = [];
    renderCustomExerciseList();
    updateCustomSummary();
}

function generateCustomPlan() {
    const studentId = document.getElementById('trainingStudentSelect').value;
    if (!studentId) { showToast('请先选择学生', 'error'); return; }
    const student = students.find(s => s.id === studentId);
    if (!student) return;

    if (customSelectedExercises.length === 0) {
        showToast('请至少勾选一个训练动作', 'error');
        return;
    }

    const allExercises = [];
    Object.values(TRAINING_DB.exercises).forEach(arr => allExercises.push(...arr));

    const selected = customSelectedExercises.map(id => allExercises.find(e => e.id === id)).filter(Boolean);
    const warmups = selected.filter(e => e.id.startsWith('wu_'));
    const mains = selected.filter(e => !e.id.startsWith('wu_') && !e.id.startsWith('cd_'));
    const cooldowns = selected.filter(e => e.id.startsWith('cd_'));

    const warmupTime = warmups.reduce((s, e) => s + e.duration, 0);
    const mainTime = mains.reduce((s, e) => s + e.duration, 0);
    const cooldownTime = cooldowns.reduce((s, e) => s + e.duration, 0);
    const REST_BETWEEN = 2;
    const restTime = (warmups.length > 0 && mains.length > 0 ? REST_BETWEEN : 0)
                   + (mains.length > 1 ? REST_BETWEEN * (mains.length - 1) : 0);
    const totalTime = warmupTime + restTime + mainTime + cooldownTime;

    const plan = { warmups, mainExercises: mains, cooldowns, warmupTime, mainTime, cooldownTime, restTime, totalTime, extraEquipmentWarnings: [] };

    // Collect equipment warnings
    mains.forEach(ex => {
        const missing = getMissingEquipment(ex);
        if (missing.length > 0) {
            plan.extraEquipmentWarnings.push({ exercise: ex.name, missing: missing.map(m => TRAINING_DB.equipmentNames[m] || m) });
        }
    });

    const grade = parseInt(student.grade);
    const ageGroup = getSensitivePeriodKey(grade);
    const sp = TRAINING_DB.sensitivePeriods[ageGroup];
    const goalLabel = '教练自选方案';

    const content = document.getElementById('trainingContent');
    content.innerHTML = renderTrainingPlan(plan, student, sp, '<div class="weakness-list"><span class="weakness-tag">教练自主选择</span></div>', [], 'general', goalLabel, '');
    document.getElementById('trainingActions').style.display = 'block';
    showToast(`自选方案已生成：${totalTime}分钟（热身${warmupTime}+休息${restTime}+主体${mainTime}+放松${cooldownTime}）`, 'success');
}

async function exportCustomPlanPDF() {
    const studentId = document.getElementById('trainingStudentSelect').value;
    if (!studentId) { showToast('请先选择学生', 'error'); return; }
    const student = students.find(s => s.id === studentId);
    if (!student) return;
    const content = document.getElementById('trainingContent');
    if (!content.innerHTML.trim()) { showToast('请先生成训练方案', 'error'); return; }

    const html = buildCustomPlanPDFHTML(content.innerHTML, student);
    const filename = `${student.name}_教练自选训练方案_${new Date().toISOString().slice(0,10)}.pdf`;
    await exportPDFFromHTML(html, filename);
}

function buildCustomPlanPDFHTML(innerContent, student) {
    return `<!DOCTYPE html>
<html lang="zh-CN">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<style>
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body { font-family: "Microsoft YaHei", "PingFang SC", sans-serif; background: #fff; color: #1f2937; padding: 24px; width: 794px; }
  .pdf-header { background: linear-gradient(135deg, #059669 0%, #0d9488 100%); color: #fff; border-radius: 12px; padding: 20px 24px; margin-bottom: 20px; -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
  .pdf-header h1 { font-size: 20px; margin-bottom: 6px; }
  .pdf-header p { font-size: 13px; opacity: 0.9; }
  h3 { font-size: 16px; margin: 16px 0 8px; color: #1f2937; }
  h4 { font-size: 14px; margin: 12px 0 6px; color: #374151; }
  p { font-size: 12px; line-height: 1.7; color: #4b5563; }
  .exercise-card { border: 1px solid #e5e7eb; border-radius: 8px; padding: 10px 12px; margin-bottom: 8px; }
  .exercise-card-header { display: flex; align-items: center; gap: 6px; margin-bottom: 6px; }
  .exercise-name { font-weight: 700; font-size: 13px; }
  .exercise-difficulty { font-size: 10px; padding: 1px 6px; border-radius: 3px; }
  .ex-quality-tag { font-size: 10px; padding: 1px 5px; background: #f3f4f6; border-radius: 3px; color: #6b7280; }
  .ex-eq-tag { font-size: 10px; padding: 1px 5px; background: #ecfdf5; border-radius: 3px; color: #065f46; }
  .exercise-desc { font-size: 11px; color: #6b7280; line-height: 1.6; margin-bottom: 4px; }
  .exercise-coaching { font-size: 11px; color: #374151; line-height: 1.6; }
  .exercise-safety { font-size: 10px; color: #b91c1c; margin-top: 4px; }
  .timeline-bar { display: flex; gap: 2px; border-radius: 6px; overflow: hidden; margin-bottom: 12px; }
  .timeline-seg { padding: 6px; text-align: center; font-size: 11px; color: #fff; }
  .timeline-seg.warmup { background: #10b981; }
  .timeline-seg.main { background: #f59e0b; }
  .timeline-seg.cooldown { background: #3b82f6; }
  .badge { font-size: 10px; padding: 1px 6px; border-radius: 3px; }
  .note-box { padding: 8px 12px; border-radius: 6px; font-size: 11px; margin-bottom: 8px; }
  .note-info { background: #f0f7ff; border: 1px solid #bfdbfe; color: #1e3a5f; }
  .pdf-footer { margin-top: 20px; padding-top: 12px; border-top: 1px solid #e5e7eb; text-align: center; font-size: 10px; color: #9ca3af; }
</style>
</head>
<body>
  <div class="pdf-header">
    <h1>📋 教练自选训练方案</h1>
    <p>学生：${student.name} · 年级：${student.grade}年级 · 日期：${new Date().toISOString().slice(0,10)}</p>
  </div>
  ${innerContent}
  <div class="pdf-footer">
    <span>上门体育教练管理系统 · 教练自选训练方案导出</span>
  </div>
</body>
</html>`;
}

function onTrainingGoalChange() {
    currentTrainingGoal = document.getElementById('trainingGoalSelect').value;
    const cityRow = document.getElementById('examCityRow');
    if (!cityRow) { generateTrainingPlan(); return; }
    if (currentTrainingGoal === 'exam_prep') {
        cityRow.style.display = 'flex';
        renderCitySelector();
    } else {
        cityRow.style.display = 'none';
    }
    generateTrainingPlan();
}

// ==================== 教练自建动作 ====================
function openCustomExerciseModal() {
    // 渲染器材选择
    const eqContainer = document.getElementById('ceEquipment');
    const allEquip = ['none','ladder','cone','disc','band','tennis','tape','jump_mat','yoga_mat','low_hurdle','high_hurdle','jump_rope','solid_ball','ball'];
    eqContainer.innerHTML = allEquip.map(eq => `
        <label style="display:inline-flex;align-items:center;gap:4px;padding:6px 10px;border:1px solid #e5e7eb;border-radius:6px;cursor:pointer;font-size:12px;transition:all 0.2s;" id="ceEqLabel_${eq}">
            <input type="checkbox" value="${eq}" ${eq === 'none' ? 'checked' : ''} onchange="updateCeEqLabel('${eq}')" style="display:none;">
            <span>${TRAINING_DB.equipmentNames[eq] || eq}</span>
        </label>`).join('');
    document.getElementById('ceName').value = '';
    document.getElementById('ceDifficulty').value = '1';
    document.getElementById('ceAgeMin').value = 6;
    document.getElementById('ceAgeMax').value = 18;
    document.getElementById('ceSets').value = 4;
    document.getElementById('ceRest').value = 60;
    document.getElementById('ceDuration').value = 8;
    document.getElementById('ceReps').value = '';
    document.getElementById('ceDescription').value = '';
    document.getElementById('ceCoaching').value = '';
    document.getElementById('ceSafety').value = '';
    document.querySelectorAll('input[name="ceMeasure"]').forEach(radio => {
        radio.onchange = function() {
            const isReps = this.value === 'reps';
            document.getElementById('ceRepsLabel').textContent = isReps ? '每组次数/距离' : '每组时长(秒)';
            document.getElementById('ceReps').placeholder = isReps ? '如：15米 或 10次' : '如：30';
            document.getElementById('ceMeasureLabel_reps').style.borderColor = isReps ? '#059669' : '#e5e7eb';
            document.getElementById('ceMeasureLabel_reps').style.background = isReps ? '#05966910' : '';
            document.getElementById('ceMeasureLabel_time').style.borderColor = !isReps ? '#059669' : '#e5e7eb';
            document.getElementById('ceMeasureLabel_time').style.background = !isReps ? '#05966910' : '';
            estimateExerciseDuration();
        };
    });
    ['ceSets','ceRest','ceReps'].forEach(id => { document.getElementById(id).oninput = estimateExerciseDuration; });
    document.getElementById('customExerciseModal').style.display = 'flex';
}
function updateCeEqLabel(eq) {
    const label = document.getElementById('ceEqLabel_' + eq);
    const cb = label.querySelector('input');
    label.style.borderColor = cb.checked ? '#059669' : '#e5e7eb';
    label.style.background = cb.checked ? '#05966910' : '';
}
function closeCustomExerciseModal() { document.getElementById('customExerciseModal').style.display = 'none'; }
function estimateExerciseDuration() {
    const mt = document.querySelector('input[name="ceMeasure"]:checked')?.value || 'reps';
    const sets = parseInt(document.getElementById('ceSets').value) || 1;
    const rest = parseInt(document.getElementById('ceRest').value) || 0;
    const rv = document.getElementById('ceReps').value;
    let tps;
    if (mt === 'time') { tps = parseInt(rv) || 30; }
    else {
        const nm = rv.match(/(\d+)/);
        if (nm) { const n = parseInt(nm[1]); tps = rv.includes('米') ? Math.ceil(n * 0.2) + 10 : n * 3; }
        else tps = 30;
    }
    document.getElementById('ceDuration').value = Math.min(Math.max(3, Math.ceil(((tps + rest) * sets - rest) / 60)), 30);
}
function saveCustomExercise() {
    const name = document.getElementById('ceName').value.trim();
    if (!name) { showToast('请输入动作名称', 'error'); return; }
    const category = document.getElementById('ceCategory').value;
    const equipment = [];
    document.querySelectorAll('#ceEquipment input:checked').forEach(cb => { if (cb.value !== 'none') equipment.push(cb.value); });
    if (equipment.length === 0) equipment.push('none');
    const exercise = {
        id: 'custom_' + Date.now().toString(36), name,
        targetQualities: ({warmup:['心肺耐力','柔韧性'],speed:['速度'],agility:['灵敏素质'],strength:['力量'],endurance:['心肺耐力'],flexibility:['柔韧性'],coordination:['协调性'],balance:['平衡能力'],cooldown:['柔韧性']})[category] || ['协调性'],
        ageRange: [parseInt(document.getElementById('ceAgeMin').value), parseInt(document.getElementById('ceAgeMax').value)],
        difficulty: parseInt(document.getElementById('ceDifficulty').value), equipment,
        duration: parseInt(document.getElementById('ceDuration').value),
        sets: document.getElementById('ceSets').value + '组', reps: document.getElementById('ceReps').value.trim() || '适量',
        restBetween: document.getElementById('ceRest').value + '秒',
        description: document.getElementById('ceDescription').value.trim() || name,
        coachingPoints: document.getElementById('ceCoaching').value.trim(),
        safetyNotes: document.getElementById('ceSafety').value.trim(), _custom: true
    };
    if (!TRAINING_DB.exercises[category]) TRAINING_DB.exercises[category] = [];
    TRAINING_DB.exercises[category].push(exercise);
    try { const s = JSON.parse(localStorage.getItem('customExercises') || '[]'); s.push({category, exercise}); localStorage.setItem('customExercises', JSON.stringify(s)); } catch(e) {}
    closeCustomExerciseModal();
    renderCustomExerciseList(); renderCustomCategoryTabs();
    showToast(`✅ 动作"${name}"已保存至${CUSTOM_CATEGORY_LABELS[category] || category}分类`, 'success');
}
function loadCustomExercises() {
    try {
        const saved = JSON.parse(localStorage.getItem('customExercises') || '[]');
        saved.forEach(item => {
            if (!TRAINING_DB.exercises[item.category]) TRAINING_DB.exercises[item.category] = [];
            if (!TRAINING_DB.exercises[item.category].find(e => e.id === item.exercise.id))
                TRAINING_DB.exercises[item.category].push(item.exercise);
        });
    } catch(e) {}
}

async function onExamProvinceChange() {
    currentExamProvince = document.getElementById('examProvinceSelect').value;
    currentExamCity = '';
    const citySelect = document.getElementById('examCitySelect');
    if (currentExamProvince) {
        const provInfo = TRAINING_DB.nationalProvinces[currentExamProvince];
        if (provInfo) {
            citySelect.innerHTML = '<option value="">-- 选择城市 --</option>' +
                provInfo.cities.map(c => `<option value="${c}">${c}</option>`).join('');
        }
        // 预加载该省份数据
        await loadZhongkaoData(currentExamProvince);
    } else {
        citySelect.innerHTML = '<option value="">-- 选择城市 --</option>';
    }
    renderExamInfo();
    generateTrainingPlan();
}

async function onExamCityChange() {
    currentExamCity = document.getElementById('examCitySelect').value;
    await renderExamInfo();
    generateTrainingPlan();
}

function renderCitySelector() {
    const provSelect = document.getElementById('examProvinceSelect');
    const citySelect = document.getElementById('examCitySelect');
    // 填充省份（只填一次）
    if (provSelect && (!provSelect.options.length || provSelect.options.length === 1)) {
        const provinces = Object.keys(TRAINING_DB.nationalProvinces);
        // 四川排第一
        const ordered = ['四川'].concat(provinces.filter(p => p !== '四川'));
        provSelect.innerHTML = '<option value="">-- 选择省份 --</option>' +
            ordered.map(p => `<option value="${p}">${p}</option>`).join('');
    }
    if (citySelect && (!citySelect.options.length || citySelect.options.length === 1)) {
        citySelect.innerHTML = '<option value="">-- 选择城市 --</option>';
    }
}

async function renderExamInfo() {
    const infoDiv = document.getElementById('examInfoBox');
    if (!currentExamProvince || !currentExamCity) {
        infoDiv.innerHTML = '';
        return;
    }
    // 加载省份数据（异步）
    const data = await loadZhongkaoData(currentExamProvince);
    if (!data || !data.cities || !data.cities[currentExamCity]) {
        infoDiv.innerHTML = `<div class="exam-info-card"><p style="color:var(--text-light);font-size:13px;">暂无${currentExamProvince}${currentExamCity}的详细评分标准，请参考通用训练方案。</p></div>`;
        return;
    }
    const city = data.cities[currentExamCity];
    const commonProjects = data.commonProjects || {};
    const isMale = true; // 默认显示男生标准，后续可根据学生性别切换
    const fullScore = isMale ? (city.fullScore_male || {}) : (city.fullScore_female || {});
    const passScore = isMale ? (city.passScore_male || {}) : (city.passScore_female || {});
    
    let html = `<div class="exam-info-card">
        <h5>📋 ${currentExamProvince} · ${currentExamCity}中考体育方案（总分${city.totalScore}分）</h5>
        <p class="exam-structure">${city.structure}</p>
        <div class="exam-projects">`;
    city.projects.forEach(p => {
        const typeLabel = p.type;
        let itemsLabel = '';
        if (p.items) itemsLabel = p.items.map(id => commonProjects[id]?.name || id).join(' / ');
        if (p.items_male && p.items_female) {
            itemsLabel = `男：${p.items_male.map(id => commonProjects[id]?.name || id).join(' / ')}<br>女：${p.items_female.map(id => commonProjects[id]?.name || id).join(' / ')}`;
        } else if (p.items_male) {
            itemsLabel = `男：${p.items_male.map(id => commonProjects[id]?.name || id).join(' / ')}`;
        } else if (p.items_female) {
            itemsLabel = `女：${p.items_female.map(id => commonProjects[id]?.name || id).join(' / ')}`;
        }
        html += `<div class="exam-project-row"><span class="exam-type">${typeLabel}</span><span class="exam-items">${itemsLabel}</span><span class="exam-score">${p.scorePerItem || ''}</span></div>`;
    });
    html += `</div>`;
    
    // 展示满分标准和及格线
    const allKeys = [...new Set([...Object.keys(fullScore), ...Object.keys(passScore)])];
    if (allKeys.length > 0) {
        html += `<div class="exam-score-table"><h6>评分标准（男）</h6><table class="score-standard-table"><thead><tr><th>项目</th><th>满分</th><th>及格</th></tr></thead><tbody>`;
        allKeys.forEach(key => {
            const name = commonProjects[key]?.name || key;
            const fs = fullScore[key] || '—';
            const ps = passScore[key] || '—';
            html += `<tr><td>${name}</td><td class="score-full">${fs}</td><td class="score-pass">${ps}</td></tr>`;
        });
        html += `</tbody></table></div>`;
    }
    if (city.notes) html += `<p class="exam-note">📝 ${city.notes}</p>`;
    html += `</div>`;
    infoDiv.innerHTML = html;
}

function renderWeaknessCheckboxes() {
    const container = document.getElementById('weaknessCheckboxGrid');
    container.innerHTML = TRAINING_DB.weaknessOptions.map(opt =>
        `<label class="weakness-checkbox"><input type="checkbox" value="${opt.quality}" onchange="onWeaknessCheckboxChange()"> ${opt.label}</label>`
    ).join('');
}

function onWeaknessCheckboxChange() {
    // 手动模式下勾选变化时不自动生成，等点击按钮
}

// ---- 器材过滤 ----
function isEquipmentAvailable(ex) {
    return ex.equipment.every(eq => AVAILABLE_EQUIPMENT.includes(eq));
}

function getMissingEquipment(ex) {
    return ex.equipment.filter(eq => !AVAILABLE_EQUIPMENT.includes(eq));
}

function equipmentLabel(ex) {
    return ex.equipment.map(eq => TRAINING_DB.equipmentNames[eq] || eq).join('、');
}

// ---- 核心生成函数 ----
function generateTrainingPlan() {
    const studentId = document.getElementById('trainingStudentSelect').value;
    const content = document.getElementById('trainingContent');
    if (!studentId) {
        content.innerHTML = '<div class="empty-state"><p>请选择学生生成训练方案</p></div>';
        document.getElementById('trainingActions').style.display = 'none';
        return;
    }
    const student = students.find(s => s.id === studentId);
    if (!student) return;

    const grade = parseInt(student.grade);
    const ageGroup = getSensitivePeriodKey(grade);
    const sp = TRAINING_DB.sensitivePeriods[ageGroup];

    // 获取训练目标
    currentTrainingGoal = document.getElementById('trainingGoalSelect') ? document.getElementById('trainingGoalSelect').value : 'general';

    // 中考专项模式需要选择省份和城市
    if (currentTrainingGoal === 'exam_prep' && (!currentExamProvince || !currentExamCity)) {
        content.innerHTML = '<div class="empty-state"><p>请先选择中考所在省份和城市</p></div>';
        document.getElementById('trainingActions').style.display = 'none';
        return;
    }

    // 获取薄弱素质
    let targetQualities = [];
    let weakItemsHTML = '';
    let gapAnalysisHTML = '';
    let goalLabel = TRAINING_DB.trainingGoals.find(g => g.value === currentTrainingGoal)?.label || '常规体能提升';

    if (currentTrainingMode === 'auto') {
        const lastTest = getLastTest(studentId);
        if (!lastTest || !lastTest.itemScores) {
            content.innerHTML = '<div class="empty-state"><p>该学生暂无体测数据，请先进行体测，或切换到「教练手动选择薄弱项」模式</p></div>';
            document.getElementById('trainingActions').style.display = 'none';
            return;
        }
        const weakResult = analyzeWeakQualities(lastTest, student.grade);
        targetQualities = weakResult.qualities;
        weakItemsHTML = weakResult.html;
        // 中考专项模式：生成差距分析
        if (currentTrainingGoal === 'exam_prep' && currentExamProvince && currentExamCity) {
            const gapResult = generateGapAnalysis(lastTest, student);
            if (gapResult) {
                gapAnalysisHTML = gapResult.html;
                // 用差距分析结果优化训练优先级
                if (gapResult.priorities && gapResult.priorities.length > 0) {
                    targetQualities = gapResult.priorities.concat(targetQualities.filter(q => !gapResult.priorities.includes(q)));
                }
            }
        }
    } else {
        const checkboxes = document.querySelectorAll('#weaknessCheckboxGrid input:checked');
        targetQualities = Array.from(checkboxes).map(cb => cb.value);
        if (targetQualities.length === 0 && currentTrainingGoal === 'general') {
            content.innerHTML = '<div class="empty-state"><p>请至少勾选一个薄弱项，或切换到自动模式</p></div>';
            document.getElementById('trainingActions').style.display = 'none';
            return;
        }
        weakItemsHTML = targetQualities.length > 0
            ? `<div class="weakness-list">${targetQualities.map(q => `<span class="weakness-tag">${q}</span>`).join('')}</div>`
            : '<p style="color:var(--text-light);">未选择薄弱项，将根据训练目标生成方案</p>';
    }

    // 生成训练方案
    const sessionDuration = parseInt(document.getElementById('sessionDurationSelect')?.value) || 60;
    const plan = buildOneHourPlan(targetQualities, grade, ageGroup, currentTrainingGoal, currentExamCity, student, currentTrainingMode === 'auto' ? getLastTest(studentId) : null, sessionDuration);

    // 渲染方案
    content.innerHTML = renderTrainingPlan(plan, student, sp, weakItemsHTML, targetQualities, currentTrainingGoal, goalLabel, gapAnalysisHTML);
    document.getElementById('trainingActions').style.display = 'block';
}

// 智能差距分析：对比学生体测成绩与中考满分标准
function generateGapAnalysis(lastTest, student) {
    const data = zhongkaoDataCache[currentExamProvince];
    if (!data || !data.cities || !data.cities[currentExamCity]) return null;
    const city = data.cities[currentExamCity];
    const commonProjects = data.commonProjects || {};
    const isMale = student.gender !== '女';
    const fullScore = isMale ? (city.fullScore_male || {}) : (city.fullScore_female || {});
    const passScore = isMale ? (city.passScore_male || {}) : (city.passScore_female || {});
    
    const itemScores = lastTest.itemScores || {};
    const gaps = [];
    
    // 遍历中考考试项目，计算学生成绩与满分的差距
    Object.keys(fullScore).forEach(key => {
        const itemName = commonProjects[key]?.name || key;
        const fsStr = fullScore[key] || '';
        const psStr = passScore[key] || '';
        const studentScore = itemScores[key]; // 0-100 分
        
        if (studentScore !== undefined && studentScore !== null && studentScore > 0) {
            const gap = 100 - studentScore; // 差距分数
            const status = studentScore >= 90 ? 'full' : studentScore >= 60 ? 'pass' : 'fail';
            gaps.push({ key, itemName, fsStr, psStr, studentScore, gap, status });
        } else {
            // 未测试的项目也展示
            gaps.push({ key, itemName, fsStr, psStr, studentScore: null, gap: 100, status: 'untested' });
        }
    });
    
    // 按差距从大到小排序
    gaps.sort((a, b) => b.gap - a.gap);
    
    // 生成优先训练的素质
    const priorities = [];
    gaps.slice(0, 3).forEach(g => {
        if (g.status === 'fail' || g.status === 'untested') {
            const mapping = ITEM_QUALITY_MAP[g.key];
            if (mapping) {
                [mapping.quality, mapping.sub].filter(Boolean).forEach(q => {
                    if (!priorities.includes(q)) priorities.push(q);
                });
            }
        }
    });
    
    // 生成 HTML
    const html = `
    <div class="gap-analysis-box">
        <h4>🎯 中考差距分析（${currentExamCity}）</h4>
        <table class="gap-table">
            <thead><tr><th>考试项目</th><th>满分标准</th><th>及格标准</th><th>当前得分</th><th>差距</th><th>状态</th></tr></thead>
            <tbody>
                ${gaps.map(g => {
                    const statusClass = g.status === 'full' ? 'gap-full' : g.status === 'pass' ? 'gap-pass' : g.status === 'fail' ? 'gap-fail' : 'gap-untested';
                    const statusText = g.status === 'full' ? '✅ 达满分' : g.status === 'pass' ? '✓ 及格' : g.status === 'fail' ? '⚠️ 未及格' : '❓ 未测试';
                    const scoreText = g.studentScore !== null ? g.studentScore + '分' : '—';
                    const gapText = g.studentScore !== null ? '-' + g.gap + '分' : '—';
                    return `<tr class="${statusClass}"><td>${g.itemName}</td><td class="score-full">${g.fsStr}</td><td class="score-pass">${g.psStr}</td><td>${scoreText}</td><td>${gapText}</td><td>${statusText}</td></tr>`;
                }).join('')}
            </tbody>
        </table>
        ${priorities.length > 0 ? `<p class="gap-priority">🔥 优先训练：<strong>${priorities.join('、')}</strong></p>` : ''}
    </div>`;
    
    return { html, priorities, gaps };
}

function getSensitivePeriodKey(grade) {
    if (grade <= 3) return 'lower_primary';
    if (grade <= 6) return 'upper_primary';
    if (grade <= 9) return 'junior_high';
    return 'senior_high';
}

function analyzeWeakQualities(lastTest, grade) {
    const itemScores = lastTest.itemScores || {};
    const weak = Object.entries(itemScores)
        .filter(([, s]) => s > 0 && s < 80)
        .sort((a, b) => a[1] - b[1]);

    if (weak.length === 0) {
        return {
            qualities: [],
            html: '<p style="color:#16a34a;">各项成绩达标，暂无薄弱项。将根据年龄敏感期生成综合发展训练方案。</p>'
        };
    }

    const qualityMap = new Map();
    weak.forEach(([key, score]) => {
        const mapping = ITEM_QUALITY_MAP[key];
        if (!mapping) return;
        [mapping.quality, mapping.sub].filter(Boolean).forEach(q => {
            if (!qualityMap.has(q)) qualityMap.set(q, { items: [], minScore: score });
            qualityMap.get(q).items.push(getItemName(key));
            qualityMap.get(q).minScore = Math.min(qualityMap.get(q).minScore, score);
        });
    });

    const qualities = Array.from(qualityMap.entries())
        .sort((a, b) => a[1].minScore - b[1].minScore)
        .slice(0, 4)
        .map(([q]) => q);

    const html = `<div class="weakness-list">${Array.from(qualityMap.entries()).map(([q, info]) =>
        `<span class="weakness-tag">${q}（得分：${info.minScore}）</span>`
    ).join('')}</div>`;

    return { qualities, html };
}

// 根据体测得分确定动作难度等级（regression/base/progression）
function getExerciseLevel(ex, lastTest) {
    if (!lastTest || !lastTest.itemScores || !ex.levels) return 'base';
    // 找到与该动作关联的体测项目中得分最低的
    let minScore = 100;
    ex.targetQualities.forEach(q => {
        // 通过 ITEM_QUALITY_MAP 反查哪些体测项目对应这个素质
        // 使用模糊匹配处理“速度” vs“速度素质”等差异
        const itemKeys = Object.keys(ITEM_QUALITY_MAP || {}).filter(k => {
            const m = ITEM_QUALITY_MAP[k];
            if (!m) return false;
            // 精确匹配或包含匹配
            return m.quality === q || m.sub === q ||
                   (m.quality && m.quality.includes(q)) ||
                   (q && q.includes(m.quality)) ||
                   (m.sub && m.sub.includes(q));
        });
        itemKeys.forEach(k => {
            const s = lastTest.itemScores[k];
            if (s !== undefined && s !== null && s > 0 && s < minScore) minScore = s;
        });
    });
    // 如果找不到对应体测项目，默认 base
    if (minScore >= 100) return 'base';
    if (minScore < 50) return 'regression';
    if (minScore >= 80) return 'progression';
    return 'base';
}

// 获取动作在指定难度等级下的参数
function getExerciseAtLevel(ex, level) {
    if (!ex.levels || level === 'base') return ex;
    const lv = ex.levels[level];
    if (!lv) return ex;
    return {
        ...ex,
        name: lv.name || ex.name,
        sets: lv.sets || ex.sets,
        reps: lv.reps || ex.reps,
        restBetween: lv.restBetween || ex.restBetween,
        coachingPoints: lv.coaching || ex.coachingPoints,
        _level: level,
        _levelLabel: level === 'regression' ? '退阶' : level === 'progression' ? '进阶' : '标准'
    };
}

function buildOneHourPlan(targetQualities, grade, ageGroupKey, goal, examCity, student, lastTest, sessionDuration) {
    sessionDuration = sessionDuration || 60;
    // 第一性原理：按时间目标填充各阶段，而非按固定数量
    const targets = sessionDuration === 90
        ? { warmup: 15, main: 60, cooldown: 15 }
        : { warmup: 10, main: 40, cooldown: 10 };

    const allExercises = [];
    Object.values(TRAINING_DB.exercises).forEach(arr => allExercises.push(...arr));

    const ageOK = ex => grade >= 1 ? isAgeAppropriate(ex, grade) : true;
    const eqOK = ex => isEquipmentAvailable(ex);

    // 1. 热身阶段 — 按时间目标填充
    const warmupPool = TRAINING_DB.exercises.warmup.filter(ex => ageOK(ex) && eqOK(ex));
    const warmups = pickExercisesByTime(warmupPool, targets.warmup, grade, 5);

    // 2. 主体训练 — 先按目标/薄弱项选择，再按时间目标补充
    let mainExercises = [];

    if (goal === 'weight_loss') {
        // 减重模式：以燃脂+耐力为主，结合力量维持肌肉量
        const wlPool = TRAINING_DB.exercises.weight_loss.filter(ex => ageOK(ex) && eqOK(ex));
        mainExercises.push(...pickExercises(wlPool, 2, grade));
        // 补充耐力
        const enPool = TRAINING_DB.exercises.endurance.filter(ex => ageOK(ex) && eqOK(ex));
        mainExercises.push(...pickExercises(enPool, 1, grade));
        // 补充力量
        const stPool = TRAINING_DB.exercises.strength.filter(ex => ageOK(ex) && eqOK(ex));
        mainExercises.push(...pickExercises(stPool, 1, grade));

    } else if (goal === 'height_growth') {
        // 追高模式：纵向跳跃+脊柱伸展+全身协调
        const hgPool = TRAINING_DB.exercises.height_growth.filter(ex => ageOK(ex) && eqOK(ex));
        mainExercises.push(...pickExercises(hgPool, 3, grade));
        // 补充跳跃力量
        const jumpPool = TRAINING_DB.exercises.strength.filter(ex => ageOK(ex) && eqOK(ex) && ex.targetQualities.includes('下肢爆发力'));
        mainExercises.push(...pickExercises(jumpPool, 1, grade));
        // 补充协调
        const coPool = TRAINING_DB.exercises.coordination.filter(ex => ageOK(ex) && eqOK(ex));
        mainExercises.push(...pickExercises(coPool, 1, grade));

    } else if (goal === 'exam_prep' && examCity) {
        // 中考专项模式：根据城市考试项目选择专项训练
        const examExercises = TRAINING_DB.exercises.exam_prep.filter(ex => ageOK(ex));
        // 优先器材可用的，但也显示需额外器材的
        const available = examExercises.filter(eqOK);
        const needsExtra = examExercises.filter(ex => !eqOK(ex));
        mainExercises.push(...pickExercises(available, 3, grade));
        // 如果可用器材的专项不够3个，加入需额外器材的（标注）
        if (mainExercises.length < 3 && needsExtra.length > 0) {
            mainExercises.push(...needsExtra.slice(0, 3 - mainExercises.length));
        }
        // 补充体测薄弱项
        if (targetQualities.length > 0) {
            targetQualities.forEach(q => {
                const ids = TRAINING_DB.qualityMap[q] || [];
                const pool = ids.map(id => allExercises.find(e => e.id === id)).filter(e => e && ageOK(e) && eqOK(e) && !mainExercises.find(m => m.id === e.id));
                if (pool.length > 0) mainExercises.push(pickExercises(pool, 1, grade)[0]);
            });
        }

    } else {
        // 常规模式：根据薄弱素质选择
        if (targetQualities.length === 0) {
            const sp = TRAINING_DB.sensitivePeriods[ageGroupKey];
            const focusQualities = sp.focus.slice(0, 3);
            focusQualities.forEach(q => {
                const ids = TRAINING_DB.qualityMap[q] || [];
                const pool = ids.map(id => allExercises.find(e => e.id === id)).filter(e => e && ageOK(e) && eqOK(e));
                if (pool.length > 0) mainExercises.push(pickExercises(pool, 1, grade)[0]);
            });
        } else {
            targetQualities.forEach(q => {
                const ids = TRAINING_DB.qualityMap[q] || [];
                const pool = ids.map(id => allExercises.find(e => e.id === id)).filter(e => e && ageOK(e) && eqOK(e));
                if (pool.length > 0) mainExercises.push(...pickExercises(pool, Math.min(2, pool.length), grade));
            });
        }
    }

    // 去重
    const seen = new Set();
    mainExercises = mainExercises.filter(ex => {
        if (seen.has(ex.id)) return false;
        seen.add(ex.id);
        return true;
    });

    // 确保至少有3个主体练习
    if (mainExercises.length < 3) {
        const usedIds = new Set(mainExercises.map(e => e.id));
        const auxIds = ['st_002', 'co_001', 'ag_001', 'en_005', 'ag_005'];
        const auxPool = auxIds.map(id => allExercises.find(e => e.id === id)).filter(e => e && ageOK(e) && eqOK(e) && !usedIds.has(e.id));
        mainExercises.push(...pickExercises(auxPool, 3 - mainExercises.length, grade));
    }

    // 按时间目标补充主体练习
    let mainTimeAccum = mainExercises.reduce((s, e) => s + e.duration, 0);
    if (mainTimeAccum < targets.main) {
        const usedIds2 = new Set(mainExercises.map(e => e.id));
        const supPool = allExercises.filter(e =>
            ageOK(e) && eqOK(e) && !usedIds2.has(e.id) &&
            !e.id.startsWith('wu_') && !e.id.startsWith('cd_')
        );
        const extra = pickExercisesByTime(supPool, targets.main - mainTimeAccum, grade, 8 - mainExercises.length);
        mainExercises.push(...extra);
    }

    // 3. 整理放松 — 按时间目标填充
    const cooldownPool = TRAINING_DB.exercises.cooldown.filter(ex => ageOK(ex) && eqOK(ex));
    const cooldowns = pickExercisesByTime(cooldownPool, targets.cooldown, grade, 5);

    const warmupTime = warmups.reduce((s, e) => s + e.duration, 0);
    const mainTime = mainExercises.reduce((s, e) => s + e.duration, 0);
    const cooldownTime = cooldowns.reduce((s, e) => s + e.duration, 0);
    // 固定休息补水时间：热身→主体间2分钟 + 主体动作间各2分钟
    const REST_BETWEEN = 2;
    const restTime = (warmups.length > 0 && mainExercises.length > 0 ? REST_BETWEEN : 0)
                   + (mainExercises.length > 1 ? REST_BETWEEN * (mainExercises.length - 1) : 0);
    const totalTime = warmupTime + restTime + mainTime + cooldownTime;

    // 收集需要额外器材的提示
    const extraEquipmentWarnings = [];
    mainExercises.forEach(ex => {
        const missing = getMissingEquipment(ex);
        if (missing.length > 0) {
            extraEquipmentWarnings.push({ exercise: ex.name, missing: missing.map(m => TRAINING_DB.equipmentNames[m] || m) });
        }
    });

    // 根据体测得分应用进退阶难度
    const applyLevels = (exArr) => exArr.map(ex => {
        const level = getExerciseLevel(ex, lastTest);
        return getExerciseAtLevel(ex, level);
    });

    return { warmups: applyLevels(warmups), mainExercises: applyLevels(mainExercises), cooldowns: applyLevels(cooldowns), warmupTime, mainTime, cooldownTime, restTime, totalTime, extraEquipmentWarnings };
}

function isAgeAppropriate(ex, grade) {
    const age = grade <= 6 ? grade + 5 : (grade <= 9 ? grade + 6 : grade + 6);
    return age >= ex.ageRange[0] && age <= ex.ageRange[1];
}

function pickExercises(pool, count, grade) {
    if (pool.length === 0) return [];
    if (pool.length <= count) return [...pool];
    const age = grade <= 6 ? grade + 5 : (grade <= 9 ? grade + 6 : grade + 6);
    const preferredDifficulty = age < 10 ? 1 : 2;
    const sorted = [...pool].sort((a, b) => Math.abs(a.difficulty - preferredDifficulty) - Math.abs(b.difficulty - preferredDifficulty));
    const result = [];
    const candidates = sorted.slice(0, Math.min(count + 2, pool.length));
    const used = new Set();
    while (result.length < count && candidates.length > 0) {
        const idx = Math.floor(Math.random() * candidates.length);
        const ex = candidates[idx];
        if (!used.has(ex.id)) { result.push(ex); used.add(ex.id); }
        candidates.splice(idx, 1);
    }
    return result;
}

// 按时间目标挑选动作：持续添加直到总时长 >= targetMinutes，然后做最优拟合
function pickExercisesByTime(pool, targetMinutes, grade, maxCount) {
    if (pool.length === 0) return [];
    maxCount = maxCount || 10;
    const age = grade <= 6 ? grade + 5 : (grade <= 9 ? grade + 6 : grade + 6);
    const preferredDifficulty = age < 10 ? 1 : 2;
    const sorted = [...pool].sort((a, b) => Math.abs(a.difficulty - preferredDifficulty) - Math.abs(b.difficulty - preferredDifficulty));
    const result = [];
    const used = new Set();
    let totalTime = 0;
    const candidates = [...sorted];
    while (totalTime < targetMinutes && candidates.length > 0 && result.length < maxCount) {
        const pickRange = Math.min(candidates.length, 3);
        const idx = Math.floor(Math.random() * pickRange);
        const ex = candidates[idx];
        if (!used.has(ex.id)) {
            result.push(ex);
            used.add(ex.id);
            totalTime += ex.duration;
        }
        candidates.splice(idx, 1);
    }
    // 最优拟合：如果超调了且去掉最后一个动作后更接近目标，则去掉
    if (result.length > 1 && totalTime > targetMinutes) {
        const lastDur = result[result.length - 1].duration;
        const withoutLast = totalTime - lastDur;
        if (Math.abs(withoutLast - targetMinutes) < Math.abs(totalTime - targetMinutes) && withoutLast >= targetMinutes * 0.6) {
            result.pop();
            totalTime = withoutLast;
        }
    }
    return result;
}

function renderTrainingPlan(plan, student, sp, weakItemsHTML, targetQualities, goal, goalLabel, gapAnalysisHTML) {
    const studentName = student.name;
    const gradeText = getGradeText(student.grade);
    const gender = student.gender;
    const precautions = generatePrecautions(student, sp, targetQualities, goal);

    const spInfo = sp.sensitive ? `<div class="sp-info-box">
        <h5>🌱 当前所处身体素质发展敏感期</h5>
        <div class="sp-tags">${sp.sensitive.map(s => `<span class="sp-tag">${s}</span>`).join('')}</div>
        ${sp.note ? `<p class="sp-note">⚠️ ${sp.note}</p>` : ''}
    </div>` : '';

    // 额外器材警告
    const equipmentWarning = plan.extraEquipmentWarnings.length > 0 ? `
        <div class="equipment-warning-box">
            <h5>⚠️ 部分训练需要额外器材</h5>
            ${plan.extraEquipmentWarnings.map(w => `<p>• <strong>${w.exercise}</strong>：需要 ${w.missing.join('、')}</p>`).join('')}
            <p class="ew-tip">请提前准备所需器材，或替换为同类训练动作</p>
        </div>` : '';

    // 当前器材清单
    const equipmentListHTML = `<div class="equipment-list-box">
        <h5>🏓 当前可用训练器材</h5>
        <div class="eq-tags">${AVAILABLE_EQUIPMENT.filter(e => e !== 'none').map(e =>
            `<span class="eq-tag">${TRAINING_DB.equipmentNames[e] || e}</span>`
        ).join('')}</div>
    </div>`;

    // 中考城市信息
    const examData = zhongkaoDataCache[currentExamProvince];
    const examInfoHTML = (goal === 'exam_prep' && currentExamCity && examData?.cities?.[currentExamCity]) ? `
        <div class="exam-plan-header">
            <h4>🎯 ${currentExamProvince} · ${currentExamCity}中考体育专项训练</h4>
            <p>总分${examData.cities[currentExamCity].totalScore}分 · ${examData.cities[currentExamCity].structure}</p>
        </div>` : '';

    // 训练目标说明
    const goalDesc = TRAINING_DB.trainingGoals.find(g => g.value === goal)?.description || '';
    const goalInfoHTML = goal !== 'general' ? `<div class="goal-info-box"><p>🎯 <strong>${goalLabel}</strong>：${goalDesc}</p></div>` : '';

    return `
        <div class="training-plan-header">
            <div class="plan-title">
                <h3>📋 ${studentName}的个性化训练方案</h3>
                <span class="plan-meta">${gradeText} · ${gender} · ${goalLabel} · 时长${plan.totalTime}分钟</span>
            </div>
        </div>

        ${goalInfoHTML}
        ${examInfoHTML}
        ${gapAnalysisHTML || ''}

        <div class="weakness-analysis">
            <h4>🔍 薄弱项分析</h4>
            ${weakItemsHTML}
        </div>

        ${equipmentListHTML}
        ${equipmentWarning}
        ${spInfo}

        <div class="training-timeline">
            <div class="timeline-bar">
                <div class="timeline-seg warmup" style="flex:${plan.warmupTime}">热身 ${plan.warmupTime}min</div>
                ${plan.restTime > 0 ? `<div class="timeline-seg" style="flex:${plan.restTime};background:#d1d5db;color:#4b5563;">休息补水 ${plan.restTime}min</div>` : ''}
                <div class="timeline-seg main" style="flex:${plan.mainTime}">主体训练 ${plan.mainTime}min</div>
                <div class="timeline-seg cooldown" style="flex:${plan.cooldownTime}">放松 ${plan.cooldownTime}min</div>
            </div>
        </div>

        <div class="training-phase">
            <h4>🔥 一、热身阶段（约${plan.warmupTime}分钟）</h4>
            <p class="phase-goal">目标：提升体温、激活关节与核心、为正式训练做好准备</p>
            ${plan.warmups.map((ex, i) => renderExerciseCard(ex, i)).join('')}
        </div>

        ${plan.restTime > 0 && plan.warmups.length > 0 && plan.mainExercises.length > 0 ? `<div style="text-align:center;padding:8px;margin:8px 0;background:#f3f4f6;border-radius:8px;"><span style="font-size:13px;color:#6b7280;">💧 <strong>休息补水 2分钟</strong> — 热身结束，补充水分，准备进入主体训练</span></div>` : ''}

        <div class="training-phase">
            <h4>💪 二、主体训练（约${plan.mainTime}分钟${plan.restTime > 0 ? ` + 休息${plan.restTime}分钟` : ''}）</h4>
            <p class="phase-goal">目标：${goal === 'weight_loss' ? '高强度燃脂+力量维持，提升基础代谢率' : goal === 'height_growth' ? '纵向跳跃刺激生长板+脊柱伸展促进骨骼生长' : goal === 'exam_prep' ? '针对中考体育项目进行专项技术训练' : '针对薄弱素质进行重点提升，结合年龄敏感期科学安排训练负荷'}</p>
            ${plan.mainExercises.map((ex, i) => renderExerciseCard(ex, i) + (i < plan.mainExercises.length - 1 ? '<div style="text-align:center;padding:6px;margin:6px 0;background:#f9fafb;border-radius:6px;"><span style="font-size:12px;color:#9ca3af;">💧 休息补水 2分钟</span></div>' : '')).join('')}
        </div>

        <div class="training-phase">
            <h4>🧘 三、整理放松（约${plan.cooldownTime}分钟）</h4>
            <p class="phase-goal">目标：促进乳酸代谢、放松肌肉、恢复心率、预防延迟性肌肉酸痛${goal === 'height_growth' ? '；追高训练后充分拉伸促进生长激素分泌' : ''}</p>
            ${plan.cooldowns.map((ex, i) => renderExerciseCard(ex, i)).join('')}
        </div>

        <div class="attention-box">
            <h4>⚠️ 训练注意事项</h4>
            <ul>
                ${precautions.map(p => `<li>${p}</li>`).join('')}
            </ul>
        </div>

        <div class="plan-footer">
            <p class="plan-tip">💡 本方案基于${sp.name}（${sp.ageRange}）身体素质发展敏感期理论${goal === 'exam_prep' ? '及' + currentExamCity + '市中考体育方案' : ''}生成，建议每周执行3-4次，4周后重新评估调整。训练中关注学生状态，如有不适应立即降低强度或停止。</p>
        </div>
    `;
}

function renderExerciseCard(ex, index) {
    const diffColors = { 1: '#22c55e', 2: '#f59e0b', 3: '#ef4444' };
    const diffNames = { 1: '入门', 2: '进阶', 3: '高级' };
    // 如果有难度等级标记，显示进退阶信息
    const levelBadge = ex._level && ex._level !== 'base' 
        ? `<span class="exercise-difficulty" style="background:${ex._level === 'regression' ? '#3b82f620' : '#8b5cf620'};color:${ex._level === 'regression' ? '#3b82f6' : '#8b5cf6'};">${ex._levelLabel}</span>` 
        : '';
    const qualityTags = ex.targetQualities.map(q => `<span class="ex-quality-tag">${q}</span>`).join('');
    const needsExtra = !isEquipmentAvailable(ex);
    const eqHTML = ex.equipment.map(eq => {
        const isMissing = !AVAILABLE_EQUIPMENT.includes(eq);
        return `<span class="${isMissing ? 'ex-eq-missing' : 'ex-eq-ok'}">${TRAINING_DB.equipmentNames[eq] || eq}</span>`;
    }).join('<span style="color:var(--text-light)">·</span>');

    return `
        <div class="exercise-card${needsExtra ? ' exercise-card-warning' : ''}">
            <div class="exercise-header">
                <span class="exercise-num">${index + 1}</span>
                <span class="exercise-name">${ex.name}</span>
                <span class="exercise-difficulty" style="background:${diffColors[ex.difficulty]}20;color:${diffColors[ex.difficulty]};">${diffNames[ex.difficulty]}</span>
                ${levelBadge}
                ${needsExtra ? '<span class="ex-warn-badge">需额外器材</span>' : ''}
            </div>
            <div class="exercise-meta">
                <span>⏱ ${ex.duration}分钟</span>
                <span>📊 ${ex.sets}</span>
                <span>🔁 ${ex.reps}</span>
                ${ex.restBetween ? `<span>⏸ 间歇${ex.restBetween}</span>` : ''}
            </div>
            <div class="exercise-equipment">🏓 ${eqHTML}</div>
            <div class="exercise-qualities">${qualityTags}</div>
            <p class="exercise-desc">${ex.description}</p>
            <div class="exercise-detail">
                <div class="detail-item"><span class="detail-label">动作要领</span><span class="detail-text">${ex.coachingPoints}</span></div>
                <div class="detail-item"><span class="detail-label">安全提示</span><span class="detail-text">${ex.safetyNotes}</span></div>
            </div>
        </div>
    `;
}

function generatePrecautions(student, sp, targetQualities, goal) {
    const grade = parseInt(student.grade);
    const age = grade <= 6 ? grade + 5 : (grade <= 9 ? grade + 6 : grade + 6);
    const precautions = [];

    precautions.push('运动前充分热身，激活关节与核心肌群，预防损伤');
    precautions.push('根据孩子当日状态灵活调整强度，避免疲劳训练');
    precautions.push('如感到不适或疼痛，立即停止并观察，必要时就医');
    precautions.push('保证充足睡眠与均衡营养，训练效果一半来自恢复');

    if (age < 10) {
        precautions.push('低龄儿童以游戏化训练为主，避免枯燥重复，注重趣味性和参与感');
        precautions.push('避免大重量力量训练和长时间力竭性耐力训练，以自重和短时活动为主');
    } else if (age < 13) {
        precautions.push('灵敏素质和速度训练是当前敏感期重点，但单次训练时间不宜过长');
        precautions.push('柔韧性训练应贯穿始终，每天进行10分钟动态拉伸');
    } else if (age < 16) {
        precautions.push('青春期生长突增期，骨骼生长快于肌肉韧带，注意防止柔韧性下降和运动损伤');
        precautions.push(`${student.gender === '女' ? '女生注意月经期训练调整，避免大强度腹部和倒置动作' : '男生力量训练以徒手和轻负荷为主，避免脊柱大负荷练习'}`);
        precautions.push('避免憋气动作，以免胸内压突然变化影响心脏发育');
    } else {
        precautions.push('可进行系统化力量训练，但需注意动作质量控制，避免过度训练导致关节损伤');
        precautions.push('结合心率监控科学安排负荷（建议靶心率在最大心率的65%-85%）');
    }

    if (sp.note) precautions.push(`⚠️ ${sp.note}`);

    // 训练目标特定注意事项
    if (goal === 'weight_loss') {
        precautions.push('减重训练需配合饮食控制，减少高糖高脂食物，增加蛋白质和蔬果摄入');
        precautions.push('BMI超过28的学生避免长时间跳跃和高冲击动作，保护膝关节');
        precautions.push('训练后30分钟内补充适量蛋白质，促进肌肉恢复和代谢提升');
    } else if (goal === 'height_growth') {
        precautions.push('追高训练最佳时期为骨骺未闭合前（男16岁/女14岁前），建议每年拍骨龄片评估');
        precautions.push('保证每天9-10小时深度睡眠，生长激素主要在夜间深度睡眠时分泌');
        precautions.push('补充充足钙质（每日800-1200mg）和维生素D，促进骨骼生长');
        precautions.push('纵向跳跃训练后进行充分脊柱伸展，利用重力促进脊柱间隙恢复');
    } else if (goal === 'exam_prep') {
        precautions.push('中考专项训练以技术规范为主，不要盲目追求成绩而忽视动作质量');
        precautions.push('考试前2周开始减量训练，保持技术感觉但不疲劳积累');
        precautions.push('建议每月进行1次模拟测试，熟悉考试流程和节奏');
        precautions.push('注意各项目考试规则细节（如跳绳中途断绳计数方式、立定跳远起跳线等）');
    }

    if (targetQualities.includes('柔韧性')) {
        precautions.push('柔韧性训练时注意幅度循序渐进，13-16岁快速生长期避免过分扭转');
    }
    if (targetQualities.includes('心肺耐力') && age < 12) {
        precautions.push('儿童心肺功能仍在发育中，有氧运动以中低强度为主');
    }

    return precautions;
}

async function saveTrainingPlan() {
    const studentId = document.getElementById('trainingStudentSelect').value;
    if (!studentId) { showToast('请先选择学生', 'error'); return; }
    const student = students.find(s => s.id === studentId);
    if (!student) return;
    const planData = {
        goal: currentTrainingGoal || 'general',
        goalLabel: '',
        targetQualities: currentTrainingMode === 'manual' ? [...selectedWeaknesses] : [],
        plan: { html: document.getElementById('trainingContent').innerHTML, mode: currentTrainingMode, examCity: currentExamCity },
        examCity: currentExamCity || ''
    };
    try {
        const created = await planDB.create(studentId, planData);
        if (!student.trainingPlans) student.trainingPlans = [];
        student.trainingPlans.push({
            id: created.id,
            date: created.created_at?.split('T')[0] || new Date().toISOString().split('T')[0],
            mode: currentTrainingMode,
            goal: currentTrainingGoal,
            examCity: currentExamCity,
            content: document.getElementById('trainingContent').innerHTML
        });
        showToast('训练方案已保存', 'success');
    } catch (e) {
        console.error('saveTrainingPlan:', e);
        showToast('保存失败: ' + e.message, 'error');
    }
}

function exportTrainingPlan() {
    const studentId = document.getElementById('trainingStudentSelect').value;
    if (!studentId) { showToast('请先选择学生', 'error'); return; }
    const student = students.find(s => s.id === studentId);
    if (!student) return;
    const content = document.getElementById('trainingContent');
    const planText = content.innerText;
    const blob = new Blob([planText], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${student.name}_训练方案_${new Date().toISOString().slice(0, 10)}.txt`;
    a.click();
    URL.revokeObjectURL(url);
    showToast('训练方案已导出', 'success');
}

// ==================== 历史记录 ====================
async function loadHistory() {
    const container = document.getElementById('historyContent');
    container.innerHTML = '<div style="text-align:center;padding:40px;color:var(--text-light);">⏳ 加载中...</div>';
    const allTests = [];
    // 从 Supabase 逐个加载每个学生的体测记录
    for (const student of students) {
        try {
            const tests = await fetchStudentTests(student.id);
            if (tests && tests.length > 0) {
                tests.forEach(test => allTests.push({...test, studentId: student.id, studentName: student.name, studentGrade: student.grade}));
            }
        } catch (e) {
            console.error('loadHistory student:', student.id, e);
        }
    }
    allTests.sort((a, b) => new Date(b.date || 0) - new Date(a.date || 0));
    if (allTests.length === 0) { 
        container.innerHTML = `
            <div class="empty-state">
                <div class="icon">📈</div>
                <h3>暂无历史记录</h3>
                <p>录入体测后，这里会展示所有学生的体测历史</p>
            </div>
        `; 
        return; 
    }
    container.innerHTML = allTests.slice(0, 20).map(test => {
        const gradeClass = getGradeClass(test.totalScore);
        const dateStr = test.date || '未知日期';
        const nameStr = test.studentName || '未知学生';
        const gradeStr = getGradeText(test.studentGrade) || '-';
        const safeTestId = (test.id || '').replace(/'/g, "\\'");
        const safeStudentId = (test.studentId || '').replace(/'/g, "\\'");
        const items = test.items || {};
        const itemEntries = Object.entries(items);
        const itemsHtml = itemEntries.length === 0 
            ? '<p style="color:var(--text-light);font-size:13px;padding:8px 0">无体测项目数据</p>'
            : itemEntries.slice(0, 4).map(([key, value]) => `<div class="history-detail-item"><div class="label">${getItemName(key)}</div><div class="value">${value}${getItemUnit(key)}</div></div>`).join('');
        return `<div class="history-item">
            <div class="history-header">
                <span class="history-date">${dateStr} · ${nameStr} (${gradeStr})</span>
                <div style="display:flex;align-items:center;gap:10px">
                    <span class="history-score ${gradeClass}">${test.totalScore !== undefined ? test.totalScore : '-'}分 · ${getGradeLabel(test.totalScore)}</span>
                    <button class="btn-danger btn-sm" onclick="deleteTest('${safeStudentId}', '${safeTestId}')">删除</button>
                </div>
            </div>
            <div class="history-details">${itemsHtml}</div>
        </div>`;
    }).join('');
}

async function deleteTest(studentId, testId) {
    if (!confirm('确定要删除这条体测记录吗？此操作不可恢复。')) return;
    const studentIndex = students.findIndex(s => s.id === studentId);
    if (studentIndex === -1) return;
    const student = students[studentIndex];
    if (!student.tests) return;
    student.tests = student.tests.filter(t => t.id !== testId);
    await saveStudents();
    showToast('体测记录已删除', 'success');
    loadHistory();
}

// ==================== 学生适用项目映射 ====================
// 返回该年级适用的体测项目key列表
function getApplicableTestKeys(grade, gender) {
    const level = getStudentLevel(grade);
    const gradeNum = parseInt(grade);
    
    // 通用基础项目（所有年级都有）
    const baseKeys = ['height', 'weight', 'run_50m', 'sit_and_reach'];
    
    // 所有年级都包含闭眼单腿站立和T型跑（7-18岁适用）
    const balanceAndAgility = ['balance_stand', 't_test'];
    
    if (level === '小学') {
        const primary = ['jump_rope_1min']; // 小学必测
        const mid = gradeNum >= 3 ? ['sit_up_1min'] : []; // 3年级起
        const senior = gradeNum >= 5 ? ['run_50m_8'] : []; // 5年级起
        return [...baseKeys, ...primary, ...mid, ...senior, ...balanceAndAgility];
    } else if (level === '初中' || level === '高中') {
        // 初中/高中：男生考1000米+引体向上+实心球(二选一)，女生考800米+仰卧起坐+斜身引体+实心球(二选一)
        // 球类三选一：足球运球/篮球运球/排球垫球
        const endurance = gender === '男' 
            ? ['run_1000m', 'pull_up', 'solid_ball'] 
            : ['run_800m', 'sit_up_1min', 'incline_pull_up', 'solid_ball'];
        const ballSkills = ['football_dribble', 'basketball_dribble', 'basketball_layup', 'volleyball_bump'];
        return [...baseKeys, ...endurance, 'standing_long_jump', ...ballSkills, ...balanceAndAgility];
    }
    return baseKeys;
}

// 根据年级获取项目中文名和单位
function getItemMeta(key) {
    const metas = {
        'height': { name: '身高', unit: 'cm' },
        'weight': { name: '体重', unit: 'kg' },
        'run_50m': { name: '50米跑', unit: '秒' },
        'sit_and_reach': { name: '坐位体前屈', unit: 'cm' },
        'jump_rope_1min': { name: '1分钟跳绳', unit: '次' },
        'sit_up_1min': { name: '1分钟仰卧起坐', unit: '次' },
        'pull_up': { name: '引体向上', unit: '次' },
        'incline_pull_up': { name: '斜身引体', unit: '次' },
        'solid_ball': { name: '实心球', unit: '米' },
        'run_50m_8': { name: '50米×8往返跑', unit: "分'秒" },
        'run_800m': { name: '800米跑', unit: "分'秒" },
        'run_1000m': { name: '1000米跑', unit: "分'秒" },
        'standing_long_jump': { name: '立定跳远', unit: 'cm' },
        'balance_stand': { name: '闭眼单腿站立', unit: '秒' },
        't_test': { name: 'T型跑', unit: '秒' },
        'football_dribble': { name: '足球运球绕杆', unit: '秒' },
        'basketball_dribble': { name: '篮球绕杆运球', unit: '秒' },
        'basketball_layup': { name: '篮球运球上篮', unit: '秒' },
        'volleyball_bump': { name: '排球垫球', unit: '次' },
        'bmi': { name: 'BMI指数', unit: 'kg/m²' }
    };
    return metas[key] || { name: key, unit: '' };
}

function getItemName(key) { return getItemMeta(key).name; }
function getItemUnit(key) { return getItemMeta(key).unit; }
let extractedData = null;
let currentUploadType = 'excel';

// 上传类型配置
const UPLOAD_CONFIG = {
    excel: {
        accept: '.xlsx,.xls',
        title: '点击上传 Excel 文件',
        desc: '或将 Excel 文件拖拽到此处',
        formats: '支持 .xlsx .xls',
        icon: '📊'
    },
    pdf: {
        accept: '.pdf',
        title: '点击上传 PDF 文件',
        desc: '或将 PDF 文件拖拽到此处',
        formats: '支持 .pdf',
        icon: '📄'
    },
    image: {
        accept: '.jpg,.jpeg,.png',
        title: '点击上传图片文件',
        desc: '或将图片拖拽到此处，支持拍照上传',
        formats: '支持 .jpg .png',
        icon: '🖼️'
    }
};

// 切换上传类型
function switchUploadTab(type) {
    try {
        currentUploadType = type;
        document.querySelectorAll('.upload-tab').forEach(t => t.classList.remove('active'));
        const tabBtn = document.querySelector(`.upload-tab[data-type="${type}"]`);
        if (tabBtn) tabBtn.classList.add('active');
        
        const config = UPLOAD_CONFIG[type];
        if (!config) return;
        const titleEl = document.getElementById('uploadTitle');
        const descEl = document.getElementById('uploadDesc');
        const docUpload = document.getElementById('docUpload');
        if (titleEl) titleEl.textContent = config.title;
        if (descEl) descEl.textContent = config.desc;
        if (docUpload) docUpload.accept = config.accept;
        
        clearUploadResult();
        
        // 切换 Tab 后自动弹出文件选择器
        // input 已用 .file-input-hidden 视觉隐藏（非 display:none），.click() 在所有浏览器可用
        // 同时 <label for="docUpload"> 作为原生后备：即使 .click() 失败，点击上传区域仍可弹窗
        if (docUpload) docUpload.click();
    } catch(e) {
        console.error('switchUploadTab error:', e);
    }
}

// 处理文档上传
async function handleDocUpload(event) {
    const file = event.target.files[0];
    if (!file) return;
    
    // 获取当前选中学生的年级和性别（如有）
    const studentSelect = document.getElementById('testStudentSelect');
    let grade = '1', gender = '男';
    if (studentSelect && studentSelect.value) {
        const student = students.find(s => s.id === studentSelect.value);
        if (student) {
            grade = student.grade;
            gender = student.gender;
        }
    }
    
    const ext = file.name.split('.').pop().toLowerCase();
    const type = ext === 'pdf' ? 'pdf' : (['jpg', 'jpeg', 'png'].includes(ext) ? 'image' : 'excel');
    
    // 图片类型先走预览旋转流程
    if (type === 'image') {
        showImagePreview(file);
        event.target.value = '';
        return;
    }
    
    showUploadProgress(`正在解析 ${file.name}...`);
    
    try {
        let result;
        switch(type) {
            case 'excel':
                result = await parseExcel(file, grade, gender);
                break;
            case 'pdf':
                result = await parsePDF(file, grade, gender);
                break;
            case 'image':
                result = await parseImage(file, grade, gender);
                break;
        }
        
        if (result && result.items && Object.keys(result.items).length > 0) {
            extractedData = result;
            showUploadSuccess(result);
        } else {
            showUploadError('未能识别到体测数据，请检查文件格式或手动输入');
        }
    } catch(err) {
        console.error('解析失败:', err);
        showUploadError('文档解析失败: ' + err.message);
    }
    
    event.target.value = '';
}

// Excel 解析
async function parseExcel(file, grade, gender) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const data = new Uint8Array(e.target.result);
                const workbook = XLSX.read(data, {type: 'array'});
                const sheetName = workbook.SheetNames[0];
                const sheet = workbook.Sheets[sheetName];
                const jsonData = XLSX.utils.sheet_to_json(sheet, {header: 1});
                
                console.log('Excel原始数据:', jsonData);
                const result = extractPhysicalTestData(jsonData, grade, gender);
                resolve(result);
            } catch(err) {
                reject(err);
            }
        };
        reader.onerror = reject;
        reader.readAsArrayBuffer(file);
    });
}

// PDF 解析
async function parsePDF(file, grade, gender) {
    updateProgress(30, '正在提取PDF文本...');
    const reader = new FileReader();
    return new Promise((resolve, reject) => {
        reader.onload = async (e) => {
            try {
                const typedArray = new Uint8Array(e.target.result);
                const pdf = await pdfjsLib.getDocument(typedArray).promise;
                const totalPages = pdf.numPages;
                let fullText = '';
                
                for (let i = 1; i <= totalPages; i++) {
                    updateProgress(30 + Math.round((i / totalPages) * 40), `正在解析第 ${i}/${totalPages} 页...`);
                    const page = await pdf.getPage(i);
                    const content = await page.getTextContent();
                    const pageText = content.items.map(item => item.str).join(' ');
                    fullText += pageText + '\n';
                }
                
                console.log('PDF提取文本:', fullText);
                updateProgress(80, '正在识别体测数据...');
                
                const lines = fullText.split('\n').filter(l => l.trim());
                const result = extractPhysicalTestData(lines, grade, gender);
                resolve(result);
            } catch(err) {
                reject(err);
            }
        };
        reader.onerror = reject;
        reader.readAsArrayBuffer(file);
    });
}

// 图片 OCR 解析（委托给 parseImageFromDataUrl）
async function parseImage(file, grade, gender) {
    updateProgress(20, '正在初始化OCR引擎...');
    
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = async (e) => {
            try {
                const imgDataUrl = e.target.result;
                const result = await parseImageFromDataUrl(imgDataUrl, grade, gender);
                resolve(result);
            } catch(err) {
                reject(err);
            }
        };
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });
}

// 从 DataURL 进行 OCR（支持旋转后的图片）
async function parseImageFromDataUrl(imgDataUrl, grade, gender) {
    updateProgress(20, '正在初始化OCR引擎...');
    
    const result = await Tesseract.recognize(imgDataUrl, 'chi_sim+eng', {
        logger: (m) => {
            if (m.status === 'recognizing text') {
                updateProgress(30 + Math.round(m.progress * 50), `正在OCR识别 ${Math.round(m.progress * 100)}%`);
            }
        }
    });
    
    console.log('OCR识别结果:', result.data.text);
    updateProgress(85, '正在提取体测数据...');
    
    const lines = result.data.text.split('\n').filter(l => l.trim());
    
    // 提取行级置信度
    let lineConfidenceArr = null;
    if (result.data.lines && result.data.lines.length > 0) {
        const ocrLines = result.data.lines.map(l => ({ text: l.text.trim(), confidence: l.confidence }));
        lineConfidenceArr = lines.map(textLine => {
            const match = ocrLines.find(ol => ol.text === textLine || ol.text.includes(textLine) || textLine.includes(ol.text));
            return match ? match.confidence : null;
        });
    }
    
    const data = extractPhysicalTestData(lines, grade, gender, lineConfidenceArr);
    return data;
}

// 从数据中提取体测项目（根据年级过滤）
function extractPhysicalTestData(data, grade, gender, lineConfidenceArr = null) {
    const items = {};
    const confidence = {};
    const rawData = Array.isArray(data) ? data : [data];
    
    // 获取该年级适用的项目keys（根据性别区分）
    const applicableKeys = getApplicableTestKeys(grade, gender);
    
    // 将二维数组转为一维文本，便于关键词匹配
    const lines = rawData.map(row => Array.isArray(row) ? row.join(' ') : String(row));
    
    // 体测项目关键词映射 — 含 OCR 容错变体
    const itemPatterns = {
        'height': { keys: ['身高', '身长', 'height'], unit: 'cm' },
        'weight': { keys: ['体重', 'weight'], unit: 'kg' },
        'run_50m': { keys: ['50米跑', '50m', '50M', '5Om'], unit: '秒' },  // 移除'50米'，避免误匹配'50米×8'
        'sit_and_reach': { keys: ['坐位体前屈', '体前屈', '前屈'], unit: 'cm' },
        'jump_rope_1min': { keys: ['1分钟跳绳', '一分钟跳绳', '跳绳'], unit: '次' },
        'sit_up_1min': { keys: ['1分钟仰卧起坐', '一分钟仰卧起坐', '仰卧起坐'], unit: '次' },
        'pull_up': { keys: ['引体向上', '引体'], unit: '次' },
        'incline_pull_up': { keys: ['斜身引体', '斜身'], unit: '次' },
        'solid_ball': { keys: ['实心球', '掷实心球', '投实心球'], unit: '米' },
        'run_50m_8': { keys: ['50米×8往返跑', '50米×8', '50×8', '往返跑'], unit: "分'秒" },
        'run_800m': { keys: ['800米跑', '800米', '800m', '800M', '8OO米'], unit: "分'秒" },
        'run_1000m': { keys: ['1000米跑', '1000米', '1000m', '1000M', 'l000米', 'I000米', '1OOO米'], unit: "分'秒" },
        'standing_long_jump': { keys: ['立定跳远', '跳远'], unit: 'cm' },
        'balance_stand': { keys: ['平衡能力', '闭眼单腿站立', '闭眼单脚站立', '单脚闭眼', '单脚站立'], unit: '秒' },
        't_test': { keys: ['T型跑', 'T形跑', 'T跑', '灵敏性', '灵敏'], unit: '秒' },
        'football_dribble': { keys: ['足球运球', '足球绕杆', '足球'], unit: '秒' },
        'basketball_dribble': { keys: ['篮球绕杆运球', '篮球运球', '篮球绕杆'], unit: '秒' },
        'basketball_layup': { keys: ['篮球运球上篮', '篮球上篮', '行进间运球上篮'], unit: '秒' },
        'volleyball_bump': { keys: ['排球垫球', '排球对墙垫球', '排球'], unit: '次' }
    };
    
    // 单位到正则的映射（用于"数字+单位"优先匹配）
    // 时间正则支持：3'25" / 3′25″ / 3分25秒 / 3:25 / 3：25
    const unitPatterns = {
        '次': /(\d+\.?\d*)\s*次/,
        '秒': /(\d+\.?\d*)\s*秒/,
        'cm': /(\d+\.?\d*)\s*cm/,
        'kg': /(\d+\.?\d*)\s*kg/,
        '米': /(\d+\.?\d*)\s*米/,
        '分': /(\d+)\s*['′分:：]\s*(\d{1,2})\s*["″秒]?/
    };
    
    // 项目单位 -> 单位模式映射
    const unitMap = {
        '次': '次', '秒': '秒', 'cm': 'cm', 'kg': 'kg',
        "分'秒": '分', '分秒': '分'
    };
    
    // 从每一行/列提取数据
    for (let lineIdx = 0; lineIdx < lines.length; lineIdx++) {
        // 归一化：去除数字与单位间的空格（OCR 常见问题），如 "1000 米" → "1000米"
        const lineText = lines[lineIdx].trim().replace(/(\d)\s+(米|m|M|秒|次|cm|kg)/gi, '$1$2');
        if (!lineText) continue;
        
        for (const [key, config] of Object.entries(itemPatterns)) {
            // 不再按 applicableKeys 过滤 — 提取所有能识别的项目，显示时再过滤
            // 这样即使学生是女生或小学，文件中有1000米跑也能提取出来
            // 已找到则跳过（首次匹配优先）
            if (items[key] !== undefined) continue;
            
            // 检查是否包含项目关键词，并找到最靠前的匹配
            let matchedKeyword = '';
            let keywordIndex = Infinity;
            for (const k of config.keys) {
                const idx = lineText.indexOf(k);
                if (idx !== -1 && idx < keywordIndex) {
                    matchedKeyword = k;
                    keywordIndex = idx;
                }
            }
            if (keywordIndex === Infinity) continue;
            
            // 从匹配到的关键词之后截取
            let afterKeyword = lineText.substring(keywordIndex + matchedKeyword.length);
            
            let value = null;
            
            // 策略1：优先匹配"数字+单位"模式（如 137次、17.5秒、10cm）
            // 这能避免"小学1-6年级"中的数字被截获
            const targetUnit = unitMap[config.unit];
            if (targetUnit && unitPatterns[targetUnit]) {
                const regex = unitPatterns[targetUnit];
                const m = afterKeyword.match(regex);
                if (m) {
                    if (targetUnit === '分') {
                        value = `${m[1]}'${m[2]}"`;
                    } else {
                        value = parseFloat(m[1]);
                    }
                }
            }
            
            // 策略2：如果没找到带单位的数字，尝试更多匹配方式
            if (value === null) {
                // 策略2a：对于时间类型项目（分'秒），尝试匹配 X:XX / X.XX 格式
                if (config.unit === "分'秒" || config.unit === '分秒') {
                    const timeMatch = afterKeyword.match(/(\d+)\s*[:：.]\s*(\d{1,2})/);
                    if (timeMatch) {
                        const mins = parseInt(timeMatch[1]);
                        const secs = parseInt(timeMatch[2]);
                        // 合理的时间范围：1-10分钟，秒数 0-59
                        if (secs < 60 && mins >= 1 && mins <= 10) {
                            value = `${mins}'${secs}"`;
                        }
                    }
                }
                
                // 策略2b：清理干扰文本后匹配普通数字（仅非时间类型）
                if (value === null && config.unit !== "分'秒" && config.unit !== '分秒') {
                    const cleaned = afterKeyword
                        .replace(/小学\d+-\d+年级[\/\w\s]*/, '')
                        .replace(/全学段/, '')
                        .replace(/初中[男女]生/, '')
                        .replace(/高中[男女]生/, '')
                        .replace(/[男女]生/, '');
                    
                    const numMatch = cleaned.match(/(\d+\.?\d*)/);
                    if (numMatch) {
                        value = parseFloat(numMatch[1]);
                    }
                }
            }
            
            // 过滤掉无效值：空、0、负数
            if (value !== null && (typeof value === 'string' || value > 0)) {
                items[key] = value;
                if (lineConfidenceArr && lineConfidenceArr[lineIdx] != null) {
                    confidence[key] = lineConfidenceArr[lineIdx];
                }
            }
        }
    }
    
    // 智能补充：如果有身高体重，尝试计算BMI
    if (items.height && items.weight) {
        const bmi = (items.weight / Math.pow(items.height / 100, 2)).toFixed(1);
        items.bmi = parseFloat(bmi);
        if (confidence.height != null && confidence.weight != null) {
            confidence.bmi = Math.min(confidence.height, confidence.weight);
        }
    }
    
    return { items, rawData, applicableKeys, confidence };
}

// 显示上传进度
function showUploadProgress(text) {
    document.getElementById('uploadHint').style.display = 'none';
    document.getElementById('uploadProgress').style.display = 'block';
    document.getElementById('resultPreview').parentElement.style.display = 'none';
    document.getElementById('progressText').textContent = text;
    document.getElementById('progressFill').style.width = '20%';
    
    // 模拟进度动画
    let progress = 20;
    const interval = setInterval(() => {
        progress = Math.min(progress + Math.random() * 15, 85);
        document.getElementById('progressFill').style.width = progress + '%';
        if (progress >= 85) clearInterval(interval);
    }, 500);
}

function updateProgress(percent, text) {
    const fill = document.getElementById('progressFill');
    const textEl = document.getElementById('progressText');
    if (fill) fill.style.width = percent + '%';
    if (textEl) textEl.textContent = text;
}

// 显示上传成功
function showUploadSuccess(result) {
    document.getElementById('uploadHint').style.display = 'none';
    document.getElementById('uploadProgress').style.display = 'none';
    document.getElementById('uploadResult').style.display = 'block';
    document.getElementById('progressFill').style.width = '100%';
    
    const itemNames = Object.keys(result.items);
    const preview = document.getElementById('resultPreview');
    const conf = result.confidence || {};
    
    if (itemNames.length === 0) {
        preview.innerHTML = '<p style="color:var(--text-light);padding:12px">未能识别到体测数据</p>';
        document.getElementById('resultText').textContent = '未识别到有效数据';
        return;
    }
    
    const lowConfItems = itemNames.filter(k => conf[k] != null && conf[k] < 60);
    const hasConfidence = Object.keys(conf).length > 0;
    
    let warningHTML = '';
    if (hasConfidence && lowConfItems.length > 0) {
        warningHTML = `<div class="confidence-warning">\u26a0\ufe0f ${lowConfItems.length} \u9879\u6570\u636e\u8bc6\u522b\u7f6e\u4fe1\u5ea6\u8f83\u4f4e\uff0c\u6807\u7ea2\u5904\u8bf7\u91cd\u70b9\u6838\u5bf9</div>`;
    }
    
    preview.innerHTML = `
        ${warningHTML}
        <table class="extract-table">
            <thead><tr><th>\u9879\u76ee</th><th>\u8bc6\u522b\u503c</th><th>\u5355\u4f4d</th>${hasConfidence ? '<th>\u7f6e\u4fe1\u5ea6</th>' : ''}</tr></thead>
            <tbody>
                ${itemNames.map(key => {
                    const c = conf[key];
                    let confClass = '';
                    let confText = '\u2014';
                    let inputClass = '';
                    if (c != null) {
                        const pct = Math.round(c);
                        if (c >= 80) { confClass = 'conf-high'; confText = `${pct}% \u2713`; }
                        else if (c >= 60) { confClass = 'conf-medium'; confText = `${pct}%`; }
                        else { confClass = 'conf-low'; confText = `${pct}% \u26a0\ufe0f`; inputClass = 'extract-input-low'; }
                    }
                    return `
                    <tr class="${confClass}">
                        <td>${getItemName(key)}</td>
                        <td><input type="text" id="extract_${key}" value="${String(result.items[key]).replace(/"/g, '&quot;')}" class="extract-input ${inputClass}"></td>
                        <td>${getItemUnit(key)}</td>
                        ${hasConfidence ? `<td class="conf-cell">${confText}</td>` : ''}
                    </tr>`;
                }).join('')}
            </tbody>
        </table>
    `;
    
    document.getElementById('resultText').textContent = `成功识别 ${itemNames.length} 项体测数据`;
}

// 显示上传错误
function showUploadError(message) {
    document.getElementById('uploadHint').style.display = 'none';
    document.getElementById('uploadProgress').style.display = 'none';
    document.getElementById('uploadResult').style.display = 'block';
    document.getElementById('resultText').textContent = '解析失败';
    document.getElementById('resultPreview').innerHTML = `
        <div style="color:var(--danger);padding:12px;text-align:center">
            <p>⚠️ ${message}</p>
            <p style="font-size:12px;color:var(--text-light);margin-top:8px">
                请确保文件清晰可读，或尝试手动输入数据
            </p>
        </div>
    `;
}

// 清除上传结果
function clearUploadResult() {
    const hint = document.getElementById('uploadHint');
    const progress = document.getElementById('uploadProgress');
    const result = document.getElementById('uploadResult');
    const preview = document.getElementById('uploadImagePreview');
    const docUpload = document.getElementById('docUpload');
    if (hint) hint.style.display = 'flex';
    if (progress) progress.style.display = 'none';
    if (result) result.style.display = 'none';
    if (preview) preview.style.display = 'none';
    if (docUpload) docUpload.value = '';
    extractedData = null;
}

// ==================== 图片预览与旋转 ====================
let previewImage = null;
let previewRotation = 0;

function showImagePreview(file) {
    const reader = new FileReader();
    reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
            previewImage = img;
            previewRotation = 0;
            drawPreviewCanvas();
            const hint = document.getElementById('uploadHint');
            const preview = document.getElementById('uploadImagePreview');
            if (hint) hint.style.display = 'none';
            if (preview) preview.style.display = 'block';
            const angleEl = document.getElementById('rotationAngle');
            if (angleEl) angleEl.textContent = '0\u00b0';
        };
        img.src = e.target.result;
    };
    reader.readAsDataURL(file);
}

function drawPreviewCanvas() {
    if (!previewImage) return;
    const canvas = document.getElementById('imagePreviewCanvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const img = previewImage;

    const isRotated = previewRotation === 90 || previewRotation === 270;
    const maxW = 400, maxH = 350;
    let w = img.width, h = img.height;
    const scale = Math.min(maxW / w, maxH / h, 1);
    w = Math.round(w * scale);
    h = Math.round(h * scale);

    if (isRotated) {
        canvas.width = h;
        canvas.height = w;
    } else {
        canvas.width = w;
        canvas.height = h;
    }

    ctx.save();
    ctx.translate(canvas.width / 2, canvas.height / 2);
    ctx.rotate(previewRotation * Math.PI / 180);
    ctx.drawImage(img, -w / 2, -h / 2, w, h);
    ctx.restore();
}

function rotateImage(deg) {
    previewRotation = (previewRotation + deg + 360) % 360;
    drawPreviewCanvas();
    const angleEl = document.getElementById('rotationAngle');
    if (angleEl) angleEl.textContent = previewRotation + '\u00b0';
}

function cancelImagePreview() {
    previewImage = null;
    previewRotation = 0;
    const preview = document.getElementById('uploadImagePreview');
    const hint = document.getElementById('uploadHint');
    const docUpload = document.getElementById('docUpload');
    if (preview) preview.style.display = 'none';
    if (hint) hint.style.display = 'flex';
    if (docUpload) docUpload.value = '';
}

async function startImageOCR() {
    if (!previewImage) return;

    const canvas = document.getElementById('imagePreviewCanvas');
    if (!canvas) return;
    const imgDataUrl = canvas.toDataURL('image/png');

    // Hide preview, show progress
    const preview = document.getElementById('uploadImagePreview');
    if (preview) preview.style.display = 'none';

    // Get student info
    const studentSelect = document.getElementById('testStudentSelect');
    let grade = '1', gender = '\u7537';
    if (studentSelect && studentSelect.value) {
        const student = students.find(s => s.id === studentSelect.value);
        if (student) {
            grade = student.grade;
            gender = student.gender;
        }
    }

    showUploadProgress('\u6b63\u5728\u521d\u59cb\u5316OCR\u5f15\u64ce...');

    try {
        const result = await parseImageFromDataUrl(imgDataUrl, grade, gender);
        if (result && result.items && Object.keys(result.items).length > 0) {
            extractedData = result;
            showUploadSuccess(result);
        } else {
            showUploadError('\u672a\u80fd\u8bc6\u522b\u5230\u4f53\u6d4b\u6570\u636e\uff0c\u8bf7\u5c1d\u8bd5\u65cb\u8f6c\u56fe\u7247\u6216\u624b\u52a8\u8f93\u5165');
        }
    } catch (err) {
        console.error('OCR\u5931\u8d25:', err);
        showUploadError('\u56fe\u7247\u8bc6\u522b\u5931\u8d25: ' + err.message);
    }
}

// 应用提取的数据
function applyExtractedData() {
    if (!extractedData || !currentStudent) {
        showToast('请先选择学生', 'error');
        return;
    }
    
    let appliedCount = 0;
    
    for (const key of Object.keys(extractedData.items)) {
        const extractInput = document.getElementById(`extract_${key}`);
        if (!extractInput) continue;
        
        const value = extractInput.value.trim();
        if (value === '') continue;
        
        const testInput = document.getElementById(`test_${key}`);
        if (testInput) {
            testInput.value = value;
            calculateScore(key);
            appliedCount++;
        }
    }
    
    if (appliedCount > 0) {
        showToast(`已自动填入 ${appliedCount} 项数据，请核对后提交`, 'success');
        clearUploadResult();
    } else {
        showToast('未能匹配到对应的输入字段', 'error');
    }
}

// ==================== BMI 计算 ====================
function computeBMI(height, weight) {
    if (!height || !weight) return null;
    return parseFloat((weight / Math.pow(height / 100, 2)).toFixed(1));
}

// BMI 评分（《国家学生体质健康标准（2014年修订）》）
// 正常 = 100 分；超重 / 偏瘦 = 80 分；肥胖 = 60 分
// 不在四档范围内的极端 BMI 兜底为 60 分
function getBMIScore(bmiStatus) {
    if (!bmiStatus || !bmiStatus.label || bmiStatus.label === '-') return null;
    const map = { '正常': 100, '超重': 80, '偏瘦': 80, '肥胖': 60 };
    return map[bmiStatus.label] ?? 60;
}

// 中国学龄儿童青少年 BMI 超重/肥胖筛查标准（WGOC 标准简化版）
function getBMIStatus(bmi, grade, gender) {
    if (bmi === null || bmi === undefined) return { label: '-', color: '#888', bg: '#f8f9fa' };
    // 不同年级/性别的 BMI 参考阈值（近似值）
    const thresholds = {
        // grade: [偏瘦上限, 超重下限, 肥胖下限]
        male: {
            1: [13.5, 17.4, 19.2], 2: [13.7, 17.8, 20.3],
            3: [13.9, 18.5, 21.4], 4: [14.2, 19.2, 22.4],
            5: [14.4, 19.9, 23.4], 6: [14.7, 20.6, 24.2],
            7: [15.5, 21.8, 25.7], 8: [16.0, 22.5, 26.4],
            9: [16.5, 23.1, 26.9], 10: [16.8, 23.5, 27.3],
            11: [17.0, 23.8, 27.6], 12: [17.2, 24.1, 27.9]
        },
        female: {
            1: [13.2, 16.9, 18.5], 2: [13.4, 17.3, 19.3],
            3: [13.6, 18.0, 20.3], 4: [13.9, 18.7, 21.1],
            5: [14.1, 19.3, 21.9], 6: [14.4, 19.9, 22.5],
            7: [15.5, 21.2, 24.2], 8: [16.1, 21.9, 25.0],
            9: [16.6, 22.5, 25.6], 10: [17.0, 22.9, 26.0],
            11: [17.2, 23.2, 26.3], 12: [17.4, 23.5, 26.6]
        }
    };
    const g = gender === '女' ? 'female' : 'male';
    const t = thresholds[g]?.[grade] || [15.0, 22.0, 26.0];
    const [thin, overweight, obese] = t;
    if (bmi < thin) return { label: '偏瘦', color: '#2563eb', bg: '#eff6ff' };
    if (bmi >= obese) return { label: '肥胖', color: '#dc2626', bg: '#fef2f2' };
    if (bmi >= overweight) return { label: '超重', color: '#ea580c', bg: '#fff7ed' };
    return { label: '正常', color: '#16a34a', bg: '#f0fdf4' };
}

// ==================== 工具函数 ====================
function generateId() { return Date.now().toString(36) + Math.random().toString(36).substr(2); }

function showToast(message, type = 'info') {
    const toast = document.getElementById('toast');
    toast.textContent = message; toast.className = `toast ${type}`; toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), 3000);
}

// ==================== 主题切换 ====================
function initTheme() {
    const savedTheme = localStorage.getItem('theme') || 'system';
    applyTheme(savedTheme);
    const select = document.getElementById('themeSelect');
    if (select) select.value = savedTheme;

    // 监听系统主题变化
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    mediaQuery.addEventListener('change', (e) => {
        if (localStorage.getItem('theme') === 'system') {
            applyTheme('system');
        }
    });
}

function changeTheme(theme) {
    localStorage.setItem('theme', theme);
    applyTheme(theme);
}

function applyTheme(theme) {
    if (theme === 'system') {
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        document.documentElement.setAttribute('data-theme', prefersDark ? 'dark' : 'light');
    } else {
        document.documentElement.setAttribute('data-theme', theme);
    }
}

document.querySelector('[data-page="history"]').addEventListener('click', loadHistory);

// ==================== 课程管理 / 排课日历 ====================
function pad2(n) { return String(n).padStart(2, '0'); }

function formatYMD(d) {
    return `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}`;
}

function parseYMD(s) {
    if (!s) return null;
    const [y, m, d] = s.split('-').map(Number);
    return new Date(y, m - 1, d);
}

function isSameDay(a, b) {
    return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
}

function getSchedulesOnDay(dateObj) {
    const key = formatYMD(dateObj);
    return schedules.filter(s => s.date === key).sort((a, b) => (a.time || '').localeCompare(b.time || ''));
}

function getStudentName(studentId) {
    const s = students.find(x => x.id === studentId);
    return s ? s.name : '已删除学生';
}

function getStatusMeta(status) {
    return {
        scheduled: { label: '已排课', cls: 'scheduled' },
        completed: { label: '已签到', cls: 'completed' },
        cancelled: { label: '已取消', cls: 'cancelled' },
        leave: { label: '请假', cls: 'leave' }
    }[status] || { label: status, cls: 'scheduled' };
}

function updateScheduleTitle() {
    const t = document.getElementById('scheduleTitle');
    if (!t) return;
    if (scheduleView === 'month') {
        t.textContent = `${scheduleCurrentDate.getFullYear()} 年 ${scheduleCurrentDate.getMonth() + 1} 月`;
    } else {
        const start = getWeekStart(scheduleCurrentDate);
        const end = new Date(start); end.setDate(start.getDate() + 6);
        t.textContent = `${formatYMD(start)} ~ ${formatYMD(end)}`;
    }
}

function getWeekStart(d) {
    const date = new Date(d);
    const day = date.getDay();
    date.setDate(date.getDate() - day);
    date.setHours(0, 0, 0, 0);
    return date;
}

function navigateDate(delta) {
    if (scheduleView === 'month') {
        scheduleCurrentDate = new Date(scheduleCurrentDate.getFullYear(), scheduleCurrentDate.getMonth() + delta, 1);
    } else {
        const d = new Date(scheduleCurrentDate);
        d.setDate(d.getDate() + delta * 7);
        scheduleCurrentDate = d;
    }
    renderSchedule();
}

function goToToday() {
    scheduleCurrentDate = new Date();
    scheduleSelectedDate = new Date();
    renderSchedule();
}

function switchView(view) {
    scheduleView = view;
    document.querySelectorAll('.view-btn').forEach(b => b.classList.toggle('active', b.dataset.view === view));
    document.getElementById('monthView').style.display = view === 'month' ? '' : 'none';
    document.getElementById('weekView').style.display = view === 'week' ? '' : 'none';
    renderSchedule();
}

function renderSchedule() {
    updateScheduleTitle();
    if (scheduleView === 'month') renderMonthView();
    else renderWeekView();
    renderDayDetail();
    renderScheduleStats();
}

function renderMonthView() {
    const grid = document.getElementById('monthGrid');
    if (!grid) return;
    grid.innerHTML = '';

    const year = scheduleCurrentDate.getFullYear();
    const month = scheduleCurrentDate.getMonth();
    const firstDay = new Date(year, month, 1);
    const startDay = new Date(firstDay);
    startDay.setDate(1 - firstDay.getDay());

    const today = new Date();

    for (let i = 0; i < 42; i++) {
        const d = new Date(startDay);
        d.setDate(startDay.getDate() + i);
        const otherMonth = d.getMonth() !== month;
        const events = getSchedulesOnDay(d);
        const cell = document.createElement('div');
        cell.className = 'calendar-day' + (otherMonth ? ' other-month' : '') + (isSameDay(d, today) ? ' today' : '') + (scheduleSelectedDate && isSameDay(d, scheduleSelectedDate) ? ' selected' : '');

        const dayNum = document.createElement('div');
        dayNum.className = 'day-number';
        dayNum.textContent = d.getDate();
        cell.appendChild(dayNum);

        if (events.length > 0) {
            const evWrap = document.createElement('div');
            evWrap.className = 'day-events';
            events.slice(0, 3).forEach(ev => {
                const chip = document.createElement('div');
                chip.className = `event-chip status-${ev.status || 'scheduled'}`;
                chip.textContent = `${ev.time} ${getStudentName(ev.studentId)}`;
                chip.title = `${ev.time} ${getStudentName(ev.studentId)} · ${ev.type || ''}`;
                chip.onclick = (e) => { e.stopPropagation(); openScheduleDetail(ev.id); };
                evWrap.appendChild(chip);
            });
            if (events.length > 3) {
                const more = document.createElement('div');
                more.className = 'event-chip more';
                more.textContent = `+${events.length - 3}`;
                evWrap.appendChild(more);
            }
            cell.appendChild(evWrap);
        }

        cell.onclick = () => {
            scheduleSelectedDate = new Date(d);
            renderMonthView();
            renderDayDetail();
        };
        cell.ondblclick = () => {
            scheduleSelectedDate = new Date(d);
            openScheduleModal(null, d);
        };
        grid.appendChild(cell);
    }
}

function renderWeekView() {
    const grid = document.getElementById('weekGrid');
    if (!grid) return;
    grid.innerHTML = '';
    const start = getWeekStart(scheduleCurrentDate);
    const today = new Date();

    // 表头
    grid.appendChild(headerCell(''));
    for (let i = 0; i < 7; i++) {
        const d = new Date(start); d.setDate(start.getDate() + i);
        const h = headerCell(`${['日', '一', '二', '三', '四', '五', '六'][d.getDay()]} ${d.getMonth() + 1}/${d.getDate()}`);
        if (isSameDay(d, today)) h.classList.add('today');
        grid.appendChild(h);
    }

    // 8:00 ~ 21:00，13 行
    for (let h = 8; h <= 20; h++) {
        const timeCell = document.createElement('div');
        timeCell.className = 'week-time-cell';
        timeCell.textContent = `${pad2(h)}:00`;
        grid.appendChild(timeCell);
        for (let i = 0; i < 7; i++) {
            const d = new Date(start); d.setDate(start.getDate() + i);
            const cell = document.createElement('div');
            cell.className = 'week-day-cell';
            const evs = getSchedulesOnDay(d).filter(e => parseInt((e.time || '0:0').split(':')[0], 10) === h);
            if (evs.length > 0) cell.classList.add('has-events');
            evs.forEach(ev => {
                const w = document.createElement('div');
                w.className = `week-event status-${ev.status || 'scheduled'}`;
                w.textContent = `${ev.time} ${getStudentName(ev.studentId)}`;
                w.onclick = (e) => { e.stopPropagation(); openScheduleDetail(ev.id); };
                cell.appendChild(w);
            });
            cell.onclick = () => {
                const defaultTime = `${pad2(h)}:00`;
                openScheduleModal(null, d, defaultTime);
            };
            grid.appendChild(cell);
        }
    }
}

function headerCell(text) {
    const el = document.createElement('div');
    el.className = 'week-header';
    el.textContent = text;
    return el;
}

function renderDayDetail() {
    const container = document.getElementById('dayDetailContent');
    if (!container) return;
    const date = scheduleSelectedDate || new Date();
    const evs = getSchedulesOnDay(date);

    if (evs.length === 0) {
        container.innerHTML = `<div class="empty-state" style="padding:30px;"><div class="icon">📅</div><p>${formatYMD(date)} 暂无课程</p><button class="btn-primary" style="margin-top:10px;" onclick="openScheduleModal(null, scheduleSelectedDate || new Date())">+ 新建课程</button></div>`;
        return;
    }

    container.innerHTML = `<div class="day-classes">${evs.map(ev => {
        const meta = getStatusMeta(ev.status);
        const sName = getStudentName(ev.studentId);
        return `
        <div class="class-card ${ev.status === 'completed' ? 'completed' : ''} ${ev.status === 'cancelled' ? 'cancelled' : ''} ${ev.status === 'leave' ? 'leave' : ''}">
            <div class="class-time">${ev.time}</div>
            <div class="class-info">
                <div class="class-title">${sName} <span class="type-tag type-${ev.type}">${ev.type}</span></div>
                <div class="class-meta">
                    <span>⏱ ${ev.duration || 60} 分钟</span>
                    <span>📍 ${ev.location || '未填写'}</span>
                    <span>👨‍🏫 ${ev.coach || '未指定'}</span>
                    <span>💎 消耗 ${ev.cost || 1} 课时</span>
                    <span class="class-status-tag ${meta.cls}">${meta.label}</span>
                </div>
            </div>
            <div class="class-actions">
                ${ev.status === 'scheduled' ? `<button class="btn-mini btn-mini-success" onclick="markCompleted('${ev.id}')">✓ 签到</button>` : ''}
                ${ev.status === 'scheduled' ? `<button class="btn-mini" onclick="markLeave('${ev.id}')">请假</button>` : ''}
                ${ev.status === 'completed' ? `<button class="btn-mini" onclick="markScheduled('${ev.id}')">撤销</button>` : ''}
                <button class="btn-mini" onclick="openScheduleDetail('${ev.id}')">详情</button>
            </div>
        </div>`;
    }).join('')}</div>`;
}

function renderScheduleStats() {
    const grid = document.getElementById('scheduleStatsGrid');
    if (!grid) return;

    const today = formatYMD(new Date());
    const totalStudents = students.length;
    let totalHours = 0;
    let consumedHours = 0;
    let activeStudents = 0;
    let todayClass = 0;
    let monthClass = 0;
    let lowHoursStudents = 0;

    const monthKey = formatYMD(new Date()).slice(0, 7);

    students.forEach(s => {
        totalHours += (s.totalHours || 0);
        consumedHours += (s.consumedHours || 0);
        const remaining = (s.totalHours || 0) - (s.consumedHours || 0);
        if (remaining > 0) activeStudents++;
        if (remaining > 0 && remaining <= 3) lowHoursStudents++;
    });

    schedules.forEach(sc => {
        if (sc.status === 'completed') {
            if (sc.date === today) todayClass++;
            if (sc.date && sc.date.startsWith(monthKey)) monthClass++;
        }
    });

    grid.innerHTML = `
        <div class="stat-item accent-blue">
            <span class="label">总课时 / 已消耗</span>
            <span class="value">${totalHours} <small style="font-size:14px;color:var(--text-secondary);">/ ${consumedHours}</small></span>
            <span class="sub">剩余 ${totalHours - consumedHours} 课时</span>
        </div>
        <div class="stat-item">
            <span class="label">在册学生 / 有课时</span>
            <span class="value">${totalStudents} <small style="font-size:14px;color:var(--text-secondary);">/ ${activeStudents}</small></span>
        </div>
        <div class="stat-item accent-green">
            <span class="label">今日签到</span>
            <span class="value">${todayClass}</span>
            <span class="sub">节已完成课程</span>
        </div>
        <div class="stat-item accent-orange">
            <span class="label">本月完成</span>
            <span class="value">${monthClass}</span>
            <span class="sub">节已签到课程</span>
        </div>
        <div class="stat-item ${lowHoursStudents > 0 ? 'accent-red' : ''}">
            <span class="label">课时不足预警</span>
            <span class="value">${lowHoursStudents}</span>
            <span class="sub">剩余课时 ≤ 3 的学生</span>
        </div>
    `;
}

// ==================== 课程 CRUD ====================
function openScheduleModal(scheduleId, presetDate, presetTime) {
    scheduleEditingId = scheduleId || null;
    document.getElementById('scheduleModalTitle').textContent = scheduleId ? '编辑课程' : '新建课程';
    const sel = document.getElementById('scheduleStudent');
    sel.innerHTML = '<option value="">请选择学生</option>' + students.map(s => `<option value="${s.id}">${s.name}（${s.grade || ''}年级）</option>`).join('');

    if (scheduleId) {
        const sc = schedules.find(s => s.id === scheduleId);
        if (!sc) return;
        document.getElementById('scheduleId').value = sc.id;
        document.getElementById('scheduleStudent').value = sc.studentId;
        document.getElementById('scheduleType').value = sc.type || '体能训练';
        document.getElementById('scheduleDate').value = sc.date || '';
        document.getElementById('scheduleTime').value = sc.time || '';
        document.getElementById('scheduleDuration').value = sc.duration || 60;
        document.getElementById('scheduleCoach').value = sc.coach || '';
        document.getElementById('scheduleLocation').value = sc.location || '';
        document.getElementById('scheduleCost').value = sc.cost || 1;
        document.getElementById('scheduleNote').value = sc.note || '';
    } else {
        document.getElementById('scheduleForm').reset();
        document.getElementById('scheduleId').value = '';
        const d = presetDate || scheduleSelectedDate || new Date();
        document.getElementById('scheduleDate').value = formatYMD(d);
        document.getElementById('scheduleTime').value = presetTime || '15:00';
        document.getElementById('scheduleDuration').value = 60;
        document.getElementById('scheduleCost').value = 1;
        document.getElementById('scheduleType').value = '体能训练';
        if (students.length > 0) {
            document.getElementById('scheduleStudent').value = students[0].id;
        }
    }
    document.getElementById('scheduleModal').classList.add('show');
}

function closeScheduleModal() {
    document.getElementById('scheduleModal').classList.remove('show');
    scheduleEditingId = null;
}

async function saveSchedule() {
    const studentId = document.getElementById('scheduleStudent').value;
    const date = document.getElementById('scheduleDate').value;
    const time = document.getElementById('scheduleTime').value;
    if (!studentId || !date || !time) {
        showToast('请填写学生、日期、时间', 'error');
        return;
    }

    const payload = {
        studentId,
        type: document.getElementById('scheduleType').value,
        date,
        time,
        duration: Number(document.getElementById('scheduleDuration').value) || 60,
        coach: document.getElementById('scheduleCoach').value.trim(),
        location: document.getElementById('scheduleLocation').value.trim(),
        cost: Number(document.getElementById('scheduleCost').value) || 1,
        note: document.getElementById('scheduleNote').value.trim()
    };

    try {
        if (scheduleEditingId) {
            const old = schedules.find(s => s.id === scheduleEditingId);
            const updated = await scheduleDB.update(scheduleEditingId, { ...payload, status: old?.status || 'scheduled' });
            // 如果已签到且课时有变化，调整课时
            if (old && old.status === 'completed') {
                const diff = (payload.cost || 0) - (old.cost || 0);
                if (diff !== 0) {
                    if (diff > 0) await consumeHours(studentId, diff, `调整课程课时 +${diff}`);
                    else await refundHours(studentId, -diff, `调整课程课时 ${diff}`);
                }
            }
            const idx = schedules.findIndex(s => s.id === scheduleEditingId);
            if (idx >= 0) schedules[idx] = { ...schedules[idx], ...mapSchedule(updated) };
        } else {
            const created = await scheduleDB.create(payload);
            schedules.push(mapSchedule(created));
        }
        closeScheduleModal();
        renderSchedule();
        renderHoursOverview();
        showToast(scheduleEditingId ? '课程已更新' : '课程已创建', 'success');
    } catch (e) {
        console.error('saveSchedule:', e);
        showToast('保存失败: ' + e.message, 'error');
    }
}

async function deleteSchedule(id) {
    const sc = schedules.find(s => s.id === id);
    if (!sc) return;
    if (sc.status === 'completed') {
        if (!confirm('该课程已签到，删除将自动退课时，确认删除吗？')) return;
        try {
            await scheduleDB.remove(id);
            await refundHours(sc.studentId, sc.cost || 1, `删除课程：${getStudentName(sc.studentId)} ${sc.date} ${sc.time}`);
        } catch (e) { console.error('deleteSchedule:', e); showToast('删除失败: ' + e.message, 'error'); return; }
    } else {
        if (!confirm('确认删除该课程？')) return;
        try {
            await scheduleDB.remove(id);
        } catch (e) { console.error('deleteSchedule:', e); showToast('删除失败: ' + e.message, 'error'); return; }
    }
    schedules = schedules.filter(s => s.id !== id);
    renderSchedule();
    renderHoursOverview();
    showToast('课程已删除', 'success');
}

async function markCompleted(id) {
    const sc = schedules.find(s => s.id === id);
    if (!sc) return;
    if (sc.status === 'completed') return;

    const remaining = getStudentRemaining(sc.studentId);
    const cost = Number(sc.cost || 1);
    if (remaining < cost) {
        if (!confirm(`该学生剩余课时（${remaining}）不足 ${cost}，是否仍要签到？`)) return;
    }

    try {
        await scheduleDB.checkIn(id);
        sc.status = 'completed';
        sc.completedAt = new Date().toISOString();
        await consumeHours(sc.studentId, cost, `上课签到 ${sc.date} ${sc.time}`);
        renderSchedule();
        renderHoursOverview();
        showToast(`已签到，扣减 ${cost} 课时`, 'success');
    } catch (e) {
        console.error('markCompleted:', e);
        showToast('签到失败: ' + e.message, 'error');
    }
}

function markLeave(id) {
    const sc = schedules.find(s => s.id === id);
    if (!sc) return;
    sc.status = 'leave';
    sc.leaveAt = new Date().toISOString();
    // 同步到 Supabase（请假状态不在后端枚举中，先用 cancelled）
    try { scheduleDB.update(id, { ...sc, status: 'cancelled' }); } catch(e) { console.error('markLeave:', e); }
    renderSchedule();
    showToast('已标记为请假', 'info');
}

async function markScheduled(id) {
    const sc = schedules.find(s => s.id === id);
    if (!sc || sc.status !== 'completed') return;
    if (!confirm('撤销签到将自动退还课时，确认吗？')) return;
    try {
        await scheduleDB.cancelCheckIn(id);
        await refundHours(sc.studentId, sc.cost || 1, `撤销签到 ${sc.date} ${sc.time}`);
        sc.status = 'scheduled';
        sc.completedAt = null;
        renderSchedule();
        renderHoursOverview();
        showToast('已撤销签到，退还课时', 'info');
    } catch (e) {
        console.error('markScheduled:', e);
        showToast('撤销失败: ' + e.message, 'error');
    }
}

function openScheduleDetail(id) {
    scheduleDetailId = id;
    const sc = schedules.find(s => s.id === id);
    if (!sc) return;
    const meta = getStatusMeta(sc.status);
    const body = document.getElementById('scheduleDetailBody');
    body.innerHTML = `
        <div class="detail-row"><span class="detail-label">学生</span><span class="detail-value">${getStudentName(sc.studentId)}</span></div>
        <div class="detail-row"><span class="detail-label">课程类型</span><span class="detail-value"><span class="type-tag type-${sc.type}">${sc.type}</span></span></div>
        <div class="detail-row"><span class="detail-label">日期</span><span class="detail-value">${sc.date}</span></div>
        <div class="detail-row"><span class="detail-label">时间</span><span class="detail-value">${sc.time}（${sc.duration} 分钟）</span></div>
        <div class="detail-row"><span class="detail-label">教练</span><span class="detail-value">${sc.coach || '未指定'}</span></div>
        <div class="detail-row"><span class="detail-label">地点</span><span class="detail-value">${sc.location || '未填写'}</span></div>
        <div class="detail-row"><span class="detail-label">消耗课时</span><span class="detail-value">${sc.cost || 1} 课时</span></div>
        <div class="detail-row"><span class="detail-label">状态</span><span class="detail-value"><span class="class-status-tag ${meta.cls}">${meta.label}</span></span></div>
        <div class="detail-row"><span class="detail-label">备注</span><span class="detail-value">${sc.note || '—'}</span></div>
        <div class="detail-row"><span class="detail-label">剩余课时</span><span class="detail-value">${getStudentRemaining(sc.studentId)} 课时</span></div>
    `;
    document.getElementById('scheduleDetailModal').classList.add('show');
}

function closeScheduleDetail() {
    document.getElementById('scheduleDetailModal').classList.remove('show');
    scheduleDetailId = null;
}

function deleteScheduleFromDetail() {
    if (!scheduleDetailId) return;
    deleteSchedule(scheduleDetailId);
    closeScheduleDetail();
}

function editScheduleFromDetail() {
    if (!scheduleDetailId) return;
    const id = scheduleDetailId;
    closeScheduleDetail();
    openScheduleModal(id);
}

// ==================== 学生档案页 - 课时概览 ====================
function renderHoursOverview() {
    const statsRow = document.getElementById('hoursStatsRow');
    const listEl = document.getElementById('hoursList');
    if (!statsRow || !listEl) return;

    let total = 0, consumed = 0, lowCount = 0, charged = 0;
    const rows = students.map(s => {
        const t = s.totalHours || 0;
        const c = s.consumedHours || 0;
        const remaining = Math.max(0, t - c);
        total += t;
        consumed += c;
        if (remaining > 0 && remaining <= 3) lowCount++;
        if (t > 0) charged++;
        return { student: s, total: t, consumed: c, remaining };
    }).sort((a, b) => {
        // 剩余 0 排后面；剩余 < 4 排前面
        if (a.remaining === 0 && b.remaining !== 0) return 1;
        if (b.remaining === 0 && a.remaining !== 0) return -1;
        if (a.remaining <= 3 && b.remaining > 3) return -1;
        return a.remaining - b.remaining;
    });

    statsRow.innerHTML = `
        <div class="stat-item accent-blue">
            <span class="label">已售课时</span>
            <span class="value">${total}</span>
        </div>
        <div class="stat-item">
            <span class="label">已消耗</span>
            <span class="value">${consumed}</span>
        </div>
        <div class="stat-item accent-green">
            <span class="label">剩余总课时</span>
            <span class="value">${total - consumed}</span>
        </div>
        <div class="stat-item ${lowCount > 0 ? 'accent-red' : ''}">
            <span class="label">课时不足预警</span>
            <span class="value">${lowCount}</span>
        </div>
    `;

    if (rows.length === 0) {
        listEl.innerHTML = `<div class="empty-state" style="padding:24px;"><p>暂无学生</p></div>`;
        return;
    }

    listEl.innerHTML = rows.map(({ student, total, consumed, remaining }) => {
        const cls = remaining === 0 ? 'empty' : (remaining <= 3 ? 'warn' : '');
        return `
        <div class="hours-row ${cls}">
            <span class="name">${student.name} <small style="color:var(--text-secondary);font-weight:400;">${student.grade || ''}年级</small></span>
            <span class="remaining">剩余 ${remaining} 课时</span>
            <span class="actions">
                <button class="history-btn" onclick="openHoursHistory('${student.id}')">流水</button>
            </span>
        </div>`;
    }).join('');
}

function openRechargeModal(preselectStudentId) {
    const sel = document.getElementById('rechargeStudent');
    sel.innerHTML = '<option value="">请选择学生</option>' + students.map(s => `<option value="${s.id}">${s.name}</option>`).join('');
    if (preselectStudentId) sel.value = preselectStudentId;
    document.getElementById('rechargeHours').value = '';
    document.getElementById('rechargeNote').value = '';
    document.getElementById('rechargeModal').classList.add('show');
}

function closeRechargeModal() {
    document.getElementById('rechargeModal').classList.remove('show');
}

async function confirmRecharge() {
    const studentId = document.getElementById('rechargeStudent').value;
    const hours = parseFloat(document.getElementById('rechargeHours').value);
    const note = document.getElementById('rechargeNote').value.trim();
    if (!studentId) { showToast('请选择学生', 'error'); return; }
    if (!hours || hours <= 0) { showToast('请输入充值课时', 'error'); return; }
    const ok = await rechargeHours(studentId, hours, note || '充值');
    if (ok) {
        closeRechargeModal();
        renderStudentList();
        renderHoursOverview();
        showToast(`已为${getStudentName(studentId)}充值 ${hours} 课时`, 'success');
    }
}

function openHoursHistory(studentId) {
    const s = students.find(x => x.id === studentId);
    if (!s) return;
    const history = s.hoursHistory || [];
    const body = document.getElementById('hoursDetailBody') || createHoursHistoryModal();
    const items = history.slice().reverse().map(h => {
        const meta = {
            recharge: { icon: '+', cls: 'recharge', sign: '+' },
            consume: { icon: '−', cls: 'consume', sign: '−' },
            refund: { icon: '↺', cls: 'refund', sign: '−' }
        }[h.type] || { icon: '·', cls: 'consume', sign: '' };
        const time = new Date(h.timestamp).toLocaleString('zh-CN', { hour12: false });
        return `
        <div class="timeline-item">
            <div class="timeline-icon ${meta.cls}">${meta.icon}</div>
            <div class="timeline-content">
                <div class="timeline-title">${h.note || (h.type === 'recharge' ? '充值' : h.type === 'consume' ? '消耗' : '返还')}</div>
                <div class="timeline-meta">${time}</div>
            </div>
            <div class="timeline-amount ${meta.cls}">${meta.sign}${h.hours} 课时</div>
        </div>`;
    }).join('');

    body.innerHTML = `
        <div style="background:var(--bg-secondary);padding:14px;border-radius:8px;margin-bottom:14px;">
            <div style="font-size:13px;color:var(--text-secondary);">${s.name} 课时账户</div>
            <div style="font-size:24px;font-weight:700;color:var(--text);margin-top:4px;">剩余 ${(s.totalHours || 0) - (s.consumedHours || 0)} <span style="font-size:14px;color:var(--text-secondary);">/ ${s.totalHours || 0} 课时</span></div>
        </div>
        <div class="history-timeline">${items || '<div class="empty-state"><p>暂无流水</p></div>'}</div>
    `;
    document.getElementById('hoursHistoryModal').classList.add('show');
}

function createHoursHistoryModal() {
    const m = document.createElement('div');
    m.className = 'modal';
    m.id = 'hoursHistoryModal';
    m.innerHTML = `
        <div class="modal-content">
            <div class="modal-header">
                <h3>课时流水</h3>
                <button class="close-btn" onclick="closeHoursHistory()">×</button>
            </div>
            <div class="modal-body" id="hoursDetailBody"></div>
            <div class="modal-footer">
                <button class="btn-primary" onclick="closeHoursHistory()">关闭</button>
            </div>
        </div>
    `;
    document.body.appendChild(m);
    return document.getElementById('hoursDetailBody');
}

function closeHoursHistory() {
    const m = document.getElementById('hoursHistoryModal');
    if (m) m.classList.remove('show');
}


// 拖拽上传支持
document.addEventListener('DOMContentLoaded', () => {
    const uploadZone = document.getElementById('uploadZone');
    if (uploadZone) {
        uploadZone.addEventListener('dragover', (e) => {
            e.preventDefault();
            uploadZone.classList.add('dragover');
        });
        uploadZone.addEventListener('dragleave', () => {
            uploadZone.classList.remove('dragover');
        });
        uploadZone.addEventListener('drop', (e) => {
            e.preventDefault();
            uploadZone.classList.remove('dragover');
            const file = e.dataTransfer.files[0];
            if (file) {
                const input = document.getElementById('docUpload');
                const dt = new DataTransfer();
                dt.items.add(file);
                input.files = dt.files;
                handleDocUpload({ target: input });
            }
        });
    }
});

// ==================== 第二期：4周周期化训练计划 ====================

// 周期阶段配置
const WEEK_PHASES = [
    { week: 1, name: '适应期', desc: '基础动作模式，低强度，建立正确技术', intensity: '低', color: '#22c55e', levelOverride: 'regression' },
    { week: 2, name: '提升期', desc: '增加组数/强度，引入进阶动作', intensity: '中', color: '#f59e0b', levelOverride: 'base' },
    { week: 3, name: '强化期', desc: '高强度，模拟测试', intensity: '高', color: '#ef4444', levelOverride: 'progression' },
    { week: 4, name: '测试与调整', desc: '模拟测试，根据结果调整下周期', intensity: '测试', color: '#8b5cf6', levelOverride: 'base' }
];

// 每日训练主题配置
const DAY_THEMES = [
    { day: '周一', name: '速度/爆发力日', icon: '⚡', qualities: ['速度', '下肢爆发力', '速度力量'], goal: 'general', focus: '速度与爆发力训练，注重神经激活和快肌纤维募集' },
    { day: '周三', name: '耐力日', icon: '🏃', qualities: ['心肺耐力', '速度耐力', '肌肉耐力'], goal: 'general', focus: '有氧与无氧耐力训练，提升心肺功能和乳酸耐受能力' },
    { day: '周五', name: '综合/技术日', icon: '🎯', qualities: ['协调性', '灵敏素质', '核心力量', '柔韧性'], goal: 'general', focus: '综合体能与技术训练，全面发展身体素质，注重动作质量' }
];

// 周期配置参数（由引导弹窗设置）
let cycleWeeklyFreq = 3;
let cycleSessionDuration = 60;

// 显示生成前引导弹窗
function generateFourWeekPlan() {
    const studentId = document.getElementById('trainingStudentSelect').value;
    if (!studentId) { showToast('请先选择学生', 'error'); return; }
    // 显示引导弹窗
    const modal = document.getElementById('cycleGuideModal');
    modal.style.display = 'flex';
}

// 确认引导参数并生成计划
function confirmCycleGuide() {
    // 读取选择的参数
    const freqRadios = document.getElementsByName('cycleWeeklyFreq');
    freqRadios.forEach(r => { if (r.checked) cycleWeeklyFreq = parseInt(r.value); });
    const durRadios = document.getElementsByName('cycleSessionDuration');
    durRadios.forEach(r => { if (r.checked) cycleSessionDuration = parseInt(r.value); });

    // 关闭弹窗
    document.getElementById('cycleGuideModal').style.display = 'none';

    // 生成计划
    doGenerateFourWeekPlan();
}

// 取消引导弹窗
function cancelCycleGuide() {
    document.getElementById('cycleGuideModal').style.display = 'none';
}

// 引导弹窗中 radio 选择样式切换
function setupCycleGuideRadios() {
    // 频率选择
    document.querySelectorAll('input[name="cycleWeeklyFreq"]').forEach(radio => {
        radio.addEventListener('change', function() {
            document.querySelectorAll('label[id^="freqLabel_"]').forEach(label => {
                label.style.borderColor = '#e5e7eb';
                label.style.background = '';
                const span = label.querySelector('span');
                if (span) span.style.color = '';
            });
            const selectedLabel = document.getElementById('freqLabel_' + this.value);
            if (selectedLabel) {
                selectedLabel.style.borderColor = '#6366f1';
                selectedLabel.style.background = '#6366f110';
                const span = selectedLabel.querySelector('span');
                if (span) span.style.color = '#6366f1';
            }
        });
    });
    // 时长选择
    document.querySelectorAll('input[name="cycleSessionDuration"]').forEach(radio => {
        radio.addEventListener('change', function() {
            document.querySelectorAll('label[id^="durLabel_"]').forEach(label => {
                label.style.borderColor = '#e5e7eb';
                label.style.background = '';
                const span = label.querySelector('span');
                if (span) span.style.color = '';
            });
            const selectedLabel = document.getElementById('durLabel_' + this.value);
            if (selectedLabel) {
                selectedLabel.style.borderColor = '#6366f1';
                selectedLabel.style.background = '#6366f110';
                const span = selectedLabel.querySelector('span');
                if (span) span.style.color = '#6366f1';
            }
        });
    });
}

// 实际生成4周计划
function doGenerateFourWeekPlan() {
    const studentId = document.getElementById('trainingStudentSelect').value;
    if (!studentId) { showToast('请先选择学生', 'error'); return; }
    const student = students.find(s => s.id === studentId);
    if (!student) return;

    const grade = parseInt(student.grade);
    const ageGroup = getSensitivePeriodKey(grade);
    const sp = TRAINING_DB.sensitivePeriods[ageGroup];
    const lastTest = currentTrainingMode === 'auto' ? getLastTest(studentId) : null;

    // 获取训练目标和薄弱项
    currentTrainingGoal = document.getElementById('trainingGoalSelect') ? document.getElementById('trainingGoalSelect').value : 'general';
    let targetQualities = [];
    if (currentTrainingMode === 'auto' && lastTest) {
        const weakResult = analyzeWeakQualities(lastTest, student.grade);
        targetQualities = weakResult.qualities;
    } else if (currentTrainingMode === 'manual') {
        const checkboxes = document.querySelectorAll('#weaknessCheckboxGrid input:checked');
        targetQualities = Array.from(checkboxes).map(cb => cb.value);
    }

    // 构建4周计划
    const plan = buildFourWeekPlan(student, grade, ageGroup, targetQualities, lastTest, cycleWeeklyFreq, cycleSessionDuration);

    // 渲染
    const container = document.getElementById('fourWeekPlanContainer');
    const content = document.getElementById('fourWeekPlanContent');
    document.getElementById('trainingContent').style.display = 'none';
    document.getElementById('trainingActions').style.display = 'none';
    container.style.display = 'block';
    content.innerHTML = renderFourWeekPlan(plan, student, sp);
    showToast(`4周周期化训练计划已生成（每周${cycleWeeklyFreq}次·每次${cycleSessionDuration}分钟）`, 'success');
}

// 构建4周周期化训练计划
function buildFourWeekPlan(student, grade, ageGroupKey, targetQualities, lastTest, weeklyFreq, sessionDuration) {
    // 根据每周训练次数选择训练日
    let selectedDays = DAY_THEMES.slice(); // 默认3天
    if (weeklyFreq === 2) {
        selectedDays = [DAY_THEMES[0], DAY_THEMES[1]]; // 周一+周三
    } else if (weeklyFreq === 4) {
        selectedDays = [DAY_THEMES[0], DAY_THEMES[1], DAY_THEMES[2], { day:'周日', name:'补充训练日', icon:'💪', qualities:['核心力量','柔韧性','平衡能力'], goal:'general', focus:'核心稳定与柔韧性补充训练，巩固技术并促进恢复' }];
    }

    const weeks = [];
    for (let w = 0; w < 4; w++) {
        const phase = WEEK_PHASES[w];
        const sessions = [];

        for (let d = 0; d < selectedDays.length; d++) {
            const theme = selectedDays[d];
            const dayQualities = theme.qualities.filter(q =>
                (TRAINING_DB.qualityMap[q] || []).length > 0
            );

            let mergedQualities = [...dayQualities];
            if (targetQualities && targetQualities.length > 0) {
                const weakWeight = w >= 2 ? 2 : 1;
                for (let i = 0; i < weakWeight; i++) {
                    targetQualities.forEach(q => {
                        if (!mergedQualities.includes(q)) mergedQualities.push(q);
                    });
                }
            }

            const levelOverride = phase.levelOverride;
            const plan = buildOneHourPlan(mergedQualities, grade, ageGroupKey, currentTrainingGoal, currentExamCity, student, lastTest, sessionDuration);

            if (levelOverride && lastTest) {
                const applyLevel = (exArr) => exArr.map(ex => {
                    if (!ex.levels) return ex;
                    return getExerciseAtLevel(ex, levelOverride);
                });
                plan.warmups = applyLevel(plan.warmups);
                plan.mainExercises = applyLevel(plan.mainExercises);
                plan.cooldowns = applyLevel(plan.cooldowns);
            }

            if (w === 3) {
                plan.isTestWeek = true;
                plan.testNote = '本周以模拟测试为主，记录成绩并与周期初始数据对比，根据结果调整下周期训练重点。';
            }
            if (w === 2) {
                plan.intensityNote = '本周为强化期，每个动作接近最大努力，组间休息适当缩短，模拟比赛强度。';
            }

            sessions.push({
                day: theme.day,
                dayName: theme.name,
                icon: theme.icon,
                focus: theme.focus,
                plan: plan
            });
        }

        weeks.push({
            weekNum: w + 1,
            phase: phase,
            sessions: sessions
        });
    }

    const overview = generateCycleOverview(student, targetQualities, lastTest);
    return { weeks, student, overview, startDate: new Date().toISOString().slice(0, 10), weeklyFreq, sessionDuration };
}

// 生成周期总览
function generateCycleOverview(student, targetQualities, lastTest) {
    let baseline = '暂无体测基线数据，第4周测试后将生成对比分析';
    if (lastTest && lastTest.totalScore) {
        baseline = `基线总分：${lastTest.totalScore}分（${getGradeLabel(lastTest.totalScore)}）`;
        if (targetQualities && targetQualities.length > 0) {
            baseline += `，重点提升：${targetQualities.join('、')}`;
        }
    }
    return {
        studentName: student.name,
        grade: student.grade,
        goal: currentTrainingGoal,
        examCity: currentExamCity,
        baseline: baseline,
        initialTest: lastTest,
        targetQualities: targetQualities || []
    };
}

// 渲染4周周期化训练计划
function renderFourWeekPlan(plan, student, sp) {
    const goalLabel = TRAINING_DB.trainingGoals.find(g => g.value === plan.overview.goal)?.label || '常规体能提升';

    let html = `
    <div style="background:linear-gradient(135deg,#6366f1 0%,#8b5cf6 100%);color:#fff;border-radius:16px;padding:24px;margin-bottom:20px;">
        <h2 style="margin:0 0 8px;font-size:22px;">📅 ${student.name}的4周周期化训练计划</h2>
        <p style="margin:0;opacity:0.9;font-size:14px;">${sp.name}（${sp.ageRange}）· ${goalLabel} · 开始日期：${plan.startDate}</p>
        <p style="margin:8px 0 0;opacity:0.8;font-size:13px;">📋 ${plan.overview.baseline}</p>
        <p style="margin:4px 0 0;opacity:0.8;font-size:13px;">🗓️ 每周${plan.weeklyFreq || 3}次训练 · 每次${plan.sessionDuration || 60}分钟</p>
    </div>

    <!-- 周期结构总览 -->
    <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:12px;margin-bottom:24px;">
        ${plan.weeks.map(w => `
            <div style="border:2px solid ${w.phase.color}20;border-radius:12px;padding:16px;text-align:center;background:${w.phase.color}08;">
                <div style="font-size:28px;margin-bottom:4px;">${w.weekNum === 4 ? '🧪' : w.weekNum === 3 ? '🔥' : w.weekNum === 2 ? '📈' : '🌱'}</div>
                <div style="font-weight:700;color:${w.phase.color};font-size:15px;">第${w.weekNum}周</div>
                <div style="font-size:13px;color:${w.phase.color};margin:2px 0;">${w.phase.name}</div>
                <div style="font-size:11px;color:var(--text-secondary);line-height:1.5;">${w.phase.desc}</div>
                <div style="margin-top:6px;font-size:11px;padding:2px 8px;border-radius:10px;background:${w.phase.color}15;color:${w.phase.color};display:inline-block;">强度：${w.phase.intensity}</div>
            </div>
        `).join('')}
    </div>

    <!-- 每周详细计划 -->
    ${plan.weeks.map(week => `
        <div style="border:1px solid #e5e7eb;border-radius:12px;margin-bottom:20px;overflow:hidden;">
            <div style="background:${week.phase.color};color:#fff;padding:12px 20px;display:flex;align-items:center;gap:12px;">
                <span style="font-size:20px;">${week.weekNum === 4 ? '🧪' : week.weekNum === 3 ? '🔥' : week.weekNum === 2 ? '📈' : '🌱'}</span>
                <div>
                    <span style="font-weight:700;font-size:16px;">第${week.weekNum}周：${week.phase.name}</span>
                    <span style="opacity:0.85;font-size:12px;margin-left:8px;">${week.phase.desc}</span>
                </div>
            </div>
            ${week.sessions.map(session => {
                const p = session.plan;
                let sessionHTML = `
                <div style="padding:16px 20px;border-bottom:1px solid #f0f0f0;">
                    <div style="display:flex;align-items:center;gap:8px;margin-bottom:12px;">
                        <span style="font-size:18px;">${session.icon}</span>
                        <h4 style="margin:0;font-size:15px;">${session.day} · ${session.dayName}</h4>
                        <span style="margin-left:auto;font-size:11px;color:var(--text-light);">⏱ ${p.totalTime}分钟</span>
                    </div>
                    <p style="font-size:12px;color:var(--text-secondary);margin:0 0 10px;">🎯 ${session.focus}</p>`;

                if (p.intensityNote) {
                    sessionHTML += `<div style="background:#fef3c7;border-left:3px solid #f59e0b;padding:8px 12px;border-radius:6px;font-size:12px;color:#92400e;margin-bottom:10px;">⚠️ ${p.intensityNote}</div>`;
                }
                if (p.isTestWeek) {
                    sessionHTML += `<div style="background:#f3e8ff;border-left:3px solid #8b5cf6;padding:8px 12px;border-radius:6px;font-size:12px;color:#6b21a8;margin-bottom:10px;">🧪 ${p.testNote}</div>`;
                }

                // 训练时间线
                sessionHTML += `
                    <div style="display:flex;gap:2px;margin-bottom:10px;border-radius:6px;overflow:hidden;">
                        <div style="flex:${p.warmupTime};background:#10b98120;padding:4px;text-align:center;font-size:11px;color:#065f46;">热身 ${p.warmupTime}min</div>
                        <div style="flex:${p.mainTime};background:#f59e0b20;padding:4px;text-align:center;font-size:11px;color:#92400e;">主体 ${p.mainTime}min</div>
                        <div style="flex:${p.cooldownTime};background:#3b82f620;padding:4px;text-align:center;font-size:11px;color:#1e40af;">放松 ${p.cooldownTime}min</div>
                    </div>`;

                // 动作列表（精简版）
                sessionHTML += `<div style="font-size:12px;line-height:1.8;">`;
                sessionHTML += `<div style="color:var(--text-light);font-size:11px;margin-bottom:2px;">热身：</div>`;
                p.warmups.forEach((ex, i) => {
                    sessionHTML += `<span style="display:inline-block;background:#10b98115;padding:2px 8px;border-radius:4px;margin:2px;font-size:11px;">${ex.name}${ex._level && ex._level !== 'base' ? `(${ex._levelLabel})` : ''}</span>`;
                });
                sessionHTML += `<div style="color:var(--text-light);font-size:11px;margin:6px 0 2px;">主体：</div>`;
                p.mainExercises.forEach((ex, i) => {
                    sessionHTML += `<span style="display:inline-block;background:#f59e0b15;padding:2px 8px;border-radius:4px;margin:2px;font-size:11px;">${ex.name}${ex._level && ex._level !== 'base' ? `(${ex._levelLabel})` : ''}</span>`;
                });
                sessionHTML += `<div style="color:var(--text-light);font-size:11px;margin:6px 0 2px;">放松：</div>`;
                p.cooldowns.forEach((ex, i) => {
                    sessionHTML += `<span style="display:inline-block;background:#3b82f615;padding:2px 8px;border-radius:4px;margin:2px;font-size:11px;">${ex.name}</span>`;
                });
                sessionHTML += `</div>`;

                // 详细方案容器（默认隐藏）
                const detailKey = `detail_w${week.weekNum}_d${session.day}`;
                sessionHTML += `
                    <div id="${detailKey}" style="display:none;margin-top:10px;padding-top:10px;border-top:1px dashed #e5e7eb;">
                        <div style="font-size:13px;font-weight:700;color:var(--text-primary);margin-bottom:8px;">🔥 热身阶段（约${p.warmupTime}分钟）</div>
                        ${p.warmups.map((ex, i) => renderExerciseCard(ex, i)).join('')}
                        <div style="font-size:13px;font-weight:700;color:var(--text-primary);margin:12px 0 8px;">💪 主体训练（约${p.mainTime}分钟）</div>
                        ${p.mainExercises.map((ex, i) => renderExerciseCard(ex, i)).join('')}
                        <div style="font-size:13px;font-weight:700;color:var(--text-primary);margin:12px 0 8px;">🧘 整理放松（约${p.cooldownTime}分钟）</div>
                        ${p.cooldowns.map((ex, i) => renderExerciseCard(ex, i)).join('')}
                    </div>
                    <div style="margin-top:8px;text-align:center;">
                        <span onclick="toggleSessionDetail('${detailKey}', this)" style="display:inline-block;padding:4px 16px;background:#6366f110;color:#6366f1;border-radius:6px;font-size:12px;font-weight:600;cursor:pointer;transition:all 0.2s;">📋 查看详细方案</span>
                    </div>
                `;

                // 进度追踪
                const sessionKey = `w${week.weekNum}_d${session.day}`;
                sessionHTML += `
                    <div style="margin-top:10px;display:flex;align-items:center;gap:8px;">
                        <label style="font-size:12px;display:flex;align-items:center;gap:4px;cursor:pointer;">
                            <input type="checkbox" id="progress_${sessionKey}" onchange="toggleSessionProgress('${sessionKey}', ${week.weekNum}, '${session.day}')" style="cursor:pointer;">
                            <span style="color:var(--text-secondary);">标记为已完成</span>
                        </label>
                        <input type="text" id="notes_${sessionKey}" placeholder="训练备注..." style="flex:1;padding:4px 8px;border:1px solid #e5e7eb;border-radius:4px;font-size:12px;">
                    </div>
                </div>`;
                return sessionHTML;
            }).join('')}
        </div>
    `).join('')}

    <!-- 第4周末：体测对比与调整建议 -->
    <div style="background:#f3e8ff;border:2px solid #8b5cf6;border-radius:12px;padding:20px;margin-bottom:20px;">
        <h3 style="margin:0 0 12px;color:#6b21a8;">🧪 第4周末：体测对比与下周期调整</h3>
        <p style="font-size:13px;color:var(--text-secondary);line-height:1.7;">
            第4周训练结束后，请对学生进行完整体测，并将结果录入系统。系统将自动对比周期前后的体测数据变化，
            根据各项成绩提升/下降情况，自动调整下个4周周期的训练重点和难度等级。
        </p>
        <div style="margin-top:12px;padding:12px;background:#fff;border-radius:8px;font-size:12px;color:var(--text-secondary);">
            <strong>📊 自动调整逻辑：</strong><br>
            ① 各项成绩提升≥10分 → 下周期该素质降至维持量，增加其他素质比重<br>
            ② 各项成绩提升<5分或下降 → 下周期加大该素质训练比重，降低难度等级<br>
            ③ 总分提升≥15分 → 下周期整体难度等级上调一级<br>
            ④ 总分提升<5分 → 下周期重新评估训练目标和动作选择策略
        </div>
        <button class="btn-primary" style="margin-top:12px;background:#8b5cf6;" onclick="compareCycleResults()">📊 对比体测结果并生成下周期建议</button>
        <div id="cycleCompareResult" style="margin-top:12px;"></div>
    </div>

    <!-- 周期总结提示 -->
    <div style="background:#f0f7ff;border:1px solid #bfdbfe;border-radius:8px;padding:16px;margin-bottom:16px;">
        <p style="font-size:13px;color:#1e3a5f;line-height:1.7;margin:0;">
            💡 本4周周期化训练计划基于${sp.name}（${sp.ageRange}）身体素质发展敏感期理论生成。
            每周${plan.weeklyFreq || 3}次训练，每次${plan.sessionDuration || 60}分钟，循序渐进，4周后重新评估。
            建议每次训练后记录完成情况，如学生出现不适应及时调整。
        </p>
    </div>
    `;

    return html;
}

// 关闭4周计划视图
function closeFourWeekPlan() {
    document.getElementById('fourWeekPlanContainer').style.display = 'none';
    document.getElementById('trainingContent').style.display = 'block';
    document.getElementById('trainingActions').style.display = 'block';
}

// 展开/折叠课程详细方案
function toggleSessionDetail(detailKey, triggerEl) {
    const detailDiv = document.getElementById(detailKey);
    if (!detailDiv) return;
    const isHidden = detailDiv.style.display === 'none';
    detailDiv.style.display = isHidden ? 'block' : 'none';
    if (triggerEl) {
        triggerEl.textContent = isHidden ? '📋 收起详细方案' : '📋 查看详细方案';
        triggerEl.style.background = isHidden ? '#6366f120' : '#6366f110';
    }
    // 展开时滚动到详细方案位置
    if (isHidden && detailDiv) {
        setTimeout(() => {
            detailDiv.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }, 100);
    }
}

// 初始化引导弹窗 radio 事件
document.addEventListener('DOMContentLoaded', () => {
    setupCycleGuideRadios();
});

// 进度追踪：切换训练完成状态
function toggleSessionProgress(sessionKey, weekNum, dayName) {
    const checkbox = document.getElementById('progress_' + sessionKey);
    const notesInput = document.getElementById('notes_' + sessionKey);
    const completed = checkbox.checked;
    const notes = notesInput.value;

    // 保存到 localStorage
    const studentId = document.getElementById('trainingStudentSelect').value;
    const progressKey = `cycle_progress_${studentId}`;
    let progress = {};
    try { progress = JSON.parse(localStorage.getItem(progressKey) || '{}'); } catch(e) {}
    progress[sessionKey] = { completed, notes, date: new Date().toISOString().slice(0, 10), weekNum, dayName };
    localStorage.setItem(progressKey, JSON.stringify(progress));

    if (completed) {
        showToast(`第${weekNum}周 ${dayName} 训练已标记完成`, 'success');
    }
}

// 加载已保存的进度
function loadCycleProgress(studentId) {
    const progressKey = `cycle_progress_${studentId}`;
    try {
        const progress = JSON.parse(localStorage.getItem(progressKey) || '{}');
        Object.entries(progress).forEach(([key, data]) => {
            const checkbox = document.getElementById('progress_' + key);
            const notesInput = document.getElementById('notes_' + key);
            if (checkbox) {
                checkbox.checked = data.completed;
                checkbox.parentElement.style.opacity = data.completed ? '0.7' : '1';
            }
            if (notesInput && data.notes) notesInput.value = data.notes;
        });
    } catch(e) { console.error('loadCycleProgress:', e); }
}

// 第4周末：对比体测结果并生成调整建议
function compareCycleResults() {
    const studentId = document.getElementById('trainingStudentSelect').value;
    if (!studentId) { showToast('请先选择学生', 'error'); return; }
    const student = students.find(s => s.id === studentId);
    if (!student) return;

    const lastTest = getLastTest(studentId);
    if (!lastTest) {
        document.getElementById('cycleCompareResult').innerHTML = '<div style="color:#ef4444;font-size:13px;">⚠️ 未找到体测数据，请先录入体测成绩</div>';
        return;
    }

    // 检查是否有周期前的基线数据
    const baselineKey = `cycle_baseline_${studentId}`;
    let baseline = null;
    try { baseline = JSON.parse(localStorage.getItem(baselineKey) || 'null'); } catch(e) {}

    if (!baseline) {
        // 第一次对比：保存当前体测作为基线
        localStorage.setItem(baselineKey, JSON.stringify(lastTest));
        document.getElementById('cycleCompareResult').innerHTML = `
            <div style="padding:12px;background:#f0fdf4;border-radius:8px;font-size:13px;color:#166534;">
                ✅ 已保存当前体测数据作为周期基线。<br>
                请在4周训练完成后再次录入体测，然后点击「对比体测结果」生成对比分析。
            </div>`;
        return;
    }

    // 对比分析
    const improvements = [];
    const declines = [];
    const unchanged = [];

    if (baseline.itemScores && lastTest.itemScores) {
        Object.entries(lastTest.itemScores).forEach(([key, currentScore]) => {
            const prevScore = baseline.itemScores[key];
            if (prevScore !== undefined && prevScore > 0) {
                const diff = currentScore - prevScore;
                const itemName = getItemName(key);
                if (diff >= 10) {
                    improvements.push({ item: itemName, key, diff, prev: prevScore, curr: currentScore, action: 'maintain' });
                } else if (diff < 5) {
                    declines.push({ item: itemName, key, diff, prev: prevScore, curr: currentScore, action: 'increase' });
                } else {
                    unchanged.push({ item: itemName, key, diff, prev: prevScore, curr: currentScore });
                }
            }
        });
    }

    const totalDiff = (lastTest.totalScore || 0) - (baseline.totalScore || 0);
    let levelAdjustment = '';
    let nextCycleAdvice = '';

    if (totalDiff >= 15) {
        levelAdjustment = '整体难度等级上调一级（更多进阶动作）';
        nextCycleAdvice += `✅ 总分提升${totalDiff}分，效果显著！下周期整体难度等级上调一级。\n`;
    } else if (totalDiff >= 5) {
        levelAdjustment = '维持当前难度等级，微调比重';
        nextCycleAdvice += `📈 总分提升${totalDiff}分，有一定效果。维持当前难度，微调训练比重。\n`;
    } else if (totalDiff >= 0) {
        levelAdjustment = '维持当前难度等级，加大薄弱项比重';
        nextCycleAdvice += `⚠️ 总分仅提升${totalDiff}分，效果有限。维持难度，加大薄弱项训练比重。\n`;
    } else {
        levelAdjustment = '降低难度等级，重新评估训练策略';
        nextCycleAdvice += `❌ 总分下降${Math.abs(totalDiff)}分，需重新评估。降低难度等级，重新选择训练动作。\n`;
    }

    if (improvements.length > 0) {
        nextCycleAdvice += `\n📊 显著提升项目（≥10分）：\n`;
        improvements.forEach(i => {
            nextCycleAdvice += `  ${i.item}：${i.prev}→${i.curr}（+${i.diff}分）→ 下周期降至维持量\n`;
        });
    }
    if (declines.length > 0) {
        nextCycleAdvice += `\n⚠️ 需重点加强项目（<5分或下降）：\n`;
        declines.forEach(i => {
            nextCycleAdvice += `  ${i.item}：${i.prev}→${i.curr}（${i.diff >= 0 ? '+' : ''}${i.diff}分）→ 下周期加大比重并降低难度\n`;
        });
    }

    // 保存调整建议
    const adviceKey = `cycle_advice_${studentId}`;
    localStorage.setItem(adviceKey, JSON.stringify({
        date: new Date().toISOString().slice(0, 10),
        baseline: baseline,
        current: lastTest,
        totalDiff,
        improvements,
        declines,
        levelAdjustment,
        nextCycleAdvice
    }));

    // 更新基线为当前体测
    localStorage.setItem(baselineKey, JSON.stringify(lastTest));

    // 渲染对比结果
    const resultHTML = `
        <div style="padding:16px;background:#fff;border-radius:8px;font-size:13px;line-height:1.8;color:var(--text-primary);">
            <h4 style="margin:0 0 10px;color:#6b21a8;">📊 周期前后体测对比</h4>
            <div style="display:flex;gap:16px;margin-bottom:12px;">
                <div style="text-align:center;flex:1;padding:8px;background:#f3f4f6;border-radius:6px;">
                    <div style="font-size:11px;color:var(--text-light);">周期前</div>
                    <div style="font-size:24px;font-weight:700;">${baseline.totalScore || '-'}</div>
                    <div style="font-size:11px;color:var(--text-light);">分</div>
                </div>
                <div style="text-align:center;flex:1;padding:8px;background:#f3f4f6;border-radius:6px;">
                    <div style="font-size:11px;color:var(--text-light);">周期后</div>
                    <div style="font-size:24px;font-weight:700;color:${totalDiff >= 0 ? '#22c55e' : '#ef4444'};">${lastTest.totalScore || '-'}</div>
                    <div style="font-size:11px;color:var(--text-light);">分</div>
                </div>
                <div style="text-align:center;flex:1;padding:8px;background:${totalDiff >= 0 ? '#f0fdf4' : '#fef2f2'};border-radius:6px;">
                    <div style="font-size:11px;color:var(--text-light);">变化</div>
                    <div style="font-size:24px;font-weight:700;color:${totalDiff >= 0 ? '#22c55e' : '#ef4444'};">${totalDiff >= 0 ? '+' : ''}${totalDiff}</div>
                    <div style="font-size:11px;color:var(--text-light);">分</div>
                </div>
            </div>
            <div style="white-space:pre-wrap;padding:12px;background:#faf5ff;border-radius:6px;color:#4c1d95;">${nextCycleAdvice}</div>
            <div style="margin-top:8px;padding:8px;background:#f0fdf4;border-radius:6px;font-size:12px;color:#166534;">
                🔧 下周期难度调整：<strong>${levelAdjustment}</strong>
            </div>
        </div>`;
    document.getElementById('cycleCompareResult').innerHTML = resultHTML;
    showToast('体测对比完成，下周期建议已生成', 'success');
}

// 保存4周周期计划
async function saveFourWeekPlan() {
    const studentId = document.getElementById('trainingStudentSelect').value;
    if (!studentId) { showToast('请先选择学生', 'error'); return; }
    const student = students.find(s => s.id === studentId);
    if (!student) return;

    const content = document.getElementById('fourWeekPlanContent').innerHTML;
    const planData = {
        goal: currentTrainingGoal || 'general',
        type: 'four_week_cycle',
        examCity: currentExamCity || '',
        content: content,
        startDate: new Date().toISOString().slice(0, 10)
    };

    try {
        const created = await planDB.create(studentId, planData);
        if (!student.trainingPlans) student.trainingPlans = [];
        student.trainingPlans.push({
            id: created.id,
            date: created.created_at?.split('T')[0] || new Date().toISOString().split('T')[0],
            type: 'four_week_cycle',
            goal: currentTrainingGoal,
            examCity: currentExamCity,
            content: content
        });

        // 保存基线体测
        const lastTest = getLastTest(studentId);
        if (lastTest) {
            localStorage.setItem(`cycle_baseline_${studentId}`, JSON.stringify(lastTest));
        }

        showToast('4周周期计划已保存', 'success');
    } catch (e) {
        console.error('saveFourWeekPlan:', e);
        showToast('保存失败: ' + e.message, 'error');
    }
}

// 导出单次训练方案 PDF
async function exportTrainingPlanPDF() {
    const studentId = document.getElementById('trainingStudentSelect').value;
    if (!studentId) { showToast('请先选择学生', 'error'); return; }
    const student = students.find(s => s.id === studentId);
    if (!student) return;
    const content = document.getElementById('trainingContent');
    if (!content.innerHTML.trim()) { showToast('请先生成训练方案', 'error'); return; }

    // 教练自选模式使用专用PDF模板
    if (currentTrainingMode === 'custom') {
        const html = buildCustomPlanPDFHTML(content.innerHTML, student);
        const filename = `${student.name}_教练自选训练方案_${new Date().toISOString().slice(0,10)}.pdf`;
        await exportPDFFromHTML(html, filename);
        return;
    }

    const html = buildPlanPDFHTML(content.innerHTML, student);
    const filename = `${student.name}_训练方案_${new Date().toISOString().slice(0,10)}.pdf`;
    await exportPDFFromHTML(html, filename);
}

// 导出4周周期计划 PDF
async function exportFourWeekPlanPDF() {
    const studentId = document.getElementById('trainingStudentSelect').value;
    if (!studentId) { showToast('请先选择学生', 'error'); return; }
    const student = students.find(s => s.id === studentId);
    if (!student) return;
    const content = document.getElementById('fourWeekPlanContent');
    if (!content.innerHTML.trim()) { showToast('请先生成4周周期计划', 'error'); return; }

    const html = buildPlanPDFHTML(content.innerHTML, student, true);
    const filename = `${student.name}_4周周期训练计划_${new Date().toISOString().slice(0,10)}.pdf`;
    await exportPDFFromHTML(html, filename);
}

// 构建 PDF 专用 HTML（含排版美化样式）
function buildPlanPDFHTML(innerContent, student, isFourWeek = false) {
    return `<!DOCTYPE html>
<html lang="zh-CN">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<style>
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body { font-family: "Microsoft YaHei", "PingFang SC", sans-serif; background: #fff; color: #1f2937; padding: 24px; }

  /* PDF 头部 */
  .pdf-header { background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%); color: #fff; border-radius: 12px; padding: 20px 24px; margin-bottom: 20px; -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
  .pdf-header h1 { font-size: 20px; margin-bottom: 6px; }
  .pdf-header p { font-size: 13px; opacity: 0.9; }

  /* 通用 */
  h3 { font-size: 16px; margin: 16px 0 8px; color: #1f2937; }
  h4 { font-size: 14px; margin: 12px 0 6px; color: #374151; }
  p { font-size: 12px; line-height: 1.7; color: #4b5563; }
  .phase-goal { font-size: 11px; color: #6b7280; margin: 4px 0 8px; }

  /* 训练动作卡片 */
  .exercise-card { border: 1px solid #e5e7eb; border-radius: 8px; padding: 10px 12px; margin-bottom: 8px; }
  .exercise-card-header { display: flex; align-items: center; gap: 6px; margin-bottom: 6px; }
  .exercise-name { font-weight: 700; font-size: 13px; }
  .exercise-difficulty { font-size: 10px; padding: 1px 6px; border-radius: 3px; }
  .ex-quality-tag { font-size: 10px; padding: 1px 5px; background: #f3f4f6; border-radius: 3px; color: #6b7280; }
  .ex-eq-tag { font-size: 10px; padding: 1px 5px; background: #ecfdf5; border-radius: 3px; color: #065f46; }
  .exercise-desc { font-size: 11px; color: #6b7280; line-height: 1.6; margin-bottom: 4px; }
  .exercise-coaching { font-size: 11px; color: #374151; line-height: 1.6; }
  .exercise-safety { font-size: 10px; color: #b91c1c; margin-top: 4px; }

  /* 时间线 */
  .timeline-bar { display: flex; gap: 2px; border-radius: 6px; overflow: hidden; margin-bottom: 12px; }
  .timeline-seg { padding: 6px; text-align: center; font-size: 11px; color: #fff; }
  .timeline-seg.warmup { background: #10b981; }
  .timeline-seg.main { background: #f59e0b; }
  .timeline-seg.cooldown { background: #3b82f6; }

  /* 周阶段卡片 */
  .week-card { border: 1px solid #e5e7eb; border-radius: 8px; margin-bottom: 12px; overflow: hidden; -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
  .week-header { padding: 8px 16px; color: #fff; font-weight: 700; font-size: 14px; }
  .session-block { padding: 12px 16px; border-bottom: 1px solid #f0f0f0; }
  .session-block:last-child { border-bottom: none; }
  .session-title { display: flex; align-items: center; gap: 6px; font-size: 13px; font-weight: 600; margin-bottom: 6px; }

  /* 标签 */
  .badge { font-size: 10px; padding: 1px 6px; border-radius: 3px; }
  .badge-regression { background: #3b82f620; color: #3b82f6; }
  .badge-progression { background: #8b5cf620; color: #8b5cf6; }

  /* 提示框 */
  .note-box { padding: 8px 12px; border-radius: 6px; font-size: 11px; margin-bottom: 8px; }
  .note-warning { background: #fef3c7; border-left: 3px solid #f59e0b; color: #92400e; }
  .note-test { background: #f3e8ff; border-left: 3px solid #8b5cf6; color: #6b21a8; }
  .note-info { background: #f0f7ff; border: 1px solid #bfdbfe; color: #1e3a5f; }

  /* 页脚 */
  .pdf-footer { margin-top: 20px; padding-top: 12px; border-top: 1px solid #e5e7eb; text-align: center; font-size: 10px; color: #9ca3af; }
</style>
</head>
<body>
  <div class="pdf-header">
    <h1>${isFourWeek ? '📅 4周周期化训练计划' : '📋 个性化训练方案'}</h1>
    <p>学生：${student.name} · 年级：${student.grade}年级 · 日期：${new Date().toISOString().slice(0,10)}</p>
  </div>
  ${innerContent}
  <div class="pdf-footer">
    <span>上门体育教练管理系统 · 训练计划导出</span>
  </div>
</body>
</html>`;
}

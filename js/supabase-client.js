// ====================================================
// Supabase 客户端封装
// 初始化 Supabase SDK，导出统一的 client 和 auth 实例
// ====================================================

// ⚠️ 部署前替换为你的 Supabase 项目信息
const SUPABASE_URL = 'https://svaqwyoafearzoqljzpq.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN2YXF3eW9hZmVhcnpvcWxqenBxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODMxNDQyNTEsImV4cCI6MjA5ODcyMDI1MX0.FqixJCt1zNmJPlotOp7-IUFpfRWtwJD4MsG0kUFTf-o';

let supabase = null;
let currentSession = null;
let authStateCallbacks = [];

/**
 * 获取 Supabase 客户端实例（懒加载）
 */
function getSupabase() {
    if (supabase) return supabase;
    if (typeof window.supabase === 'undefined') {
        console.error('Supabase SDK 未加载，请在 HTML 中先引入 CDN');
        return null;
    }
    try {
        supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
            auth: {
                autoRefreshToken: true,
                persistSession: true,
                detectSessionInUrl: true,
                storage: window.localStorage
            }
        });
        console.log('✅ Supabase client created successfully');
    } catch (e) {
        console.error('❌ Supabase 初始化失败:', e);
        return null;
    }
    return supabase;
}

/**
 * 获取当前登录的教练 ID
 */
function getCoachId() {
    return currentSession?.user?.id || null;
}

/**
 * 获取当前登录的教练信息
 */
function getCoach() {
    return currentSession?.user || null;
}

/**
 * 监听认证状态变化
 * @param {Function} callback - (session, user) => void
 */
function onAuthStateChange(callback) {
    authStateCallbacks.push(callback);
    const sb = getSupabase();
    if (!sb) return;
    sb.auth.onAuthStateChange((event, session) => {
        currentSession = session;
        authStateCallbacks.forEach(cb => {
            try { cb(session, session?.user); } catch (e) { console.error(e); }
        });
    });
}

/**
 * 需要登录才能访问的页面守护
 */
async function requireAuth() {
    const sb = getSupabase();
    if (!sb) return false;
    const { data: { session } } = await sb.auth.getSession();
    currentSession = session;
    if (!session) {
        window.location.href = './login.html';
        return false;
    }
    return true;
}

/**
 * 退出登录
 */
async function signOut() {
    const sb = getSupabase();
    if (!sb) {
        window.location.replace('./login.html');
        return;
    }
    await sb.auth.signOut();
    currentSession = null;
    window.location.replace('./login.html');
}

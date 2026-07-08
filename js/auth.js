// ====================================================
// 认证模块 - 登录/注册逻辑
// ====================================================

/**
 * 教练注册
 */
async function handleRegister(name, email, password) {
    const sb = getSupabase();
    if (!sb) return { success: false, error: '客户端未初始化' };
    
    try {
        // 1. Supabase Auth 注册
        const { data, error } = await sb.auth.signUp({
            email,
            password,
            options: {
                data: { name }
            }
        });
        
        if (error) {
            return { success: false, error: mapAuthError(error) };
        }
        
        // 2. 尝试更新 coach_profiles（可能因邮箱验证未完成而失败，忽略错误）
        if (data.user) {
            try {
                await sb.from('coach_profiles')
                    .update({ name, updated_at: new Date().toISOString() })
                    .eq('id', data.user.id);
            } catch (e) {
                console.log('profile update skipped:', e.message);
            }
        }
        
        return { 
            success: true, 
            user: data.user,
            needsEmailConfirm: data.user?.identities?.length === 0
        };
    } catch (e) {
        console.error('handleRegister error:', e);
        return { success: false, error: '注册失败，请稍后重试' };
    }
}

/**
 * 教练登录
 */
async function handleLogin(email, password) {
    const sb = getSupabase();
    if (!sb) return { success: false, error: '客户端未初始化' };
    
    const { data, error } = await sb.auth.signInWithPassword({ email, password });
    
    if (error) {
        return { success: false, error: mapAuthError(error) };
    }
    
    return { success: true, user: data.user };
}

/**
 * 发送密码重置邮件
 */
async function handleResetPassword(email) {
    const sb = getSupabase();
    if (!sb) return { success: false, error: '客户端未初始化' };
    
    const { error } = await sb.auth.resetPasswordForEmail(email, {
        redirectTo: window.location.origin + '/reset-password.html'
    });
    
    if (error) {
        return { success: false, error: mapAuthError(error) };
    }
    
    return { success: true };
}

/**
 * 映射 Supabase 错误码到中文提示
 */
function mapAuthError(error) {
    const map = {
        'Invalid login credentials': '邮箱或密码错误',
        'User already registered': '该邮箱已注册，请直接登录',
        'Password should be at least 6 characters': '密码至少需要 6 位',
        'Email rate limit exceeded': '操作太频繁，请稍后再试',
        'Email not confirmed': '请先验证邮箱',
        'For security purposes, you can only request this after': '操作太频繁，请 60 秒后再试'
    };
    return map[error.message] || error.message;
}

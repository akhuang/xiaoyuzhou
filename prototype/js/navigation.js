/**
 * 小宇宙播客应用导航管理系统
 * 实现页面导航、返回功能、数据传递、标签切换和状态管理
 */

(function() {
    // 使用IIFE（立即调用函数表达式）创建闭包，避免全局变量污染
    
    // 导航历史记录栈
    let navigationHistory = [];
    
    // 当前页面标签索引
    let currentTabIndex = 0;
    
    // 当前页面URL
    let currentPageUrl = window.location.pathname.split('/').pop();
    
    // 导航数据存储（用于跨页面传递数据）
    let navigationData = null;
    
    // 页面名称映射到标签索引
    const pageToTabMapping = {
        'home.html': 0,
        'discover.html': 1,
        'subscriptions.html': 2,
        'podcast_detail.html': 2, // 订阅内容，属于订阅标签
        'episode_comments.html': 2, 
        'player.html': 2,
        'episode_list.html': 2,
        'profile.html': 3,
    };
    
    // 标签索引映射到页面名称
    const tabToPageMapping = {
        0: 'home.html',
        1: 'discover.html',
        2: 'subscriptions.html',
        3: 'profile.html',
    };
    
    // 页面过渡动画类型
    const transitionTypes = {
        PUSH: 'push',
        POP: 'pop',
        TAB: 'tab'
    };
    
    /**
     * 初始化导航系统
     */
    function init() {
        // 从localStorage恢复导航历史（如果存在）
        try {
            const savedHistory = localStorage.getItem('xiaoyuzhou_nav_history');
            if (savedHistory) {
                navigationHistory = JSON.parse(savedHistory);
            }
        } catch (e) {
            console.error('导航历史恢复失败:', e);
        }
        
        // 检查当前页面是否有导航数据
        try {
            const navDataString = sessionStorage.getItem('xiaoyuzhou_nav_data');
            if (navDataString) {
                navigationData = JSON.parse(navDataString);
                // 获取后清除，避免下一次导航使用旧数据
                sessionStorage.removeItem('xiaoyuzhou_nav_data');
            }
        } catch (e) {
            console.error('导航数据获取失败:', e);
        }
        
        // 确定当前标签索引
        if (currentPageUrl in pageToTabMapping) {
            currentTabIndex = pageToTabMapping[currentPageUrl];
        }
        
        // 初始化交互元素
        setupInteractions();
    }
    
    /**
     * 设置导航交互元素
     */
    function setupInteractions() {
        // 绑定具有导航属性的元素点击事件
        document.querySelectorAll('[data-nav-to]').forEach(elem => {
            elem.addEventListener('click', function(e) {
                // 阻止默认行为，避免<a>标签默认导航
                e.preventDefault();
                
                // 获取导航信息
                const targetUrl = this.getAttribute('data-nav-to');
                let navData = null;
                
                // 检查是否有导航数据
                const navDataAttr = this.getAttribute('data-nav-data');
                if (navDataAttr) {
                    try {
                        navData = JSON.parse(navDataAttr);
                    } catch (e) {
                        console.error('导航数据解析失败:', e);
                    }
                }
                
                // 执行导航
                navigateTo(targetUrl, navData);
            });
        });
        
        // 绑定返回按钮
        document.querySelectorAll('[data-nav-back]').forEach(elem => {
            elem.addEventListener('click', function() {
                goBack();
            });
        });
        
        // 添加返回手势（滑动返回）
        setupSwipeBack();
    }
    
    /**
     * 设置滑动返回功能
     */
    function setupSwipeBack() {
        // 只在支持返回的页面添加滑动返回
        if (!document.body.classList.contains('can-go-back')) {
            return;
        }
        
        // 触摸状态变量
        let touchStartX = 0;
        let touchStartY = 0;
        let swipingBack = false;
        const edgeSize = window.innerWidth * 0.1; // 屏幕边缘10%区域触发滑动返回
        const indicator = document.querySelector('.edge-swipe-indicator');
        
        // 如果存在边缘滑动指示器，设置其初始状态
        if (indicator) {
            indicator.style.position = 'fixed';
            indicator.style.top = '0';
            indicator.style.left = '0';
            indicator.style.width = '3px';
            indicator.style.height = '100%';
            indicator.style.background = 'rgba(255,79,94,0.5)';
            indicator.style.transform = 'scaleY(0)';
            indicator.style.transformOrigin = 'center';
            indicator.style.opacity = '0';
            indicator.style.transition = 'transform 0.2s ease, opacity 0.2s ease';
            indicator.style.zIndex = '9999';
        }
        
        // 触摸开始
        document.addEventListener('touchstart', function(e) {
            touchStartX = e.touches[0].clientX;
            touchStartY = e.touches[0].clientY;
            
            // 检查是否从左边缘开始滑动
            if (touchStartX <= edgeSize) {
                swipingBack = true;
                
                // 显示滑动指示器
                if (indicator) {
                    indicator.style.opacity = '1';
                }
            }
        });
        
        // 触摸移动
        document.addEventListener('touchmove', function(e) {
            if (!swipingBack) return;
            
            const touchX = e.touches[0].clientX;
            const touchY = e.touches[0].clientY;
            
            // 计算水平滑动距离
            const deltaX = touchX - touchStartX;
            
            // 滑动距离超过屏幕宽度的25%时触发返回
            if (deltaX > window.innerWidth * 0.25) {
                swipingBack = false;
                if (indicator) {
                    indicator.style.opacity = '0';
                    indicator.style.transform = 'scaleY(0)';
                }
                goBack();
                return;
            }
            
            // 更新滑动指示器
            if (indicator && deltaX > 0) {
                indicator.style.transform = `scaleY(${Math.min(deltaX / (window.innerWidth * 0.3), 1)})`;
            }
        });
        
        // 触摸结束
        document.addEventListener('touchend', function() {
            if (swipingBack && indicator) {
                indicator.style.opacity = '0';
                indicator.style.transform = 'scaleY(0)';
                swipingBack = false;
            }
        });
    }
    
    /**
     * 导航到指定页面
     * @param {string} url - 目标页面URL
     * @param {Object} data - 可选，传递给目标页面的数据
     * @param {boolean} replace - 可选，是否替换当前历史记录（不添加新记录）
     */
    function navigateTo(url, data = null, replace = false) {
        // 保存当前页面
        if (!replace) {
            navigationHistory.push(currentPageUrl);
            
            // 保存导航历史到localStorage
            try {
                localStorage.setItem('xiaoyuzhou_nav_history', JSON.stringify(navigationHistory));
            } catch (e) {
                console.error('导航历史保存失败:', e);
            }
        }
        
        // 保存导航数据到sessionStorage（页面跳转会丢失JS变量）
        if (data) {
            try {
                sessionStorage.setItem('xiaoyuzhou_nav_data', JSON.stringify(data));
            } catch (e) {
                console.error('导航数据保存失败:', e);
            }
        }
        
        // 页面切换动画
        if (document.body.classList.contains('page-transition')) {
            applyPageTransition(transitionTypes.PUSH);
        }
        
        // 执行页面跳转
        window.location.href = url;
    }
    
    /**
     * 返回上一页
     * @param {number} steps - 可选，返回的步数，默认为1
     */
    function goBack(steps = 1) {
        // 检查历史记录是否足够
        if (navigationHistory.length < steps) {
            // 历史不足，回到首页
            navigateTo('index.html', null, true);
            return;
        }
        
        // 获取返回目标
        let targetUrl;
        while (steps > 0 && navigationHistory.length > 0) {
            targetUrl = navigationHistory.pop();
            steps--;
        }
        
        // 保存更新后的历史到localStorage
        try {
            localStorage.setItem('xiaoyuzhou_nav_history', JSON.stringify(navigationHistory));
        } catch (e) {
            console.error('导航历史保存失败:', e);
        }
        
        // 页面切换动画
        if (document.body.classList.contains('page-transition')) {
            applyPageTransition(transitionTypes.POP);
        }
        
        // 执行页面跳转
        window.location.href = targetUrl;
    }
    
    /**
     * 切换底部标签页
     * @param {number} tabIndex - 标签索引
     */
    function switchTab(tabIndex) {
        // 如果是当前标签，不做操作
        if (tabIndex === currentTabIndex && 
            currentPageUrl === tabToPageMapping[tabIndex]) {
            return;
        }
        
        // 标签对应的页面URL
        const targetUrl = tabToPageMapping[tabIndex];
        
        // 更新当前标签
        currentTabIndex = tabIndex;
        
        // 页面切换动画
        if (document.body.classList.contains('page-transition')) {
            applyPageTransition(transitionTypes.TAB);
        }
        
        // 清空导航历史（标签切换通常是根级导航）
        navigationHistory = [];
        try {
            localStorage.setItem('xiaoyuzhou_nav_history', JSON.stringify(navigationHistory));
        } catch (e) {
            console.error('导航历史保存失败:', e);
        }
        
        // 执行页面跳转
        window.location.href = targetUrl;
    }
    
    /**
     * 应用页面切换动画
     * @param {string} type - 动画类型
     */
    function applyPageTransition(type) {
        // 创建动画遮罩
        const overlay = document.createElement('div');
        overlay.style.position = 'fixed';
        overlay.style.top = '0';
        overlay.style.left = '0';
        overlay.style.width = '100%';
        overlay.style.height = '100%';
        overlay.style.zIndex = '9999';
        overlay.style.pointerEvents = 'none';
        
        // 根据不同的切换类型应用不同的动画
        switch (type) {
            case transitionTypes.PUSH:
                overlay.style.backgroundColor = 'rgba(0,0,0,0.1)';
                overlay.style.transition = 'opacity 0.3s ease';
                overlay.style.opacity = '0';
                break;
                
            case transitionTypes.POP:
                overlay.style.backgroundColor = 'rgba(0,0,0,0.1)';
                overlay.style.transition = 'opacity 0.3s ease';
                overlay.style.opacity = '0';
                break;
                
            case transitionTypes.TAB:
                overlay.style.backgroundColor = 'rgba(0,0,0,0.05)';
                overlay.style.transition = 'opacity 0.2s ease';
                overlay.style.opacity = '0';
                break;
        }
        
        // 添加到页面
        document.body.appendChild(overlay);
        
        // 触发动画
        setTimeout(() => {
            overlay.style.opacity = '1';
        }, 0);
    }
    
    /**
     * 获取导航数据
     * @returns {Object} - 传递给当前页面的数据
     */
    function getNavigationData() {
        return navigationData;
    }
    
    // 暴露公共API
    window.appNav = {
        init: init,
        navigateTo: navigateTo,
        goBack: goBack,
        switchTab: switchTab,
        getNavigationData: getNavigationData
    };
    
    // 页面加载完成后自动初始化
    document.addEventListener('DOMContentLoaded', function() {
        init();
    });
})();
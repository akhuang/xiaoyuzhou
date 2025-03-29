// 模拟相机功能
function simulateCamera() {
    const cameraView = document.querySelector('.camera-view');
    const statusText = document.querySelector('.camera-status');
    const preview1 = document.getElementById('preview-1');
    const preview2 = document.getElementById('preview-2');
    const captureBtn = document.querySelector('.capture-btn');
    const aiResult = document.querySelector('.ai-result');
    
    // 模拟照片状态
    let photosTaken = 0;
    
    // 模拟拍照按钮点击
    captureBtn.addEventListener('click', () => {
        photosTaken++;
        
        if (photosTaken === 1) {
            // 第一张照片
            preview1.src = 'img/car_violation.jpg';
            preview1.classList.add('active');
            statusText.textContent = '请拍摄第2张照片 (车牌特写)';
        } else if (photosTaken === 2) {
            // 第二张照片
            preview2.src = 'img/license_plate.jpg';
            preview2.classList.add('active');
            statusText.textContent = '已完成拍摄';
            
            // 模拟AI分析
            setTimeout(() => {
                aiResult.style.display = 'block';
                document.querySelector('.ai-loading').style.display = 'none';
                document.querySelector('.ai-result-content').style.display = 'block';
            }, 1500);
        }
    });
    
    // 模拟重拍按钮
    document.getElementById('retake-btn').addEventListener('click', () => {
        photosTaken = 0;
        preview1.src = 'img/placeholder.jpg';
        preview2.src = 'img/placeholder.jpg';
        preview1.classList.remove('active');
        preview2.classList.remove('active');
        statusText.textContent = '请拍摄第1张照片 (车辆全景)';
        aiResult.style.display = 'none';
    });
    
    // 模拟提交按钮
    document.getElementById('submit-btn').addEventListener('click', () => {
        alert('违法记录已提交！');
        // 重置界面
        photosTaken = 0;
        preview1.src = 'img/placeholder.jpg';
        preview2.src = 'img/placeholder.jpg';
        preview1.classList.remove('active');
        preview2.classList.remove('active');
        statusText.textContent = '请拍摄第1张照片 (车辆全景)';
        aiResult.style.display = 'none';
    });
}

// 切换底部标签页
function setupTabNavigation() {
    const tabs = document.querySelectorAll('.tab');
    
    tabs.forEach(tab => {
        tab.addEventListener('click', (e) => {
            e.preventDefault();
            
            // 移除所有tab的active类
            tabs.forEach(t => t.classList.remove('active'));
            
            // 给当前点击的tab添加active类
            tab.classList.add('active');
            
            // 这里只是原型，实际开发时应该切换页面内容
        });
    });
}

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', () => {
    // 更新状态栏时间
    const timeElement = document.querySelector('.status-bar .time');
    if (timeElement) {
        const now = new Date();
        const hours = now.getHours().toString().padStart(2, '0');
        const minutes = now.getMinutes().toString().padStart(2, '0');
        timeElement.textContent = `${hours}:${minutes}`;
    }
    
    // 初始化相机模拟功能
    if (document.querySelector('.camera-view')) {
        simulateCamera();
    }
    
    // 初始化标签页导航
    setupTabNavigation();
});

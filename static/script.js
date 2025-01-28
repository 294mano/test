// 將 API_URL 更新為新的 GAS 部署 URL
const API_URL = 'https://script.google.com/macros/s/AKfycbxsSWUGu3OFpUTsA9043V72Mt6TEr8w9-UFLQmkVU_qpJik-x9Q1PMWhR_o2k6E7355/exec';

// 生成唯一的回調函數名稱
function generateCallbackName() {
    return 'callback_' + Math.random().toString(36).substr(2, 9);
}

// 創建 JSONP 請求
function jsonp(url, callback) {
    const callbackName = generateCallbackName();
    window[callbackName] = function(data) {
        callback(data);
        document.body.removeChild(script);
        delete window[callbackName];
    };

    const script = document.createElement('script');
    script.src = url + (url.indexOf('?') >= 0 ? '&' : '?') + 'callback=' + callbackName;
    document.body.appendChild(script);
}

document.getElementById('searchForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const email = document.getElementById('email').value;
    
    if (!email) {
        alert('請輸入電子郵件');
        return;
    }
    
    // 顯示載入中的訊息
    const orderDetails = document.getElementById('orderDetails');
    orderDetails.innerHTML = '<p>資料查詢中，請稍候...</p>';
    document.getElementById('resultArea').style.display = 'block';

    // 構建查詢 URL
    const queryParams = new URLSearchParams({
        operation: 'search',
        email: email
    });

    // 使用 JSONP 發送請求
    jsonp(`${API_URL}?${queryParams.toString()}`, function(data) {
        console.log('Received data:', data);
        
        const resultArea = document.getElementById('resultArea');
        const questionArea = document.getElementById('questionArea');
        
        resultArea.style.display = 'block';
        questionArea.style.display = 'block';
        
        if (data.success) {
            orderDetails.innerHTML = '';
            for (const [key, value] of Object.entries(data.data)) {
                const p = document.createElement('p');
                p.textContent = `${key}: ${value}`;
                orderDetails.appendChild(p);
            }
        } else {
            orderDetails.innerHTML = `<p class="text-danger">${data.message || '查詢失敗，請稍後再試'}</p>`;
        }
    });
});

function submitQuestion() {
    const question = document.getElementById('question').value;
    const email = document.getElementById('email').value;
    
    if (!question) {
        alert('請輸入您的問題');
        return;
    }

    // 構建問題提交 URL
    const queryParams = new URLSearchParams({
        operation: 'submitQuestion',
        email: email,
        question: question
    });

    // 使用 JSONP 發送請求
    jsonp(`${API_URL}?${queryParams.toString()}`, function(data) {
        console.log('Received data:', data);
        if (data.success) {
            alert(data.message || '問題已成功提交！');
            document.getElementById('question').value = '';
        } else {
            alert(data.message || '提交問題時發生錯誤，請稍後再試');
        }
    });
} 
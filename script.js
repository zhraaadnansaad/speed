// الانتظار حتى يتم تحميل محتوى الصفحة بالكامل
document.addEventListener('DOMContentLoaded', function () {

    // الحصول على جميع العناصر من الصفحة باستخدام 'var'
    var startTestButton = document.getElementById('start-test-button');
    var speedValueElement = document.getElementById('speed-value');
    var gaugeProgressElement = document.getElementById('gauge-progress');
    var speedGauge = document.querySelector('.speed-gauge');
    var progressBarContainer = document.querySelector('.progress-bar-container');
    var progressBar = document.getElementById('progress-bar');
    var statusMessage = document.getElementById('status-message');
    var resultText = document.getElementById('result-text');
    var testDatetimeElement = document.getElementById('test-datetime');
    var connectionTypeElement = document.getElementById('connection-type');

    // إعدادات دائرة القياس
    var circumference = 2 * Math.PI * gaugeProgressElement.r.baseVal.value;
    // استخدام دمج النصوص التقليدي بدلاً من القوالب النصية
    gaugeProgressElement.style.strokeDasharray = circumference + ' ' + circumference;
    gaugeProgressElement.style.strokeDashoffset = circumference;

    // دالة لتحديث واجهة الدائرة
    function setProgress(percent) {
        var offset = circumference - (percent / 100) * circumference;
        gaugeProgressElement.style.strokeDashoffset = offset;
    }

    // دالة لعرض نوع الاتصال
    function displayConnectionType() {
        var connectionInfo = "نوع الاتصال: ";
        if (navigator.connection) {
            var type = navigator.connection.effectiveType;
            if (navigator.connection.type === 'wifi') {
                connectionInfo += "Wi-Fi";
            } else if (navigator.connection.type === 'cellular') {
                // استخدام دمج النصوص التقليدي
                connectionInfo += 'Cellular (' + type.toUpperCase() + ')';
            } else {
                connectionInfo += navigator.connection.type || "غير معروف";
            }
        } else {
            connectionInfo += "غير متوفر";
        }
        connectionTypeElement.textContent = connectionInfo;
    }

    // دالة لتصنيف السرعة وعرض النص المناسب
    function getSpeedCategory(mbps) {
        if (mbps > 50) return { text: "ممتازة", color: "#4ade80" };
        if (mbps > 25) return { text: "جيدة جداً", color: "#86efac" };
        if (mbps > 10) return { text: "متوسطة", color: "#facc15" };
        if (mbps > 3) return { text: "ضعيفة", color: "#f87171" };
        return { text: "ضعيفة جداً", color: "#ef4444" };
    }

    // عرض نوع الاتصال عند تحميل الصفحة
    displayConnectionType();

    // إضافة مستمع حدث للزر
    startTestButton.addEventListener('click', function () {
        // --- مرحلة التحضير للاختبار ---
        startTestButton.disabled = true;
        startTestButton.textContent = 'جاري القياس...';
        speedGauge.classList.add('testing');
        progressBarContainer.classList.add('visible');
        statusMessage.textContent = '... يتم الاتصال بالخادم';
        
        // إعادة تعيين القيم
        resultText.textContent = '';
        testDatetimeElement.textContent = '';
        speedValueElement.textContent = '0.00';
        setProgress(0);
        progressBar.style.width = '0%';

        // --- بدء عملية القياس ---
        var imageAddr = "test-image.jpg" + "?n=" + Math.random();
var downloadSize = 10568218; // حجم الصورة الجديدة بالبايت (10.0 ميجابايت)
        var startTime, endTime;
        var download = new Image();

        download.onload = function () {
            endTime = new Date().getTime();
            statusMessage.textContent = '... يتم حساب النتائج';
            showResults();
        };
        download.onerror = function () {
            statusMessage.textContent = "فشل الاختبار. حاول مرة أخرى.";
            speedGauge.classList.remove('testing');
            startTestButton.disabled = false;
            startTestButton.textContent = 'ابدأ الاختبار';
            progressBarContainer.classList.remove('visible');
        };

        startTime = new Date().getTime();
        statusMessage.textContent = '... جاري تنزيل ملف الاختبار';
        download.src = imageAddr;

        // --- دالة عرض النتائج ---
        function showResults() {
            var duration = (endTime - startTime) / 1000;
            var bitsLoaded = downloadSize * 8;
            var speedBps = bitsLoaded / duration;
            var speedKbps = speedBps / 1024;
            var speedMbps = parseFloat((speedKbps / 1024).toFixed(2));

            var progressPercent = Math.min((speedMbps / 100) * 100, 100);
            setProgress(progressPercent);
            progressBar.style.width = '100%';

            var currentSpeed = 0;
            var increment = speedMbps / 50;
            var interval = setInterval(function () {
                currentSpeed += increment;
                if (currentSpeed >= speedMbps) {
                    currentSpeed = speedMbps;
                    clearInterval(interval);
                    
                    speedGauge.classList.remove('testing');
                    startTestButton.disabled = false;
                    startTestButton.textContent = 'إجراء اختبار جديد';
                    statusMessage.textContent = 'تم القياس بنجاح!';
                    
                    var category = getSpeedCategory(speedMbps);
                    // استخدام دمج النصوص التقليدي
                    resultText.textContent = 'السرعة: ' + category.text;
                    resultText.style.color = category.color;

                    var now = new Date();
                    // استخدام دمج النصوص التقليدي
                    testDatetimeElement.textContent = 'تاريخ القياس: ' + now.toLocaleString('ar-IQ');
                    
                    setTimeout(function() {
                        progressBarContainer.classList.remove('visible');
                    }, 2000);
                }
                speedValueElement.textContent = currentSpeed.toFixed(2);
            }, 20);
        }
    });
});

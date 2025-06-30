document.addEventListener('DOMContentLoaded', function () {

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

    var circumference = 2 * Math.PI * gaugeProgressElement.r.baseVal.value;
    gaugeProgressElement.style.strokeDasharray = circumference + ' ' + circumference;
    gaugeProgressElement.style.strokeDashoffset = circumference;

    function setProgress(percent) {
        var offset = circumference - (percent / 100) * circumference;
        gaugeProgressElement.style.strokeDashoffset = offset;
    }

    function displayConnectionType() {
        var connectionInfo = "نوع الاتصال: ";
        if (navigator.connection) {
            var type = navigator.connection.effectiveType;
            if (navigator.connection.type === 'wifi') {
                connectionInfo += "Wi-Fi";
            } else if (navigator.connection.type === 'cellular') {
                connectionInfo += 'Cellular (' + type.toUpperCase() + ')';
            } else {
                connectionInfo += navigator.connection.type || "غير معروف";
            }
        } else {
            connectionInfo += "غير متوفر";
        }
        connectionTypeElement.textContent = connectionInfo;
    }

    function getSpeedCategory(mbps) {
        if (mbps > 50) return { text: "ممتازة", color: "#4ade80" };
        if (mbps > 25) return { text: "جيدة جداً", color: "#86efac" };
        if (mbps > 10) return { text: "متوسطة", color: "#facc15" };
        if (mbps > 3) return { text: "ضعيفة", color: "#f87171" };
        return { text: "ضعيفة جداً", color: "#ef4444" };
    }

    displayConnectionType();

    startTestButton.addEventListener('click', function () {
        startTestButton.disabled = true;
        startTestButton.textContent = 'جاري القياس...';
        speedGauge.classList.add('testing');
        progressBarContainer.classList.add('visible');
        statusMessage.textContent = '... يتم الاتصال بالخادم';

        resultText.textContent = '';
        testDatetimeElement.textContent = '';
        speedValueElement.textContent = '0.00';
        setProgress(0);
        progressBar.style.width = '0%';

        var imageAddr = "test-image.jpg" + "?n=" + Math.random();
        var downloadSize = 10485760; // 10MB
        var startTime = new Date().getTime();

        statusMessage.textContent = '... جاري تنزيل ملف الاختبار';

        fetch(imageAddr)
            .then(function (response) {
                if (!response.ok) {
                    throw new Error("فشل تحميل الملف");
                }
                return response.blob();
            })
            .then(function (blob) {
                var endTime = new Date().getTime();
                statusMessage.textContent = '... يتم حساب النتائج';
                showResults(startTime, endTime);
            })
            .catch(function (error) {
                statusMessage.textContent = "فشل الاختبار. حاول مرة أخرى.";
                speedGauge.classList.remove('testing');
                startTestButton.disabled = false;
                startTestButton.textContent = 'ابدأ الاختبار';
                progressBarContainer.classList.remove('visible');
            });

        function showResults(startTime, endTime) {
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
                    resultText.textContent = 'السرعة: ' + category.text;
                    resultText.style.color = category.color;

                    var now = new Date();
                    testDatetimeElement.textContent = 'تاريخ القياس: ' + now.toLocaleString('ar-IQ');

                    setTimeout(function () {
                        progressBarContainer.classList.remove('visible');
                    }, 2000);
                }
                speedValueElement.textContent = currentSpeed.toFixed(2);
            }, 20);
        }
    });
});

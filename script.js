const preview = document.getElementById('preview');
const startBtn = document.getElementById('start');
const stopBtn = document.getElementById('stop');

let mediaRecorder;
let recordedChunks = [];

navigator.mediaDevices.getUserMedia({ video: true, audio: true })
  .then(stream => {
    preview.srcObject = stream;
    mediaRecorder = new MediaRecorder(stream);

    mediaRecorder.ondataavailable = e => recordedChunks.push(e.data);

    mediaRecorder.onstop = () => {
      const blob = new Blob(recordedChunks, { type: 'video/webm' });
      const formData = new FormData();
      formData.append('video', blob, 'recorded.webm');

      fetch('/api/send', {
        method: 'POST',
        body: formData
      }).then(res => res.text())
        .then(txt => alert(txt))
        .catch(() => alert('❌ فشل الإرسال'));

      recordedChunks = [];
    };

    startBtn.onclick = () => {
      mediaRecorder.start();
      startBtn.disabled = true;
      stopBtn.disabled = false;
      setTimeout(() => {
        mediaRecorder.stop();
        startBtn.disabled = false;
        stopBtn.disabled = true;
      }, 5000);
    };

    stopBtn.onclick = () => {
      mediaRecorder.stop();
      startBtn.disabled = false;
      stopBtn.disabled = true;
    };
  });

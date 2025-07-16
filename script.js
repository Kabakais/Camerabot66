let mediaRecorder;
let recordedChunks = [];

async function startRecording() {
  const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
  document.getElementById('preview').srcObject = stream;

  recordedChunks = [];
  mediaRecorder = new MediaRecorder(stream);
  mediaRecorder.ondataavailable = e => {
    if (e.data.size > 0) recordedChunks.push(e.data);
  };
  mediaRecorder.onstop = async () => {
    const blob = new Blob(recordedChunks, { type: 'video/webm' });
    const formData = new FormData();
    formData.append("video", blob, "recorded.webm");

    await fetch("/api/send", {
      method: "POST",
      body: formData
    });
  };

  mediaRecorder.start();
}

function stopRecording() {
  mediaRecorder.stop();
}

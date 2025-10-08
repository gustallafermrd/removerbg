// Vanilla JS frontend for ByeBg
(() => {
  const API_URL = '/api/remove-background';

  const translations = {
    en: {
      langButton: 'English',
      subtitle: 'Remove backgrounds from your images instantly with AI',
      dropImage: 'Drop your image here',
      browseText: 'or click to browse from your computer',
      selectImage: 'Select Image',
      original: 'Original',
      processed: 'Processed',
      processing: 'Removing background...',
      uploadNew: 'Upload New Image',
      download: 'Download Image',
      footer: 'Powered by AI • Fast & Secure • No data stored',
    },
    es: {
      langButton: 'Español',
      subtitle: 'Elimina fondos de tus imágenes al instante con IA',
      dropImage: 'Arrastra tu imagen aquí',
      browseText: 'o haz clic para buscar en tu computadora',
      selectImage: 'Seleccionar Imagen',
      original: 'Original',
      processed: 'Procesada',
      processing: 'Eliminando fondo...',
      uploadNew: 'Subir Nueva Imagen',
      download: 'Descargar Imagen',
      footer: 'Potenciado por IA • Rápido y Seguro • No se almacenan datos',
    },
  };

  let currentLang = 'en';

  function applyTranslations() {
    document.querySelectorAll('[data-i18n]').forEach((el) => {
      const key = el.getAttribute('data-i18n');
      if (!key) return;
      const txt = translations[currentLang] && translations[currentLang][key];
      if (txt !== undefined) {
        el.textContent = txt;
      }
    });
  }

  // (icons are now inline SVGs — no lucide initialization required)

  const dropArea = document.getElementById('drop-area');
  const fileInput = document.getElementById('file-input');
  const selectBtn = document.getElementById('select-btn');
  const errorEl = document.getElementById('error');
  const resultsEl = document.getElementById('results');
  const originalImg = document.getElementById('original-img');
  const processedImg = document.getElementById('processed-img');
  const processingEl = document.getElementById('processing');
  const processedWrap = document.getElementById('processed-wrap');
  const resetBtn = document.getElementById('reset-btn');
  const downloadBtn = document.getElementById('download-btn');
  const uploadCard = document.getElementById('upload-card');
  const resultsCard = document.getElementById('results-card');

  let currentProcessedData = null;

  function showError(msg) {
    errorEl.textContent = msg;
    errorEl.classList.remove('hidden');
  }

  function clearError() {
    errorEl.textContent = '';
    errorEl.classList.add('hidden');
  }

  function setProcessing(on) {
    if (on) {
      processingEl.classList.remove('hidden');
      processedImg.classList.add('hidden');
    } else {
      processingEl.classList.add('hidden');
    }
  }

  function openFileDialog() {
    fileInput.click();
  }

  function handleFile(file) {
    clearError();
    if (!file.type.startsWith('image/')) {
      showError('Please upload an image file');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      originalImg.src = e.target.result;
      // swap cards: show results card in the same space as upload card
      if (uploadCard && resultsCard) {
        uploadCard.classList.add('hidden');
        resultsCard.classList.remove('hidden');
      }
    };
    reader.readAsDataURL(file);

    // upload
    setProcessing(true);
    fetch(API_URL, {
      method: 'POST',
      body: (() => {
        const fd = new FormData();
        fd.append('image', file);
        return fd;
      })(),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          currentProcessedData = data.image;
          processedImg.src = data.image;
          processedImg.classList.remove('hidden');
          downloadBtn.classList.remove('hidden');
        } else {
          showError(data.error || 'Failed to connect to server. Make sure Flask server is running.');
        }
      })
      .catch((err) => {
        showError('Failed to connect to server. Make sure Flask server is running.');
      })
      .finally(() => setProcessing(false));
  }

  // drag & drop events
  ['dragenter', 'dragover'].forEach((evt) => {
    dropArea.addEventListener(evt, (e) => {
      e.preventDefault();
      e.stopPropagation();
      dropArea.classList.add('border-blue-500', 'bg-blue-50');
    });
  });

  ['dragleave', 'drop'].forEach((evt) => {
    dropArea.addEventListener(evt, (e) => {
      e.preventDefault();
      e.stopPropagation();
      dropArea.classList.remove('border-blue-500', 'bg-blue-50');
    });
  });

  dropArea.addEventListener('drop', (e) => {
    const dt = e.dataTransfer;
    if (dt && dt.files && dt.files[0]) {
      handleFile(dt.files[0]);
    }
  });

  selectBtn.addEventListener('click', (e) => {
    e.preventDefault();
    openFileDialog();
  });

  dropArea.addEventListener('click', (e) => {
    openFileDialog();
  });

  fileInput.addEventListener('change', (e) => {
    const files = e.target.files;
    if (files && files[0]) handleFile(files[0]);
  });

  resetBtn.addEventListener('click', (e) => {
    originalImg.src = '';
    processedImg.src = '';
    // swap back to upload card
    if (uploadCard && resultsCard) {
      resultsCard.classList.add('hidden');
      uploadCard.classList.remove('hidden');
    }
    downloadBtn.classList.add('hidden');
    currentProcessedData = null;
    fileInput.value = '';
    clearError();
  });

  downloadBtn.addEventListener('click', (e) => {
    if (!currentProcessedData) return;
    const link = document.createElement('a');
    link.href = currentProcessedData;
    link.download = 'byebg-image.png';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  });
  // language toggle
  const langToggle = document.getElementById('lang-toggle');
  langToggle.addEventListener('click', (e) => {
    currentLang = currentLang === 'en' ? 'es' : 'en';
    applyTranslations();
  });

  // run initializers
  applyTranslations();
  // icons are inline SVGs; no external init needed
})();

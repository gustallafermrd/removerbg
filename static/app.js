// Vanilla JS frontend for ByeBg
(() => {
  const API_URL = '/api/remove-background';

  // Add / extend translations to include terms link, title and HTML bodies for both languages
  const translations = {
    en: {
      langButton: "English",
      subtitle: "Remove backgrounds from your images instantly with AI",
      dropImage: "Drop your image here",
      browseText: "or click to browse from your computer",
      selectImage: "Select Image",
      original: "Original",
      processed: "Processed",
      processing: "Removing background...",
      uploadNew: "Upload New Image",
      download: "Download Image",
      footer: "Powered by AI • Fast & Secure • No data stored",
      termsLink: "Terms & Conditions",
      termsTitle: "Terms and Conditions of Use",
      termsContent: `
        <p><strong>1. Acceptance of the terms</strong></p>
        <p>By using this web application to remove image backgrounds ("the App"), you agree to comply with and be bound by these terms and conditions. If you do not agree, please do not use the App.</p>

        <p><strong>2. Permitted use</strong></p>
        <p>The App is intended for personal, non-commercial use. It allows users to upload images to remove backgrounds and create PNG files with transparent backgrounds for uses such as stickers for WhatsApp or Instagram.</p>

        <p><strong>3. Responsibility for content</strong></p>
        <p>You are solely responsible for the content of the images you upload. Do not upload images that infringe copyright, trademarks, privacy rights or any applicable law.</p>

        <p><strong>4. Privacy and storage</strong></p>
        <p>The App processes images temporarily to remove the background, but does not store or share uploaded images unless explicitly stated. We recommend not uploading images you do not want processed.</p>

        <p><strong>5. Limitations of the App</strong></p>
        <ol>
          <li>Background removal quality may vary depending on the image.</li>
          <li>We do not guarantee perfect results or continuous availability of the App.</li>
          <li>We are not liable for damages or losses caused by the use of the App or the quality of results.</li>
        </ol>

        <p><strong>6. Modifications and suspension</strong></p>
        <p>We reserve the right to modify, suspend or discontinue the App or these terms at any time without prior notice.</p>

        <p><strong>7. Intellectual property</strong></p>
        <p>The software and content of the App are protected by copyright and intellectual property laws. You may not copy, distribute or modify them without authorization.</p>

        <p><strong>8. Jurisdiction</strong></p>
        <p>These terms are governed by the laws of the country where the App operates. Any dispute will be submitted to the exclusive jurisdiction of those courts.</p>
      `
    },
    es: {
      langButton: "English",
      subtitle: "Elimina fondos de tus imágenes al instante con IA",
      dropImage: "Suelte su imagen aquí",
      browseText: "o haga clic para buscar en su computadora",
      selectImage: "Seleccionar imagen",
      original: "Original",
      processed: "Procesada",
      processing: "Eliminando fondo...",
      uploadNew: "Subir nueva imagen",
      download: "Descargar imagen",
      footer: "Impulsado por IA • Rápido y seguro • No se almacenan datos",
      termsLink: "Términos y Condiciones",
      termsTitle: "Términos y Condiciones de Uso",
      termsContent: `
        <p><strong>1. Aceptación de los términos</strong></p>
        <p>Al utilizar esta aplicación web para remover el fondo de imágenes (“la App”), usted acepta cumplir y estar sujeto a estos términos y condiciones. Si no está de acuerdo con ellos, por favor no use la App.</p>

        <p><strong>2. Uso permitido</strong></p>
        <p>La App está diseñada para uso personal, no comercial. Permite a los usuarios subir imágenes para remover fondos y crear archivos PNG con fondo transparente para uso, por ejemplo, en stickers para WhatsApp o Instagram.</p>

        <p><strong>3. Responsabilidad sobre contenido</strong></p>
        <p>Usted es responsable exclusivo del contenido de las imágenes que suba a la App. No debe subir imágenes que violen derechos de autor, marcas comerciales, privacidad o cualquier ley aplicable.</p>

        <p><strong>4. Privacidad y almacenamiento</strong></p>
        <p>La App procesa las imágenes temporalmente para eliminar el fondo, pero no almacena ni comparte las imágenes subidas, salvo que se indique explícitamente. Se recomienda no subir imágenes que no desee que pasen por procesamiento digital remoto.</p>

        <p><strong>5. Limitaciones de la App</strong></p>
        <ol>
          <li>La calidad de la eliminación de fondos puede variar según la imagen.</li>
          <li>No garantizamos resultados perfectos ni la disponibilidad continua de la App.</li>
          <li>No nos responsabilizamos por daños o pérdidas causados por el uso de la App o la calidad del resultado.</li>
        </ol>

        <p><strong>6. Modificaciones y suspensión</strong></p>
        <p>Nos reservamos el derecho a modificar, suspender o descontinuar la App o estos términos en cualquier momento sin previo aviso.</p>

        <p><strong>7. Propiedad intelectual</strong></p>
        <p>El software y contenidos de la App están protegidos por derechos de autor y propiedad intelectual. No puede copiarlos, distribuirlos o modificarlos sin autorización.</p>

        <p><strong>8. Jurisdicción</strong></p>
        <p>Estos términos se rigen por las leyes del país donde la App opera. Cualquier disputa será sometida a jurisdicción exclusiva de esos tribunales.</p>
      `
    }
  };

  let currentLang = 'en';

  // existing function that applies translations to elements with data-i18n
  function applyTranslations() {
    const lang = currentLang || 'en';
    document.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.getAttribute('data-i18n');
      const txt = translations[lang] && translations[lang][key];
      if (!txt) return;
      // If the element is the terms link or other small labels, use textContent
      if (key === 'termsLink' || key === 'footer' || key === 'langButton' || key === 'selectImage' || key === 'dropImage' || key === 'browseText' || key === 'original' || key === 'processed' || key === 'processing' || key === 'uploadNew' || key === 'download' || key === 'subtitle') {
        el.textContent = txt;
      } else {
        el.textContent = txt;
      }
    });

    // update modal title and body if present
    const titleEl = document.getElementById('terms-title');
    const bodyEl = document.getElementById('terms-body');
    if (titleEl) titleEl.textContent = translations[lang].termsTitle || '';
    if (bodyEl) bodyEl.innerHTML = translations[lang].termsContent || '';
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

  // terms modal handlers
  const termsLink = document.getElementById('terms-link');
  const termsModal = document.getElementById('terms-modal');
  const termsClose = document.getElementById('terms-close');
  const termsBody = document.getElementById('terms-body');

  function showTermsModal(e) {
    if (e) e.preventDefault();
    if (!termsModal) return;
    termsModal.classList.remove('hidden');
    termsModal.classList.add('flex');
    // ensure content matches current language
    const lang = currentLang || 'en';
    if (termsBody) termsBody.innerHTML = translations[lang].termsContent || '';
  }

  function hideTermsModal() {
    if (!termsModal) return;
    termsModal.classList.add('hidden');
    termsModal.classList.remove('flex');
  }

  // wire events
  if (termsLink) termsLink.addEventListener('click', showTermsModal);
  if (termsClose) termsClose.addEventListener('click', hideTermsModal);
  if (termsModal) {
    termsModal.addEventListener('click', (evt) => {
      // close when clicking on overlay (outside modal content)
      if (evt.target === termsModal) hideTermsModal();
    });
  }
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') hideTermsModal();
  });

  // Ensure translations are applied on load
  applyTranslations();

  // Also reapply translations when language toggles elsewhere in your code:
  // (if you already have a lang toggle handler, ensure it calls applyTranslations())
  //
  // Example (if you have a currentLang variable and a toggle handler):
  // currentLang = 'en' | 'es'
  // applyTranslations();
})();

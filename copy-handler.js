document.addEventListener('DOMContentLoaded', () => {
  const copyButton = document.getElementById('copyButton');
  const textarea = document.getElementById('textarea');

  copyButton.addEventListener('click', async () => {
    try {
      // Try modern clipboard API first
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(textarea.value);
      } else {
        // Fallback for Firefox when not in secure context
        textarea.select();
        document.execCommand('copy');
      }
      
      // Visual feedback
      copyButton.textContent = "Copied!";
      copyButton.style.backgroundColor = "#4CAF50";
      copyButton.style.color = "white";
      
      setTimeout(() => {
        copyButton.textContent = "Copy";
        copyButton.style.backgroundColor = "";
        copyButton.style.color = "";
      }, 1500);

    } catch (err) {
      console.error('Clipboard operation failed:', err);
      
      // Try fallback method
      try {
        textarea.select();
        document.execCommand('copy');
        copyButton.textContent = "Copied!";
      } catch (fallbackErr) {
        console.error('Fallback clipboard operation failed:', fallbackErr);
        alert('Failed to copy text. Please manually copy the text (Ctrl+C/Cmd+C).');
      }
    }
  });
});
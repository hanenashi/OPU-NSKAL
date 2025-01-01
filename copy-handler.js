document.addEventListener('DOMContentLoaded', () => {
  const copyButton = document.getElementById('copyButton');
  const textarea = document.getElementById('textarea');

  copyButton.addEventListener('click', () => {
    // Select the text and copy to clipboard
    textarea.select();

    navigator.clipboard.writeText(textarea.value)
      .then(() => {
        // Change button text and color
        copyButton.textContent = "Copied!";
        copyButton.style.backgroundColor = "#4CAF50"; // Green success color
        copyButton.style.color = "white";

        setTimeout(() => {
          // Revert the button to original state
          copyButton.textContent = "Copy";
          copyButton.style.backgroundColor = "";
          copyButton.style.color = "";
        }, 1500); // Flash duration: 1.5 seconds
      })
      .catch(err => {
        console.error('Clipboard write failed:', err);
        alert('Failed to copy text. Please manually copy the text from the textarea.');
      });
  });
});

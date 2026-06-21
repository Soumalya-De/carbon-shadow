import html2canvas from 'html2canvas';

/**
 * Captures an HTML element and exports it as a high-quality PNG image.
 * @param {HTMLElement} element The DOM element to capture
 * @param {string} filename Output filename
 */
export async function exportComponentAsPNG(element, filename = 'carbon-shadow-collectible.png') {
  if (!element) {
    throw new Error("Target element not found for export");
  }

  try {
    // Generate canvas representation of the target DOM node
    const canvas = await html2canvas(element, {
      scale: 2, // Double scale for crystal clear, high-resolution rendering
      backgroundColor: '#05010d', // Match app background color
      logging: false,
      useCORS: true, // Handle external fonts/images if loaded
      allowTaint: true,
      onclone: (clonedDoc) => {
        // We can manipulate the cloned document before rendering if needed
        const clonedCard = clonedDoc.getElementById(element.id);
        if (clonedCard) {
          clonedCard.style.borderRadius = '24px';
          clonedCard.style.border = '1px solid rgba(255,255,255,0.15)';
        }
      }
    });

    const imgData = canvas.toDataURL('image/png');
    
    // Create download link
    const link = document.createElement('a');
    link.href = imgData;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    return true;
  } catch (err) {
    console.error("html2canvas export failed:", err);
    throw err;
  }
}

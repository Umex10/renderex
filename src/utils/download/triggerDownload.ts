
/**
 * Triggers a browser download for the provided data.
 *
 * Creates a `Blob` (if needed), generates an object URL, clicks a hidden anchor,
 * and revokes the object URL shortly after.
 *
 * Note: This function must run in a browser environment.
 *
 * @param data - Data to download (raw data or an existing `Blob`).
 * @param filename - The name for the downloaded file.
 * @param mimeType - MIME type for the created `Blob` (ignored if `data` is already a `Blob`).
 */
export function triggerDownload(
  data: BlobPart, 
  filename: string,
  mimeType: string
) {

  const blob = data instanceof Blob ? data : new Blob([data], { type: mimeType });
  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.style.display = "none";
  a.href = url;
  a.download = filename;
  
  document.body.appendChild(a);
  a.click();

  // Cleanup
  setTimeout(() => {
    URL.revokeObjectURL(url);
    document.body.removeChild(a);
  }, 100);
}
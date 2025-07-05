function base64ToFile(base64Data) {
  const arr = base64Data.split(',');
  const mimeMatch = base64Data.match(/^data:(.*?);base64,/);
  const mimeType = mimeMatch ? mimeMatch[1] : "application/octet-stream";  const bstr = atob(arr[1]);
  const extension = mimeType.split("/")[1];
  const fileName = `file-.${extension}`; 
  let n = bstr.length;
  const u8arr = new Uint8Array(n);

  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }

  return new File([u8arr], fileName, { type: mimeType });
}
export default base64ToFile
/* ==========================================================================
   Scale Up Nano — image compression (no Firebase Storage / no Blaze needed)

   Instead of uploading photos to Firebase Storage (which requires the
   paid Blaze plan just to provision), this resizes and compresses images
   in the browser and stores them directly as base64 data inside the
   Firestore document itself. Firestore's free tier has no billing
   requirement at all.

   Trade-off, stated plainly: Firestore documents cap out at 1MB, so
   images are resized fairly aggressively (long edge capped, JPEG
   compression). This is fine for profile photos and memory/event
   pictures on a club site — it is not meant for print-quality images.
   ========================================================================== */

function compressImageToDataURL(file, maxDim, quality) {
  maxDim = maxDim || 900;
  quality = quality || 0.72;
  return new Promise(function (resolve, reject) {
    const reader = new FileReader();
    reader.onload = function (e) {
      const img = new Image();
      img.onload = function () {
        let w = img.width, h = img.height;
        if (w > maxDim || h > maxDim) {
          if (w >= h) { h = Math.round(h * (maxDim / w)); w = maxDim; }
          else { w = Math.round(w * (maxDim / h)); h = maxDim; }
        }
        const canvas = document.createElement("canvas");
        canvas.width = w;
        canvas.height = h;
        canvas.getContext("2d").drawImage(img, 0, 0, w, h);
        resolve(canvas.toDataURL("image/jpeg", quality));
      };
      img.onerror = function () { reject(new Error("Couldn't read that image file.")); };
      img.src = e.target.result;
    };
    reader.onerror = function () { reject(new Error("Couldn't read that file.")); };
    reader.readAsDataURL(file);
  });
}

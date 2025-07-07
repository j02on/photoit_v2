export const optimizeImage = (
  dataUrl: string,
  maxWidth: number = 800,
  maxHeight: number = 600,
  quality: number = 0.6
): Promise<string> => {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');

      let { width, height } = img;

      // 비율 유지하면서 크기 대폭 축소
      if (width > maxWidth || height > maxHeight) {
        const ratio = Math.min(maxWidth / width, maxHeight / height);
        width *= ratio;
        height *= ratio;
      }

      canvas.width = width;
      canvas.height = height;

      if (ctx) {
        ctx.drawImage(img, 0, 0, width, height);
      }

      // 품질을 60%로 낮춰서 용량 대폭 절약
      resolve(canvas.toDataURL('image/jpeg', quality));
    };
    img.src = dataUrl;
  });
};


export async function compressImage(file: File, quality = 0.7, maxWidth = 1000): Promise<File> {
    return new Promise((resolve, reject) => {
        // Use createObjectURL for better performance with large files
        const objectUrl = URL.createObjectURL(file);
        const img = new Image();
        img.src = objectUrl;

        img.onload = () => {
            URL.revokeObjectURL(objectUrl); // Clean up memory
            const canvas = document.createElement('canvas');
            let width = img.width;
            let height = img.height;

            if (width > maxWidth) {
                height = Math.round((height * maxWidth) / width);
                width = maxWidth;
            }

            canvas.width = width;
            canvas.height = height;
            const ctx = canvas.getContext('2d');
            if (!ctx) {
                reject(new Error('Canvas context not available'));
                return;
            }
            ctx.drawImage(img, 0, 0, width, height);

            // Default to jpeg if type is missing, to ensure compression works for unknown types
            const type = file.type || 'image/jpeg';

            canvas.toBlob((blob) => {
                if (!blob) {
                    reject(new Error('Canvas to Blob failed'));
                    return;
                }

                const compressedFile = new File([blob], file.name, {
                    type: blob.type,
                    lastModified: Date.now(),
                });
                resolve(compressedFile);
            }, type, quality);
        };

        img.onerror = (error) => {
            URL.revokeObjectURL(objectUrl);
            reject(new Error('Failed to load image for compression'));
        };
    });
}

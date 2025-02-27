import React, { useState } from 'react';

function UploadProductImage() {
    const [file, setFile] = useState(null);
    const [productId, setProductId] = useState('');
    const [uploading, setUploading] = useState(false);
    const [result, setResult] = useState(null);

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    const handleProductIdChange = (e) => {
        setProductId(e.target.value);
    };

    const handleUpload = async () => {
        if (!file || !productId) {
            alert('Please provide a product ID and select an image file.');
            return;
        }

        const formData = new FormData();
        formData.append('image', file);
        formData.append('product_id', productId);

        try {
            setUploading(true);
            // Replace the URL below with your Django backend endpoint for product images
            const response = await fetch('https://z0mbified-store.onrender.com/store/upload/hero-image/', {
                method: 'POST',
                body: formData,
            });
            const data = await response.json();
            setResult(data);
            setUploading(false);
        } catch (error) {
            console.error('Error uploading image:', error);
            setUploading(false);
        }
    };

    return (
        <div>
            <h3>Upload Product Image</h3>
            <input
                type="text"
                placeholder="Enter Product ID"
                value={productId}
                onChange={handleProductIdChange}
            />
            <br />
            <input type="file" accept="image/*" onChange={handleFileChange} />
            <br />
            <button onClick={handleUpload} disabled={uploading}>
                {uploading ? 'Uploading...' : 'Upload Image'}
            </button>
            {result && (
                <pre style={{ marginTop: '1rem' }}>
          {JSON.stringify(result, null, 2)}
        </pre>
            )}
        </div>
    );
}

export default UploadProductImage;

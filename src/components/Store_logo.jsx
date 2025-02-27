import React, { useState } from 'react';

function UploadStoreImage() {
    const [file, setFile] = useState(null);
    const [storeId, setStoreId] = useState('');
    const [uploading, setUploading] = useState(false);
    const [result, setResult] = useState(null);

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    const handleProductIdChange = (e) => {
        setStoreId(e.target.value);
    };

    const handleUpload = async () => {
        if (!file || !storeId) {
            alert('Please provide a product ID and select an image file.');
            return;
        }

        const formData = new FormData();
        formData.append('image', file);
        formData.append('store_id', storeId);

        try {
            setUploading(true);
            // Replace the URL below with your Django backend endpoint for product images
            const response = await fetch('https://z0mbified-store.onrender.com/upload/store-logo/', {
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
                placeholder="Enter Category ID"
                value={storeId}
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

export default UploadStoreImage;

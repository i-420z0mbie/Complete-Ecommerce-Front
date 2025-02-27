import React from "react";

const ProductSkeleton = () => {
    return (
        <div className="container my-5">
            <div className="row g-4">
                {/* Image Gallery Skeleton */}
                <div className="col-md-6">
                    <div className="ratio ratio-1x1 bg-light placeholder-glow">
                        <div className="placeholder w-100 h-100"></div>
                    </div>
                </div>

                {/* Product Info Skeleton */}
                <div className="col-md-6">
                    <div className="placeholder-glow">
                        <h2 className="placeholder col-8 rounded mb-4" style={{ height: "40px" }}></h2>

                        <div className="d-flex gap-2 mb-3">
                            <div className="placeholder col-2 rounded" style={{ height: "24px" }}></div>
                            <div className="placeholder col-3 rounded" style={{ height: "24px" }}></div>
                        </div>

                        <div className="d-flex align-items-center gap-2 mb-4">
                            {[...Array(5)].map((_, i) => (
                                <div key={i} className="placeholder rounded" style={{ width: "20px", height: "20px" }}></div>
                            ))}
                        </div>

                        <div className="d-flex flex-wrap gap-3 mb-4">
                            <div className="placeholder col-12 rounded" style={{ height: "50px" }}></div>
                            <div className="placeholder col-12 rounded" style={{ height: "50px" }}></div>
                        </div>

                        <div className="placeholder col-12 rounded" style={{ height: "100px" }}></div>
                    </div>
                </div>
            </div>

            {/* Section Navigation Skeleton */}
            <div className="sticky-top bg-white py-2 border-bottom mb-3">
                <div className="d-flex justify-content-center gap-3">
                    {[...Array(5)].map((_, i) => (
                        <div key={i} className="placeholder col-2 rounded" style={{ height: "40px" }}></div>
                    ))}
                </div>
            </div>

            {/* Content Sections Skeleton */}
            <div className="placeholder-glow">
                {[...Array(4)].map((_, i) => (
                    <div key={i} className="placeholder col-12 rounded mb-4" style={{ height: "200px" }}></div>
                ))}
            </div>
        </div>
    );
};

export default ProductSkeleton;
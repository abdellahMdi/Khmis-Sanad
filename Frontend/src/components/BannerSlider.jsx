// frontend/src/components/BannerSlider.jsx
import React from 'react';

// Banner hero section for homepage
export default function BannerSlider({ height = '40vh' }) {
    // Generate warm artisanal SVG background
    const createBannerBg = () =>
        'data:image/svg+xml;utf8,' +
        encodeURIComponent(
            `<svg xmlns='http://www.w3.org/2000/svg' width='1600' height='600' viewBox='0 0 1600 600'>
                <defs>
                    <linearGradient id='bg' x1='0%' y1='0%' x2='100%' y2='100%'>
                        <stop offset='0%' stop-color='#78350F'/>
                        <stop offset='50%' stop-color='#A04000'/>
                        <stop offset='100%' stop-color='#C2591A'/>
                    </linearGradient>
                    <radialGradient id='accent1' cx='85%' cy='20%' r='350'>
                        <stop offset='0%' stop-color='#F59E0B' stop-opacity='0.35'/>
                        <stop offset='100%' stop-color='transparent'/>
                    </radialGradient>
                    <radialGradient id='accent2' cx='15%' cy='85%' r='300'>
                        <stop offset='0%' stop-color='#E8DCCF' stop-opacity='0.2'/>
                        <stop offset='100%' stop-color='transparent'/>
                    </radialGradient>
                </defs>
                <rect width='100%' height='100%' fill='url(#bg)'/>
                <circle cx='1350' cy='100' r='300' fill='url(#accent1)'/>
                <circle cx='250' cy='500' r='250' fill='url(#accent2)'/>
                <rect x='1250' y='180' width='180' height='180' rx='24' fill='white' opacity='0.04' transform='rotate(18 1340 270)'/>
                <rect x='180' y='90' width='140' height='140' rx='20' fill='white' opacity='0.05' transform='rotate(-15 250 160)'/>
                <polygon points='1420,380 1520,330 1570,430 1470,480' fill='white' opacity='0.04'/>
            </svg>`
        );

    const bannerContent = {
        src: createBannerBg(),
        title: 'Artisanat Marocain Authentique',
        subtitle:
            'Découvrez des pièces uniques façonnées à la main avec passion et savoir-faire par nos artisans.',
        ctaText: 'Découvrir nos créations',
    };

    // Scroll to products section when CTA clicked
    const scrollToProducts = () => {
        const productHeader =
            document.querySelector('[data-section="products"] h2') ||
            document.querySelector('#products h2') ||
            document.querySelector('h2') ||
            document.querySelector('[data-section="products"]') ||
            document.querySelector('#products');

        if (productHeader) {
            const productSection =
                productHeader.closest('section') || productHeader.parentElement;
            const offset = 80;
            const elementPosition =
                productSection.getBoundingClientRect().top + window.pageYOffset;
            const offsetPosition = elementPosition - offset;

            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth',
            });
        } else {
            window.scrollTo({
                top: window.innerHeight * 0.8,
                behavior: 'smooth',
            });
        }
    };

    return (
        <div
            className="relative overflow-hidden rounded-3xl bg-[#78350F] shadow-sm mb-8"
            style={{ minHeight: height }}
        >
            <div className="relative w-full h-full min-h-[320px] md:min-h-[380px]">
                <img
                    src={bannerContent.src}
                    alt={bannerContent.title}
                    className="absolute inset-0 w-full h-full object-cover"
                />

                <div className="absolute inset-0 bg-gradient-to-r from-[#4A3B32]/70 via-[#78350F]/40 to-transparent" />

                <div className="relative h-full flex items-center py-12 px-6 sm:px-12">
                    <div className="max-w-2xl text-white">
                        <span className="inline-block px-3 py-1 mb-3 text-xs font-semibold tracking-wider text-[#FAF5EF] uppercase bg-[#C2591A]/60 backdrop-blur-md rounded-full border border-white/20">
                            Fait main au Maroc
                        </span>
                        <h1 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold leading-tight mb-3">
                            {bannerContent.title}
                        </h1>
                        <p className="text-sm sm:text-lg text-[#FAF5EF]/90 leading-relaxed mb-6 max-w-lg font-light">
                            {bannerContent.subtitle}
                        </p>
                        <button
                            onClick={scrollToProducts}
                            className="inline-flex items-center px-6 py-3 bg-[#C2591A] hover:bg-[#A04000] text-white font-semibold rounded-2xl transition-all duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-0.5 group"
                        >
                            {bannerContent.ctaText}
                            <svg
                                className="ml-2 w-4 h-4 group-hover:translate-y-1 transition-transform duration-300"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M19 14l-7 7m0 0l-7-7m7 7V3"
                                />
                            </svg>
                        </button>
                    </div>
                </div>

                <div className="absolute bottom-6 right-6 opacity-25 hidden sm:block">
                    <div className="w-16 h-16 border-2 border-[#E8DCCF] rounded-full flex items-center justify-center">
                        <div className="w-8 h-8 bg-[#E8DCCF] rounded-full"></div>
                    </div>
                </div>
            </div>
        </div>
    );
}
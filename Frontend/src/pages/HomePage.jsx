// frontend/src/pages/HomePage.jsx
import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import ProductList from '../components/ProductList';
import Pagination from '../components/Pagination';
import axiosClient from '../api/axiosClient';
import BannerSlider from '../components/BannerSlider';
import LoadingSpinner from '../components/LoadingSpinner';

const categoryIcons = {
    tapis: (
        <svg className="w-6 h-6 text-[#C2591A]" fill="currentColor" viewBox="0 0 16 16">
            <path d="M1 2.5A1.5 1.5 0 0 1 2.5 1h11A1.5 1.5 0 0 1 15 2.5v11a1.5 1.5 0 0 1-1.5 1.5h-11A1.5 1.5 0 0 1 1 13.5v-11zM2.5 2a.5.5 0 0 0-.5.5v11a.5.5 0 0 0 .5.5h11a.5.5 0 0 0 .5-.5v-11a.5.5 0 0 0-.5-.5h-11z"/>
            <path d="M3 4h10v1H3V4zm0 3h10v1H3V7zm0 3h10v1H3v-1z"/>
        </svg>
    ),
    poterie: (
        <svg className="w-6 h-6 text-[#A04000]" fill="currentColor" viewBox="0 0 16 16">
            <path d="M8 1a3 3 0 0 0-3 3v1H4a1 1 0 0 0-1 1v2a4 4 0 0 0 3 3.874V13H5a1 1 0 1 0 0 2h6a1 1 0 1 0 0-2h-1v-1.126A4 4 0 0 0 13 8V6a1 1 0 0 0-1-1h-1V4a3 3 0 0 0-3-3zm-1 3a1 1 0 1 1 2 0v1H7V4zm-2 3h6v1a2 2 0 1 1-4 0v-.5a.5.5 0 0 0-1 0V8a3 3 0 1 0 6 0V7z"/>
        </svg>
    ),
    huile: (
        <svg className="w-6 h-6 text-[#D97724]" fill="currentColor" viewBox="0 0 16 16">
            <path d="M8 1.5c-2.3 3.2-5 6.2-5 8.5A5 5 0 0 0 13 10c0-2.3-2.7-5.3-5-8.5zm0 11.5a3.5 3.5 0 0 1-3.5-3.5c0-1.5 1.8-3.9 3.5-6.3 1.7 2.4 3.5 4.8 3.5 6.3A3.5 3.5 0 0 1 8 13z"/>
        </svg>
    ),
    cuir: (
        <svg className="w-6 h-6 text-[#8C3B0C]" fill="currentColor" viewBox="0 0 16 16">
            <path d="M13 1.5a1.5 1.5 0 0 0-1.5-1.5h-7A1.5 1.5 0 0 0 3 1.5V4H1.5A1.5 1.5 0 0 0 0 5.5v5A1.5 1.5 0 0 0 1.5 12H3v2.5A1.5 1.5 0 0 0 4.5 16h7a1.5 1.5 0 0 0 1.5-1.5V12h1.5a1.5 1.5 0 0 0 1.5-1.5v-5A1.5 1.5 0 0 0 14.5 4H13V1.5zM4.5 1.5h7V4h-7V1.5zm10 5.5v3.5a.5.5 0 0 1-.5.5H1.5a.5.5 0 0 1-.5-.5V7a.5.5 0 0 1 .5-.5h13a.5.5 0 0 1 .5.5z"/>
        </svg>
    ),
    epices: (
        <svg className="w-6 h-6 text-[#A04000]" fill="currentColor" viewBox="0 0 16 16">
            <path d="M13 .5c0-.276-.226-.506-.498-.465-1.703.257-2.94 2.012-3 8.462a.5.5 0 0 0 .498.5c.56.01 1 .13 1 1.003v5.5a.5.5 0 0 0 .5.5h1a.5.5 0 0 0 .5-.5zM4.25 0a.25.25 0 0 1 .25.25v5.122a.128.128 0 0 0 .256.006l.233-5.14A.25.25 0 0 1 5.24 0h.522a.25.25 0 0 1 .25.238l.233 5.14a.128.128 0 0 0 .256-.006V.25A.25.25 0 0 1 6.75 0h.29a.5.5 0 0 1 .498.458l.423 5.07a1.69 1.69 0 0 1-1.059 1.711l-.053.022a.92.92 0 0 0-.58.884L6.47 15a.971.971 0 1 1-1.942 0l.202-6.855a.92.92 0 0 0-.58-.884l-.053-.022a1.69 1.69 0 0 1-1.059-1.712L3.462.458A.5.5 0 0 1 3.96 0z"/>
        </svg>
    ),
    default: (
        <svg className="w-6 h-6 text-[#C2591A]" fill="currentColor" viewBox="0 0 16 16">
            <path d="M8 4.754a3.246 3.246 0 1 0 0 6.492 3.246 3.246 0 0 0 0-6.492zM5.754 8a2.246 2.246 0 1 1 4.492 0 2.246 2.246 0 0 1-4.492 0z"/>
            <path d="M9.796 1.343c-.527-1.79-3.065-1.79-3.592 0l-.094.319a.873.873 0 0 1-1.255.52l-.292-.16c-1.64-.892-3.433.902-2.54 2.541l.159.292a.873.873 0 0 1-.52 1.255l-.319.094c-1.79.527-1.79 3.065 0 3.592l.319.094a.873.873 0 0 1 .52 1.255l-.16.292c-.892 1.64.901 3.434 2.541 2.54l.292-.159a.873.873 0 0 1 1.255.52l.094.319c.527 1.79 3.065 1.79 3.592 0l.094-.319a.873.873 0 0 1 1.255-.52l.292.16c1.64.893 3.434-.902 2.54-2.541l-.159-.292a1.873 1.873 0 0 0 1.116 2.692l.318.094c.835.246.835 1.428 0 1.674l-.319.094a1.873 1.873 0 0 0-1.115 2.693l.16.291c.415.764-.42 1.6-1.185 1.184l-.291-.159a1.873 1.873 0 0 0-2.693 1.116l-.094.318c-.246.835-1.428.835-1.674 0l-.094-.319a1.873 1.873 0 0 0-2.692-1.115l-.292.16c-.764.415-1.6-.42-1.184-1.185l.159-.291A1.873 1.873 0 0 0 1.945 8.93l-.319-.094c-.835-.246-.835-1.428 0-1.674l.319-.094A1.873 1.873 0 0 0 3.06 4.377l-.16-.292c-.415-.764.42-1.6 1.185-1.184l.292.159a1.873 1.873 0 0 0 2.692-1.115l.094-.319z"/>
        </svg>
    ),
};

const getCategoryIcon = (categoryName) => {
    if (!categoryName) return categoryIcons.default;
    const name = categoryName.toLowerCase();
    const foundKey = Object.keys(categoryIcons).find((key) => name.includes(key));
    return categoryIcons[foundKey] || categoryIcons.default;
};

export default function HomePage() {
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [pagination, setPagination] = useState({
        current_page: 1,
        last_page: 1,
        per_page: 12,
        total: 0,
        from: 0,
        to: 0,
    });
    const navigate = useNavigate();

    const fetchHomePageData = async (page = 1) => {
        try {
            setLoading(true);
            const [productsResponse, categoriesResponse] = await Promise.all([
                axiosClient.get(`/products?page=${page}`),
                axiosClient.get('/categories'),
            ]);

            const productsData = productsResponse.data?.data;
            if (productsData && productsData.data) {
                setProducts(Array.isArray(productsData.data) ? productsData.data : []);
                setPagination({
                    current_page: productsData.current_page || 1,
                    last_page: productsData.last_page || 1,
                    per_page: productsData.per_page || 12,
                    total: productsData.total || 0,
                    from: productsData.from || 0,
                    to: productsData.to || 0,
                });
            } else {
                let arr = productsData || productsResponse.data || [];
                setProducts(Array.isArray(arr) ? arr : []);
            }

            setCategories(
                Array.isArray(categoriesResponse.data)
                    ? categoriesResponse.data
                    : categoriesResponse.data.data || []
            );
            setError(null);
        } catch (err) {
            let msg = 'Une erreur est survenue lors du chargement des données.';
            if (err.response) {
                msg = `Erreur ${err.response.status}: ${
                    err.response.data?.message || 'Impossible de charger le contenu.'
                }`;
            } else if (err.request) {
                msg = 'Impossible de se connecter au serveur. Veuillez vérifier votre connexion.';
            } else {
                msg = err.message;
            }
            setError(msg);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchHomePageData();
    }, []);

    const handlePageChange = (page) => {
        fetchHomePageData(page);
        document.getElementById('products')?.scrollIntoView({
            behavior: 'smooth',
            block: 'start',
        });
    };

    const scrollToCategories = () => {
        const categorySection = document.getElementById('all-categories');
        if (categorySection) {
            const offset = 100;
            const elementPosition =
                categorySection.getBoundingClientRect().top + window.pageYOffset;
            const offsetPosition = elementPosition - offset;

            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth',
            });
        }
    };

    return (
        <div className="min-h-screen bg-[#FAF5EF] font-montserrat px-4 md:px-8 py-6">
            {/* Banner Section */}
            <section className="w-full mb-8 rounded-3xl overflow-hidden shadow-lg border border-[#E8DCCF]">
                <BannerSlider />
            </section>

            {/* Categories Section */}
            <section id="all-categories" className="mb-10 scroll-mt-20">
                <div className="flex items-center justify-between mb-4 px-2">
                    <h2
                        className="text-2xl font-bold text-[#A04000] cursor-pointer hover:text-[#C2591A] transition-colors"
                        onClick={scrollToCategories}
                    >
                        Catégories Artisanales
                    </h2>
                </div>

                <div className="bg-white rounded-3xl shadow-md border border-[#E8DCCF] p-6">
                    <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-4">
                        <Link to="/" className="group">
                            <div className="flex flex-col items-center p-3 rounded-2xl hover:bg-[#FFF0E5] border border-transparent hover:border-[#E8DCCF] transition-all duration-200">
                                <div className="w-12 h-12 bg-[#FFF0E5] rounded-xl flex items-center justify-center mb-2 group-hover:bg-[#C2591A] transition-colors duration-200">
                                    <svg
                                        className="w-6 h-6 text-[#C2591A] group-hover:text-white transition-colors duration-200"
                                        fill="currentColor"
                                        viewBox="0 0 16 16"
                                    >
                                        <path d="M1 2.5A1.5 1.5 0 0 1 2.5 1h3A1.5 1.5 0 0 1 7 2.5v3A1.5 1.5 0 0 1 5.5 7h-3A1.5 1.5 0 0 1 1 5.5zM2.5 2a.5.5 0 0 0-.5.5v3a.5.5 0 0 0 .5.5h3a.5.5 0 0 0 .5-.5v-3a.5.5 0 0 0-.5-.5zm6.5.5A1.5 1.5 0 0 1 10.5 1h3A1.5 1.5 0 0 1 15 2.5v3A1.5 1.5 0 0 1 13.5 7h-3A1.5 1.5 0 0 1 9 5.5zm1.5-.5a.5.5 0 0 0-.5.5v3a.5.5 0 0 0 .5.5h3a.5.5 0 0 0 .5-.5v-3a.5.5 0 0 0-.5-.5zM1 10.5A1.5 1.5 0 0 1 2.5 9h3A1.5 1.5 0 0 1 7 10.5v3A1.5 1.5 0 0 1 5.5 15h-3A1.5 1.5 0 0 1 1 13.5zm1.5-.5a.5.5 0 0 0-.5.5v3a.5.5 0 0 0 .5.5h3a.5.5 0 0 0 .5-.5v-3a.5.5 0 0 0-.5-.5zm6.5.5A1.5 1.5 0 0 1 10.5 9h3a1.5 1.5 0 0 1 1.5 1.5v3a1.5 1.5 0 0 1-1.5 1.5h-3A1.5 1.5 0 0 1 9 13.5zm1.5-.5a.5.5 0 0 0-.5.5v3a.5.5 0 0 0 .5.5h3a.5.5 0 0 0 .5-.5v-3a.5.5 0 0 0-.5-.5z" />
                                    </svg>
                                </div>
                                <span className="text-xs font-semibold text-[#4A3B32] text-center leading-tight">
                                    Toutes les catégories
                                </span>
                            </div>
                        </Link>

                        {(Array.isArray(categories) ? categories.slice(0, 15) : []).map((cat) => (
                            <Link
                                key={cat.id}
                                to={`/category/${cat.id}`}
                                className="group"
                            >
                                <div className="flex flex-col items-center p-3 rounded-2xl hover:bg-[#FFF0E5] border border-transparent hover:border-[#E8DCCF] transition-all duration-200">
                                    <div className="w-12 h-12 bg-[#FAF5EF] rounded-xl flex items-center justify-center mb-2 group-hover:bg-[#FFF0E5] transition-colors">
                                        {getCategoryIcon(cat.name)}
                                    </div>
                                    <span className="text-xs font-semibold text-[#4A3B32] text-center leading-tight">
                                        {cat.name}
                                    </span>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            </section>

            {/* Products Section */}
            <section data-section="products" id="products" className="scroll-mt-20">
                <div className="mb-6 px-2">
                    <h2 className="text-2xl font-bold text-[#A04000] mb-1">
                        Produits Artisanaux
                    </h2>
                    <p className="text-sm font-medium text-[#785D4E]">
                        Découvrez des créations authentiques faites main par nos coopératives marocaines
                    </p>
                </div>

                {loading && (
                    <LoadingSpinner
                        text="Chargement des produits artisanaux..."
                        size="lg"
                        className="py-12"
                    />
                )}

                {error && (
                    <div className="p-4 bg-red-50 border border-red-200 rounded-2xl text-red-700 font-medium mb-6">
                        <h3 className="font-bold mb-1">Une erreur est survenue</h3>
                        <p className="text-sm">{error}</p>
                    </div>
                )}

                {!loading && !error && (
                    <>
                        <ProductList products={Array.isArray(products) ? products : []} />
                        <div className="mt-8">
                            <Pagination
                                pagination={pagination}
                                onPageChange={handlePageChange}
                            />
                        </div>
                    </>
                )}
            </section>
        </div>
    );
}
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './store/store';
import { useGetUserQuery } from './api/api';
import RootLayout from './layouts/RootLayout';
import ArtisanLayout from './layouts/ArtisanLayout';
import AdminLayout from './layouts/AdminLayout';
import ProtectedRoute from './routes/ProtectedRoute';
import GuestRoute from './routes/GuestRoute';
import ScrollToTop from './components/ScrollToTop';
import HomePage from './pages/HomePage';
import CatalogPage from './pages/CatalogPage';
import ProductPage from './pages/ProductPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';
import OrdersPage from './pages/OrdersPage';
import OrderDetailPage from './pages/OrderDetailPage';
import ForbiddenPage from './pages/ForbiddenPage';
import NotFoundPage from './pages/NotFoundPage';
import ShopPage from './pages/artisan/ShopPage';
import ShopProductsPage from './pages/artisan/ShopProductsPage';
import ShopProductFormPage from './pages/artisan/ShopProductFormPage';
import ShopOrdersPage from './pages/artisan/ShopOrdersPage';
import AdminCooperativesPage from './pages/admin/AdminCooperativesPage';
import AdminReviewsPage from './pages/admin/AdminReviewsPage';
import AdminUsersPage from './pages/admin/AdminUsersPage';

function AuthBoot() {
    useGetUserQuery();
    return null;
}

export function AppRoutes() {
    return (
        <>
            <ScrollToTop />
            <AuthBoot />
            <Routes>
                <Route element={<RootLayout />}>
                    <Route index element={<HomePage />} />
                    <Route path="produits" element={<CatalogPage />} />
                    <Route path="produits/:id" element={<ProductPage />} />
                    <Route path="403" element={<ForbiddenPage />} />

                    <Route element={<GuestRoute />}>
                        <Route path="login" element={<LoginPage />} />
                        <Route path="register" element={<RegisterPage />} />
                    </Route>

                    <Route element={<ProtectedRoute roles={['client']} />}>
                        <Route path="panier" element={<CartPage />} />
                        <Route path="commande" element={<CheckoutPage />} />
                        <Route path="commandes" element={<OrdersPage />} />
                        <Route path="commandes/:id" element={<OrderDetailPage />} />
                    </Route>

                    <Route element={<ProtectedRoute roles={['artisan']} />}>
                        <Route path="artisan" element={<ArtisanLayout />}>
                            <Route index element={<Navigate to="boutique" replace />} />
                            <Route path="boutique" element={<ShopPage />} />
                            <Route path="produits" element={<ShopProductsPage />} />
                            <Route
                                path="produits/nouveau"
                                element={<ShopProductFormPage />}
                            />
                            <Route
                                path="produits/:id/edit"
                                element={<ShopProductFormPage />}
                            />
                            <Route path="commandes" element={<ShopOrdersPage />} />
                        </Route>
                    </Route>

                    <Route element={<ProtectedRoute roles={['admin']} />}>
                        <Route path="admin" element={<AdminLayout />}>
                            <Route
                                index
                                element={<Navigate to="cooperatives" replace />}
                            />
                            <Route
                                path="cooperatives"
                                element={<AdminCooperativesPage />}
                            />
                            <Route path="avis" element={<AdminReviewsPage />} />
                            <Route path="utilisateurs" element={<AdminUsersPage />} />
                        </Route>
                    </Route>

                    <Route path="*" element={<NotFoundPage />} />
                </Route>
            </Routes>
        </>
    );
}

export default function App() {
    return (
        <Provider store={store}>
            <BrowserRouter>
                <AppRoutes />
            </BrowserRouter>
        </Provider>
    );
}

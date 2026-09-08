import React, {
    createContext,
    useState,
    useContext,
    useEffect,
    useCallback,
} from 'react';
import axiosClient from '../api/axiosClient';
import { useAuth } from './AuthContext';
import { useToast } from './ToastContext';

const CartContext = createContext();

export function useCart() {
    return useContext(CartContext);
}

export function CartProvider({ children }) {
    const [cartItems, setCartItems] = useState([]);
    const [cartId, setCartId] = useState(null);
    const [loading, setLoading] = useState(true);

    const { token } = useAuth();
    const { showSuccess, showError } = useToast();

    const fetchCart = useCallback(async () => {
        if (!token) {
            setCartItems([]);
            setCartId(null);
            setLoading(false);
            return;
        }

        try {
            setLoading(true);
            const response = await axiosClient.get('/cart');
            const data = response.data?.data || response.data;
            setCartItems(data.items || []);
            setCartId(data.id || null);
        } catch (error) {
            console.error('Échec du chargement du panier :', error);
            setCartItems([]);
            setCartId(null);
        } finally {
            setLoading(false);
        }
    }, [token]);

    useEffect(() => {
        fetchCart();
    }, [fetchCart]);

    const addToCart = async (product, quantity = 1) => {
        try {
            const response = await axiosClient.post('/cart', {
                product_id: product.id,
                quantity,
            });
            await fetchCart();

            const productName = product.name || product.title || 'Le produit';
            showSuccess(`${productName} a été ajouté au panier avec succès !`);

            return response.data;
        } catch (error) {
            console.error('Échec de l\'ajout au panier :', error);

            let errorMessage = 'Impossible d\'ajouter le produit au panier.';

            if (
                error.response?.status === 401 ||
                error.response?.data?.message === 'Unauthenticated'
            ) {
                errorMessage =
                    'Veuillez vous connecter ou vous inscrire pour ajouter des produits au panier.';
            } else if (error.response?.data?.message) {
                errorMessage = error.response.data.message;
            }

            showError(errorMessage);
            throw new Error(errorMessage);
        }
    };

    const updateCartItem = async (cartItemId, quantity) => {
        try {
            await axiosClient.put(`/cart-items/${cartItemId}`, { quantity });
            await fetchCart();

            showSuccess('Quantité mise à jour avec succès !');
        } catch (error) {
            console.error('Échec de la modification de la quantité :', error);

            let errorMessage = 'Impossible de modifier la quantité.';

            if (
                error.response?.status === 401 ||
                error.response?.data?.message === 'Unauthenticated'
            ) {
                errorMessage =
                    'Veuillez vous connecter pour modifier la quantité.';
            } else if (error.response?.data?.message) {
                errorMessage = error.response.data.message;
            }

            showError(errorMessage);
        }
    };

    const removeFromCart = async (cartItemId) => {
        try {
            await axiosClient.delete(`/cart-items/${cartItemId}`);
            await fetchCart();

            showSuccess('Produit retiré du panier avec succès !');
        } catch (error) {
            console.error('Échec de la suppression de l\'article :', error);

            let errorMessage = 'Impossible de retirer l\'article du panier.';

            if (
                error.response?.status === 401 ||
                error.response?.data?.message === 'Unauthenticated'
            ) {
                errorMessage =
                    'Veuillez vous connecter pour retirer un article du panier.';
            } else if (error.response?.data?.message) {
                errorMessage = error.response.data.message;
            }

            showError(errorMessage);
        }
    };

    const cartCount = cartItems.reduce(
        (count, item) => count + (item.quantity || 0),
        0
    );

    const subtotal = cartItems.reduce((total, item) => {
        const price = parseFloat(item.product?.price || 0);
        return total + price * (item.quantity || 0);
    }, 0);

    const value = {
        cartItems,
        cartId,
        cartCount,
        loading,
        addToCart,
        updateCartItem,
        removeFromCart,
        fetchCart,
        subtotal,
    };

    return (
        <CartContext.Provider value={value}>{children}</CartContext.Provider>
    );
}
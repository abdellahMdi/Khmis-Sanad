import { Outlet } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';

export default function RootLayout() {
    return (
        <div className="flex min-h-dvh min-w-0 flex-col overflow-x-clip">
            <Header />
            <main className="mx-auto w-full min-w-0 max-w-6xl flex-1 px-3 py-5 sm:px-4 sm:py-8">
                <Outlet />
            </main>
            <Footer />
        </div>
    );
}

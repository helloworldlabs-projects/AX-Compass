import Footer from '@/components/layout/Footer';
import Header from '@/components/layout/Header';
import { Floating } from '@/components/layout/Floating';

export default function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Header />
      <main className="bg-special-dark-blue-900 h-auto flex-1 lg:px-[100px] print:bg-transparent print:px-0">
        {children}
      </main>
      <Floating />
      <Footer />
    </>
  );
}

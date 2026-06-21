import { Outlet } from 'react-router-dom';
import Navbar from '@/components/common/Navbar';
import Footer from '@/components/common/Footer';
import Toast from '@/components/common/Toast';
import ScrollToTop from '@/components/common/ScrollToTop';
import styles from './Layout.module.css';

const Layout = () => {
  return (
    <div className={styles.layout}>
      <Navbar />
      <main className={styles.main}>
        <Outlet />
      </main>
      <Footer />
      <Toast />
      <ScrollToTop />
    </div>
  );
};

export default Layout;

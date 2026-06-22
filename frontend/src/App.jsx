import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from '@/context/ThemeContext';
import { ToastProvider } from '@/context/ToastContext';
import Layout from '@/components/layout/Layout';
import Home from '@/pages/Home/Home';
import Analyze from '@/pages/Analyze/Analyze';
import Analytics from '@/pages/Analytics/Analytics';
import History from '@/pages/History/History';
import About from '@/pages/About/About';
import Contact from '@/pages/Contact/Contact';
import NotFound from '@/pages/NotFound/NotFound';
import './App.css';

function App() {
  return (
    <ThemeProvider>
      <ToastProvider>
        <Router>
          <Routes>
            <Route element={<Layout />}>
              <Route path="/" element={<Home />} />
              <Route path="/analyze" element={<Analyze />} />
              <Route path="/analytics" element={<Analytics />} />
              <Route path="/history" element={<History />} />
              <Route path="/about" element={<About />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="*" element={<NotFound />} />
            </Route>
          </Routes>
        </Router>
      </ToastProvider>
    </ThemeProvider>
  );
}

export default App;

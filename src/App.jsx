import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import Guide from './pages/Guide';
import Developer from './pages/Developer';
import Encryption from './pages/Encryption';

export default function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/guide" element={<Guide />} />
          <Route path="/developer" element={<Developer />} />
          <Route path="/encryption" element={<Encryption />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}

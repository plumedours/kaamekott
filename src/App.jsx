import { HashRouter, Route, Routes } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import HomePage from "./pages/Home";
import QuotesPage from "./pages/Quotes";
import CharactersPage from "./pages/Characters";
import CharacterQuotesPage from "./pages/CharacterQuotes";
import SeasonsPage from "./pages/Seasons";
import SeasonQuotesPage from "./pages/SeasonQuotes";
import EpisodeQuotesPage from "./pages/EpisodeQuotes";
import GifsPage from "./pages/Gifs";
import GifDetailPage from "./pages/GifDetail";
import AboutPage from "./pages/About";

export default function App() {
  return (
    <HashRouter>
      <div className="min-h-screen bg-transparent text-slate-900">
        <Header />

        <main>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/quotes" element={<QuotesPage />} />
            <Route path="/characters" element={<CharactersPage />} />
            <Route path="/character/:id" element={<CharacterQuotesPage />} />
            <Route path="/seasons" element={<SeasonsPage />} />
            <Route path="/season/:id" element={<SeasonQuotesPage />} />
            <Route
              path="/season/:seasonId/episode/:episodeId/citations"
              element={<EpisodeQuotesPage />}
            />
            <Route path="/gifs" element={<GifsPage />} />
            <Route path="/gif/:slug" element={<GifDetailPage />} />
            <Route path="/about" element={<AboutPage />} />
          </Routes>
        </main>

        <Footer />
      </div>
    </HashRouter>
  );
}

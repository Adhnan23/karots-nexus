import { Routes, Route, Navigate } from "react-router-dom";
import { Layout } from "@/components/Layout";
import { Hub } from "@/pages/Hub";
import { CropList } from "@/pages/CropList";
import { CropDetail } from "@/pages/CropDetail";
import { Weather } from "@/pages/Weather";
import { Recommendations } from "@/pages/Recommendations";
import { Prices } from "@/pages/Prices";
import { Knowledge } from "@/pages/Knowledge";
import { Article } from "@/pages/Article";
import { MyPlantings } from "@/pages/MyPlantings";
import { PlantingProgress } from "@/pages/PlantingProgress";

export function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<Hub />} />
        <Route path="crops" element={<CropList />} />
        <Route path="crops/:id" element={<CropDetail />} />
        <Route path="weather" element={<Weather />} />
        <Route path="recommendations" element={<Recommendations />} />
        <Route path="prices" element={<Prices />} />
        <Route path="knowledge" element={<Knowledge />} />
        <Route path="knowledge/:id" element={<Article />} />
        <Route path="plantings" element={<MyPlantings />} />
        <Route path="plantings/:id" element={<PlantingProgress />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
}

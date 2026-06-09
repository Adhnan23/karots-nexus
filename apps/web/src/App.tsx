import { Routes, Route, Navigate } from "react-router-dom";
import { Layout } from "@/components/Layout";
import { CropList } from "@/pages/CropList";
import { CropDetail } from "@/pages/CropDetail";
import { MyPlantings } from "@/pages/MyPlantings";
import { PlantingProgress } from "@/pages/PlantingProgress";

export function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<CropList />} />
        <Route path="crops/:id" element={<CropDetail />} />
        <Route path="plantings" element={<MyPlantings />} />
        <Route path="plantings/:id" element={<PlantingProgress />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
}

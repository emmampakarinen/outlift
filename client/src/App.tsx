import { Route, Routes } from "react-router-dom";
import { AppLayout } from "./layouts/AppLayout";
import { HomePage } from "./pages/HomePage";
import { LibraryPage } from "./pages/LibraryPage";
import ProfilePage from "./pages/ProfilePage";
import { LocationPage } from "./pages/LocationPage";
import { WorkoutPage } from "./pages/WorkoutPage";
import { EditWorkoutPage } from "./pages/EditWorkoutPage";
import { AddExercisePage } from "./pages/AddExercisePage";
import { LocationsPage } from "./pages/LocationsPage";
//import { WorkoutsPage } from "./pages/WorkoutsPage";

export default function App() {
  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/locations" element={<LocationsPage />} />
        <Route path="/library" element={<LibraryPage />} />
        <Route path="/profile" element={<ProfilePage />} />
      </Route>
      <Route path="/locations/:locationId" element={<LocationPage />} />
      <Route path="/workouts/:workoutId" element={<WorkoutPage />} />
      <Route path="/workouts/:workoutId/edit" element={<EditWorkoutPage />} />
      <Route
        path="/workouts/:workoutId/edit/exercises"
        element={<AddExercisePage />}
      />
    </Routes>
  );
}

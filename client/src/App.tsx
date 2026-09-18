import { Route, Routes } from "react-router-dom";
import { AppLayout } from "./layouts/AppLayout";
import { HomePage } from "./pages/HomePage";
import { LibraryPage } from "./pages/LibraryPage";
import ProfilePage from "./pages/ProfilePage";
import { LocationPage } from "./pages/LocationPage";
import { WorkoutPage } from "./pages/WorkoutPage";
import { WorkoutFormPage } from "./pages/WorkoutFormPage";
import { AddExercisePage } from "./pages/AddExercisePage";
import { LocationsPage } from "./pages/LocationsPage";
import { LandingPage } from "./pages/LandingPage";
import { LoginPage } from "./pages/LoginPage";
import { RegisterPage } from "./pages/RegisterPage";
import { PrivateRoutes } from "./layouts/PrivateRoutes";
//import { WorkoutsPage } from "./pages/WorkoutsPage";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      <Route element={<PrivateRoutes />}>
        <Route element={<AppLayout />}>
          <Route path="/home" element={<HomePage />} />
          <Route path="/locations" element={<LocationsPage />} />
          <Route path="/library" element={<LibraryPage />} />
          <Route path="/profile" element={<ProfilePage />} />
        </Route>
        <Route path="/locations/:locationId" element={<LocationPage />} />
        <Route path="/workouts/:workoutId" element={<WorkoutPage />} />
        <Route path="/workouts/:workoutId/edit" element={<WorkoutFormPage />} />
        <Route
          path="/locations/:locationId/workouts/new"
          element={<WorkoutFormPage />}
        />
        <Route
          path="/workouts/:workoutId/edit/exercises"
          element={<AddExercisePage />}
        />
        <Route path="/workouts/new/exercises" element={<AddExercisePage />} />
      </Route>
    </Routes>
  );
}

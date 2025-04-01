import { Suspense, lazy } from 'react';
import { Routes, Route } from 'react-router-dom';

const Register = lazy(() => import('@/pages/Register'));
const Login = lazy(() => import('@/pages/Login'));
const Home = lazy(() => import('@/pages/Home'));
const Categories = lazy(() => import('../pages/Categories'));
const CategoryNotes = lazy(() => import('../pages/CategoryNotes'));
const Notes = lazy(() => import('../pages/Notes'));
const Note = lazy(() => import('../pages/Note'));
const CreateNote = lazy(() => import('../pages/CreateNote'));
const EditNote = lazy(() => import('../pages/EditNote'));

const AppRoutes = () => {
  return (
    <Suspense fallback={<div>加载中...</div>}>
      <Routes>
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<Home />} />
        <Route path="/categories" element={<Categories />} />
        <Route
          path="/notes/categories/:categoryId"
          element={<CategoryNotes />}
        />
        <Route path="/notes" element={<Notes />} />
        <Route path="/notes/:id" element={<Note />} />
        <Route path="/create-note" element={<CreateNote />} />
        <Route path="/notes/edit/:noteId" element={<EditNote />} />
      </Routes>
    </Suspense>
  );
};

export default AppRoutes;

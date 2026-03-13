import { BrowserRouter, Navigate, Route, Routes } from 'react-router'
import Layout from './components/layout/Layout'
import Categories from './pages/Categories'
import Commands from './pages/Commands'
import Dashboard from './pages/Dashboard'
import ItemOptions from './pages/ItemOptions'
import Items from './pages/Items'
import StateCommands from './pages/StateCommands'
import Tables from './pages/Tables'
import Users from './pages/Users'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/users" element={<Users />} />
          <Route path="/items" element={<Items />} />
          <Route path="/categories" element={<Categories />} />
          <Route path="/item-options" element={<ItemOptions />} />
          <Route path="/commands" element={<Commands />} />
          <Route path="/tables" element={<Tables />} />
          <Route path="/state-commands" element={<StateCommands />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

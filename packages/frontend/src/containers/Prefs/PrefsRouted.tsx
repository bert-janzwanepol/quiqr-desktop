import { Routes, Route } from 'react-router';
import PrefsGeneral from './PrefsGeneral';
import PrefsAdvanced from './PrefsAdvanced';
import PrefsApplicationStorage from './PrefsApplicationStorage';

export const PrefsRouted = () => {
  return (
    <Routes>
      <Route path="general" element={<PrefsGeneral />} />
      <Route path="advanced" element={<PrefsAdvanced />} />
      <Route path="storage" element={<PrefsApplicationStorage />} />
      <Route path="*" element={<PrefsGeneral />} />
    </Routes>
  );
};

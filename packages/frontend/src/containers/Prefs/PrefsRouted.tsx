import { Routes, Route } from 'react-router';
import PrefsGeneral from './PrefsGeneral';
import PrefsApplicationStorage from './PrefsApplicationStorage';
import PrefsGit from './PrefsGit';
import PrefsLogging from './PrefsLogging';

export const PrefsRouted = () => {
  return (
    <Routes>
      <Route path="general" element={<PrefsGeneral />} />
      <Route path="storage" element={<PrefsApplicationStorage />} />
      <Route path="git" element={<PrefsGit />} />
      <Route path="logging" element={<PrefsLogging />} />
      <Route path="*" element={<PrefsGeneral />} />
    </Routes>
  );
};

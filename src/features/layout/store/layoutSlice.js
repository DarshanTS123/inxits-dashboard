import { createSlice } from '@reduxjs/toolkit';
import { layoutPreferences } from '../../../utils/layoutPreferences';

const initialState = {
  isMobileSidebarOpen: false,
  isDesktopSidebarCollapsed: layoutPreferences.getDesktopSidebarCollapsed(),
};

const layoutSlice = createSlice({
  name: 'layout',
  initialState,
  reducers: {
    openMobileSidebar: (state) => {
      state.isMobileSidebarOpen = true;
    },
    closeMobileSidebar: (state) => {
      state.isMobileSidebarOpen = false;
    },
    toggleDesktopSidebarCollapsed: (state) => {
      state.isDesktopSidebarCollapsed = !state.isDesktopSidebarCollapsed;
    },
  },
});

export const {
  openMobileSidebar,
  closeMobileSidebar,
  toggleDesktopSidebarCollapsed,
} = layoutSlice.actions;

export const selectIsMobileSidebarOpen = (state) =>
  state.layout.isMobileSidebarOpen;

export const selectIsDesktopSidebarCollapsed = (state) =>
  state.layout.isDesktopSidebarCollapsed;

export default layoutSlice.reducer;

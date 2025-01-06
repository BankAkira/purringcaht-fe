import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { StoreDispatch, StoreGetState } from '.';

export type LightBoxFileItem = {
  src: string;
  name?: string;
};

export type LightBoxFileReducerState = {
  files: LightBoxFileItem[];
  fileIndex: number;
};

const initialState: LightBoxFileReducerState = {
  files: [],
  fileIndex: 0,
};

const lightBoxFileSlice = createSlice({
  name: 'lightBoxFile',
  initialState,
  reducers: {
    openLightBoxFile: (
      state,
      action: PayloadAction<{
        files: LightBoxFileItem[];
        fileIndex: number;
      }>
    ) => {
      state.files = action.payload.files;
      state.fileIndex = action.payload.fileIndex;
    },
    setFileIndex: (state, action: PayloadAction<number>) => {
      state.fileIndex = action.payload;
    },
    closeLightBox: state => {
      state.files = [];
      state.fileIndex = 0;
    },
  },
});

export const { openLightBoxFile, setFileIndex, closeLightBox } =
  lightBoxFileSlice.actions;

export const onMovePrevLightBoxFile =
  () => (dispatch: StoreDispatch, getState: StoreGetState) => {
    const { fileIndex, files } = getState().lightBoxFile;
    const index = (fileIndex + files.length - 1) % files.length;
    dispatch(setFileIndex(index));
  };

export const onMoveNextLightBoxFile =
  () => (dispatch: StoreDispatch, getState: StoreGetState) => {
    const { fileIndex, files } = getState().lightBoxFile;
    const index = (fileIndex + 1) % files.length;
    dispatch(setFileIndex(index));
  };

export default lightBoxFileSlice;

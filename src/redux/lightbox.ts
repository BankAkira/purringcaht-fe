import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { StoreDispatch, StoreGetState } from '.';

export type LightBoxReducerState = {
  images: string[];
  imageIndex: number;
};

const initialState: LightBoxReducerState = {
  images: [],
  imageIndex: 0,
};

const lightBoxSlice = createSlice({
  name: 'lightBox',
  initialState,
  reducers: {
    openLightBox: (
      state,
      action: PayloadAction<{
        images: string[];
        imageIndex: number;
      }>
    ) => {
      state.images = action.payload.images;
      state.imageIndex = action.payload.imageIndex;
    },
    setImageIndex: (state, action: PayloadAction<number>) => {
      state.imageIndex = action.payload;
    },
    updateImagesInLightBox: (state, action: PayloadAction<string[]>) => {
      state.images = action.payload;
    },
    closeLightBox: state => {
      state.images = [];
      state.imageIndex = 0;
    },
  },
});

export const {
  openLightBox,
  setImageIndex,
  updateImagesInLightBox,
  closeLightBox,
} = lightBoxSlice.actions;

export const onMovePrevLightBoxImage =
  () => (dispatch: StoreDispatch, getState: StoreGetState) => {
    const { imageIndex, images } = getState().lightBox;
    const index = (imageIndex + images.length - 1) % images.length;
    dispatch(setImageIndex(index));
  };

export const onMoveNextLightBoxImage =
  () => (dispatch: StoreDispatch, getState: StoreGetState) => {
    const { imageIndex, images } = getState().lightBox;
    const index = (imageIndex + 1) % images.length;
    dispatch(setImageIndex(index));
  };

export default lightBoxSlice;

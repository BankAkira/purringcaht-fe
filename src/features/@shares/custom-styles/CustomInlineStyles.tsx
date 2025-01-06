import { ContentBlock } from 'draft-js';

export const customInlineStyles = {
  BOLD: { element: 'strong' },
  ITALIC: { element: 'em' },
  UNDERLINE: { style: { textDecoration: 'underline' } },
  STRIKETHROUGH: { style: { textDecoration: 'line-through' } },
  'color-rgb(97,189,109)': { style: { color: 'rgb(97,189,109)' } },
  'color-rgb(26,188,156)': { style: { color: 'rgb(26,188,156)' } },
  'color-rgb(84,172,210)': { style: { color: 'rgb(84,172,210)' } },
  'color-rgb(44,130,201)': { style: { color: 'rgb(44,130,201)' } },
  'color-rgb(147,101,184)': { style: { color: 'rgb(147,101,184)' } },
  'color-rgb(71,85,119)': { style: { color: 'rgb(71,85,119)' } },
  'color-rgb(204,204,204)': { style: { color: 'rgb(204,204,204)' } },
  'color-rgb(65,168,95)': { style: { color: 'rgb(65,168,95)' } },
  'color-rgb(0,168,133)': { style: { color: 'rgb(0,168,133)' } },
  'color-rgb(61,142,185)': { style: { color: 'rgb(61,142,185)' } },
  'color-rgb(41,105,176)': { style: { color: 'rgb(41,105,176)' } },
  'color-rgb(85,57,130)': { style: { color: 'rgb(85,57,130)' } },
  'color-rgb(40,50,78)': { style: { color: 'rgb(40,50,78)' } },
  'color-rgb(0,0,0)': { style: { color: 'rgb(0,0,0)' } },
  'color-rgb(247,218,100)': { style: { color: 'rgb(247,218,100)' } },
  'color-rgb(251,160,38)': { style: { color: 'rgb(251,160,38)' } },
  'color-rgb(235,107,86)': { style: { color: 'rgb(235,107,86)' } },
  'color-rgb(226,80,65)': { style: { color: 'rgb(226,80,65)' } },
  'color-rgb(163,143,132)': { style: { color: 'rgb(163,143,132)' } },
  'color-rgb(239,239,239)': { style: { color: 'rgb(239,239,239)' } },
  'color-rgb(255,255,255)': { style: { color: 'rgb(255,255,255)' } },
  'bgcolor-rgb(97,189,109)': { style: { backgroundColor: 'rgb(97,189,109)' } },
  'bgcolor-rgb(26,188,156)': { style: { backgroundColor: 'rgb(26,188,156)' } },
  'bgcolor-rgb(84,172,210)': { style: { backgroundColor: 'rgb(84,172,210)' } },
  'bgcolor-rgb(44,130,201)': { style: { backgroundColor: 'rgb(44,130,201)' } },
  'bgcolor-rgb(147,101,184)': {
    style: { backgroundColor: 'rgb(147,101,184)' },
  },
  'bgcolor-rgb(71,85,119)': { style: { backgroundColor: 'rgb(71,85,119)' } },
  'bgcolor-rgb(204,204,204)': {
    style: { backgroundColor: 'rgb(204,204,204)' },
  },
  'bgcolor-rgb(65,168,95)': { style: { backgroundColor: 'rgb(65,168,95)' } },
  'bgcolor-rgb(0,168,133)': { style: { backgroundColor: 'rgb(0,168,133)' } },
  'bgcolor-rgb(61,142,185)': { style: { backgroundColor: 'rgb(61,142,185)' } },
  'bgcolor-rgb(41,105,176)': { style: { backgroundColor: 'rgb(41,105,176)' } },
  'bgcolor-rgb(85,57,130)': { style: { backgroundColor: 'rgb(85,57,130)' } },
  'bgcolor-rgb(40,50,78)': { style: { backgroundColor: 'rgb(40,50,78)' } },
  'bgcolor-rgb(0,0,0)': { style: { backgroundColor: 'rgb(0,0,0)' } },
  'bgcolor-rgb(247,218,100)': {
    style: { backgroundColor: 'rgb(247,218,100)' },
  },
  'bgcolor-rgb(251,160,38)': { style: { backgroundColor: 'rgb(251,160,38)' } },
  'bgcolor-rgb(235,107,86)': { style: { backgroundColor: 'rgb(235,107,86)' } },
  'bgcolor-rgb(226,80,65)': { style: { backgroundColor: 'rgb(226,80,65)' } },
  'bgcolor-rgb(163,143,132)': {
    style: { backgroundColor: 'rgb(163,143,132)' },
  },
  'bgcolor-rgb(239,239,239)': {
    style: { backgroundColor: 'rgb(239,239,239)' },
  },
  'bgcolor-rgb(255,255,255)': {
    style: { backgroundColor: 'rgb(255,255,255)' },
  },
  'bgcolor-rgb(250,197,28)': { style: { backgroundColor: 'rgb(250,197,28)' } },
  'bgcolor-rgb(243,121,52)': { style: { backgroundColor: 'rgb(243,121,52)' } },
  'bgcolor-rgb(209,72,65)': { style: { backgroundColor: 'rgb(209,72,65)' } },
  'bgcolor-rgb(184,49,47)': { style: { backgroundColor: 'rgb(184,49,47)' } },
  'bgcolor-rgb(124,112,107)': {
    style: { backgroundColor: 'rgb(124,112,107)' },
  },
  'bgcolor-rgb(209,213,216)': {
    style: { backgroundColor: 'rgb(209,213,216)' },
  },
};

export const blockStyleFn = (block: ContentBlock) => {
  const type = block.getType();
  if (type === 'unstyled') {
    return {
      element: 'div',
      style: {},
    };
  }
  return undefined;
};

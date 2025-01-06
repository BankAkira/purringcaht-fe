import CatDefault from '/src/asset/icon/cat-levels/cat-green.png';
import CatGreen from '/src/asset/icon/cat-levels/cat-green.png';
import CatBlue from '/src/asset/icon/cat-levels/cat-blue.png';
import CatYellow from '/src/asset/icon/cat-levels/cat-yellow.png';
import CatBack from '/src/asset/icon/cat-levels/cat-back.png';
import CatRed from '/src/asset/icon/cat-levels/cat-red.png';

export const defaultIconCatLevels = [
  { no: '0', name: 'cat-default', image: CatDefault },
  { no: '1', name: 'cat-green', image: CatGreen },
  { no: '2', name: 'cat-blue', image: CatBlue },
  { no: '3', name: 'cat-yellow', image: CatYellow },
  { no: '4', name: 'cat-back', image: CatBack },
  { no: '5', name: 'cat-red', image: CatRed },
];

export function getIconByCatType(catType: string) {
  const icon = defaultIconCatLevels.find(icon => icon.name === catType);
  return icon ? icon.image : CatDefault;
}

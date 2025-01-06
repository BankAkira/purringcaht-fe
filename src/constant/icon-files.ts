import mime from 'mime';
import imageDefault from '/src/asset/icon/files/file.png';
import image3ds from '/src/asset/icon/files/3ds.png';
import imageAac from '/src/asset/icon/files/aac.png';
import imageAi from '/src/asset/icon/files/ai.png';
import imageAvi from '/src/asset/icon/files/avi.png';
import imageBmp from '/src/asset/icon/files/bmp.png';
import imageCad from '/src/asset/icon/files/cad.png';
import imageCdr from '/src/asset/icon/files/cdr.png';
import imageCss from '/src/asset/icon/files/css.png';
import imageDat from '/src/asset/icon/files/dat.png';
import imageDll from '/src/asset/icon/files/dll.png';
import imageDmg from '/src/asset/icon/files/dmg.png';
import imageDoc from '/src/asset/icon/files/doc.png';
import imageEps from '/src/asset/icon/files/eps.png';
import imageFla from '/src/asset/icon/files/fla.png';
import imageFlv from '/src/asset/icon/files/flv.png';
import imageGif from '/src/asset/icon/files/gif.png';
import imageHtml from '/src/asset/icon/files/html.png';
import imageIndd from '/src/asset/icon/files/indd.png';
import imageIso from '/src/asset/icon/files/iso.png';
import imageJpg from '/src/asset/icon/files/jpg.png';
import imageJs from '/src/asset/icon/files/js.png';
import imageMidi from '/src/asset/icon/files/midi.png';
import imageMov from '/src/asset/icon/files/mov.png';
import imageMp3 from '/src/asset/icon/files/mp3.png';
import imageMpg from '/src/asset/icon/files/mpg.png';
import imagePdf from '/src/asset/icon/files/pdf.png';
import imagePhp from '/src/asset/icon/files/php.png';
import imagePng from '/src/asset/icon/files/png.png';
import imagePpt from '/src/asset/icon/files/ppt.png';
import imagePs from '/src/asset/icon/files/ps.png';
import imagePsd from '/src/asset/icon/files/psd.png';
import imageRaw from '/src/asset/icon/files/raw.png';
import imageSql from '/src/asset/icon/files/sql.png';
import imageSvg from '/src/asset/icon/files/svg.png';
import imageTif from '/src/asset/icon/files/tif.png';
import imageTxt from '/src/asset/icon/files/txt.png';
import imageWmv from '/src/asset/icon/files/wmv.png';
import imageXls from '/src/asset/icon/files/xls.png';
import imageXlsx from '/src/asset/icon/files/xlsx.png';
import imageXml from '/src/asset/icon/files/xml.png';
import imageZip from '/src/asset/icon/files/zip.png';

export const defaultIconFiles = [
  { name: '3ds', image: image3ds },
  { name: 'aac', image: imageAac },
  { name: 'ai', image: imageAi },
  { name: 'avi', image: imageAvi },
  { name: 'bmp', image: imageBmp },
  { name: 'cad', image: imageCad },
  { name: 'cdr', image: imageCdr },
  { name: 'css', image: imageCss },
  { name: 'dat', image: imageDat },
  { name: 'dll', image: imageDll },
  { name: 'dmg', image: imageDmg },
  { name: 'doc', image: imageDoc },
  { name: 'eps', image: imageEps },
  { name: 'file', image: imageDefault },
  { name: 'fla', image: imageFla },
  { name: 'flv', image: imageFlv },
  { name: 'gif', image: imageGif },
  { name: 'html', image: imageHtml },
  { name: 'indd', image: imageIndd },
  { name: 'iso', image: imageIso },
  { name: 'jpg', image: imageJpg },
  { name: 'js', image: imageJs },
  { name: 'midi', image: imageMidi },
  { name: 'mov', image: imageMov },
  { name: 'mp3', image: imageMp3 },
  { name: 'mpg', image: imageMpg },
  { name: 'pdf', image: imagePdf },
  { name: 'php', image: imagePhp },
  { name: 'png', image: imagePng },
  { name: 'ppt', image: imagePpt },
  { name: 'ps', image: imagePs },
  { name: 'psd', image: imagePsd },
  { name: 'raw', image: imageRaw },
  { name: 'sql', image: imageSql },
  { name: 'svg', image: imageSvg },
  { name: 'tif', image: imageTif },
  { name: 'txt', image: imageTxt },
  { name: 'wmv', image: imageWmv },
  { name: 'xls', image: imageXls },
  { name: 'xlsx', image: imageXlsx },
  { name: 'xml', image: imageXml },
  { name: 'zip', image: imageZip },
];

export function getIconByFileType(fileType: string) {
  const extension = mime.extension(fileType);
  const icon = defaultIconFiles.find(icon => icon.name === extension);
  return icon ? icon.image : imageDefault;
}

export function getIconByFileTypes(fileType: string) {
  const icon = defaultIconFiles.find(icon => icon.name === fileType);
  return icon ? icon.image : imageDefault;
}

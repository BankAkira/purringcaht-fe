import './logo.css';

interface LogoProps {
  /**
   * ที่อยู่รูปภาพ
   */
  src: string;
  alt?: string;
  width?: number;
  height?: number;
}

/**
 * Primary UI component for user interaction
 */
export default function Logo({
  src,
  alt,
  width = 100,
  height = 100,
  ...props
}: LogoProps) {
  return (
    <>
      <img src={src} alt={alt} width={width} height={height} {...props} />
    </>
  );
}

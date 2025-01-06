import { ReactNode } from 'react';
import './landing.css';

interface LandingProps {
  title: string;
  subTitle: string;
  hint?: string;
  /**
   * ที่อยู่รูปภาพ
   */
  src?: string;
  alt?: string;
  width?: number;
  height?: number;
  titleClass?: string;
  subTitleClass?: string;
  button?: ReactNode | string;
}

/**
 * Primary UI component for user interaction
 */
export default function Landing({
  title,
  subTitle,
  hint,
  src,
  alt,
  width = 100,
  height = 100,
  button,
  titleClass = 'text-gradient md:text-3xl',
  subTitleClass = 'text-gradient',
  ...props
}: LandingProps) {
  return (
    <div>
      {src && (
        <img
          className="mx-auto mb-3"
          src={src}
          alt={alt}
          width={width}
          height={height}
          {...props}
        />
      )}
      <div className="text-center flex flex-col gap-1">
        <h3 className={'text-lg font-semibold px-4 ' + titleClass}>{title}</h3>
        <p
          className={'text-sm md:text-base font-normal  px-4 ' + subTitleClass}>
          {subTitle}
        </p>
        <p
          className={'text-xs md:text-sm text-[#6B7280] font-normal mt-2 px-4'}>
          {hint}
        </p>
        <div className="px-6">{button}</div>
      </div>
    </div>
  );
}

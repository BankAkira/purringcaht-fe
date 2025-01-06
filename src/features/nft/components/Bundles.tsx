import './style.css';
import useResponsive from '../../../helper/hook/useResponsive';

export default function Bundles() {
  const { isTabletOrMobile } = useResponsive();

  return (
    <section className="w-full h-full flex flex-col items-center justify-center overflow-y-auto">
      <div
        className={`${isTabletOrMobile ? 'w-full' : 'w-[880px] py-12 px-16'}  flex flex-col items-center gap-2`}>
        <div
          className={`${isTabletOrMobile ? 'w-full max-w-[350px]' : 'w-[350px]'}  flex flex-col`}>
          <p className="w-fit font-inter font-bold text-[26px]">
            Save more with
          </p>
          <h1 className="w-fit font-inter font-bold text-[54px]">
            Bigger
            <br />
            Bundles!
          </h1>
        </div>
        <button
          type="button"
          className={`${isTabletOrMobile ? 'w-[80%] max-w-[355px]' : 'w-[355px]'} ml-10 py-2 text-white font-inter font-bold rounded-full`}
          style={{
            backgroundImage:
              'linear-gradient(130deg, #FD4077 -2.26%, #FE7601 96.97%)',
          }}>
          <a href="https://opensea.io/" target="_blank">
            Sign in to Get
          </a>
        </button>
      </div>
    </section>
  );
}

import MainSection from '../../features/nft/sections/MainSection';
import TabSection from '../../features/nft/sections/TabSection';
import useResponsive from '../../helper/hook/useResponsive';

export default function Nft() {
  const { isTabletOrMobile } = useResponsive();

  return (
    <main
      className={`w-full px-5 py-8 bg-white flex ${isTabletOrMobile ? 'flex-col' : ''} min-h-screen`}
      style={{
        backgroundImage:
          'linear-gradient(321deg, #FFECF1 18.96%, #FFF1E6 43.45%, #FFF 74.63%)',
      }}>
      <TabSection />
      <MainSection />
    </main>
  );
}

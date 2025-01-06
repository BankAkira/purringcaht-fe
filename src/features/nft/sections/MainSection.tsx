import useResponsive from '../../../helper/hook/useResponsive';
// import Gacha from '../components/Gacha';
import { useSelector } from 'react-redux';
import { RootState } from '../../../redux';
import MyNfts from '../components/MyNfts';
// import Shop from '../components/Shop';
// import Utilizing from '../components/Utilizing';

export default function MainSection() {
  const { tabClick } = useSelector((state: RootState) => state.nft);
  const { isTabletOrMobile } = useResponsive();

  return (
    <>
      <section
        className={`w-full ${isTabletOrMobile && 'mb-20'} min-h-[90vh] bg-white relative`}>
        {/* {tabClick === 'Gacha' && <Gacha />}
        {tabClick === 'Shop' && <Shop />} */}
        {tabClick === 'My NFTs' && <MyNfts />}
        {/* {tabClick === 'NFTs Utilizing' && <Utilizing />} */}
      </section>
    </>
  );
}

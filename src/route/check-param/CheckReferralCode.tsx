import { PropsWithChildren } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useDeepEffect } from '../../helper/hook/useDeepEffect';
// import { useDispatch } from 'react-redux';
// import { setReferralCode } from '../../redux/referral';
import { setRefCode } from '../../helper/local-storage';

export default function CheckReferralCode({ children }: PropsWithChildren) {
  // const dispatch = useDispatch();

  const location = useLocation();
  const navigate = useNavigate();

  useDeepEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const refParam = searchParams.get('refcode');
    // if (refParam) dispatch(setReferralCode(refParam));
    if (refParam) setRefCode(refParam);
  }, [location, navigate]);

  return children;
}

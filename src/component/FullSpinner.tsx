import { Spinner } from 'flowbite-react';

type props = {
  height?: string;
};
export default function FullSpinner({ height }: props) {
  return (
    <div
      className={
        (height ? ' ' : '!min-h-[100vh]') + ' flex items-center justify-center'
      }
      style={{ minHeight: `${height || '-'}vh` }}>
      <Spinner />
    </div>
  );
}

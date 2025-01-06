import { HiOutlineClipboardCopy } from 'react-icons/hi';
import './address.css';
import CopyToClipboard from 'react-copy-to-clipboard';

interface AddressProps {
  text: string;
  onCopy?: () => void;
}

/**
 * Primary UI component for user interaction
 */
export default function Address({ text, onCopy, ...props }: AddressProps) {
  return (
    <>
      <CopyToClipboard text={text} onCopy={onCopy} {...props}>
        {/* <TextWithLogo text={text} /> */}
        <span className="flex flex-wrap gap-2">
          {text} <HiOutlineClipboardCopy />
        </span>
      </CopyToClipboard>
    </>
  );
}

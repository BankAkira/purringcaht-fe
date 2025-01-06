import { PropsWithChildren, ReactNode } from 'react';
import './modal.css';
import { Modal as FlowbiteModal } from 'flowbite-react';

type Props = {
  isOpen: boolean;
  onClose: () => void;
  /**
   * enable the modal to be dismissed when clicking outside of the component
   */
  dismissible?: boolean;
  header?: ReactNode | string;
  footer?: ReactNode | string;
};

export default function Modal({
  isOpen,
  onClose,
  dismissible,
  header,
  footer,
  children,
}: PropsWithChildren<Props>) {
  const { Header, Body, Footer } = FlowbiteModal;

  return (
    <FlowbiteModal dismissible={dismissible} show={isOpen} onClose={onClose}>
      {header && <Header>{header}</Header>}
      <Body>{children}</Body>
      {footer && <Footer>{footer}</Footer>}
    </FlowbiteModal>
  );
}

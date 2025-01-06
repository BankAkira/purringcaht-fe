import { useNavigate } from 'react-router-dom';
import SearchPopover from '../../section/chat/@share/SearchPopover';
import { GlobalSearchType } from '../../type/chat';
import { ContactPayload } from '../../type/contact';
import { ComponentProps } from 'react';
import TabWrapper from '../../component/TabWrapper';
import PluginsTable from '../../component/plugins/PluginsTable';
import { Logger } from '../../helper/logger';
import IconButton from '../../component/icon-button/IconButton';
import { IoInformationCircle } from 'react-icons/io5';
import { Tooltip } from 'flowbite-react';
import useResponsive from '../../helper/hook/useResponsive';

const log = new Logger('Plugin');

export default function Plugin() {
  const { isTabletOrMobile } = useResponsive();
  const navigate = useNavigate();
  const onClickContact = (contactId: string) => {
    navigate(`/chat/${contactId}`);
  };

  return (
    <div
      className={
        (isTabletOrMobile ? 'h-[calc(100vh-60px)]' : 'h-screen') +
        ' py-6 flex flex-col gap-4 overflow-auto bg-white'
      }>
      <div className="flex items-center gap-2 select-none">
        <div className="text-2xl font-bold text-gray-900 flex items-center gap-2 ps-4 max-lg:text-xl">
          Plugins{' '}
        </div>
        {
          <Tooltip
            content="Enable/disable plugins to customize your experience"
            placement="right">
            <IconButton
              color="#9CA3AF"
              height={18}
              icon={IoInformationCircle}
              onClick={() => {}}
              width={18}
            />
          </Tooltip>
        }{' '}
      </div>
      <span className="text-base font-normal text-gray-500 px-4 max-lg:text-sm">
        Flowbite is a cutting-edge AI chat companion designed to streamline your
        conversational experience. With a intuitive and modern interface
        Flowbite, effortlessly engages in dynamic and natural conversations.
      </span>
      <div className="h-[50px] px-4">
        <SearchPopover<ContactPayload>
          searchType={GlobalSearchType.CONTACT}
          content={(searchResult, handleCloseSearch) => (
            <>
              <div className="flex flex-col items-start">
                {[...searchResult].map((result, i) => (
                  <ContactTab
                    key={result.id + i}
                    active={true}
                    onClick={() => {
                      onClickContact(result.id);
                      handleCloseSearch();
                    }}
                    size="sm"
                    contact={result}
                  />
                ))}
              </div>
            </>
          )}
        />
      </div>

      <div className="flex flex-col gap-4 border-b px-4 pb-2">
        <span className="text-base font-normal text-gray-500">Recents</span>
        <PluginsTable />
      </div>

      <div className="flex flex-col gap-4 border-b px-4 pb-2">
        <span className="text-base font-normal text-gray-500">Suggest</span>
        <PluginsTable />
      </div>
    </div>
  );
}

function ContactTab(
  props: { contact: ContactPayload } & ComponentProps<typeof TabWrapper>
) {
  const { contact, ...rest } = props;
  log.debug(contact);
  return <TabWrapper {...rest}>test</TabWrapper>;
}

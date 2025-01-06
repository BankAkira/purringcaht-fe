import emptyMediaImage from '../../../asset/images/empty-img/empty-media.svg';

export default function NoData({ text = '' }) {
  return (
    <>
      <div className="flex items-center justify-center h-[250px]">
        <div className="media-thumbnail-container small">
          <div className="flex flex-col items-center justify-center w-full gap-2 text-center overflow-indicator">
            <img src={emptyMediaImage} width={60} alt="empty media" />
            <span className="text-sm font-normal text-gray-500">No data.</span>
            <span className="text-[11px] font-light text-gray-400 max-w-[250px]">
              There's nothing in {text} yet.
            </span>
          </div>
        </div>
      </div>
    </>
  );
}

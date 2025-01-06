// icons
import { HiSearch } from 'react-icons/hi';

// component
import TextInput from '../../../component/text-input/TextInput.tsx';

export default function Search() {
  const handleSubmit = () => {};

  return (
    <div>
      <TextInput
        icon={HiSearch}
        id="search"
        name="search"
        type="search"
        placeholder="Search"
        value=""
        onChange={handleSubmit}
        autoComplete="off"
      />
    </div>
  );
}

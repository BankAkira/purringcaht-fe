// icons
import { FiSearch } from 'react-icons/fi';

// components
import TextInput from '../../component/text-input/TextInput';

export default function InputSearch() {
  const handleSubmit = () => {};

  return (
    <div>
      <TextInput
        icon={FiSearch}
        id="search"
        name="search"
        type="search"
        placeholder="Search..."
        value=""
        onChange={handleSubmit}
        autoComplete="off"
      />
    </div>
  );
}

import { useEffect, useState } from 'react';
import { getIconPath } from '../helpers/getIconPath';

type Item = {
  name: string;
  type: FileType;
  files?: Item[];
  added: string;
};

type FileType = 'folder' | 'pdf' | 'doc' | 'mov';

interface DashboardProps {
  header: string;
  data: Item[];
}

const Dashboard = ({ header, data }: DashboardProps) => {
  const [filteredItems, setFilteredItems] = useState(data);
  const [folder, setFolder] = useState<string>('');
  const [search, setSearch] = useState<string>('');
  const [sortBy, setSortBy] = useState<string>('added');

  useEffect(() => {
    setSearch('');
    setSortBy('added');
  }, [folder]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target.value.toLowerCase();
    let results;

    if (input) {
      results = (folder ? filteredItems : data).filter((item: any) => item.name.toLowerCase().includes(input));
    } else if (folder) {
      const folderData = data.find((item: any) => item.name === folder);
      results = folderData ? folderData.files : [];
    } else {
      results = data;
    }

    setSearch(input);
    setFilteredItems(results as Item[]);
  };

  const renderContent = (items: Item[]) => (
    <ul className="flex">
      {items
        .sort((a: Item, b: Item) => {
          const itemOneKey = a[sortBy as keyof Item];
          const itemTwoKey = b[sortBy as keyof Item];
          if (!itemOneKey || !itemTwoKey) return !itemOneKey ? 1 : -1;
          return itemOneKey > itemTwoKey ? 1 : itemOneKey < itemTwoKey ? -1 : 0;
        })
        .map(item => (
          <li
            key={item.name}
            className={`flex flex-col min-w-[90px] [&:not(:last-child)]:mr-10 items-center ${
              item.type === 'folder' ? 'cursor-pointer' : ''
            }`}
            onClick={() => {
              if (item.type === 'folder') {
                setFolder(item.name);
                setFilteredItems(item.files ?? []);
              }
            }}
          >
            <img className="mb-3" src={getIconPath(item.type)} alt={item.name} width={32} />
            <p>{item.name}</p>
            {item.type !== 'folder' && <span className="text-sm mt-2">Type: {item.type}</span>}
            {item.added && <span className="text-sm">Added: {item.added?.split('-').reverse().join('-')}</span>}
          </li>
        ))}
    </ul>
  );

  return (
    <section className="mt-5 border-[#3DB0F7] border-2 rounded-lg min-h-[500px]">
      <header className="bg-[#EBF8FF] flex items-center p-5 rounded-lg">
        <h1 className="text-2xl capitalize mr-auto">{header}</h1>
        <input
          className="p-2 mr-3 min-w-[250px]"
          type="text"
          placeholder="Search..."
          onChange={handleSearch}
          value={search}
        />
        <label htmlFor="sort" className="mr-2">
          Sort by:
        </label>
        <select id="sort" className="p-2 min-w-[100px]" onChange={e => setSortBy(e.target.value)} value={sortBy}>
          <option value="added">Date</option>
          <option value="name">Name</option>
          <option value="type">Type</option>
        </select>
      </header>
      <section className="p-5">
        {filteredItems?.length ? renderContent(filteredItems) : <p>No results found...</p>}
        {folder && (
          <button
            className="bg-[#3DB0F7] text-white font-bold p-2 rounded-md block mt-8 hover:bg-[#EBF8FF] hover:text-black transition ease-in-out"
            type="button"
            onClick={() => {
              setFolder('');
              setFilteredItems(data);
            }}
          >
            Go Back
          </button>
        )}
      </section>
    </section>
  );
};

export default Dashboard;

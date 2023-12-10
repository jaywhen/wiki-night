import { useStorage } from '@plasmohq/storage/hook';
import themes from './themes/conf.json';
import './style.css';
import { useEffect, useState } from 'react';
import type { ITheme } from './types';
import { urlReg } from './utils';

function IndexPopup() {
  const [isWiki, setIsWiki] = useState(false);
  const [isUse, setIsUse] = useStorage<boolean>('isUse', false);
  const [selectedTheme, setSelectedTheme] = useStorage<string>(
    'selectedTheme',
    themes.length ? themes[0].name : ''
  );

  useEffect(() => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      const activeUrl = tabs[0]?.url ?? '';
      setIsWiki(urlReg.test(activeUrl));
    });
  });

  const onToggleChange = () => {
    const curUse = !isUse;
    setIsUse(curUse);

    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      const activeTab = tabs[0];
      chrome.tabs.sendMessage(activeTab.id, {
        isUse: curUse,
        selectedTheme
      });
    });
  };

  const handleSelect = (select: string) => {
    setSelectedTheme(select);

    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      const activeTab = tabs[0];
      chrome.tabs.sendMessage(activeTab.id, {
        isUse,
        selectedTheme: select
      });
    });
  };

  return isWiki ? (
    <div className="w-40 max-h-56 overflow-auto flex flex-col gap-2 p-2 box-border">
      {/* togg if open */}
      <div className="flex items-center h-7 w-full justify-between">
        <span className="text-sm font-medium select-none text-gray-900">
          Night Mode
        </span>
        <label className="relative inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            checked={isUse}
            onChange={onToggleChange}
            className="sr-only peer"></input>
          <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-blue-600"></div>
        </label>
      </div>

      {/* themes radio */}
      <ul className="flex-1 overflow-auto flex flex-col gap-2">
        {themes.length ? (
          themes.map((theme: ITheme, index: number) => (
            <li
              key={index}
              onClick={() => handleSelect(theme.name)}
              className="w-full border border-gray-200 rounded-md h-10 flex items-center px-1 hover:cursor-pointer">
              <div className="flex items-center w-full">
                <input
                  type="radio"
                  value={theme.name}
                  checked={selectedTheme === theme.name}
                  onChange={() => handleSelect(theme.name)}
                  disabled={!isUse}
                  className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300"
                />
                <label
                  htmlFor="list-radio-license"
                  title={theme.name}
                  className=" truncate w-full py-3 ms-2 text-sm font-medium text-gray-900">
                  {theme.name}
                </label>
              </div>
            </li>
          ))
        ) : (
          <div>no data</div>
        )}
      </ul>
    </div>
  ) : (
    <div className="w-40 h-18 overflow-auto justify-center items-center flex p-1 box-border">
      <div className="text-center">
        <span className="showText text-gray-800">
          Hey! We only sopport wikipedia pages!
        </span>
        <span className="popEmoji">&nbsp;🤠</span>
      </div>
    </div>
  );
}

export default IndexPopup;

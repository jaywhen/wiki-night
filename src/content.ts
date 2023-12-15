import type { PlasmoCSConfig } from 'plasmo';
import { Storage } from '@plasmohq/storage';
import themes from './themes/conf.json';
import type { IMessage, ITheme } from './types';
import { getThemeData, urlReg } from './utils';

const storage = new Storage();
const STYLE_TAG_ID = 'wiki-night-style';

export const config: PlasmoCSConfig = {
  run_at: 'document_start',
  matches: ['https://*.wikipedia.org/*']
};

document.addEventListener('DOMContentLoaded', () => {
  init();
});

const init = async () => {
  const url = window.location.href;
  const { isUse, selectedTheme } = await storage.getAll();

  if (urlReg.test(url) && isUse === 'true') {
    if (selectedTheme) {
      const themeData = getThemeData(themes, selectedTheme);

      if (themeData) {
        useTheme(themeData);
      }
    }
  }
};

chrome.runtime.onMessage.addListener(
  (request: IMessage, sender, sendResponse) => {
    if (request.isUse) {
      const themeData = getThemeData(themes, request.selectedTheme);

      if (themeData) {
        useTheme(themeData);
      }
    } else {
      removeNightStyle();
    }
  }
);

const removeNightStyle = () => {
  const styleNode = document.querySelector(`#${STYLE_TAG_ID}`);
  if (styleNode) {
    styleNode.parentNode.removeChild(styleNode);
  }
};

const useTheme = (theme: ITheme) => {
  removeNightStyle();

  const styleTag = document.createElement('style');
  styleTag.id = STYLE_TAG_ID;

  // TODO add css comments
  const styles = `
      .vector-feature-zebra-design-enabled body {
        background-color: ${theme.contentBG};
        color: ${theme.text};
      }

      .vector-feature-zebra-design-enabled .vector-pinned-container {
        background-color: ${theme.contentsBG};
      }

      .vector-feature-zebra-design-enabled #vector-toc-pinned-container .vector-toc::after {
        background: inherit;
      }

      .vector-feature-zebra-design-enabled .vector-sticky-pinned-container::after {
        background: inherit;
      }

      .vector-feature-zebra-design-enabled .mw-page-container {
        background-color: ${theme.contentBG};
      }

      .vector-feature-zebra-design-enabled .vector-header-container .mw-header, .vector-feature-zebra-design-enabled .vector-header-container .vector-sticky-header {
        background-color: ${theme.contentBG};
      }

      .vector-feature-zebra-design-enabled .vector-pinnable-header-label {
        filter: invert(1);
      }

      .vector-feature-zebra-design-enabled .vector-toc .vector-toc-list-item-active > .vector-toc-link, .vector-feature-zebra-design-enabled .vector-toc .vector-toc-level-1-active:not(.vector-toc-list-item-expanded) > .vector-toc-link, .vector-feature-zebra-design-disabled .vector-toc .vector-toc-list-item-active.vector-toc-level-1-active > .vector-toc-link {
        color: ${theme.text};
      }

      .vector-menu-tabs .mw-list-item.selected a, .vector-menu-tabs .mw-list-item.selected a:visited {
        color: ${theme.hTitle};
      }

      .vector-dropdown-label-text {
        color: ${theme.hTitle};
      }

      .vector-feature-zebra-design-enabled .vector-dropdown .vector-dropdown-label:not(.cdx-button--icon-only)::after {
        filter: invert(1);
      }

      h1, h2, h3, h4, h5, h6 {
        color: ${theme.hTitle};
      }

      /* toc link */
      .vector-feature-zebra-design-enabled .vector-toc .vector-toc-list-item-active > .vector-toc-link, .vector-feature-zebra-design-enabled .vector-toc .vector-toc-level-1-active:not(.vector-toc-list-item-expanded) > .vector-toc-link, .vector-feature-zebra-design-enabled .vector-toc .vector-toc-list-item-active.vector-toc-level-1-active > .vector-toc-link {
        color: ${theme.hTitle};
      }
    `;

  styleTag.appendChild(document.createTextNode(styles));

  document.head.appendChild(styleTag);
};

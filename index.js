async function findDuplicates() {
  const tabs = await chrome.tabs.query({});
  const urlMap = new Map();
  
  tabs.forEach(tab => {
    const url = tab.url;
    if (!urlMap.has(url)) {
      urlMap.set(url, []);
    }
    urlMap.get(url).push(tab);
  });
  
  const duplicates = new Map();
  urlMap.forEach((tabList, url) => {
    if (tabList.length > 1) {
      duplicates.set(url, tabList);
    }
  });
  
  return duplicates;
}

async function displayDuplicates() {
  const duplicates = await findDuplicates();
  const tabsList = document.getElementById('tabsList');
  const noDuplicates = document.getElementById('noDuplicates');
  const duplicatesCount = document.getElementById('duplicatesCount');
  const closeAllBtn = document.getElementById('closeAllBtn');
  
  tabsList.innerHTML = '';
  
  let totalDuplicates = 0;
  duplicates.forEach(tabList => {
    totalDuplicates += tabList.length - 1;
  });
  
  duplicatesCount.textContent = totalDuplicates;
  
  if (duplicates.size === 0) {
    tabsList.style.display = 'none';
    noDuplicates.style.display = 'block';
    closeAllBtn.disabled = true;
    return;
  }
  
  tabsList.style.display = 'block';
  noDuplicates.style.display = 'none';
  closeAllBtn.disabled = false;
  
  duplicates.forEach((tabList, url) => {
    const groupDiv = document.createElement('div');
    groupDiv.className = 'tab-group';
    
    const headerDiv = document.createElement('div');
    headerDiv.className = 'tab-group-header';
    
    const favicon = document.createElement('img');
    favicon.className = 'favicon';
    favicon.src = tabList[0].favIconUrl || 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16"><rect width="16" height="16" fill="%23dadce0"/></svg>';
    favicon.onerror = () => {
      favicon.src = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16"><rect width="16" height="16" fill="%23dadce0"/></svg>';
    };
    
    const headerText = document.createElement('span');
    headerText.textContent = `${tabList.length} copies`;
    
    headerDiv.appendChild(favicon);
    headerDiv.appendChild(headerText);
    groupDiv.appendChild(headerDiv);
    
    tabList.slice(1).forEach(tab => {
      const tabItem = createTabItem(tab);
      groupDiv.appendChild(tabItem);
    });
    
    tabsList.appendChild(groupDiv);
  });
}

function createTabItem(tab) {
  const tabDiv = document.createElement('div');
  tabDiv.className = 'tab-item';
  
  const favicon = document.createElement('img');
  favicon.className = 'favicon';
  favicon.src = tab.favIconUrl || 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16"><rect width="16" height="16" fill="%23dadce0"/></svg>';
  favicon.onerror = () => {
    favicon.src = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16"><rect width="16" height="16" fill="%23dadce0"/></svg>';
  };
  
  const infoDiv = document.createElement('div');
  infoDiv.className = 'tab-info';
  
  const titleDiv = document.createElement('div');
  titleDiv.className = 'tab-title';
  titleDiv.textContent = tab.title || 'Untitled';
  
  const urlDiv = document.createElement('div');
  urlDiv.className = 'tab-url';
  urlDiv.textContent = tab.url;
  
  infoDiv.appendChild(titleDiv);
  infoDiv.appendChild(urlDiv);
  
  const closeBtn = document.createElement('button');
  closeBtn.className = 'close-btn';
  closeBtn.textContent = '×';
  closeBtn.title = 'Close tab';
  closeBtn.addEventListener('click', async () => {
    await chrome.tabs.remove(tab.id);
    displayDuplicates();
  });
  
  tabDiv.appendChild(favicon);
  tabDiv.appendChild(infoDiv);
  tabDiv.appendChild(closeBtn);
  
  return tabDiv;
}

async function closeAllDuplicates() {
  const duplicates = await findDuplicates();
  const tabsToClose = [];
  
  duplicates.forEach(tabList => {
    tabList.slice(1).forEach(tab => {
      tabsToClose.push(tab.id);
    });
  });
  
  if (tabsToClose.length > 0) {
    await chrome.tabs.remove(tabsToClose);
    displayDuplicates();
  }
}

document.addEventListener('DOMContentLoaded', () => {
  displayDuplicates();
  
  document.getElementById('closeAllBtn').addEventListener('click', closeAllDuplicates);
  document.getElementById('refreshBtn').addEventListener('click', displayDuplicates);
});
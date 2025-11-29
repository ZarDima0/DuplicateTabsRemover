function getDomain(url) {
  try {
    const urlObj = new URL(url);
    return urlObj.hostname;
  } catch (e) {
    return url;
  }
}

async function findDuplicatesByDomain() {
  const tabs = await chrome.tabs.query({});
  const domainMap = new Map();
  
  tabs.forEach(tab => {
    if (tab.url.startsWith('chrome://') || tab.url.startsWith('about:')) {
      return;
    }
    
    const domain = getDomain(tab.url);
    if (!domainMap.has(domain)) {
      domainMap.set(domain, []);
    }
    domainMap.get(domain).push(tab);
  });
  
  const duplicates = new Map();
  domainMap.forEach((tabList, domain) => {
    if (tabList.length > 1) {
      duplicates.set(domain, tabList);
    }
  });
  
  return duplicates;
}

async function displayDuplicates() {
  const duplicates = await findDuplicatesByDomain();
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
  
  duplicates.forEach((tabList, domain) => {
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
    headerText.textContent = `${domain} - ${tabList.length} вкладок`;
    
    const closeDomainBtn = document.createElement('button');
    closeDomainBtn.className = 'close-domain-btn';
    closeDomainBtn.textContent = 'Закрыть дубликаты';
    closeDomainBtn.title = 'Закрыть все вкладки этого домена, кроме первой';
    closeDomainBtn.addEventListener('click', async () => {
      await closeDomainDuplicates(domain);
    });
    
    headerDiv.appendChild(favicon);
    headerDiv.appendChild(headerText);
    headerDiv.appendChild(closeDomainBtn);
    groupDiv.appendChild(headerDiv);
    
    tabList.forEach((tab, index) => {
      const tabItem = createTabItem(tab, index === 0);
      groupDiv.appendChild(tabItem);
    });
    
    tabsList.appendChild(groupDiv);
  });
}

function createTabItem(tab, isFirst = false) {
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
  closeBtn.title = 'Закрыть вкладку';
  
  if (isFirst) {
    closeBtn.disabled = true;
    closeBtn.title = 'Эта вкладка остается открытой';
    closeBtn.classList.add('disabled');
    tabDiv.classList.add('protected');
  } else {
    closeBtn.addEventListener('click', async () => {
      await chrome.tabs.remove(tab.id);
      displayDuplicates();
    });
  }
  
  tabDiv.appendChild(favicon);
  tabDiv.appendChild(infoDiv);
  tabDiv.appendChild(closeBtn);
  
  return tabDiv;
}

async function closeDomainDuplicates(domain) {
  const duplicates = await findDuplicatesByDomain();
  const domainTabs = duplicates.get(domain);
  
  if (domainTabs && domainTabs.length > 1) {
    const tabsToClose = domainTabs.slice(1).map(tab => tab.id);
    await chrome.tabs.remove(tabsToClose);
    displayDuplicates();
  }
}

async function closeAllDuplicates() {
  const duplicates = await findDuplicatesByDomain();
  const tabsToClose = [];
  
  duplicates.forEach(tabList => {
    if (tabList.length > 1) {
      tabList.slice(1).forEach(tab => {
        tabsToClose.push(tab.id);
      });
    }
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
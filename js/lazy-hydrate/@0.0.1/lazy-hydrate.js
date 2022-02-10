export default function lazyHydrate({ namespace, observerThreshold = 1.0 }) {
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if(entry.isIntersecting) {
        fetchComponent(entry.target.tagName.toLowerCase());
      }
    });
  }, {
    root: null,
    threshold: observerThreshold
  });
  
  function partialTagSearch(tagPartial) {
    const searchResult = document.evaluate(
      `//*[starts-with(name(), "${tagPartial}-")]`,
      document,
      null,
      XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE,
      null
    );
  
    const foundNodes = [];
  
    for (var i = 0; i < searchResult.snapshotLength; i++) {
      foundNodes.push(searchResult.snapshotItem(i));
    }
  
    return foundNodes;
  }
  
  const foundComponents = partialTagSearch(namespace);
  foundComponents.forEach(comp => observer.observe(comp));
  
  function fetchComponent(compName) {
    import(`./${compName}.js`);
  }
}

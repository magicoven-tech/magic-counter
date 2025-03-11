figma.showUI(__html__, { width: 580, height: 600 });

figma.ui.onmessage = async (message) => {
  if (message.type === 'count-frames') {
    const { width, height, name, searchType, searchScope } = message;
    const frames = [];

    // Função para verificar se o Frame corresponde aos critérios
    const isMatch = (frame) => {
      const nameMatch = name ? frame.name.includes(name) : true;
      const widthMatch = searchType !== 'height' && searchType !== 'name' ? frame.width === width : true;
      const heightMatch = searchType !== 'width' && searchType !== 'name' ? frame.height === height : true;
      return nameMatch && widthMatch && heightMatch;
    };

    // Carrega todas as páginas se o escopo for "todas as páginas"
    if (searchScope === 'all') {
      await figma.loadAllPagesAsync(); // Carrega todas as páginas
    }

    // Escopo da busca
    const pages = searchScope === 'all' ? figma.root.children : [figma.currentPage];

    // Percorre as páginas selecionadas
    pages.forEach(page => {
      const matchedFrames = page.findAll(node => node.type === 'FRAME' && isMatch(node));
      matchedFrames.forEach(frame => frames.push(frame.name));
    });

    // Envia o resultado para a UI
    figma.ui.postMessage({ type: 'result', frames });
  }
};
figma.showUI(__html__, {width: 300, height: 200, });

figma.ui.onmessage = async (msg) => {
	if (msg.type === 'post') {
		let documentText: String[] = [];
		const documentName: String = figma.root.name;
		const textNodes: SceneNode[]= figma.currentPage.findAll(node => node.type === "TEXT")

		textNodes.forEach((textnode: TextNode) => {
			if(textnode.characters.length > 0) {
				documentText.push(textnode.characters)
			}
		})

		const data = {
			name: documentName,
			text: documentText
		}

		figma.ui.postMessage({type:'postDocumentText' , data: data});
		
  	} else if(msg.type === 'get') {
		const documentName: String = figma.root.name;
		figma.ui.postMessage({type:'getDocumentText' , name: documentName});
  	} else if(msg.type === 'textNodeReplace') {
		const textNodes: SceneNode[]= figma.currentPage.findAll(node => node.type === "TEXT")

		textNodes.forEach(async (textnode: TextNode) => {
			const fonts = textnode.getRangeAllFontNames(0, textnode.characters.length)
			for (const font of fonts) {
				await figma.loadFontAsync(font)
			}
			if(msg.data.output.text[textnode.characters]) {
				textnode.characters = msg.data.output.text[textnode.characters];
			}
		}) 
  	}
};

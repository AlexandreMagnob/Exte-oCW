class Scrapy {
  constructor() {
    this.scrapedData = [];
    this.titleRestaurant = ""
  }

  sleep(ms) {     return new Promise(resolve => setTimeout(resolve, ms)); }

  async checkAndScrape() {
    await this.sleep(500);
    this.titleRestaurant = document.querySelector('.company-header__info__company span') ? document.querySelector('.company-header__info__company span').textContent : "";
    //console.log(this.titleRestaurant)
    const categoryCards = document.querySelectorAll('div.category-card');
    if (categoryCards.length > 0) {
      await this.clickCategoryCards();
    } else {
      await this.clickProductCards();
    }
  }

  async clickCategoryCards() {
    let categoryCards = document.querySelectorAll('div.category-card');
    for await (const categoryCardIndex of [...Array(categoryCards.length).keys()]) {
        await this.sleep(500)
        /*
        while (document.querySelectorAll('div.category-card').length <= categoryCardIndex) {
            await new Promise(resolve => setTimeout(resolve, 100));
        }*/

        let categoryCards = document.querySelectorAll('div.category-card');
        let categoryCard = categoryCards[categoryCardIndex]
        console.log({categoryCards, categoryCard})
        await this.sleep(1000)
        categoryCard.click();
        await this.sleep(500)
        await this.clickProductCards();
        /*
        while (true) {
            if (await this.clickProductCards()) {
                break;
            }
            await new Promise(resolve => setTimeout(resolve, 100));
        }*/
        await this.sleep(500)
        await this.backPage()
        
    }
  }

    async checkRepetition(complementExpandable) {
      const chooserDiv = complementExpandable.querySelector('.chooser-select.w-20');
      const plusButton = chooserDiv.querySelectorAll('button.btn.radius-1.font-10.no-user-select.btn-container')[1];      
      plusButton.click();
      plusButton.click();
      await this.sleep(200)
      const counter = chooserDiv.querySelector('.px-2.font-3.row-center');
      const counterValue = parseInt(counter.textContent, 10);
      if (counterValue > 1) {
        return "com repeticao";
      } else {
        return "sem repeticao";
      }
    }

    async processTypeComplement(typeComplement, complementExpandable) {
      const complement = typeComplement !== "" ? typeComplement : "";
      let repetition = await this.checkRepetition(complementExpandable);
      let type = "";
      let minQtd = 0;
      let maxQtd = 0;
    
      if (complement.match(/^Escolha (\d+) itens/)) {
        const itemCount = parseInt(complement.match(/^Escolha (\d+) itens/)[1], 10);
        if (itemCount !== 1) {
          type = 'Mais de uma opcao ' + repetition;
          minQtd = itemCount;
          maxQtd = itemCount;
          console.log(minQtd,maxQtd)}
      }else if(complement == "Escolha 1 item"){
        type = "Apenas uma opção";
        minQtd = 1;
        maxQtd = 1;
      }
      else if (complement.startsWith("Escolha até ")) {
        const maxItems = parseInt(complement.match(/\d+/)[0], 10);
        type = 'Mais de uma opcao ' + repetition;
        maxQtd = maxItems;
      } else if (complement.match(/^Escolha de \d+ até \d+ itens$/)) {
        const minMaxItems = complement.match(/\d+/g);
        const minItems = parseInt(minMaxItems[0], 10);
        const maxItems = parseInt(minMaxItems[1], 10);
        type = 'Mais de uma opcao ' + repetition;
        minQtd = minItems;
        maxQtd = maxItems;
      }
      console.log(type)
      return [type, minQtd, maxQtd];
    }
    

  async clickProductCards() {
    console.log("executando..")
    await this.sleep(1000)
    let categoryDivs = document.querySelectorAll('.category-container');
  
    for await (const categoryIndex of [...Array(categoryDivs.length).keys()]) {
      await this.sleep(500)
      let categoryDivs = document.querySelectorAll('.category-container');
      let categoryDiv = categoryDivs[categoryIndex];
      console.log(categoryDivs.length)
      let categoryNameElement = categoryDiv.querySelector('span');
      let categoryName = categoryNameElement ? categoryNameElement.textContent : "";
      console.log(categoryName)
      let productCards = categoryDiv.querySelectorAll(".category-container__products__product-list.col-md-6.col-12.not-small");
  
      let productData = [];
      for await (const productIndex of [...Array(productCards.length).keys()]) {
        await this.sleep(1000)
        let categoryDivs = document.querySelectorAll('.category-container');
        let categoryDiv = categoryDivs[categoryIndex];
        console.log({categoryDivs,categoryDiv})
        let productCards = categoryDiv.querySelectorAll((".category-container__products__product-list.col-md-6.col-12.not-small"));
        let productCard = productCards[productIndex];
        
        if (productCard.style.display === "none") {
          // Se o estilo for "display: none;", pule este productCard
          continue;
      }

        let innerDiv = productCard.querySelector('.item-card-container.row.justify-between');
        if (innerDiv) {
          await this.sleep(500)
          innerDiv.click();
          // Agora, vamos adicionar um atraso antes de coletar os dados.
          await this.sleep(1000)
          let productContainer = document.querySelector('.item-header-container')
          let titleElement = productContainer.querySelector('span.font-5');
          console.log(titleElement)
          let priceElement = productContainer.querySelector('span.price__now.font-3');
          let imgElement = productContainer.querySelector('img');
          let descricaoElement = productContainer.querySelector('span.weight-400');
          let productTitle = titleElement ? titleElement.textContent : "";
          console.log(productTitle)
          let priceText = priceElement ? priceElement.textContent : "";
          let productPrice = priceText.replace(/[^\d,.]/g, '').replace('.', ',')
          let imgSrc = imgElement ? imgElement.src : "";
          let productDescricao = descricaoElement ? descricaoElement.textContent : "";
  
          let complementsDict = []
          let complementExpandables = document.querySelectorAll('div.expandable');
          for await (const complementExpandable of complementExpandables) {
            let complementElements = complementExpandable.querySelectorAll('div.expandable__fixed.py-2.px-4.pointer.bg-grey-12');
            let optionsComplement = [];
  
            // Pegar o nome de cada complemento
            for await (const complementElement of complementElements) {
              let typeComplementElement = complementElement.querySelector('span.expandable__fixed__header__text__subtitle.font-1.text-grey');
              let requiredElement = complementElement.querySelector('span.expandable__fixed__header__text__required.font-0.ml-2.text-primary');
              let complementNameElement = complementElement.querySelector('span.expandable__fixed__header__text__title');
              
              let typeComplementText = typeComplementElement ? typeComplementElement.textContent : "";
              let [typeComplement, minQtd, maxQtd] = await this.processTypeComplement(typeComplementText, complementExpandable)
              let required = requiredElement ? requiredElement.textContent : "";
              let complementName = complementNameElement ? complementNameElement.textContent : "";
              // Pegar nome de cada opção do complemento da iteração
              let optionsElement = complementExpandable.querySelectorAll('.chooser');
              for await (const optionElement of optionsElement) {
                let optionTitleElement = optionElement.querySelector('span.weight-700.text-black.font-1.mb-1');
                let optionPriceElement = optionElement.querySelector('.price__now');
                //let optionQtdElement = optionElement.querySelector('span.text-grey-3');
                let optionDescriptionElement = optionElement.querySelector('.chooser-info__description');
  
                let optionTitle = optionTitleElement ? optionTitleElement.textContent : "";
                let optionPriceText = optionPriceElement ? optionPriceElement.textContent : "0";
                let optionPrice = optionPriceText.replace(/[^\d,.]/g, '').replace(',', '.');
                //let optionQtd = optionQtdElement ? optionQtdElement.textContent : "";
                let optionDescription = optionDescriptionElement ? optionDescriptionElement.textContent : "";
  
                optionsComplement.push({
                  optionTitle: optionTitle,
                  optionPrice: optionPrice,
                  optionDescription: optionDescription
                });
              }
  
              complementsDict.push({
                nameComplement: complementName,
                typeComplement: typeComplement,
                minQtd: minQtd,
                maxQtd: maxQtd,
                required: required,
                options: optionsComplement
              })
            }
          }
  
          productData.push({
            title: productTitle,
            price: productPrice,
            imgSrc: imgSrc,
            descricao: productDescricao,
            complementsDict: complementsDict
          });
          await this.backPage();
        }
      }
      this.scrapedData.push({
        categoryName: categoryName,
        productsCategory: productData
      });
      await this.backPage();
    }
    //alert("Finalizado!")
}


async backPage() {
  await this.sleep(1000);
  let back = document.querySelector('.navigation-header__back')
  if (back) {
    back.click()
}}
}

function desativarAlerta() {
  const alertContainer = document.querySelector('[data-testid="alert-container"]');
  if (alertContainer) {
    alertContainer.remove();
  }
}
// Chame a função desativarAlerta antes de executar outras ações
desativarAlerta();

// Exporta a instância da classe Scrapy para uso em popup.js
window.scrapy = new Scrapy();

chrome.runtime.onMessage.addListener(async function(request, sender, sendResponse) {
  if (request.text === 'hi') {
      await window.scrapy.checkAndScrape();
      const scrapedData = window.scrapy.scrapedData
      alert("Finalizado")
      const titleRestaurant = window.scrapy.titleRestaurant
      await createCSV(scrapedData, titleRestaurant)
  }
});

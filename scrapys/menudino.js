
class ScrapyDino {
  constructor() {
    this.scrapedData = [];
    this.titleRestaurant = ""
  }

  sleep(ms) {     return new Promise(resolve => setTimeout(resolve, ms)); }

    async processTypeComplement(complementExpandable) {
      await this.sleep(300)
      let typeOption = complementExpandable.querySelector('.checkbox, .radio, .pb.pt');
      let type = "";
      let minQtd = 0
      let maxQtd = ""

      if (typeOption && typeOption.classList) {
        if (typeOption.classList.contains('radio')) {
          type = "Apenas uma opcao";
          minQtd = 0;
          maxQtd = 1;
          return [type, minQtd, maxQtd];
        } else if (typeOption.classList.contains('pb') && typeOption.classList.contains('pt')) {
          let buttonGroup = complementExpandable.querySelector('.input-group');
          let buttonPlus = buttonGroup.querySelector('.btn.btn-default.btn-plus');
          minQtd = buttonGroup.querySelector('.form-control.text-center').value;
          maxQtd = "";

          buttonPlus.click();
          buttonPlus.click();
          await this.sleep(200);

          let repetion = "";
          let counter = buttonGroup.querySelector('.form-control.text-center');
          let counterValue = parseInt(counter.value, 10);

          if (counterValue > 1) {
            repetion = " com repeticao";
          } else {
            repetion = " sem repeticao";
          }

          type = "Mais de uma opcao" + repetion;
          return [type, minQtd, maxQtd];
        } else if (typeOption.classList.contains('checkbox')) {
          minQtd = "0";
          maxQtd = "";
          type = "Mais de uma opcao com repeticao";
          return [type, minQtd, maxQtd];
        }
      }
      else {
        return ["", "", ""]
      }

    }

    async expandCategory(categoryDiv) {
      // Verifique se os produtos estão expandidos
      let productCardsContainer = categoryDiv.querySelector('.panel-collapse');
      if (productCardsContainer) {
        let isProductsVisible = productCardsContainer.scrollHeight > 0;
    
        if (!isProductsVisible) {
          // Se os produtos não estão visíveis, clique no botão para expandir
          let expandButton = categoryDiv.querySelector('.fa-chevron-up'); // Substitua '.fa-chevron-up' pelo seletor real do botão
          if (expandButton) {
            expandButton.scrollIntoView();
            expandButton.click();
            await this.sleep(1000); // Aguarde tempo suficiente para que os produtos sejam carregados após a expansão
          }
        }
      }
    }
    async extractSinglePrice(text) {
      const regex = /R\$(\d+(?:,\d{2})?)/;
      const match = text.match(regex);
      return match ? match[1] : "0.00";
    }

  async clickProductCards() {

    this.titleRestaurant = document.title || '';

    console.log("executando..")
    await this.sleep(500)
    let categoryDivs = document.querySelectorAll('.panel.panel-danger')
  
    for await (const categoryIndex of [...Array(categoryDivs.length).keys()]) {
      await this.sleep(500)
      let categoryDivs = document.querySelectorAll('.panel.panel-danger')
      let categoryDiv = categoryDivs[categoryIndex];
      let categoryNameElement = categoryDiv.querySelector('.truncate-overflow')
      let categoryName = categoryNameElement ? categoryNameElement.textContent : "";
  
      //Expande a categoria de produtos
      await this.expandCategory(categoryDiv)

      let productCards = categoryDiv.querySelectorAll('.product-container');

      console.log(categoryName)
      console.log(productCards.length)

      let productData = [];
      for await (const productIndex of [...Array(productCards.length).keys()]) {
        await this.sleep(500)
        let categoryDivs = document.querySelectorAll('.panel.panel-danger')
        let categoryDiv = categoryDivs[categoryIndex];
        let productCards = categoryDiv.querySelectorAll('.product-container');
        let productCard = productCards[productIndex];
        
        console.log({productIndex, productCard})

        let priceElement = productCard.querySelector('.price');
        
        productCard.scrollIntoView();
        let innerDiv = productCard.querySelector('.product-item');
        if (innerDiv) {
          await this.sleep(500)
          innerDiv.click();
          
          // Agora, vamos adicionar um atraso antes de coletar os dados.
          await this.sleep(1000)
          let productModal = document.querySelector('.modal-dialog');
          let titleElement = productModal.querySelector('#produtoModalNome');
          console.log(titleElement)
          let imgElement = productModal.querySelector('#produtoModalImagePath');
          let descricaoElement = productModal.querySelector('#produtoModalDescricao')
          let productTitle = titleElement ? titleElement.textContent : "";
          console.log(productTitle)
          let priceText = priceElement ? priceElement.textContent : "";
          let productPrice = "0"
          if (priceText.includes("a")) {
            // Se for um intervalo, defina o preço como zero
            productPrice = "0";
          } else {
            // Se for um preço único, extraia o valor normal
            productPrice = this.extractSinglePrice(priceText);
          }
          let imgSrc = imgElement ? imgElement.src : "";
          let productDescricao = descricaoElement ? descricaoElement.textContent : "";
  
          let complementsDict = []
          let complementExpandables = productModal.querySelectorAll('.panel.panel-danger')
          for await (const complementExpandable of complementExpandables) {
            let complementElements = complementExpandable.querySelectorAll('.panel-heading')
            let optionsComplement = [];
            // Pegar o nome de cada complemento
            for await (const complementElement of complementElements) {
              //let typeComplementElement = complementElement.querySelector('small');
              let complementNameElement = complementElement.querySelector('.panel-title');
              
              let [typeComplement, minQtd, maxQtd] = await this.processTypeComplement(complementExpandable);
              console.log([typeComplement, minQtd, maxQtd])
              let complementName = complementNameElement ? complementNameElement.textContent : "";
              
              // Adiciona verificação para pular "Alguma observação?"
              if (complementName.trim() === "Alguma observação?") {
                console.log("Observação pulada..")
                continue; // Pula para a próxima iteração do loop
            }

              // Pegar nome de cada opção do complemento da iteração
              let optionsElement = complementExpandable.querySelectorAll('.checkbox,.radio,.pb.pt');
              for await (const optionElement of optionsElement) {
                let optionTitle = "";
                let optionPrice = "0";
                let optionDescription = "";

                if (optionElement.classList.contains('radio')) {
                  // Se a classe for 'radio', trata como um rádio.
                  let optionTitleElement = optionElement.querySelector('label');
                  let optionPriceElement = optionElement.querySelector('.pull-right');
                  
                  optionTitle = optionTitleElement.textContent.trim();
                  let optionPriceText = optionPriceElement ? optionPriceElement.textContent : "0";
                  optionPrice = optionPriceText.replace(/[^\d,.]/g, '').replace('.', ',')

                  
                  console.log({optionPrice, optionTitle})
                  
                } else if (optionElement.classList.contains('pb') && optionElement.classList.contains('pt')) {
                  let optionText = optionElement.textContent.trim();
                  let regex = /Máx\.\s\d+\s*([\s\S]+?)\s*\+\s*R\$(\d+,\d{2})/;
                  let match = optionText.match(regex);

                  optionTitle = match ? match[1].trim() : "";
                  optionPrice = match ? match[2] : "";
                  
                  console.log({optionPrice, optionTitle})
                }
                else if (optionElement.classList.contains('checkbox')) {
                  // Se a classe for 'checkbox', trata como um checkbox.
                  let optionLabelElement = optionElement.querySelector('label');
                  
                  if (optionLabelElement) {
                    let optionLabelContent = optionLabelElement.textContent.trim();
                    optionTitle = optionLabelContent.split('+')[0].trim();
                    let optionPriceText = optionLabelContent.split('+')[1];
                    optionPrice = optionPriceText.replace(/[^\d,.]/g, '').replace('.', ',')

                    console.log({optionPrice, optionTitle})
                  }
                }

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
          console.log("Produto adicionado")
          await this.backPage();
        }
      }
      this.scrapedData.push({
        categoryName: categoryName,
        productsCategory: productData
      });
      console.log("Categoria adicionada")
      await this.backPage();
    }
}


async backPage() {
  console.log("Voltou!")
  await this.sleep(1000);
  let back = document.querySelector('.modal-dialog .fa-chevron-left');
  if (back) {
    back.click()
}
  await this.sleep(1000);
}
}

class HandlerScrapy {
    constructor() {
      // Inicializa as instâncias dos scrapers
      this.scrapyDino = new ScrapyDino();
      this.scrapyAnotai = new ScrapyAnotai();
      this.scrapyGoomer = new ScrapyGoomer();
    }
  
    async handleScrapyChoice(restaurante) {
      // Decide qual scraper usar com base no restaurante escolhido pelo usuário
      if (restaurante === 'Dino') {
        await this.scrapyDino.clickProductCards();
        const scrapedData = this.scrapyDino.scrapedData
        alert("Finalizado")
        const titleRestaurant = this.scrapyDino.titleRestaurant
        await createCSV(scrapedData, titleRestaurant)

      } else if (restaurante === 'Anotai') {
        await this.scrapyAnotai.checkAndScrape();
        const scrapedData = this.scrapyAnotai.scrapedData
        alert("Finalizado")
        const titleRestaurant = this.scrapyAnotai.titleRestaurant
        await createCSV(scrapedData, titleRestaurant)
      } 
      else if (restaurante == "Goomer"){
        await this.scrapyGoomer.clickProductCards()
        const scrapedData = this.scrapyGoomer.scrapedData
        alert("Finalizado")
        const titleRestaurant = this.scrapyGoomer.titleRestaurant
        await createCSV(scrapedData, titleRestaurant)
      }
      else if (restaurante === 'OlaClick') {
        await this.scrapyOlaClick.clickProductCards()
        const scrapedData = this.scrapyOlaClick.scrapedData
        alert("Finalizado")
        const titleRestaurant = this.scrapyOlaClick.titleRestaurant
        await createCSV(scrapedData, titleRestaurant)
      }
      else {
        console.error('Restaurante inválido');
      }
    }
  }
  
  // Exporta a classe HandlerScrapy
  window.HandlerScrapy = HandlerScrapy;
  
  // Escuta mensagens enviadas pelo popup.js
  chrome.runtime.onMessage.addListener(async function(request, sender, sendResponse) {
    if (request.restaurante) {
        const handlerScrapy = new HandlerScrapy();
        await handlerScrapy.handleScrapyChoice(request.restaurante);
    }
  });
  
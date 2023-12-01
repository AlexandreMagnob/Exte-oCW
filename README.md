# CW Scrapy

## Descrição
O CW Scrapy é um conjunto de scrapers desenvolvido para extrair informações de cardápios de diferentes sites de entrega. O foco é simplificar a obtenção de dados, como nomes de produtos, preços, descrições e complementos, para facilitar a criação de listas.

## Tecnologias Utilizadas

- **JavaScript:** A linguagem principal para o desenvolvimento do scraper.
- **PapaParse:** Biblioteca utilizada para gerar planilhas CSV a partir dos dados raspados.
- **Google Chrome Extension:** O scraper é projetado para ser executado como uma extensão do Google Chrome.

## Estrutura do Projeto

- **`handlerScrapy.js`:** Contém a classe `HandlerScrapy`, que gerencia a escolha e execução do scraper específico com base no restaurante escolhido pelo usuário.

- **`scrapys/`:** Diretório que contém os scrapers específicos para cada restaurante. Exemplos incluem `scrapyOlaClick.js`, `scrapyDino.js`, etc.

- **`sheet_generation.js`:** Funções relacionadas à geração de planilhas CSV a partir dos dados raspados.

## Como Usar

1. Instale a extensão no Google Chrome.
2. Abra o site do restaurante desejado.
3. Clique no ícone da extensão e escolha o restaurante.
4. Aguarde a conclusão do scraping.
5. Baixe a planilha CSV gerada.

## Scrapers Disponíveis

### ScrapyOlaClick

Este scraper é projetado para extrair dados do site OlaClick, incluindo nome do produto, preço, descrição e complementos. Ele lida com características específicas do site, como complementos com opções selecionáveis.

### ScrapyDino, ScrapyAnotai, ScrapyGoomer, ScrapyInstaDelivery

Cada scraper é personalizado para um restaurante específico, abordando as particularidades de cada site de entrega.

## Funções Adicionais

### `createCSV(data, name)`

Função assíncrona que gera uma planilha CSV a partir dos dados raspados. Os dados são estruturados em categorias, produtos e complementos.

### Estrutura de Dados

- **Categoria:**
  - Nome da categoria
- **Produto:**
  - Nome
  - Preço
  - Descrição
  - Imagem
  - Complementos
    - Nome do complemento
    - Tipo (único ou múltiplo)
    - Quantidade mínima e máxima
    - Requerido
    - Opções (nome, preço e descrição)

## Contribuição

Sinta-se à vontade para contribuir, relatar problemas ou propor melhorias. O projeto é open-source e está aberto a colaborações.

**Nota:** Certifique-se de revisar e ajustar o código conforme necessário para atender às peculiaridades dos sites específicos.

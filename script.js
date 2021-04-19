function eraseAll() { // requisito 6
  const removeButton = document.getElementsByClassName('empty-cart')[0];// botão que esvazia o carrinho
  removeButton.addEventListener('click', () => { // fazer essa HOF aqui no addEventListener me ajudou a resolver problema de lint. Fazendo assim, eu chamo a função eraseAll usando o addEventListener dentro da própria eraseAll. 
    document.getElementsByClassName('cart__items')[0].innerText = ''; // esse do cart_items é a OL.
    });
}

function cartItemClickListener(event) {
  event.target.remove();// o event.target alcança o elemento que começou o evento(Nesse caso, seria o LI). Então ao clicar em LI, eu chamo essa função e esta função remove este LI.
}
function createCartItemElement({ id: sku, title: name, price: salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
   li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`; // esses eu obtenho ao fazer o segundo fetch(tá na função addToCard).
   
    li.addEventListener('click', cartItemClickListener);// esse é pro requisito 3.
   
  return li;
 }

const addToCard = async (sku) => {
  const response = await fetch(`https://api.mercadolibre.com/items/${sku}`);
  const jsonIds = await response.json();// melhor fazer dessa forma do que usando then()
  const clickItem = createCartItemElement({
     id: jsonIds.id, title: jsonIds.title, price: jsonIds.price });// o clickitem vai receber essa função com esses parâmetros. Tive que fazer isso pra não dar problema de Lint. Tem que fazer isso somente pra usar o appendChild com o OL.
     // esses parâmetros desse jeito foram a forma de fazer dar certo.
     // Resumo da sequência do req. 2:  Quando eu clico no botão verde, eu chamo a função que faz a requisição e essa mesma função diz que a função createCartItemElement(que estrutura e retorna as LIs) é filha de OL. Por isso que aparece as informações do produto(que eu cliquei) naquela OL.
  
  const ol = document.getElementsByClassName('cart__items')[0];
  
  return ol.appendChild(clickItem);
   };
function createProductImageElement(imageSource) {
  const img = document.createElement('img');
  img.className = 'item__image';
  img.src = imageSource;
  return img;
}

function createCustomElement(element, className, innerText) {
  const e = document.createElement(element);
  e.className = className;
  e.innerText = innerText;
  return e;
}
// observação IMPORTANTE sobre os parâmetros da função abaixo: Se olhar dentro do objeto RESULT, vai ver muitos nomes(em roxo). Nenhum desses nomes é sku, name ou image. Aí pra eu mudar isso, tenho que fazer o que fiz abaixo que daí muda por nomes que estão nesse result. Sku é o id; name é title e thumbnail é image. Fazendo isso, essa função vai funcionar  quando eu chamar ela lá embaixo no forEach. Aí vão aparecer as imagens e os nomes de cada produto.
function createProductItemElement({ id: sku, title: name, thumbnail: image }) {
  const section = document.createElement('section');
  const sectitems = document.getElementsByClassName('items');
  section.className = 'item';

  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image)); 
   sectitems[0].appendChild(section); // usei o [0] porque o document.getElementByClassName me retorna um array, não importanto quantos elementos com determinada classe existam. Como só existe um elemento com class "items", aí só usa o [0] e já dá certo.
   const buttonadd = createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'); // criei uma var pro botão verde de cada produto.
   section.appendChild(buttonadd);// no começo não entendi, mas tem que ser aqui esse appendChild porque o botão verde aparece junto da imagem e do nome.
   buttonadd.addEventListener('click', () => addToCard(sku));// é uma forma de chamar a função(Ela faz requisição). Essa parte é do requisito 2.
  return section;// esse section confuso é pra retornar ID,imagem, nome e o botão verde.
}

// function getSkuFromProductItem(item) {
//   return item.querySelector('span.item__sku').innerText;
// }

const myFetch = () => { // essas coisas é melhor botar no final do código pra dar menos problema com o Lint.
  fetch('https://api.mercadolibre.com/sites/MLB/search?q=$computador')
  .then((response) => {
    response.json()
    .then((computador) => {
      console.log(computador); // esse não é obrigatório, mas é bom pra poder visualizar melhor.
      computador.results.forEach((element) => { // Computador é aquele array com todo aquele absurdo de informação depois que faço o fetch.
        // computador.results me alcança tudo que tiver no array "results". Aí faço o forEach dentro desse RESULTS.
        // esse result tem uns 50 itens lá. Cada 1 desses equivale a um dos 50 produtos.
       createProductItemElement(element); // o parâmetro aqui tá diferente da mesma função lá em cima, mas é pq esse "element" já engloba todas aqueles 3 parâmetros lá de cima. Cada "element"(ou produto) tem aquelas 3 coisas.
        // pra cada elemento(ou produto) dentro do RESULTS, eu CHAMO ESSA FUNÇÃO createProduct(que já foi personalizada lá em cima). Ou seja, isso é pra que, enquanto eu rodo os produtos(dentro do result), eu faça aparecer na página todos os 50 produtos com sua personalização.
        });
    });
  });
};

window.onload = function onload() { 
  myFetch(); 
  eraseAll();
};

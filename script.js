function criarElemento(element, className, innerText) {
  const elemento = document.createElement(element);
  elemento.className = className;
  elemento.innerText = innerText;
  return elemento;
}

function criarImagem(imageSource) {
  const img = document.createElement('img');
  img.className = 'item__image';
  img.src = imageSource;
  return img;
}

function criarElementoNaTabela({ sku, name, image, id }) {
  const encontraSection = document.createElement('section');
  encontraSection.className = 'item';
  encontraSection.appendChild(criarElemento('span', 'item__sku', sku));
  encontraSection.appendChild(criarElemento('span', 'item__title', name));
  encontraSection.appendChild(criarImagem(image));
  const informaçoesDoproduto2 = {
    sku: sku,
    name: name,
    image: image,
  };
  const criarButton = criarElemento('button', 'item__add', 'Adicionar ao carrinho!');
  criarButton.addEventListener('click',  clickElemente);
  encontraSection.appendChild(criarButton);
  console.log(id)
  return encontraSection;
}

async function clickElemente (event) {
  const cartItems = document.getElementsByClassName('cart__items')[0];
  const parent = event.target.parentElement;
  const prodID = getSkuFromProductItem(parent);
  const prod = await getProductId(prodID);
  const newEl = createCartItemElement({
    sku: prod.id,
    name: prod.title,
    salePrice: prod.price,
  });
  cartItems.appendChild(newEl);
  sumPrices();
  localStorage.setItem('cartItems', cartItems.innerHTML);
}

function criarArrayDeProdutos ({ sku, name, image }) {
  const todosOsProdutos = {
    sku: sku,
    name: name,
    image: image,
  };
  return todosOsProdutos;
}

async function transformarUrl(url) {
  const pegarIformacoesDaUrl = await fetch(url);
// passar para obejeto
  const arrayDaUrl = await pegarIformacoesDaUrl.json();
  const { results: answer } = arrayDaUrl;
  const elementos = document.querySelector('.items');
  let teste = 1
  answer.forEach((index) => {
    const informaçoesDoproduto = {
      sku: index.id,
      name: index.title,
      image: index.thumbnail,
    };
    const element = criarElementoNaTabela(informaçoesDoproduto);
    criarArrayDeProdutos(informaçoesDoproduto)
    elementos.appendChild(element);
  });
}

  function cartItemClickListener(event) {
   console.log('entrou na lista')
}

function createCartItemElement({ sku, name, salePrice }) {
  console.log('teste')
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

window.onload = function onload() {
  transformarUrl('https://api.mercadolibre.com/sites/MLB/search?q=computador');
 };

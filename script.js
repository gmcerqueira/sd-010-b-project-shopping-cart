// soma os preços assincronas
const sumPriceCar = async () => {
  const pPriceAll = document.querySelector('.total-price');
  let sum = 0;
  const liCardCar = document.querySelectorAll('.cart__item');
    liCardCar.forEach((li) => {
     const price = li.innerText.split('$')[1];
     sum += Number(price);
    });
  pPriceAll.innerHTML = sum;
};

// função de apagar item unitario  no carrinho de compras
const cartItemClickListener = async (event) => {
  event.target.remove();
  const olCard = document.getElementsByClassName('cart__items')[0];
  localStorage.saveItensCar = olCard.innerHTML; // apaga item local
  await sumPriceCar();
};

// limpa todo o carrinho de compras
const clearAllItensCar = () => {
const btnCleanAll = document.querySelector('.empty-cart');
  btnCleanAll.addEventListener('click', () => {
    const olCard = document.getElementsByClassName('cart__items')[0];
    olCard.innerHTML = '';
    localStorage.saveItensCar = '';
  });
};

// cria a imagem src, classe, return
function createProductImageElement(imageSource) {
  const img = document.createElement('img');
  img.className = 'item__image';
  img.src = imageSource;
  return img;
}

// cria elemeno classe, texto do element
function createCustomElement(element, className, innerText) {
  const e = document.createElement(element);
  e.className = className;
  e.innerText = innerText;
  return e;
}

// cria elemento clicado no carrinho, add função eventlistene.
// chama a função de apagar
function createCartItemElement({ id, title, price }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${id} | NAME: ${title} | PRICE: $${price}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

// recebe id click  faz requisição api, cria chave no localStorage -salva
const addCardCar = async (ItemID) => {
  const response = await fetch(`https://api.mercadolibre.com/items/${ItemID}`);
  const item = await response.json();
  const returnID = createCartItemElement(item);
  const olCard = document.querySelector('.cart__items');
  olCard.appendChild(returnID); // add novamente eventlistener e chama a função de apagar
  localStorage.setItem('saveItensCar', olCard.innerHTML); // save no localStorage.setItem()
  await sumPriceCar();
};

// pega id produto para add carrinho de compras. atraves do botao
const addCardItem = async (event) => {
  const getButtonId = event.target.parentNode.firstChild.innerText;
  addCardCar(getButtonId);
};

// cria elemento no dom , id , titulo , imagem. botao de adicionar ao car. eventListener click
function createProductItemElement({ id: sku, title: name, thumbnail: image }) {
  const section = document.createElement('section');
  section.className = 'item';
  const sectionItem = document.querySelector('.items');
  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'))
  .addEventListener('click', addCardItem); // evento de click, e chamada de função

  return sectionItem.appendChild(section);
}

// Dedico esse projecto ao meu colega de Turma , Lucas Martins
// me ajudou muito , Vlw Lucas Martins.

    const restoreLocalStorage = () => {
      if (localStorage.getItem('saveItensCar')) {
        const olCard = document.querySelector('.cart__items');
        olCard.innerHTML = localStorage.getItem('saveItensCar');
        const liCardCar = document.querySelectorAll('.cart__item');
        liCardCar.forEach((li) => {
          li.addEventListener('click', cartItemClickListener);
        });
      }
    };

    window.onload = function onload() {
      const fetchApi = async (item) => {
        const response = await fetch(`https://api.mercadolibre.com/sites/MLB/search?q=${item}`);
        const data = await response.json();
        data.results.forEach((element) => {
          createProductItemElement(element);
        });
      };
      fetchApi('computador');
      restoreLocalStorage();
      clearAllItensCar();
    };

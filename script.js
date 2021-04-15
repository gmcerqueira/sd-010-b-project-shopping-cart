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

function getSkuFromProductItem() {
  const cartList = document.querySelector('ol');
  localStorage.setItem('cart', cartList.innerHTML);
}

function cartItemClickListener(event) {
  const deleta = event.target.parentElement;
  event.target.remove();
  localStorage.cart = deleta.innerHTML;
  // document.querySelector('.cart__items')
  // .addEventListener('click', (event) => event.target.remove());
  // getSkuFromProductItem();
} // Agradecimentos ao Lucas Martins;

function cartSaved() {
  const cartList = document.querySelector('ol');
  cartList.innerHTML = localStorage.getItem('cart');
  const shopItens = document.querySelectorAll('li');
  shopItens.forEach((cart) => cart.addEventListener('click', cartItemClickListener));
}

function createCartItemElement({
  sku,
  name,
  price: salePrice,
}) {
  const ol = document.querySelector('ol');
  const li = document.createElement('li');
  ol.appendChild(li);
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

function createProductItemElement({
  sku,
  name,
  image,
}) { // poderia fazer id: sku, title: name, thumbnail: image
  const section = document.createElement('section');
  section.className = 'item';
  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'))
    .addEventListener('click', () => {
      fetch(`https://api.mercadolibre.com/items/${sku}`).then((res) => res.json()).then((iten) => {
        const { price } = iten;
        createCartItemElement({ sku, name, price });
        getSkuFromProductItem();
      });
    });
  return section;
} // agradecimentos ao Pedro Henrique por me ajudar com o eventlistener

window.onload = () => {
  fetch('https://api.mercadolibre.com/sites/MLB/search?q=computador')
    .then((response) => response.json())
    .then((itens) => {
      itens.results.forEach((iten) => {
        const {
          id,
          title,
          thumbnail,
        } = iten;
        const createItens = createProductItemElement({
          sku: id,
          name: title,
          image: thumbnail,
        });
        document.getElementsByClassName('items')[0].appendChild(createItens);
      });
    });
  cartSaved();
};
// agradecimentos ao professor Eduardo por ajudar na função fetch

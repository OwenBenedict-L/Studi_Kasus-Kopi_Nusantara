/* navigation menu */
const menuIcon = document.querySelector('.fas.fa-bars.fa-2x');
if (menuIcon) {
    menuIcon.addEventListener('click', () => {
        document.querySelector('.left-menu-show').classList.toggle('show');
    });
}

document.addEventListener('DOMContentLoaded', function() {
    let cart = [];

    function showNotif(message) {
        const notification = document.createElement('div');
        notification.className = 'notif-message';
        notification.textContent = message;
        
        document.getElementById('notif-container').appendChild(notification);

        setTimeout(() => notification.classList.add('show'), 10);
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => notification.remove(), 300); 
        }, 2500);
    }

    const leftMenuLinks = document.querySelectorAll('.left-menu-show a');
    leftMenuLinks.forEach(link => {
        link.addEventListener('click', function() {
            leftMenuLinks.forEach(el => el.classList.remove('active'));
            this.classList.add('active');
        });
    });

    const shoppingCartBtn = document.getElementById('shopping-cart');
    if (shoppingCartBtn) {
        shoppingCartBtn.addEventListener('click', (e) => {
            e.preventDefault();
            document.querySelector('.shopping-cart-button').classList.toggle('active');
            const searchButton = document.querySelector('.search-button');
            if(searchButton) searchButton.classList.remove('active');
        });
    }

    const menuPrices = document.querySelectorAll('.menu-price');
    menuPrices.forEach(priceBtn => {
        priceBtn.addEventListener('click', (e) => {
            const priceElem = e.currentTarget;
            const card = priceElem.closest('.menu-card');

            const name = card.querySelector('h3').textContent;
            const priceText = priceElem.textContent;
            const price = parseInt(priceText.replace(/[^\d]/g, ''));

            const existingItem = cart.find(item => item.name === name);

            if (existingItem) {
                existingItem.quantity += 1;
            } else {
                cart.push({
                    name: name,
                    price: price,
                    quantity: 1
                });
            }

            updateCart();
            document.getElementById('shopping-cart').classList.add('active');
            showNotif(`${name} berhasil ditambahkan!`);
        });
    });

    function updateCart() {
        const cartContainer = document.querySelector('.content-cart');
        const totalPrice = document.getElementById('price');

        cartContainer.innerHTML = '';
        let total = 0;

        if (cart.length === 0) {
            cartContainer.innerHTML = '<p class="message-cart">Tidak ada barang yang dibeli...</p>';
        } else {
            cart.forEach((item, index) => {
                const itemSubtotal = item.price * item.quantity;
                total += itemSubtotal;

                const itemHTML = `
                    <div class="cart-item">
                        <div class="item-info">
                            <p>${item.name}</p>
                            <span>Rp ${itemSubtotal.toLocaleString('id-ID')}</span>
                        </div>
                        <div class="qty-controls">
                            <button type="button" class="btn-qty btn-minus" data-index="${index}">-</button>
                            <span>${item.quantity}</span>
                            <button type="button" class="btn-qty btn-plus" data-index="${index}">+</button>
                        </div>
                    </div>
                `;
                cartContainer.insertAdjacentHTML('beforeend', itemHTML);
            });
        }

        if (totalPrice) {
            totalPrice.textContent = `Rp ${total.toLocaleString('id-ID')}`;
        }
    }

    const cartContainer = document.querySelector('.content-cart');
    if (cartContainer) {
        cartContainer.addEventListener('click', function(e) {
            if (e.target.closest('.btn-plus')) {
                const btn = e.target.closest('.btn-plus');
                const index = parseInt(btn.getAttribute('data-index'));
                cart[index].quantity += 1;
                updateCart();
            }
            if (e.target.closest('.btn-minus')) {
                const btn = e.target.closest('.btn-minus');
                const index = parseInt(btn.getAttribute('data-index'));
                cart[index].quantity -= 1;

                if (cart[index].quantity <= 0) {
                    cart.splice(index, 1);
                }
                updateCart();
            }
        });
    }

    const submitCartBtn = document.getElementById('submit-cart');
    if (submitCartBtn) {
        submitCartBtn.addEventListener('click', function(e) {
            e.preventDefault();
            const btn = this;

            if (cart.length === 0) {
                showNotif('Keranjang kamu kosong!');
                return;
            }

            if (!btn.classList.contains('confirm-mode')) {
                btn.classList.add('confirm-mode');
                btn.textContent = 'Yakin beli sekarang?';

                setTimeout(() => {
                    btn.classList.remove('confirm-mode');
                    btn.textContent = 'Beli';
                }, 3000);

                return;
            }

            showNotif('Terima kasih telah berbelanja di Kopi Nusantara!');
            cart = [];
            updateCart();
            
            const shoppingCartContainer = document.querySelector('.shopping-cart-button');
            if(shoppingCartContainer) shoppingCartContainer.classList.remove('active');

            btn.classList.remove('confirm-mode');
            btn.textContent = 'Beli';
        });
    }

    /* search button */
    const searchingBtn = document.getElementById('searching');
    if (searchingBtn) {
        searchingBtn.addEventListener('click', function(e) {
            e.preventDefault(); 
            document.querySelector('.search-button').classList.toggle('active');
            document.getElementById('search-box').focus();
        });
    }

    const searchBox = document.getElementById('search-box');
    if (searchBox) {
        searchBox.addEventListener('input', function() {
            let kataKunci = this.value.toLowerCase();
            let jumlahCocok = 0;
            
            const menuCards = document.querySelectorAll('.menu-card');
            
            menuCards.forEach(card => {
                let namaKopiElem = card.querySelector('h3');
                if (namaKopiElem) {
                    let namaKopi = namaKopiElem.textContent.toLowerCase();    
                    if (namaKopi.includes(kataKunci)) {
                        card.style.display = '';
                        jumlahCocok++;
                    } else {
                        card.style.display = 'none';
                    }
                }
            });

            const pesanKosong = document.getElementById('pesan-kosong');
            if (pesanKosong) {
                if (jumlahCocok === 0) {
                    pesanKosong.style.display = 'block'; 
                } else {
                    pesanKosong.style.display = 'none'; 
                }
            }
        });
    }
});
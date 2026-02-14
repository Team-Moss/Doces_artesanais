const menu = document.querySelector('#menu');
const cartModal = document.querySelector('#cart-modal');
const cartItemsContainer = document.querySelector('#cart-items');
const cartTotal = document.querySelector('#cart-total');
const checkoutBtn = document.querySelector('#checkout-btn');
const closeModalBtn = document.querySelector('#close-modal-btn');
const cartBtn = document.querySelector('#cart-btn');
const cartCounter = document.querySelector('#cart-count');
const addressInput = document.querySelector('#address');
const addressWarn = document.querySelector('#address-warn');

// Lista de carrinho do menu
let cart = []


// Abrir o modal carrinho 
cartBtn.addEventListener('click', function(){
    updateCartModal();
    cartModal.style.display = "flex";
})

// Fechar o modal quando clicar fora
cartModal.addEventListener('click', function(event){
    if(event.target === cartModal) cartModal.style.display = "none";
})

// Fechar no botão "fechar"
closeModalBtn.addEventListener('click', function(){
    cartModal.style.display = "none";
})

// Adicionar itens do menu ao modal
menu.addEventListener('click', function(event){
    // console.log(event.target);
    let parentButton = event.target.closest(".add-to-cart-btn");
    if (parentButton){
        const name = parentButton.getAttribute("data-name");
        const price = parseFloat(parentButton.getAttribute("data-price"));

        //adicionar ao carrinho 
        addToCart(name, price);
    }
})


// Função para adicionar ao carrinho
function addToCart(name, price){
    const existingItem = cart.find(item => item.name === name);

    if(existingItem){
        // se o item já existe, aumenta apenas a quantidade +1
        existingItem.quantity += 1;
        return;
    }

    
    cart.push({
        name,
        price,
        quantity: 1,
    })

    updateCartModal()
}

function updateCartModal(){
    cartItemsContainer.innerHTML = "";
    let total = 0;

    cart.forEach(item => {
        const cartItemElement = document.createElement("div");
        cartItemElement.classList.add("flex", "justify-between", "mb-4", "flex-col");

        cartItemElement.innerHTML = `
        <div class="flex items-center justify-between"> 
            <div>
                <p class="font-medium"> ${item.name}</p> 
                <p>Qtd: ${item.quantity}</p> 
                <p class="font-medium mt-2">R$ ${item.price.toFixed(2)}</p> 
            </div>

            <button class="remove-from-cart-btn" data-name="${item.name}">
                Remover
            </button>
        </div>
        `

        total += item.price * item.quantity; 

        cartItemsContainer.appendChild(cartItemElement);
    })

    cartTotal.textContent = total.toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL"
    });

    cartCounter.innerHTML = cart.length;
}

// Função para remover do carrinho
cartItemsContainer.addEventListener("click", function(event){
    if(event.target.classList.contains("remove-from-cart-btn")){
        const name = event.target.getAttribute("data-name");
        removeItemCart(name)
    }
    
})

function removeItemCart(name){
    const index = cart.findIndex(item => item.name === name);

    if(index !== -1){
        const item = cart[index];

        if(item.quantity > 1){
            item.quantity -= 1;
            updateCartModal();
            return;
        }

        cart.splice(index, 1);
        updateCartModal();
    }
}

addressInput.addEventListener("input", function(event){
    let inputValue = event.target.value;

    if(inputValue !== ""){
        addressInput.classList.remove("border-red-500");
        addressWarn.classList.add("hidden");
    }
})

// Finalizar pedido
checkoutBtn.addEventListener("click", function(){
    
    if(cart.length === 0) return;
    if(addressInput.value === ""){
        addressWarn.classList.remove("hidden");
        addressInput.classList.add("border-red-500");
        return;
    }

    //Enviar o pedido para a api Whatsapp
    const cartItems = cart.map((item)=>{
        return(
            `${item.name} Quantidade: (${item.quantity}) Preço: R$${item.price}`
        )
    }).join("");

    const message = encodeURIComponent(cartItems);
    const phone = "67993191904"

    window.open(`https://wa.me/${phone}?text=${message} Endereço: ${addressInput.value}`, "_blank");

    cart = [];
    updateCartModal();
})


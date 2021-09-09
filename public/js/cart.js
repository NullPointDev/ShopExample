// Some lovely spaghetti, handles cart interactions (Create, Update, Delete).
// TODO: Tidy this up.

/* eslint-disable no-undef*/
// eslint-disable-next-line no-unused-vars
function addToCart(id) {
	let amt = $(`#num-${id}`)[0].value;
	console.info(`Adding ${amt} of ${id} to Cart`);
	let userData = new XMLHttpRequest();
	userData.open("GET", "/api/me", true);
	userData.onload = () => {
		if(!JSON.parse(userData.responseText).success)
			return window.location.href = "/login?msg=priv";
		let cartAdd = new XMLHttpRequest();
		cartAdd.open("POST", "/api/cart");
		cartAdd.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
		cartAdd.onload = () => {
			let res = JSON.parse(userData.responseText);
			console.log(res);
			if(res.success) {
				$(`#cart-${id}`).tooltip({trigger: "manual", title: "Success"});
				$(`#cart-${id}`).tooltip("show");
				setTimeout(() => {$(`#cart-${id}`).tooltip("hide");},1000);
			} else {
				$(`#cart-${id}`).tooltip({trigger: "manual", title: "Error"});
				$(`#cart-${id}`).tooltip("show");
				setTimeout(() => {$(`#cart-${id}`).tooltip("hide");},1000);
			}
		};
		cartAdd.send(JSON.stringify({item: id, qty: amt}));
	};
	userData.send();
}

// eslint-disable-next-line no-unused-vars
function editCartEntry(id) {
	let origQty = $(`#qty-${id}`).text();
	let newQty;
	newQty = parseInt(prompt("Insert New Quantity:", origQty));
	if(isNaN(newQty) || newQty < 1) return alert("Invalid Value");
	let userData = new XMLHttpRequest();
	userData.open("GET", "/api/me", true);
	userData.onload = () => {
		if(!JSON.parse(userData.responseText).success)
			return window.location.href = "/login?msg=priv";
		let cartEdit = new XMLHttpRequest();
		cartEdit.open("POST", "/api/cart");
		cartEdit.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
		cartEdit.onload = () => {
			let res = JSON.parse(userData.responseText);
			if(res.success) {
				location.reload();
			} else {
				alert("An Unexpected Error Occurred!");
			}
		};
		cartEdit.send(JSON.stringify({item: id, qty: newQty}));
	};
	userData.send();
}

function deleteCartEntry(id) {
	if(!confirm("Are you sure you want to remove this item from your cart?")) return;
	let userData = new XMLHttpRequest();
	userData.open("GET", "/api/me", true);
	userData.onload = () => {
		if(!JSON.parse(userData.responseText).success)
			return window.location.href = "/login?msg=priv";
		let cartDelete = new XMLHttpRequest();
		cartDelete.open("DELETE", "/api/cart");
		cartDelete.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
		cartDelete.onload = () => {
			let res = JSON.parse(userData.responseText);
			if(res.success) {
				location.reload();
			} else {
				alert("An Unexpected Error Occurred!");
			}
		};
		cartDelete.send(JSON.stringify({item: id}));
	};
	userData.send();
}
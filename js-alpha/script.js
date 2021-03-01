// TODO Complete this file as described by the README.md
// Do NOT modify any files outside of this.

let hasLoadedFriendsAndFamilyData = false;

function askQuestion() {
	// TODO Complete this function as described by the README.md
	var quest = document.getElementById("questionArea");
	quest.setAttribute("style", "visibility:visible")

}

function submitQuestion() {
	// TODO Complete this function as described by the README.md
	var input = document.getElementById('questionField');
	console.log(input.value);
}

function addPizzazz() {
	// TODO Complete this function as described by the README.md
	var p = document.getElementsByName("sayingOfTheDay")[0];
	
	p.style.color = "green";
	p.style.font = "14px 'Microsoft Sans Serif'";
	p.style.fontWeight ="Bold";

}

function saveBalance() {
	// TODO Complete this function as described by the README.md
	var b_input = document.getElementById("balanceInput").value.trim();
	var balance = document.getElementById("balance");
	if (b_input == null || b_input == "" || b_input == undefined){
		console.log("Cannot update balance, syntax error!" );	
	}
	// else if((/^[-]?[0-9]+$/.test(b_input.value)) || (/^[-]?[0-9]+\.?[0-9]+?$/.test(b_input.value))) {
	else if(!isNaN(b_input)) {
		balance.innerHTML = Number(b_input);
	}

	else {
		console.log("Cannot update balance, syntax error!" );
	}


}

function printBalance() {
	// TODO Complete this function as described by the README.md
	var get_balance = document.getElementById("balance").innerHTML
	console.log("You have " + get_balance + " in your account!")
}

function alertBalance() {
	// TODO Complete this function as described by the README.md
	var get_balance = document.getElementById("balance").innerHTML
	if(Number(get_balance) < 0 ){
		alert(":(")
	}
	else if (Number(get_balance) > 100 ){
		alert( ":D")
	}

	else{
		alert( ":)")
	}
}

function loadFriendsAndFamilyData() {

	if (hasLoadedFriendsAndFamilyData) {
		return;
	} else {
		hasLoadedFriendsAndFamilyData = true;
	}

	let friendsAndFamilyAccounts = [
		{
			name: "Jane McCain",
			balance: 7262.71
		},
		{
			name: "Bill Phil",
			balance: 9830.02
		},
		{
			name: "Tod Cod",
			balance: 0.03
		},
		{
			name: "Karen Marin",
			balance: 72681.01
		}
	];

	// TODO Complete this function as described by the README.md
	var tableRef = document.getElementById("friendsAndFamilyBalances").getElementsByTagName('tbody')[0];
	var array_length = friendsAndFamilyAccounts.length;

	

	for(var i=0; i < array_length; i++){
		var tr = document.createElement("tr");
		var td1 = document.createElement("td");
		var td2 = document.createElement("td");
		td1.innerHTML = friendsAndFamilyAccounts[i].name;
		td2.innerHTML = friendsAndFamilyAccounts[i].balance;
		if(Number(friendsAndFamilyAccounts[i].balance ) < 1){
			td1.style.color = "red";
			td2.style.color = "red";
		}
		tr.appendChild(td1);
        tr.appendChild(td2);
		tableRef.appendChild(tr);
	}
}

function addPersonalTransactionRows() {
	// TODO Complete this function as described by the README.md

	var tableRef = document.getElementById("personalTransactions").getElementsByTagName('tbody')[0];
	var myRequest = new Request( "http://mysqlcs639.cs.wisc.edu:53706/api/badgerbank/transactions?amount=4");
	fetch(myRequest).then(function(response) {
		return response.json().then(function(json) {
			console.log(json)
			for(var i = 0; i < json.length; i++) {
				var tr = document.createElement("tr");
				var td1 = document.createElement("td");
				var td2 = document.createElement("td");
				var td3 = document.createElement("td");

				td1.innerHTML = json[i].date;
				td2.innerHTML = json[i].company;
				td3.innerHTML = json[i].amount;

				tr.appendChild(td1);
				tr.appendChild(td2);
				tr.appendChild(td3);
				tableRef.appendChild(tr);
			}
		});
		})
		.catch(function(e){
			console.log("{" + "\n" +
				"    \"error-msg:\""+  " \"Oops! Something went wrong. Check to make sure that you are sending a valid request." + 
				"Your recieved request is provided below. If it is empty, then it was most likely not provided or malformed. " +
				"If you have verified that your request is valid, please contact a CS639 administrator.\"" + "\n",
				"    \"error-req:\"" + "\"{}\"" + "\n",
				"    \"date-time:\"" + "\"8/23/2020 9:07:39 PM\""
			);
		})
	
}

function clearPersonalTransactionRows() {
	var tableRef = document.getElementById("personalTransactions").getElementsByTagName('tbody')[0];
	while(tableRef.rows.length) {
		tableRef.deleteRow(0);
	  }
	// TODO Complete this function as described by the README.md
}

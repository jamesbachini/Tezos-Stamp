const version = '0.0.2';

const tezosNode = 'https://rpc.tzkt.io/babylonnet';

const conseilServer = { url: 'https://conseil-dev.cryptonomic-infra.tech/', apiKey: '515cbd84-862e-4c23-9793-5889dd3ccc56', network: 'babylonnet' };

let credentials;
const testCredentials = JSON.parse(`{
  "mnemonic": ["when","adjust","trial","inject","melt","casual","banana","leopard","pigeon","student","rescue","system","together","opera","define"],
  "publicKey": "edpkub7akMqLMrGR376VPz6Nq55Zp61VbRu98xPcLdHX2u5dM6rDVd",
  "secretKey": "edskS22JLrH3RSsyyq43WqnftB3GS2ctDRdrUoFKbZnhKPnNnixD8woxfi7ZQ2r5drR6s2eBER52DLYrkqMps74KaJ5dEPMXsb",
  "secret": "560850e13690992257f6dbc22d78435942eddae1",
  "amount": "20130945309",
  "pkh": "tz1N1jynR8jApSVLoxoBGHNBfXNTrUiUxEXb",
  "password": "S4pvugfkaQ",
  "email": "gkavuoej.yumtexgu@tezos.example.org"
}`);

const toggleMenu = () => {
	const elem = document.getElementById('menu');
  const displayed = elem.currentStyle ? elem.currentStyle.display : window.getComputedStyle ? window.getComputedStyle(elem, null).getPropertyValue('display') : null;
  if (displayed == 'none') {
    elem.style.display = "block";
  } else {
    elem.style.display = "none";
  }
};

let keystore;

async function deployContract() {
	const contract2 = `[
		{
			"prim": "parameter",
			"args": [
				{
				"prim": "or",
				"args": [
					{
						"prim": "string",
						"annots": [
						"%getHash"
						]
					},
					{
						"prim": "string",
						"annots": [
						"%setHash"
						]
					}
				]
				}
			]
		},
		{
			"prim": "storage",
			"args": [
				{
				"prim": "string"
				}
			]
		},
		{
			"prim": "code",
			"args": [
				[
				{
					"prim": "DUP"
				},
				{
					"prim": "DUP"
				},
				{
					"prim": "CAR"
				},
				{
					"prim": "IF_LEFT",
					"args": [
						[
						{
							"prim": "DIP",
							"args": [
								[
								{
									"prim": "DUP"
								}
								]
							]
						},
						{
							"prim": "SWAP"
						},
						{
							"prim": "CDR"
						},
						{
							"prim": "DIP",
							"args": [
								[
								{
									"prim": "DROP"
								}
								]
							]
						}
						],
						[
						{
							"prim": "DUP"
						},
						{
							"prim": "DIP",
							"args": [
								[
								{
									"prim": "DROP"
								}
								]
							]
						}
						]
					]
				},
				{
					"prim": "NIL",
					"args": [
						{
						"prim": "operation"
						}
					]
				},
				{
					"prim": "PAIR"
				},
				{
					"prim": "DIP",
					"args": [
						[
						{
							"prim": "DROP",
							"args": [
								{
								"int": "2"
								}
							]
						}
						]
					]
				}
				]
			]
		}
		]`;
	const inputString = `Tezos Stamp Contract v${version}`;
	const storage = `{"string": "${inputString}"}`;
	const result = await conseiljs.TezosNodeWriter.sendContractOriginationOperation(tezosNode, keystore, 0, undefined, 100000, '', 1000, 100000, contract2, storage, conseiljs.TezosParameterFormat.Micheline);
	//console.log(`Injected operation group id ${result.operationGroupID}`);
	//console.log(result);
	const operationGroupID = result.operationGroupID.split(/[^a-zA-Z0-9]/).join('');
	document.getElementById('deploy-results').innerHTML += `TX. ${operationGroupID}<br><br>`;
	try {
		const conseilResult = await conseiljs.TezosConseilClient.awaitOperationConfirmation(conseilServer, 'babylonnet', operationGroupID, 5);
		document.getElementById('deploy-results').innerHTML += `Success - Contract Deployed<br><br>
		<a href="https://better-call.dev/babylon/${operationGroupID}" target="_blank">Block Explorer 1</a><br>
		<a href="https://babylonnet.tezblock.io/transaction/${operationGroupID}" target="_blank">Block Explorer 2</a><br><br><br>
		Originated contract at ${conseilResult[0].originated_accounts}`;
		credentials.contract = conseilResult[0].originated_accounts;
	} catch(e) {
		document.getElementById('deploy-results').innerHTML += `Success - Contract Deployed<br><br>
		<div class="warning">Unable to find contract address, (CORS issue).<br>
		Please enter contract address manually from block explorer</div><br>
		<a href="https://better-call.dev/babylon/${operationGroupID}" target="_blank">Block Explorer 1</a><br><br>
		<input type="text" class="text-input" id="contract-address" />
		<button class="btn" onclick="saveContractAddress();">Save Contract Address</button><br>`;
	}
}

function saveContractAddress() {
	credentials.contract = document.getElementById('contract-address').value;
	document.getElementById('deploy-results').innerHTML += `Contract Saved`;
}

async function invokeContract(inputString) {
	const result = await conseiljs.TezosNodeWriter.sendContractInvocationOperation(tezosNode, keystore, credentials.contract, 10000, 100000, '', 1000, 100000, 'setHash', `{"string": "${inputString}"}`, conseiljs.TezosParameterFormat.Micheline);
	//console.log(`Injected operation group id ${result.operationGroupID}`);
	const operationGroupID = result.operationGroupID.split(/[^a-zA-Z0-9]/).join('');
	document.getElementById('loading').style.display = 'none'
	const date = new Date().toUTCString();
	document.getElementById('stamp-results').innerHTML = `Success - File Timestamped To Tezos Blockchain<br><br>
	<b>Tezos Stamp Proof</b><br>
	<a href="https://better-call.dev/babylon/${result.operationGroupID.split(/[^a-zA-Z0-9]/).join('')}" target="_blank">Block Explorer 1</a><br><br>
	<div class="white">
	DATE: ${date}<br>
	TX. ${operationGroupID}
	</div><br><br>
	Your file has been hashed and the hash has been recorded permanently to the Tezos blockchain.`;
}

async function initAccount() {
	keystore = await conseiljs.TezosWalletUtil.unlockFundraiserIdentity(credentials.mnemonic.join(' '), credentials.email, credentials.password, credentials.pkh);
	//console.log(`public key: ${keystore.publicKey}`);
	//console.log(`secret key: ${keystore.privateKey}`);
	document.getElementById('credentials-results').innerHTML += `Credentials Saved.<br><br>`;
}

function saveCredentials() {
	credentials = JSON.parse(document.getElementById('credentials-input').textContent);
	initAccount();
}

function importCredentials() {
	credentials = testCredentials;
	keystore = {
		publicKey: credentials.publicKey,
		privateKey: credentials.secretKey,
		publicKeyHash: credentials.pkh,
		seed: '',
		storeType: conseiljs.StoreType.Fundraiser
	};
	document.getElementById('credentials-results').innerHTML += `Test Credentials Loaded.<br><br>`;
}

function handleDrop(e) {
	let dt = e.dataTransfer;
	let files = dt.files;
	([...files]).forEach((file) => {
		sha256File(file);
	});
}

function handleUpload(files) {
	([...files]).forEach((file) => {
		sha256File(file);
	});
}

function sha256File(file) {
	document.getElementById('loading').style.display = 'block';
	const reader = new FileReader();
	reader.onload = function(e2) {
		let sha256 = CryptoJS.algo.SHA256.create();
		sha256.update(CryptoJS.enc.Latin1.parse(e2.target.result));
		const hash = sha256.finalize();
		document.getElementById('crypto-sha256').innerHTML = `<b>FILE</b>: <span class="file-name">${file.name}</span><br>
		<b>HASH</b>: ${hash}<br>`;
		invokeContract(hash);
	}
	reader.readAsBinaryString(file);
}

const dropArea = document.getElementById('drop-area');

if (dropArea) {
	['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
		dropArea.addEventListener(eventName, preventDefaults, false)
	})
}

function preventDefaults (e) {
	e.preventDefault()
	e.stopPropagation()
}

dropArea.addEventListener('drop', handleDrop, false);

function pageLoad(page) {
	const pages = ['home','credentials','deploy','stamp'];
	pages.forEach((p) => {
		document.getElementById(p).style.display = 'none';
	});
	document.getElementById(page).style.display = 'block';
	if (screen.width < 720) {
		document.getElementById('menu').style.display = 'none';
	}
}

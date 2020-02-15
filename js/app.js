const tezosNode = 'https://rpc.tzkt.io/babylonnet';

const faucetAccount = {
  "mnemonic": [
	 "when",
	 "adjust",
	 "trial",
	 "inject",
	 "melt",
	 "casual",
	 "banana",
	 "leopard",
	 "pigeon",
	 "student",
	 "rescue",
	 "system",
	 "together",
	 "opera",
	 "define"
  ],
  "publicKey": "edpkub7akMqLMrGR376VPz6Nq55Zp61VbRu98xPcLdHX2u5dM6rDVd",
  "secretKey": "edskS22JLrH3RSsyyq43WqnftB3GS2ctDRdrUoFKbZnhKPnNnixD8woxfi7ZQ2r5drR6s2eBER52DLYrkqMps74KaJ5dEPMXsb",
  "secret": "560850e13690992257f6dbc22d78435942eddae1",
  "amount": "20130945309",
  "pkh": "tz1N1jynR8jApSVLoxoBGHNBfXNTrUiUxEXb",
  "password": "S4pvugfkaQ",
  "email": "gkavuoej.yumtexgu@tezos.example.org"
}

const keystore = {
	publicKey: faucetAccount.publicKey,
	privateKey: faucetAccount.secretKey,
	publicKeyHash: faucetAccount.pkh,
	seed: '',
	storeType: conseiljs.StoreType.Fundraiser
};

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
	const inputString = document.getElementById('input-string').value;
	const storage = `{"string": "${inputString}"}`;
	const result = await conseiljs.TezosNodeWriter.sendContractOriginationOperation(tezosNode, keystore, 0, undefined, 100000, '', 1000, 100000, contract2, storage, conseiljs.TezosParameterFormat.Micheline);
	console.log(`Injected operation group id ${result.operationGroupID}`);
	document.getElementById('results').innerHTML = `Success - <a href="https://better-call.dev/babylon/${result.operationGroupID.split(/[^a-zA-Z0-9]/).join('')}" target="_blank">Block Explorer</a><br>Ref. ${result.operationGroupID}`;
}


async function invokeContract() {
	const inputString = document.getElementById('input-string').value;
	const contractAddress = document.getElementById('contract-address').value;
	const result = await conseiljs.TezosNodeWriter.sendContractInvocationOperation(tezosNode, keystore, contractAddress, 10000, 100000, '', 1000, 100000, 'setHash', `{"string": "${inputString}"}`, conseiljs.TezosParameterFormat.Micheline);
	console.log(`Injected operation group id ${result.operationGroupID}`);
	document.getElementById('results').innerHTML = `Success - <a href="https://better-call.dev/babylon/${result.operationGroupID.split(/[^a-zA-Z0-9]/).join('')}" target="_blank">Block Explorer</a><br>Ref. ${result.operationGroupID}`;
}

invokeContract();

async function initAccount() {
	const keystore = await conseiljs.TezosWalletUtil.unlockFundraiserIdentity(faucetAccount.mnemonic.join(' '), faucetAccount.email, faucetAccount.password, faucetAccount.pkh);
	console.log(`public key: ${keystore.publicKey}`);
	console.log(`secret key: ${keystore.privateKey}`);
}

//initAccount();


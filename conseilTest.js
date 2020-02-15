const conseiljs = require('conseiljs');
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

async function deployContract() {
    const keystore = {
        publicKey: faucetAccount.publicKey,
        privateKey: faucetAccount.secretKey,
        publicKeyHash: faucetAccount.pkh,
        seed: '',
        storeType: conseiljs.StoreType.Fundraiser
    };
    const contract = `[
        {
           "prim":"parameter",
           "args":[ { "prim":"string" } ]
        },
        {
           "prim":"storage",
           "args":[ { "prim":"string" } ]
        },
        {
           "prim":"code",
           "args":[
              [  
                 { "prim":"CAR" },
                 { "prim":"NIL", "args":[ { "prim":"operation" } ] },
                 { "prim":"PAIR" }
              ]
           ]
        }
     ]`;
    const storage = '{"string": "Hello Tezos"}';

    const result = await conseiljs.TezosNodeWriter.sendContractOriginationOperation(tezosNode, keystore, 0, undefined, 100000, '', 1000, 100000, contract, storage, conseiljs.TezosParameterFormat.Micheline);
    console.log(`Injected operation group id ${result.operationGroupID}`);
}




async function initAccount() {
    const keystore = await conseiljs.TezosWalletUtil.unlockFundraiserIdentity(faucetAccount.mnemonic.join(' '), faucetAccount.email, faucetAccount.password, faucetAccount.pkh);
    console.log(`public key: ${keystore.publicKey}`);
    console.log(`secret key: ${keystore.privateKey}`);
}

//initAccount();

deployContract();
type storage = string; // Sha256 Hash Hex String

type action =
  | SetHash(string)
  | GetHash(string);

let setHash = ((a,b): (string, string)): string => b; // Replace current hash with new hash
let getHash = ((a,b): (string, string)): string => a; // Return existing hash

let main = ((p,storage): (action, storage)) => {
  let storage =
    switch (p) {
    | SetHash(n) => setHash((storage, n))
    | GetHash(n) => getHash((storage, n)) // still requires a unused string variable
    };
  ([]: list(operation), storage);
};

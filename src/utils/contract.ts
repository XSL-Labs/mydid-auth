import { Web3Provider } from "../web3Provider";
import { DIDDocument } from "../models/DIDDocument";

export async function getDIDDocumentForAddress(address: string): Promise<DIDDocument> {
  const response = await Web3Provider.getInstance().getContract().methods.getDID(address).call();
  return response && response["0"] == address
    ? new DIDDocument(response[0], response[1], response[2])
    : null;
}

export async function isIssuerForAddress(address: string): Promise<boolean> {
  return Web3Provider.getInstance().getContract().methods.isIssuer(address).call();
}

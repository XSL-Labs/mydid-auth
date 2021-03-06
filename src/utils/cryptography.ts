import crypto from "crypto";
import { BinaryToTextEncoding } from "crypto";
import { Web3Provider } from "../web3Provider";
import { toChecksumAddress } from "ethereum-checksum-address";
import { recoverTypedSignature, TypedMessage, MessageTypes, SignTypedDataVersion } from "@metamask/eth-sig-util";

export function recoverAddress(signature: string, document: string): string {
  const messageHash = hashSHA256(document);
  const v = "0x" + signature.slice(0, 2);
  const r = "0x" + signature.slice(2, 66);
  const s = "0x" + signature.slice(66, 130);
  return Web3Provider.getInstance().web3.eth.accounts.recover({ messageHash, v, r, s });
}

export function hashSHA256(message: string): string {
  return (
    "0x" +
    crypto
      .createHash("sha256")
      .update(message)
      .digest("hex" as BinaryToTextEncoding)
  );
}

export function recoverTypedSignatureV4(vc: object, signature: string) {
  const typedData = {
    domain: {
      chainId: Web3Provider.getInstance().getChainId().valueOf(),
      name: "myDid",
      verifyingContract: "0x7e52a123ed6db6ac872a875552935fbbd2544c86",
      version: "1",
    },
    message: vc,
    primaryType: "VerifiableCredential",
    types: {
      EIP712Domain: [
        {
          name: "name",
          type: "string",
        },
        {
          name: "version",
          type: "string",
        },
        {
          name: "chainId",
          type: "uint256",
        },
        {
          name: "verifyingContract",
          type: "address",
        },
      ],
      VerifiableCredential: [
        {
          name: "@context",
          type: "string[]",
        },
        {
          name: "type",
          type: "string[]",
        },
        {
          name: "issuer",
          type: "string",
        },
        {
          name: "issuanceDate",
          type: "string",
        },
        {
          name: "credentialSubject",
          type: "CredentialSubject",
        },
      ],
      CredentialSubject: [
        {
          name: "type",
          type: "string",
        },
        {
          name: "id",
          type: "string",
        },
      ],
    },
  };
  return toChecksumAddress(
    recoverTypedSignature({
      data: typedData as TypedMessage<MessageTypes>,
      signature: signature,
      version: SignTypedDataVersion.V4,
    })
  );
}

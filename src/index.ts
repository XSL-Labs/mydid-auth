import { Web3Provider } from "./web3Provider";
import { VerifiablePresentationRequest } from "./models/VerifiablePresentationRequest";
import { VerifiablePresentation } from "./models/VerifiablePresentation";
import { isVerifiablePresentationSchema } from "./utils/schema";
import { checkVPSignature, checkVCSignature, checkVCIssuer } from "./utils/verifications";

const mydidAuth = {
  initialize: (config: object): void => {
    Web3Provider.getInstance().initialize(config["web3GivenProvider"], config["smartContractAddress"]);
  },

  createVPRequest: (challenge: string, domain: string, verifiableCredentials: string[]) => {
    return new VerifiablePresentationRequest(challenge, domain, verifiableCredentials);
  },

  validateVPConsistency: (VPData: object): boolean => {
    if (!isVerifiablePresentationSchema(VPData)) throw "Incorrect format for verifiable presentation";

    const verifiablePresentation: VerifiablePresentation = VPData as VerifiablePresentation;

    if (verifiablePresentation.verifiableCredential) {
      for (const verifiableCredential of verifiablePresentation.verifiableCredential) {
        if (verifiableCredential.credentialSubject.id != verifiablePresentation.id)
          throw "Incorrect id in credential subjects";
      }
    }

    return true;
  },

  validateVPAuthenticity: async (VPData: object): Promise<boolean> => {
    var verifiablePresentation: VerifiablePresentation = VPData as VerifiablePresentation;

    if (verifiablePresentation.verifiableCredential) {
      for (const verifiableCredential of verifiablePresentation.verifiableCredential) {
        if (!(await checkVCSignature(verifiableCredential))) throw "Incorrect VC signature";
        if (!(await checkVCIssuer(verifiableCredential))) throw "Incorrect VC issuer";
      }
    }

    if (!(await checkVPSignature(verifiablePresentation))) throw "Incorrect VP signature";

    return true;
  },
};

module.exports = mydidAuth;
export default mydidAuth;

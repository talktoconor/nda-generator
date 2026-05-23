export type NdaType = "mutual" | "unilateral";

export interface NdaData {
  ndaType: NdaType;
  disclosingPartyName: string;
  disclosingPartyAddress: string;
  receivingPartyName: string;
  receivingPartyAddress: string;
  purpose: string;
  durationYears: number;
  governingState: string;
  effectiveDate: string;
}

export function generateNdaText(data: NdaData): string {
  const isMutual = data.ndaType === "mutual";
  const partyALabel = isMutual ? '"Party A"' : '"Disclosing Party"';
  const partyBLabel = isMutual ? '"Party B"' : '"Receiving Party"';

  return `NON-DISCLOSURE AGREEMENT

This Non-Disclosure Agreement ("Agreement") is entered into as of ${data.effectiveDate} ("Effective Date") by and between:

${data.disclosingPartyName}, with a principal address at ${data.disclosingPartyAddress} (hereinafter referred to as ${partyALabel}), and

${data.receivingPartyName}, with a principal address at ${data.receivingPartyAddress} (hereinafter referred to as ${partyBLabel}).

${partyALabel} and ${partyBLabel} are collectively referred to as the "Parties" and individually as a "Party."

1. PURPOSE

The Parties wish to explore a potential business relationship concerning: ${data.purpose} (the "Purpose"). In connection with the Purpose, ${isMutual ? "each Party" : "the Disclosing Party"} may disclose certain confidential and proprietary information to ${isMutual ? "the other Party" : "the Receiving Party"}.

2. DEFINITION OF CONFIDENTIAL INFORMATION

"Confidential Information" means any and all non-public information, in any form or medium, whether written, oral, electronic, or otherwise, that is disclosed by ${isMutual ? "either Party" : "the Disclosing Party"} to ${isMutual ? "the other Party" : "the Receiving Party"}, including but not limited to:

(a) Trade secrets, inventions, ideas, processes, formulas, source and object code, data, programs, software, other works of authorship, know-how, improvements, discoveries, developments, designs, and techniques;

(b) Business plans, financial information, customer lists, supplier information, pricing strategies, marketing plans, and projections;

(c) Information regarding personnel, legal affairs, and business operations; and

(d) Any information that a reasonable person would understand to be confidential given the nature of the information and the circumstances of disclosure.

3. OBLIGATIONS OF ${isMutual ? "THE PARTIES" : "THE RECEIVING PARTY"}

${isMutual ? "Each Party" : "The Receiving Party"} agrees to:

(a) Hold all Confidential Information in strict confidence and not disclose it to any third party without the prior written consent of the ${isMutual ? "disclosing Party" : "Disclosing Party"};

(b) Use the Confidential Information solely for the Purpose and not for any other purpose;

(c) Restrict access to Confidential Information to those employees, agents, or representatives who have a need to know and who are bound by obligations of confidentiality at least as restrictive as those contained herein;

(d) Protect the Confidential Information with at least the same degree of care used to protect its own confidential information, but in no event less than reasonable care; and

(e) Promptly notify the ${isMutual ? "disclosing Party" : "Disclosing Party"} of any unauthorized use or disclosure of Confidential Information.

4. EXCLUSIONS

Confidential Information does not include information that:

(a) Was publicly known at the time of disclosure or becomes publicly known through no fault of the ${isMutual ? "receiving Party" : "Receiving Party"};

(b) Was known to the ${isMutual ? "receiving Party" : "Receiving Party"} prior to receiving it from the ${isMutual ? "disclosing Party" : "Disclosing Party"}, as evidenced by written records;

(c) Is received from a third party without restriction on disclosure and without breach of a nondisclosure obligation;

(d) Is independently developed by the ${isMutual ? "receiving Party" : "Receiving Party"} without reference to or use of the Confidential Information; or

(e) Is required to be disclosed by law, regulation, or court order, provided that the ${isMutual ? "receiving Party" : "Receiving Party"} gives the ${isMutual ? "disclosing Party" : "Disclosing Party"} prompt written notice and cooperates in seeking a protective order.

5. TERM AND TERMINATION

This Agreement shall remain in effect for a period of ${data.durationYears} year${data.durationYears > 1 ? "s" : ""} from the Effective Date. Either Party may terminate this Agreement at any time by providing thirty (30) days' written notice to the other Party. The obligations of confidentiality shall survive termination for a period of ${data.durationYears} year${data.durationYears > 1 ? "s" : ""} following the date of termination.

6. RETURN OF MATERIALS

Upon termination of this Agreement or upon request by the ${isMutual ? "disclosing Party" : "Disclosing Party"}, the ${isMutual ? "receiving Party" : "Receiving Party"} shall promptly return or destroy all copies of Confidential Information in its possession and certify in writing that it has done so.

7. NO LICENSE

Nothing in this Agreement grants ${isMutual ? "either Party" : "the Receiving Party"} any license or rights under any patent, copyright, trademark, or other intellectual property right of the ${isMutual ? "other Party" : "Disclosing Party"}.

8. REMEDIES

${isMutual ? "Each Party" : "The Receiving Party"} acknowledges that any breach of this Agreement may cause irreparable harm to the ${isMutual ? "other Party" : "Disclosing Party"} and that monetary damages may be inadequate. Accordingly, the ${isMutual ? "non-breaching Party" : "Disclosing Party"} shall be entitled to seek equitable relief, including injunction and specific performance, in addition to all other remedies available at law or in equity.

9. GOVERNING LAW

This Agreement shall be governed by and construed in accordance with the laws of the State of ${data.governingState}, without regard to its conflict of laws principles.

10. ENTIRE AGREEMENT

This Agreement constitutes the entire agreement between the Parties concerning the subject matter hereof and supersedes all prior agreements, understandings, negotiations, and discussions, whether oral or written.

11. AMENDMENTS

This Agreement may not be amended or modified except by a written instrument signed by both Parties.

12. SEVERABILITY

If any provision of this Agreement is found to be invalid or unenforceable, the remaining provisions shall remain in full force and effect.

13. COUNTERPARTS

This Agreement may be executed in counterparts, each of which shall be deemed an original and all of which together shall constitute one and the same instrument.

IN WITNESS WHEREOF, the Parties have executed this Agreement as of the Effective Date.


____________________________________
${data.disclosingPartyName}

Name: ___________________________
Title: ___________________________
Date: ___________________________


____________________________________
${data.receivingPartyName}

Name: ___________________________
Title: ___________________________
Date: ___________________________`;
}

import type { NdaData } from "./nda-template";

export function generateNdaHtml(data: NdaData): string {
  const isMutual = data.ndaType === "mutual";
  const partyALabel = isMutual ? "&ldquo;Party A&rdquo;" : "&ldquo;Disclosing Party&rdquo;";
  const partyBLabel = isMutual ? "&ldquo;Party B&rdquo;" : "&ldquo;Receiving Party&rdquo;";

  return `<!DOCTYPE html>
<html>
<head>
<style>
  body { font-family: Georgia, serif; font-size: 12pt; line-height: 1.6; color: #111; max-width: 700px; margin: 40px auto; padding: 0 20px; }
  h1 { text-align: center; font-size: 18pt; margin-bottom: 30px; letter-spacing: 1px; }
  h2 { font-size: 12pt; margin-top: 24px; margin-bottom: 8px; }
  p { margin: 8px 0; text-align: justify; }
  .parties { margin: 20px 0; }
  .sig-block { margin-top: 50px; page-break-inside: avoid; }
  .sig-line { border-bottom: 1px solid #333; width: 300px; margin-top: 40px; margin-bottom: 4px; }
  .sig-field { margin: 4px 0; }
  .sig-field span { display: inline-block; border-bottom: 1px solid #999; width: 200px; margin-left: 8px; }
</style>
</head>
<body>

<h1>NON-DISCLOSURE AGREEMENT</h1>

<p>This Non-Disclosure Agreement (&ldquo;Agreement&rdquo;) is entered into as of <strong>${data.effectiveDate}</strong> (&ldquo;Effective Date&rdquo;) by and between:</p>

<div class="parties">
<p><strong>${data.disclosingPartyName}</strong>, with a principal address at ${data.disclosingPartyAddress} (hereinafter referred to as ${partyALabel}), and</p>
<p><strong>${data.receivingPartyName}</strong>, with a principal address at ${data.receivingPartyAddress} (hereinafter referred to as ${partyBLabel}).</p>
<p>${partyALabel} and ${partyBLabel} are collectively referred to as the &ldquo;Parties&rdquo; and individually as a &ldquo;Party.&rdquo;</p>
</div>

<h2>1. PURPOSE</h2>
<p>The Parties wish to explore a potential business relationship concerning: <strong>${data.purpose}</strong> (the &ldquo;Purpose&rdquo;). In connection with the Purpose, ${isMutual ? "each Party" : "the Disclosing Party"} may disclose certain confidential and proprietary information to ${isMutual ? "the other Party" : "the Receiving Party"}.</p>

<h2>2. DEFINITION OF CONFIDENTIAL INFORMATION</h2>
<p>&ldquo;Confidential Information&rdquo; means any and all non-public information, in any form or medium, whether written, oral, electronic, or otherwise, that is disclosed by ${isMutual ? "either Party" : "the Disclosing Party"} to ${isMutual ? "the other Party" : "the Receiving Party"}, including but not limited to:</p>
<p>(a) Trade secrets, inventions, ideas, processes, formulas, source and object code, data, programs, software, other works of authorship, know-how, improvements, discoveries, developments, designs, and techniques;</p>
<p>(b) Business plans, financial information, customer lists, supplier information, pricing strategies, marketing plans, and projections;</p>
<p>(c) Information regarding personnel, legal affairs, and business operations; and</p>
<p>(d) Any information that a reasonable person would understand to be confidential given the nature of the information and the circumstances of disclosure.</p>

<h2>3. OBLIGATIONS OF ${isMutual ? "THE PARTIES" : "THE RECEIVING PARTY"}</h2>
<p>${isMutual ? "Each Party" : "The Receiving Party"} agrees to:</p>
<p>(a) Hold all Confidential Information in strict confidence and not disclose it to any third party without the prior written consent of the ${isMutual ? "disclosing Party" : "Disclosing Party"};</p>
<p>(b) Use the Confidential Information solely for the Purpose and not for any other purpose;</p>
<p>(c) Restrict access to Confidential Information to those employees, agents, or representatives who have a need to know and who are bound by obligations of confidentiality at least as restrictive as those contained herein;</p>
<p>(d) Protect the Confidential Information with at least the same degree of care used to protect its own confidential information, but in no event less than reasonable care; and</p>
<p>(e) Promptly notify the ${isMutual ? "disclosing Party" : "Disclosing Party"} of any unauthorized use or disclosure of Confidential Information.</p>

<h2>4. EXCLUSIONS</h2>
<p>Confidential Information does not include information that:</p>
<p>(a) Was publicly known at the time of disclosure or becomes publicly known through no fault of the ${isMutual ? "receiving Party" : "Receiving Party"};</p>
<p>(b) Was known to the ${isMutual ? "receiving Party" : "Receiving Party"} prior to receiving it from the ${isMutual ? "disclosing Party" : "Disclosing Party"}, as evidenced by written records;</p>
<p>(c) Is received from a third party without restriction on disclosure and without breach of a nondisclosure obligation;</p>
<p>(d) Is independently developed by the ${isMutual ? "receiving Party" : "Receiving Party"} without reference to or use of the Confidential Information; or</p>
<p>(e) Is required to be disclosed by law, regulation, or court order, provided that the ${isMutual ? "receiving Party" : "Receiving Party"} gives the ${isMutual ? "disclosing Party" : "Disclosing Party"} prompt written notice and cooperates in seeking a protective order.</p>

<h2>5. TERM AND TERMINATION</h2>
<p>This Agreement shall remain in effect for a period of ${data.durationYears} year${data.durationYears > 1 ? "s" : ""} from the Effective Date. Either Party may terminate this Agreement at any time by providing thirty (30) days&rsquo; written notice to the other Party. The obligations of confidentiality shall survive termination for a period of ${data.durationYears} year${data.durationYears > 1 ? "s" : ""} following the date of termination.</p>

<h2>6. RETURN OF MATERIALS</h2>
<p>Upon termination of this Agreement or upon request by the ${isMutual ? "disclosing Party" : "Disclosing Party"}, the ${isMutual ? "receiving Party" : "Receiving Party"} shall promptly return or destroy all copies of Confidential Information in its possession and certify in writing that it has done so.</p>

<h2>7. NO LICENSE</h2>
<p>Nothing in this Agreement grants ${isMutual ? "either Party" : "the Receiving Party"} any license or rights under any patent, copyright, trademark, or other intellectual property right of the ${isMutual ? "other Party" : "Disclosing Party"}.</p>

<h2>8. REMEDIES</h2>
<p>${isMutual ? "Each Party" : "The Receiving Party"} acknowledges that any breach of this Agreement may cause irreparable harm to the ${isMutual ? "other Party" : "Disclosing Party"} and that monetary damages may be inadequate. Accordingly, the ${isMutual ? "non-breaching Party" : "Disclosing Party"} shall be entitled to seek equitable relief, including injunction and specific performance, in addition to all other remedies available at law or in equity.</p>

<h2>9. GOVERNING LAW</h2>
<p>This Agreement shall be governed by and construed in accordance with the laws of the State of <strong>${data.governingState}</strong>, without regard to its conflict of laws principles.</p>

<h2>10. ENTIRE AGREEMENT</h2>
<p>This Agreement constitutes the entire agreement between the Parties concerning the subject matter hereof and supersedes all prior agreements, understandings, negotiations, and discussions, whether oral or written.</p>

<h2>11. AMENDMENTS</h2>
<p>This Agreement may not be amended or modified except by a written instrument signed by both Parties.</p>

<h2>12. SEVERABILITY</h2>
<p>If any provision of this Agreement is found to be invalid or unenforceable, the remaining provisions shall remain in full force and effect.</p>

<h2>13. COUNTERPARTS</h2>
<p>This Agreement may be executed in counterparts, each of which shall be deemed an original and all of which together shall constitute one and the same instrument.</p>

</body>
</html>`;
}

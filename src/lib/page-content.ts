// ── Static content generator for programmatic SEO pages ──
// In production, this would be replaced by AI-generated content stored in JSON files.
// For now, generates solid template-based content per category.

import type { PageCategory } from "./seo-data";

interface PageContent {
  h1: string;
  intro: string;
  sections: { heading: string; body: string }[];
  faqs: { q: string; a: string }[];
  ctaContext: string;
}

export function getPageContent(
  category: PageCategory,
  data: Record<string, string>
): PageContent {
  switch (category) {
    case "type":
      return getTypeContent(data);
    case "industry":
      return getIndustryContent(data);
    case "use-case":
      return getUseCaseContent(data);
    case "state":
      return getStateContent(data);
    case "cross":
      return getCrossContent(data);
    default:
      return getFallback();
  }
}

function getTypeContent(d: Record<string, string>): PageContent {
  return {
    h1: `${d.title} Generator — Create Yours in Minutes`,
    intro: `A ${d.title.toLowerCase()} is one of the most common forms of confidentiality agreement used in business today. Whether you’re sharing proprietary information with a partner, vendor, or employee, having a properly drafted ${d.title.toLowerCase()} protects your interests and establishes clear legal boundaries. NDANow lets you create a customized ${d.title.toLowerCase()} in under five minutes — no lawyer required.`,
    sections: [
      {
        heading: `What is a ${d.title}?`,
        body: `A ${d.title.toLowerCase()} is a legally binding contract that establishes a confidential relationship between parties. It defines what information is considered confidential, the obligations of each party, the duration of the agreement, and the consequences of a breach. This type of NDA is commonly used across industries whenever sensitive business information needs to be shared.`,
      },
      {
        heading: `When to use a ${d.title}`,
        body: `You should consider using a ${d.title.toLowerCase()} whenever confidential information will be shared in a business context. Common scenarios include partnership discussions, hiring processes, vendor negotiations, investor pitches, and joint development projects. Having an NDA in place before sharing any sensitive information is a best practice that can save significant legal costs down the road.`,
      },
      {
        heading: "Key clauses to include",
        body: "Every well-drafted NDA should include: a clear definition of confidential information, the obligations of the receiving party, exclusions from confidentiality (such as publicly available information), the term and duration of the agreement, remedies for breach, and the governing jurisdiction. NDANow automatically includes all of these clauses, customized to your specific situation.",
      },
      {
        heading: "Common mistakes to avoid",
        body: "The most common NDA mistakes include defining confidential information too broadly or too narrowly, failing to specify a reasonable duration, not including standard exclusions, omitting jurisdiction and governing law provisions, and using outdated or generic templates that don’t account for your specific industry or use case.",
      },
    ],
    faqs: [
      { q: `Is a ${d.title.toLowerCase()} legally enforceable?`, a: `Yes. A ${d.title.toLowerCase()} is a legally binding contract enforceable in all 50 US states, provided it contains reasonable terms, is signed by both parties, and involves legitimate confidential information. Our NDAs include all necessary elements for enforceability.` },
      { q: `How long does a ${d.title.toLowerCase()} typically last?`, a: "Most NDAs last between 1 and 5 years, with 2 years being the most common duration. The appropriate length depends on the nature of the confidential information and the business relationship." },
      { q: "Do I need a lawyer to create an NDA?", a: "For standard business NDAs, a lawyer is not required. NDANow generates professionally drafted NDAs using the same legal language attorneys use, at a fraction of the cost. For highly complex or unusual situations, consulting an attorney may be advisable." },
    ],
    ctaContext: `Create a professionally drafted ${d.title.toLowerCase()} in under 5 minutes. Customized to your needs with built-in e-signature.`,
  };
}

function getIndustryContent(d: Record<string, string>): PageContent {
  return {
    h1: `NDA for ${d.title} — Protect Your Business`,
    intro: `The ${d.title.toLowerCase()} industry relies on confidential information — from proprietary processes and client data to strategic plans and intellectual property. A well-drafted NDA is essential for protecting your competitive advantage. NDANow creates NDAs specifically tailored for ${d.title.toLowerCase()} businesses, with industry-appropriate clauses and terminology.`,
    sections: [
      {
        heading: `Why ${d.title} companies need NDAs`,
        body: `In the ${d.title.toLowerCase()} industry, confidential information is often your most valuable asset. Whether you’re sharing product roadmaps with potential partners, discussing financials with investors, or onboarding new employees with access to trade secrets, an NDA establishes clear legal protection. Without one, you have limited legal recourse if sensitive information is disclosed.`,
      },
      {
        heading: `Key considerations for ${d.title.toLowerCase()} NDAs`,
        body: `${d.title} NDAs should clearly define what constitutes confidential information in your industry context, specify appropriate duration based on how quickly information becomes stale in your field, include provisions for industry-specific regulatory requirements, and address both digital and physical forms of information sharing.`,
      },
      {
        heading: "Recommended NDA clauses",
        body: "For this industry, we recommend including comprehensive definitions of confidential information, non-solicitation provisions where applicable, return-of-materials clauses covering both physical and digital assets, specific remedies including injunctive relief, and appropriate governing law selection. NDANow automatically includes all relevant clauses.",
      },
    ],
    faqs: [
      { q: `What should a ${d.title.toLowerCase()} NDA include?`, a: `A ${d.title.toLowerCase()} NDA should include a clear definition of confidential information relevant to your industry, obligations of the receiving party, standard exclusions, a reasonable duration (typically 2-3 years), return-of-materials provisions, and remedies for breach.` },
      { q: `How much does an NDA for ${d.title.toLowerCase()} cost?`, a: `Lawyers typically charge $300-$800 for a standard NDA. NDANow creates professionally drafted NDAs for ${d.title.toLowerCase()} businesses starting at $29, with the same legal language and enforceability.` },
      { q: "Can I customize the NDA for my specific needs?", a: "Yes. NDANow’s NDA generator lets you specify parties, purpose, duration, jurisdiction, and NDA type (mutual or unilateral). Professional and Business tier customers can further customize individual clauses." },
    ],
    ctaContext: `Create an NDA tailored for the ${d.title.toLowerCase()} industry. Professional clauses, instant delivery, built-in e-signature.`,
  };
}

function getUseCaseContent(d: Record<string, string>): PageContent {
  return {
    h1: `NDA for ${d.title} — Ready in Minutes`,
    intro: `When you’re ${d.title.toLowerCase()}, protecting confidential information should be one of your first steps. A properly drafted NDA ensures that sensitive business details shared during the process remain protected. NDANow makes it easy to create a customized NDA for ${d.title.toLowerCase()} in under five minutes.`,
    sections: [
      {
        heading: `Why you need an NDA for ${d.title.toLowerCase()}`,
        body: `${d.title} often involves sharing sensitive information — financial data, business strategies, customer lists, intellectual property, or proprietary processes. Without an NDA in place, this information could be used against you or shared with competitors. An NDA establishes legal protection and creates clear expectations about confidentiality from the start.`,
      },
      {
        heading: "Best practices",
        body: `When using an NDA for ${d.title.toLowerCase()}, sign the agreement before sharing any confidential information. Be specific about what constitutes confidential information in your context. Choose an appropriate duration — the NDA should last at least as long as the information remains valuable. Consider whether a mutual or unilateral NDA is more appropriate for your situation.`,
      },
      {
        heading: "What to include",
        body: "Your NDA should clearly identify the parties, define the purpose of the disclosure, specify what information is confidential, outline the obligations of each party, set a reasonable term, and include provisions for the return or destruction of confidential materials. NDANow includes all of these elements automatically.",
      },
    ],
    faqs: [
      { q: `Do I really need an NDA for ${d.title.toLowerCase()}?`, a: `Yes. Whenever you’re sharing confidential business information during ${d.title.toLowerCase()}, an NDA is strongly recommended. It’s a small investment that provides significant legal protection.` },
      { q: "Should I use a mutual or unilateral NDA?", a: `For ${d.title.toLowerCase()}, the right choice depends on whether both parties will be sharing confidential information (mutual) or only one party (unilateral). NDANow lets you choose the appropriate type during the generation process.` },
      { q: "How quickly can I get my NDA?", a: "With NDANow, you can create and send your NDA for e-signature in under 5 minutes. Both parties receive an email to sign electronically, and the fully executed document is delivered automatically." },
    ],
    ctaContext: `Get a professionally drafted NDA for ${d.title.toLowerCase()}. Create it in minutes, send for e-signature instantly.`,
  };
}

function getStateContent(d: Record<string, string>): PageContent {
  return {
    h1: `NDA for ${d.title} — ${d.abbr} Enforceable Agreement`,
    intro: `Creating an NDA that’s enforceable in ${d.title} requires understanding the state’s specific legal framework. ${d.title} courts generally enforce NDAs that contain reasonable terms, clear definitions, and appropriate scope. NDANow generates NDAs with ${d.title} as the governing jurisdiction, ensuring your agreement aligns with state requirements.`,
    sections: [
      {
        heading: `NDA enforceability in ${d.title}`,
        body: `${d.title} generally recognizes and enforces NDAs under both contract law and trade secret statutes. Courts in ${d.title} will evaluate whether the NDA has reasonable scope, duration, and geographic limitations. Overly broad or unreasonable restrictions may be modified or struck down. NDANow’s templates use standard terms that ${d.title} courts have consistently upheld.`,
      },
      {
        heading: `${d.title} trade secret protection`,
        body: `${d.title} provides trade secret protection through state statutes that generally align with the Uniform Trade Secrets Act (UTSA). An NDA works alongside these statutory protections to create a stronger legal framework for your confidential information. Having a signed NDA in place can significantly strengthen your position if you need to pursue legal action for trade secret misappropriation in ${d.title}.`,
      },
      {
        heading: "Key clauses for enforceability",
        body: `To maximize enforceability in ${d.title}, your NDA should include a specific and reasonable definition of confidential information, a clear statement of the purpose, obligations that are proportionate to the type of information being protected, a reasonable time period, and a ${d.title} governing law clause. NDANow automatically includes all of these elements when you select ${d.title} as your jurisdiction.`,
      },
    ],
    faqs: [
      { q: `Are NDAs enforceable in ${d.title}?`, a: `Yes. NDAs are generally enforceable in ${d.title} when they contain reasonable terms, clearly define confidential information, and are supported by adequate consideration. Courts may modify overly broad provisions rather than invalidating the entire agreement.` },
      { q: `What makes an NDA valid in ${d.title}?`, a: `A valid NDA in ${d.title} requires: mutual agreement between the parties, consideration (something of value exchanged), a clear definition of confidential information, reasonable scope and duration, and signatures from all parties.` },
      { q: `How long can an NDA last in ${d.title}?`, a: `${d.title} courts generally enforce NDA durations of 1-5 years for most business relationships. The appropriate duration depends on the nature of the confidential information. Trade secrets may warrant longer protection periods.` },
    ],
    ctaContext: `Create an NDA governed by ${d.title} law. Enforceable, professional, and ready for e-signature in minutes.`,
  };
}

function getCrossContent(d: Record<string, string>): PageContent {
  return {
    h1: `NDA for ${d.industry} — ${d.useCase}`,
    intro: `When ${d.industry.toLowerCase()} companies engage in ${d.useCase.toLowerCase()}, protecting confidential information is critical. This specific combination of industry and use case has unique considerations that a generic NDA template may not address. NDANow creates NDAs tailored to your exact situation, with appropriate clauses for ${d.industry.toLowerCase()} ${d.useCase.toLowerCase()}.`,
    sections: [
      {
        heading: `Why ${d.industry.toLowerCase()} ${d.useCase.toLowerCase()} needs an NDA`,
        body: `The ${d.industry.toLowerCase()} industry involves highly sensitive information, and ${d.useCase.toLowerCase()} scenarios typically require sharing proprietary details. An NDA ensures that both parties understand their obligations regarding confidentiality, reducing risk and building trust from the start.`,
      },
      {
        heading: "Recommended approach",
        body: `For ${d.industry.toLowerCase()} companies involved in ${d.useCase.toLowerCase()}, we recommend a mutual NDA in most cases, with a duration of 2-3 years. Be specific about what constitutes confidential information in your industry context, and include provisions for the return or destruction of materials at the end of the relationship.`,
      },
    ],
    faqs: [
      { q: `What type of NDA is best for ${d.industry.toLowerCase()} ${d.useCase.toLowerCase()}?`, a: "In most cases, a mutual NDA is recommended when both parties will be sharing confidential information. If only one party is disclosing information, a unilateral NDA is more appropriate. NDANow lets you choose the right type during the generation process." },
      { q: "How quickly can I create this NDA?", a: "NDANow generates your customized NDA in under 5 minutes. After payment, both parties receive an email to sign electronically. The entire process from creation to signature can be completed in the same day." },
    ],
    ctaContext: `Create an NDA for ${d.industry.toLowerCase()} ${d.useCase.toLowerCase()}. Tailored clauses, instant delivery, built-in e-signature.`,
  };
}

function getFallback(): PageContent {
  return {
    h1: "Create a Professional NDA",
    intro: "Generate a legally-sound NDA in minutes with NDANow.",
    sections: [],
    faqs: [],
    ctaContext: "Create your NDA now. Professional clauses, instant delivery.",
  };
}

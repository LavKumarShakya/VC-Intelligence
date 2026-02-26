import { Company, EnrichmentResult } from "@/types";

export const MOCK_COMPANIES: Company[] = [
    {
        id: "comp-1",
        name: "Scale AI",
        industry: "AI",
        stage: "Growth",
        location: "San Francisco, USA",
        website: "https://scale.com",
        description:
            "Provides data labeling and infrastructure to accelerate the development of AI applications and large language models.",
        founded: 2016,
        signalsCount: 42,
        lastEnriched: null,
        signals: []
    },
    {
        id: "comp-2",
        name: "Vanta",
        industry: "Cybersecurity",
        stage: "Growth",
        location: "San Francisco, USA",
        website: "https://vanta.com",
        description:
            "Automates compliance and security monitoring for companies seeking SOC 2, ISO 27001, and HIPAA certifications.",
        founded: 2018,
        signalsCount: 28,
        lastEnriched: null,
        signals: []
    },
    {
        id: "comp-3",
        name: "Neon",
        industry: "Data Infrastructure",
        stage: "Series B",
        location: "San Francisco, USA",
        website: "https://neon.com",
        description:
            "An open-source, serverless Postgres database designed for modern cloud-native development workflows.",
        founded: 2021,
        signalsCount: 15,
        lastEnriched: null,
        signals: []
    },
    {
        id: "comp-4",
        name: "Weights & Biases",
        industry: "AI / Developer Tools",
        stage: "Growth",
        location: "San Francisco, USA",
        website: "https://wandb.ai",
        description:
            "Offers developer tools for machine learning, including experiment tracking, dataset versioning, and model management.",
        founded: 2017,
        signalsCount: 33,
        lastEnriched: null,
        signals: []
    },
    {
        id: "comp-5",
        name: "Watershed",
        industry: "Climate Tech",
        stage: "Growth",
        location: "San Francisco, USA",
        website: "https://watershed.com",
        description:
            "An enterprise climate platform that helps companies measure, report, and reduce their carbon footprint.",
        founded: 2021,
        signalsCount: 21,
        lastEnriched: null,
        signals: []
    },
    {
        id: "comp-7",
        name: "Temporal",
        industry: "Developer Tools",
        stage: "Growth",
        location: "Seattle, USA",
        website: "https://temporal.io",
        description:
            "Provides an open-source workflow orchestration engine to manage distributed application state and reliability.",
        founded: 2019,
        signalsCount: 24,
        lastEnriched: null,
        signals: []
    },
    {
        id: "comp-8",
        name: "LangChain",
        industry: "AI / Developer Tools",
        stage: "Series B",
        location: "San Francisco, USA",
        website: "https://langchain.com",
        description:
            "A framework for building context-aware reasoning applications powered by large language models.",
        founded: 2022,
        signalsCount: 12,
        lastEnriched: null,
        signals: []
    },
    {
        id: "comp-9",
        name: "Modern Treasury",
        industry: "Fintech",
        stage: "Growth",
        location: "San Francisco, USA",
        website: "https://moderntreasury.com",
        description:
            "Provides payment operations software to automate money movement, reconciliation, and ledger management.",
        founded: 2018,
        signalsCount: 31,
        lastEnriched: null,
        signals: []
    },
    {
        id: "comp-10",
        name: "Retool",
        industry: "SaaS / Developer Tools",
        stage: "Growth",
        location: "San Francisco, USA",
        website: "https://retool.com",
        description:
            "A low-code platform that allows developers to quickly build internal tools and business applications.",
        founded: 2017,
        signalsCount: 38,
        lastEnriched: null,
        signals: []
    },
    {
        id: "comp-11",
        name: "Snyk",
        industry: "Cybersecurity",
        stage: "Growth",
        location: "Boston, USA",
        website: "https://snyk.io",
        description:
            "A developer-first security platform that helps organizations find and fix vulnerabilities in code and containers.",
        founded: 2015,
        signalsCount: 45,
        lastEnriched: null,
        signals: []
    },
    {
        id: "comp-12",
        name: "Astranis",
        industry: "Space Tech / Robotics",
        stage: "Growth",
        location: "San Francisco, USA",
        website: "https://astranis.com",
        description:
            "Builds and operates small, low-cost geostationary satellites to provide high-speed internet access globally.",
        founded: 2015,
        signalsCount: 17,
        lastEnriched: null,
        signals: []
    },
    {
        id: "comp-15",
        name: "Checkr",
        industry: "SaaS / HR Tech",
        stage: "Growth",
        location: "San Francisco, USA",
        website: "https://checkr.com",
        description:
            "Provides an AI-powered platform for modern background checks and employee screening solutions.",
        founded: 2014,
        signalsCount: 36,
        lastEnriched: null,
        signals: []
    }
];

// Mock enrichment data for display without API
export function getEnrichmentData(companyId: string): EnrichmentResult | null {
    return null;
}

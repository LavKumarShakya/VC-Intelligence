import { Company, EnrichmentResult } from "@/types";

export const MOCK_COMPANIES: Company[] = [
    {
        id: "comp-1",
        name: "Aether Labs",
        industry: "Artificial Intelligence",
        stage: "Series A",
        location: "San Francisco, CA",
        website: "https://aetherlabs.ai",
        description:
            "AI-powered platform for automated code review and test generation, helping engineering teams reduce QA cycles.",
        founded: 2022,
        signalsCount: 6,
        lastEnriched: "2024-01-15T08:30:00Z",
        signals: [
            {
                id: "sig-1-1",
                date: "2024-01-10",
                type: "Funding",
                description: "Raised $12M Series A led by Accel."
            },
            {
                id: "sig-1-2",
                date: "2023-12-01",
                type: "Product Launch",
                description: "Released AI Test Agent v2 with CI/CD integrations."
            }
        ]
    },
    {
        id: "comp-2",
        name: "Nexus Health Systems",
        industry: "Healthcare Tech",
        stage: "Series B",
        location: "Boston, MA",
        website: "https://nexushealth.io",
        description:
            "Interoperability platform connecting hospital EHR systems to enable secure cross-provider patient data exchange.",
        founded: 2020,
        signalsCount: 9,
        lastEnriched: null,
        signals: [
            {
                id: "sig-2-1",
                date: "2023-11-20",
                type: "Enterprise Deal",
                description: "Signed multi-year agreement with a 12-hospital network."
            }
        ]
    },
    {
        id: "comp-3",
        name: "QuantumLedger",
        industry: "Fintech",
        stage: "Seed",
        location: "New York, NY",
        website: "https://quantumledger.io",
        description:
            "Post-quantum cryptography infrastructure for secure cross-border financial settlements.",
        founded: 2023,
        signalsCount: 4,
        lastEnriched: "2024-01-20T14:45:00Z",
        signals: [
            {
                id: "sig-3-1",
                date: "2024-01-05",
                type: "Funding",
                description: "Closed $4.2M Seed round led by early-stage fintech investors."
            }
        ]
    },
    {
        id: "comp-4",
        name: "EcoLogix",
        industry: "Climate Tech",
        stage: "Series C",
        location: "Austin, TX",
        website: "https://ecologix.com",
        description:
            "Supply chain emissions intelligence platform helping enterprises track Scope 3 carbon impact.",
        founded: 2018,
        signalsCount: 12,
        lastEnriched: "2024-01-05T09:15:00Z",
        signals: []
    },
    {
        id: "comp-5",
        name: "Synthetica Bio",
        industry: "Biotech",
        stage: "Series A",
        location: "San Diego, CA",
        website: "https://syntheticabio.com",
        description:
            "AI-driven protein engineering platform accelerating therapeutic discovery pipelines.",
        founded: 2021,
        signalsCount: 7,
        lastEnriched: null,
        signals: []
    },
    {
        id: "comp-6",
        name: "Vortex Data",
        industry: "Developer Tools",
        stage: "Seed",
        location: "Remote",
        website: "https://vortexdata.dev",
        description:
            "Streaming database optimized for real-time analytics workloads with sub-second query latency.",
        founded: 2023,
        signalsCount: 10,
        lastEnriched: "2024-01-22T11:20:00Z",
        signals: [
            {
                id: "sig-6-1",
                date: "2024-01-15",
                type: "Open Source Growth",
                description: "Reached 8,500 GitHub stars."
            }
        ]
    },
    {
        id: "comp-7",
        name: "Lumina Security",
        industry: "Cybersecurity",
        stage: "Series B",
        location: "Tel Aviv, Israel",
        website: "https://luminasecurity.io",
        description:
            "Cloud identity security platform preventing privilege escalation and over-permissioned access.",
        founded: 2019,
        signalsCount: 11,
        lastEnriched: "2023-12-30T16:00:00Z",
        signals: []
    },
    {
        id: "comp-8",
        name: "AeroStack",
        industry: "Aerospace",
        stage: "Series A",
        location: "Los Angeles, CA",
        website: "https://aerostack.space",
        description:
            "Modular operating software powering low-earth orbit satellite constellations.",
        founded: 2021,
        signalsCount: 5,
        lastEnriched: null,
        signals: []
    },
    {
        id: "comp-9",
        name: "FlowPay",
        industry: "Fintech",
        stage: "Growth",
        location: "London, UK",
        website: "https://flowpay.co",
        description:
            "Unified API for global payroll infrastructure and employer-of-record services.",
        founded: 2016,
        signalsCount: 22,
        lastEnriched: "2024-01-18T10:00:00Z",
        signals: [
            {
                id: "sig-9-1",
                date: "2023-12-12",
                type: "Expansion",
                description: "Expanded operations into Southeast Asia."
            }
        ]
    },
    {
        id: "comp-10",
        name: "RoboFarms",
        industry: "AgTech",
        stage: "Series A",
        location: "Denver, CO",
        website: "https://robofarms.ai",
        description:
            "Autonomous drone systems providing precision agriculture insights and crop health analytics.",
        founded: 2020,
        signalsCount: 6,
        lastEnriched: "2023-12-01T13:30:00Z",
        signals: []
    }

];

export const MOCK_ENRICHMENT_DATA: Record<string, EnrichmentResult> = {
    "comp-1": {
        companyId: "comp-1",
        summary: "Aether AI provides an advanced generative AI platform tailored for software teams, automating QA processes to significantly reduce time-to-market. Their agentic technology handles edge case testing and automated code fixes.",
        whatTheyDo: [
            "Automated test generation from natural language requirements",
            "Real-time bug detection and automated PR creation for fixes",
            "Integration with GitHub, GitLab, and CI/CD pipelines"
        ],
        keywords: ["Generative AI", "Developer Tools", "QA Automation", "LLM", "Agentic Frameworks"],
        derivedSignals: ["High Engineering Velocity", "Strong GitHub Adoption", "Recent Ex-Stripe Hire"],
        sources: [
            { url: "https://techcrunch.com/aether-ai-funding", timestamp: "2023-10-01" },
            { url: "https://linkedin.com/company/aether-ai", timestamp: "2023-10-23" }
        ],
        enrichedAt: new Date().toISOString()
    },
    "comp-3": {
        companyId: "comp-3",
        summary: "QuantumLedger is building a natively post-quantum secure blockchain network optimized for institutional finance and cross-border CBDC (Central Bank Digital Currency) settlements.",
        whatTheyDo: [
            "Lattice-based cryptography for ledger security",
            "High-throughput institutional settlement layer",
            "Compliance-first smart contracts for regulated assets"
        ],
        keywords: ["Post-Quantum", "Blockchain", "Fintech", "CBDC", "Cryptography"],
        derivedSignals: ["Top Tier VCs (a16z)", "Rapid Volume Growth", "Institutional traction"],
        sources: [
            { url: "https://coindesk.com/quantumledger-seed", timestamp: "2023-10-15" }
        ],
        enrichedAt: new Date().toISOString()
    }
};

export const getEnrichmentData = async (companyId: string): Promise<EnrichmentResult> => {
    // Simulate network delay for frontend UX
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            const data = MOCK_ENRICHMENT_DATA[companyId];
            if (data) {
                resolve(data);
            } else {
                // Generate dynamic mock data if not pre-defined
                const company = MOCK_COMPANIES.find(c => c.id === companyId);
                resolve({
                    companyId,
                    summary: `${company?.name || "The company"} provides enterprise software solutions within the ${company?.industry || "tech"} space, focusing on growth and scale.`,
                    whatTheyDo: [
                        "Enterprise software solution delivery",
                        "B2B SaaS platform capabilities",
                        "Market leading integrations"
                    ],
                    keywords: [company?.industry || "SaaS", "B2B", "Enterprise", "High Growth"],
                    derivedSignals: ["Growing Headcount", "New Product Launches"],
                    sources: [
                        { url: `https://linkedin.com/company/${companyId}`, timestamp: new Date().toISOString() }
                    ],
                    enrichedAt: new Date().toISOString()
                });
            }
        }, 1500); // 1.5s delay to show skeleton loaders
    });
};

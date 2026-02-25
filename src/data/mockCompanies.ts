import { Company, EnrichmentResult } from "@/types";

export const MOCK_COMPANIES: Company[] = [
    {
        id: "comp-1",
        name: "Aether AI",
        industry: "Artificial Intelligence",
        stage: "Series A",
        location: "San Francisco, CA",
        website: "https://aether-ai.example.com",
        description: "Generative AI platform for automated software testing and debugging, reducing QA cycles by 80%.",
        founded: 2022,
        signalsCount: 12,
        lastEnriched: "2023-10-15T08:30:00Z",
        signals: [
            { id: "sig-1-1", date: "2023-09-01", type: "Key Hire", description: "Hired former VP of Engineering from Stripe." },
            { id: "sig-1-2", date: "2023-10-10", type: "Product Launch", description: "Launched Aether 2.0 with agentic capabilities." }
        ]
    },
    {
        id: "comp-2",
        name: "Nexus Health",
        industry: "Healthcare Tech",
        stage: "Series B",
        location: "Boston, MA",
        website: "https://nexushealth.example.com",
        description: "Interoperability layer for hospital EHR systems, making patient data accessible securely across providers.",
        founded: 2020,
        signalsCount: 8,
        lastEnriched: null,
        signals: [
            { id: "sig-2-1", date: "2023-08-15", type: "Partnership", description: "Signed Mayo Clinic as enterprise customer." }
        ]
    },
    {
        id: "comp-3",
        name: "QuantumLedger",
        industry: "Fintech",
        stage: "Seed",
        location: "New York, NY",
        website: "https://quantumledger.example.com",
        description: "Post-quantum cryptographic ledger for institutional cross-border settlements.",
        founded: 2023,
        signalsCount: 24,
        lastEnriched: "2023-10-20T14:45:00Z",
        signals: [
            { id: "sig-3-1", date: "2023-10-15", type: "Funding", description: "Raised $4M Seed round led by a16z." },
            { id: "sig-3-2", date: "2023-10-18", type: "Traction", description: "Hit $100M in processed transaction volume." }
        ]
    },
    {
        id: "comp-4",
        name: "EcoLogix",
        industry: "Climate Tech",
        stage: "Series C",
        location: "Austin, TX",
        website: "https://ecologix.example.com",
        description: "Supply chain visibility platform tracking Scope 3 carbon emissions for physical goods.",
        founded: 2018,
        signalsCount: 5,
        lastEnriched: "2023-09-01T09:15:00Z",
        signals: []
    },
    {
        id: "comp-5",
        name: "Synthetica",
        industry: "Biotech",
        stage: "Series A",
        location: "San Diego, CA",
        website: "https://synthetica.example.com",
        description: "AI-driven discovery of novel protein structures for targeted therapeutics.",
        founded: 2021,
        signalsCount: 15,
        lastEnriched: null,
        signals: []
    },
    {
        id: "comp-6",
        name: "Vortex Data",
        industry: "Developer Tools",
        stage: "Seed",
        location: "Remote",
        website: "https://vortexdata.example.com",
        description: "Streaming database for real-time analytics with sub-millisecond latency on standard hardware.",
        founded: 2023,
        signalsCount: 32,
        lastEnriched: "2023-10-22T11:20:00Z",
        signals: [
            { id: "sig-6-1", date: "2023-10-20", type: "GitHub Traction", description: "Reached 10,000 GitHub stars." }
        ]
    },
    {
        id: "comp-7",
        name: "Lumina Security",
        industry: "Cybersecurity",
        stage: "Series B",
        location: "Tel Aviv, Israel",
        website: "https://lumina-sec.example.com",
        description: "Cloud identity entitlement management (CIEM) platform neutralizing over-privileged service accounts.",
        founded: 2019,
        signalsCount: 9,
        lastEnriched: "2023-08-30T16:00:00Z",
        signals: []
    },
    {
        id: "comp-8",
        name: "AeroStack",
        industry: "Aerospace",
        stage: "Series A",
        location: "Los Angeles, CA",
        website: "https://aerostack.example.com",
        description: "Modular operating system for low-earth orbit satellite constellations.",
        founded: 2021,
        signalsCount: 7,
        lastEnriched: null,
        signals: []
    },
    {
        id: "comp-9",
        name: "FlowPay",
        industry: "Fintech",
        stage: "Growth",
        location: "London, UK",
        website: "https://flowpay.example.com",
        description: "Unified API for global payroll and employer-of-record services.",
        founded: 2016,
        signalsCount: 45,
        lastEnriched: "2023-10-18T10:00:00Z",
        signals: [
            { id: "sig-9-1", date: "2023-09-25", type: "Expansion", description: "Opened operations in 15 new countries in APAC." }
        ]
    },
    {
        id: "comp-10",
        name: "RoboFarms",
        industry: "AgTech",
        stage: "Series A",
        location: "Denver, CO",
        website: "https://robofarms.example.com",
        description: "Autonomous drone fleets for ultra-precise crop spraying and yield analysis.",
        founded: 2020,
        signalsCount: 11,
        lastEnriched: "2023-07-12T13:30:00Z",
        signals: []
    },
    {
        id: "comp-11",
        name: "NeuroSync",
        industry: "Healthcare Tech",
        stage: "Seed",
        location: "San Francisco, CA",
        website: "https://neurosync.example.com",
        description: "Non-invasive brain-computer interfaces for remote patient monitoring of neurological conditions.",
        founded: 2023,
        signalsCount: 18,
        lastEnriched: null,
        signals: []
    },
    {
        id: "comp-12",
        name: "GridConnect",
        industry: "Climate Tech",
        stage: "Public",
        location: "Chicago, IL",
        website: "https://gridconnect.example.com",
        description: "Smart grid management software optimizing dispersed renewable energy assets.",
        founded: 2010,
        signalsCount: 88,
        lastEnriched: "2023-10-24T09:45:00Z",
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

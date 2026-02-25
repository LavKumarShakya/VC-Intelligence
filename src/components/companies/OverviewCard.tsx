import { Company } from "@/types";
import { MapPin, Calendar, Briefcase, Activity } from "lucide-react";

export function OverviewCard({ company }: { company: Company }) {
    const details = [
        { icon: MapPin, label: "Location", value: company.location },
        { icon: Calendar, label: "Founded", value: company.founded },
        { icon: Briefcase, label: "Stage", value: company.stage },
        { icon: Activity, label: "Signals", value: company.signalsCount },
    ];

    return (
        <div className="bg-surface rounded-xl border border-border shadow-card p-6">
            <h2 className="text-lg font-semibold text-text-main mb-4 tracking-tight">Company Overview</h2>

            <p className="text-text-muted text-sm leading-relaxed mb-6">
                {company.description}
            </p>

            <div className="grid grid-cols-2 gap-y-4 gap-x-6">
                {details.map((detail, idx) => (
                    <div key={idx} className="flex flex-col gap-1">
                        <span className="flex items-center gap-1.5 text-xs font-medium text-text-muted/80 uppercase tracking-widest">
                            <detail.icon className="w-3.5 h-3.5" />
                            {detail.label}
                        </span>
                        <span className="text-sm font-medium text-text-main">
                            {detail.value}
                        </span>
                    </div>
                ))}
            </div>
        </div>
    );
}

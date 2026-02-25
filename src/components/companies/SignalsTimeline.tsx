import { Signal } from "@/types";
import { formatDate } from "@/lib/utils";
import { Circle, Activity } from "lucide-react";

export function SignalsTimeline({ signals }: { signals: Signal[] }) {
    if (signals.length === 0) {
        return (
            <div className="bg-surface rounded-xl border border-border shadow-card p-6 h-full">
                <h2 className="text-lg font-semibold text-text-main mb-6 tracking-tight flex items-center gap-2">
                    <Activity className="w-5 h-5 text-primary" />
                    Signals Timeline
                </h2>
                <div className="text-center py-8 text-text-muted text-sm">
                    No recent signals detected for this company.
                </div>
            </div>
        );
    }

    // Sort signals newest first
    const sortedSignals = [...signals].sort((a, b) =>
        new Date(b.date).getTime() - new Date(a.date).getTime()
    );

    return (
        <div className="bg-surface rounded-xl border border-border shadow-card p-6 h-full">
            <h2 className="text-lg font-semibold text-text-main mb-6 tracking-tight flex items-center gap-2">
                <Activity className="w-5 h-5 text-primary" />
                Signals Timeline
            </h2>

            <div className="relative border-l-2 border-border ml-3 space-y-8 py-2">
                {sortedSignals.map((signal, index) => (
                    <div key={signal.id} className="relative pl-6">
                        <div className="absolute w-3 h-3 bg-primary rounded-full -left-[7px] top-1.5 ring-4 ring-surface" />
                        <div className="flex flex-col gap-1">
                            <div className="flex items-center gap-2">
                                <span className="text-sm font-semibold text-text-main">{signal.type}</span>
                                <span className="text-xs text-text-muted px-2 py-0.5 bg-background rounded-full">
                                    {formatDate(signal.date)}
                                </span>
                            </div>
                            <p className="text-sm text-text-muted mt-1 leading-relaxed">
                                {signal.description}
                            </p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

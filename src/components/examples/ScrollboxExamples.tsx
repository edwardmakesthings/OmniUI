import { ScrollBox } from "@/components/ui";

export const ScrollBoxExamples = () => {
    const items = Array.from({ length: 20 }, (_, i) => `Item ${i + 1}`);

    return (
        <div className="space-y-6">
            {/* Unstyled ScrollBox */}
            <ScrollBox maxHeight={300}>
                <div className="divide-y divide-accent-dark-neutral">
                    {items.map((item) => (
                        <div
                            key={item}
                            className="text-font-dark hover:bg-bg-dark-lighter transition-colors"
                        >
                            {item}
                        </div>
                    ))}
                </div>
            </ScrollBox>

            {/* Basic ScrollBox */}
            <ScrollBox
                maxHeight={300}
                className="bg-bg-dark border border-accent-dark-neutral rounded-md"
            >
                <div className="divide-y divide-accent-dark-neutral">
                    {items.map((item) => (
                        <div
                            key={item}
                            className="p-3 text-font-dark hover:bg-bg-dark-lighter transition-colors"
                        >
                            {item}
                        </div>
                    ))}
                </div>
            </ScrollBox>

            {/* Inset ScrollBox with Cards */}
            <ScrollBox
                variant="inset"
                maxHeight={400}
                className="bg-bg-dark-darker rounded-md border border-accent-dark-neutral"
            >
                <div className="p-4 space-y-3">
                    {items.map((item) => (
                        <div
                            key={item}
                            className="bg-bg-dark p-4 rounded-md border border-accent-dark-neutral
                         hover:border-accent-dark-bright transition-colors"
                        >
                            <h3 className="text-font-dark font-medium">
                                {item}
                            </h3>
                            <p className="text-font-dark-muted mt-1">
                                Description for {item.toLowerCase()}
                            </p>
                        </div>
                    ))}
                </div>
            </ScrollBox>
        </div>
    );
};

export default ScrollBoxExamples;

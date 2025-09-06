interface OSGuideProps {
  osName: string;
  steps: string[];
}

export default function OSGuide({ osName, steps }: OSGuideProps) {
  return (
    <div className="dark:text-donutool-text space-y-1 pb-3 text-[11px] font-semibold text-neutral-600 transition duration-300 select-none">
      <span>{osName}</span>
      {steps.map((step, index) => (
        <div className="flex" key={index}>
          <span className="flex-shrink-0 text-right">{index + 1}.</span>
          <span className="pl-2 whitespace-pre-line">{step}</span>
        </div>
      ))}
    </div>
  );
}
